"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Chip } from "@mui/material";
import axios from "axios";

const ServerStatus = () => {
  const [serverStatus, setServerStatus] = useState<"checking" | "online" | "offline">("checking");
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkServerStatus = async () => {
    try {
      setServerStatus("checking");
      
      // Test root endpoint
      const rootResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/`,
        { timeout: 5000 }
      );
      console.log("[ServerStatus] Root endpoint working:", rootResponse.data);
      
      // Test API endpoint
      const apiResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/health`,
        { timeout: 5000 }
      );
      console.log("[ServerStatus] API endpoint working:", apiResponse.data);
      
      setServerStatus("online");
      setLastCheck(new Date());
    } catch (error: any) {
      setServerStatus("offline");
      setLastCheck(new Date());
      console.error("[ServerStatus] Server check failed:", {
        message: error?.message,
        status: error?.response?.status,
        url: error?.config?.url
      });
    }
  };

  useEffect(() => {
    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (serverStatus) {
      case "online": return "success";
      case "offline": return "error";
      default: return "default";
    }
  };

  const getStatusText = () => {
    switch (serverStatus) {
      case "online": return "Server Online";
      case "offline": return "Server Offline";
      default: return "Checking...";
    }
  };

  return (
    <Box sx={{ position: "fixed", top: 10, right: 10, zIndex: 1000 }}>
      <Chip
        label={getStatusText()}
        color={getStatusColor()}
        size="small"
        onClick={checkServerStatus}
        sx={{ cursor: "pointer" }}
      />
      {lastCheck && (
        <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 0.5 }}>
          {lastCheck.toLocaleTimeString()}
        </Typography>
      )}
    </Box>
  );
};

export default ServerStatus;