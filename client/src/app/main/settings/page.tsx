"use client";

import { useState } from "react";
import {
  Typography,
  Button,
  Avatar,
  Stack,
  Alert,
  OutlinedInput,
  FormControl,
  styled,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LoadingButton from "@/components/ui/LoadingButton";
import { updateUser } from "@/redux/slices/authSlice"; // تأكدي من المسار

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
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      profilePic: user?.profilePic || "",
    },
  });

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
        `${process.env.NEXT_PUBLIC_API_URL}/api/updateUserDetails`,
        data,
        { withCredentials: true },
      );

      if (response.data.success) {
        setSuccessMessage("✅ Profile updated successfully!");
        dispatch(updateUser(response.data.data));
      }
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      sx={{
        p: { xs: 2, md: 4 },
        alignItems: "center",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", mb: 4, color: "#333" }}
      >
        Update Account
      </Typography>

      {formError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Stack component="form" spacing={4} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Avatar
            src={previewImage}
            sx={{
              width: 100,
              height: 100,
              border: "4px solid #F5F5DC",
              boxShadow: 1,
            }}
          />
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              borderColor: "#b89f6a",
              color: "#b89f6a",
              "&:hover": {
                backgroundColor: "#F5F5DC",
              },
            }}
          >
            Change Photo
            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
        </Stack>

        {/* Name Field */}
        <FormControl fullWidth>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: "500" }}>
            Name
          </Typography>
          <OutlinedInput
            {...register("name", { required: "Name is required" })}
            error={!!errors.name}
            placeholder="Your Name"
          />
          {errors.name && (
            <Typography color="error" variant="caption" sx={{ mt: 0.5 }}>
              {errors.name.message as string}
            </Typography>
          )}
        </FormControl>

        <LoadingButton
          type="submit"
          loading={loading}
          sx={{
            width: "fit-content",
          }}
        >
          Save Changes
        </LoadingButton>
      </Stack>
    </Stack>
  );
};

export default Settings;
