
import { useState } from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DatePickerProps {
  selectedDate?: Date;
  onDateChange: (date: Date | undefined) => void;
  showTimePicker?: boolean;
}

export function DatePicker({
  selectedDate,
  onDateChange,
  showTimePicker = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState(new Date().getHours().toString());
  const [minutes, setMinutes] = useState(new Date().getMinutes().toString());

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onDateChange(undefined);
      return;
    }

    if (showTimePicker && hours && minutes) {
      const newDate = new Date(date);
      newDate.setHours(parseInt(hours, 10));
      newDate.setMinutes(parseInt(minutes, 10));
      onDateChange(newDate);
    } else {
      onDateChange(date);
    }
  };

  const handleTimeChange = () => {
    if (selectedDate && hours && minutes) {
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(hours, 10));
      newDate.setMinutes(parseInt(minutes, 10));
      onDateChange(newDate);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            showTimePicker ? (
              format(selectedDate, "PPP p") // Date with time
            ) : (
              format(selectedDate, "PPP") // Date only
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
        {showTimePicker && (
          <div className="p-3 border-t">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Label>Time</Label>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="grid gap-1">
                <Label htmlFor="hours" className="text-xs">Hours</Label>
                <Input
                  id="hours"
                  className="w-16 h-8"
                  value={hours}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || (/^\d+$/.test(val) && parseInt(val, 10) >= 0 && parseInt(val, 10) <= 23)) {
                      setHours(val);
                    }
                  }}
                  onBlur={handleTimeChange}
                />
              </div>
              <span className="text-xl mt-6">:</span>
              <div className="grid gap-1">
                <Label htmlFor="minutes" className="text-xs">Minutes</Label>
                <Input
                  id="minutes"
                  className="w-16 h-8"
                  value={minutes}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || (/^\d+$/.test(val) && parseInt(val, 10) >= 0 && parseInt(val, 10) <= 59)) {
                      setMinutes(val);
                    }
                  }}
                  onBlur={handleTimeChange}
                />
              </div>
              <Button
                size="sm"
                className="mt-6 h-8"
                onClick={handleTimeChange}
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

// Export a simple Calendar component for use elsewhere
export function Calendar({ className, ...props }: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker 
      className={cn("p-3 pointer-events-auto", className)} 
      {...props} 
    />
  );
}
