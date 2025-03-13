
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { DatePicker } from "@/components/ui/calendar";
import { CalendarEvents } from "@/components/calendar/CalendarEvents";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleAuth } from "@/components/auth/GoogleAuth";
import { Calendar, CheckSquare, Clock, BarChart as BarChartIcon, BookOpen } from "lucide-react";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );

  // Sample data for charts
  const habitData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Meditation",
        data: [15, 20, 15, 25, 30, 35, 20],
        backgroundColor: "#4c6ef588",
      },
      {
        label: "Reading",
        data: [35, 25, 45, 40, 30, 35, 40],
        backgroundColor: "#38b2ac88",
      },
      {
        label: "Exercise",
        data: [25, 30, 20, 25, 40, 35, 50],
        backgroundColor: "#ed8a0a88",
      },
    ],
  };

  const productivityData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Journal Entries",
        data: [4, 5, 3, 6],
        borderColor: "#4c6ef5",
        backgroundColor: "#4c6ef510",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Tasks Completed",
        data: [7, 12, 8, 15],
        borderColor: "#38b2ac",
        backgroundColor: "#38b2ac10",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const taskCompletionData = {
    labels: ["Completed", "In Progress", "Not Started"],
    datasets: [
      {
        data: [63, 25, 12],
        backgroundColor: ["#38b2ac", "#4c6ef5", "#e2e8f0"],
        borderColor: ["#38b2ac", "#4c6ef5", "#e2e8f0"],
      },
    ],
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {isAuthenticated 
              ? `Welcome back, ${user?.name}!` 
              : "Monitor your productivity and track your progress"}
          </p>
        </div>
        <div className="mt-4 md:mt-0 w-full md:w-auto">
          <DatePicker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>
      </div>

      {!isAuthenticated ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Welcome to ProductiveJournal</CardTitle>
            <CardDescription>
              Sign in with Google to access all features including calendar integration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm mx-auto">
              <GoogleAuth />
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Journal Entries
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Tasks Completed
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +5 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Current Streak
            </CardTitle>
            <BarChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground">
              Your longest streak: 14 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Productive Hours
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32h</div>
            <p className="text-xs text-muted-foreground">
              +3h from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Habit Consistency</CardTitle>
            <CardDescription>
              Your weekly habit tracking performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart data={habitData} height={300} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task Completion</CardTitle>
            <CardDescription>
              Current task status distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PieChart data={taskCompletionData} height={240} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Productivity Trends</CardTitle>
            <CardDescription>
              Your productivity over the last month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LineChart data={productivityData} height={300} />
          </CardContent>
        </Card>

        <CalendarEvents />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Today's Focus</CardTitle>
            <CardDescription>
              Your priority tasks for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-journal-green mr-2"></div>
                <span>Complete project proposal</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-journal-blue mr-2"></div>
                <span>Schedule team meeting</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-journal-purple mr-2"></div>
                <span>Review quarterly goals</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-journal-pink mr-2"></div>
                <span>Daily journal entry</span>
              </li>
            </ul>
            <div className="mt-4">
              <Button size="sm" variant="outline" className="w-full">
                View All Tasks
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Journal Prompt</CardTitle>
            <CardDescription>
              Inspiration for today's journal entry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="italic text-muted-foreground">
              "What are three small wins from yesterday, and what's one thing you want to accomplish today?"
            </p>
            <div className="mt-4">
              <Button size="sm" className="w-full">
                Start Writing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
