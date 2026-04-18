import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import StoreProvider from "./StoreProvider";

export const metadata: Metadata = {
  title: "Chat App",
  description: "Real-time chat application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, boxSizing: "border-box" }}>
        <AppRouterCacheProvider>
          <StoreProvider>{children}</StoreProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
