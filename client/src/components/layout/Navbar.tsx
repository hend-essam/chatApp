import { Stack, Button, Typography, Box } from "@mui/material";
import Link from "next/link";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

const Navbar = () => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      component="nav"
      sx={{
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        gap: { xs: 2, sm: 0 },
      }}
    >
      <Link href="/" passHref style={{ textDecoration: "none" }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
          <ChatBubbleOutlineIcon sx={{ color: "#1976d2", fontSize: { xs: 28, sm: 32 } }} />
          <Typography
            variant="h5"
            sx={{
              color: "#1976d2",
              fontWeight: 700,
              letterSpacing: '-0.5px',
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
            }}
          >
            Chatify
          </Typography>
        </Box>
      </Link>

      <Stack direction="row" spacing={{ xs: 1, sm: 2 }}>
        <Link href="/login" passHref style={{ textDecoration: "none" }}>
          <Button
            variant="text"
            sx={{
              color: "#666",
              textTransform: "none",
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 600,
              px: { xs: 2, sm: 3 },
              "&:hover": { 
                backgroundColor: "#f5f5f5",
                color: "#1976d2",
              },
            }}
          >
            Login
          </Button>
        </Link>
        <Link href="/register" passHref style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              textTransform: "none",
              fontSize: { xs: '0.875rem', sm: '1rem' },
              fontWeight: 600,
              px: { xs: 2, sm: 3 },
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": { 
                backgroundColor: "#1565c0",
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
              },
            }}
          >
            Register
          </Button>
        </Link>
      </Stack>
    </Stack>
  );
};

export default Navbar;
