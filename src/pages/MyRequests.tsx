import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PlusCircle, FileText, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { getUserWorkflows, WorkflowResponse } from "@/api/workflow_service";
import { formatDistanceToNow } from "date-fns";

type RequestStatus = "pending" | "approved" | "rejected";
type RequestType = "leave" | "expense" | "asset" | "access";

interface RequestItem {
  id: string;
  title: string;
  description: string;
  type: RequestType;
  status: RequestStatus;
  createdAt: string;
}

export default function MyRequests() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getUserWorkflows();

        // 🔥 VERY IMPORTANT
        const data = Array.isArray(res.data) ? res.data : [];

        const mapped: RequestItem[] = data.map((r: WorkflowResponse) => ({
  id: String(r.id),
  title: r.title,
  description: r.description,
  type: r.type,
  status: r.status,
  createdAt: r.createdAt,
}));


        setRequests(mapped);
      } catch (err) {
        const e = err as AxiosError;
        console.error("[MyRequests] API error:", e);
        setError("Failed to load requests. Please try again.");
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const statusColor: Record<RequestStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const typeLabel: Record<RequestType, string> = {
    leave: "Leave",
    expense: "Expense",
    asset: "Asset",
    access: "Access",
  };

  const RequestCard = ({ r }: { r: RequestItem }) => (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-semibold">{r.title}</h3>
          <p className="text-sm text-muted-foreground">{r.description}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
            </span>
            <span>ID: {r.id}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 items-end">
          <Badge variant="outline">{typeLabel[r.type]}</Badge>
          <Badge className={statusColor[r.status]} variant="outline">
            {r.status.toUpperCase()}
          </Badge>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">My Requests</h1>
            <p className="text-muted-foreground">
              Track and manage your submitted requests
            </p>
          </div>
          <Link to="/create-request">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p className="text-muted-foreground">Loading requests...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {requests.length === 0 ? (
              <div className="text-center py-16 border rounded-lg">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No requests yet</p>
              </div>
            ) : (
              <Tabs defaultValue="all">
                <TabsList className="grid grid-cols-4 max-w-md">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>

                {["all", "pending", "approved", "rejected"].map((s) => (
                  <TabsContent key={s} value={s} className="mt-4 space-y-3">
                    {requests
                      .filter((r) => s === "all" || r.status === s)
                      .map((r) => (
                        <RequestCard key={r.id} r={r} />
                      ))}
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
