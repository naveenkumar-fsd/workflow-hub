import api from "./axios";

export const getUserWorkflows = () => {
  return api.get("/user/workflows");
};
