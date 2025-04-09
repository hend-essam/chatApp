"use client";
import {
  Stack,
  Typography,
  Button,
  OutlinedInput,
  FormControl,
  styled,
  Alert,
  Box,
  Chip,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Image from "next/image";
import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@/components/ui/LoadingButton";
import EmailInput from "@/components/auth/EmailInput";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthLinkPrompt from "@/components/auth/AuthLinkPrompt";
import AuthHeader from "@/components/auth/AuthHeader";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  profilePic: FileList;
}

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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm<RegisterFormData>();

  const DEFAULT_PROFILE_PIC = "/assets/user.png";
  const [base64Image, setBase64Image] = useState<string>(DEFAULT_PROFILE_PIC);
  const [fileName, setFileName] = useState("");
  const [formError, setFormError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    clearErrors("profilePic");

    if (!file) {
      setBase64Image(DEFAULT_PROFILE_PIC);
      setFileName("");
      return;
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setError("profilePic", {
        type: "manual",
        message: "❌ Only JPG, PNG, or WEBP images allowed",
      });
      e.target.value = "";
      setBase64Image(DEFAULT_PROFILE_PIC);
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError("profilePic", {
        type: "manual",
        message: `❌ File too large! Max ${(
          MAX_FILE_SIZE /
          1024 /
          1024
        ).toFixed(0)}MB allowed`,
      });
      e.target.value = "";
      setBase64Image(DEFAULT_PROFILE_PIC);
      return;
    }

    // Process valid file
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setBase64Image(reader.result);
        setFileName(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    reset();
    setBase64Image(DEFAULT_PROFILE_PIC);
    setFormError("");
    setSuccessMessage("");
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (errors.profilePic) return;

    setLoading(true);
    setFormError("");
    setSuccessMessage("");

    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        profilePic: base64Image.startsWith("data:image") ? base64Image : null,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/register`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        setSuccessMessage("✅ Registration successful! You can now login.");
        setTimeout(resetForm, 3000);
      }
    } catch (err: any) {
      if (err.response) {
        setFormError(
          err.response.data?.message || "Registration failed. Please try again."
        );
      } else {
        setFormError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack height="100vh" alignItems="center" justifyContent="center">
      <Stack gap={3} p={2} width={{ xs: "90%", md: "500px" }}>
        {/* Header */}
        <AuthHeader title="Register" />

        {/* Alerts */}
        {formError && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {formError}
          </Alert>
        )}
        {successMessage && (
          <Alert
            severity="success"
            sx={{ mb: 1 }}
            onClose={() => setSuccessMessage("")}
          >
            {successMessage}
          </Alert>
        )}

        {/* Form */}
        <Stack component="form" gap={3} onSubmit={handleSubmit(onSubmit)}>
          <Stack gap={2}>
            {/* Name & Email */}
            <Stack direction={{ xs: "column", md: "row" }} gap={2}>
              <FormControl fullWidth>
                <OutlinedInput
                  placeholder="Name"
                  {...register("name", { required: "Name is required" })}
                  error={!!errors.name}
                />
                {errors.name && (
                  <Typography color="error" variant="caption">
                    {errors.name.message}
                  </Typography>
                )}
              </FormControl>

              <EmailInput register={register} error={errors.email} />
            </Stack>

            {/* Password & Photo Upload */}
            <Stack direction={{ xs: "column", md: "row" }} gap={2}>
              <PasswordInput register={register} error={errors.password} />

              <Box sx={{ width: "100%" }}>
                <Button
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{ height: 56 }}
                >
                  {base64Image !== DEFAULT_PROFILE_PIC ? (
                    <Chip
                      label={fileName}
                      onClick={(e) => e.stopPropagation()}
                      onDelete={() => {
                        setBase64Image(DEFAULT_PROFILE_PIC);
                        setFileName("");
                      }}
                      deleteIcon={<CloseIcon />}
                      sx={{
                        maxWidth: { xs: "70%", md: "142px" },
                        "& .MuiChip-label": {
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                      }}
                    />
                  ) : (
                    "Upload Photo"
                  )}
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    {...register("profilePic", {
                      validate: {
                        fileType: (files) =>
                          !files?.[0] ||
                          ALLOWED_FILE_TYPES.includes(files[0].type) ||
                          "❌ Only JPG, PNG, or WEBP allowed",
                        fileSize: (files) =>
                          !files?.[0] ||
                          files[0].size <= MAX_FILE_SIZE ||
                          `❌ Max ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(
                            0
                          )}MB allowed`,
                      },
                    })}
                    onChange={handleFileChange}
                  />
                  {base64Image && base64Image !== DEFAULT_PROFILE_PIC && (
                    <Box sx={{ mt: 1, textAlign: "center" }}>
                      <Image
                        src={base64Image}
                        alt="Profile Preview"
                        width={50}
                        height={50}
                        style={{
                          borderRadius: "50%",
                          objectFit: "cover",
                          marginLeft: "10px",
                        }}
                      />
                    </Box>
                  )}
                </Button>
                {errors.profilePic && (
                  <Typography
                    color="error"
                    variant="caption"
                    sx={{ display: "block", mt: 1 }}
                  >
                    {errors.profilePic.message}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Stack>

          <LoadingButton type="submit" loading={loading} sx={{ flex: 1 }}>
            Register
          </LoadingButton>
        </Stack>

        <AuthLinkPrompt
          promptText="Already have an account?"
          linkText="Login"
          href="/login"
        />
      </Stack>
    </Stack>
  );
};

export default Register;
