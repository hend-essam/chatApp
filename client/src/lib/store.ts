import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import userReducer from "../redux/slices/userSlice";

const rootReducer = {
  auth: authReducer,
  user: userReducer,
};

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
