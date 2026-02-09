import axios from "@/api/axios";

export const approveWorkflow = (id: number) =>
  axios.put(`/api/admin/workflows/${id}/approve`);

export const rejectWorkflow = (id: number) =>
  axios.put(`/api/admin/workflows/${id}/reject`);

export const deleteWorkflow = (id: number) =>
  axios.delete(`/api/admin/workflows/${id}`);