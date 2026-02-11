import api from "@/api/axios";

export interface NotificationResponse {
  id: number;
  message: string;
  readStatus: boolean;
  createdAt: string;
}

export const getMyNotifications = () => {
  return api.get<NotificationResponse[]>("/notifications");
};

export const markNotificationAsRead = (id: number) => {
  return api.put(`/notifications/${id}/read`);
};

export const deleteNotification = (id: number) => {
  return api.delete(`/notifications/${id}`);
};