import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { loginUser } from "@/api/authService";
import { toast } from "sonner";

/* 🔥 DEBUG: CONFIRM WHICH FILE IS RUNNING */
console.log("🔥 AUTH CONTEXT VERSION = 2026-02-06 FINAL");

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  /* ------------------------------------------------------------- */
  /* STATE */
  /* ------------------------------------------------------------- */

  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("workflowpro_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  /* ------------------------------------------------------------- */
  /* LOGIN */
  /* ------------------------------------------------------------- */

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const payload = await loginUser({ email, password });

      const token = String(
        payload?.token ??
          payload?.access_token ??
          ""
      ).trim();

      if (!token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("token", token);

      const rawUser = payload?.user ?? payload?.data ?? payload;

      const userData: User = {
        id: String(rawUser?.id ?? ""),
        name: String(rawUser?.name ?? "User"),
        email: String(rawUser?.email ?? email),
        role: String(rawUser?.role ?? "employee").toLowerCase() as UserRole,
        department: rawUser?.department ?? undefined,
        avatar: rawUser?.avatar ?? undefined,
      };

      localStorage.setItem("workflowpro_user", JSON.stringify(userData));
      setUser(userData);

      toast.success("Login successful", {
        description: `Welcome back, ${userData.name}`,
      });
    } catch (error) {
      console.error("[Auth] Login failed", error);
      toast.error("Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------------------------------------------------- */
  /* LOGOUT (WITH FULL TRACE) */
  /* ------------------------------------------------------------- */

  const logout = useCallback(() => {
    console.group("🔥 AUTH LOGOUT CALLED");
    console.trace("🔥 LOGOUT TRACE");
    console.groupEnd();

    setUser(null);
    localStorage.removeItem("workflowpro_user");
    localStorage.removeItem("token");
  }, []);

  /* ------------------------------------------------------------- */
  /* CONTEXT VALUE */
  /* ------------------------------------------------------------- */

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

/* ------------------------------------------------------------- */
/* HOOK */
/* ------------------------------------------------------------- */

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
