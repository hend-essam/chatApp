"use client";
import AuthGuard from "@/components/auth/AuthGuard";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <div className="main-layout">
        <h1>side bar</h1>
        <div className="content-area">
          <header>header</header>
          <main>links</main>
          {children}
        </div>
      </div>
    </AuthGuard>
  );
};

export default MainLayout;
