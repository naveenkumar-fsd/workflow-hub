import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

/* ============================================================
   TYPES
   ============================================================ */

/**
 * Must MATCH backend + AuthContext roles
 */
export type AllowedRole = "ADMIN" | "EMPLOYEE";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AllowedRole[];
}

/* ============================================================
   COMPONENT
   ============================================================ */

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  /* ------------------------------------------------------------
     1️⃣ While auth state is resolving
     ------------------------------------------------------------ */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------
     2️⃣ Not authenticated → Login
     ------------------------------------------------------------ */
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  /* ------------------------------------------------------------
     3️⃣ Role-based access check
     ------------------------------------------------------------ */
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      console.warn(
        "[ProtectedRoute] Access denied",
        "Required:",
        allowedRoles,
        "User role:",
        user.role
      );

      return <Navigate to="/unauthorized" replace />;
    }
  }

  /* ------------------------------------------------------------
     4️⃣ Authorized
     ------------------------------------------------------------ */
  return <>{children}</>;
};
