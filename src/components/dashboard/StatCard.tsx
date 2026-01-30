import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function StatCard({ title, value, change, icon: Icon, iconColor, className }: StatCardProps) {
  return (
    <div className={cn('stat-card card-hover', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {change && (
            <p
              className={cn(
                'text-xs mt-1 flex items-center gap-1',
                change.type === 'increase' ? 'text-success' : 'text-destructive'
              )}
            >
              <span>{change.type === 'increase' ? '↑' : '↓'}</span>
              <span>{Math.abs(change.value)}% from last month</span>
            </p>
          )}
        </div>
        <div
          className={cn(
            'p-3 rounded-lg',
            iconColor || 'bg-primary/10 text-primary'
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
