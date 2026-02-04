import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, PlusCircle } from 'lucide-react';

export default function DashboardEmpty() {
  return (
    <div className="text-center py-16 bg-card rounded-lg border">
      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="font-semibold text-lg mb-2">No requests yet</h3>
      <p className="text-muted-foreground mb-6 max-w-xs mx-auto">No requests yet</p>
      <Link to="/create-request">
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          Create your first request
        </Button>
      </Link>
    </div>
  );
}
