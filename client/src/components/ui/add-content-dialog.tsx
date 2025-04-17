import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PlusCircle, FileText, Sparkles, Zap, ArrowRight } from "lucide-react";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Option card component to avoid nesting button inside button
interface OptionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  animationDelay?: string;
}

function OptionCard({ icon, title, description, onClick, animationDelay = "0ms" }: OptionCardProps) {
  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-center space-y-3 p-5 rounded-xl border border-gray-200/50 dark:border-gray-700/50 
        hover:border-purple-500 dark:hover:border-purple-500 
        hover:bg-gradient-to-br hover:from-purple-50/70 hover:to-indigo-50/50
        dark:hover:bg-gradient-to-br dark:hover:from-purple-900/10 dark:hover:to-indigo-900/5
        hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-pointer group relative overflow-hidden animate-fadeIn"
      style={{ 
        animationDelay,
        boxShadow: '0 4px 20px -8px rgba(120, 70, 190, 0.15)'
      }}
    >
      {/* Subtle gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 dark:from-purple-400/5 dark:to-indigo-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Animated border glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-purple-500/10 dark:from-purple-400/10 dark:via-indigo-400/10 dark:to-purple-400/10 animate-shimmer"></div>
      </div>
      
      {/* Icon container with subtle animations */}
      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/20 flex items-center justify-center z-10
        group-hover:from-purple-200 group-hover:to-indigo-200 dark:group-hover:from-purple-800/40 dark:group-hover:to-indigo-800/30 
        shadow-inner transition-all duration-300 relative">
        {icon}
        
        {/* Particle effect on hover */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 overflow-hidden transition-opacity duration-300">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-shimmer"></div>
          <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent animate-shimmer delay-150"></div>
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-shimmer delay-300"></div>
          <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent animate-shimmer delay-450"></div>
        </div>
      </div>
      
      {/* Text content with hover animations */}
      <div className="text-center z-10">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-all duration-300">
          {title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 max-w-[90%] mx-auto">
          {description}
        </p>
      </div>
      
      {/* Animated arrow on hover */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-2">
        <ArrowRight className="h-4 w-4 text-purple-500 dark:text-purple-400" />
      </div>
    </div>
  );
}

export function AddContentDialog({ open, onOpenChange }: AddContentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md border-none bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl 
          rounded-xl overflow-hidden p-6 animate-in zoom-in-95 duration-300"
        style={{ 
          boxShadow: '0 25px 50px -12px rgba(80, 30, 120, 0.2)'
        }}
      >
        {/* Ambient background effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[100px] bg-gradient-to-br from-purple-100/20 via-transparent to-indigo-100/20 dark:from-purple-900/10 dark:via-transparent dark:to-indigo-900/10 animate-subtle-spin">
            <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl"></div>
          </div>
        </div>
        
        <DialogHeader className="relative z-10">
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-500 dark:text-purple-400 animate-pulse" />
            <DialogTitle className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-400 dark:to-indigo-400">
              What do you want to add?
            </DialogTitle>
            <Sparkles className="h-5 w-5 text-purple-500 dark:text-purple-400 animate-pulse" />
          </div>
          <DialogDescription className="text-center text-gray-500 dark:text-gray-400 mt-1">
            Choose an option to enhance your site
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-5 mt-4 relative z-10">
          <OptionCard
            icon={<PlusCircle className="h-7 w-7 text-purple-600 dark:text-purple-400 group-hover:animate-subtle-bounce" />}
            title="I want to let people post something"
            description="Events, jobs, questions, ideas…"
            onClick={() => onOpenChange(false)}
            animationDelay="100ms"
          />
          
          <OptionCard
            icon={<FileText className="h-7 w-7 text-indigo-600 dark:text-indigo-400 group-hover:animate-subtle-bounce" />}
            title="I want to create a new page"
            description="Homepage, explore page, faculty landing page…"
            onClick={() => onOpenChange(false)}
            animationDelay="200ms"
          />
        </div>
        
        {/* Subtle footer hint */}
        <div className="mt-4 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500 relative z-10">
          <Zap className="h-3 w-3 mr-1 inline" />
          <span>Press ESC to dismiss</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}