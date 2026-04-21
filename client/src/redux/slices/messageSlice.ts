import { createSlice } from "@reduxjs/toolkit";

interface Message {
  _id: string;
  text: string;
  imageUrl?: string;
  videoUrl?: string;
  seen: boolean;
  createdAt: string;
}

interface Conversation {
  _id: string;
  sender: any;
  receiver: any;
  messages: Message[];
  updatedAt: string;
}

interface MessageState {
  conversations: Conversation[];
  currentMessages: Message[];
}

const initialState: MessageState = {
  conversations: [],
  currentMessages: [],
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setCurrentMessages: (state, action) => {
      state.currentMessages = action.payload;
    },
  },
});

export const { setConversations, setCurrentMessages } = messageSlice.actions;
export default messageSlice.reducer;
