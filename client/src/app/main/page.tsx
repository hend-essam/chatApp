"use client";
import { useSelector } from "react-redux";
import { Stack, Typography } from "@mui/material";

const DashboardPage = () => {
  const { user } = useSelector((state: any) => state.auth);

  return (
    <Stack direction="row" sx={{ height: "100vh", width: "90%", m: "auto" }}>
      <Typography variant="h4" sx={{ color: "#686666", m: "auto" }}>
        Welcome, {user?.name}! Please select a chat.
      </Typography>
    </Stack>
  );
};

export default DashboardPage;
