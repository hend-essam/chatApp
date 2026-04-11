import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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

// Async thunk to initialize auth and fetch user data
export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async () => {
    if (typeof document !== "undefined") {
      const hasToken = document.cookie.includes("token=");
      if (hasToken) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/userDetails`,
            { withCredentials: true },
          );
          if (response.data.success) {
            const tokenMatch = document.cookie.match(/token=([^;]+)/);
            return {
              user: response.data.data,
              token: tokenMatch ? tokenMatch[1] : null,
              isAuthenticated: true,
            };
          }
        } catch (error) {
          // If token is invalid, clear it
          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
      }
    }
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    };
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
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
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      }
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isInitialized = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.isInitialized = true;
      });
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
