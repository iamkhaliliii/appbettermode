import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PlusCircle, FileText, ArrowRight } from "lucide-react";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Option card component to avoid nesting button issue
interface OptionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function OptionCard({ icon, title, description, onClick }: OptionCardProps) {
  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className="p-5 hover:bg-white/10 dark:hover:bg-black/10
        transition-all cursor-pointer group rounded-lg"
    >
      <div className="flex items-center space-x-3">
        <div className="text-black/80 dark:text-white/80">
          {icon}
        </div>
        <h3 className="font-medium text-black/80 dark:text-white/80 text-2xl">
          {title}
        </h3>
      </div>
      
      <div className="mt-3 pl-9">
        <p className="text-black/60 dark:text-white/60 text-base leading-relaxed">
          {description}
        </p>
      </div>
      
      <div className="mt-4 pl-9 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="h-5 w-5 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center mr-1.5">
          <ArrowRight className="h-3 w-3 text-black/60 dark:text-white/60" />
        </div>
        <span className="text-black/60 dark:text-white/60 text-sm">Select option</span>
      </div>
    </div>
  );
}

export function AddContentDialog({ open, onOpenChange }: AddContentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-2xl p-0 border-none overflow-hidden rounded-2xl"
        style={{ 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          background: 'linear-gradient(125deg, rgba(255,255,255,0.92) 0%, rgba(240,245,255,0.9) 100%)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="p-10 pb-2">
          <DialogHeader className="items-center text-center mb-8">
            <div className="inline-block px-2.5 py-1 rounded-full text-xs font-medium tracking-wide text-black/60 dark:text-white/60 bg-black/5 dark:bg-white/10 mb-4">
              Add Content
            </div>
            <DialogTitle className="text-[32px] leading-tight font-bold text-center text-black/90 dark:text-white/90">
              What do you want to add?
            </DialogTitle>
            <DialogDescription className="text-base text-black/60 dark:text-white/60 mt-2 max-w-lg mx-auto">
              Choose one of the options below to add content to your site
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 mt-8">
            <OptionCard
              icon={<PlusCircle className="h-6 w-6" />}
              title="I want to let people post something"
              description="Events, jobs, questions, ideas, and more. Enable your community to contribute content."
              onClick={() => onOpenChange(false)}
            />
            
            <OptionCard
              icon={<FileText className="h-6 w-6" />}
              title="I want to create a new page"
              description="Homepage, explore page, faculty landing page, or any other structural content for your site."
              onClick={() => onOpenChange(false)}
            />
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs text-black/40 dark:text-white/40">
              Press ESC to dismiss
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}