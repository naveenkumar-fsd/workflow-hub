import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const BASE_URL = "http://localhost:8081/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

/**
 * REQUEST INTERCEPTOR
 * Attach JWT token safely (Axios v1 compatible)
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    // ✅ Axios v1 correct way
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
      console.debug(
        `[Axios] ${String(config.method)?.toUpperCase()} ${config.url} → token attached`
      );
    } else {
      console.debug(
        `[Axios] ${String(config.method)?.toUpperCase()} ${config.url} → no token`
      );
    }

    // Always ensure content type
    config.headers.set("Content-Type", "application/json");

    return config;
  },
  (error) => {
    console.error("[Axios] Request error:", error);
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * Handle auth errors safely
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      console.warn("[Axios] 401 Unauthorized → redirecting to login");

      localStorage.removeItem("token");
      localStorage.removeItem("workflowpro_user");

      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    if (status === 403) {
      console.warn("[Axios] 403 Forbidden → access denied");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
