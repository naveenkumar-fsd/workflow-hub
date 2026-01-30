import React from 'react';
import { Link } from 'react-router-dom';
import { Request } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  DollarSign,
  Laptop,
  Key,
  Clock,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const typeIcons = {
  leave: Calendar,
  expense: DollarSign,
  asset: Laptop,
  access: Key,
};

const typeColors = {
  leave: 'bg-info/10 text-info',
  expense: 'bg-success/10 text-success',
  asset: 'bg-warning/10 text-warning',
  access: 'bg-primary/10 text-primary',
};

interface RequestCardProps {
  request: Request;
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export function RequestCard({ request, showActions, onApprove, onReject }: RequestCardProps) {
  const Icon = typeIcons[request.type];

  return (
    <div className="bg-card rounded-xl border border-border p-4 card-hover">
      <div className="flex items-start gap-4">
        {/* Type Icon */}
        <div className={cn('p-3 rounded-lg', typeColors[request.type])}>
          <Icon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">{request.title}</h3>
                {request.isOverdue && (
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {request.id} • {request.createdBy.name}
              </p>
            </div>
            <Badge variant={request.status as any} className="capitalize">
              {request.status}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
            {request.description}
          </p>

          {/* Metadata */}
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
            </span>
            {request.metadata.startDate && request.metadata.endDate && (
              <span>
                {new Date(request.metadata.startDate).toLocaleDateString()} - {new Date(request.metadata.endDate).toLocaleDateString()}
              </span>
            )}
            {request.metadata.amount && (
              <span className="font-medium">
                ${request.metadata.amount.toLocaleString()}
              </span>
            )}
          </div>

          {/* Actions */}
          {showActions && request.status === 'pending' && (
            <div className="flex items-center gap-2 mt-4">
              <Button
                size="sm"
                variant="success"
                onClick={() => onApprove?.(request.id)}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReject?.(request.id)}
              >
                Reject
              </Button>
              <Link to={`/request/${request.id}`} className="ml-auto">
                <Button size="sm" variant="ghost">
                  Details <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          )}

          {!showActions && (
            <Link to={`/request/${request.id}`} className="inline-block mt-3">
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
