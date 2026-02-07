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
import { getUserWorkflows, WorkflowResponse } from '@/api/workflow_service';

// Strict TypeScript types
export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type RequestType = 'leave' | 'expense' | 'asset' | 'access';

export interface Request {
  id: string;
  type: RequestType;
  title: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

function EmployeeDashboard({ requests, loading }: { requests: Request[]; loading: boolean }) {
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-3" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          change={{ value: 0, type: 'increase' }}
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
            <div className="text-center py-16 bg-muted/30 rounded-lg border border-border">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No requests yet</h3>
              <p className="text-muted-foreground mb-6 max-w-xs mx-auto">Get started by creating your first request</p>
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

interface AnalyticsData {
  approvalTrend: Array<{ month: string; approved: number; rejected: number }>;
  requestsByStatus: Array<{ name: string; value: number }>;
}

function generateAnalyticsData(requests: Request[]): AnalyticsData {
  // Generate approval trend (last 6 months) - static for now
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
  };

  const requestsByStatus: AnalyticsData['requestsByStatus'] = [
    { name: 'Pending', value: statusCounts.pending },
    { name: 'Approved', value: statusCounts.approved },
    { name: 'Rejected', value: statusCounts.rejected },
  ];

  return {
    approvalTrend,
    requestsByStatus,
  };
}

function AdminDashboard({ requests, loading }: { requests: Request[]; loading: boolean }) {
  const pieColors = ['hsl(var(--warning))', 'hsl(var(--success))', 'hsl(var(--destructive))'];
  const analyticsData = generateAnalyticsData(requests);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-3" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          change={{ value: 0, type: 'increase' }}
        />
        <StatCard
          title="Pending"
          value={analyticsData.requestsByStatus.find(s => s.name === 'Pending')?.value ?? 0}
          icon={Clock}
          iconColor="bg-warning/10 text-warning"
        />
        <StatCard
          title="Approved"
          value={analyticsData.requestsByStatus.find(s => s.name === 'Approved')?.value ?? 0}
          icon={CheckCircle2}
          iconColor="bg-success/10 text-success"
        />
        <StatCard
          title="Rejected"
          value={analyticsData.requestsByStatus.find(s => s.name === 'Rejected')?.value ?? 0}
          icon={XCircle}
          iconColor="bg-destructive/10 text-destructive"
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
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
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
                  style={{ backgroundColor: pieColors[index % pieColors.length] }}
                />
                <span className="text-sm text-muted-foreground">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch when user is available
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getUserWorkflows();

        // Safely extract and normalize API response
        const apiData = Array.isArray(response?.data) ? response.data : [];

        // Map WorkflowResponse to Request type
        const normalizedRequests: Request[] = apiData.map((item: WorkflowResponse) => {
          // Safely access properties with fallbacks
          const id = String(item?.id ?? '');
          const title = typeof item?.title === 'string' ? item.title : 'Untitled Request';
          const description = typeof item?.description === 'string' ? item.description : '';
          const type = (item?.type && ['leave', 'expense', 'asset', 'access'].includes(item.type)) 
            ? (item.type as RequestType)
            : 'leave' as const;
          const status = (item?.status && ['pending', 'approved', 'rejected'].includes(item.status))
            ? (item.status as RequestStatus)
            : 'pending' as const;
          const createdAt = typeof item?.createdAt === 'string' 
            ? item.createdAt 
            : new Date().toISOString();

          return {
            id,
            title,
            description,
            type,
            status,
            createdAt,
            priority: 'medium' as const,
          };
        });

        setRequests(normalizedRequests);
      } catch (err) {
        console.error('Failed to fetch workflows:', err);
        setError('Failed to load requests');
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user?.id]);

  // Ensure user exists before rendering
  if (!user) {
    return null;
  }

  // Use user.role directly - AuthContext provides uppercase (ADMIN | EMPLOYEE)
  const userRole = user.role;

  return (
    <DashboardLayout>
      {userRole === 'EMPLOYEE' && (
        <EmployeeDashboard requests={requests} loading={loading} />
      )}
      {userRole === 'ADMIN' && (
        <AdminDashboard requests={requests} loading={loading} />
      )}
      {!['EMPLOYEE', 'ADMIN'].includes(userRole) && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-bold mb-2">Unsupported Role</h1>
          <p className="text-muted-foreground">Your role is not supported</p>
        </div>
      )}
    </DashboardLayout>
  );
}