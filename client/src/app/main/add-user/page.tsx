"use client";

import { Search } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  CircularProgress,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Stack,
  TextField,
  Typography,
  Link,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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

  console.log("[AddUser] onlineUsers from Redux:", onlineUsers);
  console.log("[AddUser] users:", users);

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
    <Stack sx={{ p: 4, maxWidth: 480 }}>
      <Typography variant="h5" sx={{ color: "#333", mb: 4 }}>
        Add New User
      </Typography>

      <TextField
        fullWidth
        placeholder="Search by name or email…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {loading ? (
                <CircularProgress size={18} />
              ) : (
                <Search sx={{ color: "#999" }} />
              )}
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      {loading && (
        <List disablePadding>
          {[1, 2, 3].map((i) => (
            <ListItem key={i} disableGutters>
              <ListItemAvatar>
                <Skeleton variant="circular" width={40} height={40} />
              </ListItemAvatar>
              <ListItemText
                primary={<Skeleton width="60%" />}
                secondary={<Skeleton width="40%" />}
              />
            </ListItem>
          ))}
        </List>
      )}

      {!loading && users.length > 0 && (
        <List disablePadding>
          {users.map((u) => (
            <Link
              key={u._id}
              href={`/main/${u._id}`}
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItem
                disableGutters
                sx={{
                  borderRadius: 2,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                  px: 1,
                }}
              >
                <ListItemAvatar>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    invisible={!onlineUsers.includes(u._id)}
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#44b700",
                        color: "#44b700",
                        boxShadow: `0 0 0 2px #fff`,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                      },
                    }}
                  >
                    <Avatar src={u.profilePic} alt={u.name} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText primary={u.name} secondary={u.email} />
              </ListItem>
            </Link>
          ))}
        </List>
      )}

      {!loading && users.length === 0 && (
        <Typography variant="body2" sx={{ color: "#999", textAlign: "center" }}>
          No users found.
        </Typography>
      )}
    </Stack>
  );
};

export default AddUser;
