import React from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RequestCard } from '@/components/dashboard/RequestCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockRequests } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { PlusCircle, FileText } from 'lucide-react';

export default function MyRequests() {
  const { user } = useAuth();
  const myRequests = mockRequests.filter(r => r.createdBy.id === '1');
  
  const requestsByStatus = {
    all: myRequests,
    pending: myRequests.filter(r => r.status === 'pending'),
    approved: myRequests.filter(r => r.status === 'approved'),
    rejected: myRequests.filter(r => r.status === 'rejected'),
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Requests</h1>
            <p className="text-muted-foreground">
              Track and manage your submitted requests
            </p>
          </div>
          <Link to="/create-request">
            <Button variant="hero">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Request
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="all" className="gap-2">
              All
              <Badge variant="secondary" className="text-xs">
                {requestsByStatus.all.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="gap-2">
              Pending
              <Badge variant="pending" className="text-xs">
                {requestsByStatus.pending.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              Approved
              <Badge variant="approved" className="text-xs">
                {requestsByStatus.approved.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              Rejected
              <Badge variant="rejected" className="text-xs">
                {requestsByStatus.rejected.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {Object.entries(requestsByStatus).map(([status, requests]) => (
            <TabsContent key={status} value={status} className="mt-6">
              {requests.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No requests found</h3>
                  <p className="text-muted-foreground mb-4">
                    {status === 'all'
                      ? "You haven't submitted any requests yet."
                      : `You don't have any ${status} requests.`}
                  </p>
                  <Link to="/create-request">
                    <Button>Create your first request</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
