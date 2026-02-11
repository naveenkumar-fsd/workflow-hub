import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getMyNotifications,
  NotificationResponse,
} from "@/api/notification_service";

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
  const [notifications, setNotifications] = useState<
    NotificationResponse[]
  >([]);

  const fetchNotifications = async () => {
    try {
      const res = await getMyNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error("Notification fetch failed", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // 🔁 Poll every 20 sec
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(
    (n) => !n.readStatus
  ).length;

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
