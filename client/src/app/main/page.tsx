"use client";
import { Box, Typography, Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const DashboardPage = () => {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  console.log("DashboardPage user:", user);
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Link href="/main/chat">
          <Button variant="contained">Go to Chats</Button>
        </Link>
        <Link href="/main/settings">
          <Button variant="outlined">Account Settings</Button>
        </Link>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Recent Activity</Typography>
      </Box>
    </Box>
  );
};

export default DashboardPage;
