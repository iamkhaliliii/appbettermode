import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ContentCard } from "@/components/ui/content-card";
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
              >
                <ContentCard
                  variant="content-type"
                  icon={
                    <Database className="h-4 w-4 text-purple-500/90 dark:text-purple-400/90 transition-transform group-hover:scale-110 duration-300" />
                  }
                  title="Add New Content Type"
                  description="Choose from our pre-built content types or create a custom one"
                  iconColor="purple"
                  badges={[
                    {
                      icon: <Database className="h-3.5 w-3.5" />,
                      label: "Discussion",
                      color: "purple"
                    },
                    {
                      icon: <MessageSquare className="h-3.5 w-3.5" />,
                      label: "Q&A",
                      color: "purple"
                    },
                    {
                      icon: <Star className="h-3.5 w-3.5" />,
                      label: "Wishlist",
                      color: "purple"
                    },
                    {
                      icon: <Calendar className="h-3.5 w-3.5" />,
                      label: "Event",
                      color: "purple"
                    }
                  ]}
                  onClick={() => onOpenChange(false)}
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.002, y: -1 }}
                whileTap={{ scale: 0.998 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <ContentCard
                  variant="page"
                  icon={
                    <AppWindowMac className="h-4 w-4 text-blue-500/90 dark:text-blue-400/90 transition-transform group-hover:scale-110 duration-300" />
                  }
                  title="I want to create a new page"
                  description="Design and create a new page in your site's structure"
                  iconColor="blue"
                  badges={[
                    {
                      icon: <File className="h-3.5 w-3.5" />,
                      label: "Homepage",
                      color: "blue"
                    },
                    {
                      icon: <File className="h-3.5 w-3.5" />,
                      label: "Explore Page",
                      color: "blue"
                    },
                    {
                      icon: <File className="h-3.5 w-3.5" />,
                      label: "Faculty Landing",
                      color: "blue"
                    },
                    {
                      icon: <Plus className="h-3.5 w-3.5" />,
                      label: "More Pages",
                      color: "blue"
                    }
                  ]}
                  onClick={() => onOpenChange(false)}
                />
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