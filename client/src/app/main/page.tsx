"use client";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Chat from "./chat/page";
import Settings from "./settings/page";

const DashboardPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state: any) => state.auth);
  useEffect(() => {
    if (pathname === "/main") router.push("/main/chat");
  }, [pathname]);
  console.log("DashboardPage user:", user);
  return (
    <>
      {pathname === "/main/chat" && <Chat />}
      {pathname === "/main/settings" && <Settings />}
    </>
  );
};

export default DashboardPage;
