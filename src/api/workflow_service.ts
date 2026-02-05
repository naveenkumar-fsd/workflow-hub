import axiosInstance from "./axios";

/* ================= USER ================= */

// MY REQUESTS
export const getUserWorkflows = () => {
  return axiosInstance.get("/workflows/my");
};

// CREATE REQUEST
export interface CreateWorkflowPayload {
  type: string;
  title: string;
  description: string;
  priority?: "low" | "medium" | "high";
}

export const createWorkflow = (payload: CreateWorkflowPayload) => {
  return axiosInstance.post("/workflows", payload);
};


/* ================= ADMIN ================= */

// PENDING APPROVALS
export const getPendingApprovals = () => {
  return axiosInstance.get("/admin/workflows/pending");
};

// APPROVE
export const approveWorkflow = (id: number | string) => {
  const idNum = Number(id);
  const safeId = Number.isFinite(idNum) ? idNum : 0;
  return axiosInstance.put(`/admin/workflows/${safeId}/approve`);
};

// REJECT
export const rejectWorkflow = (id: number | string) => {
  const idNum = Number(id);
  const safeId = Number.isFinite(idNum) ? idNum : 0;
  return axiosInstance.put(`/admin/workflows/${safeId}/reject`);
};
