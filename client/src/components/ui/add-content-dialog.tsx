
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  MessageSquare,
  HelpCircle,
  Calendar,
  BookOpen,
  Users,
  FileText,
  Lightbulb,
  ListTodo,
  Bell,
  Image,
  FileVideo,
  Briefcase,
  ChevronRight
} from "lucide-react";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ContentCardProps {
  icon: React.ReactNode;
  title: string;
  gradient: string;
  onClick: () => void;
}

function ContentCard({ icon, title, gradient, onClick }: ContentCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`group cursor-pointer rounded-2xl p-4 ${gradient} hover:opacity-90 transition-all duration-300`}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-white/10 backdrop-blur-sm rounded-xl">
          {icon}
        </div>
        <h3 className="font-medium text-white text-sm">{title}</h3>
      </div>
    </div>
  );
}

export function AddContentDialog({ open, onOpenChange }: AddContentDialogProps) {
  const contentTypes = [
    {
      icon: <MessageSquare className="h-5 w-5 text-white" />,
      title: "Discussion",
      gradient: "bg-gradient-to-br from-purple-400/90 to-indigo-400/80"
    },
    {
      icon: <HelpCircle className="h-5 w-5 text-white" />,
      title: "Q&A",
      gradient: "bg-gradient-to-br from-blue-400/90 to-cyan-400/80"
    },
    {
      icon: <Calendar className="h-5 w-5 text-white" />,
      title: "Event",
      gradient: "bg-gradient-to-br from-emerald-400/90 to-teal-400/80"
    },
    {
      icon: <BookOpen className="h-5 w-5 text-white" />,
      title: "Knowledge Base",
      gradient: "bg-gradient-to-br from-amber-400/90 to-orange-400/80"
    },
    {
      icon: <Users className="h-5 w-5 text-white" />,
      title: "Member Directory",
      gradient: "bg-gradient-to-br from-pink-400/90 to-rose-400/80"
    },
    {
      icon: <FileText className="h-5 w-5 text-white" />,
      title: "Article",
      gradient: "bg-gradient-to-br from-violet-400/90 to-purple-400/80"
    },
    {
      icon: <Lightbulb className="h-5 w-5 text-white" />,
      title: "Wishlist & Feedback",
      gradient: "bg-gradient-to-br from-cyan-400/90 to-sky-400/80"
    },
    {
      icon: <ListTodo className="h-5 w-5 text-white" />,
      title: "Roadmap",
      gradient: "bg-gradient-to-br from-teal-400/90 to-emerald-400/80"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 gap-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-white">
            Choose content type
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contentTypes.map((type, index) => (
            <ContentCard
              key={index}
              icon={type.icon}
              title={type.title}
              gradient={type.gradient}
              onClick={() => onOpenChange(false)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
