import UserModel from "../models/UserModel";
import { Request, Response } from "express";
import { RequestBody } from "../interface";
import bcrypt from "bcrypt-ts";
import jwt from "jsonwebtoken";

async function CheckPassword(
  req: Request<{}, {}, RequestBody>,
  res: Response
): Promise<void> {
  try {
    const { password, userId } = req.body;

    // Check if userId and password are provided
    if (!userId || !password) {
      res
        .status(400)
        .json({ message: "userId and password are required", error: true });
      return;
    }

    // Find the user by userId
    const user = await UserModel.findById(userId);

    // Check if the user exists
    if (!user) {
      res.status(404).json({ message: "User not found", error: true });
      return;
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      // If the password is invalid, return a 401 Unauthorized response
      res.status(401).json({ message: "Invalid password", error: true });
      return;
    }

    // If the password is valid, generate a JWT token
    const tokenData = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET as string, {
      expiresIn: "1d", // Token expires in 1 day
    });

    // Set cookie options
    const cookieOptions = {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict" as const, // Prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day (matches JWT expiry)
    };

    // Return a success response with the token and user data
    res
      .cookie("token", token, cookieOptions) // Set the token in a cookie
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
          token, // Include the JWT token in the response
        },
      });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage, error: true });
  }
}

export default CheckPassword;
