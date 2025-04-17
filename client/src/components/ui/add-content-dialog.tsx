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
      <DialogContent className="w-full max-w-md p-0 border-0 overflow-hidden bg-white/80 dark:bg-gray-900/90 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Create
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
              <motion.button
                key={item.title}
                whileHover={{ scale: 1.01 }}
                onClick={() => onOpenChange(false)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-100/10 
                  dark:border-gray-800 bg-white/5 dark:bg-gray-800/50 hover:bg-white/10 
                  dark:hover:bg-gray-700/50 backdrop-blur-sm text-left"
              >
                <div className={`text-${item.color}-500`}>{item.icon}</div>
                <div>
                  <div className="font-medium mb-0.5 text-gray-900 dark:text-white">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {item.description}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="text-center text-[10px] text-gray-400">
            Press ESC to close • Press N to open
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}