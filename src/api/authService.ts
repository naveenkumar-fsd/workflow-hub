import axiosInstance from "./axios";

// ================================
// Types
// ================================
export interface LoginResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
}

// ================================
// LOGIN
// ================================
export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {

  const response = await axiosInstance.post("/auth/login", data);

  // 🔥 ONLY return response data
  // 🔥 localStorage handling must be in AuthContext
  return response.data;
};
