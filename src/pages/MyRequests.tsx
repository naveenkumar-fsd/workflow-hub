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
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle, FileText, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { getUserWorkflows } from "@/api/workflow_service";
import { Request, RequestType, RequestStatus } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";

export default function MyRequests() {
  const { user } = useAuth();

  const [myRequests, setMyRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /* 🔹 Fetch user workflows */
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getUserWorkflows();

        interface BackendWorkflow {
          id?: string | number;
          title?: string;
          description?: string;
          type?: string;
          status?: string;
          createdAt?: string;
          [key: string]: unknown;
        }

        const mappedData: Request[] = (res.data || []).map((r: BackendWorkflow) => {
          // Safely coerce backend values to Request type
          const id = String(r.id || "");
          const type = (r.type || "leave") as RequestType;
          const status = (r.status || "pending") as RequestStatus;

          return {
            id,
            title: r.title ?? "Untitled Request",
            description: r.description ?? "",
            type,
            status,
            createdAt: r.createdAt ?? new Date().toISOString(),
            updatedAt: r.createdAt ?? new Date().toISOString(),
            createdBy: {
              id: "unknown",
              name: user?.name || "Unknown",
              department: user?.department || "Unknown",
            },
            metadata: {},
            timeline: [],
            priority: "medium" as const,
          };
        });

        setMyRequests(mappedData);
      } catch (err) {
        const axiosError = err as AxiosError;
        let errorMessage = "Failed to load requests. Please try again.";

        if (axiosError.response) {
          // Server responded with error status
          const status = axiosError.response.status;
          const data = axiosError.response.data as Record<string, unknown>;
          
          if (status === 401) {
            errorMessage = "Your session expired. Please log in again.";
          } else if (status === 403) {
            errorMessage = "You don't have permission to view requests.";
          } else if (status === 404) {
            errorMessage = "Requests endpoint not found.";
          } else if (status >= 500) {
            errorMessage = "Server error. Please try again later.";
          } else if (data?.message) {
            errorMessage = String(data.message);
          }
        } else if (axiosError.request) {
          // Request made but no response received
          errorMessage = "Network error. Please check your connection.";
        } else {
          // Error in request setup
          errorMessage = axiosError.message || "An unexpected error occurred.";
        }

        console.error("[MyRequests] Failed to fetch workflows:", err);
        setError(errorMessage);
        setMyRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  // Request type labels and colors
  const typeConfig: Record<RequestType, { label: string; color: string }> = {
    leave: { label: "Leave", color: "bg-blue-100 text-blue-800" },
    expense: { label: "Expense", color: "bg-green-100 text-green-800" },
    asset: { label: "Asset", color: "bg-purple-100 text-purple-800" },
    access: { label: "Access", color: "bg-orange-100 text-orange-800" },
  };

  // Status colors
  const statusConfig: Record<RequestStatus, string> = {
    draft: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    escalated: "bg-orange-100 text-orange-800",
  };

  // Request list item component
  const RequestItem = ({ request }: { request: Request }) => (
    <div className="bg-card rounded-lg border border-border p-4 hover:border-primary/50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-base truncate">{request.title}</h3>
            <Badge className={typeConfig[request.type].color} variant="outline">
              {typeConfig[request.type].label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">{request.description}</p>
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
            </span>
            <span>ID: {request.id}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusConfig[request.status]} variant="outline">
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Badge>
        </div>
      </div>
    </div>
  );


  /* 🔹 Group by status */
  const requestsByStatus = {
    all: myRequests,
    pending: myRequests.filter((r) => r.status === "pending"),
    approved: myRequests.filter((r) => r.status === "approved"),
    rejected: myRequests.filter((r) => r.status === "rejected"),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Requests</h1>
            <p className="text-muted-foreground">
              Track and manage your submitted requests
            </p>
          </div>
          <Link to="/create-request">
            <Button variant="hero">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-3" />
            <p className="text-muted-foreground">Loading your requests...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-destructive">Error loading requests</p>
              <p className="text-sm text-destructive/90">{error}</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <>
            {myRequests.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-lg border">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">No requests yet</h3>
                <p className="text-muted-foreground mb-6 max-w-xs mx-auto">
                  You haven't submitted any requests. Start by creating your first request.
                </p>
                <Link to="/create-request">
                  <Button>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create Request
                  </Button>
                </Link>
              </div>
            ) : (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4 max-w-md">
                  <TabsTrigger value="all">
                    All <Badge variant="secondary" className="ml-1">{myRequests.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending{" "}
                    <Badge className="ml-1">{myRequests.filter(r => r.status === "pending").length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="approved">
                    Approved{" "}
                    <Badge variant="outline" className="ml-1">{myRequests.filter(r => r.status === "approved").length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="rejected">
                    Rejected{" "}
                    <Badge variant="outline" className="ml-1">{myRequests.filter(r => r.status === "rejected").length}</Badge>
                  </TabsTrigger>
                </TabsList>

                {/* All Requests Tab */}
                <TabsContent value="all" className="mt-6">
                  <div className="space-y-3">
                    {myRequests.map((request) => (
                      <RequestItem key={request.id} request={request} />
                    ))}
                  </div>
                </TabsContent>

                {/* Pending Tab */}
                <TabsContent value="pending" className="mt-6">
                  {myRequests.filter(r => r.status === "pending").length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No pending requests</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myRequests.filter(r => r.status === "pending").map((request) => (
                        <RequestItem key={request.id} request={request} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Approved Tab */}
                <TabsContent value="approved" className="mt-6">
                  {myRequests.filter(r => r.status === "approved").length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No approved requests</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myRequests.filter(r => r.status === "approved").map((request) => (
                        <RequestItem key={request.id} request={request} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Rejected Tab */}
                <TabsContent value="rejected" className="mt-6">
                  {myRequests.filter(r => r.status === "rejected").length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No rejected requests</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {myRequests.filter(r => r.status === "rejected").map((request) => (
                        <RequestItem key={request.id} request={request} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
