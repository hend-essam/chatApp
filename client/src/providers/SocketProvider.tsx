"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";
import { useAppDispatch } from "@/lib/hooks";
import { setOnlineUsers } from "@/redux/slices/userSlice";
import { setConversations } from "@/redux/slices/messageSlice";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token } = useSelector((state: any) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) {
      console.log("[Socket] No token, skipping connection");
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_API_URL!.replace("/api", "");
    console.log("[Socket] Connecting to", socketUrl);

    const socketConnection = io(socketUrl, {
      auth: { token },
      withCredentials: true,
    });

    socketConnection.on("connect", () => {
      console.log("[Socket] Connected, id:", socketConnection.id);
      setIsConnected(true);
    });

    socketConnection.on("onlineUsers", (users) => {
      console.log("[Socket] Received online users:", users);
      dispatch(setOnlineUsers(users));
    });

    socketConnection.on("conversation", (conversations) => {
      dispatch(setConversations(conversations));
    });

    socketConnection.on("connect_error", (err) => {
      console.error("[Socket] Connection failed:", err.message);
      setIsConnected(false);
    });

    socketConnection.on("disconnect", () => {
      console.log("[Socket] Disconnected");
      setIsConnected(false);
    });

    setSocket(socketConnection);

    return () => {
      console.log("[Socket] Cleaning up connection");
      socketConnection.disconnect();
    };
  }, [token, dispatch]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}
