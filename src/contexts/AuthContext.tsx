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

  // 🔐 REAL LOGIN (Backend API)
  //example modify
  const login = async (email: string, password: string) => {
  setIsLoading(true);

  try {
    const res = await loginUser({ email, password });

    const token = res.data.token;

    // 🔥 STORE JWT
    localStorage.setItem("token", token);

    setUser({
  id: res.data.id,
  name: res.data.name,
  email: res.data.email,
  role: res.data.role,
});

    toast.success("Login successful!", {
      description: `Welcome back, ${res.data.name}!`,
    });

    setIsLoading(false);
  } catch (error) {
    setIsLoading(false);
    const errorMessage = error instanceof Error ? error.message : "Login failed. Please try again.";
    toast.error("Login failed", {
      description: errorMessage,
    });
    throw error;
  }
};


  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("workflowpro_user");
    localStorage.removeItem("token");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
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
