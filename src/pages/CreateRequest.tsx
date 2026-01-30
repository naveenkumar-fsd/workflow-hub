import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, DollarSign, Laptop, Key, ArrowLeft, Upload, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { requestTemplates, RequestType } from '@/data/mockData';
import { toast } from 'sonner';

const requestTypes = [
  { type: 'leave' as RequestType, label: 'Leave Request', icon: Calendar, description: 'Vacation, sick leave, personal time' },
  { type: 'expense' as RequestType, label: 'Expense Request', icon: DollarSign, description: 'Reimbursements, travel costs' },
  { type: 'asset' as RequestType, label: 'Asset Request', icon: Laptop, description: 'Equipment, hardware, software' },
  { type: 'access' as RequestType, label: 'Access Request', icon: Key, description: 'System access, permissions' },
];

export default function CreateRequest() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<RequestType | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    amount: '',
    assetType: '',
    accessLevel: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Request submitted successfully!', {
      description: 'Your request has been sent for approval.',
    });
    navigate('/my-requests');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Request</h1>
            <p className="text-muted-foreground">
              {selectedType ? 'Fill in the details below' : 'Select a request type to get started'}
            </p>
          </div>
        </div>

        {!selectedType ? (
          /* Request Type Selection */
          <div className="grid sm:grid-cols-2 gap-4">
            {requestTypes.map((item) => (
              <Card
                key={item.type}
                className="cursor-pointer card-hover"
                onClick={() => setSelectedType(item.type)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-accent">
                      <item.icon className="h-5 w-5 text-accent-foreground" />
                    </div>
                    <CardTitle className="text-lg">{item.label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Request Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type indicator */}
            <div className="flex items-center gap-3 p-4 bg-accent rounded-lg">
              {(() => {
                const TypeIcon = requestTypes.find(t => t.type === selectedType)?.icon || Calendar;
                return <TypeIcon className="h-5 w-5 text-accent-foreground" />;
              })()}
              <span className="font-medium capitalize">{selectedType} Request</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => setSelectedType(null)}
              >
                Change
              </Button>
            </div>

            {/* Common Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Request Title</Label>
                <Input
                  id="title"
                  placeholder="Brief title for your request"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide details about your request..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Type-specific Fields */}
            {selectedType === 'leave' && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startDate"
                      type="date"
                      className="pl-10"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="endDate"
                      type="date"
                      className="pl-10"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedType === 'expense' && (
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-10"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            {selectedType === 'asset' && (
              <div className="space-y-2">
                <Label htmlFor="assetType">Asset Type</Label>
                <Input
                  id="assetType"
                  placeholder="e.g., MacBook Pro 16-inch, Monitor, etc."
                  value={formData.assetType}
                  onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
                  required
                />
              </div>
            )}

            {selectedType === 'access' && (
              <div className="space-y-2">
                <Label htmlFor="accessLevel">Access Level Required</Label>
                <Input
                  id="accessLevel"
                  placeholder="e.g., Read-only, Editor, Admin"
                  value={formData.accessLevel}
                  onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                  required
                />
              </div>
            )}

            {/* Attachments */}
            <div className="space-y-2">
              <Label>Attachments (Optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, PNG, JPG up to 10MB
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" variant="hero">
                Submit Request
              </Button>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
