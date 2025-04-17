
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Database, AppWindowMac, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OptionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function OptionCard({ icon, title, description, onClick }: OptionCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="flex items-start p-6 rounded-xl border border-gray-100/50 dark:border-gray-800/50
        hover:border-gray-200 dark:hover:border-gray-700
        bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm
        hover:bg-white dark:hover:bg-gray-800
        shadow-sm hover:shadow-md dark:shadow-gray-900/30
        transition-all duration-300 cursor-pointer group"
    >
      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-white to-gray-50 
        dark:from-gray-800 dark:to-gray-850 flex items-center justify-center mr-5
        shadow-sm group-hover:shadow-md transition-all duration-300">
        {icon}
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-white tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="self-center ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300 
        translate-x-2 group-hover:translate-x-0">
        <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
    </motion.div>
  );
}

export function AddContentDialog({ open, onOpenChange }: AddContentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
        shadow-2xl rounded-2xl p-0 overflow-hidden border-0">
        <div className="flex flex-col md:flex-row">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-850 dark:to-gray-800/50 
            p-8 md:w-[40%] flex flex-col justify-center border-b md:border-b-0 md:border-r 
            border-gray-100 dark:border-gray-800">
            <DialogHeader className="items-start text-left space-y-2">
              <DialogTitle className="text-2xl font-semibold tracking-tight 
                bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 
                dark:from-white dark:via-gray-200 dark:to-gray-300 
                bg-clip-text text-transparent">
                What would you like to create?
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Choose an option to start building your next feature
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="md:w-[60%] p-6">
            <div className="space-y-4">
              <OptionCard
                icon={<Database className="h-6 w-6 text-purple-500 dark:text-purple-400 transition-transform group-hover:scale-110 duration-300" />}
                title="Create Content Type"
                description="Define a new type of content that users can contribute to your platform"
                onClick={() => onOpenChange(false)}
              />
              
              <OptionCard
                icon={<AppWindowMac className="h-6 w-6 text-blue-500 dark:text-blue-400 transition-transform group-hover:scale-110 duration-300" />}
                title="Add New Page"
                description="Design and create a new page for your site's structure"
                onClick={() => onOpenChange(false)}
              />
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Press ESC to close
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
