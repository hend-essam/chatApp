import { ConversationSchema } from "../models/ConversationModel";
import GetUserDetailsFromToken from "../helpers/getUserDetailsFromToken";

async function getConversation(req: any, res: any) {
  try {
    const token = req.cookies?.token;
    const currentUser = await GetUserDetailsFromToken(token);
    if (!currentUser || (currentUser as any).logout) {
      return res.status(401).json({ message: "Unauthorized", error: true });
    }

    const { userId } = req.params;
    const senderId = (currentUser as any)._id;

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
      const newConv = await ConversationSchema.create({
        sender: senderId,
        receiver: userId,
        messages: [],
      });
      conversation = newConv.toObject();
    }

    res.json({ message: "Conversation found", success: true, data: conversation });
  } catch (err: any) {
    console.error("[getConversation] Error:", err);
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

export default getConversation;
