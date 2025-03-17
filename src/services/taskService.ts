
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { createCalendarEvent } from '@/services/googleCalendar';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  category: string;
  isFromCalendar?: boolean;
}

// Local storage tasks
const LOCAL_STORAGE_KEY = 'tasks';

// Get tasks from local storage
const getLocalTasks = (): Task[] => {
  const tasksJson = localStorage.getItem(LOCAL_STORAGE_KEY);
  return tasksJson ? JSON.parse(tasksJson) : [];
};

// Save tasks to local storage
const saveLocalTasks = (tasks: Task[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
};

// Convert calendar events to tasks
const convertEventsToTasks = (calendarEvents: any[]): Task[] => {
  if (!calendarEvents || !calendarEvents.length) return [];
  
  return calendarEvents.map(event => ({
    id: event.id,
    title: event.summary,
    description: event.description || '',
    completed: false, // Calendar events are considered incomplete by default
    priority: 'medium', // Default priority
    dueDate: event.end.dateTime,
    category: 'calendar',
    isFromCalendar: true
  }));
};

// Hooks for tasks
export function useTasks() {
  const { calendarEvents } = useApp();
  const { hasCalendarAccess } = useAuth();
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => {
      const localTasks = getLocalTasks();
      
      // If calendar access is enabled, merge calendar events with local tasks
      if (hasCalendarAccess && calendarEvents.length > 0) {
        const calendarTasks = convertEventsToTasks(calendarEvents);
        
        // Filter out any local tasks that are from calendar but no longer in the calendar events
        const filteredLocalTasks = localTasks.filter(
          task => !task.isFromCalendar || calendarTasks.some(calTask => calTask.id === task.id)
        );
        
        // Merge tasks, preferring local task state (for completion status)
        const mergedTasks = calendarTasks.map(calTask => {
          const existingTask = filteredLocalTasks.find(task => task.id === calTask.id);
          return existingTask || calTask;
        });
        
        // Add non-calendar local tasks
        const nonCalendarTasks = filteredLocalTasks.filter(
          task => !task.isFromCalendar
        );
        
        return [...nonCalendarTasks, ...mergedTasks];
      }
      
      return localTasks;
    },
  });
}

export function useAddTask() {
  const queryClient = useQueryClient();
  const { user, hasCalendarAccess } = useAuth();
  
  return useMutation({
    mutationFn: async (newTask: Omit<Task, 'id'>) => {
      const task = {
        id: crypto.randomUUID(),
        ...newTask
      };
      
      // If we have calendar access, add the task to Google Calendar
      if (hasCalendarAccess && user?.accessToken && !newTask.isFromCalendar) {
        try {
          // Create a calendar event from the task
          const calendarEvent = {
            summary: task.title,
            description: task.description || '',
            start: {
              dateTime: new Date(task.dueDate).toISOString(),
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            end: {
              dateTime: new Date(new Date(task.dueDate).getTime() + 60 * 60 * 1000).toISOString(), // Add 1 hour
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
            }
          };
          
          // Create the event in Google Calendar
          const createdEvent = await createCalendarEvent(user.accessToken, calendarEvent);
          
          // Update the task with the Google Calendar event ID
          task.id = createdEvent.id;
          task.isFromCalendar = true;
        } catch (error) {
          console.error('Failed to create Google Calendar event:', error);
          // Continue with local task creation even if calendar fails
        }
      }
      
      // Add to local storage regardless
      const tasks = getLocalTasks();
      const updatedTasks = [task, ...tasks];
      saveLocalTasks(updatedTasks);
      
      return task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      
      toast({
        title: "Task Added",
        description: "Your task has been added successfully."
      });
    },
    onError: (error) => {
      console.error('Error adding task:', error);
      toast({
        title: "Failed to Add Task",
        description: "There was an error adding your task. Please try again.",
        variant: "destructive"
      });
    }
  });
}

export function useToggleTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskId: string) => {
      const tasks = getLocalTasks();
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      
      saveLocalTasks(updatedTasks);
      return updatedTasks.find(task => task.id === taskId);
    },
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (task) {
        toast({
          title: task.completed ? "Task Completed" : "Task Reopened",
          description: task.title
        });
      }
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskId: string) => {
      const tasks = getLocalTasks();
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      saveLocalTasks(updatedTasks);
      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Task Deleted",
        description: "The task has been removed."
      });
    },
  });
}
