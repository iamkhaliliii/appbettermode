import * as React from "react";
import { Button } from "@/components/ui/primitives";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/forms";
import { 
  Clock,
  Save,
  ChevronUp,
  SquarePen,
  X,
} from "lucide-react";
import { SchedulePopover } from "./SchedulePopover";
import { BaseFooterProps } from "./types";

interface ComposerFooterProps extends BaseFooterProps {
  // Allow customizing button text for different post types
  createButtonText?: string;
  scheduleButtonText?: string;
  scheduleMenuText?: string;
}

export function ComposerFooter({
  isValid,
  scheduledDate,
  currentStatus,
  isSchedulePopoverOpen,
  isDropdownOpen,
  onCancel,
  onPublish,
  onConfirm,
  onSaveDraft,
  onScheduleConfirm,
  onEditSchedule,
  onRemoveSchedule,
  onSchedulePopoverOpenChange,
  onDropdownOpenChange,
  createButtonText = "Create Post",
  scheduleButtonText = "Schedule Post", 
  scheduleMenuText = "Schedule post",
}: ComposerFooterProps) {
  return (
    <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
      {/* Scheduled Banner - Show above footer when scheduled */}
      {scheduledDate && (
        <div className="flex items-center justify-between px-6 py-3 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-700/50">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Scheduled for {scheduledDate.toLocaleDateString()} at {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <SchedulePopover
              onConfirm={onEditSchedule}
              title="Edit Schedule"
              initialDate={scheduledDate}
              side="top"
              align="end"
              onOpenChange={onSchedulePopoverOpenChange}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDropdownOpenChange(false)}
                className="h-7 px-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50"
              >
                <SquarePen className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </SchedulePopover>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDropdownOpenChange(false);
                onRemoveSchedule();
              }}
              className="h-7 px-2 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50"
            >
              <X className="h-3 w-3 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      )}
      
      {/* Normal Footer */}
      <div className="flex items-center justify-end p-6 pt-4">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-7 px-2.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          
          <div className="flex items-center">
            <Button
              onClick={scheduledDate ? onConfirm : onPublish}
              disabled={!isValid}
              className="bg-green-600 hover:bg-green-700 text-white px-4 h-7 text-xs rounded-r-none"
            >
              {scheduledDate ? scheduleButtonText : createButtonText}
            </Button>
            <DropdownMenu 
              open={isDropdownOpen}
              onOpenChange={(open) => {
                // Prevent dropdown from closing when schedule popover is open
                if (isSchedulePopoverOpen && !open) {
                  return;
                }
                onDropdownOpenChange(open);
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  onClick={() => onDropdownOpenChange(!isDropdownOpen)}
                  disabled={!isValid}
                  className="bg-green-600 hover:bg-green-700 text-white px-1.5 h-7 rounded-l-none border-l border-green-500"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top" className="w-48">
                <DropdownMenuItem onClick={onSaveDraft} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save draft
                  <span className="ml-auto text-xs text-gray-400">⌘D</span>
                </DropdownMenuItem>
                {!scheduledDate && (
                  <SchedulePopover
                    onConfirm={onScheduleConfirm}
                    title={`Schedule ${scheduleMenuText.split(' ')[1] || 'Post'}`}
                    side="top"
                    align="end"
                    onOpenChange={onSchedulePopoverOpenChange}
                    keepDropdownOpen={true}
                  >
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {scheduleMenuText}
                      <span className="ml-auto text-xs text-gray-400">⌘S</span>
                    </DropdownMenuItem>
                  </SchedulePopover>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
} 