"use client";
import { useSelector } from "react-redux";
import { Stack, Typography, Box } from "@mui/material";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const DashboardPage = () => {
  const { user } = useSelector((state: any) => state.auth);
  const { onlineUsers } = useSelector((state: any) => state.user);

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      p: 3
    }}>
      <Stack alignItems="center" spacing={2}>
        <ChatBubbleOutlineIcon sx={{ fontSize: 80, color: '#1976d2', opacity: 0.3 }} />
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#333' }}>
          Welcome, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center">
          Select a conversation to start messaging
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {onlineUsers.length} user{onlineUsers.length !== 1 ? 's' : ''} online
        </Typography>
      </Stack>
    </Box>
  );
};

export default DashboardPage;
