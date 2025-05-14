import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Database, AppWindowMac, File, MessageSquare, Star, Calendar, Plus, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";

// Memo-ized components for better performance
const MemoizedContentOption = React.memo(ContentOption);

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
  description?: string;
  badges: Array<{
    icon: React.ReactNode;
    label: string;
  }>;
  badgeBgColor: string;
  badgeTextColor: string;
  onClick: () => void;
  extraText?: string;
}

// Animation variants - lightweight config
const cardVariants = {
  hover: { 
    scale: 1.005, 
    y: -2,
  },
  tap: { 
    scale: 0.995,
  }
};

function ContentOption({
  icon,
  iconBgFrom,
  iconBgTo,
  iconRing,
  iconColor,
  title,
  description,
  badges,
  badgeBgColor,
  badgeTextColor,
  onClick,
  extraText,
}: ContentOptionProps) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      style={{ 
        transform: "translate3d(0,0,0)", 
        backfaceVisibility: "hidden"
      }}
      transition={{ 
        type: "tween", 
        duration: 0.15,
        ease: "easeOut"
      }}
      className="rounded-2xl border border-white/20 dark:border-gray-800/30 
                bg-white/15 dark:bg-gray-900/20 p-6 cursor-pointer
                shadow-lg hover:shadow-xl hover:border-white/40 dark:hover:border-gray-700/40 
                transition-all duration-200 ease-in-out relative group overflow-hidden"
      onClick={onClick}
    >
      {/* Static gradient overlay with CSS-only transition */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 dark:to-purple-500/5 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-150"></div>
      
      <div className="flex items-start gap-5 mb-4">
        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center 
                      bg-gradient-to-br ${iconBgFrom} ${iconBgTo} 
                      ring-1 ${iconRing} shadow-lg group-hover:rotate-2 transition-transform duration-200`}
                      style={{ transform: "translate3d(0,0,0)" }}>
          {React.cloneElement(icon as React.ReactElement, { 
            className: `h-6 w-6 ${iconColor}` 
          })}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-xl tracking-tight text-gray-800 dark:text-white/95 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-150">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 mt-3">
        {badges.map((badge, index) => (
          <span
            key={index}
            className={`px-3 py-1.5 text-xs font-medium rounded-full flex items-center gap-1.5 
                      whitespace-nowrap ${badgeBgColor} ${badgeTextColor}
                      shadow-sm hover:-translate-y-0.5 transition-transform duration-150`}
            style={{ transform: "translate3d(0,0,0)" }}
          >
            {React.cloneElement(badge.icon as React.ReactElement, { 
              className: 'h-3.5 w-3.5' 
            })}
            {badge.label}
          </span>
        ))}
        {extraText && (
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1 flex items-center">{extraText}</span>
        )}
      </div>
      
      {/* CSS-only arrow */}
      <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
    </motion.div>
  );
}

// Lightweight dialog animation variants
const dialogVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

export function AddContentDialog({
  open,
  onOpenChange,
}: AddContentDialogProps) {
  // Prevent unnecessary re-renders with useMemo for content sections
  const dialogContent = React.useMemo(() => (
    <div className="flex flex-col md:flex-row">
      <div
        className="bg-gradient-to-br from-white/40 to-white/10 dark:from-gray-850/40 dark:to-gray-800/10 
                  p-12 md:p-16 md:w-[45%] flex flex-col justify-center border-b md:border-b-0 md:border-r 
                  border-gray-100/30 dark:border-gray-800/30 relative overflow-hidden"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        {/* Simplified background with CSS gradients instead of elements */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none" 
          style={{ 
            background: "radial-gradient(circle at top left, rgb(168, 85, 247, 0.15), transparent 70%), radial-gradient(circle at bottom right, rgb(59, 130, 246, 0.15), transparent 70%)",
            transform: "translate3d(0,0,0)"
          }}>
        </div>
        
        <DialogHeader className="items-start text-left space-y-4 relative z-10">
          <DialogTitle
            className="text-4xl font-bold tracking-tight 
                    bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 
                    dark:from-white dark:via-gray-200 dark:to-gray-300 
                    bg-clip-text text-transparent"
            style={{ transform: "translate3d(0,0,0)" }}
          >
            What do you want to add to your site?
          </DialogTitle>
          
          <DialogDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mt-4">
            Choose what you'd like to create and we'll guide you through the
            process with tailored templates and options.
          </DialogDescription>
        </DialogHeader>
      </div>

      <div className="md:w-[55%] p-8 md:p-12 space-y-6">
        <div className="space-y-6">
          <MemoizedContentOption
            icon={<Database />}
            iconBgFrom="from-purple-50/50"
            iconBgTo="to-purple-100/40"
            iconRing="ring-purple-200/60 dark:ring-purple-700/60"
            iconColor="text-purple-500/90 dark:text-purple-400/90"
            title="I want to let people post something"
            description="Create interactive spaces for your community to share content"
            badges={[
              { icon: <Calendar className="h-3.5 w-3.5" />, label: "Event" },
              { icon: <MessageSquare className="h-3.5 w-3.5" />, label: "Discussion" },
              { icon: <Star className="h-3.5 w-3.5" />, label: "Q&A" },
              { icon: <Star className="h-3.5 w-3.5" />, label: "Wishlist" },
            ]}
            badgeBgColor="bg-purple-500/10 hover:bg-purple-500/15"
            badgeTextColor="text-purple-600/90 dark:text-purple-300/90"
            onClick={() => onOpenChange(false)}
            extraText={"and more"}
          />

          <MemoizedContentOption
            icon={<AppWindowMac />}
            iconBgFrom="from-blue-50/50"
            iconBgTo="to-blue-100/40"
            iconRing="ring-blue-200/60 dark:ring-blue-700/60"
            iconColor="text-blue-500/90 dark:text-blue-400/90"
            title="I want to create a new page"
            description="Build custom pages to showcase your content and resources"
            badges={[
              { icon: <File className="h-3.5 w-3.5" />, label: "Homepage" },
              { icon: <File className="h-3.5 w-3.5" />, label: "Explore" },
              { icon: <MessageSquare className="h-3.5 w-3.5" />, label: "Feed" },
              { icon: <File className="h-3.5 w-3.5" />, label: "Landing" },
            ]}
            badgeBgColor="bg-blue-500/10 hover:bg-blue-500/15"
            badgeTextColor="text-blue-600/90 dark:text-blue-300/90"
            onClick={() => onOpenChange(false)}
            extraText={"and more"}
          />
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs font-medium text-gray-400/90 dark:text-gray-500/90">
            Press <kbd className="px-2 py-0.5 rounded-md bg-gray-100/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-sans">ESC</kbd> to close
          </p>
        </div>
      </div>
    </div>
  ), [onOpenChange]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        {open && (
          <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
              className="sm:max-w-[950px] bg-white/95 dark:bg-gray-900/95 
                        shadow-2xl rounded-[2rem] p-0 overflow-hidden border-0"
            >
              <motion.div 
                variants={dialogVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.15 }}
                style={{ 
                  transform: "translate3d(0,0,0)", 
                  backfaceVisibility: "hidden",
                  WebkitFontSmoothing: "antialiased"
                }}
              >
                {dialogContent}
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}