import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import GetUserDetailsFromToken from "../helpers/getUserDetailsFromToken";

dotenv.config();

const app = express();
const server = http.createServer(app);

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

  socket.on("disconnect", () => {
    console.log("[Step 5] User disconnected, socket id:", socket.id);
  });
});

export { app, server };
