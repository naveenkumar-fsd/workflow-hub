import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import {
  getPendingApprovals,
  approveWorkflow,
  rejectWorkflow,
} from "@/api/workflow_service";
import { formatDistanceToNow } from "date-fns";

/* ================= TYPES ================= */

interface BackendWorkflow {
  id?: number | string;
  title?: string;
  description?: string;
  type?: string;
  status?: string;
  createdAt?: string;
  user?: {
    id?: number | string;
    name?: string;
    department?: string;
  };
  isOverdue?: boolean;
}

interface ApprovalRequest {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
  createdBy: {
    name: string;
    department?: string;
  };
  isOverdue: boolean;
}

/* ================= COMPONENT ================= */

export default function Approvals() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  /* ================= FETCH ================= */

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        setLoading(true);

        const res = await getPendingApprovals();
        const data = Array.isArray(res) ? res : [];

        const mapped: ApprovalRequest[] = data.map(
          (w: BackendWorkflow) => ({
            id: String(w.id ?? ""),
            title: w.title ?? "Untitled Request",
            description: w.description ?? "",
            type: String(w.type ?? "leave").toLowerCase(),
            createdAt: w.createdAt ?? new Date().toISOString(),
            createdBy: {
              name: w.user?.name ?? "Unknown",
              department: w.user?.department ?? "",
            },
            isOverdue: Boolean(w.isOverdue ?? false),
          })
        );

        setRequests(mapped);
      } catch (err) {
        console.error("[Approvals] Fetch error:", err);
        toast.error("Failed to load approvals", {
          description: "Please try again later.",
        });
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  /* ================= DERIVED ================= */

  const overdueCount = requests.filter((r) => r.isOverdue).length;

  const filteredRequests = requests.filter((r) => {
    if (typeFilter !== "all" && r.type !== typeFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.createdBy.name.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  /* ================= ACTIONS ================= */

  const handleApprove = async (id: string) => {
    const idNum = Number(id);
    if (!Number.isFinite(idNum)) {
      toast.error("Invalid request id");
      return;
    }

    setProcessingIds((p) => new Set(p).add(id));

    try {
      await approveWorkflow(idNum);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success("Request approved");
    } catch (err) {
      console.error("[Approvals] Approve error:", err);
      toast.error("Failed to approve request");
    } finally {
      setProcessingIds((p) => {
        const n = new Set(p);
        n.delete(id);
        return n;
      });
    }
  };

  const handleReject = async (id: string) => {
    const idNum = Number(id);
    if (!Number.isFinite(idNum)) {
      toast.error("Invalid request id");
      return;
    }

    setProcessingIds((p) => new Set(p).add(id));

    try {
      await rejectWorkflow(idNum);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success("Request rejected");
    } catch (err) {
      console.error("[Approvals] Reject error:", err);
      toast.error("Failed to reject request");
    } finally {
      setProcessingIds((p) => {
        const n = new Set(p);
        n.delete(id);
        return n;
      });
    }
  };

  /* ================= CARD ================= */

  const ApprovalCard = ({ r }: { r: ApprovalRequest }) => {
    const isProcessing = processingIds.has(r.id);

    return (
      <div className="bg-card border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{r.title}</h3>
              <Badge variant="outline" className="capitalize">
                {r.type}
              </Badge>
              {r.isOverdue && (
                <Badge variant="destructive" className="flex gap-1">
                  <AlertTriangle className="h-3 w-3" /> Overdue
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-2">
              {r.description}
            </p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                From: <strong>{r.createdBy.name}</strong>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDistanceToNow(new Date(r.createdAt), {
                  addSuffix: true,
                })}
              </span>
              <span>ID: {r.id}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isProcessing}
              onClick={() => handleReject(r.id)}
            >
              {isProcessing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              Reject
            </Button>

            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              disabled={isProcessing}
              onClick={() => handleApprove(r.id)}
            >
              {isProcessing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3 w-3" />
              )}
              Approve
            </Button>
          </div>
        </div>
      </div>
    );
  };

  /* ================= RENDER ================= */

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center py-16">
          <Loader2 className="h-10 w-10 animate-spin mb-2" />
          <p className="text-muted-foreground">Loading approvals…</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Pending Approvals</h1>
            {overdueCount > 0 && (
              <Badge variant="destructive">
                {overdueCount} overdue
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            {requests.length} requests awaiting action
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <Input
              placeholder="Search…"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="leave">Leave</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="asset">Asset</SelectItem>
              <SelectItem value="access">Access</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-16 border rounded-lg">
              <CheckCircle2 className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">
                No pending approvals
              </p>
            </div>
          ) : (
            filteredRequests.map((r) => (
              <ApprovalCard key={r.id} r={r} />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
