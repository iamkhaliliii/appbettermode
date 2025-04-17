
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Database, AppWindowMac, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OptionCardProps {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
  onClick: () => void;
}

function OptionCard({ icon, iconColor, title, description, onClick }: OptionCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="flex items-start p-8 rounded-2xl border border-gray-100/50 dark:border-gray-800/50 
        hover:border-gray-200 dark:hover:border-gray-700
        bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl
        hover:bg-white dark:hover:bg-gray-800
        hover:shadow-xl dark:hover:shadow-gray-900/30
        transition-all duration-300 cursor-pointer group"
    >
      <div className={`h-16 w-16 rounded-2xl bg-${iconColor}-50 dark:bg-${iconColor}-900/20 
        flex items-center justify-center mr-7 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      
      <div className="flex-1 pt-1">
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg tracking-tight mb-2 
          group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
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
      <DialogContent 
        className="sm:max-w-[800px] bg-gradient-to-b from-white to-gray-50/95 
          dark:from-gray-900 dark:to-gray-800/95 shadow-2xl backdrop-blur-2xl
          rounded-3xl p-0 overflow-hidden border-0"
      >
        <div className="flex flex-col md:flex-row">
          {/* Left side with heading */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 
            dark:from-gray-850 dark:to-gray-800/50 p-12 md:w-[40%] 
            flex flex-col justify-center border-b md:border-b-0 md:border-r 
            border-gray-100 dark:border-gray-700/50">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <DialogHeader className="items-start text-left space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="h-6 w-6 text-purple-500 dark:text-purple-400" />
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    Content Creation
                  </span>
                </div>
                <DialogTitle className="text-3xl font-bold tracking-tight leading-tight 
                  bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 
                  dark:from-white dark:via-gray-200 dark:to-gray-300 
                  bg-clip-text text-transparent">
                  What would you like to create?
                </DialogTitle>
                <DialogDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                  Choose an option below to enhance your site experience and engage your audience
                </DialogDescription>
              </DialogHeader>
            </motion.div>
          </div>
          
          {/* Right side with options */}
          <div className="md:w-[60%] p-10">
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <OptionCard
                icon={<Database className="h-8 w-8 text-purple-500 dark:text-purple-400" />}
                iconColor="purple"
                title="Create Interactive Content"
                description="Enable your community to contribute through events, jobs, questions, ideas, and more."
                onClick={() => onOpenChange(false)}
              />
              
              <OptionCard
                icon={<AppWindowMac className="h-8 w-8 text-blue-500 dark:text-blue-400" />}
                iconColor="blue"
                title="Design New Page"
                description="Build structural content like homepage, explore page, or faculty landing pages."
                onClick={() => onOpenChange(false)}
              />
            </motion.div>
            
            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Press ESC to dismiss • Press N to open
              </p>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
