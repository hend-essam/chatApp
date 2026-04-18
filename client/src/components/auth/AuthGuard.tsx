"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AuthGuard = ({ children, fallback }: AuthGuardProps) => {
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isInitialized, router]);

  // Show loading while auth state is being initialized
  if (!isInitialized) {
    return (
      fallback || (
        <div className="loading-container" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <div>Loading...</div>
        </div>
      )
    );
  }

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;