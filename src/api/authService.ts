import axios from "axios";

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
// AUTH AXIOS (NO INTERCEPTOR)
// ================================
const authApi = axios.create({
  baseURL: "http://localhost:8081/api",
});

// ================================
// LOGIN
// ================================
export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<LoginResponse> => {
  const response = await authApi.post("/auth/login", data);
  return response.data;
};
