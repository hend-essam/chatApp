"use client";
import { Typography } from "@mui/material";
import Link from "next/link";

interface AuthLinkPromptProps {
  promptText: string;
  linkText: string;
  href: string;
}

const AuthLinkPrompt = ({
  promptText,
  linkText,
  href,
}: AuthLinkPromptProps) => {
  return (
    <Typography textAlign="center">
      {promptText}{" "}
      <Link
        href={href}
        style={{
          textDecoration: "none",
          color: "#1976d2",
          fontWeight: "bold",
        }}
      >
        {linkText}
      </Link>
    </Typography>
  );
};

export default AuthLinkPrompt;
