"use client";
import { FormControl, OutlinedInput, Typography } from "@mui/material";
import { UseFormRegister, FieldError } from "react-hook-form";

interface EmailInputProps {
  register: UseFormRegister<any>;
  error?: FieldError;
}

const EmailInput = ({ register, error }: EmailInputProps) => {
  return (
    <FormControl fullWidth>
      <OutlinedInput
        type="email"
        placeholder="Email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        })}
        error={!!error}
      />
      {error && (
        <Typography color="error" variant="caption">
          {error.message}
        </Typography>
      )}
    </FormControl>
  );
};

export default EmailInput;
