"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useAppDispatch } from "@/lib/hooks";
import { setConversations } from "@/redux/slices/messageSlice";
import { useSocket } from "@/providers/SocketProvider";

const ChatList = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { socket } = useSocket();
  const { user } = useSelector((state: any) => state.auth);
  const { conversations } = useSelector((state: any) => state.message);
  const { onlineUsers } = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/conversations`,
        { withCredentials: true },
      );
      dispatch(setConversations(response.data.data || []));
    } catch (err: any) {
      console.error("[ChatList] Error fetching conversations:", err?.message);
      // Handle different error cases
      if (err.response?.status === 400) {
        console.error("Invalid user ID");
      } else if (err.response?.status === 401) {
        console.error("Unauthorized - redirecting to login");
      }
      // Set empty conversations on error
      dispatch(setConversations([]));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchConversations();
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    const handleMessageUpdate = () => fetchConversations();
    socket.on("message", handleMessageUpdate);
    return () => {
      socket.off("message", handleMessageUpdate);
    };
  }, [socket, user?._id]);

  const getOtherUser = (conv: any) => {
    return conv.sender._id === user._id ? conv.receiver : conv.sender;
  };

  if (loading && conversations.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <List sx={{ overflowY: "auto", p: 1 }}>
      {conversations.map((conv: any) => {
        const otherUser = getOtherUser(conv);
        const lastMessage = conv.messages[0];
        const isActive = pathname === `/main/${otherUser._id}`;
        const isOnline = onlineUsers.includes(otherUser._id);

        return (
          <ListItem
            key={conv._id}
            onClick={() => router.push(`/main/${otherUser._id}`)}
            sx={{
              cursor: "pointer",
              borderRadius: "12px",
              mb: 0.5,
              backgroundColor: isActive ? "#e3f2fd" : "transparent",
              "&:hover": { backgroundColor: isActive ? "#e3f2fd" : "#f5f5f5" },
              transition: "all 0.2s",
            }}
          >
            <ListItemAvatar>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                invisible={!isOnline}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#44b700",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    border: "2px solid #fff",
                  },
                }}
              >
                <Avatar src={otherUser.profilePic} alt={otherUser.name} />
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    {otherUser.name}
                  </Typography>
                  {conv.unseenCount > 0 && !isActive && (
                    <Badge
                      badgeContent={conv.unseenCount}
                      color="error"
                      sx={{
                        "& .MuiBadge-badge": {
                          fontSize: "0.65rem",
                          height: 18,
                          minWidth: 18,
                        },
                      }}
                    />
                  )}
                </Box>
              }
              secondary={
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "block",
                    fontWeight: conv.unseenCount > 0 && !isActive ? 600 : 400,
                  }}
                >
                  {lastMessage?.text || "No messages yet"}
                </Typography>
              }
            />
          </ListItem>
        );
      })}
      {conversations.length === 0 && !loading && (
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            No conversations yet
          </Typography>
        </Box>
      )}
    </List>
  );
};

export default ChatList;
