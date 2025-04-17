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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      whileHover={{ scale: 1.01 }}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="flex items-start p-6 rounded-xl border border-gray-100/10 dark:border-gray-800/50 
        hover:border-gray-200/20 dark:hover:border-gray-700/50
        bg-white/5 dark:bg-gray-900/20 backdrop-blur-xl
        hover:bg-white/10 dark:hover:bg-gray-800/30
        transition-all duration-300 cursor-pointer"
    >
      <div className={`h-14 w-14 rounded-xl bg-${iconColor}-500/5 dark:bg-${iconColor}-900/10 
        flex items-center justify-center mr-5`}>
        {icon}
      </div>

      <div className="flex-1 pt-1">
        <h3 className="font-medium text-gray-900 dark:text-white text-base tracking-tight mb-1.5">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
          {description}
        </p>
      </div>

      <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500 self-center ml-4 opacity-50" />
    </motion.div>
  );
}

export function AddContentDialog({ open, onOpenChange }: AddContentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[800px] bg-gradient-to-b from-white/80 to-gray-50/95 
          dark:from-gray-900/90 dark:to-gray-800/95 shadow-2xl backdrop-blur-2xl
          rounded-2xl p-0 overflow-hidden border-0"
      >
        <div className="flex flex-col md:flex-row">
          <div className="bg-gradient-to-br from-gray-50/30 to-gray-100/20 
              dark:from-gray-850/30 dark:to-gray-800/20 p-10 md:w-[40%] 
              flex flex-col justify-center border-b md:border-b-0 md:border-r 
              border-gray-100/10 dark:border-gray-700/20"
          >
            <DialogHeader className="items-start text-left space-y-3">
              <div className="flex items-center gap-2.5 mb-2">
                <Sparkles className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  Content Creation
                </span>
              </div>
              <DialogTitle className="text-2xl font-semibold tracking-tight leading-tight 
                bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 
                dark:from-white dark:via-gray-200 dark:to-gray-300 
                bg-clip-text text-transparent">
                What would you like to create?
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Choose an option below to enhance your site experience and engage your audience
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="md:w-[60%] p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <OptionCard
                icon={<Database className="h-7 w-7 text-purple-500 dark:text-purple-400" />}
                iconColor="purple"
                title="Create Interactive Content"
                description="Enable your community to contribute through events, jobs, questions, ideas, and more."
                onClick={() => onOpenChange(false)}
              />

              <OptionCard
                icon={<AppWindowMac className="h-7 w-7 text-blue-500 dark:text-blue-400" />}
                iconColor="blue"
                title="Design New Page"
                description="Build structural content like homepage, explore page, or faculty landing pages."
                onClick={() => onOpenChange(false)}
              />
            </motion.div>

            <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
              Press ESC to dismiss • Press N to open
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}