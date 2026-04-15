"use client";
import { useSelector } from "react-redux";
import { Stack, Typography } from "@mui/material";

const DashboardPage = () => {
  const { user } = useSelector((state: any) => state.auth);
  const { onlineUsers } = useSelector((state: any) => state.user);

  return (
    <Stack direction="row" sx={{ height: "100vh", width: "90%", m: "auto" }}>
      <Typography variant="h4" sx={{ color: "#686666", m: "auto" }}>
        Welcome, {user?.name}!<br /> Please select a chat.
        <br />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Online users: {onlineUsers.length}
        </Typography>
      </Typography>
    </Stack>
  );
};

export default DashboardPage;
