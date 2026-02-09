import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
});

// ================= REQUEST INTERCEPTOR =================
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

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // 🔥 IMPORTANT: DO NOT AUTO LOGOUT HERE
    if (status === 401) {
      console.warn("[Axios] 401 Unauthorized from:", url);
      // ❌ no localStorage clear
      // ❌ no redirect
      // ❌ no logout
    }

    return Promise.reject(error);
  }
);

export default api;
