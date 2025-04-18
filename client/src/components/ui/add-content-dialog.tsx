
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
      whileHover={{ scale: 1.005, y: -2 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="flex items-start p-10 rounded-3xl border border-white/5 dark:border-gray-800/5
        hover:border-white/10 dark:hover:border-gray-700/10
        bg-white/5 dark:bg-gray-900/5 backdrop-blur-xl
        hover:bg-white/10 dark:hover:bg-gray-800/10
        shadow-none hover:shadow-lg dark:shadow-gray-950/5
        transition-all duration-700 cursor-pointer group"
    >
      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-white to-gray-50/80 
        dark:from-gray-800 dark:to-gray-900/80 flex items-center justify-center mr-6
        shadow-sm group-hover:shadow-md transition-all duration-500">
        {icon}
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium text-base text-gray-900 dark:text-white tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="self-center ml-6 opacity-0 group-hover:opacity-100 transition-all duration-500 
        translate-x-2 group-hover:translate-x-0">
        <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
    </motion.div>
  );
}

export function AddContentDialog({ open, onOpenChange }: AddContentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl
        shadow-xl rounded-[2rem] p-0 overflow-hidden border-0">
        <div className="flex flex-col md:flex-row">
          <div className="bg-gradient-to-br from-white/30 to-white/5 dark:from-gray-850/40 dark:to-gray-800/10 
            p-16 md:w-[45%] flex flex-col justify-center border-b md:border-b-0 md:border-r 
            border-gray-100/30 dark:border-gray-800/30">
            <DialogHeader className="items-start text-left space-y-3">
              <DialogTitle className="text-3xl font-semibold tracking-tight 
                bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 
                dark:from-white dark:via-gray-200 dark:to-gray-300 
                bg-clip-text text-transparent">
                Create New
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Choose what you'd like to create and we'll guide you through the process
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="md:w-[55%] p-12">
            <div className="space-y-8">
              <OptionCard
                icon={<Database className="h-7 w-7 text-purple-500 dark:text-purple-400 transition-transform group-hover:scale-110 duration-500" />}
                title="Content Type"
                description="Define a new type of content to expand your platform's capabilities"
                onClick={() => onOpenChange(false)}
              />
              
              <OptionCard
                icon={<AppWindowMac className="h-7 w-7 text-blue-500 dark:text-blue-400 transition-transform group-hover:scale-110 duration-500" />}
                title="New Page"
                description="Design and create a new page in your site's structure"
                onClick={() => onOpenChange(false)}
              />
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400/80 dark:text-gray-500/80">
                Press ESC to close
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
