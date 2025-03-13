
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';

// Types
export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone?: string;
  };
  end: {
    dateTime: string;
    timeZone?: string;
  };
  location?: string;
}

// API Functions
const fetchCalendarEvents = async (accessToken: string): Promise<CalendarEvent[]> => {
  if (!accessToken) {
    throw new Error('No access token available');
  }

  const timeMin = new Date();
  timeMin.setDate(timeMin.getDate() - 7); // 1 week ago
  
  const timeMax = new Date();
  timeMax.setDate(timeMax.getDate() + 30); // 30 days from now

  const params = new URLSearchParams({
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: 'true',
    orderBy: 'startTime',
  });

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch calendar events');
  }

  const data = await response.json();
  return data.items as CalendarEvent[];
};

const createCalendarEvent = async (
  accessToken: string,
  event: Omit<CalendarEvent, 'id'>
): Promise<CalendarEvent> => {
  if (!accessToken) {
    throw new Error('No access token available');
  }

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create calendar event');
  }

  return response.json();
};

// Hooks
export function useCalendarEvents() {
  const { user, hasCalendarAccess } = useAuth();
  
  return useQuery({
    queryKey: ['calendarEvents'],
    queryFn: () => fetchCalendarEvents(user?.accessToken || ''),
    enabled: !!user?.accessToken && hasCalendarAccess,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
}

export function useCreateEvent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (event: Omit<CalendarEvent, 'id'>) => 
      createCalendarEvent(user?.accessToken || '', event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
    },
  });
}
