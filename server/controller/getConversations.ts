import { ConversationSchema } from "../models/ConversationModel";
import GetUserDetailsFromToken from "../helpers/getUserDetailsFromToken";

async function getConversations(req: any, res: any) {
  try {
    const token = req.cookies?.token;
    const currentUser = await GetUserDetailsFromToken(token);
    if (!currentUser || (currentUser as any).logout) {
      return res.status(401).json({ message: "Unauthorized", error: true });
    }

    const userId = (currentUser as any)._id.toString();

    const conversations = await ConversationSchema.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "name email profilePic")
      .populate("receiver", "name email profilePic")
      .populate("messages")
      .sort({ updatedAt: -1 })
      .limit(20);

    const conversationsWithCount = conversations.map((conv: any) => {
      const messages = conv.messages || [];
      const lastMessage = [...messages].sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      const unseenCount = messages.filter(
        (msg: any) => msg.msgByUserId?.toString() !== userId && !msg.seen
      ).length;
      return { ...conv.toObject(), messages: lastMessage ? [lastMessage] : [], unseenCount };
    });

    res.json({ message: "Conversations retrieved", success: true, data: conversationsWithCount });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

export default getConversations;
