import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api",
});

// 🔥 REQUEST INTERCEPTOR – JWT ATTACH
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

// 🔥 RESPONSE INTERCEPTOR – AUTH ERRORS
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
  console.warn("[Axios] 401 Unauthorized – login expired");

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

    if (error.response?.status === 403) {
      console.warn("[Axios] 403 Forbidden – no access");
    }
    return Promise.reject(error);
  }
);

export default api;
