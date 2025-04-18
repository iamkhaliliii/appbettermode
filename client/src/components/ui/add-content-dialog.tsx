import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Database, AppWindowMac, ChevronRight, File } from "lucide-react";
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
      className="flex flex-col rounded-2xl border border-white/5 dark:border-gray-800/5
        hover:border-white/10 dark:hover:border-gray-700/10
        bg-white/5 dark:bg-gray-900/5 backdrop-blur-xl
        hover:bg-white/10 dark:hover:bg-gray-800/10
        shadow-none hover:shadow-lg dark:shadow-gray-950/5
        transition-all duration-700 cursor-pointer group"
    >
      <div className="p-6 flex items-start">
        <div
          className="h-10 w-10 rounded-lg bg-gradient-to-br from-white to-gray-50/80 
          dark:from-gray-800 dark:to-gray-900/80 flex items-center justify-center mr-4
          shadow-sm group-hover:shadow-md transition-all duration-500"
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-sm text-gray-900 dark:text-white tracking-tight">
            {title}
          </h3>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
            {typeof description === "string"
              ? description
              : description.props.children[0]}
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex flex-wrap gap-1.5 items-center pb-4">
          {typeof description === "object" &&
            "props" in description &&
            description.props.children[1]}
        </div>
      </div>
      <div
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 
        translate-x-2 group-hover:translate-x-0"
      >
        <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
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
                className="text-3xl font-semibold tracking-tight 
                bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 
                dark:from-white dark:via-gray-200 dark:to-gray-300 
                bg-clip-text text-transparent"
              >
                Create New
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Choose what you'd like to create and we'll guide you through the
                process
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="md:w-[55%] p-12">
            <div className="space-y-8">
              <OptionCard
                icon={null}
                title="Create Post"
                description={
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Post title"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50"
                      />
                      <textarea
                        placeholder="Write your post content..."
                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 min-h-[100px]"
                      />
                    </div>
                    <div className="relative w-full h-[30px]">
                      <div className="absolute inset-x-0 flex items-center justify-center gap-1.5 pb-4 overflow-x-auto mask-fade-x scrollbar-hide">
                        <span className="shrink-0 px-3 py-1.5 text-[11px] bg-purple-500/5 text-purple-500/70 dark:text-purple-400/70 rounded-full flex items-center gap-2">
                          <Database className="h-3.5 w-3.5 opacity-50" />
                          Discussion
                        </span>
                        <span className="shrink-0 px-2.5 py-1 text-xs bg-purple-500/5 text-purple-500/70 dark:text-purple-400/70 rounded-full flex items-center gap-1.5">
                          <Database className="h-3 w-3 opacity-50" />
                          Q&A
                        </span>
                        <span className="shrink-0 px-2.5 py-1 text-xs bg-purple-500/5 text-purple-500/70 dark:text-purple-400/70 rounded-full flex items-center gap-1.5">
                          <Database className="h-3 w-3 opacity-50" />
                          Knowledge Base
                        </span>
                        <span className="shrink-0 px-2.5 py-1 text-xs bg-purple-500/5 text-purple-500/70 dark:text-purple-400/70 rounded-full flex items-center gap-1.5">
                          <Database className="h-3 w-3 opacity-50" />
                          Ideas & Feedback
                        </span>
                        <span className="shrink-0 px-2.5 py-1 text-xs bg-purple-500/5 text-purple-500/70 dark:text-purple-400/70 rounded-full flex items-center gap-1.5">
                          <Database className="h-3 w-3 opacity-50" />
                          Changelog
                        </span>
                        <span className="shrink-0 px-2.5 py-1 text-xs bg-purple-500/5 text-purple-500/70 dark:text-purple-400/70 rounded-full flex items-center gap-1.5">
                          <Database className="h-3 w-3 opacity-50" />
                          Product Update
                        </span>
                        <span className="shrink-0 px-2.5 py-1 text-xs bg-purple-500/5 text-purple-500/70 dark:text-purple-400/70 rounded-full flex items-center gap-1.5">
                          <Database className="h-3 w-3 opacity-50" />
                          Roadmap
                        </span>
                        <span className="shrink-0 px-2.5 py-1 text-xs bg-purple-500/5 text-purple-500/70 dark:text-purple-400/70 rounded-full flex items-center gap-1.5">
                          <Database className="h-3 w-3 opacity-50" />
                          Announcements
                        </span>
                        <span className="shrink-0 px-2.5 py-1 text-xs bg-purple-500/5 text-purple-500/70 dark:text-purple-400/70 rounded-full flex items-center gap-1.5">
                          <Database className="h-3 w-3 opacity-50" />
                          Wiki
                        </span>
                        <span className="shrink-0 px-2.5 py-1 text-xs bg-purple-500/5 text-purple-500/70 dark:text-purple-400/70 rounded-full flex items-center gap-1.5">
                          <Database className="h-3 w-3 opacity-50" />
                          Member Directory
                        </span>
                        <span className="shrink-0 px-2.5 py-1 text-xs bg-purple-500/5 text-purple-500/70 dark:text-purple-400/70 rounded-full flex items-center gap-1.5">
                          <Database className="h-3 w-3 opacity-50" />
                          Event
                        </span>
                        <span className="shrink-0 px-2.5 py-1 text-xs bg-purple-500/5 text-purple-500/70 dark:text-purple-400/70 rounded-full flex items-center gap-1.5">
                          <Database className="h-3 w-3 opacity-50" />
                          Course
                        </span>
                        <span className="shrink-0 px-2.5 py-1 text-xs bg-purple-500/5 text-purple-500/70 dark:text-purple-400/70 rounded-full flex items-center gap-1.5">
                          <Database className="h-3 w-3 opacity-50" />
                          Jobs
                        </span>
                        <span className="shrink-0 px-2.5 py-1 text-xs bg-purple-500/5 text-purple-500/70 dark:text-purple-400/70 rounded-full flex items-center gap-1.5">
                          <Database className="h-3 w-3 opacity-50" />
                          Speakers
                        </span>
                        <span className="shrink-0 px-2.5 py-1 text-xs bg-purple-500/5 text-purple-500/70 dark:text-purple-400/70 rounded-full flex items-center gap-1.5">
                          <Database className="h-3 w-3 opacity-50" />
                          Article
                        </span>
                      </div>
                    </div>
                  </div>
                }
                onClick={() => onOpenChange(false)}
              />

              <OptionCard
                icon={
                  <AppWindowMac className="h-7 w-7 text-blue-500 dark:text-blue-400 transition-transform group-hover:scale-110 duration-500" />
                }
                title="New Page"
                description={
                  <div className="space-y-2">
                    <p>Design and create a new page in your site's structure</p>
                    <div className="relative mt-1.5 w-full h-[30px]">
                      <div className="absolute inset-x-0 flex items-center justify-center gap-1.5 pb-4 overflow-x-auto mask-fade-x scrollbar-hide">
                        <span className="shrink-0 px-3 py-1.5 text-[11px] bg-blue-500/5 text-blue-500/70 dark:text-blue-400/70 rounded-full flex items-center gap-2">
                          <File className="h-3.5 w-3.5 opacity-50" />
                          Landing
                        </span>
                        <span className="shrink-0 px-2.5 py-1 text-xs bg-blue-500/5 text-blue-500/70 dark:text-blue-400/70 rounded-full flex items-center gap-1.5">
                          <File className="h-3 w-3 opacity-50" />
                          About Us
                        </span>
                        <span className="shrink-0 px-2.5 py-1 text-xs bg-blue-500/5 text-blue-500/70 dark:text-blue-400/70 rounded-full flex items-center gap-1.5">
                          <File className="h-3 w-3 opacity-50" />
                          Contact
                        </span>
                        <span className="shrink-0 px-2.5 py-1 text-xs bg-blue-500/5 text-blue-500/70 dark:text-blue-400/70 rounded-full flex items-center gap-1.5">
                          <File className="h-3 w-3 opacity-50" />
                          Features
                        </span>
                        <span className="shrink-0 px-2.5 py-1 text-xs bg-blue-500/5 text-blue-500/70 dark:text-blue-400/70 rounded-full flex items-center gap-1.5">
                          <File className="h-3 w-3 opacity-50" />
                          Blog
                        </span>
                      </div>
                    </div>
                  </div>
                }
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