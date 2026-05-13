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
    fontWeight: 600,
    textTransform: "none" as const,
    borderRadius: "12px",
    py: 1.5,
    ...(variant === "contained" && {
      backgroundColor: "#1976d2",
      boxShadow: "none",
      "&:hover": { 
        backgroundColor: "#1565c0",
        boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
      },
    }),
    ...(variant === "outlined" && {
      border: "1px solid #e0e0e0",
      color: "#666",
      "&:hover": { 
        borderColor: "#999",
        backgroundColor: "#f5f5f5",
      },
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
