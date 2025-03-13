
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  name: string;
  email: string;
  picture?: string;
  accessToken?: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setCalendarAccess: (hasAccess: boolean) => void;
  hasCalendarAccess: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCalendarAccess, setHasCalendarAccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user data in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user data', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    toast({
      title: 'Logged in successfully',
      description: `Welcome, ${userData.name}!`,
    });
  };

  const logout = () => {
    setUser(null);
    setHasCalendarAccess(false);
    localStorage.removeItem('user');
    localStorage.removeItem('calendarAccess');
    navigate('/');
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully.',
    });
  };

  const setCalendarAccess = (hasAccess: boolean) => {
    setHasCalendarAccess(hasAccess);
    localStorage.setItem('calendarAccess', hasAccess ? 'true' : 'false');
  };

  useEffect(() => {
    // Check for saved calendar access in localStorage
    const savedCalendarAccess = localStorage.getItem('calendarAccess');
    if (savedCalendarAccess === 'true') {
      setHasCalendarAccess(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        setCalendarAccess,
        hasCalendarAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
