
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Search, Plus, Clock, Edit2, Trash2, BookOpen, PenTool } from "lucide-react";
import JournalEntry from "@/components/journal/JournalEntry";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Journal = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("entries");
  const [searchQuery, setSearchQuery] = useState("");
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [journalMood, setJournalMood] = useState("");

  // Sample journal entries data
  const sampleEntries = [
    {
      id: 1,
      title: "Project Kickoff Meeting",
      content: "Had a productive kickoff meeting for the new project. The team is aligned on goals and timelines. Need to follow up with the design team about initial mockups by next week.",
      date: "May 16, 2023",
      time: "9:30 AM",
      mood: "Energetic",
      moodColor: "bg-green-100 text-green-800",
      tags: ["Work", "Meeting", "Planning"],
    },
    {
      id: 2,
      title: "Mid-week Reflection",
      content: "Reflecting on my work-life balance this week. I've been more productive in the mornings, but need to better manage email time in the afternoons. Going to try time-blocking technique tomorrow.",
      date: "May 15, 2023",
      time: "6:15 PM",
      mood: "Thoughtful",
      moodColor: "bg-blue-100 text-blue-800",
      tags: ["Reflection", "Productivity", "Balance"],
    },
    {
      id: 3,
      title: "Learning Session: React Hooks",
      content: "Spent two hours learning about React custom hooks. Building a small project to practice implementation. Need to review useCallback and useMemo concepts again tomorrow.",
      date: "May 14, 2023",
      time: "2:45 PM",
      mood: "Focused",
      moodColor: "bg-purple-100 text-purple-800",
      tags: ["Learning", "Development", "React"],
    },
    {
      id: 4,
      title: "Weekend Planning",
      content: "Planning activities for the weekend. Want to balance relaxation with some productive hobby time. Considering a hiking trip on Saturday morning.",
      date: "May 12, 2023",
      time: "5:20 PM",
      mood: "Hopeful",
      moodColor: "bg-yellow-100 text-yellow-800",
      tags: ["Planning", "Personal", "Weekend"],
    },
    {
      id: 5,
      title: "Client Project Review",
      content: "Reviewed feedback from the client on our latest deliverable. Overall positive with some minor revision requests. Need to schedule a team meeting to discuss implementation.",
      date: "May 10, 2023",
      time: "11:10 AM",
      mood: "Satisfied",
      moodColor: "bg-blue-100 text-blue-800",
      tags: ["Work", "Client", "Feedback"],
    },
  ];

  const handleNewJournalEntry = () => {
    if (!journalTitle || !journalContent) {
      toast({
        title: "Missing information",
        description: "Please provide both title and content for your journal entry.",
        variant: "destructive",
      });
      return;
    }

    // In a real app, we would save this to a database
    toast({
      title: "Journal entry saved",
      description: "Your thoughts have been recorded successfully.",
    });

    // Reset form after saving
    setJournalTitle("");
    setJournalContent("");
    setJournalMood("");
    
    // Switch to entries tab to see the new entry
    setActiveTab("entries");
  };

  const filteredEntries = sampleEntries.filter(entry => 
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const moodOptions = [
    { value: "energetic", label: "Energetic", color: "text-green-600" },
    { value: "focused", label: "Focused", color: "text-purple-600" },
    { value: "thoughtful", label: "Thoughtful", color: "text-blue-600" },
    { value: "satisfied", label: "Satisfied", color: "text-blue-600" },
    { value: "hopeful", label: "Hopeful", color: "text-yellow-600" },
    { value: "tired", label: "Tired", color: "text-orange-600" },
    { value: "stressed", label: "Stressed", color: "text-red-600" },
    { value: "calm", label: "Calm", color: "text-teal-600" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Journal</h1>
          <p className="text-muted-foreground">Capture your thoughts and reflections</p>
        </div>
        <Button onClick={() => setActiveTab("new")} className="bg-journal-blue hover:bg-journal-blue/90">
          <Plus className="mr-2 h-4 w-4" /> New Entry
        </Button>
      </div>

      <Tabs defaultValue="entries" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="entries" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" /> Journal Entries
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center">
            <PenTool className="mr-2 h-4 w-4" /> New Entry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>All Journal Entries</CardTitle>
                  <CardDescription>You have {sampleEntries.length} entries in total</CardDescription>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search entries..." 
                    className="pl-10 w-full sm:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEntries.length > 0 ? (
                  filteredEntries.map((entry) => (
                    <JournalEntry key={entry.id} entry={entry} />
                  ))
                ) : (
                  <div className="text-center py-10">
                    <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No entries found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery 
                        ? "Try adjusting your search query" 
                        : "Start by creating your first journal entry"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Create New Journal Entry</CardTitle>
              <CardDescription>
                Record your thoughts, reflections, and experiences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Entry Title</Label>
                <Input 
                  id="title" 
                  placeholder="Give your entry a title" 
                  value={journalTitle}
                  onChange={(e) => setJournalTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Your Thoughts</Label>
                <Textarea 
                  id="content"
                  placeholder="Write your thoughts here..."
                  className="min-h-[200px]"
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mood">How are you feeling?</Label>
                  <Select value={journalMood} onValueChange={setJournalMood}>
                    <SelectTrigger id="mood">
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent>
                      {moodOptions.map((mood) => (
                        <SelectItem 
                          key={mood.value} 
                          value={mood.value}
                          className={mood.color}
                        >
                          {mood.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Date & Time</Label>
                  <div className="flex items-center space-x-2 h-10 px-4 py-2 border rounded-md bg-background">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date().toLocaleDateString()} 
                    </span>
                    <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                    <span className="text-sm">
                      {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setActiveTab("entries")}>
                  Cancel
                </Button>
                <Button 
                  className="bg-journal-blue hover:bg-journal-blue/90"
                  onClick={handleNewJournalEntry}
                >
                  Save Journal Entry
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Journal;
