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

interface OptionCardProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  onClick: () => void;
}

function OptionCard({ icon, title, description, onClick }: OptionCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.002, y: -1 }}
      whileTap={{ scale: 0.998 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="flex items-center justify-between px-5 py-4 rounded-xl border border-white/10 dark:border-gray-800/10
        bg-white/5 dark:bg-gray-900/5 backdrop-blur-xl
        hover:bg-white/10 dark:hover:bg-gray-800/10
        shadow-none hover:shadow-md dark:shadow-gray-950/5
        transition-all duration-500 cursor-pointer group"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <div
            className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-50/40 to-purple-100/30 
            dark:from-purple-900/40 dark:to-purple-800/30 flex items-center justify-center
            ring-1 ring-purple-200/50 dark:ring-purple-700/50 group-hover:ring-purple-300 dark:group-hover:ring-purple-600
            transition-all duration-500"
          >
            {icon}
          </div>
          <h3 className="font-semibold text-base text-gray-800 dark:text-white/95">
            {title}
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-2 pl-14">
          <span className="shrink-0 px-2 py-1 text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-300 rounded-md flex items-center gap-1.5">
            <Database className="h-4 w-4" />
            Discussion
          </span>
          <span className="shrink-0 px-3 py-1.5 text-sm font-medium bg-purple-500/10 text-purple-600 dark:text-purple-300 rounded-lg flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Q&A
          </span>
          <span className="shrink-0 px-3 py-1.5 text-sm font-medium bg-purple-500/10 text-purple-600 dark:text-purple-300 rounded-lg flex items-center gap-2">
            <Star className="h-4 w-4" />
            Wishlist
          </span>
          <span className="shrink-0 px-3 py-1.5 text-sm font-medium bg-purple-500/10 text-purple-600 dark:text-purple-300 rounded-lg flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Event
          </span>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-all duration-500" />
      </div>
    </motion.div>
  );
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
                    icon: <Database className="h-4 w-4" />,
                    label: "Discussion",
                    color: "purple"
                  },
                  {
                    icon: <MessageSquare className="h-4 w-4" />,
                    label: "Q&A",
                    color: "blue"
                  },
                  {
                    icon: <Star className="h-4 w-4" />,
                    label: "Wishlist",
                    color: "amber"
                  },
                  {
                    icon: <Calendar className="h-4 w-4" />,
                    label: "Event",
                    color: "green"
                  },
                  {
                    icon: <Plus className="h-4 w-4" />,
                    label: "More Types"
                  }
                ]}
                onClick={() => onOpenChange(false)}
              />

              <ContentCard
                variant="page"
                icon={
                  <AppWindowMac className="h-3.5 w-3.5 text-blue-500/90 dark:text-blue-400/90 transition-transform group-hover:scale-105 duration-500" />
                }
                title="I want to create a new page"
                description="Design and create a new page in your site's structure"
                iconColor="blue"
                badges={[
                  {
                    icon: <File className="h-3 w-3" />,
                    label: "Homepage",
                    color: "blue"
                  },
                  {
                    icon: <File className="h-3 w-3" />,
                    label: "Explore Page",
                    color: "blue"
                  },
                  {
                    icon: <File className="h-3 w-3" />,
                    label: "Faculty Landing",
                    color: "blue"
                  },
                  {
                    icon: <Plus className="h-3 w-3" />,
                    label: "More Pages"
                  }
                ]}
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