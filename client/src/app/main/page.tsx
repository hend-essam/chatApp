"use client";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const DashboardPage = () => {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.name}!
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button variant="contained" onClick={() => router.push("/main/chat")}>
          Go to Chats
        </Button>
        <Button
          variant="outlined"
          onClick={() => router.push("/main/settings")}
        >
          Account Settings
        </Button>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Recent Activity</Typography>
      </Box>
    </Box>
  );
};

export default DashboardPage;
