import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
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
    const stored = localStorage.getItem("workflowpro_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [isLoading, setIsLoading] = useState(false);

  // 🔐 REAL LOGIN (Backend API)
  //example modify
  const login = useCallback(
  async (email: string, password: string) => {

    console.log("STEP 2: LOGIN FUNCTION CALLED", email, password); // 👈 ADD THIS

    try {
      setIsLoading(true);
      const res = await loginUser({ email, password });
      


        /**
         * Expected backend response:
         * {
         *   token: string,
         *   user: {
         *     id,
         *     name,
         *     email,
         *     role,
         *     department
         *   }
         * }
         */

        const { token, user } = res.data;

        // store token
        localStorage.setItem("token", token);

        // store user
        setUser(user);
        localStorage.setItem("workflowpro_user", JSON.stringify(user));
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

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
