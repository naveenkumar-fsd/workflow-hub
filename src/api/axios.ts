import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: true,
});

// 🔥 REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    // 🔥 Do NOT attach token for login
    if (!config.url?.includes("/api/auth/login")) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// OPTIONAL – RESPONSE LOG
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 403) {
      console.warn("[Axios] 403 Forbidden → access denied");
    }
    return Promise.reject(error);
  }
);

export default api;
