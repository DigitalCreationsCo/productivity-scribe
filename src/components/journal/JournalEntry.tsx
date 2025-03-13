
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface JournalEntryProps {
  entry: {
    id: number;
    title: string;
    content: string;
    date: string;
    time: string;
    mood: string;
    moodColor: string;
    tags: string[];
  };
}

const JournalEntry = ({ entry }: JournalEntryProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg hover:shadow-sm transition-shadow overflow-hidden">
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{entry.title}</h3>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" /> {entry.date}
              <Clock className="h-3 w-3 ml-3 mr-1" /> {entry.time}
            </div>
          </div>
          <div className="flex items-center">
            <span className={`text-xs px-2 py-1 rounded-full mr-2 ${entry.moodColor}`}>
              {entry.mood}
            </span>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>
        
        {!expanded && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{entry.content}</p>
        )}
      </div>
      
      {expanded && (
        <div className="px-4 pb-4">
          <p className="text-sm text-gray-600 mb-3">{entry.content}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {entry.tags.map((tag, index) => (
              <span key={index} className="text-xs px-2 py-1 rounded-full bg-gray-100">
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex justify-end space-x-2 mt-2">
            <Button variant="outline" size="sm" className="h-8">
              <Edit2 className="h-3 w-3 mr-1" /> Edit
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-red-500 hover:text-red-600">
              <Trash2 className="h-3 w-3 mr-1" /> Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalEntry;
