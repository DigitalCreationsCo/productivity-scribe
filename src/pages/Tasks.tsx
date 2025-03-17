
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Plus, CheckSquare, Square, Filter, Clock, AlertCircle, Trash2, RefreshCcw, CalendarDays } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/calendar";
import { useAuth } from "@/contexts/AuthContext";
import { useApp } from "@/contexts/AppContext";
import { useCalendarEvents } from "@/services/googleCalendar";
import { Task, useTasks, useAddTask, useToggleTask, useDeleteTask } from "@/services/taskService";
import { Link } from "react-router-dom";
import { format, isSameDay } from "date-fns";

const Tasks = () => {
  const { toast } = useToast();
  const { isAuthenticated, hasCalendarAccess } = useAuth();
  const { isSyncing } = useApp();
  const [dateFilter, setDateFilter] = useState<Date>(new Date()); // Default to today
  
  // Create date range for calendar events query
  const dateRange = {
    startDate: new Date(dateFilter),
    endDate: new Date(dateFilter)
  };
  
  // Set end of day for the end date
  dateRange.endDate.setHours(23, 59, 59, 999);
  
  const { data: events = [], refetch: refetchEvents } = useCalendarEvents(dateRange);
  const [activeTab, setActiveTab] = useState("all");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState<"high" | "medium" | "low">("medium");
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date()); // Default to today
  const [filterPriority, setFilterPriority] = useState("all");

  // Use our custom hooks with date filter
  const { data: tasks = [], isLoading, refetch: refetchTasks } = useTasks(dateFilter);
  const addTaskMutation = useAddTask();
  const toggleTaskMutation = useToggleTask();
  const deleteTaskMutation = useDeleteTask();

  // Ensure we refetch tasks when events change
  useEffect(() => {
    if (events.length > 0) {
      // Short delay to ensure events are processed
      const timer = setTimeout(() => {
        refetchTasks();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [events, refetchTasks]);

  // Initial load of calendar events and tasks
  useEffect(() => {
    if (hasCalendarAccess && !isSyncing) {
      refetchEvents();
    }
  }, [hasCalendarAccess, refetchEvents, isSyncing, dateFilter]);

  const handleToggleTask = (taskId: string) => {
    toggleTaskMutation.mutate(taskId);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleAddTask = () => {
    if (!taskTitle) {
      toast({
        title: "Task title required",
        description: "Please provide a title for your task.",
        variant: "destructive",
      });
      return;
    }

    if (!dueDate) {
      toast({
        title: "Due date required",
        description: "Please select a due date for your task.",
        variant: "destructive",
      });
      return;
    }

    const newTask: Omit<Task, 'id'> = {
      title: taskTitle,
      description: taskDescription,
      completed: false,
      priority: taskPriority || "medium",
      dueDate: dueDate.toISOString(),
      category: "work", // Default category
      isFromCalendar: false
    };

    addTaskMutation.mutate(newTask);

    // Reset form
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("medium");
    setDueDate(new Date()); // Reset to today
  };

  const handleDateFilterChange = (date: Date | undefined) => {
    if (date) {
      setDateFilter(date);
    }
  };

  const handleRefreshCalendar = async () => {
    if (!hasCalendarAccess || isSyncing) return;
    
    try {
      await refetchEvents();
      // Explicitly refetch tasks after calendar events
      setTimeout(() => refetchTasks(), 500);
      toast({
        title: "Calendar Refreshed",
        description: "Your calendar events have been updated."
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh calendar events.",
        variant: "destructive"
      });
    }
  };

  // Reset date filter to today
  const handleResetDateFilter = () => {
    setDateFilter(new Date());
  };

  // Filter tasks based on active tab and priority filter
  const filteredTasks = tasks.filter(task => {
    if (activeTab === "completed" && !task.completed) return false;
    if (activeTab === "active" && task.completed) return false;
    if (filterPriority !== "all" && task.priority !== filterPriority) return false;
    return true;
  });

  const priorityColorMap: Record<string, string> = {
    high: "text-red-600 border-red-200 bg-red-50",
    medium: "text-amber-600 border-amber-200 bg-amber-50",
    low: "text-green-600 border-green-200 bg-green-50",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isOverdue = (dateString: string) => {
    return new Date(dateString) < new Date() && dateString !== "";
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            {isToday(dateFilter) 
              ? "Manage your tasks for today" 
              : `Tasks for ${format(dateFilter, 'MMMM d, yyyy')}`}
          </p>
        </div>
        <div className="flex gap-2">
          {hasCalendarAccess && (
            <Button 
              variant="outline" 
              onClick={handleRefreshCalendar} 
              disabled={isSyncing}
            >
              <RefreshCcw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              Sync Calendar
            </Button>
          )}
          <Button className="bg-journal-green hover:bg-journal-green/90" onClick={() => document.getElementById('new-task-section')?.scrollIntoView({ behavior: 'smooth' })}>
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Button>
        </div>
      </div>

      {/* Date Filter */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-medium">Date Filter</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <DatePicker 
                selectedDate={dateFilter} 
                onDateChange={handleDateFilterChange} 
                showTimePicker={false}
              />
              {!isToday(dateFilter) && (
                <Button 
                  variant="outline" 
                  onClick={handleResetDateFilter}
                  className="whitespace-nowrap"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Today
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {hasCalendarAccess && (
        <div className="rounded-lg border bg-card p-3 text-sm text-card-foreground shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>
              Your tasks include events from Google Calendar. New tasks will also be added to your Google Calendar.
              {tasks.filter(t => t.isFromCalendar).length > 0 && (
                <span className="font-medium"> ({tasks.filter(t => t.isFromCalendar).length} calendar events)</span>
              )}
            </span>
          </div>
        </div>
      )}

      {!hasCalendarAccess && isAuthenticated && (
        <div className="rounded-lg border bg-muted/50 p-3 text-sm">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>Connect your Google Calendar to view events as tasks and create tasks in your calendar. </span>
            <Link to="/calendar-integration" className="text-primary underline">
              Connect Calendar
            </Link>
          </div>
        </div>
      )}

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Your Tasks</CardTitle>
              <CardDescription>
                {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} {activeTab === "completed" ? "completed" : activeTab === "active" ? "in progress" : "total"}
                {!isToday(dateFilter) && ` for ${format(dateFilter, 'MMM d')}`}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Priority:</span>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[130px] h-8">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high" className="text-red-600">High</SelectItem>
                  <SelectItem value="medium" className="text-amber-600">Medium</SelectItem>
                  <SelectItem value="low" className="text-green-600">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
              <TabsTrigger value="all" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" /> All Tasks
              </TabsTrigger>
              <TabsTrigger value="active" className="flex items-center">
                <Square className="mr-2 h-4 w-4" /> Active
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center">
                <CheckSquare className="mr-2 h-4 w-4" /> Completed
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`flex items-start p-4 border rounded-lg ${
                      task.completed ? "bg-gray-50" : ""
                    } ${task.isFromCalendar ? "border-l-4 border-l-blue-400" : ""}`}
                  >
                    <Checkbox 
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => handleToggleTask(task.id)}
                      className="mt-1"
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <label 
                          htmlFor={`task-${task.id}`}
                          className={`font-medium text-sm sm:text-base ${
                            task.completed ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {task.title}
                          {task.isFromCalendar && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              Calendar
                            </span>
                          )}
                        </label>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <span 
                            className={`text-xs px-2 py-1 rounded-md border ${
                              priorityColorMap[task.priority]
                            }`}
                          >
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span className={isOverdue(task.dueDate) && !task.completed ? "text-red-500" : ""}>
                              {formatDate(task.dueDate)}
                              {isOverdue(task.dueDate) && !task.completed && (
                                <span className="ml-1 inline-flex items-center">
                                  <AlertCircle className="h-3 w-3 mr-1" /> Overdue
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      {task.description && (
                        <p className={`text-sm mt-1 ${
                          task.completed ? "text-muted-foreground line-through" : "text-gray-600"
                        }`}>
                          {task.description}
                        </p>
                      )}
                      {!task.isFromCalendar && (
                        <div className="mt-2 flex justify-end">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteTask(task.id)}
                            className="h-8 px-2 text-destructive hover:text-destructive/90"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border rounded-lg">
                  <CheckSquare className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tasks found</h3>
                  <p className="text-muted-foreground">
                    {activeTab === "completed" 
                      ? "You haven't completed any tasks yet" 
                      : activeTab === "active"
                      ? "You don't have any active tasks"
                      : "Add your first task to get started"}
                    {!isToday(dateFilter) && ` for ${format(dateFilter, 'MMMM d, yyyy')}`}
                  </p>
                  <Button 
                    className="mt-4 bg-journal-green hover:bg-journal-green/90"
                    onClick={() => document.getElementById('new-task-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card id="new-task-section">
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
          <CardDescription>Add a new task to your list</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task-title">Task Title</Label>
            <Input 
              id="task-title" 
              placeholder="What do you need to do?" 
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="task-description">Description (Optional)</Label>
            <Textarea 
              id="task-description"
              placeholder="Add more details about this task..."
              className="min-h-[80px]"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="task-priority">Priority</Label>
              <Select 
                value={taskPriority} 
                onValueChange={(value: "high" | "medium" | "low") => setTaskPriority(value)}
              >
                <SelectTrigger id="task-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high" className="text-red-600">High</SelectItem>
                  <SelectItem value="medium" className="text-amber-600">Medium</SelectItem>
                  <SelectItem value="low" className="text-green-600">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="task-due-date">Due Date</Label>
              <DatePicker 
                selectedDate={dueDate} 
                onDateChange={setDueDate} 
                showTimePicker={true} 
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => {
              setTaskTitle("");
              setTaskDescription("");
              setTaskPriority("medium");
              setDueDate(new Date()); // Reset to today
            }}>
              Clear
            </Button>
            <Button 
              className="bg-journal-green hover:bg-journal-green/90"
              onClick={handleAddTask}
              disabled={addTaskMutation.isPending}
            >
              {addTaskMutation.isPending ? "Adding..." : "Add Task"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;
