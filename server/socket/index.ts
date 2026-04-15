import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import GetUserDetailsFromToken from "../helpers/getUserDetailsFromToken";

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
  console.log("[Step 4] Emitting online users:", Array.from(onlineUsers));

  // Emit to all clients including the newly connected one
  io.emit("onlineUsers", Array.from(onlineUsers));

  socket.on("disconnect", () => {
    console.log("[Step 5] User disconnected, socket id:", socket.id);
    const userId = (socket as any).user?._id;
    if (userId) {
      onlineUsers.delete(userId);
      console.log("[Step 5] Updated online users:", Array.from(onlineUsers));
      io.emit("onlineUsers", Array.from(onlineUsers));
    }
  });
});

export { app, server, onlineUsers };
