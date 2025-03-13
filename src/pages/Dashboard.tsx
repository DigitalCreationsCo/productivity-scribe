
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart, PieChart, LineChart } from "@/components/ui/chart";
import { BookOpen, CheckSquare, BarChart2, TrendingUp, ChevronRight } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  // Sample data for charts
  const habitData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Completed",
        data: [4, 5, 3, 6, 4, 3, 5],
        backgroundColor: "#60A5FA",
      },
      {
        label: "Missed",
        data: [1, 0, 2, 0, 1, 2, 0],
        backgroundColor: "#F87171",
      },
    ],
  };

  const taskCompletionData = {
    labels: ["Completed", "In Progress", "Not Started"],
    datasets: [
      {
        data: [65, 20, 15],
        backgroundColor: ["#10B981", "#60A5FA", "#F87171"],
        borderWidth: 0,
      },
    ],
  };

  const productivityTrendData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Productivity Score",
        data: [65, 70, 68, 75, 82, 85],
        borderColor: "#8B5CF6",
        backgroundColor: "rgba(139, 92, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">{formattedDate}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/journal")} className="bg-journal-blue hover:bg-journal-blue/90">
            New Journal Entry
          </Button>
          <Button onClick={() => navigate("/tasks")} variant="outline">
            Add Task
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Journal Entries",
            value: "12",
            description: "Last 30 days",
            icon: <BookOpen className="h-5 w-5 text-journal-blue" />,
            color: "bg-journal-blue/10",
          },
          {
            title: "Tasks Completed",
            value: "24",
            description: "Out of 36 tasks",
            icon: <CheckSquare className="h-5 w-5 text-journal-green" />,
            color: "bg-journal-green/10",
          },
          {
            title: "Habit Streak",
            value: "7 days",
            description: "Daily meditation",
            icon: <BarChart2 className="h-5 w-5 text-journal-purple" />,
            color: "bg-journal-purple/10",
          },
          {
            title: "Productivity Score",
            value: "85%",
            description: "15% increase",
            icon: <TrendingUp className="h-5 w-5 text-journal-pink" />,
            color: "bg-journal-pink/10",
          },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className={`${stat.color} p-2 rounded-full`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Journal Entries */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Recent Journal Entries</CardTitle>
            <CardDescription>Your latest thoughts and reflections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Project Kickoff",
                  date: "Today, 9:30 AM",
                  excerpt: "Had a productive kickoff meeting for the new project. Feeling optimistic about the timeline.",
                  mood: "Energetic",
                  moodColor: "bg-green-100 text-green-800",
                },
                {
                  title: "Mid-week Reflection",
                  date: "Yesterday, 6:15 PM",
                  excerpt: "Reflecting on work-life balance. Need to better manage project deadlines.",
                  mood: "Thoughtful",
                  moodColor: "bg-blue-100 text-blue-800",
                },
                {
                  title: "Learning Session",
                  date: "May 15, 2:45 PM",
                  excerpt: "Spent time learning a new framework. Making steady progress but need more practice.",
                  mood: "Focused",
                  moodColor: "bg-purple-100 text-purple-800",
                },
              ].map((entry, index) => (
                <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{entry.title}</h3>
                    <span className="text-xs text-muted-foreground">{entry.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{entry.excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded-full ${entry.moodColor}`}>
                      {entry.mood}
                    </span>
                    <Button variant="ghost" size="sm" className="h-8 text-journal-blue hover:text-journal-blue/80">
                      Read More <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" className="w-full" onClick={() => navigate("/journal")}>
                View All Journal Entries
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Task Overview */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Task Overview</CardTitle>
              <CardDescription>Status of your current tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <PieChart 
                  data={taskCompletionData} 
                  options={{
                    plugins: {
                      legend: {
                        position: 'right',
                      }
                    }
                  }}
                />
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" className="w-full" onClick={() => navigate("/tasks")}>
                  Manage Tasks
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Upcoming Tasks</CardTitle>
              <CardDescription>Due in the next few days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  {
                    title: "Complete project proposal",
                    due: "Today, 5:00 PM",
                    priority: "High",
                    priorityColor: "bg-red-100 text-red-800",
                  },
                  {
                    title: "Review client feedback",
                    due: "Tomorrow, 11:00 AM",
                    priority: "Medium",
                    priorityColor: "bg-yellow-100 text-yellow-800",
                  },
                  {
                    title: "Team weekly meeting",
                    due: "May 18, 9:30 AM",
                    priority: "Medium",
                    priorityColor: "bg-yellow-100 text-yellow-800",
                  },
                ].map((task, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-sm">{task.title}</h3>
                      <p className="text-xs text-muted-foreground">{task.due}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${task.priorityColor}`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Habit Completion</CardTitle>
            <CardDescription>Daily habit tracking for the last week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <BarChart data={habitData} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Productivity Trend</CardTitle>
            <CardDescription>Your productivity score over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <LineChart data={productivityTrendData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
