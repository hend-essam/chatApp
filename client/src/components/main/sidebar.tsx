"use client";

import {
  Button,
  Stack,
  Typography,
  Avatar,
  Badge,
  IconButton,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import ChatIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { logout } from "@/redux/slices/authSlice";
import { setConversations } from "@/redux/slices/messageSlice";
import ChatList from "./ChatList";
import { useSocket } from "@/providers/SocketProvider";

const Sidebar = () => {
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
        maxHeight: "100vh",
        padding: "32px 24px",
        borderTopRightRadius: "50px",
        borderBottomRightRadius: "50px",
        backgroundColor: "#F5F5DC",
        boxShadow: "2px 0px 10px rgba(0,0,0,0.05)",
      }}
    >
      {user && (
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Link href="/main/settings" style={{ textDecoration: "none" }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
              invisible={!onlineUsers.includes(user._id)}
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
              <Avatar
                src={user.profilePic}
                alt="avatar"
                sx={{
                  width: "40px",
                  height: "40px",
                  border: "2px solid #fff",
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                }}
              />
            </Badge>
          </Link>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: "#333",
              letterSpacing: "0.5px",
              textTransform: "capitalize",
            }}
          >
            {user.name}
          </Typography>
          <PersonAddIcon
            onClick={() => router.push("/main/add-user")}
            fontSize="small"
            sx={{
              color: "#333",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": { color: "#b89f6a" },
            }}
          />
          <Tooltip
            title={`Socket: ${isConnected ? "Connected" : "Disconnected"} | Conversations: ${conversations.length}`}
          >
            <IconButton
              onClick={handleRefresh}
              size="small"
              sx={{
                color: isConnected ? "#44b700" : "#d32f2f",
                transition: "all 0.2s",
                "&:hover": { transform: "rotate(180deg)" },
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      )}

      <Stack spacing={2} flexGrow={1} sx={{ overflowY: "auto" }}>
        <ChatList />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}
      >
        <Button
          variant="text"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            color: "#d32f2f",
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "12px",
            width: "100%",
            "&:hover": { backgroundColor: "rgba(211, 47, 47, 0.05)" },
          }}
        >
          Logout
        </Button>

        {/* <Link href="/main/settings">
          <IconButton
            sx={{
              color:
                pathname === "/main/settings"
                  ? "primary.main"
                  : "text.secondary",
              backgroundColor:
                pathname === "/main/settings"
                  ? "rgba(0, 0, 0, 0.05)"
                  : "transparent",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.03)" },
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Link> */}
      </Stack>
    </Stack>
  );
};

export default Sidebar;
