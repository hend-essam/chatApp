"use client";

import {
  Button,
  Stack,
  Typography,
  Avatar,
  Badge,
  IconButton,
  Tooltip,
  Box,
  Divider,
} from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { logout } from "@/redux/slices/authSlice";
import { setConversations } from "@/redux/slices/messageSlice";
import ChatList from "./ChatList";
import { useSocket } from "@/providers/SocketProvider";

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { socket, isConnected } = useSocket();
  const { user } = useSelector((state: any) => state.auth);
  const { onlineUsers } = useSelector((state: any) => state.user);
  const { conversations } = useSelector((state: any) => state.message);

  const handleLogout = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      withCredentials: true,
    });
    dispatch(logout());
    router.push("/login");
  };

  const handleRefresh = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/conversations`,
        { withCredentials: true },
      );
      dispatch(setConversations(data.data || []));
    } catch (err: any) {
      console.error("[Sidebar] Error refreshing:", err?.message);
    }
  };

  return (
    <Stack
      sx={{
        height: "100vh",
        maxWidth: "100%",
        minWidth: 0,
        backgroundColor: "#fff",
        borderRight: "1px solid #e0e0e0",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: "21px",
          borderBottom: "1px solid #e0e0e0",
          flexShrink: 0,
          minWidth: 0,
        }}
      >
        {/* <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 2 }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#1976d2", whiteSpace: "nowrap" }}
          >
            Messages
          </Typography>
          {onClose && (
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          )}
        </Stack> */}

        {user && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ minWidth: 0, width: "100%" }}
          >
            <Link
              href="/main/settings"
              style={{ textDecoration: "none", flexShrink: 0 }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                invisible={!onlineUsers.includes(user._id)}
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
                <Avatar
                  src={user.profilePic}
                  alt="avatar"
                  sx={{ width: 40, height: 40 }}
                />
              </Badge>
            </Link>
            <Box sx={{ flexGrow: 1, minWidth: 0, overflow: "hidden" }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "100%",
                  display: "block",
                }}
              >
                {user.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ whiteSpace: "nowrap" }}
              >
                {isConnected ? "Online" : "Offline"}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
              <IconButton
                size="small"
                onClick={() => router.push("/main/add-user")}
                sx={{ color: "#1976d2" }}
              >
                <PersonAddIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleRefresh}
                sx={{ color: isConnected ? "#44b700" : "#d32f2f" }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
              {onClose && (
                <IconButton onClick={onClose} size="small">
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          </Stack>
        )}
      </Box>

      {/* Chat List */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          overflowX: "hidden",
          minWidth: 0,
        }}
      >
        <ChatList />
      </Box>

      {/* Footer */}
      <Box sx={{ p: "18px", borderTop: "1px solid #e0e0e0", flexShrink: 0 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ textTransform: "none" }}
        >
          Logout
        </Button>
      </Box>
    </Stack>
  );
};

export default Sidebar;
