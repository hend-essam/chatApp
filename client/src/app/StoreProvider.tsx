"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../lib/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    try {
      storeRef.current = makeStore();
    } catch (error) {
      console.error('Failed to create store:', error);
      throw new Error('Store initialization failed');
    }
  }

  return <Provider store={storeRef.current!}>{children}</Provider>;
}
