import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import userReducer from "../redux/slices/userSlice";
import messageReducer from "../redux/slices/messageSlice";

const rootReducer = {
  auth: authReducer,
  user: userReducer,
  message: messageReducer,
};

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
