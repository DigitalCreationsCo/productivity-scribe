
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Search, Plus, Clock, BookOpen, PenTool } from "lucide-react";
import JournalEntry from "@/components/journal/JournalEntry";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useJournalEntries, useCreateJournalEntry } from "@/services/journalService";

const Journal = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("entries");
  const [searchQuery, setSearchQuery] = useState("");
  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [journalMood, setJournalMood] = useState("");
  const [journalTags, setJournalTags] = useState<string[]>([]);
  
  // Query and mutations
  const { data: journalEntries = [], isLoading } = useJournalEntries();
  const createEntryMutation = useCreateJournalEntry();

  const handleNewJournalEntry = () => {
    if (!journalTitle || !journalContent || !journalMood) {
      toast({
        title: "Missing information",
        description: "Please provide title, content, and mood for your journal entry.",
        variant: "destructive",
      });
      return;
    }

    createEntryMutation.mutate(
      {
        title: journalTitle,
        content: journalContent,
        mood: journalMood,
        tags: journalTags,
      },
      {
        onSuccess: () => {
          toast({
            title: "Journal entry saved",
            description: "Your thoughts have been recorded successfully.",
          });
          
          // Reset form after saving
          setJournalTitle("");
          setJournalContent("");
          setJournalMood("");
          setJournalTags([]);
          
          // Switch to entries tab to see the new entry
          setActiveTab("entries");
        },
        onError: () => {
          toast({
            title: "Error saving entry",
            description: "There was a problem saving your journal entry. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!journalTags.includes(newTag)) {
        setJournalTags([...journalTags, newTag]);
      }
      e.currentTarget.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setJournalTags(journalTags.filter(tag => tag !== tagToRemove));
  };

  const filteredEntries = journalEntries.filter(entry => 
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
                  <CardDescription>You have {journalEntries.length} entries in total</CardDescription>
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
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin h-8 w-8 border-4 border-journal-blue border-t-transparent rounded-full"></div>
                </div>
              ) : (
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
              )}
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

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (press Enter to add)</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {journalTags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="bg-gray-100 px-2 py-1 rounded-full text-sm flex items-center group"
                    >
                      {tag}
                      <button 
                        className="ml-1 text-gray-500 hover:text-red-500"
                        onClick={() => removeTag(tag)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <Input 
                  id="tags" 
                  placeholder="Add tags and press Enter" 
                  onKeyDown={handleTagInput}
                />
              </div>
              
              <div className="pt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setActiveTab("entries")}>
                  Cancel
                </Button>
                <Button 
                  className="bg-journal-blue hover:bg-journal-blue/90"
                  onClick={handleNewJournalEntry}
                  disabled={createEntryMutation.isPending}
                >
                  {createEntryMutation.isPending ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Journal Entry'
                  )}
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
