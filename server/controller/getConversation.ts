import { ConversationSchema } from "../models/ConversationModel";
import GetUserDetailsFromToken from "../helpers/getUserDetailsFromToken";
import mongoose from "mongoose";

async function getConversation(req: any, res: any) {
  try {
    const token = req.cookies?.token;
    const currentUser = await GetUserDetailsFromToken(token);
    if (!currentUser || (currentUser as any).logout) {
      return res.status(401).json({ message: "Unauthorized", error: true });
    }

    const { userId } = req.params;
    const senderId = (currentUser as any)._id;

    // Validate both IDs are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ message: "Invalid user ID", error: true });
    }

    let conversation = await ConversationSchema.findOne({
      $or: [
        { sender: senderId, receiver: userId },
        { sender: userId, receiver: senderId },
      ],
    })
    .populate({
      path: "messages",
      options: { sort: { createdAt: 1 } },
    })
    .lean();

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found", error: true });
    }

    res.json({ message: "Conversation found", success: true, data: conversation });
  } catch (err: any) {
    console.error("[getConversation] Error:", err);
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

export default getConversation;
