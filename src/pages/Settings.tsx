
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const Settings = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    taskReminders: true,
    journalReminders: false,
    weeklyReport: true,
  });

  const [appearance, setAppearance] = useState({
    darkMode: false,
    compactView: false,
  });

  const [privacy, setPrivacy] = useState({
    anonymousData: true,
    publicProfile: false,
  });

  const saveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Control how and when you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-muted-foreground text-sm">Receive emails about account activity</p>
            </div>
            <Switch
              id="email-notifications"
              checked={notifications.email}
              onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-muted-foreground text-sm">Receive push notifications on your devices</p>
            </div>
            <Switch
              id="push-notifications"
              checked={notifications.push}
              onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="task-reminders">Task Reminders</Label>
              <p className="text-muted-foreground text-sm">Get reminders about upcoming tasks</p>
            </div>
            <Switch
              id="task-reminders"
              checked={notifications.taskReminders}
              onCheckedChange={(checked) => setNotifications({ ...notifications, taskReminders: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="journal-reminders">Journal Reminders</Label>
              <p className="text-muted-foreground text-sm">Daily reminders to write in your journal</p>
            </div>
            <Switch
              id="journal-reminders"
              checked={notifications.journalReminders}
              onCheckedChange={(checked) => setNotifications({ ...notifications, journalReminders: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-report">Weekly Report</Label>
              <p className="text-muted-foreground text-sm">Get weekly summaries of your productivity</p>
            </div>
            <Switch
              id="weekly-report"
              checked={notifications.weeklyReport}
              onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReport: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the app looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-muted-foreground text-sm">Use dark theme across the application</p>
            </div>
            <Switch
              id="dark-mode"
              checked={appearance.darkMode}
              onCheckedChange={(checked) => setAppearance({ ...appearance, darkMode: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="compact-view">Compact View</Label>
              <p className="text-muted-foreground text-sm">Display more content with less spacing</p>
            </div>
            <Switch
              id="compact-view"
              checked={appearance.compactView}
              onCheckedChange={(checked) => setAppearance({ ...appearance, compactView: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
          <CardDescription>Manage your privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="anonymous-data">Anonymous Usage Data</Label>
              <p className="text-muted-foreground text-sm">Allow anonymous collection of usage statistics</p>
            </div>
            <Switch
              id="anonymous-data"
              checked={privacy.anonymousData}
              onCheckedChange={(checked) => setPrivacy({ ...privacy, anonymousData: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-profile">Public Profile</Label>
              <p className="text-muted-foreground text-sm">Make your profile visible to others</p>
            </div>
            <Switch
              id="public-profile"
              checked={privacy.publicProfile}
              onCheckedChange={(checked) => setPrivacy({ ...privacy, publicProfile: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          className="bg-journal-blue hover:bg-journal-blue/90" 
          onClick={saveSettings}
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
