import axiosInstance from "./axios";

export const loginUser = (data: { email: string; password: string }) => {
  console.log("[AuthService] Calling login API with email:", data.email);
  return axiosInstance.post("/auth/login", data);
};
