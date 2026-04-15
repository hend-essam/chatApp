import UserModel from "../models/UserModel";
import GetUserDetailsFromToken from "../helpers/getUserDetailsFromToken";

async function getUsers(req: any, res: any) {
  try {
    const token = req.cookies?.token;
    const currentUser = await GetUserDetailsFromToken(token);
    if (!currentUser || (currentUser as any).logout) {
      return res.status(401).json({ message: "Unauthorized", error: true });
    }

    const users = await UserModel.find({
      _id: { $ne: (currentUser as any)._id },
    }).select("name email profilePic");
    res.json({ message: "Users retrieved", success: true, data: users });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

export default getUsers;
