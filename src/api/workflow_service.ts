import axiosInstance from "./axios";

/**
 * USER – My workflows
 */
export const getUserWorkflows = () => {
  console.log("[WorkflowService] Fetching user workflows");
  return axiosInstance.get("/workflows");
};

/**
 * ADMIN – Pending approvals
 */
export const getPendingApprovals = () => {
  console.log("[WorkflowService] Fetching pending approvals");
  return axiosInstance.get("/workflows/pending");
};

/**
 * ADMIN – Approve workflow
 */
export const approveWorkflow = (id: string) => {
  console.log("[WorkflowService] Approving workflow:", id);
  return axiosInstance.put(`/workflows/${id}/approve`);
};

/**
 * ADMIN – Reject workflow
 */
export const rejectWorkflow = (id: string) => {
  console.log("[WorkflowService] Rejecting workflow:", id);
  return axiosInstance.put(`/workflows/${id}/reject`);
};

/**
 * CREATE WORKFLOW
 */
export interface CreateWorkflowPayload {
  type: string;
  title: string;
  description: string;
  priority?: "low" | "medium" | "high";
}

export const createWorkflow = (payload: CreateWorkflowPayload) => {
  console.log("[WorkflowService] Creating workflow:", payload);
  return axiosInstance.post("/workflows", payload);
};
