import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Calendar, 
  MessageSquare, 
  HelpCircle, 
  Star, 
  Layout, 
  BookOpen, 
  Briefcase, 
  FileText,
  ChevronRight,
  Plus,
  User,
  Clock,
  Tag,
  CheckCircle,
  ThumbsUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ContentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  preview: React.ReactNode;
  onClick: () => void;
}

// Custom preview components for each content type
const EventPreview = () => (
  <div className="flex flex-col h-full relative">
    <div className="absolute top-0 left-0">
      <div className="w-8 h-8 rounded-xl bg-emerald-100/50 dark:bg-emerald-900/20 flex items-center justify-center">
        <Calendar className="w-5 h-5 text-emerald-500/70 dark:text-emerald-400/50" />
      </div>
    </div>
    <div className="pt-14 w-full space-y-4">
      <div className="h-2 w-3/4 bg-gray-200/40 dark:bg-gray-700/20 rounded-full"></div>
      <div className="grid grid-cols-7 gap-1 w-full">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="aspect-square rounded bg-gray-100/70 dark:bg-gray-800/20" />
        ))}
      </div>
      <div className="h-1 w-1/2 mx-auto bg-gray-200/40 dark:bg-gray-700/20 rounded-full"></div>
    </div>
  </div>
);

const DiscussionPreview = () => (
  <div className="flex flex-col h-full relative">
    <div className="absolute top-0 left-0">
      <div className="w-8 h-8 rounded-xl bg-blue-100/50 dark:bg-blue-900/20 flex items-center justify-center">
        <MessageSquare className="w-5 h-5 text-blue-500/70 dark:text-blue-400/50" />
      </div>
    </div>
    <div className="pt-14 w-full space-y-4">
      <div className="h-2 w-3/4 bg-gray-200/40 dark:bg-gray-700/20 rounded-full"></div>
      <div className="space-y-3">
        <div className="h-1.5 bg-gray-200/40 dark:bg-gray-700/20 rounded-full w-full"></div>
        <div className="h-1.5 bg-gray-200/40 dark:bg-gray-700/20 rounded-full w-2/3"></div>
      </div>
      <div className="h-px w-full bg-gray-100/50 dark:bg-gray-800/20"></div>
      <div className="pl-4 space-y-2">
        <div className="h-1.5 bg-gray-200/40 dark:bg-gray-700/20 rounded-full w-4/5"></div>
        <div className="h-1.5 bg-gray-200/40 dark:bg-gray-700/20 rounded-full w-3/5"></div>
      </div>
    </div>
  </div>
);

const QAPreview = () => (
  <div className="flex flex-col h-full relative">
    <div className="absolute top-0 left-0">
      <div className="w-8 h-8 rounded-xl bg-violet-100/50 dark:bg-violet-900/20 flex items-center justify-center">
        <HelpCircle className="w-5 h-5 text-violet-500/70 dark:text-violet-400/50" />
      </div>
    </div>
    <div className="pt-14 w-full space-y-4">
      <div className="h-2 w-3/4 bg-gray-200/40 dark:bg-gray-700/20 rounded-full"></div>
      <div className="flex gap-2 items-center">
        <div className="h-6 w-6 rounded-full bg-gray-100/70 dark:bg-gray-800/20 flex-shrink-0"></div>
        <div className="space-y-1.5 flex-1">
          <div className="h-1.5 bg-gray-200/40 dark:bg-gray-700/20 rounded-full w-full"></div>
          <div className="h-1.5 bg-gray-200/40 dark:bg-gray-700/20 rounded-full w-2/3"></div>
        </div>
      </div>
      <div className="pl-8 space-y-2">
        <div className="h-1.5 bg-gray-200/40 dark:bg-gray-700/20 rounded-full w-5/6"></div>
        <div className="h-1.5 bg-gray-200/40 dark:bg-gray-700/20 rounded-full w-4/6"></div>
      </div>
    </div>
  </div>
);

