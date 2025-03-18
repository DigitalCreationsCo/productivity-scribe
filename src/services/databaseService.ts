
// A simple remote database simulation using localStorage with API-like behavior
// In a real application, this would connect to a real backend service

// Types
export interface DatabaseRecord {
  id: string;
  [key: string]: any;
}

export interface DatabaseCollection<T extends DatabaseRecord> {
  getAll: () => Promise<T[]>;
  getById: (id: string) => Promise<T | null>;
  create: (data: Omit<T, 'id'>) => Promise<T>;
  update: (id: string, data: Partial<T>) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

// Helper function to generate a UUID
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Create a database collection
export const createCollection = <T extends DatabaseRecord>(collectionName: string): DatabaseCollection<T> => {
  // Helper function to get the current data
  const getData = (): T[] => {
    try {
      const data = localStorage.getItem(collectionName);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Failed to parse ${collectionName} data:`, error);
      return [];
    }
  };

  // Helper function to save data
  const saveData = (data: T[]): void => {
    localStorage.setItem(collectionName, JSON.stringify(data));
  };

  return {
    getAll: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100));
      return getData();
    },

    getById: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      const items = getData();
      return items.find(item => item.id === id) || null;
    },

    create: async (data: Omit<T, 'id'>) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      const items = getData();
      const newItem = { ...data, id: generateUUID() } as T;
      
      saveData([newItem, ...items]);
      return newItem;
    },

    update: async (id: string, data: Partial<T>) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      const items = getData();
      
      const index = items.findIndex(item => item.id === id);
      if (index === -1) {
        throw new Error(`Item with id ${id} not found`);
      }
      
      const updatedItem = { ...items[index], ...data };
      items[index] = updatedItem;
      
      saveData(items);
      return updatedItem;
    },

    delete: async (id: string) => {
      await new Promise(resolve => setTimeout(resolve, 100));
      const items = getData();
      
      const filteredItems = items.filter(item => item.id !== id);
      saveData(filteredItems);
    }
  };
};
