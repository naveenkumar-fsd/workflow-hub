import { Bell } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

export default function NotificationBell() {
  const { notifications, unreadCount } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative"
      >
        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-card border rounded-lg shadow-lg z-50">
          <div className="p-3 font-semibold border-b">
            Notifications
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.slice(0, 5).map((n) => (
              <div
                key={n.id}
                className={`p-3 text-sm border-b ${
                  !n.readStatus ? "bg-muted" : ""
                }`}
              >
                <p>{n.message}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(n.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="p-3 text-sm text-muted-foreground">
                No notifications
              </div>
            )}
          </div>

          <Link
            to="/notifications"
            className="block text-center p-2 text-primary text-sm"
          >
            View All
          </Link>
        </div>
      )}
    </div>
  );
}
