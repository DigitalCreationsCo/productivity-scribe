
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { BarChart2, Plus, ListChecks, Calendar, TrendingUp, Repeat, Edit2, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, LineChart } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";

const Habits = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("active");
  const [habitName, setHabitName] = useState("");
  const [habitCategory, setHabitCategory] = useState("");
  const [habitFrequency, setHabitFrequency] = useState("");

  // Sample habits data
  const sampleHabits = [
    {
      id: 1,
      name: "Daily Meditation",
      category: "wellness",
      frequency: "daily",
      streak: 7,
      totalCompleted: 28,
      completionHistory: [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
      active: true,
    },
    {
      id: 2,
      name: "Read 30 minutes",
      category: "learning",
      frequency: "daily",
      streak: 4,
      totalCompleted: 12,
      completionHistory: [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1],
      active: true,
    },
    {
      id: 3,
      name: "Exercise",
      category: "fitness",
      frequency: "3x weekly",
      streak: 0,
      totalCompleted: 8,
      completionHistory: [0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1],
      active: true,
    },
    {
      id: 4,
      name: "Practice Guitar",
      category: "hobby",
      frequency: "4x weekly",
      streak: 0,
      totalCompleted: 5,
      completionHistory: [0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1],
      active: false,
    },
    {
      id: 5,
      name: "Drink 8 glasses of water",
      category: "health",
      frequency: "daily",
      streak: 2,
      totalCompleted: 10,
      completionHistory: [1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1],
      active: true,
    },
  ];

  const [habits, setHabits] = useState(sampleHabits);

  const handleAddHabit = () => {
    if (!habitName) {
      toast({
        title: "Habit name required",
        description: "Please provide a name for your habit.",
        variant: "destructive",
      });
      return;
    }

    const newHabit = {
      id: habits.length + 1,
      name: habitName,
      category: habitCategory || "wellness",
      frequency: habitFrequency || "daily",
      streak: 0,
      totalCompleted: 0,
      completionHistory: Array(14).fill(0),
      active: true,
    };

    setHabits([...habits, newHabit]);
    
    toast({
      title: "Habit added",
      description: "Your new habit has been created.",
    });

    // Reset form
    setHabitName("");
    setHabitCategory("");
    setHabitFrequency("");
  };

  const handleToggleHabit = (habitId: number, dayIndex: number) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newHistory = [...habit.completionHistory];
        newHistory[dayIndex] = newHistory[dayIndex] === 1 ? 0 : 1;
        
        // Calculate new streak
        let streak = 0;
        for (let i = newHistory.length - 1; i >= 0; i--) {
          if (newHistory[i] === 1) {
            streak++;
          } else {
            break;
          }
        }
        
        return {
          ...habit,
          completionHistory: newHistory,
          streak: streak,
          totalCompleted: newHistory.filter(day => day === 1).length
        };
      }
      return habit;
    }));
  };

  const toggleHabitActive = (habitId: number) => {
    setHabits(habits.map(habit => 
      habit.id === habitId ? { ...habit, active: !habit.active } : habit
    ));
    
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      toast({
        title: habit.active ? "Habit archived" : "Habit activated",
        description: habit.name,
      });
    }
  };

  // Filter habits based on active tab
  const filteredHabits = habits.filter(habit => {
    if (activeTab === "archived" && habit.active) return false;
    if (activeTab === "active" && !habit.active) return false;
    return true;
  });

  // Data for overall progress chart
  const habitProgressData = {
    labels: habits.filter(h => h.active).map(h => h.name),
    datasets: [
      {
        label: "Completion Rate (%)",
        data: habits
          .filter(h => h.active)
          .map(h => Math.round((h.totalCompleted / h.completionHistory.length) * 100)),
        backgroundColor: "#60A5FA",
      },
    ],
  };

  // Data for the trend line chart
  const habitTrendData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: habits
      .filter(h => h.active)
      .slice(0, 3) // Limit to 3 habits for clarity
      .map((habit, index) => {
        const colors = ["#3B82F6", "#10B981", "#8B5CF6", "#EC4899", "#F59E0B"];
        return {
          label: habit.name,
          data: habit.completionHistory.map(day => day * 100), // Convert 0/1 to 0/100 for better visualization
          borderColor: colors[index % colors.length],
          backgroundColor: `${colors[index % colors.length]}20`,
          fill: false,
          tension: 0.4,
        };
      }),
  };

  const categoryColorMap: Record<string, string> = {
    wellness: "bg-blue-100 text-blue-800",
    learning: "bg-purple-100 text-purple-800",
    fitness: "bg-green-100 text-green-800",
    hobby: "bg-amber-100 text-amber-800",
    health: "bg-teal-100 text-teal-800",
  };

  const getCompletionRate = (habit: typeof sampleHabits[0]) => {
    return Math.round((habit.totalCompleted / habit.completionHistory.length) * 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Habits</h1>
          <p className="text-muted-foreground">Track and build better habits</p>
        </div>
        <Button className="bg-journal-purple hover:bg-journal-purple/90" onClick={() => document.getElementById('new-habit-section')?.scrollIntoView({ behavior: 'smooth' })}>
          <Plus className="mr-2 h-4 w-4" /> New Habit
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Habit Completion Rates</CardTitle>
            <CardDescription>Your progress on active habits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <BarChart data={habitProgressData} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Habit Trends</CardTitle>
            <CardDescription>Consistency over the past 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <LineChart data={habitTrendData} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Your Habits</CardTitle>
              <CardDescription>
                {filteredHabits.length} {filteredHabits.length === 1 ? 'habit' : 'habits'} {activeTab === "archived" ? "archived" : "active"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
              <TabsTrigger value="active" className="flex items-center">
                <ListChecks className="mr-2 h-4 w-4" /> Active Habits
              </TabsTrigger>
              <TabsTrigger value="archived" className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" /> Archived
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredHabits.length > 0 ? (
                filteredHabits.map((habit) => (
                  <Card key={habit.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                        <div className="flex items-center">
                          <h3 className="font-medium">{habit.name}</h3>
                          <span className={`ml-2 text-xs px-2 py-1 rounded-full ${categoryColorMap[habit.category] || "bg-gray-100"}`}>
                            {habit.category}
                          </span>
                          <span className="ml-2 text-xs text-muted-foreground flex items-center">
                            <Repeat className="h-3 w-3 mr-1" /> {habit.frequency}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          {habit.streak > 0 && (
                            <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800 flex items-center">
                              <TrendingUp className="h-3 w-3 mr-1" /> {habit.streak} day streak
                            </span>
                          )}
                          <Button variant="ghost" size="sm" className="h-8" onClick={() => toggleHabitActive(habit.id)}>
                            {habit.active ? (
                              <>
                                <Trash2 className="h-3 w-3 mr-1" /> Archive
                              </>
                            ) : (
                              <>
                                <Edit2 className="h-3 w-3 mr-1" /> Activate
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Completion rate</span>
                          <span className="text-sm font-medium">{getCompletionRate(habit)}%</span>
                        </div>
                        <Progress value={getCompletionRate(habit)} className="h-2" />
                      </div>
                      
                      <div className="mt-4">
                        <div className="text-sm font-medium mb-2">Last 14 days</div>
                        <div className="grid grid-cols-7 gap-1 sm:gap-2">
                          {habit.completionHistory.map((completed, dayIndex) => (
                            <button
                              key={dayIndex}
                              onClick={() => habit.active && handleToggleHabit(habit.id, dayIndex)}
                              disabled={!habit.active}
                              className={`
                                h-8 w-full rounded border transition-colors
                                ${completed ? "bg-journal-purple/80 border-journal-purple text-white" : "bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200"}
                                ${!habit.active ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
                              `}
                            >
                              {dayIndex < 7 ? 
                                ["M", "T", "W", "T", "F", "S", "S"][dayIndex % 7] : 
                                ["M", "T", "W", "T", "F", "S", "S"][dayIndex % 7]
                              }
                            </button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-10 border rounded-lg">
                  <ListChecks className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No habits found</h3>
                  <p className="text-muted-foreground">
                    {activeTab === "archived" 
                      ? "You don't have any archived habits" 
                      : "Start tracking a new habit to build consistency"}
                  </p>
                  {activeTab === "active" && (
                    <Button 
                      className="mt-4 bg-journal-purple hover:bg-journal-purple/90"
                      onClick={() => document.getElementById('new-habit-section')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Habit
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card id="new-habit-section">
        <CardHeader>
          <CardTitle>Create New Habit</CardTitle>
          <CardDescription>Start tracking a new habit to improve consistency</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="habit-name">Habit Name</Label>
            <Input 
              id="habit-name" 
              placeholder="What habit do you want to track?" 
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="habit-category">Category</Label>
              <Select value={habitCategory} onValueChange={setHabitCategory}>
                <SelectTrigger id="habit-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="learning">Learning</SelectItem>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="hobby">Hobby</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="habit-frequency">Frequency</Label>
              <Select value={habitFrequency} onValueChange={setHabitFrequency}>
                <SelectTrigger id="habit-frequency">
                  <SelectValue placeholder="How often?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekdays">Weekdays</SelectItem>
                  <SelectItem value="weekends">Weekends</SelectItem>
                  <SelectItem value="3x weekly">3x Weekly</SelectItem>
                  <SelectItem value="4x weekly">4x Weekly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => {
              setHabitName("");
              setHabitCategory("");
              setHabitFrequency("");
            }}>
              Clear
            </Button>
            <Button 
              className="bg-journal-purple hover:bg-journal-purple/90"
              onClick={handleAddHabit}
            >
              Add Habit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Habits;
