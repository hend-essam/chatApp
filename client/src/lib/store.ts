import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";

const rootReducer = {
  auth: authReducer,
};

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
