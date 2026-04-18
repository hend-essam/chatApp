import UserModel from "../models/UserModel";
import GetUserDetailsFromToken from "../helpers/getUserDetailsFromToken";

async function searchUsers(req: any, res: any) {
  try {
    const token = req.cookies?.token;
    const currentUser = await GetUserDetailsFromToken(token);
    if (!currentUser || (currentUser as any).logout) {
      return res.status(401).json({ message: "Unauthorized", error: true });
    }

    const { q } = req.query;
    if (!q || !(q as string).trim()) {
      return res.json({ message: "No query", success: true, data: [] });
    }

    const query = new RegExp((q as string).trim(), "gi");
    const users = await UserModel.find({
      _id: { $ne: (currentUser as any)._id },
      $or: [{ name: query }, { email: query }],
    }).select("name email profilePic");
    res.json({ message: "Users found", success: true, data: users });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

export default searchUsers;
