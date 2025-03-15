
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { GoogleAuth } from '@/components/auth/GoogleAuth';
import { Calendar, LogOut, Settings as SettingsIcon, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings = () => {
  const { user, isAuthenticated, logout, hasCalendarAccess, setCalendarAccess } = useAuth();

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences
        </p>
      </header>

      <div className="grid gap-6">
        {/* Account settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Account
            </CardTitle>
            <CardDescription>
              Manage your account settings and connected services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {user?.picture && (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-12 h-12 rounded-full"
                  />
                )}
                <div>
                  <h3 className="font-medium">{user?.name}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm">
                  Connect your Google account to enable calendar integration and other features.
                </p>
                <GoogleAuth />
              </div>
            )}
          </CardContent>
          {isAuthenticated && (
            <CardFooter>
              <Button variant="outline" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </CardFooter>
          )}
        </Card>

        {/* Calendar Integration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Calendar Integration
            </CardTitle>
            <CardDescription>
              Connect to Google Calendar to sync your tasks and events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isAuthenticated ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Google Calendar</Label>
                    <p className="text-sm text-muted-foreground">
                      Sync your tasks and events with Google Calendar
                    </p>
                  </div>
                  <Switch 
                    checked={hasCalendarAccess}
                    onCheckedChange={setCalendarAccess}
                  />
                </div>
                
                {hasCalendarAccess && (
                  <div className="pt-4">
                    <Link to="/calendar-integration">
                      <Button variant="outline" className="w-full">
                        Reconfigure Calendar Integration
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Sign in with Google to enable calendar integration
              </p>
            )}
          </CardContent>
        </Card>

        {/* General settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="mr-2 h-5 w-5" />
              General
            </CardTitle>
            <CardDescription>
              Configure general application settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for reminders and updates
                </p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark theme
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
