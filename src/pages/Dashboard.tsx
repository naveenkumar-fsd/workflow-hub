import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { RequestCard } from '@/components/dashboard/RequestCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockRequests, analyticsData } from '@/data/mockData';
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

function EmployeeDashboard() {
  const myRequests = mockRequests.filter(r => r.createdBy.id === '1');
  const pendingCount = myRequests.filter(r => r.status === 'pending').length;
  const approvedCount = myRequests.filter(r => r.status === 'approved').length;
  const rejectedCount = myRequests.filter(r => r.status === 'rejected').length;

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
          value={myRequests.length}
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
          {myRequests.slice(0, 3).map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ManagerDashboard() {
  const pendingApprovals = mockRequests.filter(r => r.status === 'pending');
  const overdueCount = pendingApprovals.filter(r => r.isOverdue).length;

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
          {pendingApprovals.slice(0, 4).map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              showActions
              onApprove={(id) => console.log('Approve', id)}
              onReject={(id) => console.log('Reject', id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const pieColors = ['hsl(var(--warning))', 'hsl(var(--success))', 'hsl(var(--destructive))', 'hsl(var(--muted))'];

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
          value={70}
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

  if (!user) return null;

  return (
    <DashboardLayout>
      {user.role === 'employee' && <EmployeeDashboard />}
      {user.role === 'manager' && <ManagerDashboard />}
      {(user.role === 'hr' || user.role === 'admin') && <AdminDashboard />}
    </DashboardLayout>
  );
}
