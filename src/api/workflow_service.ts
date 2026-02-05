import axiosInstance from "./axios";

/* ============================
   USER – MY REQUESTS
============================ */
export const getUserWorkflows = () => {
  console.log("[WorkflowService] Fetching MY workflows");
  return axiosInstance.get("/workflows/my");
};

/* ============================
   ADMIN – PENDING APPROVALS
============================ */
export const getPendingApprovals = () => {
  console.log("[WorkflowService] Fetching pending approvals");
  return axiosInstance.get("/admin/workflows/pending");
};

/* ============================
   CREATE WORKFLOW
============================ */
export interface CreateWorkflowPayload {
  type: string;
  title: string;
  description: string;
  priority?: "low" | "medium" | "high";
}

export const createWorkflow = (payload: CreateWorkflowPayload) => {
  console.log("[WorkflowService] Creating workflow:", payload.title);
  return axiosInstance.post("/workflows", payload);
};

/* ============================
   ADMIN – APPROVE / REJECT
============================ */
export const approveWorkflow = (id: number) => {
  console.log("[WorkflowService] Approving workflow:", id);
  return axiosInstance.put(`/admin/workflows/${id}/approve`);
};

export const rejectWorkflow = (id: number) => {
  console.log("[WorkflowService] Rejecting workflow:", id);
  return axiosInstance.put(`/admin/workflows/${id}/reject`);
};
