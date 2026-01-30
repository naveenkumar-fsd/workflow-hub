import { UserRole } from '@/contexts/AuthContext';

export type RequestType = 'leave' | 'expense' | 'asset' | 'access';
export type RequestStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'escalated';

export interface Request {
  id: string;
  type: RequestType;
  title: string;
  description: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    department: string;
  };
  approver?: {
    id: string;
    name: string;
  };
  metadata: {
    startDate?: string;
    endDate?: string;
    amount?: number;
    assetType?: string;
    accessLevel?: string;
  };
  timeline: {
    date: string;
    action: string;
    user: string;
    comment?: string;
  }[];
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  isOverdue?: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'approval' | 'update' | 'escalation' | 'info';
  isRead: boolean;
  createdAt: string;
  requestId?: string;
}

export interface Department {
  id: string;
  name: string;
  managerName: string;
  employeeCount: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  role: UserRole | 'custom';
  order: number;
  isRequired: boolean;
  slaHours: number;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  requestType: RequestType;
  steps: WorkflowStep[];
  isActive: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  target: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

// Mock Requests
export const mockRequests: Request[] = [
  {
    id: 'REQ-001',
    type: 'leave',
    title: 'Annual Leave Request',
    description: 'Taking time off for family vacation',
    status: 'pending',
    createdAt: '2025-01-28T10:00:00Z',
    updatedAt: '2025-01-28T10:00:00Z',
    createdBy: { id: '1', name: 'John Smith', department: 'Engineering' },
    approver: { id: '2', name: 'Sarah Johnson' },
    metadata: { startDate: '2025-02-10', endDate: '2025-02-14' },
    timeline: [
      { date: '2025-01-28T10:00:00Z', action: 'Request created', user: 'John Smith' },
      { date: '2025-01-28T10:05:00Z', action: 'Submitted for approval', user: 'John Smith' },
    ],
    priority: 'medium',
    dueDate: '2025-01-30',
  },
  {
    id: 'REQ-002',
    type: 'expense',
    title: 'Conference Travel Expense',
    description: 'Travel and accommodation for tech conference',
    status: 'approved',
    createdAt: '2025-01-25T09:00:00Z',
    updatedAt: '2025-01-26T14:00:00Z',
    createdBy: { id: '1', name: 'John Smith', department: 'Engineering' },
    approver: { id: '2', name: 'Sarah Johnson' },
    metadata: { amount: 1250 },
    timeline: [
      { date: '2025-01-25T09:00:00Z', action: 'Request created', user: 'John Smith' },
      { date: '2025-01-25T09:30:00Z', action: 'Submitted for approval', user: 'John Smith' },
      { date: '2025-01-26T14:00:00Z', action: 'Approved', user: 'Sarah Johnson', comment: 'Approved for Q1 budget' },
    ],
    priority: 'high',
  },
  {
    id: 'REQ-003',
    type: 'asset',
    title: 'New Laptop Request',
    description: 'Requesting MacBook Pro for development work',
    status: 'pending',
    createdAt: '2025-01-27T11:00:00Z',
    updatedAt: '2025-01-27T11:00:00Z',
    createdBy: { id: '5', name: 'Alex Turner', department: 'Engineering' },
    approver: { id: '2', name: 'Sarah Johnson' },
    metadata: { assetType: 'Laptop - MacBook Pro 16"', amount: 3200 },
    timeline: [
      { date: '2025-01-27T11:00:00Z', action: 'Request created', user: 'Alex Turner' },
      { date: '2025-01-27T11:15:00Z', action: 'Submitted for approval', user: 'Alex Turner' },
    ],
    priority: 'medium',
    dueDate: '2025-01-29',
    isOverdue: true,
  },
  {
    id: 'REQ-004',
    type: 'access',
    title: 'AWS Console Access',
    description: 'Need read access to production AWS environment',
    status: 'rejected',
    createdAt: '2025-01-20T15:00:00Z',
    updatedAt: '2025-01-21T10:00:00Z',
    createdBy: { id: '6', name: 'Chris Evans', department: 'Engineering' },
    approver: { id: '4', name: 'Michael Chen' },
    metadata: { accessLevel: 'Read-only' },
    timeline: [
      { date: '2025-01-20T15:00:00Z', action: 'Request created', user: 'Chris Evans' },
      { date: '2025-01-21T10:00:00Z', action: 'Rejected', user: 'Michael Chen', comment: 'Requires security training completion first' },
    ],
    priority: 'low',
  },
  {
    id: 'REQ-005',
    type: 'leave',
    title: 'Sick Leave',
    description: 'Medical appointment and recovery',
    status: 'approved',
    createdAt: '2025-01-29T08:00:00Z',
    updatedAt: '2025-01-29T09:00:00Z',
    createdBy: { id: '7', name: 'Emma Wilson', department: 'Marketing' },
    approver: { id: '8', name: 'David Brown' },
    metadata: { startDate: '2025-01-29', endDate: '2025-01-30' },
    timeline: [
      { date: '2025-01-29T08:00:00Z', action: 'Request created', user: 'Emma Wilson' },
      { date: '2025-01-29T09:00:00Z', action: 'Approved', user: 'David Brown' },
    ],
    priority: 'high',
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'NOT-001',
    title: 'New Approval Required',
    message: 'Alex Turner submitted a laptop request requiring your approval',
    type: 'approval',
    isRead: false,
    createdAt: '2025-01-29T11:00:00Z',
    requestId: 'REQ-003',
  },
  {
    id: 'NOT-002',
    title: 'Request Approved',
    message: 'Your expense request has been approved by Sarah Johnson',
    type: 'update',
    isRead: false,
    createdAt: '2025-01-26T14:00:00Z',
    requestId: 'REQ-002',
  },
  {
    id: 'NOT-003',
    title: 'SLA Breach Warning',
    message: 'Request REQ-003 is approaching SLA deadline',
    type: 'escalation',
    isRead: true,
    createdAt: '2025-01-29T10:00:00Z',
    requestId: 'REQ-003',
  },
  {
    id: 'NOT-004',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on Feb 1st, 2-4 AM UTC',
    type: 'info',
    isRead: true,
    createdAt: '2025-01-28T09:00:00Z',
  },
];

// Mock Departments
export const mockDepartments: Department[] = [
  { id: 'DEP-001', name: 'Engineering', managerName: 'Sarah Johnson', employeeCount: 45 },
  { id: 'DEP-002', name: 'Marketing', managerName: 'David Brown', employeeCount: 22 },
  { id: 'DEP-003', name: 'Human Resources', managerName: 'Emily Davis', employeeCount: 12 },
  { id: 'DEP-004', name: 'Finance', managerName: 'Robert Miller', employeeCount: 18 },
  { id: 'DEP-005', name: 'Operations', managerName: 'Lisa Anderson', employeeCount: 30 },
  { id: 'DEP-006', name: 'Sales', managerName: 'James Wilson', employeeCount: 35 },
];

// Mock Workflows
export const mockWorkflows: Workflow[] = [
  {
    id: 'WF-001',
    name: 'Standard Leave Approval',
    description: 'Default workflow for leave requests',
    requestType: 'leave',
    isActive: true,
    steps: [
      { id: 'S1', name: 'Manager Approval', role: 'manager', order: 1, isRequired: true, slaHours: 24 },
      { id: 'S2', name: 'HR Review', role: 'hr', order: 2, isRequired: true, slaHours: 48 },
    ],
  },
  {
    id: 'WF-002',
    name: 'Expense Approval',
    description: 'Workflow for expense reimbursements',
    requestType: 'expense',
    isActive: true,
    steps: [
      { id: 'S1', name: 'Manager Approval', role: 'manager', order: 1, isRequired: true, slaHours: 24 },
      { id: 'S2', name: 'Finance Review', role: 'custom', order: 2, isRequired: true, slaHours: 48 },
    ],
  },
  {
    id: 'WF-003',
    name: 'Asset Request',
    description: 'Workflow for IT asset requests',
    requestType: 'asset',
    isActive: true,
    steps: [
      { id: 'S1', name: 'Manager Approval', role: 'manager', order: 1, isRequired: true, slaHours: 24 },
      { id: 'S2', name: 'IT Admin Review', role: 'admin', order: 2, isRequired: true, slaHours: 72 },
    ],
  },
];

// Mock Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'AUD-001',
    action: 'Request Approved',
    user: 'Sarah Johnson',
    target: 'REQ-002',
    details: 'Approved expense request for conference travel',
    timestamp: '2025-01-26T14:00:00Z',
    ipAddress: '192.168.1.100',
  },
  {
    id: 'AUD-002',
    action: 'User Login',
    user: 'John Smith',
    target: 'System',
    details: 'Successful login from Chrome browser',
    timestamp: '2025-01-29T09:00:00Z',
    ipAddress: '192.168.1.105',
  },
  {
    id: 'AUD-003',
    action: 'Workflow Modified',
    user: 'Michael Chen',
    target: 'WF-001',
    details: 'Updated SLA hours for HR Review step',
    timestamp: '2025-01-28T16:30:00Z',
    ipAddress: '192.168.1.110',
  },
  {
    id: 'AUD-004',
    action: 'Request Created',
    user: 'Alex Turner',
    target: 'REQ-003',
    details: 'Created new asset request for laptop',
    timestamp: '2025-01-27T11:00:00Z',
    ipAddress: '192.168.1.120',
  },
  {
    id: 'AUD-005',
    action: 'Request Rejected',
    user: 'Michael Chen',
    target: 'REQ-004',
    details: 'Rejected access request - security training required',
    timestamp: '2025-01-21T10:00:00Z',
    ipAddress: '192.168.1.110',
  },
];

