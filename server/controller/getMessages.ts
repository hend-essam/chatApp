import { ConversationSchema } from "../models/ConversationModel";
import GetUserDetailsFromToken from "../helpers/getUserDetailsFromToken";

async function getMessages(req: any, res: any) {
  try {
    const token = req.cookies?.token;
    const currentUser = await GetUserDetailsFromToken(token);
    if (!currentUser || (currentUser as any).logout) {
      return res.status(401).json({ message: "Unauthorized", error: true });
    }

    const { conversationId } = req.params;

    const conversation = await ConversationSchema.findById(conversationId)
      .populate({
        path: "messages",
        options: { sort: { createdAt: 1 } },
      })
      .populate("sender", "name email profilePic")
      .populate("receiver", "name email profilePic");

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found", error: true });
    }

    res.json({ message: "Messages retrieved", success: true, data: conversation });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || err, error: true });
  }
}

export default getMessages;
