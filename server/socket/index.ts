import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import GetUserDetailsFromToken from "../helpers/getUserDetailsFromToken";
import { ConversationSchema, MessageSchema } from "../models/ConversationModel";
import UserModel from "../models/UserModel";

dotenv.config();

const app = express();
const server = http.createServer(app);
const onlineUsers = new Set<string>();

console.log(
  "[INIT] Setting up Socket.IO with FRONTEND_URL:",
  process.env.FRONTEND_URL,
);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
});

io.use(async (socket, next) => {
  console.log("[Step 1] New socket connection attempt, id:", socket.id);

  const token = socket.handshake.auth?.token as string;

  if (!token) {
    console.log("[Step 2] No token provided, rejecting", socket.id);
    return next(new Error("No token provided"));
  }

  console.log("[Step 2] Token received, verifying...");

  try {
    const user = await GetUserDetailsFromToken(token);
    console.log("[Step 3] Token verified, user:", (user as any)?._id);
    (socket as any).user = user;

    socket.join((user as any)?._id);
    onlineUsers.add((user as any)?._id);

    io.emit("onlineUsers", Array.from(onlineUsers));

    next();
  } catch (err) {
    console.log(
      "[Step 3] Invalid/expired token, rejecting",
      socket.id,
      (err as Error).message,
    );
    next(new Error("Invalid or expired token"));
  }
});

io.on("connection", (socket) => {
  console.log("[Step 4] Socket fully connected, id:", socket.id);
  const userId = (socket as any).user?._id;
  console.log("[Step 4] User ID:", userId);
  console.log("[Step 4] User joined room:", userId);
  console.log("[Step 4] Emitting online users:", Array.from(onlineUsers));

  // Ensure user is in their own room
  if (userId) {
    socket.join(userId);
    console.log("[Step 4] Confirmed user in room:", userId, "- Room size:", io.sockets.adapter.rooms.get(userId)?.size || 0);
  }

  io.emit("onlineUsers", Array.from(onlineUsers));

  // Test connection
  socket.on("test-connection", (data) => {
    console.log("[Test] Connection test from user:", data.userId);
    socket.emit("test-response", { 
      message: "Connection working", 
      userId: data.userId,
      socketId: socket.id,
      roomSize: io.sockets.adapter.rooms.get(data.userId)?.size || 0
    });
  });

  // Join message page
  socket.on("message-page", async (data) => {
    console.log("[Message] User joined message page:", data);
    const { userId, conversationUserId, leaveRoom } = data;
    
    // Leave previous room if specified
    if (leaveRoom) {
      socket.leave(leaveRoom);
      console.log("[Message] User left room:", leaveRoom);
    }
    
    const roomName = `chat-${userId}-${conversationUserId}`;
    socket.join(roomName);
    console.log("[Message] User joined room:", roomName);
  });

  // Send new message
  socket.on("new-message", async (data) => {
    try {
      const { sender, receiver, text, imageUrl, videoUrl } = data;

      let conversation = await ConversationSchema.findOne({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      });

      if (!conversation) {
        conversation = await ConversationSchema.create({
          sender,
          receiver,
          messages: [],
        });
      }

      const message = await MessageSchema.create({
        text: text || "",
        imageUrl: imageUrl || "",
        videoUrl: videoUrl || "",
        seen: false,
        msgByUserId: sender,
      });

      await ConversationSchema.updateOne(
        { _id: conversation._id },
        { $push: { messages: message._id } }
      );

      const conversationData = await ConversationSchema.findById(conversation._id)
        .populate({
          path: "messages",
          options: { sort: { createdAt: 1 } },
        })
        .populate("sender", "name email profilePic")
        .populate("receiver", "name email profilePic");

      // Emit to specific conversation rooms
      io.to(`chat-${sender}-${receiver}`).emit("message", {
        conversationId: conversation._id.toString(),
        messages: conversationData?.messages || [],
      });
      io.to(`chat-${receiver}-${sender}`).emit("message", {
        conversationId: conversation._id.toString(),
        messages: conversationData?.messages || [],
      });

      // Send conversation update to both users
      const buildConvList = async (uid: string) => {
        const convs = await ConversationSchema.find({
          $or: [{ sender: uid }, { receiver: uid }],
        })
          .populate("sender", "name email profilePic")
          .populate("receiver", "name email profilePic")
          .populate("messages")
          .sort({ updatedAt: -1 });

        return convs.map((conv: any) => {
          const msgs = conv.messages || [];
          const lastMessage = [...msgs].sort(
            (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];
          const unseenCount = msgs.filter(
            (msg: any) => msg.msgByUserId?.toString() !== uid && !msg.seen
          ).length;
          return { ...conv.toObject(), messages: lastMessage ? [lastMessage] : [], unseenCount };
        });
      };

      const [senderConvWithCount, receiverConvWithCount] = await Promise.all([
        buildConvList(sender),
        buildConvList(receiver),
      ]);

      io.to(sender).emit("conversation", senderConvWithCount);
      io.to(receiver).emit("conversation", receiverConvWithCount);
    } catch (err) {
      console.error("[Message] Error sending message:", err);
    }
  });

  socket.on("seen", async (msgId) => {
    try {
      await MessageSchema.findByIdAndUpdate(msgId, { seen: true });
      const userId = (socket as any).user?._id?.toString();
      if (!userId) return;

      const convs = await ConversationSchema.find({
        $or: [{ sender: userId }, { receiver: userId }],
      })
        .populate("sender", "name email profilePic")
        .populate("receiver", "name email profilePic")
        .populate("messages")
        .sort({ updatedAt: -1 });

      const conversationsWithCount = convs.map((conv: any) => {
        const msgs = conv.messages || [];
        const lastMessage = [...msgs].sort(
          (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        const unseenCount = msgs.filter(
          (msg: any) => msg.msgByUserId?.toString() !== userId && !msg.seen
        ).length;
        return { ...conv.toObject(), messages: lastMessage ? [lastMessage] : [], unseenCount };
      });

      io.to(userId).emit("conversation", conversationsWithCount);
    } catch (err) {
      console.error("[Message] Error marking as seen:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("[Step 5] User disconnected, socket id:", socket.id);
    const userId = (socket as any).user?._id;
    if (userId) {
      onlineUsers.delete(userId);
      console.log("[Step 5] Updated online users:", Array.from(onlineUsers));
      io.emit("onlineUsers", Array.from(onlineUsers));
    }
    // Leave all rooms
    socket.rooms.forEach(room => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
  });
});

export { app, server, onlineUsers };
