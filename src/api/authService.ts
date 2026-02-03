import api from "./axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export const loginUser = (data: LoginPayload) => {
  console.log("Logging in user with data:", data);
  return api.post("/auth/login", data);
};
