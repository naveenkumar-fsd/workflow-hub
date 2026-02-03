import api from "./axios";

export const getUserWorkflows = () => {
  return api.get("/user/workflows");
};

export const getPendingApprovals = () => {
  return api.get("/admin/workflows");
};

export const approveWorkflow = (id: string) => {
  return api.put(`/admin/workflows/${id}/approve`);
};

export const rejectWorkflow = (id: string) => {
  return api.put(`/admin/workflows/${id}/reject`);
};
