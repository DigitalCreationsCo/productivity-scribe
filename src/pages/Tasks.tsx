
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Calendar, Plus, CheckSquare, Square, Filter, Clock, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/calendar";

const Tasks = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [filterPriority, setFilterPriority] = useState("all");

  // Sample tasks data
  const sampleTasks = [
    {
      id: 1,
      title: "Complete project proposal",
      description: "Finalize the proposal document and send for review",
      completed: false,
      priority: "high",
      dueDate: "2023-05-18T17:00:00",
      category: "work",
    },
    {
      id: 2,
      title: "Review client feedback",
      description: "Go through client comments and prepare response",
      completed: false,
      priority: "medium",
      dueDate: "2023-05-19T11:00:00",
      category: "work",
    },
    {
      id: 3,
      title: "Team weekly meeting",
      description: "Prepare agenda and attend weekly team sync",
      completed: false,
      priority: "medium",
      dueDate: "2023-05-20T09:30:00",
      category: "work",
    },
    {
      id: 4,
      title: "Update portfolio website",
      description: "Add recent projects and update skills section",
      completed: true,
      priority: "low",
      dueDate: "2023-05-15T18:00:00",
      category: "personal",
    },
    {
      id: 5,
      title: "Read chapter 5 of productivity book",
      description: "Continue reading and take notes",
      completed: true,
      priority: "medium",
      dueDate: "2023-05-16T20:00:00",
      category: "personal",
    },
    {
      id: 6,
      title: "Schedule dentist appointment",
      description: "Call clinic for annual checkup",
      completed: false,
      priority: "high",
      dueDate: "2023-05-17T12:00:00",
      category: "health",
    },
  ];

  const [tasks, setTasks] = useState(sampleTasks);

  const handleToggleTask = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast({
        title: task.completed ? "Task marked as incomplete" : "Task completed",
        description: task.title,
      });
    }
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

    const newTask = {
      id: tasks.length + 1,
      title: taskTitle,
      description: taskDescription,
      completed: false,
      priority: taskPriority || "medium",
      dueDate: dueDate ? dueDate.toISOString() : new Date().toISOString(),
      category: "work", // Default category
    };

    setTasks([newTask, ...tasks]);
    
    toast({
      title: "Task added",
      description: "Your new task has been created.",
    });

    // Reset form
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("");
    setDueDate(undefined);
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage your tasks and stay productive</p>
        </div>
        <Button className="bg-journal-green hover:bg-journal-green/90" onClick={() => document.getElementById('new-task-section')?.scrollIntoView({ behavior: 'smooth' })}>
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Your Tasks</CardTitle>
              <CardDescription>
                {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} {activeTab === "completed" ? "completed" : activeTab === "active" ? "in progress" : "total"}
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
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`flex items-start p-4 border rounded-lg ${
                      task.completed ? "bg-gray-50" : ""
                    }`}
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
              <Select value={taskPriority} onValueChange={setTaskPriority}>
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
              setTaskPriority("");
              setDueDate(undefined);
            }}>
              Clear
            </Button>
            <Button 
              className="bg-journal-green hover:bg-journal-green/90"
              onClick={handleAddTask}
            >
              Add Task
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;
