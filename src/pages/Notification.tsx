import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";

export default function Notifications() {
  const { notifications } = useNotifications();

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Notifications</h1>

        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 border rounded-lg ${
              !n.readStatus ? "bg-muted" : ""
            }`}
          >
            <p>{n.message}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(n.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        ))}

        {notifications.length === 0 && (
          <p className="text-muted-foreground">
            No notifications yet
          </p>
        )}
      </div>
    </DashboardLayout>
  );
}
