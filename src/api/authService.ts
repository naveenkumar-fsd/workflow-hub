import axiosInstance from "./axios";

export const loginUser = async (data: { email: string; password: string }) => {
  console.log("[AuthService] Calling login API with email:", data.email);

  const response = await axiosInstance.post("/auth/login", data);

  // 🔥🔥🔥 THIS IS THE MISSING LINE
  const token = response.data.token;

  if (token) {
    localStorage.setItem("token", response.data.token);
    console.log("[AuthService] Token saved to localStorage");
  } else {
    console.error("[AuthService] Token NOT found in response", response.data);
  }

  // optional – store user details
  localStorage.setItem("workflowpro_user", JSON.stringify(response.data));

  return response.data;
};
