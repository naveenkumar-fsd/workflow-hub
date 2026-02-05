import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const BASE_URL = "http://localhost:8081/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.debug(`[Axios] Attached token to ${config.method?.toUpperCase()} ${config.url}`);
    } else {
      console.debug(`[Axios] No token found for ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error("[Axios] Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors and token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error("[Axios] 403 Forbidden - Check token validity and permissions");
    } else if (error.response?.status === 401) {
      console.error("[Axios] 401 Unauthorized - Token may be expired");
      localStorage.removeItem("token");
      localStorage.removeItem("workflowpro_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
