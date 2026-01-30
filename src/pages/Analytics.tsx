import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { analyticsData, mockDepartments } from '@/data/mockData';
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
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import { Clock, TrendingUp, CheckCircle2, AlertTriangle, Users, Building2 } from 'lucide-react';

export default function Analytics() {
  const pieColors = ['hsl(var(--warning))', 'hsl(var(--success))', 'hsl(var(--destructive))', 'hsl(var(--muted))'];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Analytics & Insights</h1>
          <p className="text-muted-foreground">
            Monitor approval performance and identify bottlenecks
          </p>
        </div>

        {/* KPI Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Avg. Approval Time"
            value="18 hours"
            icon={Clock}
            change={{ value: 15, type: 'decrease' }}
          />
          <StatCard
            title="Approval Rate"
            value="85%"
            icon={CheckCircle2}
            iconColor="bg-success/10 text-success"
            change={{ value: 3, type: 'increase' }}
          />
          <StatCard
            title="Pending Requests"
            value="12"
            icon={AlertTriangle}
            iconColor="bg-warning/10 text-warning"
          />
          <StatCard
            title="Active Users"
            value="162"
            icon={Users}
            change={{ value: 8, type: 'increase' }}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Approval Trend */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-6">Monthly Approval Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.approvalTrend}>
                <defs>
                  <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="approved"
                  stroke="hsl(var(--success))"
                  fillOpacity={1}
                  fill="url(#colorApproved)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="rejected"
                  stroke="hsl(var(--destructive))"
                  fillOpacity={1}
                  fill="url(#colorRejected)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Requests by Type */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-6">Requests by Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.requestsByType} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Requests by Status */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-6">Requests by Status</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={analyticsData.requestsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
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

          {/* Avg Approval Time by Department */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold mb-6">Avg Approval Time by Department</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.avgApprovalTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="department" stroke="hsl(var(--muted-foreground))" fontSize={11} angle={-20} textAnchor="end" height={60} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit="h" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`${value} hours`, 'Avg Time']}
                />
                <Bar dataKey="hours" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottleneck Approvers */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-6">Bottleneck Approvers</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Approver</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Pending Requests</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Avg Response Time</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.bottleneckApprovers.map((approver) => (
                  <tr key={approver.name} className="border-b border-border last:border-0">
                    <td className="py-3 px-4 font-medium">{approver.name}</td>
                    <td className="py-3 px-4">{approver.pendingCount}</td>
                    <td className="py-3 px-4">{approver.avgTime} hours</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        approver.avgTime > 30 ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'
                      }`}>
                        {approver.avgTime > 30 ? 'Critical' : 'Needs Attention'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Stats */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">Department Overview</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockDepartments.map((dept) => (
              <div key={dept.id} className="p-4 bg-muted/30 rounded-lg">
                <p className="font-medium">{dept.name}</p>
                <p className="text-sm text-muted-foreground mt-1">Manager: {dept.managerName}</p>
                <p className="text-sm text-muted-foreground">{dept.employeeCount} employees</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
