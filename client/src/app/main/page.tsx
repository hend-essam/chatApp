"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Stack, Typography } from "@mui/material";
import io from "socket.io-client";
import { useAppDispatch } from "@/lib/hooks";
import { setOnlineUsers } from "@/redux/slices/userSlice";

const DashboardPage = () => {
  const { user, token } = useSelector((state: any) => state.auth);
  const { onlineUsers } = useSelector((state: any) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!token) {
      console.log("[Step 1] No token yet, skipping socket connection");
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_API_URL!.replace("/api", "");
    console.log("[Step 1] Initiating socket connection to", socketUrl);
    console.log("[Step 2] Attaching token from Redux state to socket auth");

    const socketConnection = io(socketUrl, {
      auth: { token },
      withCredentials: true,
    });

    socketConnection.on("onlineUsers", (users) => {
      console.log("[Step 4] Received online users array:", users);
      console.log("[Step 4] Number of online users:", users.length);
      dispatch(setOnlineUsers(users));
    });

    socketConnection.on("connect", () => {
      console.log(
        "[Step 3] Socket connected successfully, id:",
        socketConnection.id,
      );
    });

    socketConnection.on("connect_error", (err) => {
      console.error(
        "[Step 3] Socket connection failed:",
        err.message,
        (err as any).data,
      );
    });

    return () => {
      console.log("[Step 4] Disconnecting socket");
      socketConnection.disconnect();
    };
  }, [token]);

  return (
    <Stack direction="row" sx={{ height: "100vh", width: "90%", m: "auto" }}>
      <Typography variant="h4" sx={{ color: "#686666", m: "auto" }}>
        Welcome, {user?.name}!<br /> Please select a chat.
        <br />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Online users: {onlineUsers.length}
        </Typography>
      </Typography>
    </Stack>
  );
};

export default DashboardPage;
