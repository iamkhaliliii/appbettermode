import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PlusCircle, FileText, ChevronRight } from "lucide-react";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Option card component as a div to avoid nesting button issue
interface OptionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function OptionCard({ icon, title, description, onClick }: OptionCardProps) {
  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="flex items-start p-6 rounded-lg border border-gray-100 dark:border-gray-800 
        hover:border-gray-200 dark:hover:border-gray-700
        hover:bg-gray-50/50 dark:hover:bg-gray-800/50
        transition-all cursor-pointer group"
      style={{ 
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
      }}
    >
      <div className="h-12 w-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mr-5">
        {icon}
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-white text-lg tracking-tight">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {description}
        </p>
      </div>
      
      <div className="self-center ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
    </div>
  );
}

export function AddContentDialog({ open, onOpenChange }: AddContentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-2xl bg-white dark:bg-gray-900 shadow-xl 
          rounded-xl p-0 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          {/* Left side with heading */}
          <div className="bg-gray-50 dark:bg-gray-850 p-8 md:w-1/3 flex flex-col justify-center">
            <DialogHeader className="items-start text-left space-y-2">
              <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                What do you want to add?
              </DialogTitle>
              <DialogDescription className="text-base text-gray-500 dark:text-gray-400">
                Choose an option to enhance your site
              </DialogDescription>
            </DialogHeader>
          </div>
          
          {/* Right side with options */}
          <div className="md:w-2/3 p-6">
            <div className="space-y-4">
              <OptionCard
                icon={<PlusCircle className="h-6 w-6 text-gray-500 dark:text-gray-400" />}
                title="I want to let people post something"
                description="Events, jobs, questions, ideas, and more. Enable your community to contribute content."
                onClick={() => onOpenChange(false)}
              />
              
              <OptionCard
                icon={<FileText className="h-6 w-6 text-gray-500 dark:text-gray-400" />}
                title="I want to create a new page"
                description="Homepage, explore page, faculty landing page, or any other structural content for your site."
                onClick={() => onOpenChange(false)}
              />
            </div>
            
            <div className="mt-5 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Press ESC to dismiss
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}