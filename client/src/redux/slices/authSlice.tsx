import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  token: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initializeAuth: (state) => {
      if (typeof document !== "undefined") {
        const hasToken = document.cookie.includes("token=");
        state.isAuthenticated = hasToken;
        if (hasToken) {
          const tokenMatch = document.cookie.match(/token=([^;]+)/);
          state.token = tokenMatch ? tokenMatch[1] : null;
        }
      }
      state.isInitialized = true;
    },
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isInitialized = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      // Clear cookie
      if (typeof document !== "undefined") {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    },
  },
});

export const { initializeAuth, login, logout } = authSlice.actions;
export default authSlice.reducer;
