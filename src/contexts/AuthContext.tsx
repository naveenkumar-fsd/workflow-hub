import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type UserRole = 'employee' | 'manager' | 'hr' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
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

// Mock users for demonstration
const mockUsers: Record<UserRole, User> = {
  employee: {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'employee',
    department: 'Engineering',
    avatar: undefined,
  },
  manager: {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'manager',
    department: 'Engineering',
    avatar: undefined,
  },
  hr: {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    role: 'hr',
    department: 'Human Resources',
    avatar: undefined,
  },
  admin: {
    id: '4',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'admin',
    department: 'IT Administration',
    avatar: undefined,
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('workflowpro_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string, role?: UserRole) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock authentication - in real app, validate against backend
    const selectedRole = role || 'employee';
    const mockUser = mockUsers[selectedRole];
    
    setUser(mockUser);
    localStorage.setItem('workflowpro_user', JSON.stringify(mockUser));
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('workflowpro_user');
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
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
