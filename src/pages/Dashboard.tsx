import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { StatCard } from "@/components/dashboard/StatCard";
import { RequestCard } from "@/components/dashboard/RequestCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  ArrowRight,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import type { WorkflowResponse } from "@/api/workflow_service";
import { getUserWorkflows } from "@/api/workflow_service";

/* =========================================================
   TYPES (UI MODELS ONLY)
   ========================================================= */

export type RequestStatus = "pending" | "approved" | "rejected";
export type RequestType = "leave" | "expense" | "asset" | "access";

export interface Request {
  id: string;
  type: RequestType;
  title: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
  priority: "low" | "medium" | "high";
}

/* =========================================================
   EMPLOYEE DASHBOARD
   ========================================================= */

function EmployeeDashboard({
  requests,
  loading,
}: {
  requests: Request[];
  loading: boolean;
}) {
  const pendingCount = requests.filter(r => r.status === "pending").length;
  const approvedCount = requests.filter(r => r.status === "approved").length;
  const rejectedCount = requests.filter(r => r.status === "rejected").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">
            Track your workflow requests
          </p>
        </div>

        <Link to="/create-request">
          <Button variant="hero">
            <PlusCircle className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total" value={requests.length} icon={FileText} />
        <StatCard title="Pending" value={pendingCount} icon={Clock} />
        <StatCard title="Approved" value={approvedCount} icon={CheckCircle2} />
        <StatCard title="Rejected" value={rejectedCount} icon={XCircle} />
      </div>

      {/* Recent Requests */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">Recent Requests</h2>
          <Link to="/my-requests">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No requests created yet
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.slice(0, 3).map(req => (
              <RequestCard key={req.id} request={req} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ADMIN DASHBOARD
   ========================================================= */

interface AnalyticsData {
  approvalTrend: { month: string; approved: number; rejected: number }[];
  requestsByStatus: { name: string; value: number }[];
}

function buildAnalytics(requests: Request[]): AnalyticsData {
  const pending = requests.filter(r => r.status === "pending").length;
  const approved = requests.filter(r => r.status === "approved").length;
  const rejected = requests.filter(r => r.status === "rejected").length;

  return {
    approvalTrend: [
      { month: "Jan", approved: 10, rejected: 2 },
      { month: "Feb", approved: 14, rejected: 3 },
      { month: "Mar", approved: 18, rejected: 5 },
      { month: "Apr", approved: 20, rejected: 4 },
      { month: "May", approved: 22, rejected: 6 },
    ],
    requestsByStatus: [
      { name: "Pending", value: pending },
      { name: "Approved", value: approved },
      { name: "Rejected", value: rejected },
    ],
  };
}

function AdminDashboard({
  requests,
  loading,
}: {
  requests: Request[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const analytics = buildAnalytics(requests);
  const colors = ["#facc15", "#22c55e", "#ef4444"];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-card p-6 rounded-xl border">
          <h3 className="font-semibold mb-4">Approval Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics.approvalTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="approved" fill="#22c55e" />
              <Bar dataKey="rejected" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-card p-6 rounded-xl border">
          <h3 className="font-semibold mb-4">Requests by Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analytics.requestsByStatus}
                dataKey="value"
                outerRadius={90}
              >
                {analytics.requestsByStatus.map((_, i) => (
                  <Cell key={i} fill={colors[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN DASHBOARD PAGE
   ========================================================= */

export default function Dashboard() {
  const { user } = useAuth();

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getUserWorkflows();
        const data = Array.isArray(res.data) ? res.data : [];

        const mapped: Request[] = data.map(
          (r: WorkflowResponse): Request => ({
            id: String(r.id),
            title: r.title ?? "Untitled Request",
            description: r.description ?? "",
            type: (r.type ?? "leave") as RequestType,
            status: (r.status ?? "pending") as RequestStatus,
            createdAt: r.createdAt,
            priority: "medium",
          })
        );

        setRequests(mapped);
      } catch (err) {
        setError("Failed to load dashboard");
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user?.id]);

  if (!user) return null;

  const role = user.role;

  return (
    <DashboardLayout>
      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded mb-4">
          {error}
        </div>
      )}

      {role === "EMPLOYEE" && (
        <EmployeeDashboard requests={requests} loading={loading} />
      )}

      {role === "ADMIN" && (
        <AdminDashboard requests={requests} loading={loading} />
      )}

      {!["EMPLOYEE", "ADMIN"].includes(role) && (
        <div className="text-center py-20">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold">Unsupported Role</h2>
        </div>
      )}
    </DashboardLayout>
  );
}
