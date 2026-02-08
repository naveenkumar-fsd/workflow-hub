import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { loginUser, LoginResponse } from "@/api/authService";
import { toast } from "sonner";

/* ============================================================
   DEBUG – CONFIRM FILE VERSION
   ============================================================ */
console.log("🔥 AUTH CONTEXT VERSION = JWT CLEAN FINAL");

/* ============================================================
   TYPES
   ============================================================ */

/**
 * Backend sends roles in UPPERCASE
 * We keep the same to avoid mismatch
 */
export type UserRole = "ADMIN" | "EMPLOYEE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;

  // 🔥 ADD THIS (OPTIONAL)
  avatar?: string;
}


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

/* ============================================================
   CONTEXT
   ============================================================ */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ============================================================
   PROVIDER
   ============================================================ */

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  /* ------------------------------------------------------------
     STATE
     ------------------------------------------------------------ */

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  /* ------------------------------------------------------------
     RESTORE AUTH ON REFRESH
     ------------------------------------------------------------ */

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        const parsed: User = JSON.parse(storedUser);
        setUser(parsed);
      }
    } catch (err) {
      console.error("[Auth] Failed to restore session", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  }, []);

  /* ------------------------------------------------------------
     LOGIN
     ------------------------------------------------------------ */

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const data: LoginResponse = await loginUser({ email, password });

      /* ---------------- TOKEN ---------------- */
      if (!data.token) {
        throw new Error("JWT token missing in response");
      }

      localStorage.setItem("token", data.token);

      /* ---------------- USER ---------------- */
      const userData: User = {
        id: String(data.id),
        name: data.name,
        email: data.email,
        role: data.role, // ADMIN | EMPLOYEE
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      toast.success("Login successful", {
        description: `Welcome back, ${userData.name}`,
      });
    } catch (error) {
      console.error("[Auth] Login failed", error);
      toast.error("Invalid email or password");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------------------------------------------------
     LOGOUT
     ------------------------------------------------------------ */

  const logout = useCallback(() => {
    console.group("🔥 AUTH LOGOUT");
    console.trace("Logout called");
    console.groupEnd();

    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  /* ------------------------------------------------------------
     CONTEXT VALUE
     ------------------------------------------------------------ */

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* ============================================================
   HOOK
   ============================================================ */

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
