import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel";

async function GetUserDetailsFromToken(token: string) {
  if (!token) {
    return {
      message: "session out",
      logout: true,
    };
  }

  try {
    // Verify the token and type-check the decoded payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Ensure the decoded payload is an object and has the `id` property
    if (typeof decoded === "string" || !("id" in decoded)) {
      throw new Error("Invalid token payload");
    }

    // Find the user by ID
    const user = await UserModel.findById(decoded.id).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (err) {
    // Handle token verification errors
    throw new Error("Invalid or expired token");
  }
}

export default GetUserDetailsFromToken;
