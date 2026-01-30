import React from 'react';
import { Request } from '@/data/mockData';
import { CheckCircle2, XCircle, Clock, FileText, Send, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface RequestTimelineProps {
  timeline: Request['timeline'];
  className?: string;
}

const actionIcons: Record<string, React.ElementType> = {
  'Request created': FileText,
  'Submitted for approval': Send,
  'Approved': CheckCircle2,
  'Rejected': XCircle,
  'Pending': Clock,
  'Escalated': AlertTriangle,
};

const actionColors: Record<string, string> = {
  'Request created': 'text-muted-foreground bg-muted',
  'Submitted for approval': 'text-primary bg-primary/10',
  'Approved': 'text-success bg-success/10',
  'Rejected': 'text-destructive bg-destructive/10',
  'Pending': 'text-warning bg-warning/10',
  'Escalated': 'text-destructive bg-destructive/10',
};

export function RequestTimeline({ timeline, className }: RequestTimelineProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="font-semibold text-sm">Activity Timeline</h3>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-4">
          {timeline.map((item, index) => {
            const actionKey = Object.keys(actionIcons).find(key => item.action.includes(key)) || 'Pending';
            const Icon = actionIcons[actionKey] || Clock;
            const colorClass = actionColors[actionKey] || actionColors['Pending'];

            return (
              <div key={index} className="relative flex gap-4 pl-2">
                <div className={cn('relative z-10 p-2 rounded-full', colorClass)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-medium">{item.action}</p>
                  <p className="text-xs text-muted-foreground">
                    by {item.user} • {format(new Date(item.date), 'MMM d, yyyy h:mm a')}
                  </p>
                  {item.comment && (
                    <p className="text-sm text-muted-foreground mt-1 italic">
                      "{item.comment}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
