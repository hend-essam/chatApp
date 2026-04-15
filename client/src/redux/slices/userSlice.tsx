import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  onlineUsers: string[];
}

const initialState: UserState = {
  onlineUsers: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setOnlineUsers } = userSlice.actions;
export default userSlice.reducer;
