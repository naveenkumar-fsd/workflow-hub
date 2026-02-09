import axios from "@/api/axios";

export const getUserDashboardSummary = () =>
  axios.get("/api/dashboard/user");

export const getAdminDashboardSummary = () =>
  axios.get("/api/dashboard/admin");
