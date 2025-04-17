
import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Database, Sparkles, AppWindowMac } from "lucide-react";
import { motion } from "framer-motion";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddContentDialog({ open, onOpenChange }: AddContentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md p-6 border-0 overflow-hidden bg-gradient-to-b from-white/90 to-gray-50/95 dark:from-gray-900/95 dark:to-gray-800/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Sparkles className="h-5 w-5 text-purple-500" />
            </motion.div>
            <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
              Create Something New
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                icon: <Database className="h-5 w-5" />,
                title: "Interactive Content",
                color: "purple",
                description: "Add events, jobs, questions or ideas"
              },
              {
                icon: <AppWindowMac className="h-5 w-5" />,
                title: "New Page",
                color: "blue",
                description: "Design structural pages"
              }
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02, x: 4 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <button
                  onClick={() => onOpenChange(false)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border border-gray-100/20 
                    dark:border-gray-700/30 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm
                    hover:bg-white/50 dark:hover:bg-gray-700/50 hover:border-gray-200/30 
                    dark:hover:border-gray-600/30 transition-all duration-200 text-left
                    shadow-sm hover:shadow-md"
                >
                  <div className={`text-${item.color}-500 dark:text-${item.color}-400 
                    bg-${item.color}-50/30 dark:bg-${item.color}-900/30 p-2.5 rounded-lg`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.5 }}
            className="text-center text-[10px] text-gray-400"
          >
            Press ESC to close • Press N to open
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
