import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  DollarSign,
  Laptop,
  Key,
  Clock,
  ArrowRight,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

/* ============================================================
   TYPES
   ============================================================ */

export type RequestStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'draft'
  | 'escalated';

export interface MinimalRequest {
  id?: string;
  title?: string;
  description?: string;
  status?: RequestStatus;
  createdAt?: string;
  type?: string;
  lastActionBy?: string;
  lastActionAt?: string;
}

/* ============================================================
   CONSTANTS
   ============================================================ */

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  leave: Calendar,
  expense: DollarSign,
  asset: Laptop,
  access: Key,
};

const typeColors: Record<string, string> = {
  leave: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  expense: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  asset: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  access: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
};

const statusColors: Record<RequestStatus, string> = {
  pending: 'bg-warning/10 text-warning',
  approved: 'bg-success/10 text-success',
  rejected: 'bg-destructive/10 text-destructive',
  draft: 'bg-muted text-muted-foreground',
  escalated: 'bg-orange-100 text-orange-700',
};

/* ============================================================
   PROPS
   ============================================================ */

interface RequestCardProps {
  request?: MinimalRequest | null;
  showActions?: boolean;
  onApprove?: (id: string) => Promise<void> | void;
  onReject?: (id: string) => Promise<void> | void;
}

/* ============================================================
   COMPONENT
   ============================================================ */

export function RequestCard({
  request,
  showActions = false,
  onApprove,
  onReject,
}: RequestCardProps) {
  /* ------------------------------------------------------------
     SAFE DATA
     ------------------------------------------------------------ */
  const safeRequest: Required<MinimalRequest> = {
    id: request?.id ?? 'N/A',
    title: request?.title ?? 'Untitled Request',
    description: request?.description ?? '',
    status: request?.status ?? 'pending',
    createdAt: request?.createdAt ?? new Date().toISOString(),
    type: request?.type ?? 'leave',
    lastActionBy: request?.lastActionBy ?? '',
    lastActionAt: request?.lastActionAt ?? '',
  };

  const requestId = safeRequest.id;

  /* ------------------------------------------------------------
     LOCAL UI STATE (IMPORTANT 🔥)
     ------------------------------------------------------------ */
  const [localStatus, setLocalStatus] = useState<RequestStatus>(
    safeRequest.status
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const Icon = typeIcons[safeRequest.type] || FileText;
  const bgColor = typeColors[safeRequest.type] || 'bg-muted';
  const statusColor = statusColors[localStatus];

  /* ------------------------------------------------------------
     DATE FORMAT
     ------------------------------------------------------------ */
  const createdAgo = formatDistanceToNow(
    new Date(safeRequest.createdAt),
    { addSuffix: true }
  );

  /* ------------------------------------------------------------
     HANDLERS
     ------------------------------------------------------------ */
  const handleApprove = async () => {
    if (!onApprove || isProcessing) return;

    try {
      setIsProcessing(true);
      await onApprove(requestId);

      // 🔥 UX MAGIC
      setLocalStatus('approved');
    } catch (err) {
      console.error('Approve failed', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!onReject || isProcessing) return;

    try {
      setIsProcessing(true);
      await onReject(requestId);

      // 🔥 UX MAGIC
      setLocalStatus('rejected');
    } catch (err) {
      console.error('Reject failed', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const showActionButtons =
    showActions &&
    localStatus === 'pending' &&
    requestId !== 'N/A';

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <div
      className={cn(
        'bg-card rounded-xl border p-4 transition-all duration-200',
        localStatus !== 'pending' && 'opacity-90'
      )}
    >
      <div className="flex items-start gap-4">
        {/* ICON */}
        <div className={cn('p-3 rounded-lg', bgColor)}>
          <Icon className="h-5 w-5" />
        </div>

        {/* CONTENT */}
        <div className="flex-1 min-w-0">
          {/* HEADER */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-sm truncate">
                {safeRequest.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                ID: {requestId} • {createdAgo}
              </p>
            </div>

            <Badge className={cn('capitalize', statusColor)}>
              {localStatus}
            </Badge>
          </div>

          {/* DESCRIPTION */}
          {safeRequest.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {safeRequest.description}
            </p>
          )}

          {/* TIMELINE PREVIEW */}
          {localStatus !== 'pending' && (
            <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
              {localStatus === 'approved' ? (
                <CheckCircle2 className="h-3 w-3 text-success" />
              ) : (
                <XCircle className="h-3 w-3 text-destructive" />
              )}
              <span>
                {localStatus === 'approved'
                  ? 'Approved'
                  : 'Rejected'}{' '}
                by Admin
              </span>
            </div>
          )}

          {/* ACTIONS */}
          {showActionButtons && (
            <div className="flex items-center gap-2 mt-4">
              <Button
                size="sm"
                onClick={handleApprove}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Approve'
                )}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleReject}
                disabled={isProcessing}
              >
                Reject
              </Button>

              <Link to={`/request/${requestId}`} className="ml-auto">
                <Button size="sm" variant="ghost">
                  Details <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          )}

          {!showActions && (
            <Link to={`/request/${requestId}`} className="inline-block mt-3">
              <Button size="sm" variant="ghost" className="px-0 text-primary">
                View Details <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
