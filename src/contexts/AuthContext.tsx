import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { loginUser } from "@/api/authService";

export type UserRole = "employee" | "manager" | "hr" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("workflowpro_user");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.warn("[Auth] Failed to parse stored user", e);
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const login = async (email: string, password: string, role?: UserRole) => {
    setIsLoading(true);
    setLoginError(null);
    setLoginSuccess(false);

    try {
      const res = await loginUser({ email, password });

      // loginUser returns response.data (variable shapes depending on backend)
      const payload = res ?? {};

      // Find token in common locations
      const token =
        String(payload?.token ?? payload?.access_token ?? localStorage.getItem("token") ?? "").trim();

      if (!token) {
        console.error("[Auth] No token received from server", payload);
        throw new Error("No token received from server");
      }

      try {
        localStorage.setItem("token", token);
      } catch (e) {
        console.warn("[Auth] Failed to persist token", e);
      }

      // Normalize user object from multiple possible shapes
      const rawUser = payload?.user ?? payload?.data ?? payload;

      const userData: User = {
        id: String(rawUser?.id ?? rawUser?.userId ?? rawUser?.uid ?? "").trim(),
        name: String(rawUser?.name ?? rawUser?.fullName ?? rawUser?.username ?? "User"),
        email: String(rawUser?.email ?? email ?? "") || "",
        role: (String(rawUser?.role ?? payload?.role ?? "employee").toLowerCase() as UserRole) || "employee",
        department: String(rawUser?.department ?? "") || undefined,
        avatar: String(rawUser?.avatar ?? rawUser?.photo ?? "") || undefined,
      };

      try {
        localStorage.setItem("workflowpro_user", JSON.stringify(userData));
      } catch (e) {
        console.warn("[Auth] Failed to persist user", e);
      }

      setUser(userData);
      setLoginSuccess(true);
    } catch (error) {
      console.error("[Auth] Login failed:", error);
      const errorMsg = error instanceof Error ? error.message : "Login failed";
      setLoginError(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  const logout = useCallback(() => {
    console.log("[Auth] Logging out user");
    setUser(null);
    setLoginSuccess(false);
    setLoginError(null);
    localStorage.removeItem("workflowpro_user");
    localStorage.removeItem("token");
  }, []);


  // Emit success/error events via useEffect instead of render-time
  useEffect(() => {
    if (loginSuccess && user) {
      // Import toast dynamically in effect to avoid render-time side effects
      import("sonner").then(({ toast }) => {
        toast.success("Login successful!", {
          description: `Welcome back, ${user.name}`,
        });
      });
      setLoginSuccess(false);
    }
  }, [loginSuccess, user]);

  useEffect(() => {
    if (loginError) {
      import("sonner").then(({ toast }) => {
        toast.error("Login failed", {
          description: loginError,
        });
      });
    }
  }, [loginError]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
