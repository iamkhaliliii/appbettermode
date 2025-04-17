import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircle, FileText } from "lucide-react";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddContentDialog({ open, onOpenChange }: AddContentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-none bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-center">
            What do you want to add to your site?
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <button
            onClick={() => onOpenChange(false)}
            className="flex flex-col items-center space-y-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all group"
          >
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40 transition-colors">
              <PlusCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">I want to let people post something</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Examples: events, jobs, questions, ideas…</p>
            </div>
          </button>
          
          <button
            onClick={() => onOpenChange(false)}
            className="flex flex-col items-center space-y-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-all group"
          >
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40 transition-colors">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-gray-900 dark:text-white text-sm">I want to create a new page</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Examples: homepage, explore page, faculty landing page…</p>
            </div>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}