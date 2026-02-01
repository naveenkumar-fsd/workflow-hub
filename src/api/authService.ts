import api from "./axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export const loginUser = (data: LoginPayload) => {
  return api.post("/auth/login", data);
};
