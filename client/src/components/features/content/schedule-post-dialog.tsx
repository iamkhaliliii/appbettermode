import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/primitives";
import { Label } from "@/components/ui/primitives";
import { Calendar } from "@/components/ui/primitives";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/primitives";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TimePickerDemo } from "@/components/ui/time-picker-demo";

export interface SchedulePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (date: Date) => void;
  title: string; // "Schedule & Publish" or "Reschedule"
  description?: string;
  initialDate?: Date;
}

export function SchedulePostDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  initialDate,
}: SchedulePostDialogProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date | undefined>(
    initialDate || new Date()
  );

  const handleConfirm = () => {
    if (selectedDateTime) {
      onConfirm(selectedDateTime);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  // Reset form when dialog opens with initial values
  React.useEffect(() => {
    if (open) {
      if (initialDate) {
        setSelectedDateTime(new Date(initialDate));
      } else {
        const defaultDate = new Date();
        defaultDate.setHours(9, 0, 0, 0); // Default to 9:00 AM
        setSelectedDateTime(defaultDate);
      }
    }
  }, [open, initialDate]);

  /**
   * carry over the current time when a user clicks a new day
   * instead of resetting to 00:00
   */
  const handleDateSelect = (newDay: Date | undefined) => {
    if (!newDay) return;
    if (!selectedDateTime) {
      setSelectedDateTime(newDay);
      return;
    }
    const diff = newDay.getTime() - selectedDateTime.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = new Date(selectedDateTime);
    newDateFull.setDate(newDateFull.getDate() + Math.ceil(diffInDays));
    setSelectedDateTime(newDateFull);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4 text-blue-600" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {description || "Select when you want this post to be published."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Date & Time Selection */}
          <div className="space-y-3">
            <Label className="text-sm">Date & Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-9",
                    !selectedDateTime && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDateTime ? (
                    format(selectedDateTime, "MMM d, yyyy 'at' HH:mm")
                  ) : (
                    <span>Pick a date and time</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDateTime}
                  onSelect={handleDateSelect}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                />
                <div className="p-3 border-t border-border">
                  <TimePickerDemo 
                    setDate={setSelectedDateTime} 
                    date={selectedDateTime} 
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Preview */}
          {selectedDateTime && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Will be published:</strong><br />
                {format(selectedDateTime, "EEEE, MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={handleCancel} className="h-8 px-3">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedDateTime}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 h-8 px-4"
          >
            {title === "Reschedule" ? "Update" : "Schedule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 