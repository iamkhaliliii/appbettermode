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
  ThumbsUp,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

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

// Step layout components for configuration
const EventConfigFields = () => (
  <div className="space-y-4 w-full">
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Event Title</label>
      <input 
        type="text" 
        placeholder="Enter event title" 
        className="w-full rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
      />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date & Time</label>
      <div className="flex gap-2">
        <input 
          type="date" 
          className="flex-1 rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
        <input 
          type="time" 
          className="flex-1 rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
      </div>
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
      <input 
        type="text" 
        placeholder="Enter location or 'Online'" 
        className="w-full rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
      />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
      <textarea 
        rows={4}
        placeholder="Describe your event" 
        className="w-full rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
      />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Options</label>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="registration" />
        <label htmlFor="registration" className="text-sm text-gray-600 dark:text-gray-400">Enable registration</label>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="reminder" />
        <label htmlFor="reminder" className="text-sm text-gray-600 dark:text-gray-400">Send reminders</label>
      </div>
    </div>
  </div>
);

const DiscussionConfigFields = () => (
  <div className="space-y-4 w-full">
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Discussion Title</label>
      <input 
        type="text" 
        placeholder="Enter discussion title" 
        className="w-full rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
      <select className="w-full rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
        <option>General</option>
        <option>Feedback</option>
        <option>Question</option>
        <option>Announcement</option>
      </select>
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Initial Message</label>
      <textarea 
        rows={6}
        placeholder="Start the discussion with a message" 
        className="w-full rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Options</label>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="notification" />
        <label htmlFor="notification" className="text-sm text-gray-600 dark:text-gray-400">Notify members</label>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="pinned" />
        <label htmlFor="pinned" className="text-sm text-gray-600 dark:text-gray-400">Pin discussion</label>
      </div>
    </div>
  </div>
);

