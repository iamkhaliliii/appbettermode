
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Database, AppWindowMac, ChevronRight, File, MessageSquare, Star, Calendar, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddContentDialog({
  open,
  onOpenChange,
}: AddContentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[900px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl
        shadow-xl rounded-[2rem] p-0 overflow-hidden border-0"
      >
        <div className="flex flex-col md:flex-row">
          <div
            className="bg-gradient-to-br from-white/30 to-white/5 dark:from-gray-850/40 dark:to-gray-800/10 
            p-16 md:w-[45%] flex flex-col justify-center border-b md:border-b-0 md:border-r 
            border-gray-100/30 dark:border-gray-800/30"
          >
            <DialogHeader className="items-start text-left space-y-3">
              <DialogTitle
                className="text-4xl font-semibold tracking-tight 
                bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 
                dark:from-white dark:via-gray-200 dark:to-gray-300 
                bg-clip-text text-transparent"
              >
                What do you want to add to your site?
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Choose what you'd like to create and we'll guide you through the
                process
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="md:w-[55%] p-8 md:p-12">
            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.002, y: -1 }}
                whileTap={{ scale: 0.998 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="rounded-xl border border-white/10 dark:border-gray-800/10 bg-white/5 dark:bg-gray-900/5 backdrop-blur-xl p-6 cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-50/40 to-purple-100/30 dark:from-purple-900/40 dark:to-purple-800/30 ring-1 ring-purple-200/50 dark:ring-purple-700/50">
                    <Database className="h-4 w-4 text-purple-500/90 dark:text-purple-400/90" />
                  </div>
                  <h3 className="font-semibold text-base text-gray-800 dark:text-white/95">
                    Add New Content Type
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 pl-14">
                  {[
                    { icon: <MessageSquare className="h-3.5 w-3.5" />, label: "Discussion" },
                    { icon: <Star className="h-3.5 w-3.5" />, label: "Q&A" },
                    { icon: <Calendar className="h-3.5 w-3.5" />, label: "Wishlist" },
                    { icon: <Plus className="h-3.5 w-3.5" />, label: "Event" }
                  ].map((badge, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 whitespace-nowrap
                      bg-purple-500/10 text-purple-600 dark:text-purple-300"
                    >
                      {badge.icon}
                      {badge.label}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.002, y: -1 }}
                whileTap={{ scale: 0.998 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="rounded-xl border border-white/10 dark:border-gray-800/10 bg-white/5 dark:bg-gray-900/5 backdrop-blur-xl p-6 cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-50/40 to-blue-100/30 dark:from-blue-900/40 dark:to-blue-800/30 ring-1 ring-blue-200/50 dark:ring-blue-700/50">
                    <AppWindowMac className="h-4 w-4 text-blue-500/90 dark:text-blue-400/90" />
                  </div>
                  <h3 className="font-semibold text-base text-gray-800 dark:text-white/95">
                    I want to create a new page
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 pl-14">
                  {[
                    { icon: <File className="h-3.5 w-3.5" />, label: "Homepage" },
                    { icon: <File className="h-3.5 w-3.5" />, label: "Explore Page" },
                    { icon: <File className="h-3.5 w-3.5" />, label: "Faculty Landing" },
                    { icon: <Plus className="h-3.5 w-3.5" />, label: "More Pages" }
                  ].map((badge, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 whitespace-nowrap
                      bg-blue-500/10 text-blue-600 dark:text-blue-300"
                    >
                      {badge.icon}
                      {badge.label}
                    </span>
                  ))}
                </div>
              </motion.div>
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
