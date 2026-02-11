import React, { createContext, useContext, useEffect, useState } from "react";
import { getMyNotifications } from "@/api/notification_service";
import { useAuth } from "@/contexts/AuthContext";

export interface NotificationResponse {
  id: number;
  message: string;
  readStatus: boolean;
  createdAt: string;
}

interface NotificationContextType {
  notifications: NotificationResponse[];
  unreadCount: number;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;

    try {
      const res = await getMyNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.warn("Notification fetch failed");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const unreadCount = notifications.filter(n => !n.readStatus).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, refresh: fetchNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within provider");
  }
  return ctx;
};
