import UserModel from "../models/UserModel";
import { Request, Response } from "express";
import { RequestBody } from "../interface";

async function CheckEmail(
  req: Request<{}, {}, RequestBody>,
  res: Response
): Promise<void> {
  try {
    const { email } = req.body;

    // Check if the email already exists in the database
    const existingUser = await UserModel.findOne({ email }).select("-password");

    if (!existingUser) {
      // If the user does not exist, return a 404 error
      res.status(404).json({ message: "User does not exist", error: true });
      return; // Exit the function to prevent further execution
    }

    // If the user exists, return a success response
    res.status(200).json({
      message: "Email verified",
      success: true,
      data: existingUser,
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage, error: true });
  }
}

export default CheckEmail;
