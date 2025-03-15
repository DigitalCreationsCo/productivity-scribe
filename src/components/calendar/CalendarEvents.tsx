
import React from 'react';
import { useCalendarEvents } from '@/services/googleCalendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, RefreshCcw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

export function CalendarEvents() {
  const { hasCalendarAccess, isAuthenticated } = useAuth();
  const { data: events, isLoading, isError, refetch } = useCalendarEvents();

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Calendar Events
          </CardTitle>
          <CardDescription>
            Sign in to view and manage your calendar events
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground mb-4">
            Connect your Google account to view your calendar events
          </p>
          <Link to="/settings">
            <Button variant="outline" size="sm">
              Go to Settings
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (!hasCalendarAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Calendar Events
          </CardTitle>
          <CardDescription>
            Enable Google Calendar integration to view your events
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground mb-4">
            Connect to Google Calendar to see all your events in one place
          </p>
          <Link to="/calendar-integration">
            <Button className="gap-2">
              Connect Calendar <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Upcoming Events
          </CardTitle>
          <CardDescription>
            Your upcoming calendar events
          </CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => refetch()} 
          disabled={isLoading}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>Failed to load calendar events</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={() => refetch()}
            >
              Try again
            </Button>
          </div>
        ) : events && events.length > 0 ? (
          <div className="space-y-4">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="border-b pb-3 last:border-0">
                <h3 className="font-medium">{event.summary}</h3>
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-3.5 w-3.5" />
                  {format(parseISO(event.start.dateTime), 'MMM d, h:mm a')} - 
                  {format(parseISO(event.end.dateTime), 'h:mm a')}
                </div>
                {event.location && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.location}
                  </p>
                )}
              </div>
            ))}
            
            {events.length > 5 && (
              <div className="text-center">
                <Button variant="link" size="sm">
                  View all events
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No upcoming events</p>
            <Link to="/calendar-integration" className="block mt-4">
              <Button variant="outline" size="sm">
                Reconfigure Calendar
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
