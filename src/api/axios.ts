import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const BASE_URL = "http://localhost:8081/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * REQUEST INTERCEPTOR
 * Attach JWT token if present
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.debug(
        `[Axios] ${config.method?.toUpperCase()} ${config.url} → token attached`
      );
    } else {
      console.warn(
        `[Axios] ${config.method?.toUpperCase()} ${config.url} → NO TOKEN`
      );
    }

    return config;
  },
  (error) => {
    console.error("[Axios] Request error:", error);
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Handle auth errors globally
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.error("[Axios] 401 Unauthorized → Logging out");

      localStorage.removeItem("token");
      localStorage.removeItem("workflowpro_user");

      window.location.href = "/login";
    }

    if (status === 403) {
      console.error("[Axios] 403 Forbidden → Access denied");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
