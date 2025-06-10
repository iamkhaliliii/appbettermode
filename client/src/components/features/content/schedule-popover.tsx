import * as React from "react";
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

export interface SchedulePopoverProps {
  children: React.ReactNode; // Trigger element
  onConfirm: (date: Date) => void;
  title: string;
  initialDate?: Date;
  side?: "bottom" | "top" | "left" | "right";
  align?: "start" | "center" | "end";
  // New props for dropdown integration
  onOpenChange?: (open: boolean) => void;
  keepDropdownOpen?: boolean;
}

export function SchedulePopover({
  children,
  onConfirm,
  title,
  initialDate,
  side = "bottom",
  align = "end",
  onOpenChange,
  keepDropdownOpen = false,
}: SchedulePopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date | undefined>(
    initialDate || (() => {
      const defaultDate = new Date();
      defaultDate.setHours(9, 0, 0, 0); // Default to 9:00 AM
      return defaultDate;
    })()
  );

  // Handle popover open/close state
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleConfirm = () => {
    if (selectedDateTime) {
      onConfirm(selectedDateTime);
      handleOpenChange(false);
    }
  };

  const handleCancel = () => {
    handleOpenChange(false);
  };

  /**
   * carry over the current time when a user clicks a new day
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

  // Always prevent popover from closing - only allow closing via X, Cancel, or Set buttons
  const handleInteractOutside = (event: Event) => {
    event.preventDefault();
    return;
  };

  // Reset when popover opens
  React.useEffect(() => {
    if (open) {
      if (initialDate) {
        setSelectedDateTime(new Date(initialDate));
      } else {
        const defaultDate = new Date();
        defaultDate.setHours(9, 0, 0, 0);
        setSelectedDateTime(defaultDate);
      }
    }
  }, [open, initialDate]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0" 
        side={side} 
        align={align}
        sideOffset={2}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={handleInteractOutside}
        onEscapeKeyDown={(e) => {
          // Prevent ESC from closing popover - only allow X, Cancel, or Set buttons
          e.preventDefault();
        }}
        // Prevent auto-focus when dropdown integration is enabled
        onOpenAutoFocus={(e) => {
          if (keepDropdownOpen) {
            e.preventDefault();
          }
        }}
      >
        {/* Compact Schedule Picker */}
        <div className="p-0">
          {/* Minimal Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{title}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCancel}
              className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600"
            >
              ✕
            </Button>
          </div>
          
          {/* Compact Calendar */}
          <Calendar
            mode="single"
            selected={selectedDateTime}
            onSelect={handleDateSelect}
            disabled={(date) =>
              date < new Date(new Date().setHours(0, 0, 0, 0))
            }
            initialFocus
            className="p-2 text-sm"
            classNames={{
              months: "flex flex-col space-y-2",
              month: "space-y-2",
              caption: "flex justify-center pt-0 relative items-center",
              caption_label: "text-xs font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-7 font-normal text-xs",
              row: "flex w-full mt-1",
              cell: "h-7 w-7 text-center text-xs p-0 relative",
              day: "h-7 w-7 p-0 font-normal text-xs",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
            }}
          />
          
          {/* Compact Time Picker */}
          <div className="px-3 py-2 border-t bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">Time:</span>
              <div data-time-picker className="time-picker-container">
                <TimePickerDemo 
                  setDate={setSelectedDateTime} 
                  date={selectedDateTime} 
                />
              </div>
            </div>
          </div>

          {/* Compact Actions */}
          <div className="flex justify-end gap-1.5 px-3 py-2 border-t bg-white dark:bg-gray-900">
            <Button variant="ghost" size="sm" onClick={handleCancel} className="h-7 px-2 text-xs">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!selectedDateTime}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 h-7 px-3 text-xs"
            >
              Set
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 