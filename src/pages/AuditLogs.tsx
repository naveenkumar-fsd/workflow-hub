import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockAuditLogs } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Download, Filter, Shield, Clock } from 'lucide-react';
import { format } from 'date-fns';

const actionColors: Record<string, string> = {
  'Request Approved': 'bg-success/10 text-success',
  'Request Rejected': 'bg-destructive/10 text-destructive',
  'Request Created': 'bg-info/10 text-info',
  'User Login': 'bg-muted text-muted-foreground',
  'Workflow Modified': 'bg-warning/10 text-warning',
};

export default function AuditLogs() {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Audit Logs</h1>
            <p className="text-muted-foreground">
              Track all system activities and changes
            </p>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>

        {/* Info Banner */}
        <div className="bg-accent/50 rounded-lg p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-accent-foreground mt-0.5" />
          <div>
            <p className="font-medium text-sm">Complete Audit Trail</p>
            <p className="text-sm text-muted-foreground">
              All actions are logged with timestamps, user details, and IP addresses for compliance.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search logs..." className="pl-10" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-44">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="approval">Approvals</SelectItem>
              <SelectItem value="login">Logins</SelectItem>
              <SelectItem value="config">Config Changes</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="7d">
            <SelectTrigger className="w-full sm:w-44">
              <Clock className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Logs Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Action</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">User</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Target</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">Details</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">IP Address</th>
                </tr>
              </thead>
              <tbody>
                {mockAuditLogs.map((log) => (
                  <tr key={log.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 text-sm">
                      {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm')}
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={actionColors[log.action] || 'bg-muted'}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">{log.user}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{log.target}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground max-w-xs truncate">
                      {log.details}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground font-mono">
                      {log.ipAddress}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination placeholder */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing 1-{mockAuditLogs.length} of {mockAuditLogs.length} entries
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
