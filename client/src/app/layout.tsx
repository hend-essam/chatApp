import type { Metadata } from "next";
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
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
