"use client";
import { Stack, Button, Alert, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { login } from "@/redux/slices/authSlice";
import LoadingButton from "@/components/ui/LoadingButton";
import EmailInput from "@/components/auth/EmailInput";
import PasswordInput from "@/components/auth/PasswordInput";
import AuthLinkPrompt from "@/components/auth/AuthLinkPrompt";
import AuthHeader from "@/components/auth/AuthHeader";

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setFormError("");
    setSuccessMessage("");

    try {
      const response = await axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_API_URL}/login`,
        data: {
          email: data.email,
          password: data.password,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setSuccessMessage("✅ Login successful! Redirecting...");

        // Store token in both cookie and localStorage as fallback
        const token = response.data.data.token;
        document.cookie = `token=${token}; path=/; max-age=${24 * 60 * 60}`;
        localStorage.setItem("token", token);

        // Dispatch login action to update Redux state
        dispatch(
          login({
            user: response.data.data.user,
            token: token,
          }),
        );

        setTimeout(() => {
          router.push("/main");
        }, 1500);
      } else {
        setFormError(
          response.data.message || "Login failed. Please try again.",
        );
      }
    } catch (err: any) {
      if (err.response) {
        setFormError(
          err.response.data?.message ||
            "Invalid email or password. Please try again.",
        );
      } else {
        setFormError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "450px",
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          p: 4,
        }}
      >
        {/* Header */}
        <AuthHeader title="Welcome Back" />

        {/* Alerts */}
        {formError && (
          <Alert
            severity="error"
            sx={{ mb: 2, mt: 3, borderRadius: "12px" }}
            onClose={() => setFormError("")}
          >
            {formError}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2, mt: 3, borderRadius: "12px" }}>
            {successMessage}
          </Alert>
        )}

        {/* Login Form */}
        <Stack
          component="form"
          gap={3}
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Stack spacing={2} direction="column" gap={2}>
            <EmailInput register={register} error={errors.email} />
            <PasswordInput register={register} error={errors.password} />
          </Stack>

          <LoadingButton
            type="submit"
            loading={loading}
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: "12px",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            Login
          </LoadingButton>

          <Button
            href="/forget-password"
            variant="text"
            sx={{
              textTransform: "none",
              color: "#1976d2",
              fontWeight: 600,
            }}
          >
            Forgot Password?
          </Button>
        </Stack>

        <Box sx={{ mt: 3 }}>
          <AuthLinkPrompt
            promptText="Don't have an account?"
            linkText="Register here"
            href="/register"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
