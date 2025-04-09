"use client";
import { Stack, Typography } from "@mui/material";
import Link from "next/link";

interface AuthHeaderProps {
  title: string;
}

const AuthHeader = ({ title }: AuthHeaderProps) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={2}
      borderBottom={"3px double #b89f6a"}
      p={1}
    >
      <Typography
        variant="h3"
        color="#b89f6a"
        component={Link}
        href="/"
        sx={{ textDecoration: "none" }}
      >
        Chatify
      </Typography>
      <Typography variant="h5">{title}</Typography>
    </Stack>
  );
};

export default AuthHeader;
