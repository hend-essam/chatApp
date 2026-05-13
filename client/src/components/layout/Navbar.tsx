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
    >
      <Link href="/" passHref style={{ textDecoration: "none" }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
          <ChatBubbleOutlineIcon sx={{ color: "#1976d2", fontSize: 32 }} />
          <Typography
            variant="h5"
            sx={{
              color: "#1976d2",
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}
          >
            Chat App
          </Typography>
        </Box>
      </Link>

      <Stack direction="row" spacing={2}>
        <Link href="/login" passHref style={{ textDecoration: "none" }}>
          <Button
            variant="text"
            sx={{
              color: "#666",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
              px: 3,
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
              fontSize: "1rem",
              fontWeight: 600,
              px: 3,
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
