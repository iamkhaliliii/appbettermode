
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MessageSquare, HelpCircle, Calendar, BookOpen, Star, FileText, Newspaper, Users, Megaphone, Database } from "lucide-react";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface OptionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color: string;
}

function OptionCard({ icon, title, description, onClick, color }: OptionCardProps) {
  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={`flex flex-col p-6 rounded-xl border border-gray-100 dark:border-gray-800 
        hover:border-${color}-200 dark:hover:border-${color}-900
        hover:bg-${color}-50/30 dark:hover:bg-${color}-900/10
        hover:shadow-lg hover:shadow-${color}-500/5 dark:hover:shadow-${color}-400/5
        transition-all duration-200 cursor-pointer group backdrop-blur-sm`}
    >
      <div className={`h-12 w-12 rounded-lg bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center 
        group-hover:scale-110 transition-transform duration-200`}>
        {icon}
      </div>
      
      <h3 className="font-medium text-gray-900 dark:text-white mt-4 text-base">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5 line-clamp-2">
        {description}
      </p>
    </div>
  );
}

export function AddContentDialog({ open, onOpenChange }: AddContentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[900px] bg-white dark:bg-gray-900 shadow-2xl 
          rounded-2xl p-0 overflow-hidden border-0"
      >
        <div className="p-8">
          <DialogHeader className="text-center space-y-2 mb-8">
            <DialogTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Choose Your Content Type
            </DialogTitle>
            <DialogDescription className="text-base text-gray-600 dark:text-gray-300">
              Select the type of content you want to create
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <OptionCard
              icon={<MessageSquare className="h-6 w-6 text-purple-500 dark:text-purple-400" />}
              title="Discussion"
              description="Create spaces for open discussions and conversations"
              onClick={() => onOpenChange(false)}
              color="purple"
            />
            
            <OptionCard
              icon={<HelpCircle className="h-6 w-6 text-blue-500 dark:text-blue-400" />}
              title="Q&A"
              description="Enable knowledge sharing through questions and answers"
              onClick={() => onOpenChange(false)}
              color="blue"
            />

            <OptionCard
              icon={<Calendar className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />}
              title="Event"
              description="Schedule and manage upcoming events and activities"
              onClick={() => onOpenChange(false)}
              color="emerald"
            />

            <OptionCard
              icon={<BookOpen className="h-6 w-6 text-amber-500 dark:text-amber-400" />}
              title="Knowledge Base"
              description="Build a comprehensive library of guides and documentation"
              onClick={() => onOpenChange(false)}
              color="amber"
            />

            <OptionCard
              icon={<Star className="h-6 w-6 text-pink-500 dark:text-pink-400" />}
              title="Wishlist & Feedback"
              description="Collect ideas and feedback from your community"
              onClick={() => onOpenChange(false)}
              color="pink"
            />

            <OptionCard
              icon={<Newspaper className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />}
              title="Article"
              description="Write and publish long-form content and blog posts"
              onClick={() => onOpenChange(false)}
              color="indigo"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
