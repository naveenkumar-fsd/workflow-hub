import React from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

// Minimal request shape expected from backend
export interface MinimalRequest {
  id?: string;
  title?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  type?: string;
}

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

const defaultTypeColor = 'bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';

interface RequestCardProps {
  request?: MinimalRequest | null;
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function RequestCard({
  request,
  showActions = false,
  onApprove,
  onReject,
}: RequestCardProps) {
  // Safe default for request object - never let undefined/null propagate
  const safeRequest: Required<MinimalRequest> = {
    id: request?.id ?? 'N/A',
    title: request?.title ?? 'Untitled Request',
    description: request?.description ?? '',
    status: request?.status ?? 'unknown',
    createdAt: request?.createdAt ?? new Date().toISOString(),
    type: request?.type ?? 'leave',
  };

  // Select icon based on type, with fallback to FileText
  const Icon = typeIcons[safeRequest.type] || FileText;

  // Select color based on type, with fallback
  const bgColor = typeColors[safeRequest.type] || defaultTypeColor;

  // Safe date formatting with error handling
  let formattedDate = '';
  try {
    if (safeRequest.createdAt) {
      const date = new Date(safeRequest.createdAt);
      if (!isNaN(date.getTime())) {
        formattedDate = formatDistanceToNow(date, { addSuffix: true });
      }
    }
  } catch {
    // Silently handle date formatting errors
    formattedDate = '';
  }

  // Safe locale string formatting with error handling
  let localeDateString = '';
  try {
    if (safeRequest.createdAt) {
      const date = new Date(safeRequest.createdAt);
      if (!isNaN(date.getTime())) {
        localeDateString = date.toLocaleString();
      }
    }
  } catch {
    // Silently handle date formatting errors
    localeDateString = '';
  }

  const requestId = safeRequest.id || 'unknown';
  const isApprovalReady =
    showActions &&
    safeRequest.status === 'pending' &&
    requestId !== 'unknown' &&
    requestId !== 'N/A';

  return (
    <div className="bg-card rounded-xl border border-border p-4 transition-all duration-200 hover:shadow-md hover:border-primary/50">
      <div className="flex items-start gap-4">
        {/* Type Icon */}
        <div className={cn('p-3 rounded-lg flex-shrink-0', bgColor)}>
          <Icon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm truncate">{safeRequest.title}</h3>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {requestId}
                {localeDateString && ` • ${localeDateString}`}
              </p>
            </div>
            <Badge className="capitalize flex-shrink-0">{safeRequest.status}</Badge>
          </div>

          {/* Description */}
          {safeRequest.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {safeRequest.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            {formattedDate && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 flex-shrink-0" />
                {formattedDate}
              </span>
            )}
          </div>

          {/* Actions */}
          {isApprovalReady && (
            <div className="flex items-center gap-2 mt-4">
              <Button
                size="sm"
                variant="default"
                onClick={() => onApprove?.(requestId)}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReject?.(requestId)}
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
