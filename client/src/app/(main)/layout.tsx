"use client";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";

const MainLayout = () => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <div className="main-layout">
      <h1>side bar</h1>
      <div className="content-area">
        <header>header</header>
        <main>links</main>
      </div>
    </div>
  );
};

export default MainLayout;
