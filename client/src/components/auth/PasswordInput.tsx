"use client";
import {
  FormControl,
  OutlinedInput,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { UseFormRegister, FieldError } from "react-hook-form";
import { useState } from "react";

interface PasswordInputProps {
  register: UseFormRegister<any>;
  error?: FieldError;
}

const PasswordInput = ({ register, error }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl fullWidth>
      <OutlinedInput
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters",
          },
        })}
        error={!!error}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
      />
      {error && (
        <Typography color="error" variant="caption">
          {error.message}
        </Typography>
      )}
    </FormControl>
  );
};

export default PasswordInput;
