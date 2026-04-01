"use client";
import AuthGuard from "@/components/auth/AuthGuard";
import Sidebar from "@/components/main/sidebar";
import { Stack } from "@mui/material";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <Stack height="100vh" direction="row">
        <Sidebar />
        <Stack flexGrow={1}>{children}</Stack>
      </Stack>
    </AuthGuard>
  );
};

export default MainLayout;
