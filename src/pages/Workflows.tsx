import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockWorkflows, Workflow, WorkflowStep } from '@/data/mockData';
import { Plus, ArrowRight, GripVertical, Edit2, Trash2, Clock, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const roleLabels: Record<string, string> = {
  employee: 'Employee',
  manager: 'Manager',
  hr: 'HR',
  admin: 'Admin',
  custom: 'Custom Role',
};

function WorkflowStepCard({ step, index }: { step: WorkflowStep; index: number }) {
  return (
    <div className="flex items-center gap-2">
      {index > 0 && (
        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      )}
      <div className="bg-card border border-border rounded-lg p-3 flex-1">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <div className="flex-1">
            <p className="font-medium text-sm">{step.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {roleLabels[step.role] || step.role}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {step.slaHours}h SLA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {workflow.name}
              <Badge variant={workflow.isActive ? 'success' : 'secondary'}>
                {workflow.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1">{workflow.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="capitalize">
            {workflow.requestType}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {workflow.steps.map((step, index) => (
            <WorkflowStepCard key={step.id} step={step} index={index} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Workflows() {
  const [workflows] = useState(mockWorkflows);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Workflow Builder</h1>
            <p className="text-muted-foreground">
              Configure approval chains for different request types
            </p>
          </div>
          <Button variant="hero">
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </div>

        {/* Info Card */}
        <Card className="bg-accent/50 border-accent">
          <CardContent className="flex items-start gap-4 pt-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Dynamic Workflow Configuration</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Define who approves what. Set up multi-step approval chains with custom SLA times and escalation rules.
                Drag and drop steps to reorder the approval flow.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Workflows */}
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>

        {/* Visual Builder Placeholder */}
        <Card className="border-dashed border-2">
          <CardContent className="py-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Visual Workflow Builder</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-4">
              Create complex approval workflows with our drag-and-drop builder. Add conditions, parallel approvals, and custom logic.
            </p>
            <Button variant="outline">Coming Soon</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
