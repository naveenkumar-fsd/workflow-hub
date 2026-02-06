import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { RequestCard } from '@/components/dashboard/RequestCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import DashboardEmpty from './DashboardEmpty';
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
} from 'recharts';
import { getUserWorkflows } from '@/api/workflow_service';

// Local types (avoid importing mock data)
export type RequestStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'escalated';

export type RequestType = 'leave' | 'expense' | 'asset' | 'access';

export interface Request {
  id: string;
  type: RequestType;
  title: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    department?: string;
  };
  approver?: {
    id: string;
    name: string;
  };
  metadata: {
    startDate?: string;
    endDate?: string;
    amount?: number;
    [key: string]: unknown;
  };
  timeline: {
    date: string;
    action: string;
    user: string;
    comment?: string;
  }[];
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  isOverdue?: boolean;
}

function EmployeeDashboard({ requests, loading }: { requests: Request[]; loading: boolean }) {
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-3" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Track your requests and approvals</p>
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
        <StatCard
          title="Total Requests"
          value={requests.length}
          icon={FileText}
          change={{ value: 12, type: 'increase' }}
        />
        <StatCard
          title="Pending"
          value={pendingCount}
          icon={Clock}
          iconColor="bg-warning/10 text-warning"
        />
        <StatCard
          title="Approved"
          value={approvedCount}
          icon={CheckCircle2}
          iconColor="bg-success/10 text-success"
        />
        <StatCard
          title="Rejected"
          value={rejectedCount}
          icon={XCircle}
          iconColor="bg-destructive/10 text-destructive"
        />
      </div>

      {/* Recent Requests */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-lg">Recent Requests</h2>
          <Link to="/my-requests">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg border">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No requests yet</h3>
              <p className="text-muted-foreground mb-6 max-w-xs mx-auto">No requests yet</p>
              <Link to="/create-request">
                <Button>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create your first request
                </Button>
              </Link>
            </div>
          ) : (
            requests.slice(0, 3).map((request) => (
              <RequestCard key={request.id} request={request} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ManagerDashboard({ requests, loading }: { requests: Request[]; loading: boolean }) {
  const pendingApprovals = requests.filter(r => r.status === 'pending');
  const overdueCount = pendingApprovals.filter(r => r.isOverdue).length;

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manager Dashboard</h1>
          <p className="text-muted-foreground">Review and approve team requests</p>
        </div>
        <Link to="/approvals">
          <Button variant="hero">
            View All Approvals
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Approvals"
          value={pendingApprovals.length}
          icon={Clock}
          iconColor="bg-warning/10 text-warning"
        />
        <StatCard
          title="Overdue"
          value={overdueCount}
          icon={AlertTriangle}
          iconColor="bg-destructive/10 text-destructive"
        />
        <StatCard
          title="Approved This Week"
          value={12}
          icon={CheckCircle2}
          iconColor="bg-success/10 text-success"
          change={{ value: 8, type: 'increase' }}
        />
        <StatCard
          title="Avg. Approval Time"
          value="18h"
          icon={TrendingUp}
          change={{ value: 15, type: 'decrease' }}
        />
      </div>

      {/* Pending Approvals */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-lg">Pending Approvals</h2>
            {overdueCount > 0 && (
              <Badge variant="escalated">
                {overdueCount} overdue
              </Badge>
            )}
          </div>
        </div>
        <div className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No pending approvals</p>
          ) : (
            pendingApprovals.slice(0, 4).map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                showActions
                onApprove={(id) => console.log('Approve', id)}
                onReject={(id) => console.log('Reject', id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

interface AnalyticsData {
  approvalTrend: Array<{ month: string; approved: number; rejected: number }>;
  requestsByStatus: Array<{ name: string; value: number }>;
  bottleneckApprovers: Array<{ name: string; pendingCount: number; avgTime: number }>;
}

function generateAnalyticsData(requests: Request[]): AnalyticsData {
  // Generate approval trend (last 6 months)
  const approvalTrend: AnalyticsData['approvalTrend'] = [
    { month: 'Jan', approved: 12, rejected: 4 },
    { month: 'Feb', approved: 19, rejected: 3 },
    { month: 'Mar', approved: 15, rejected: 5 },
    { month: 'Apr', approved: 22, rejected: 6 },
    { month: 'May', approved: 18, rejected: 2 },
    { month: 'Jun', approved: 25, rejected: 4 },
  ];

  // Calculate requests by status
  const statusCounts = {
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    draft: requests.filter(r => r.status === 'draft').length,
  };

  const requestsByStatus: AnalyticsData['requestsByStatus'] = [
    { name: 'Pending', value: statusCounts.pending },
    { name: 'Approved', value: statusCounts.approved },
    { name: 'Rejected', value: statusCounts.rejected },
    { name: 'Draft', value: statusCounts.draft },
  ];

  // Bottleneck approvers (mock data as we don't have approver info in batch)
  const bottleneckApprovers: AnalyticsData['bottleneckApprovers'] = [
    { name: 'Sarah Johnson', pendingCount: 8, avgTime: 24 },
    { name: 'Mike Chen', pendingCount: 12, avgTime: 36 },
    { name: 'Emily Davis', pendingCount: 5, avgTime: 18 },
  ];

  return {
    approvalTrend,
    requestsByStatus,
    bottleneckApprovers,
  };
}

function AdminDashboard({ requests, loading }: { requests: Request[]; loading: boolean }) {
  const pieColors = ['hsl(var(--warning))', 'hsl(var(--success))', 'hsl(var(--destructive))', 'hsl(var(--muted))'];
  const analyticsData = generateAnalyticsData(requests);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and analytics</p>
        </div>
        <div className="flex gap-2">
          <Link to="/workflows">
            <Button variant="outline">Manage Workflows</Button>
          </Link>
          <Link to="/users">
            <Button variant="hero">Manage Users</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Requests"
          value={requests.length}
          icon={FileText}
          change={{ value: 18, type: 'increase' }}
        />
        <StatCard
          title="Active Users"
          value={162}
          icon={Clock}
        />
        <StatCard
          title="Approval Rate"
          value="85%"
          icon={CheckCircle2}
          iconColor="bg-success/10 text-success"
          change={{ value: 3, type: 'increase' }}
        />
        <StatCard
          title="Avg. Resolution Time"
          value="22h"
          icon={TrendingUp}
          change={{ value: 12, type: 'decrease' }}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Approval Trend */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-6">Approval Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData.approvalTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="approved" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rejected" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Requests by Status */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-6">Requests by Status</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={analyticsData.requestsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {analyticsData.requestsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {analyticsData.requestsByStatus.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: pieColors[index] }}
                />
                <span className="text-sm text-muted-foreground">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottleneck Approvers */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-6">Bottleneck Approvers</h3>
        <div className="space-y-4">
          {analyticsData.bottleneckApprovers.map((approver) => (
            <div
              key={approver.name}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
            >
              <div>
                <p className="font-medium">{approver.name}</p>
                <p className="text-sm text-muted-foreground">
                  {approver.pendingCount} pending requests
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-warning">{approver.avgTime}h</p>
                <p className="text-xs text-muted-foreground">avg. response time</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [workflows, setWorkflows] = useState<WorkflowRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch when user is available to prevent duplicate calls
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        const response = await getUserWorkflows();
        const data = Array.isArray(response.data) ? response.data : [];

        // Normalize raw API data to typed WorkflowRequest objects
        const normalizedWorkflows: WorkflowRequest[] = data.map((item: unknown) => {
          const obj = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};
          
          const id = String(obj.id ?? '');
          const title = typeof obj.title === 'string' ? obj.title : 'Untitled Request';
          const createdAt = typeof obj.createdAt === 'string' ? obj.createdAt : new Date().toISOString();
          
          // Normalize status to valid RequestStatus union
          let status: RequestStatus = 'pending';
          const rawStatus = obj.status;
          if (typeof rawStatus === 'string' && ['draft', 'pending', 'approved', 'rejected', 'escalated'].includes(rawStatus)) {
            status = rawStatus as RequestStatus;
          }

          return { id, title, status, createdAt };
        });

        setWorkflows(normalizedWorkflows);
      } catch (error) {
        console.error('Failed to fetch workflows:', error);
        setWorkflows([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user?.id]); // Only depend on user.id to prevent re-fetching on every render

  if (!user) return null;

  // Use lowercase for role comparisons
  const normalizedRole = user?.role ?? "";
  const userRole = typeof normalizedRole === 'string' ? normalizedRole.toLowerCase() : 'employee';

  // Convert WorkflowRequest items (minimal shape) into full Request objects for UI
  const mappedRequests: Request[] = workflows.map((wf) => {
    return {
      id: wf.id,
      type: 'leave',
      title: wf.title,
      description: '',
      status: wf.status,
      createdAt: wf.createdAt,
      updatedAt: wf.createdAt,
      createdBy: {
        id: 'unknown',
        name: user?.name ?? 'Unknown',
        department: user?.department ?? 'Unknown',
      },
      metadata: {},
      timeline: [],
      priority: 'medium',
      isOverdue: false,
    };
  });

  return (
    <DashboardLayout>
      {userRole === 'employee' && <EmployeeDashboard requests={mappedRequests} loading={loading} />}
      {userRole === 'manager' && <ManagerDashboard requests={mappedRequests} loading={loading} />}
      {(userRole === 'hr' || userRole === 'admin') && <AdminDashboard requests={mappedRequests} loading={loading} />}
    </DashboardLayout>
  );
}

// Backend / API response shape - normalized to minimal typed shape on fetch
export interface WorkflowRequest {
  id: string;
  title: string;
  status: RequestStatus;
  createdAt: string;
}