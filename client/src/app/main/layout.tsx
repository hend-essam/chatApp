"use client";
import AuthGuard from "@/components/auth/AuthGuard";
import Sidebar from "@/components/main/sidebar";
import ServerStatus from "@/components/debug/ServerStatus";
import { Stack } from "@mui/material";
import { SocketProvider } from "@/providers/SocketProvider";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <SocketProvider>
        <ServerStatus />
        <Stack height="100vh" direction="row">
          <Sidebar />
          <Stack flexGrow={1}>{children}</Stack>
        </Stack>
      </SocketProvider>
    </AuthGuard>
  );
};

export default MainLayout;
