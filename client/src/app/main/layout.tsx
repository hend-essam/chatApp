"use client";
import AuthGuard from "@/components/auth/AuthGuard";
import Sidebar from "@/components/main/sidebar";
import ServerStatus from "@/components/debug/ServerStatus";
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Drawer,
  IconButton,
} from "@mui/material";
import { SocketProvider } from "@/providers/SocketProvider";
import { useState } from "react";
import ChatIcon from "@mui/icons-material/Chat";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter, usePathname } from "next/navigation";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const getNavValue = () => {
    if (pathname.includes("/add-user")) return 1;
    if (pathname.includes("/settings")) return 2;
    return 0;
  };

  return (
    <AuthGuard>
      <SocketProvider>
        <ServerStatus />
        <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
          {/* Desktop Sidebar */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              width: "250px",
              flexShrink: 0,
            }}
          >
            <Sidebar />
          </Box>

          {/* Mobile Drawer */}
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <Box sx={{ width: 300 }}>
              <Sidebar onClose={() => setDrawerOpen(false)} />
            </Box>
          </Drawer>

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
            <Paper
              elevation={2}
              sx={{
                display: { xs: "flex", md: "none" },
                p: 2,
                alignItems: "center",
                gap: 2,
                borderRadius: 0,
              }}
            >
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
              <Box sx={{ fontWeight: 600, fontSize: "1.1rem" }}>Chat App</Box>
            </Paper>

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
            display: { xs: "block", md: "none" },
            zIndex: 1000,
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
          >
            <BottomNavigationAction label="Chats" icon={<ChatIcon />} />
            <BottomNavigationAction label="Add User" icon={<PersonAddIcon />} />
            <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
          </BottomNavigation>
        </Paper>
      </SocketProvider>
    </AuthGuard>
  );
};

export default MainLayout;
