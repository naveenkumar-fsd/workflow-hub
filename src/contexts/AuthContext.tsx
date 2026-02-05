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
    // 🔥 res IS ALREADY response.data
    const res = await loginUser({ email, password });

    // 🔥 CORRECT TOKEN ACCESS
    const token = res.token || res.access_token;
    if (!token) {
      throw new Error("No token received from server");
    }

    // 🔥 SAVE TOKEN
    localStorage.setItem("token", token);
    console.log("[Auth] Token saved:", token);

    // 🔥 USER DATA
    const userData: User = {
      id: res.id,
      name: res.name,
      email: res.email,
      role: res.role || "employee",
      department: res.department,
      avatar: res.avatar,
    };

    localStorage.setItem("workflowpro_user", JSON.stringify(userData));
    setUser(userData);

    toast.success("Login successful!", {
      description: `Welcome back, ${userData.name}`,
    });

  } catch (error) {
    console.error("[Auth] Login failed:", error);
    toast.error("Login failed");
    throw error;
  } finally {
    setIsLoading(false);
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
