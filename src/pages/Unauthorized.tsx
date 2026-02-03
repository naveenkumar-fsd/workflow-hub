import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock } from 'lucide-react';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-6 bg-destructive/10 rounded-full">
            <Lock className="h-16 w-16 text-destructive" />
          </div>
        </div>

        {/* Status Code */}
        <div>
          <h1 className="text-7xl font-bold text-foreground mb-2">403</h1>
          <p className="text-2xl font-semibold text-foreground">Unauthorized</p>
        </div>

        {/* Message */}
        <div>
          <p className="text-lg text-muted-foreground mb-2">
            You are not authorized to access this page
          </p>
          <p className="text-sm text-muted-foreground">
            Your user role does not have permission to view this resource. Contact your administrator if you believe this is an error.
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => navigate('/dashboard')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Go back to Dashboard
        </Button>
      </div>
    </div>
  );
}
