import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Database, AppWindowMac, ChevronRight } from "lucide-react";

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
      className="flex items-start p-7 rounded-xl border border-gray-100 dark:border-gray-800 
        hover:border-gray-200 dark:hover:border-gray-700
        hover:bg-gray-50 dark:hover:bg-gray-800/70
        hover:shadow-lg dark:hover:shadow-gray-900/30
        transition-all duration-200 cursor-pointer group
        backdrop-blur-sm"
    >
      <div className="h-14 w-14 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center mr-6 
        shadow-sm group-hover:shadow-md transition-shadow duration-200">
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
        className="sm:max-w-[800px] bg-white dark:bg-gray-900 shadow-2xl 
          rounded-2xl p-0 overflow-hidden border-0"
      >
        <div className="flex flex-col md:flex-row">
          {/* Left side with heading */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-850 dark:to-gray-800 p-12 md:w-[40%] flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700">
            <DialogHeader className="items-start text-left space-y-4">
              <DialogTitle className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                What do you want to add?
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Choose an option to enhance your site experience and engage your audience
              </DialogDescription>
            </DialogHeader>
          </div>
          
          {/* Right side with options */}
          <div className="md:w-[60%] p-10">
            <div className="space-y-6">
              <OptionCard
                icon={<Database className="h-7 w-7 text-[rgb(166,148,255)] dark:text-[rgb(166,148,255)] transition-transform group-hover:scale-110 duration-200" />}
                title="I want to let people post something"
                description="Events, jobs, questions, ideas, and more. Enable your community to contribute content."
                onClick={() => onOpenChange(false)}
              />
              
              <OptionCard
                icon={<AppWindowMac className="h-7 w-7 text-blue-400 dark:text-blue-400 transition-transform group-hover:scale-110 duration-200" />}
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