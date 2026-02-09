import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import type { UserRole } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // 1️⃣ Loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // 2️⃣ Not logged in
  if (!isAuthenticated || !user) {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  return <Navigate to="/login" replace />;
}


  // 3️⃣ Role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn("Unauthorized access", {
      required: allowedRoles,
      actual: user.role,
    });
    return <Navigate to="/unauthorized" replace />;
  }

  // 4️⃣ OK
  return <>{children}</>;
};

export default ProtectedRoute;