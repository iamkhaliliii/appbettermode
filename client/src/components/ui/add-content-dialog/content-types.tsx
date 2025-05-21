import React from 'react';
import { 
  Calendar, 
  MessageSquare, 
  HelpCircle, 
  Star, 
  Layout, 
  BookOpen, 
  Briefcase, 
  FileText,
  Clock,
  User,
  ThumbsUp,
  CheckCircle
} from "lucide-react";

// Preview components for each content type
export const EventPreview = () => (
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

export const DiscussionPreview = () => (
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

export const QAPreview = () => (
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

export const WishlistPreview = () => (
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

export const LandingPagePreview = () => (
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

export const KnowledgeBasePreview = () => (
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

export const JobListPreview = () => (
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

export const BlogPreview = () => (
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

// Helper function to get preview component by type name
export const getPreviewComponent = (typeName: string) => {
  const lowerCaseName = typeName.toLowerCase();
  
  switch (lowerCaseName) {
    case 'event':
      return <EventPreview />;
    case 'discussion':
      return <DiscussionPreview />;
    case 'qa':
    case 'q&a':
    case 'qa_question':
      return <QAPreview />;
    case 'wishlist':
    case 'idea':
      return <WishlistPreview />;
    case 'landing':
    case 'landing_page':
      return <LandingPagePreview />;
    case 'knowledge':
    case 'kb_article':
    case 'knowledge base':
      return <KnowledgeBasePreview />;
    case 'job':
    case 'jobs':
    case 'job list':
      return <JobListPreview />;
    case 'blog':
    case 'article':
      return <BlogPreview />;
    default:
      return <DiscussionPreview />;
  }
}; 