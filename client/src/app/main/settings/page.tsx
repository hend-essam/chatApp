"use client";

import { useState } from "react";
import {
  Typography,
  Button,
  Avatar,
  Box,
  Alert,
  TextField,
  Paper,
  IconButton,
  styled,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import PersonIcon from "@mui/icons-material/Person";
import LoadingButton from "@/components/ui/LoadingButton";
import { updateUser } from "@/redux/slices/authSlice";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const Settings = () => {
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(user?.profilePic || "");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      profilePic: user?.profilePic || "",
    },
  });

  const watchedValues = watch();
  const isDirty =
    watchedValues.name !== (user?.name || "") ||
    watchedValues.profilePic !== (user?.profilePic || "");

  const handleCancel = () => {
    reset({ name: user?.name || "", profilePic: user?.profilePic || "" });
    setPreviewImage(user?.profilePic || "");
    setFormError("");
    setSuccessMessage("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewImage(base64);
        setValue("profilePic", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    setFormError("");
    setSuccessMessage("");

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/updateUserDetails`,
        data,
        { withCredentials: true },
      );

      if (response.data.success) {
        setSuccessMessage("Profile updated successfully!");
        dispatch(updateUser(response.data.data));
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

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
          Account Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Update your profile information
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flexGrow: 1, overflowY: "auto", p: 3 }}>
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
          {formError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
              {formError}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: "12px" }}>
              {successMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {/* Profile Picture Section */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                border: "1px solid #e0e0e0",
                borderRadius: "16px",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
                Profile Picture
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={previewImage}
                    sx={{
                      width: 100,
                      height: 100,
                      border: "4px solid #fff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  />
                  <IconButton
                    component="label"
                    sx={{
                      position: "absolute",
                      bottom: -5,
                      right: -5,
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      width: 36,
                      height: 36,
                      "&:hover": {
                        backgroundColor: "#1565c0",
                      },
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    <PhotoCameraIcon sx={{ fontSize: 20 }} />
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </IconButton>
                </Box>
                <Box>
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      textTransform: "none",
                      borderRadius: "12px",
                      borderColor: "#1976d2",
                      color: "#1976d2",
                      mb: 1,
                      "&:hover": {
                        backgroundColor: "#e3f2fd",
                        borderColor: "#1976d2",
                      },
                    }}
                  >
                    Upload New Photo
                    <VisuallyHiddenInput
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    JPG, PNG or GIF (Max 5MB)
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Name Section */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                border: "1px solid #e0e0e0",
                borderRadius: "16px",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Personal Information
              </Typography>
              <TextField
                {...register("name", { required: "Name is required" })}
                fullWidth
                label="Name"
                placeholder="Enter your name"
                error={!!errors.name}
                helperText={errors.name?.message as string}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ color: "#999", mr: 1 }} />,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            </Paper>

            {/* Email Display (Read-only) */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                border: "1px solid #e0e0e0",
                borderRadius: "16px",
                backgroundColor: "#f8f9fa",
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Email Address
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user?.email}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5 }}
              >
                Email cannot be changed
              </Typography>
            </Paper>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <LoadingButton
                type="submit"
                loading={loading}
                disabled={!isDirty}
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                Save Changes
              </LoadingButton>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={!isDirty}
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderColor: "#e0e0e0",
                  color: "#666",
                  "&:hover": {
                    borderColor: "#999",
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
