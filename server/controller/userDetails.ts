import { Request, Response } from "express";
import GetUserDetailsFromToken from "../helpers/getUserDetailsFromToken";
import { onlineUsers } from "../socket/index";

async function UserDetails(req: Request, res: Response): Promise<void> {
  try {
    const token = req.cookies.token || "";
    const user = await GetUserDetailsFromToken(token);

    res.status(200).json({
      message: "User details",
      success: true,
      data: {
        ...(user as any)._doc,
        onlineUsers: Array.from(onlineUsers),
      },
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "An unknown error occurred";
    res.status(500).json({ message: errorMessage, error: true });
  }
}

export default UserDetails;
