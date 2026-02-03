import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  token: string | null;
}

// Function to check if user is authenticated via cookies
const checkAuthFromCookies = (): boolean => {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("token=");
};

const initialState: AuthState = {
  isAuthenticated: checkAuthFromCookies(),
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
