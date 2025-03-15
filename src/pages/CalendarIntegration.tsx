
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleAuth } from '@/components/auth/GoogleAuth';
import { CalendarIntegrationFlow } from '@/components/calendar/CalendarIntegrationFlow';
import { useApp } from '@/contexts/AppContext';

const CalendarIntegration = () => {
  const { isAuthenticated } = useAuth();
  const { lastSyncDate } = useApp();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Connect Your Calendar</h1>
          <p className="text-muted-foreground">
            Integrate your Google Calendar to keep track of all your events
          </p>
          {lastSyncDate && (
            <p className="text-sm text-muted-foreground mt-2">
              Last synced: {lastSyncDate.toLocaleString()}
            </p>
          )}
        </div>
        
        {!isAuthenticated ? (
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-medium mb-4">Sign in to continue</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Sign in with your Google account to enable calendar integration
              </p>
              <GoogleAuth />
            </div>
          </div>
        ) : (
          <CalendarIntegrationFlow />
        )}
      </div>
    </div>
  );
};

export default CalendarIntegration;
