"use client";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, useMediaQuery, useTheme, Paper, Avatar, Badge, Button } from "@mui/material";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { logout } from '@/redux/slices/authSlice';

const DashboardPage = () => {
  const { user } = useSelector((state: any) => state.auth);
  const { onlineUsers } = useSelector((state: any) => state.user);
  const { conversations } = useSelector((state: any) => state.message);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const dispatch = useDispatch();

  const getOtherUser = (conv: any) => {
    return conv.sender._id === user._id ? conv.receiver : conv.sender;
  };

  const handleLogout = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
      withCredentials: true,
    });
    dispatch(logout());
    router.push('/login');
  };

  if (isMobile) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa' }}>
        {/* Welcome Section */}
        <Box sx={{ 
          p: 3, 
          backgroundColor: '#fff',
          borderBottom: '1px solid #e0e0e0',
          flexShrink: 0
        }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#1976d2', mb: 0.5 }}>
            Welcome back, {user?.name}! 👋
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {onlineUsers.length} user{onlineUsers.length !== 1 ? 's' : ''} online now
          </Typography>
        </Box>

        {/* Chats Section */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, px: 1 }}>
            Recent Chats
          </Typography>
          
          {conversations.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 8,
              px: 3
            }}>
              <ChatBubbleOutlineIcon sx={{ fontSize: 64, color: '#1976d2', opacity: 0.2, mb: 2 }} />
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                No conversations yet
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Start chatting by adding a new user
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {conversations.map((conv: any) => {
                const otherUser = getOtherUser(conv);
                const lastMessage = conv.messages[0];
                const isOnline = onlineUsers.includes(otherUser._id);

                return (
                  <Paper
                    key={conv._id}
                    onClick={() => router.push(`/main/${otherUser._id}`)}
                    elevation={0}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      border: '1px solid #e0e0e0',
                      borderRadius: '12px',
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        variant="dot"
                        invisible={!isOnline}
                        sx={{
                          '& .MuiBadge-badge': {
                            backgroundColor: '#44b700',
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            border: '2px solid #fff',
                          },
                        }}
                      >
                        <Avatar 
                          src={otherUser.profilePic} 
                          alt={otherUser.name}
                          sx={{ width: 56, height: 56 }}
                        />
                      </Badge>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {otherUser.name}
                          </Typography>
                          {conv.unseenCount > 0 && (
                            <Box
                              sx={{
                                backgroundColor: '#1976d2',
                                color: '#fff',
                                borderRadius: '12px',
                                px: 1,
                                py: 0.25,
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                minWidth: '20px',
                                textAlign: 'center',
                              }}
                            >
                              {conv.unseenCount}
                            </Box>
                          )}
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontWeight: conv.unseenCount > 0 ? 600 : 400,
                          }}
                        >
                          {lastMessage?.text || 'No messages yet'}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  // Desktop view
  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      p: 3
    }}>
      <Box sx={{ textAlign: 'center' }}>
        <ChatBubbleOutlineIcon sx={{ fontSize: 80, color: '#1976d2', opacity: 0.3, mb: 2 }} />
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#333', mb: 1 }}>
          Welcome, {user?.name}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Select a conversation to start messaging
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          {onlineUsers.length} user{onlineUsers.length !== 1 ? 's' : ''} online
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardPage;
