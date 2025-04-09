"use client";
import { Stack, Button, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
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
      const payload = {
        email: data.email,
        password: data.password,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/login`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage("✅ Login successful! Redirecting...");
        setTimeout(() => {
          router.push("/");
          router.refresh();
        }, 1500);
      } else {
        setFormError(
          response.data.message || "Login failed. Please try again."
        );
      }
    } catch (err: any) {
      if (err.response) {
        setFormError(
          err.response.data?.message ||
            "Invalid email or password. Please try again."
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
      <Stack gap={5} p={2} width={{ xs: "90%", md: "400px" }}>
        {/* Header */}
        <AuthHeader title="Login" />

        {/* Alerts */}
        {formError && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            onClose={() => setFormError("")}
          >
            {formError}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* Login Form */}
        <Stack component="form" gap={3} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2} direction="column" gap={2}>
            <EmailInput register={register} error={errors.email} />
            <PasswordInput register={register} error={errors.password} />
          </Stack>

          <Stack direction="row" gap={2}>
            <LoadingButton type="submit" loading={loading} sx={{ flex: 1 }}>
              Login
            </LoadingButton>
            <Button
              href="/forgot-password"
              variant="outlined"
              sx={{
                border: "1px solid #b89f6a",
                fontWeight: "semi-bold",
                color: "black",
                flex: 1,
              }}
            >
              Forgot Password?
            </Button>
          </Stack>
        </Stack>

        <AuthLinkPrompt
          promptText="Don't have an account?"
          linkText="Register here"
          href="/register"
        />
      </Stack>
    </Stack>
  );
};

export default Login;
