
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CalendarEvent } from '@/services/googleCalendar';

// Define the App context state types
interface AppContextState {
  calendarEvents: CalendarEvent[];
  setCalendarEvents: (events: CalendarEvent[]) => void;
  clearCalendarEvents: () => void;
  lastSyncDate: Date | null;
  setLastSyncDate: (date: Date | null) => void;
  isSyncing: boolean;
  setIsSyncing: (isSyncing: boolean) => void;
}

// Create the context with a default undefined value
const AppContext = createContext<AppContextState | undefined>(undefined);

// Props for the AppProvider component
interface AppProviderProps {
  children: React.ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  // State for calendar events
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  // State for last sync date
  const [lastSyncDate, setLastSyncDate] = useState<Date | null>(null);
  // State for syncing status
  const [isSyncing, setIsSyncing] = useState(false);

  // Load events from localStorage on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    const savedSyncDate = localStorage.getItem('lastSyncDate');
    
    if (savedEvents) {
      try {
        setCalendarEvents(JSON.parse(savedEvents));
      } catch (error) {
        console.error('Failed to parse saved calendar events', error);
        localStorage.removeItem('calendarEvents');
      }
    }
    
    if (savedSyncDate) {
      try {
        setLastSyncDate(new Date(savedSyncDate));
      } catch (error) {
        console.error('Failed to parse saved sync date', error);
        localStorage.removeItem('lastSyncDate');
      }
    }
  }, []);

  // Save events to localStorage when they change
  useEffect(() => {
    if (calendarEvents.length > 0) {
      localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents));
    }
  }, [calendarEvents]);

  // Save last sync date to localStorage when it changes
  useEffect(() => {
    if (lastSyncDate) {
      localStorage.setItem('lastSyncDate', lastSyncDate.toISOString());
    }
  }, [lastSyncDate]);

  // Function to clear all calendar events
  const clearCalendarEvents = () => {
    setCalendarEvents([]);
    localStorage.removeItem('calendarEvents');
  };

  const value = {
    calendarEvents,
    setCalendarEvents,
    clearCalendarEvents,
    lastSyncDate,
    setLastSyncDate,
    isSyncing,
    setIsSyncing,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use the app context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
