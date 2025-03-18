
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';

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
  // Add colorId for visual representation of completed tasks
  colorId?: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// API Functions
const fetchCalendarEvents = async (
  accessToken: string, 
  dateRange?: DateRange
): Promise<CalendarEvent[]> => {
  if (!accessToken) {
    throw new Error('No access token available');
  }

  let timeMin, timeMax;
  
  if (dateRange) {
    timeMin = dateRange.startDate;
    timeMax = dateRange.endDate;
  } else {
    timeMin = new Date();
    timeMin.setDate(timeMin.getDate() - 7); // 1 week ago
    
    timeMax = new Date();
    timeMax.setDate(timeMax.getDate() + 30); // 30 days from now
  }

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

// Export this function so it can be used directly in taskService
export const createCalendarEvent = async (
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

// Add function to update calendar events
export const updateCalendarEvent = async (
  accessToken: string,
  eventId: string,
  eventUpdates: Partial<CalendarEvent>
): Promise<CalendarEvent> => {
  if (!accessToken) {
    throw new Error('No access token available');
  }

  // Fetch current event first to preserve existing data
  const eventResponse = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!eventResponse.ok) {
    throw new Error('Failed to fetch calendar event for update');
  }

  const currentEvent = await eventResponse.json();
  
  // Merge current event with updates
  const updatedEvent = { ...currentEvent, ...eventUpdates };

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEvent),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update calendar event');
  }

  return response.json();
};

// Add function to delete calendar events
export const deleteCalendarEvent = async (
  accessToken: string,
  eventId: string
): Promise<void> => {
  if (!accessToken) {
    throw new Error('No access token available');
  }

  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete calendar event');
  }
};

// Hooks
export function useCalendarEvents(dateRange?: DateRange) {
  const { user, hasCalendarAccess } = useAuth();
  const { setCalendarEvents, setLastSyncDate, setIsSyncing } = useApp();
  
  return useQuery({
    queryKey: ['calendarEvents', dateRange?.startDate, dateRange?.endDate],
    queryFn: async () => {
      setIsSyncing(true);
      try {
        if (!user?.accessToken || !hasCalendarAccess) {
          return [];
        }
        
        const events = await fetchCalendarEvents(user.accessToken, dateRange);
        setCalendarEvents(events);
        setLastSyncDate(new Date());
        return events;
      } catch (error) {
        console.error('Error fetching calendar events:', error);
        return [];
      } finally {
        setIsSyncing(false);
      }
    },
    enabled: !!user?.accessToken && hasCalendarAccess,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    gcTime: 10 * 60 * 1000, // 10 minutes,
    initialData: [] // Provide empty array as initial data
  });
}

export function useCreateEvent() {
  const { user } = useAuth();
  const { calendarEvents, setCalendarEvents } = useApp();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (event: Omit<CalendarEvent, 'id'>) => {
      const newEvent = await createCalendarEvent(user?.accessToken || '', event);
      
      // Update the global calendar events state
      setCalendarEvents([...calendarEvents, newEvent]);
      
      return newEvent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
    },
  });
}

// Add hook for updating calendar events
export function useUpdateEvent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      eventId, 
      updates 
    }: { 
      eventId: string; 
      updates: Partial<CalendarEvent> 
    }) => {
      return await updateCalendarEvent(user?.accessToken || '', eventId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
    },
  });
}

// Add hook for deleting calendar events
export function useDeleteEvent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (eventId: string) => {
      await deleteCalendarEvent(user?.accessToken || '', eventId);
      return eventId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
    },
  });
}

export function useSyncCalendarEvents() {
  const { user, hasCalendarAccess } = useAuth();
  const { setIsSyncing } = useApp();
  const queryClient = useQueryClient();

  const fetchEventsInRange = async (dateRange: DateRange) => {
    if (!user?.accessToken || !hasCalendarAccess) {
      throw new Error('No access token or calendar access');
    }
    
    setIsSyncing(true);
    try {
      // Clear existing cached calendar data
      queryClient.removeQueries({ queryKey: ['calendarEvents'] });
      
      // Fetch events in the specified date range
      const events = await fetchCalendarEvents(user.accessToken, dateRange);
      
      // Update the cache
      queryClient.setQueryData(['calendarEvents', dateRange.startDate, dateRange.endDate], events);
      
      return events;
    } finally {
      setIsSyncing(false);
    }
  };

  return useMutation({
    mutationFn: fetchEventsInRange,
    onSuccess: () => {
      // After successful synchronization
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
    },
  });
}
