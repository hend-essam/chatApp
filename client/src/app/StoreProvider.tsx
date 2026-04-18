"use client";
import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../lib/store";
import { initializeAuth } from "../redux/slices/authSlice";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  useEffect(() => {
    // Initialize auth state from cookies on client side only
    storeRef.current?.dispatch(initializeAuth());
  }, []);

  return <Provider store={storeRef.current!}>{children}</Provider>;
}
