import axiosInstance from "./axios";

// src/api/workflow_service.ts

export type WorkflowType = "leave" | "expense" | "asset" | "access";
export type WorkflowStatus = "pending" | "approved" | "rejected";

export interface CreateWorkflowPayload {
  title: string;
  description: string;
  type: WorkflowType;
  priority?: "low" | "medium" | "high";
}

export interface WorkflowResponse {
  id: number;
  title: string;
  description: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  approvedAt?: string | null; // 🔥 ADD THIS
}


export const getUserWorkflows = () => {
  return axiosInstance.get<WorkflowResponse[]>("/workflows/my");
};

export const getPendingApprovals = () => {
  return axiosInstance.get<WorkflowResponse[]>("/admin/workflows/pending");
};

export const createWorkflow = (payload: CreateWorkflowPayload) => {
  return axiosInstance.post<WorkflowResponse>("/workflows", payload);
};

export const approveWorkflow = (id: number) => {
  return axiosInstance.put(`/admin/workflows/${id}/approve`);
};

export const rejectWorkflow = (id: number) => {
  return axiosInstance.put(`/admin/workflows/${id}/reject`);
};