// Analytics Data
export const analyticsData = {
  requestsByStatus: [
    { name: 'Pending', value: 12, color: 'hsl(var(--warning))' },
    { name: 'Approved', value: 45, color: 'hsl(var(--success))' },
    { name: 'Rejected', value: 8, color: 'hsl(var(--destructive))' },
    { name: 'Draft', value: 5, color: 'hsl(var(--muted))' },
  ],
  requestsByType: [
    { name: 'Leave', count: 28 },
    { name: 'Expense', count: 22 },
    { name: 'Asset', count: 12 },
    { name: 'Access', count: 8 },
  ],
  approvalTrend: [
    { month: 'Aug', approved: 32, rejected: 5 },
    { month: 'Sep', approved: 38, rejected: 7 },
    { month: 'Oct', approved: 42, rejected: 4 },
    { month: 'Nov', approved: 35, rejected: 8 },
    { month: 'Dec', approved: 28, rejected: 3 },
    { month: 'Jan', approved: 45, rejected: 6 },
  ],
  avgApprovalTime: [
    { department: 'Engineering', hours: 18 },
    { department: 'Marketing', hours: 24 },
    { department: 'HR', hours: 12 },
    { department: 'Finance', hours: 36 },
    { department: 'Operations', hours: 22 },
  ],
  bottleneckApprovers: [
    { name: 'Robert Miller', pendingCount: 8, avgTime: 42 },
    { name: 'Lisa Anderson', pendingCount: 5, avgTime: 28 },
    { name: 'James Wilson', pendingCount: 4, avgTime: 24 },
  ],
};

// Request Templates
export const requestTemplates = [
  {
    id: 'TPL-001',
    name: 'Vacation Leave',
    type: 'leave' as RequestType,
    description: 'Standard vacation leave request template',
    fields: ['startDate', 'endDate', 'reason'],
  },
  {
    id: 'TPL-002',
    name: 'Business Travel',
    type: 'expense' as RequestType,
    description: 'Template for business travel expenses',
    fields: ['destination', 'purpose', 'amount', 'receipts'],
  },
  {
    id: 'TPL-003',
    name: 'New Equipment',
    type: 'asset' as RequestType,
    description: 'Request for new equipment or hardware',
    fields: ['assetType', 'justification', 'estimatedCost'],
  },
  {
    id: 'TPL-004',
    name: 'System Access',
    type: 'access' as RequestType,
    description: 'Request access to internal systems',
    fields: ['system', 'accessLevel', 'businessJustification'],
  },
];
