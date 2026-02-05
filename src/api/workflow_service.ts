import axiosInstance from "./axios";

export const getUserWorkflows = () => {
  console.log("[WorkflowService] Fetching user workflows");
  return axiosInstance.get("/workflows");
};

export const getPendingApprovals = () => {
  console.log("[WorkflowService] Fetching pending approvals");
  return axiosInstance.get("/workflows");
};

export const approveWorkflow = (id: string) => {
  console.log("[WorkflowService] Approving workflow:", id);
  return axiosInstance.put(`/workflows/${id}/approve`);
};

export const rejectWorkflow = (id: string) => {
  console.log("[WorkflowService] Rejecting workflow:", id);
  return axiosInstance.put(`/workflows/${id}/reject`);
};

export interface CreateWorkflowPayload {
  type: string;
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
}

export const createWorkflow = (payload: CreateWorkflowPayload) => {
  console.log("[WorkflowService] Creating workflow:", payload.title);
  return axiosInstance.post("/workflows", payload);
};