const WishlistPreview = () => (
  <div className="flex flex-col h-full relative">
    <div className="absolute top-0 left-0">
      <div className="w-8 h-8 rounded-xl bg-amber-100/50 dark:bg-amber-900/20 flex items-center justify-center">
        <Star className="w-5 h-5 text-amber-500/70 dark:text-amber-400/50" />
      </div>
    </div>
    <div className="pt-14 w-full space-y-4">
      <div className="h-2 w-3/4 bg-gray-200/40 dark:bg-gray-700/20 rounded-full"></div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-100/70 dark:bg-gray-800/20 flex-shrink-0"></div>
            <div className="h-1.5 bg-gray-200/40 dark:bg-gray-700/20 rounded-full flex-1"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LandingPagePreview = () => (
  <div className="flex flex-col h-full relative">
    <div className="absolute top-0 left-0">
      <div className="w-8 h-8 rounded-xl bg-indigo-100/50 dark:bg-indigo-900/20 flex items-center justify-center">
        <Layout className="w-5 h-5 text-indigo-500/70 dark:text-indigo-400/50" />
      </div>
    </div>
    <div className="pt-14 w-full space-y-4">
      <div className="h-2 w-3/4 bg-gray-200/40 dark:bg-gray-700/20 rounded-full"></div>
      <div className="space-y-3">
        <div className="h-6 rounded bg-gray-100/70 dark:bg-gray-800/20 w-full"></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-5 rounded bg-gray-100/70 dark:bg-gray-800/20"></div>
          <div className="h-5 rounded bg-gray-100/70 dark:bg-gray-800/20"></div>
        </div>
        <div className="h-1.5 w-1/3 mx-auto bg-gray-200/40 dark:bg-gray-700/20 rounded-full"></div>
      </div>
    </div>
  </div>
);

const KnowledgeBasePreview = () => (
  <div className="flex flex-col h-full relative">
    <div className="absolute top-0 left-0">
      <div className="w-8 h-8 rounded-xl bg-rose-100/50 dark:bg-rose-900/20 flex items-center justify-center">
        <BookOpen className="w-5 h-5 text-rose-500/70 dark:text-rose-400/50" />
      </div>
    </div>
    <div className="pt-14 w-full space-y-4">
      <div className="h-2 w-3/4 bg-gray-200/40 dark:bg-gray-700/20 rounded-full"></div>
      <div className="grid grid-cols-2 gap-2 w-full">
        <div className="h-6 rounded bg-gray-100/70 dark:bg-gray-800/20"></div>
        <div className="h-6 rounded bg-gray-100/70 dark:bg-gray-800/20"></div>
        <div className="h-6 rounded bg-gray-100/70 dark:bg-gray-800/20"></div>
        <div className="h-6 rounded bg-gray-100/70 dark:bg-gray-800/20"></div>
      </div>
    </div>
  </div>
);

const JobListPreview = () => (
  <div className="flex flex-col h-full relative">
    <div className="absolute top-0 left-0">
      <div className="w-8 h-8 rounded-xl bg-cyan-100/50 dark:bg-cyan-900/20 flex items-center justify-center">
        <Briefcase className="w-5 h-5 text-cyan-500/70 dark:text-cyan-400/50" />
      </div>
    </div>
    <div className="pt-14 w-full space-y-4">
      <div className="h-2 w-3/4 bg-gray-200/40 dark:bg-gray-700/20 rounded-full"></div>
      <div className="rounded border border-gray-100/50 dark:border-gray-800/20 p-3 space-y-2">
        <div className="flex justify-between items-center">
          <div className="h-1.5 bg-gray-200/40 dark:bg-gray-700/20 rounded-full w-1/2"></div>
          <div className="h-4 w-16 rounded-full bg-gray-100/70 dark:bg-gray-800/20"></div>
        </div>
        <div className="h-1.5 bg-gray-200/40 dark:bg-gray-700/20 rounded-full w-full"></div>
        <div className="flex gap-2">
          <div className="h-4 w-16 rounded-full bg-gray-100/70 dark:bg-gray-800/20"></div>
          <div className="h-4 w-16 rounded-full bg-gray-100/70 dark:bg-gray-800/20"></div>
        </div>
      </div>
    </div>
  </div>
);

const BlogPreview = () => (
  <div className="flex flex-col h-full relative">
    <div className="absolute top-0 left-0">
      <div className="w-8 h-8 rounded-xl bg-purple-100/50 dark:bg-purple-900/20 flex items-center justify-center">
        <FileText className="w-5 h-5 text-purple-500/70 dark:text-purple-400/50" />
      </div>
    </div>
    <div className="pt-14 w-full space-y-4">
      <div className="h-2 w-3/4 bg-gray-200/40 dark:bg-gray-700/20 rounded-full"></div>
      <div className="space-y-3">
        <div className="aspect-video w-full rounded bg-gray-100/70 dark:bg-gray-800/20"></div>
        <div className="h-1.5 bg-gray-200/40 dark:bg-gray-700/20 rounded-full w-full"></div>
        <div className="h-1.5 bg-gray-200/40 dark:bg-gray-700/20 rounded-full w-2/3"></div>
      </div>
    </div>
  </div>
);

const MoreOptionsPreview = () => (
  <div className="flex flex-col h-full relative">
    <div className="absolute top-0 left-0">
      <div className="w-8 h-8 rounded-xl bg-gray-200/40 dark:bg-gray-700/20 flex items-center justify-center">
        <Plus className="w-5 h-5 text-gray-500/70 dark:text-gray-400/50" />
      </div>
    </div>
    <div className="pt-14 w-full space-y-4">
      <div className="h-2 w-3/4 bg-gray-200/40 dark:bg-gray-700/20 rounded-full"></div>
      <div className="grid grid-cols-3 gap-2 w-full">
        <div className="h-12 aspect-square rounded bg-gray-100/70 dark:bg-gray-800/20"></div>
        <div className="h-12 aspect-square rounded bg-gray-100/70 dark:bg-gray-800/20"></div>
        <div className="h-12 aspect-square rounded bg-gray-100/70 dark:bg-gray-800/20"></div>
        <div className="h-12 aspect-square rounded bg-gray-100/70 dark:bg-gray-800/20"></div>
        <div className="h-12 aspect-square rounded bg-gray-100/70 dark:bg-gray-800/20"></div>
        <div className="h-12 aspect-square rounded bg-gray-100/70 dark:bg-gray-800/20"></div>
      </div>
    </div>
  </div>
);

const ContentCard = React.memo(({
  title,
  description,
  icon,
  color,
  preview,
  onClick,
}: ContentCardProps) => {
  // Special styling for different card types
  const getBgGradient = () => {
    switch (color) {
      case "emerald":
        return "bg-gradient-to-br from-emerald-50/60 to-emerald-100/10 dark:from-emerald-900/15 dark:to-emerald-800/5";
      case "blue":
        return "bg-gradient-to-br from-blue-50/60 to-blue-100/10 dark:from-blue-900/15 dark:to-blue-800/5";
      case "violet":
        return "bg-gradient-to-br from-violet-50/60 to-violet-100/10 dark:from-violet-900/15 dark:to-violet-800/5";
      case "amber":
        return "bg-gradient-to-br from-amber-50/60 to-amber-100/10 dark:from-amber-900/15 dark:to-amber-800/5";
      case "indigo":
        return "bg-gradient-to-br from-indigo-50/60 to-indigo-100/10 dark:from-indigo-900/15 dark:to-indigo-800/5";
      case "rose":
        return "bg-gradient-to-br from-rose-50/60 to-rose-100/10 dark:from-rose-900/15 dark:to-rose-800/5";
      case "cyan":
        return "bg-gradient-to-br from-cyan-50/60 to-cyan-100/10 dark:from-cyan-900/15 dark:to-cyan-800/5";
      case "purple":
        return "bg-gradient-to-br from-purple-50/60 to-purple-100/10 dark:from-purple-900/15 dark:to-purple-800/5";
      case "gray":
        return "bg-gradient-to-br from-gray-50/60 to-gray-100/10 dark:from-gray-800/15 dark:to-gray-900/5";
      default:
        return `bg-gradient-to-br from-${color}-50/70 to-${color}-100/20 dark:from-${color}-900/20 dark:to-${color}-800/5`;
    }
  };

  const getBorder = () => {
    switch (color) {
      case "emerald":
        return "border border-emerald-200/30 dark:border-emerald-800/20 hover:border-emerald-300/50 dark:hover:border-emerald-700/30";
      case "blue":
        return "border border-blue-200/30 dark:border-blue-800/20 hover:border-blue-300/50 dark:hover:border-blue-700/30";
      case "violet":
        return "border border-violet-200/30 dark:border-violet-800/20 hover:border-violet-300/50 dark:hover:border-violet-700/30";
      case "amber":
        return "border border-amber-200/30 dark:border-amber-800/20 hover:border-amber-300/50 dark:hover:border-amber-700/30";
      case "indigo":
        return "border border-indigo-200/30 dark:border-indigo-800/20 hover:border-indigo-300/50 dark:hover:border-indigo-700/30";
      case "rose":
        return "border border-rose-200/30 dark:border-rose-800/20 hover:border-rose-300/50 dark:hover:border-rose-700/30";
      case "cyan":
        return "border border-cyan-200/30 dark:border-cyan-800/20 hover:border-cyan-300/50 dark:hover:border-cyan-700/30";
      case "purple":
        return "border border-purple-200/30 dark:border-purple-800/20 hover:border-purple-300/50 dark:hover:border-purple-700/30";
      case "gray":
        return "border border-gray-200/30 dark:border-gray-700/20 hover:border-gray-300/50 dark:hover:border-gray-600/30";
      default:
        return `border border-${color}-200/40 dark:border-${color}-800/30 hover:border-${color}-300 dark:hover:border-${color}-700/40`;
    }
  };

  const getIconBg = () => {
    switch (color) {
      case "emerald":
        return "bg-emerald-100/60 dark:bg-emerald-800/30";
      case "blue":
        return "bg-blue-100/60 dark:bg-blue-800/30";
      case "violet":
        return "bg-violet-100/60 dark:bg-violet-800/30";
      case "amber":
        return "bg-amber-100/60 dark:bg-amber-800/30";
      case "indigo":
        return "bg-indigo-100/60 dark:bg-indigo-800/30";
      case "rose":
        return "bg-rose-100/60 dark:bg-rose-800/30";
      case "cyan":
        return "bg-cyan-100/60 dark:bg-cyan-800/30";
      case "purple":
        return "bg-purple-100/60 dark:bg-purple-800/30";
      case "gray":
        return "bg-gray-100/60 dark:bg-gray-700/30";
      default:
        return `bg-${color}-200/80 dark:bg-${color}-800/40`;
    }
  };

  const getChevronBg = () => {
    switch (color) {
      case "emerald":
        return "bg-emerald-100/60 dark:bg-emerald-800/30";
      case "blue":
        return "bg-blue-100/60 dark:bg-blue-800/30";
      case "violet":
        return "bg-violet-100/60 dark:bg-violet-800/30";
      case "amber":
        return "bg-amber-100/60 dark:bg-amber-800/30";
      case "indigo":
        return "bg-indigo-100/60 dark:bg-indigo-800/30";
      case "rose":
        return "bg-rose-100/60 dark:bg-rose-800/30";
      case "cyan":
        return "bg-cyan-100/60 dark:bg-cyan-800/30";
      case "purple":
        return "bg-purple-100/60 dark:bg-purple-800/30";
      case "gray":
        return "bg-gray-100/60 dark:bg-gray-700/30";
      default:
        return `bg-${color}-200/80 dark:bg-${color}-800/40`;
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`${getBgGradient()}
                backdrop-blur-sm rounded-xl overflow-hidden
                ${getBorder()}
                 cursor-pointer group h-full flex flex-col`}
    >
      <div className="flex-1 flex flex-col min-h-[248px]">
        <div className="flex px-5 pt-5 items-center">
          <h3 className="text-[0.9rem] font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
        <p className="text-[0.75rem] px-5 pb-0 text-gray-600 dark:text-gray-400">{description}</p>
        
        {/* Framed preview area */}
        <div className="absolute bottom-0 right-0 w-52 h-40 rounded-t-lg border border-gray-100/70 dark:border-gray-800/30 bg-white/80 dark:bg-gray-900/80 p-3 overflow-hidden flex-1 flex shadow-[0_4px_20px_-6px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_-6px_rgba(0,0,0,0.25)]">
          <div className="w-full">
            {preview}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className={`p-1.5 rounded-full ${getChevronBg()}`}>
          <ChevronRight className={`h-4 w-4 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </div>
  );
});

ContentCard.displayName = "ContentCard";

export function AddContentDialog({
  open,
  onOpenChange,
}: AddContentDialogProps) {
  const contentTypes = [
    {
      title: "Event",
      description: "Organize events with scheduling and registrations.",
      icon: <Calendar className="h-5 w-5" />,
      color: "emerald",
      preview: <EventPreview />
    },
    {
      title: "Discussion",
      description: "Start conversations with community members.",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "blue",
      preview: <DiscussionPreview />
    },
    {
      title: "Q&A",
      description: "Enable community Q&A with voting system.",
      icon: <HelpCircle className="h-5 w-5" />,
      color: "violet",
      preview: <QAPreview />
    },
    {
      title: "Wishlist",
      description: "Collect and prioritize community ideas.",
      icon: <Star className="h-5 w-5" />,
      color: "amber",
      preview: <WishlistPreview />
    },
    {
      title: "Landing Page",
      description: "Create beautiful marketing pages.",
      icon: <Layout className="h-5 w-5" />,
      color: "indigo",
      preview: <LandingPagePreview />
    },
    {
      title: "Knowledge Base",
      description: "Build a searchable help center.",
      icon: <BookOpen className="h-5 w-5" />,
      color: "rose",
      preview: <KnowledgeBasePreview />
    },
    {
      title: "Job List",
      description: "Post and manage job openings.",
      icon: <Briefcase className="h-5 w-5" />,
      color: "cyan",
      preview: <JobListPreview />
    },
    {
      title: "Blog",
      description: "Share updates and stories.",
      icon: <FileText className="h-5 w-5" />,
      color: "purple",
      preview: <BlogPreview />
    },
    {
      title: "More Options",
      description: "Explore additional content types.",
      icon: <Plus className="h-5 w-5" />,
      color: "gray",
      preview: <MoreOptionsPreview />
    }
  ];

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent
            className="sm:max-w-[90vw] md:max-w-[1100px] bg-white dark:bg-gray-900 backdrop-blur-xl
                       rounded-2xl p-10  border-gray-100 dark:border-gray-800/30 overflow-hidden max-h-[90vh] overflow-y-auto
                       scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent
                       [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 
                       dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-transparent"
          >
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Choose a content type
              </DialogTitle>
              <DialogDescription className="text-gray-500 dark:text-gray-400">
                Select the type of content you want to create for your community.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contentTypes.map((content, index) => (
                <ContentCard
                  key={index}
                  title={content.title}
                  description={content.description}
                  icon={content.icon}
                  color={content.color}
                  preview={content.preview}
                  onClick={() => onOpenChange(false)}
                />
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-xs font-medium text-gray-400 dark:text-gray-500">
                Press <kbd className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-sans text-xs">ESC</kbd> to close
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}