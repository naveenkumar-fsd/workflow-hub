import React from "react";
import { CheckCircle, Clock, XCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

type WorkflowStatus = "PENDING" | "APPROVED" | "REJECTED";

interface TimelineProps {
  status: WorkflowStatus;
  createdAt: string;
  approvedAt?: string | null;
  approvedBy?: {
    name: string;
  } | null;
}

const TimelineItem = ({
  icon,
  title,
  description,
  time,
  active,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  time?: string;
  active?: boolean;
}) => {
  return (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          "h-9 w-9 rounded-full flex items-center justify-center border",
          active
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-muted text-muted-foreground"
        )}
      >
        {icon}
      </div>

      <div className="flex-1">
        <p className="font-medium text-sm">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {time && (
          <p className="text-xs text-muted-foreground mt-1">{time}</p>
        )}
      </div>
    </div>
  );
};

export const RequestTimeline: React.FC<TimelineProps> = ({
  status,
  createdAt,
  approvedAt,
  approvedBy,
}) => {
  const format = (date?: string | null) =>
    date ? new Date(date).toLocaleString() : undefined;

  return (
    <div className="border rounded-lg p-4 bg-background space-y-6">
      <h3 className="text-sm font-semibold">Request Timeline</h3>

      {/* CREATED */}
      <TimelineItem
        icon={<User className="h-4 w-4" />}
        title="Request Created"
        description="Submitted by employee"
        time={format(createdAt)}
        active
      />

      {/* PENDING */}
      <TimelineItem
        icon={<Clock className="h-4 w-4" />}
        title="Pending Approval"
        description="Waiting for admin action"
        active={status === "PENDING"}
      />

      {/* APPROVED */}
      {status === "APPROVED" && (
        <TimelineItem
          icon={<CheckCircle className="h-4 w-4" />}
          title="Approved"
          description={`Approved by ${approvedBy?.name ?? "Admin"}`}
          time={format(approvedAt)}
          active
        />
      )}

      {/* REJECTED */}
      {status === "REJECTED" && (
        <TimelineItem
          icon={<XCircle className="h-4 w-4" />}
          title="Rejected"
          description={`Rejected by ${approvedBy?.name ?? "Admin"}`}
          time={format(approvedAt)}
          active
        />
      )}
    </div>
  );
};

export default RequestTimeline;