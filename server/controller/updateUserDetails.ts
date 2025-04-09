import { Request, Response } from "express";
import GetUserDetailsFromToken from "../helpers/getUserDetailsFromToken";
import UserModel from "../models/UserModel";

async function UpdateUserDetails(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies.token || "";

    // Check if the token exists
    if (!token) {
      res
        .status(401)
        .json({ message: "Unauthorized: Token missing", error: true });
      return;
    }

    // Get user details from the token
    const userDetails = await GetUserDetailsFromToken(token);

    // Check if the user details are valid
    if ("logout" in userDetails) {
      // If the token is invalid or the user is not found
      res.status(401).json({ message: userDetails.message, error: true });
      return;
    }

    // Validate the request body
    const { name, profilePic } = req.body;
    if (!name && !profilePic) {
      res
        .status(400)
        .json({ message: "Name or profilePic is required", error: true });
      return;
    }

    // Update the user details
    const updateResult = await UserModel.updateOne(
      { _id: userDetails._id }, // Access _id after ensuring userDetails is valid
      { name, profilePic }
    );

    // Check if the update was successful
    if (updateResult.matchedCount === 0) {
      res.status(404).json({ message: "User not found", error: true });
      return;
    }

    // Fetch the updated user details
    const userInformation = await UserModel.findById(userDetails._id).select(
      "-password"
    );

    // Send the response
    res.status(200).json({
      message: "User details updated",
      success: true,
      data: userInformation,
    });
  } catch (err) {
    // Log the error for debugging
    console.error("UpdateUserDetails error:", err);

    // Send an error response
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage, error: true });
  }
}

export default UpdateUserDetails;
