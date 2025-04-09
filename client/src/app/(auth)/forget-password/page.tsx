"use client";
import { Stack, Alert } from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import AuthHeader from "@/components/auth/AuthHeader";
import EmailInput from "@/components/auth/EmailInput";
import LoadingButton from "@/components/ui/LoadingButton";
import AuthLinkPrompt from "@/components/auth/AuthLinkPrompt";

interface ForgetPasswordData {
  email: string;
}

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgetPasswordData>();

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ForgetPasswordData) => {
    setLoading(true);
    setFormError("");
    setSuccessMessage("");

    try {
      const payload = {
        email: data.email,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/forgot-password`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage("✅ Password reset link sent to your email!");
      } else {
        setFormError(
          response.data.message ||
            "Failed to send reset link. Please try again."
        );
      }
    } catch (err: any) {
      if (err.response) {
        setFormError(
          err.response.data?.message ||
            "Failed to process your request. Please try again."
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
        <AuthHeader title="Forget Password" />

        {/* Alerts */}
        {formError && (
          <Alert severity="error" onClose={() => setFormError("")}>
            {formError}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" onClose={() => setSuccessMessage("")}>
            {successMessage}
          </Alert>
        )}

        <Stack component="form" gap={3} onSubmit={handleSubmit(onSubmit)}>
          <EmailInput register={register} error={errors.email} />

          <LoadingButton type="submit" loading={loading} fullWidth>
            Send Reset Link
          </LoadingButton>
        </Stack>

        <AuthLinkPrompt
          promptText="Remember your password?"
          linkText="Login here"
          href="/login"
        />
      </Stack>
    </Stack>
  );
};

export default ForgetPassword;
