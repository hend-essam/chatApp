"use client";
import { Button, CircularProgress, SxProps, Theme } from "@mui/material";
import { ReactNode } from "react";

interface LoadingButtonProps {
  loading: boolean;
  children: ReactNode;
  variant?: "text" | "outlined" | "contained";
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}

const LoadingButton = ({
  loading,
  children,
  variant = "contained",
  type = "button",
  fullWidth = false,
  sx = {},
  color = "primary",
  ...props
}: LoadingButtonProps) => {
  const defaultStyles = {
    fontWeight: "semi-bold",
    ...(variant === "contained" && {
      backgroundColor: "#b89f6a",
      "&:hover": { backgroundColor: "#a08658" },
    }),
    ...(variant === "outlined" && {
      border: "1px solid #b89f6a",
      color: "black",
      "&:hover": { borderColor: "#a08658" },
    }),
  };

  return (
    <Button
      variant={variant}
      type={type}
      fullWidth={fullWidth}
      disabled={loading || props.disabled}
      sx={{ ...defaultStyles, ...sx }}
      color={color}
      {...props}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : children}
    </Button>
  );
};

export default LoadingButton;
