import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
});

// ================= REQUEST =================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // 🚫 DO NOT LOGOUT FOR AUTH ENDPOINTS
    const isAuthEndpoint =
      url.includes("/auth/login") ||
      url.includes("/auth/register");

    if (status === 401 && !isAuthEndpoint) {
      console.warn("[Axios] 401 Unauthorized – forcing logout");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