// Placeholder config fields for other content types
const QAConfigFields = () => (
  <div className="space-y-4 w-full">
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Q&A Title</label>
      <input 
        type="text" 
        placeholder="Enter Q&A title" 
        className="w-full rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
      />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
      <textarea 
        rows={4}
        placeholder="Describe what this Q&A is about" 
        className="w-full rounded-md border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
      />
    </div>
  </div>
);

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
        return "bg-gradient-to-br from-emerald-50/60 to-emerald-100/10 dark:from-emerald-900/15 dark:to-emerald-800/5 hover:from-emerald-50/95 hover:to-emerald-100/50 dark:hover:from-emerald-900/40 dark:hover:to-emerald-800/25";
      case "blue":
        return "bg-gradient-to-br from-blue-50/60 to-blue-100/10 dark:from-blue-900/15 dark:to-blue-800/5 hover:from-blue-50/95 hover:to-blue-100/50 dark:hover:from-blue-900/40 dark:hover:to-blue-800/25";
      case "violet":
        return "bg-gradient-to-br from-violet-50/60 to-violet-100/10 dark:from-violet-900/15 dark:to-violet-800/5 hover:from-violet-50/95 hover:to-violet-100/50 dark:hover:from-violet-900/40 dark:hover:to-violet-800/25";
      case "amber":
        return "bg-gradient-to-br from-amber-50/60 to-amber-100/10 dark:from-amber-900/15 dark:to-amber-800/5 hover:from-amber-50/95 hover:to-amber-100/50 dark:hover:from-amber-900/40 dark:hover:to-amber-800/25";
      case "indigo":
        return "bg-gradient-to-br from-indigo-50/60 to-indigo-100/10 dark:from-indigo-900/15 dark:to-indigo-800/5 hover:from-indigo-50/95 hover:to-indigo-100/50 dark:hover:from-indigo-900/40 dark:hover:to-indigo-800/25";
      case "rose":
        return "bg-gradient-to-br from-rose-50/60 to-rose-100/10 dark:from-rose-900/15 dark:to-rose-800/5 hover:from-rose-50/95 hover:to-rose-100/50 dark:hover:from-rose-900/40 dark:hover:to-rose-800/25";
      case "cyan":
        return "bg-gradient-to-br from-cyan-50/60 to-cyan-100/10 dark:from-cyan-900/15 dark:to-cyan-800/5 hover:from-cyan-50/95 hover:to-cyan-100/50 dark:hover:from-cyan-900/40 dark:hover:to-cyan-800/25";
      case "purple":
        return "bg-gradient-to-br from-purple-50/60 to-purple-100/10 dark:from-purple-900/15 dark:to-purple-800/5 hover:from-purple-50/95 hover:to-purple-100/50 dark:hover:from-purple-900/40 dark:hover:to-purple-800/25";
      case "gray":
        return "bg-gradient-to-br from-gray-50/60 to-gray-100/10 dark:from-gray-800/15 dark:to-gray-900/5 hover:from-gray-50/95 hover:to-gray-100/50 dark:hover:from-gray-800/40 dark:hover:to-gray-900/25";
      default:
        return `bg-gradient-to-br from-${color}-50/70 to-${color}-100/20 dark:from-${color}-900/20 dark:to-${color}-800/5 hover:from-${color}-50/95 hover:to-${color}-100/60 dark:hover:from-${color}-900/45 dark:hover:to-${color}-800/30`;
    }
  };

  const getBorder = () => {
    switch (color) {
      case "emerald":
        return "border border-emerald-200/30 dark:border-emerald-800/20";
      case "blue":
        return "border border-blue-200/30 dark:border-blue-800/20";
      case "violet":
        return "border border-violet-200/30 dark:border-violet-800/20";
      case "amber":
        return "border border-amber-200/30 dark:border-amber-800/20";
      case "indigo":
        return "border border-indigo-200/30 dark:border-indigo-800/20";
      case "rose":
        return "border border-rose-200/30 dark:border-rose-800/20";
      case "cyan":
        return "border border-cyan-200/30 dark:border-cyan-800/20";
      case "purple":
        return "border border-purple-200/30 dark:border-purple-800/20";
      case "gray":
        return "border border-gray-200/30 dark:border-gray-700/20";
      default:
        return `border border-${color}-200/40 dark:border-${color}-800/30`;
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
                 cursor-pointer group h-full flex flex-col transition-all duration-200`}
    >
      <div className="flex-1 flex flex-col min-h-[248px]">
        <div className="flex px-5 pt-5 items-center">
          <h3 className="text-[0.9rem] font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
        <p className="text-[0.75rem] px-5 pb-0 text-gray-600 dark:text-gray-400">{description}</p>
        
        {/* Framed preview area */}
        <div className="absolute bottom-0 right-0 w-52 h-40 rounded-t-lg border border-gray-100/70 dark:border-gray-800/30 bg-white/80 dark:bg-gray-900/80 p-3 overflow-hidden flex-1 flex shadow-[0_4px_20px_-4px_rgba(0,0,0,0.10)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.18)]">
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
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<"selection" | "configuration">("selection");
  const [exitDirection, setExitDirection] = React.useState<"left" | "right">("left");

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

  const selectedContent = React.useMemo(() => {
    return contentTypes.find(content => content.title === selectedType);
  }, [selectedType]);

  const handleContentClick = (title: string) => {
    setExitDirection("left");
    setSelectedType(title);
    setStep("configuration");
  };

  const handleBack = () => {
    setExitDirection("right");
    setStep("selection");
  };

  const getBgGradient = (color: string) => {
    switch (color) {
      case "emerald":
        return "bg-gradient-to-br from-emerald-50/60 to-emerald-100/10 dark:from-emerald-900/15 dark:to-emerald-800/5 hover:from-emerald-50/95 hover:to-emerald-100/50 dark:hover:from-emerald-900/40 dark:hover:to-emerald-800/25";
      case "blue":
        return "bg-gradient-to-br from-blue-50/60 to-blue-100/10 dark:from-blue-900/15 dark:to-blue-800/5 hover:from-blue-50/95 hover:to-blue-100/50 dark:hover:from-blue-900/40 dark:hover:to-blue-800/25";
      case "violet":
        return "bg-gradient-to-br from-violet-50/60 to-violet-100/10 dark:from-violet-900/15 dark:to-violet-800/5 hover:from-violet-50/95 hover:to-violet-100/50 dark:hover:from-violet-900/40 dark:hover:to-violet-800/25";
      case "amber":
        return "bg-gradient-to-br from-amber-50/60 to-amber-100/10 dark:from-amber-900/15 dark:to-amber-800/5 hover:from-amber-50/95 hover:to-amber-100/50 dark:hover:from-amber-900/40 dark:hover:to-amber-800/25";
      case "indigo":
        return "bg-gradient-to-br from-indigo-50/60 to-indigo-100/10 dark:from-indigo-900/15 dark:to-indigo-800/5 hover:from-indigo-50/95 hover:to-indigo-100/50 dark:hover:from-indigo-900/40 dark:hover:to-indigo-800/25";
      case "rose":
        return "bg-gradient-to-br from-rose-50/60 to-rose-100/10 dark:from-rose-900/15 dark:to-rose-800/5 hover:from-rose-50/95 hover:to-rose-100/50 dark:hover:from-rose-900/40 dark:hover:to-rose-800/25";
      case "cyan":
        return "bg-gradient-to-br from-cyan-50/60 to-cyan-100/10 dark:from-cyan-900/15 dark:to-cyan-800/5 hover:from-cyan-50/95 hover:to-cyan-100/50 dark:hover:from-cyan-900/40 dark:hover:to-cyan-800/25";
      case "purple":
        return "bg-gradient-to-br from-purple-50/60 to-purple-100/10 dark:from-purple-900/15 dark:to-purple-800/5 hover:from-purple-50/95 hover:to-purple-100/50 dark:hover:from-purple-900/40 dark:hover:to-purple-800/25";
      case "gray":
        return "bg-gradient-to-br from-gray-50/60 to-gray-100/10 dark:from-gray-800/15 dark:to-gray-900/5 hover:from-gray-50/95 hover:to-gray-100/50 dark:hover:from-gray-800/40 dark:hover:to-gray-900/25";
      default:
        return `bg-gradient-to-br from-${color}-50/70 to-${color}-100/20 dark:from-${color}-900/20 dark:to-${color}-800/5 hover:from-${color}-50/95 hover:to-${color}-100/60 dark:hover:from-${color}-900/45 dark:hover:to-${color}-800/30`;
    }
  };

  const getBorder = (color: string) => {
    switch (color) {
      case "emerald":
        return "border border-emerald-200/30 dark:border-emerald-800/20";
      case "blue":
        return "border border-blue-200/30 dark:border-blue-800/20";
      case "violet":
        return "border border-violet-200/30 dark:border-violet-800/20";
      case "amber":
        return "border border-amber-200/30 dark:border-amber-800/20";
      case "indigo":
        return "border border-indigo-200/30 dark:border-indigo-800/20";
      case "rose":
        return "border border-rose-200/30 dark:border-rose-800/20";
      case "cyan":
        return "border border-cyan-200/30 dark:border-cyan-800/20";
      case "purple":
        return "border border-purple-200/30 dark:border-purple-800/20";
      case "gray":
        return "border border-gray-200/30 dark:border-gray-700/20";
      default:
        return `border border-${color}-200/40 dark:border-${color}-800/30`;
    }
  };

  const slideVariants = {
    initial: (direction: "left" | "right") => ({
      opacity: 0,
      x: direction === "left" ? 20 : -20,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.25,
        ease: "easeOut"
      }
    },
    exit: (direction: "left" | "right") => ({
      opacity: 0,
      x: direction === "left" ? -20 : 20,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    })
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { 
      opacity: 1, 
      y: 0
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent
            className="sm:max-w-[90vw] md:max-w-[1100px] bg-white dark:bg-gray-900 backdrop-blur-xl
                       rounded-2xl p-10 border-gray-100 dark:border-gray-800/30 overflow-hidden max-h-[90vh] overflow-y-auto
                       scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent
                       [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 
                       dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-track]:bg-transparent"
          >
            <AnimatePresence mode="wait" custom={exitDirection}>
              {step === "selection" ? (
                <motion.div
                  key="selection"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={slideVariants}
                  custom={exitDirection}
                  className="space-y-6"
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
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        whileHover={{ y: 0, transition: { duration: 0.2 } }}
                      >
                        <ContentCard
                          title={content.title}
                          description={content.description}
                          icon={content.icon}
                          color={content.color}
                          preview={content.preview}
                          onClick={() => handleContentClick(content.title)}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="configuration"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={slideVariants}
                  custom={exitDirection}
                  className="space-y-6"
                >
                  <DialogHeader className="mb-4">
                    <div className="flex items-center">
                      <motion.button 
                        onClick={handleBack}
                        className="mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        whileHover={{ x: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </motion.button>
                      <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        {selectedContent?.icon && (
                          <div className={`p-2 rounded-lg bg-${selectedContent?.color}-100/60 dark:bg-${selectedContent?.color}-800/30`}>
                            {selectedContent?.icon}
                          </div>
                        )}
                        {selectedType}
                      </DialogTitle>
                    </div>
                    <DialogDescription className="text-gray-500 dark:text-gray-400 ml-9">
                      Configure settings for {selectedType?.toLowerCase()} content type
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Left side: Available content types */}
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full md:w-1/2 space-y-6"
                    >
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Available Content Types</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {contentTypes.filter(c => c.title !== selectedType).map((content, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.15, delay: index * 0.02 }}
                              whileHover={{ y: -2 }}
                              onClick={() => setSelectedType(content.title)}
                              className={`p-3 rounded-lg ${getBgGradient(content.color)} ${getBorder(content.color)} cursor-pointer flex items-center gap-2 transition-all duration-200`}
                            >
                              <div className={`w-8 h-8 rounded-full bg-${content.color}-100/60 dark:bg-${content.color}-800/30 flex items-center justify-center`}>
                                {content.icon}
                              </div>
                              <span className="text-sm font-medium">{content.title}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between gap-3 pt-4">
                        <motion.button 
                          onClick={handleBack}
                          className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          whileHover={{ y: -2 }}
                        >
                          Back
                        </motion.button>
                        <motion.button 
                          onClick={() => onOpenChange(false)}
                          className={`px-4 py-2 rounded-lg bg-${selectedContent?.color}-500 hover:bg-${selectedContent?.color}-600 text-white`}
                          whileHover={{ y: -2 }}
                        >
                          Add {selectedType} Type
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Right side: Selected content type card with enlarged preview */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-full md:w-1/2 h-[400px] relative"
                    >
                      {selectedContent && (
                        <div 
                          className={`h-full ${getBgGradient(selectedContent.color)} 
                                    backdrop-blur-sm rounded-xl overflow-hidden 
                                    ${getBorder(selectedContent.color)} relative`}
                        >
                          <div className="flex-1 flex flex-col h-full relative p-5">
                            <div className="mb-auto">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{selectedContent.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedContent.description}</p>
                            </div>
                            
                            {/* Enlarged preview area */}
                            <motion.div 
                              className="w-full h-3/4 mt-4 rounded-lg border border-gray-100/70 dark:border-gray-800/30 bg-white/80 dark:bg-gray-900/80 p-5 overflow-hidden flex items-center justify-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.10)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.18)]"
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="w-full h-full">
                                {selectedContent.preview}
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
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