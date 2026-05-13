"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Box,
  Stack,
  TextField,
  IconButton,
  Avatar,
  Typography,
  Paper,
  Badge,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axiosInstance from "@/lib/axios";
import { useSocket } from "@/providers/SocketProvider";
import { useAppDispatch } from "@/lib/hooks";

const Chat = () => {
  const params = useParams();
  const userId = params.id as string;
  const [message, setMessage] = useState("");
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentRoomRef = useRef<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);
  const { socket } = useSocket();
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const { onlineUsers } = useSelector((state: any) => state.user);

  useEffect(() => {
    setMessages([]);
    setLoading(true);
    setError(null);
    conversationIdRef.current = null;

    const fetchData = async () => {
      try {
        const userRes = await axiosInstance.get("/users");

        const foundUser = userRes.data.data.find((u: any) => u._id === userId);
        if (!foundUser) {
          setError("User not found. Please check the user ID.");
          setOtherUser(null);
          setLoading(false);
          return;
        }

        setOtherUser(foundUser);
        setLoading(false);

        try {
          const convRes = await axiosInstance.get(`/conversation/${userId}`);
          const conv = convRes.data.data;

          if (conv?.messages) {
            setMessages(conv.messages);
            conversationIdRef.current = conv._id;

            const unseenMessages = conv.messages.filter(
              (msg: any) => msg.msgByUserId !== user._id && !msg.seen,
            );
            if (unseenMessages.length > 0 && socket) {
              unseenMessages.forEach((msg: any) => {
                socket.emit("seen", msg._id);
              });
            }
          }
        } catch (convErr: any) {
          // If conversation not found (404), it's okay - user can start a new conversation
          if (convErr.response?.status === 404) {
            console.log("No existing conversation - user can start a new one");
            setMessages([]);
          } else {
            console.error("Error fetching conversation:", convErr);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        if ((err as any).response?.status === 400) {
          setError("User not found. Please check the user ID.");
          setOtherUser(null);
        } else if ((err as any).response?.status === 401) {
          setError("You are not authorized to view this conversation.");
        } else {
          setError("Failed to load user data. Please try again.");
        }
        setLoading(false);
      }
    };

    fetchData();

    if (socket && user) {
      const roomName = `chat-${user._id}-${userId}`;

      socket.emit("message-page", {
        userId: user._id,
        conversationUserId: userId,
        leaveRoom: currentRoomRef.current,
      });

      currentRoomRef.current = roomName;

      const handleMessage = (data: any) => {
        if (data.conversationId === conversationIdRef.current) {
          setMessages(data.messages);

          const unseenMessages = data.messages.filter(
            (msg: any) => msg.msgByUserId !== user._id && !msg.seen,
          );
          unseenMessages.forEach((msg: any) => {
            socket.emit("seen", msg._id);
          });
        } else if (conversationIdRef.current === null) {
          conversationIdRef.current = data.conversationId;
          setMessages(data.messages);
        }
      };

      const handleConversationUpdate = (conversations: any[]) => {
        // Check if the current conversation was updated
        const updated = conversations.find(
          (c: any) => c._id === conversationIdRef.current,
        );
        if (updated) {
          // Refetch messages to get the latest
          axiosInstance
            .get(`/conversation/${userId}`)
            .then((res) => {
              if (res.data.data?.messages) {
                setMessages(res.data.data.messages);
              }
            })
            .catch((err) => console.error("Error refreshing:", err));
        }
      };

      socket.on("message", handleMessage);
      socket.on("conversation", handleConversationUpdate);

      return () => {
        socket.off("message", handleMessage);
        socket.off("conversation", handleConversationUpdate);
      };
    }
  }, [userId, socket, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!message.trim() || !socket) return;

    socket.emit("new-message", {
      sender: user._id,
      receiver: userId,
      text: message,
    });

    setMessage("");
  };

  const isOnline = onlineUsers.includes(userId);

  // Show error state
  if (error) {
    return (
      <Stack
        sx={{
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h6"
          color="error"
          sx={{ mb: 2, textAlign: "center" }}
        >
          {error}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          Please go back and select a valid user.
        </Typography>
      </Stack>
    );
  }

  if (loading) {
    return (
      <Stack sx={{ height: "100vh", width: "100%" }}>
        <Paper
          elevation={2}
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderRadius: 0,
          }}
        >
          {otherUser ? (
            <>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                invisible={!onlineUsers.includes(userId)}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#44b700",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    border: "2px solid #fff",
                  },
                }}
              >
                <Avatar src={otherUser?.profilePic} alt={otherUser?.name} />
              </Badge>
              <Box>
                <Typography variant="h6">{otherUser?.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Loading messages...
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Avatar sx={{ bgcolor: "grey.300" }} />
              <Box>
                <Typography variant="h6">Loading...</Typography>
                <Typography variant="caption" color="text.secondary">
                  Please wait
                </Typography>
              </Box>
            </>
          )}
        </Paper>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: 2,
            backgroundColor: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary">
            {otherUser ? "Loading messages..." : "Loading chat..."}
          </Typography>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 2,
            display: "flex",
            gap: 1,
            borderRadius: 0,
          }}
        >
          <TextField
            fullWidth
            placeholder="Loading..."
            value=""
            disabled
            size="small"
          />
          <IconButton disabled>
            <SendIcon />
          </IconButton>
        </Paper>
      </Stack>
    );
  }

  return (
    <Stack sx={{ height: "100%", width: "100%" }}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderRadius: 0,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
          invisible={!isOnline}
          sx={{
            "& .MuiBadge-badge": {
              backgroundColor: "#44b700",
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: "2px solid #fff",
            },
          }}
        >
          <Avatar src={otherUser?.profilePic} alt={otherUser?.name} />
        </Badge>
        <Box>
          <Typography variant="h6">{otherUser?.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {isOnline ? "Online" : "Offline"}
          </Typography>
        </Box>
      </Paper>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          p: 2,
          backgroundColor: "#f8f9fa",
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No messages yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Start the conversation by sending a message
            </Typography>
          </Box>
        ) : (
          messages.map((msg: any, idx: number) => {
            const isSender = msg.msgByUserId === user._id;
            return (
              <Box
                key={msg._id || idx}
                sx={{
                  display: "flex",
                  justifyContent: isSender ? "flex-end" : "flex-start",
                  mb: 1.5,
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    maxWidth: { xs: "75%", sm: "65%" },
                    backgroundColor: isSender ? "#1976d2" : "#fff",
                    color: isSender ? "#fff" : "#000",
                    borderRadius: isSender
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  <Typography variant="body1">{msg.text}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 0.5,
                      opacity: 0.7,
                      fontSize: "0.7rem",
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Paper>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          display: "flex",
          gap: 1,
          borderRadius: 0,
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fff",
        }}
      >
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={message || ""}
          onChange={(e) => setMessage(e.target.value || "")}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          size="small"
          disabled={loading}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "24px",
              backgroundColor: "#f8f9fa",
            },
          }}
        />
        <IconButton
          color="primary"
          onClick={handleSend}
          sx={{
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Stack>
  );
};

export default Chat;
