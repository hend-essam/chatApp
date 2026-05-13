"use client";
import { Stack, Typography, Box } from "@mui/material";
import Link from "next/link";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

interface AuthHeaderProps {
  title?: string;
  withLine?: boolean;
  link?: string;
}

const AuthHeader = ({
  title,
  withLine = false,
  link = "/",
}: AuthHeaderProps) => {
  return (
    <Stack alignItems="center" gap={2}>
      <Link href={link} style={{ textDecoration: "none" }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChatBubbleOutlineIcon sx={{ color: "#1976d2", fontSize: 40 }} />
          <Typography
            variant="h4"
            sx={{
              color: "#1976d2",
              fontWeight: 700,
            }}
          >
            Chatify
          </Typography>
        </Box>
      </Link>
      {title && (
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#333" }}>
          {title}
        </Typography>
      )}
    </Stack>
  );
};

export default AuthHeader;
