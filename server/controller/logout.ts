import { Request, Response } from "express";

async function Logout(req: Request, res: Response): Promise<void> {
  try {
    // Define cookie options (match the options used when setting the cookie)
    const cookieOptions = {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict" as const, // Prevent CSRF attacks
    };

    // Clear the token cookie
    res.clearCookie("token", cookieOptions);

    // Send a success response
    res.status(200).json({ message: "Logged out successfully", success: true });
  } catch (err) {
    // Log the error for debugging
    console.error("Logout error:", err);

    // Send an error response
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage, error: true });
  }
}

export default Logout;
