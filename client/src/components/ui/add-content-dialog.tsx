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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

// Space permission options
const permissionOptions = [
  { value: "all", label: "All members" },
  { value: "members", label: "Space members, space admins, and staff" },
  { value: "admins", label: "Space admins and staff" },
  { value: "nobody", label: "Nobody" },
];

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
  const [step, setStep] = React.useState<"selection" | "spaceConfiguration">("selection");
  const [exitDirection, setExitDirection] = React.useState<"left" | "right">("left");

  // Space configuration state
  const [spaceConfig, setSpaceConfig] = React.useState({
    name: "",
    slug: "",
    isPrivate: false,
    isInviteOnly: false,
    anyoneCanInvite: false,
    whoCanPost: "all",
    whoCanReply: "all",
    whoCanReact: "all"
  });

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
    }
  ];

  const selectedContent = React.useMemo(() => {
    return contentTypes.find(content => content.title === selectedType);
  }, [selectedType]);

  const handleContentClick = (title: string) => {
    setExitDirection("left");
    setSelectedType(title);
    setStep("spaceConfiguration");
  };

  const handleBack = () => {
    setExitDirection("right");
    setStep("selection");
  };

  const handleAddContent = () => {
    // Here you would add logic to create the space with the selected content type and configurations
    console.log("Creating space with:", {
      contentType: selectedType,
      ...spaceConfig
    });
    
    // Close the dialog after creating
    onOpenChange(false);
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
            className="sm:max-w-[90vw] md:max-w-[1100px] p-0 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-0 shadow-xl"
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
                  className="space-y-6 p-10"
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
                  key="spaceConfiguration"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={slideVariants}
                  custom={exitDirection}
                  className="flex flex-col md:flex-row h-[90vh] max-h-[800px]"
                >
                  {/* Left panel - Form */}
                  <div className="md:w-1/2 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
                    <div className="px-16 pt-16 pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-16 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: '100%' }}
                            ></div>
                          </div>
                          <span className="text-sm ml-2 text-gray-600 dark:text-gray-400">2/2</span>
                        </div>
                      </div>
                      <h1 className="text-l font-semibold text-gray-900 dark:text-white mt-8 mb-1">
                        Configure your space
                      </h1>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                        Set up how your {selectedType?.toLowerCase()} space will work
                      </p>
                    </div>
                    
                    <div className="flex-1 items-center justify-center px-16 overflow-y-auto 
                    scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 dark:hover:scrollbar-thumb-gray-600">
                      <div className="space-y-5">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="space-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Space Name
                            </Label>
                            <Input
                              id="space-name"
                              placeholder="My Space"
                              value={spaceConfig.name}
                              onChange={(e) => setSpaceConfig({...spaceConfig, name: e.target.value})}
                              className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="space-slug" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Space Slug
                            </Label>
                            <div className="flex items-center mt-1">
                              <div className="px-3 h-10 flex items-center rounded-l-md border border-r-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm">
                                bettermode.com/
                              </div>
                              <Input
                                id="space-slug"
                                placeholder="my-space"
                                value={spaceConfig.slug}
                                onChange={(e) => setSpaceConfig({...spaceConfig, slug: e.target.value})}
                                className="rounded-l-none flex-1 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                              />
                            </div>
                          </div>
                          
                          <Accordion type="single" collapsible className="mt-6 w-full">
                            <AccordionItem value="advanced-settings" className="border-gray-200 dark:border-gray-700">
                              <AccordionTrigger className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                                Advanced Settings
                              </AccordionTrigger>
                              <AccordionContent className="pt-2">
                                <div className="space-y-6">
                                  <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Space Settings</h3>
                                    
                                    <div className="flex items-center justify-between">
                                      <Label htmlFor="make-private" className="text-sm text-gray-600 dark:text-gray-400">
                                        Make private
                                      </Label>
                                      <Switch
                                        id="make-private"
                                        checked={spaceConfig.isPrivate}
                                        onCheckedChange={(checked) => setSpaceConfig({...spaceConfig, isPrivate: checked})}
                                      />
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <Label htmlFor="invite-only" className="text-sm text-gray-600 dark:text-gray-400">
                                        Make invite-only
                                      </Label>
                                      <Switch
                                        id="invite-only"
                                        checked={spaceConfig.isInviteOnly}
                                        onCheckedChange={(checked) => setSpaceConfig({...spaceConfig, isInviteOnly: checked})}
                                      />
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <Label htmlFor="anyone-invite" className="text-sm text-gray-600 dark:text-gray-400">
                                        Anyone can invite
                                      </Label>
                                      <Switch
                                        id="anyone-invite"
                                        checked={spaceConfig.anyoneCanInvite}
                                        onCheckedChange={(checked) => setSpaceConfig({...spaceConfig, anyoneCanInvite: checked})}
                                      />
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Permissions</h3>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="who-can-post" className="text-sm text-gray-600 dark:text-gray-400">
                                        Who can post?
                                      </Label>
                                      <Select
                                        value={spaceConfig.whoCanPost}
                                        onValueChange={(value) => setSpaceConfig({...spaceConfig, whoCanPost: value})}
                                      >
                                        <SelectTrigger id="who-can-post" className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                          <SelectValue placeholder="Select permission" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {permissionOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                              {option.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="who-can-reply" className="text-sm text-gray-600 dark:text-gray-400">
                                        Who can reply?
                                      </Label>
                                      <Select
                                        value={spaceConfig.whoCanReply}
                                        onValueChange={(value) => setSpaceConfig({...spaceConfig, whoCanReply: value})}
                                      >
                                        <SelectTrigger id="who-can-reply" className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                          <SelectValue placeholder="Select permission" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {permissionOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                              {option.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label htmlFor="who-can-react" className="text-sm text-gray-600 dark:text-gray-400">
                                        Who can react?
                                      </Label>
                                      <Select
                                        value={spaceConfig.whoCanReact}
                                        onValueChange={(value) => setSpaceConfig({...spaceConfig, whoCanReact: value})}
                                      >
                                        <SelectTrigger id="who-can-react" className="w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                          <SelectValue placeholder="Select permission" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {permissionOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                              {option.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>
                      </div>
                    </div>
                    
                    {/* Fixed buttons at bottom */}
                    <div className="border-t border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-end">
                      <div className="flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleBack}
                          className="text-sm min-w-20"
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddContent}
                          disabled={!spaceConfig.name || !spaceConfig.slug}
                          className="text-sm bg-gray-900 hover:bg-black text-white dark:bg-gray-800 dark:hover:bg-gray-700 min-w-24"
                        >
                          Create Space
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right panel - Preview */}
                  <div className="hidden md:block md:w-1/2 py-12 pl-20 bg-gradient-to-br from-gray-100/80 to-gray-100/50 dark:from-gray-900/80 dark:to-gray-900/80">
                    <div className="flex-1 flex items-center justify-center">
                      {selectedContent && (
                        <div 
                          className={`w-full max-w-md h-[550px] bg-white dark:bg-gray-900 shadow-lg rounded-xl overflow-hidden relative`}
                        >
                          {/* Header with space name and icon */}
                          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center">
                            <div className={`p-2 rounded-lg bg-${selectedContent.color}-100/60 dark:bg-${selectedContent.color}-900/20 mr-3`}>
                              {selectedContent.icon}
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {spaceConfig.name || "Your Space"}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                bettermode.com/{spaceConfig.slug || "your-space"}
                              </p>
                            </div>
                          </div>
                          
                          {/* Content preview based on selected type */}
                          <div className="p-5 h-[calc(100%-64px)] overflow-y-auto">
                            <div className="mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                              <h4 className={`text-${selectedContent.color}-600 dark:text-${selectedContent.color}-400 font-medium text-sm`}>
                                {selectedType} Space
                              </h4>
                            </div>
                            
                            {/* Dynamic preview based on content type */}
                            <div className="flex-1">
                              {selectedType === "Event" && (
                                <div className="space-y-4">
                                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <h3 className="font-medium">Event Title</h3>
                                      <div className="px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs">Upcoming</div>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                                      <Clock className="h-4 w-4 mr-1" />
                                      <span>Jul 21, 2023 • 2:00 PM</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Event description would appear here with all the details about the upcoming event.</p>
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                                        <User className="h-4 w-4 mr-1" />
                                        <span>12 attendees</span>
                                      </div>
                                      <button className="px-3 py-1 text-xs rounded-md bg-emerald-500 hover:bg-emerald-600 text-white">Register</button>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <h3 className="font-medium">Workshop Session</h3>
                                      <div className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs">Next Week</div>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                      <Clock className="h-4 w-4 mr-1" />
                                      <span>Jul 28, 2023 • 3:30 PM</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {selectedType === "Discussion" && (
                                <div className="space-y-4">
                                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                                    <div className="flex items-start gap-3">
                                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                                      <div className="flex-1">
                                        <h3 className="font-medium mb-1">Discussion Topic Title</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">This is where the discussion content would appear. Members can respond and engage with this topic.</p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                                          <div className="flex items-center">
                                            <MessageSquare className="h-4 w-4 mr-1" />
                                            <span>24 replies</span>
                                          </div>
                                          <div className="flex items-center">
                                            <ThumbsUp className="h-4 w-4 mr-1" />
                                            <span>8 likes</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                                    <div className="flex items-start gap-3">
                                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>
                                      <div className="flex-1">
                                        <h3 className="font-medium mb-1">Another Discussion</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                                          <div className="flex items-center">
                                            <MessageSquare className="h-4 w-4 mr-1" />
                                            <span>5 replies</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {selectedType === "Q&A" && (
                                <div className="space-y-4">
                                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <h3 className="font-medium">How do I set up my account?</h3>
                                      <div className="px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs">Answered</div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">I'm new to the platform and need help setting up my profile and preferences...</p>
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                                        <span>2 answers</span>
                                      </div>
                                      <div className="flex items-center">
                                        <button className="p-1 text-gray-400 hover:text-violet-500">
                                          <ThumbsUp className="h-4 w-4" />
                                        </button>
                                        <span className="text-sm">12</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <h3 className="font-medium">What are the system requirements?</h3>
                                      <div className="px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs">Open</div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                                      <div className="flex items-center">
                                        <HelpCircle className="h-4 w-4 mr-1" />
                                        <span>Needs answer</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {selectedType === "Wishlist" && (
                                <div className="space-y-4">
                                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <h3 className="font-medium">Add dark mode support</h3>
                                      <div className="px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs">In Progress</div>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">We need a dark mode option for better night-time viewing...</p>
                                    <div className="flex justify-between items-center">
                                      <div className="flex items-center">
                                        <Tag className="h-4 w-4 mr-1 text-gray-400" />
                                        <span className="text-xs text-gray-500">UI Enhancement</span>
                                      </div>
                                      <div className="flex items-center">
                                        <button className="p-1 text-gray-400 hover:text-amber-500">
                                          <Star className="h-4 w-4" />
                                        </button>
                                        <span className="text-sm">28</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                                    <div className="flex justify-between items-start mb-2">
                                      <h3 className="font-medium">Mobile app for iOS and Android</h3>
                                      <div className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs">Under Review</div>
                                    </div>
                                    <div className="flex items-center">
                                      <Star className="h-4 w-4 mr-1 text-amber-400" />
                                      <span className="text-sm">42 votes</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Default preview for other content types */}
                              {(selectedType !== "Event" && selectedType !== "Discussion" && selectedType !== "Q&A" && selectedType !== "Wishlist") && (
                                <div className="flex items-center justify-center h-full">
                                  {selectedContent.preview}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}