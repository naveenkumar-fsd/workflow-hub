import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
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
import { Search, Filter, CheckCircle2, XCircle, Clock, AlertTriangle, Loader2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { getPendingApprovals, approveWorkflow, rejectWorkflow } from '@/api/workflow_service';
import { formatDistanceToNow } from 'date-fns';

export default function Approvals() {
  // Type for backend workflow response
  interface WorkflowItem {
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

  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await getPendingApprovals();

        const mappedRequests: ApprovalRequest[] = (response.data || []).map(
  (workflow: WorkflowItem) => {
    const normalizedType = (workflow.type || 'leave').toLowerCase();

    return {
      id: String(workflow.id || ''),
      type: normalizedType,
      title: workflow.title || 'Untitled Request',
      description: workflow.description || '',
      createdAt: workflow.createdAt || new Date().toISOString(),
      createdBy: {
        name: workflow.createdBy?.name || 'Unknown',
        department: workflow.createdBy?.department || 'Unknown',
      },
      isOverdue: workflow.isOverdue || false,
    };
  }
);


        setRequests(mappedRequests);
      } catch (error) {
        console.error('[Approvals] Failed to fetch pending approvals:', error);
        toast.error('Failed to load approvals', {
          description: 'Please try again later.',
        });
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovals();
  }, []);

  const overdueCount = requests.filter(r => r.isOverdue).length;

  const filteredRequests = requests.filter(request => {
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
      await approveWorkflow(Number(id));
      setRequests(prev => prev.filter(r => r.id !== id));
      toast.success('Request approved', {
        description: `Request ${id} has been approved successfully.`,
      });
    } catch (error) {
      console.error('[Approvals] Failed to approve request:', error);
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
      await rejectWorkflow(Number(id));
      setRequests(prev => prev.filter(r => r.id !== id));
      toast.success('Request rejected', {
        description: `Request ${id} has been rejected.`,
      });
    } catch (error) {
      console.error('[Approvals] Failed to reject request:', error);
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

  // Approval card component
  const ApprovalCard = ({ request }: { request: ApprovalRequest }) => {
    const isProcessing = processingIds.has(request.id);
    
    return (
      <div className="bg-card rounded-lg border border-border p-4 hover:border-primary/50 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-base">{request.title}</h3>
              <Badge variant="outline" className="capitalize">
                {request.type}
              </Badge>
              {request.isOverdue && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Overdue
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{request.description}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>From: <strong>{request.createdBy.name}</strong></span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
              </span>
              <span>ID: {request.id}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReject(request.id)}
              disabled={isProcessing}
              className="gap-1"
            >
              {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
              Reject
            </Button>
            <Button
              size="sm"
              onClick={() => handleApprove(request.id)}
              disabled={isProcessing}
              className="gap-1 bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
              Approve
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-3" />
          <p className="text-muted-foreground">Loading pending approvals...</p>
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
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">Pending Approvals</h1>
              {overdueCount > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {overdueCount} overdue
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              {requests.length} requests awaiting your action
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 text-warning">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold mt-1">{requests.length}</p>
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
              <span className="text-sm font-medium">Request Types</span>
            </div>
            <p className="text-2xl font-bold mt-1">{new Set(requests.map(r => r.type)).size}</p>
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
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg border border-border">
              <CheckCircle2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">All caught up!</h3>
              <p className="text-muted-foreground">
                {requests.length === 0
                  ? 'No pending approvals at the moment.'
                  : 'No requests match your current filters.'}
              </p>
            </div>
          ) : (
            filteredRequests.map((request) => (
              <ApprovalCard key={request.id} request={request} />
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
