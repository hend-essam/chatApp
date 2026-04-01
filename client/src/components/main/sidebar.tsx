"use client";

import { Button, Stack, Typography, IconButton, Avatar } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import ChatIcon from "@mui/icons-material/ChatBubbleOutline";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useSelector((state: any) => state.auth);

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
            <Avatar
              src={user.profilePic}
              alt="avatar"
              sx={{
                width: "40px",
                height: "40px",
                border: "2px solid #fff",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.1)", // ظل خفيف للـ Avatar
              }}
            />
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
            fontSize="small"
            sx={{
              color: "#333",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": { color: "primary.main" },
            }}
          />
        </Stack>
      )}

      <Stack spacing={2} flexGrow={1} sx={{ overflowY: "auto" }}>
        <Link href="/main/chat" style={{ textDecoration: "none" }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              padding: "12px 20px",
              borderRadius: "20px",
              transition: "all 0.2s",
              backgroundColor:
                pathname === "/main/chat"
                  ? "rgba(0, 0, 0, 0.05)"
                  : "transparent",
              color:
                pathname === "/main/chat" ? "primary.main" : "text.secondary",
              "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.03)" },
            }}
          >
            <ChatIcon fontSize="small" />
            <Typography
              variant="h6"
              sx={{ fontWeight: "500", fontSize: "1.1rem" }}
            >
              All Chats
            </Typography>
          </Stack>
        </Link>

        {/* <ChatList /> */}
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pt: 2, borderTop: "1px solid rgba(0,0,0,0.05)" }}
      >
        <Button
          variant="text"
          startIcon={<LogoutIcon />}
          sx={{
            color: "#d32f2f",
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "12px",
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
