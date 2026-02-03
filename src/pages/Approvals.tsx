import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RequestCard } from '@/components/dashboard/RequestCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Request } from '@/data/mockData';
import { getPendingApprovals, approveWorkflow, rejectWorkflow } from '@/api/workflow_service';

export default function Approvals() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await getPendingApprovals();
        
        interface BackendWorkflow {
          id?: string | number;
          title?: string;
          description?: string;
          type?: string;
          status?: string;
          createdAt?: string;
          createdBy?: {
            id?: string;
            name?: string;
            department?: string;
          };
          isOverdue?: boolean;
          [key: string]: unknown;
        }

        const mappedRequests: Request[] = (response.data || []).map(
          (workflow: BackendWorkflow) => ({
            id: String(workflow.id || ''),
            type: (workflow.type || 'leave') as Request['type'],
            title: workflow.title || 'Untitled Request',
            description: workflow.description || '',
            status: (workflow.status || 'pending') as Request['status'],
            createdAt: workflow.createdAt || new Date().toISOString(),
            updatedAt: workflow.createdAt || new Date().toISOString(),
            createdBy: {
              id: workflow.createdBy?.id || 'unknown',
              name: workflow.createdBy?.name || 'Unknown',
              department: workflow.createdBy?.department || 'Unknown',
            },
            metadata: {},
            timeline: [],
            priority: 'medium' as const,
            isOverdue: workflow.isOverdue || false,
          })
        );

        setRequests(mappedRequests.filter(r => r.status === 'pending'));
      } catch (error) {
        console.error('Failed to fetch approvals:', error);
        toast.error('Failed to load approvals', {
          description: 'Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  const pendingRequests = requests;
  const overdueCount = pendingRequests.filter(r => r.isOverdue).length;

  const filteredRequests = pendingRequests.filter(request => {
    if (typeFilter !== 'all' && request.type !== typeFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        request.title.toLowerCase().includes(query) ||
        request.createdBy.name.toLowerCase().includes(query) ||
        request.id.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleApprove = async (id: string) => {
    setProcessingIds(prev => new Set(prev).add(id));
    try {
      await approveWorkflow(id);
      setRequests(prev => prev.filter(r => r.id !== id));
      toast.success('Request approved', {
        description: `Request ${id} has been approved successfully.`,
      });
    } catch (error) {
      console.error('Failed to approve request:', error);
      toast.error('Failed to approve request', {
        description: 'Please try again.',
      });
    } finally {
      setProcessingIds(prev => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    }
  };

  const handleReject = async (id: string) => {
    setProcessingIds(prev => new Set(prev).add(id));
    try {
      await rejectWorkflow(id);
      setRequests(prev => prev.filter(r => r.id !== id));
      toast.error('Request rejected', {
        description: `Request ${id} has been rejected.`,
      });
    } catch (error) {
      console.error('Failed to reject request:', error);
      toast.error('Failed to reject request', {
        description: 'Please try again.',
      });
    } finally {
      setProcessingIds(prev => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading approvals...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Pending Approvals</h1>
              {overdueCount > 0 && (
                <Badge variant="escalated" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {overdueCount} overdue
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {pendingRequests.length} requests awaiting your action
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 text-warning">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold mt-1">{pendingRequests.length}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Overdue</span>
            </div>
            <p className="text-2xl font-bold mt-1">{overdueCount}</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Approved Today</span>
            </div>
            <p className="text-2xl font-bold mt-1">5</p>
          </div>
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Rejected Today</span>
            </div>
            <p className="text-2xl font-bold mt-1">1</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, requester, or ID..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="leave">Leave</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="asset">Asset</SelectItem>
              <SelectItem value="access">Access</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Request List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No pending approvals at the moment.</p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                showActions
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
