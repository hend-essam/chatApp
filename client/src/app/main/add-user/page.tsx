"use client";

import { Search } from "@mui/icons-material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  Avatar,
  Badge,
  CircularProgress,
  InputAdornment,
  Box,
  Paper,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  name: string;
  email: string;
  profilePic?: string;
}

const AddUser = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { onlineUsers } = useSelector((state: any) => state.user);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const endpoint = query.trim()
          ? `${process.env.NEXT_PUBLIC_API_URL}/users/search`
          : `${process.env.NEXT_PUBLIC_API_URL}/users`;
        const { data } = await axios.get(endpoint, {
          params: query.trim() ? { q: query } : {},
          withCredentials: true,
        });
        setUsers(data.data ?? []);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (query.trim()) {
      const timer = setTimeout(fetchUsers, 400);
      return () => clearTimeout(timer);
    } else {
      fetchUsers();
    }
  }, [query]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8f9fa",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: "14.5px 21px",
          backgroundColor: "#fff",
          borderBottom: "1px solid #e0e0e0",
          flexShrink: 0,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#1976d2", mb: 0.5 }}
        >
          Add New User
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Search and start chatting with new people
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "#fff",
          borderBottom: "1px solid #e0e0e0",
          flexShrink: 0,
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by name or email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  <Search sx={{ color: "#999" }} />
                )}
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "#f8f9fa",
            },
          }}
        />
      </Box>

      {/* Users List */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
        {loading && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Paper
                key={i}
                elevation={0}
                sx={{
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: "12px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Skeleton variant="circular" width={56} height={56} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton width="60%" height={24} />
                    <Skeleton width="40%" height={20} sx={{ mt: 0.5 }} />
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        )}

        {!loading && users.length > 0 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {users.map((u) => {
              const isOnline = onlineUsers.includes(u._id);
              return (
                <Paper
                  key={u._id}
                  elevation={0}
                  onClick={() => router.push(`/main/${u._id}`)}
                  sx={{
                    p: 2,
                    cursor: "pointer",
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      variant="dot"
                      invisible={!isOnline}
                      sx={{
                        "& .MuiBadge-badge": {
                          backgroundColor: "#44b700",
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          border: "2px solid #fff",
                        },
                      }}
                    >
                      <Avatar
                        src={u.profilePic}
                        alt={u.name}
                        sx={{ width: 56, height: 56 }}
                      />
                    </Badge>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {u.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {u.email}
                      </Typography>
                    </Box>
                    {/* <PersonAddIcon sx={{ color: "#1976d2", fontSize: 24 }} /> */}
                  </Box>
                </Paper>
              );
            })}
          </Box>
        )}

        {!loading && users.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              px: 3,
            }}
          >
            <PersonAddIcon
              sx={{ fontSize: 64, color: "#1976d2", opacity: 0.2, mb: 2 }}
            />
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {query.trim() ? "No users found" : "No users available"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {query.trim()
                ? "Try a different search term"
                : "Check back later"}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AddUser;
