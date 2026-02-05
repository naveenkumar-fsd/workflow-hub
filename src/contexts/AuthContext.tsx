import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { loginUser } from "@/api/authService";
import { toast } from "sonner";

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
    const stored = localStorage.getItem("workflowpro_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const res = await loginUser({ email, password });

      // Extract token from response
      const token = res.data.token || res.data.access_token;
      if (!token) {
        throw new Error("No token received from server");
      }

      // Store token in localStorage - this will be picked up by axios interceptor
      localStorage.setItem("token", token);
      console.log("[Auth] Token saved to localStorage");

      // Store user info
      const userData: User = {
        id: res.data.id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role || "employee",
        department: res.data.department,
        avatar: res.data.avatar,
      };

      localStorage.setItem("workflowpro_user", JSON.stringify(userData));
      setUser(userData);

      console.log("[Auth] Login successful for user:", userData.email);
      toast.success("Login successful!", {
        description: `Welcome back, ${userData.name}!`,
      });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("[Auth] Login failed:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Login failed. Please try again.";
      toast.error("Login failed", {
        description: errorMessage,
      });
      throw error;
    }
  };

  const logout = useCallback(() => {
    console.log("[Auth] Logging out user");
    setUser(null);
    localStorage.removeItem("workflowpro_user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  }, []);

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
