"use client";
import AuthGuard from "@/components/auth/AuthGuard";
import Sidebar from "@/components/main/sidebar";
import ServerStatus from "@/components/debug/ServerStatus";
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  IconButton,
} from "@mui/material";
import { SocketProvider } from "@/providers/SocketProvider";
import ChatIcon from "@mui/icons-material/Chat";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import axios from "axios";
import { logout } from "@/redux/slices/authSlice";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const getNavValue = () => {
    if (pathname.includes("/add-user")) return 1;
    if (pathname.includes("/settings")) return 2;
    return 0;
  };

  const handleLogout = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      withCredentials: true,
    });
    dispatch(logout());
    router.push("/login");
  };

  return (
    <AuthGuard>
      <SocketProvider>
        <ServerStatus />
        <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
          {/* Desktop Sidebar - Only visible on desktop */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              width: "250px",
              flexShrink: 0,
            }}
          >
            <Sidebar />
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              pb: { xs: "56px", md: 0 },
            }}
          >
            {/* Mobile Header */}
            {/* <Paper
              elevation={2}
              sx={{
                display: { xs: "flex", md: "none" },
                p: 2,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 0,
              }}
            >
              <Box sx={{ fontWeight: 600, fontSize: "1.1rem", color: "#1976d2" }}>Chatify</Box>
            </Paper> */}

            {/* Content Area */}
            <Box sx={{ flexGrow: 1, overflow: "hidden" }}>{children}</Box>
          </Box>
        </Box>

        {/* Mobile Bottom Navigation */}
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            display: { xs: "flex", md: "none" },
            zIndex: 1000,
            alignItems: "center",
            borderTop: "1px solid #e0e0e0",
          }}
          elevation={3}
        >
          <BottomNavigation
            value={getNavValue()}
            onChange={(event, newValue) => {
              if (newValue === 0) router.push("/main");
              if (newValue === 1) router.push("/main/add-user");
              if (newValue === 2) router.push("/main/settings");
            }}
            showLabels
            sx={{ flexGrow: 1 }}
          >
            <BottomNavigationAction label="Chats" icon={<ChatIcon />} />
            <BottomNavigationAction label="Add User" icon={<PersonAddIcon />} />
            <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
          </BottomNavigation>
          <IconButton
            onClick={handleLogout}
            sx={{
              color: "#d32f2f",
              mx: 1,
              flexShrink: 0,
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Paper>
      </SocketProvider>
    </AuthGuard>
  );
};

export default MainLayout;
