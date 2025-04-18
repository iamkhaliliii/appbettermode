import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Database, AppWindowMac, File, MessageSquare, Star, Calendar, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ContentOptionProps {
  icon: React.ReactNode;
  iconBgFrom: string;
  iconBgTo: string;
  iconRing: string;
  iconColor: string;
  title: string;
  badges: Array<{
    icon: React.ReactNode;
    label: string;
  }>;
  badgeBgColor: string;
  badgeTextColor: string;
  onClick: () => void;
  extraText?: string; // Added extraText prop
}

function ContentOption({
  icon,
  iconBgFrom,
  iconBgTo,
  iconRing,
  iconColor,
  title,
  badges,
  badgeBgColor,
  badgeTextColor,
  onClick,
  extraText, // Use extraText prop
}: ContentOptionProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.005, y: -2 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="rounded-xl border border-white/20 dark:border-gray-800/20 
                bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl p-5 cursor-pointer
                shadow-md hover:shadow-lg hover:border-white/30 dark:hover:border-gray-700/30 
                transition-all duration-300 ease-in-out"
      onClick={onClick}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center 
                      bg-gradient-to-br ${iconBgFrom} ${iconBgTo} 
                      ring-1 ${iconRing} shadow-inner`}>
          {React.cloneElement(icon as React.ReactElement, { 
            className: `h-5 w-5 ${iconColor}` 
          })}
        </div>
        <h3 className="font-semibold text-lg tracking-tight text-gray-800 dark:text-white/95">
          {title}
        </h3>
      </div>

      <div className="flex flex-wrap gap-2.5 pl-16 mt-2">
        {badges.map((badge, index) => (
          <span
            key={index}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 
                      whitespace-nowrap ${badgeBgColor} ${badgeTextColor}
                      shadow-sm transition-all duration-200 hover:scale-102`}
          >
            {React.cloneElement(badge.icon as React.ReactElement, { 
              className: 'h-3 w-3' 
            })}
            {badge.label}
          </span>
        ))}
        {extraText && (
          <div className="pl-16 mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">{extraText}</span>
          </div>
        )}
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
        className="sm:max-w-[920px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-3xl
                  shadow-2xl rounded-[2.5rem] p-0 overflow-hidden border-0"
      >
        <div className="flex flex-col md:flex-row">
          <div
            className="bg-gradient-to-br from-white/30 to-white/5 dark:from-gray-850/40 dark:to-gray-800/10 
                      p-16 md:w-[45%] flex flex-col justify-center border-b md:border-b-0 md:border-r 
                      border-gray-100/30 dark:border-gray-800/30"
          >
            <DialogHeader className="items-start text-left space-y-4">
              <DialogTitle
                className="text-4xl font-bold tracking-tight 
                          bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 
                          dark:from-white dark:via-gray-200 dark:to-gray-300 
                          bg-clip-text text-transparent"
              >
                What do you want to add to your site?
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mt-2">
                Choose what you'd like to create and we'll guide you through the
                process with tailored templates and options.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="md:w-[55%] p-8 md:p-12">
            <div className="space-y-6">
              <ContentOption
                icon={<Database />}
                iconBgFrom="from-purple-50/40"
                iconBgTo="to-purple-100/30"
                iconRing="ring-purple-200/50 dark:ring-purple-700/50"
                iconColor="text-purple-500/90 dark:text-purple-400/90"
                title="I want to let people post something"
                badges={[
                  { icon: <Calendar className="h-3.5 w-3.5" />, label: "Event" },
                  { icon: <MessageSquare className="h-3.5 w-3.5" />, label: "Discussion" },
                  { icon: <Star className="h-3.5 w-3.5" />, label: "Q&A" },
                  { icon: <Star className="h-3.5 w-3.5" />, label: "Wishlist" },
                  //Removed Plus icon and "More" label
                ]}
                badgeBgColor="bg-purple-500/5"
                badgeTextColor="text-purple-600/90 dark:text-purple-300/90"
                onClick={() => onOpenChange(false)}
                extraText={"and more"} // Added extraText
              />

              <ContentOption
                icon={<AppWindowMac />}
                iconBgFrom="from-blue-50/40"
                iconBgTo="to-blue-100/30"
                iconRing="ring-blue-200/50 dark:ring-blue-700/50"
                iconColor="text-blue-500/90 dark:text-blue-400/90"
                title="I want to create a new page"
                badges={[
                  { icon: <File className="h-3.5 w-3.5" />, label: "Homepage" },
                  { icon: <File className="h-3.5 w-3.5" />, label: "Explore" },
                  { icon: <MessageSquare className="h-3.5 w-3.5" />, label: "Feed" },
                  { icon: <File className="h-3.5 w-3.5" />, label: "Landing" },
                  //Removed Plus icon and "More" label
                ]}
                badgeBgColor="bg-blue-500/5"
                badgeTextColor="text-blue-600/90 dark:text-blue-300/90"
                onClick={() => onOpenChange(false)}
                extraText={"and more"} // Added extraText
              />
            </div>

            <div className="mt-8 text-center">
              <p className="text-xs font-medium text-gray-400/90 dark:text-gray-500/90">
                Press ESC to close
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}