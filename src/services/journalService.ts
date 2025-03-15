
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  time: string;
  mood: string;
  moodColor: string;
  tags: string[];
  userId?: string;
  createdAt: string;
}

export interface CreateJournalEntryData {
  title: string;
  content: string;
  mood: string;
  tags?: string[];
}

// Local storage key
const STORAGE_KEY = 'journalEntries';

// Helper functions
const getEntriesFromStorage = (): JournalEntry[] => {
  try {
    const entries = localStorage.getItem(STORAGE_KEY);
    return entries ? JSON.parse(entries) : [];
  } catch (error) {
    console.error('Failed to parse journal entries:', error);
    return [];
  }
};

const saveEntriesToStorage = (entries: JournalEntry[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

// Database operations
const fetchJournalEntries = async (): Promise<JournalEntry[]> => {
  // In a real app, this would be an API call
  return getEntriesFromStorage();
};

const createJournalEntry = async (data: CreateJournalEntryData): Promise<JournalEntry> => {
  const entries = getEntriesFromStorage();
  
  const newEntry: JournalEntry = {
    id: Date.now().toString(),
    title: data.title,
    content: data.content,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    mood: data.mood,
    moodColor: getMoodColor(data.mood),
    tags: data.tags || [],
    createdAt: new Date().toISOString(),
  };
  
  const updatedEntries = [newEntry, ...entries];
  saveEntriesToStorage(updatedEntries);
  
  return newEntry;
};

const deleteJournalEntry = async (id: string): Promise<void> => {
  const entries = getEntriesFromStorage();
  const updatedEntries = entries.filter(entry => entry.id !== id);
  saveEntriesToStorage(updatedEntries);
};

// Helper to determine mood color
const getMoodColor = (mood: string): string => {
  const moodColors: Record<string, string> = {
    'energetic': 'bg-green-100 text-green-800',
    'focused': 'bg-purple-100 text-purple-800',
    'thoughtful': 'bg-blue-100 text-blue-800',
    'satisfied': 'bg-blue-100 text-blue-800',
    'hopeful': 'bg-yellow-100 text-yellow-800',
    'tired': 'bg-orange-100 text-orange-800',
    'stressed': 'bg-red-100 text-red-800',
    'calm': 'bg-teal-100 text-teal-800',
  };
  
  return moodColors[mood.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

// React Query hooks
export function useJournalEntries() {
  return useQuery({
    queryKey: ['journalEntries'],
    queryFn: fetchJournalEntries,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createJournalEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
    },
  });
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteJournalEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journalEntries'] });
    },
  });
}
