import UserModel from "../models/UserModel";
import { Request, Response } from "express";
import bcrypt from "bcrypt-ts";
import jwt from "jsonwebtoken";

interface LoginRequestBody {
  email: string;
  password: string;
}

async function Login(
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
): Promise<void> {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        message: "Email and password are required",
        error: true,
      });
      return;
    }

    // Find user by email
    const user = await UserModel.findOne({ email });

    // Check if user exists
    if (!user) {
      res.status(404).json({
        message: "User not found",
        error: true,
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({
        message: "Invalid credentials",
        error: true,
      });
      return;
    }

    // Generate JWT token
    const tokenData = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    // Set cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 24 * 60 * 60 * 1000,
    };

    // Successful login response
    res
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({
        message: "Login successful",
        success: true,
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic,
          },
          token,
        },
      });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage, error: true });
  }
}

export default Login;
