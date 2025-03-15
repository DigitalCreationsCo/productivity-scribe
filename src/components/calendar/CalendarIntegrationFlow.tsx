
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@/components/ui/calendar';
import { useSyncCalendarEvents } from '@/services/googleCalendar';

export function CalendarIntegrationFlow() {
  const { user, isAuthenticated, setCalendarAccess, hasCalendarAccess } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // -30 days
  const [endDate, setEndDate] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // +30 days
  
  const syncMutation = useSyncCalendarEvents();

  const handleEnableCalendar = () => {
    setCalendarAccess(true);
    setStep(2);
    toast({
      title: "Calendar Integration Enabled",
      description: "Your Google Calendar has been connected successfully.",
    });
  };

  const handleSkip = () => {
    toast({
      title: "Calendar Integration Skipped",
      description: "You can enable this feature later in settings.",
    });
    navigate('/dashboard');
  };

  const handleSyncNow = async () => {
    try {
      await syncMutation.mutateAsync({
        startDate,
        endDate,
      });
      
      toast({
        title: "Calendar Data Synced",
        description: "Your events have been imported from Google Calendar.",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Calendar sync error:', error);
      toast({
        title: "Sync Failed",
        description: "There was an error syncing with Google Calendar.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <Calendar className="mr-2 h-5 w-5" />
          Calendar Integration
        </CardTitle>
        <CardDescription>
          {step === 1 
            ? "Connect your Google Calendar to see all your events in one place"
            : "Choose date range for calendar events"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {step === 1 ? (
          <>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-medium mb-2 flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  View all your calendar events
                </h3>
                <h3 className="font-medium mb-2 flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Sync tasks with your Google Calendar
                </h3>
                <h3 className="font-medium flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  Keep everything organized in one place
                </h3>
              </div>

              {!isAuthenticated && (
                <div className="text-sm text-muted-foreground p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  You need to sign in with Google before enabling calendar integration
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <DatePicker 
                selectedDate={startDate} 
                onDateChange={(date) => date && setStartDate(date)} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <DatePicker 
                selectedDate={endDate} 
                onDateChange={(date) => date && setEndDate(date)} 
              />
            </div>

            <div className="text-sm text-muted-foreground mt-4">
              This will import events between {startDate.toLocaleDateString()} and {endDate.toLocaleDateString()}.
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {step === 1 ? (
          <>
            <Button variant="outline" onClick={handleSkip}>
              Skip for now
            </Button>
            <Button 
              onClick={handleEnableCalendar}
              disabled={!isAuthenticated || hasCalendarAccess}
              className="gap-2"
            >
              Connect Calendar <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => setStep(1)} disabled={syncMutation.isPending}>
              Back
            </Button>
            <Button 
              onClick={handleSyncNow} 
              className="gap-2"
              disabled={syncMutation.isPending}
            >
              {syncMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Syncing...
                </>
              ) : (
                <>
                  Sync Now <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
