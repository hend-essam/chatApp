"use client";
import { useSelector } from "react-redux";
import { redirect } from "next/navigation";
import { RootState } from "../../lib/store";
import StoreProvider from "../StoreProvider";
import DashboardPage from "./page";

const MainLayout = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Redirect to main if authenticated
  if (isAuthenticated) {
    redirect("/main");
  }

  return (
    <StoreProvider>
      <div className="main-layout">
        <h1>side bar</h1>
        <div className="content-area">
          <header>header</header>
          <main>links</main>
        </div>
      </div>
      <DashboardPage />
    </StoreProvider>
  );
};

export default MainLayout;
