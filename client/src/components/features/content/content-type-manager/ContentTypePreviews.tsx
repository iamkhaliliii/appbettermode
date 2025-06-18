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
  CheckCircle,
  Users,
  Heart,
  Trophy,
  Play,
  Image,
  Gift,
  Zap
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

export const EventPreviewXL = () => (
  <div className="flex flex-col h-full relative p-6">
    {/* Header with Icon */}
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 rounded-xl bg-emerald-100/50 dark:bg-emerald-900/20 flex items-center justify-center">
        <Calendar className="w-7 h-7 text-emerald-500/70 dark:text-emerald-400/50" />
      </div>
      <div className="flex-1">
        <div className="h-4 w-3/4 bg-gray-200/40 dark:bg-gray-700/25 rounded-lg"></div>
      </div>
    </div>

    {/* Event Details */}
    <div className="space-y-6 flex-1">
      {/* Title */}
      <div className="space-y-3">
        <div className="h-5 w-full bg-gray-200/45 dark:bg-gray-700/30 rounded-lg"></div>
        <div className="h-5 w-4/5 bg-gray-200/35 dark:bg-gray-700/25 rounded-lg"></div>
      </div>

      {/* Date & Location */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-gray-200/40 dark:bg-gray-700/25 rounded"></div>
          <div className="h-3 w-2/3 bg-gray-200/35 dark:bg-gray-700/20 rounded-lg"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-gray-200/40 dark:bg-gray-700/25 rounded"></div>
          <div className="h-3 w-1/2 bg-gray-200/35 dark:bg-gray-700/20 rounded-lg"></div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-200/30 dark:bg-gray-700/15 rounded-lg"></div>
        <div className="h-3 w-4/5 bg-gray-200/25 dark:bg-gray-700/12 rounded-lg"></div>
      </div>
    </div>

    {/* Footer */}
    <div className="pt-6">
      <div className="h-10 w-full bg-emerald-200/35 dark:bg-emerald-800/15 rounded-lg"></div>
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

export const AnnouncementPreview = () => (
  <div className="flex flex-col h-full relative">
    <div className="absolute top-0 left-0">
      <div className="w-8 h-8 rounded-xl bg-orange-100/50 dark:bg-orange-900/20 flex items-center justify-center">
        <Zap className="w-5 h-5 text-orange-500/70 dark:text-orange-400/50" />
      </div>
    </div>
    <div className="pt-14 w-full space-y-4">
      <div className="h-2 w-3/4 bg-gray-200/40 dark:bg-gray-700/20 rounded-full"></div>
      <div className="p-3 rounded border-l-4 border-orange-200/50 bg-orange-50/30 dark:bg-orange-900/10 space-y-2">
        <div className="h-1.5 bg-orange-200/40 dark:bg-orange-700/20 rounded-full w-full"></div>
        <div className="h-1.5 bg-orange-200/40 dark:bg-orange-700/20 rounded-full w-2/3"></div>
      </div>
    </div>
  </div>
);

export const PollPreview = () => (
  <div className="flex flex-col h-full relative">
    <div className="absolute top-0 left-0">
      <div className="w-8 h-8 rounded-xl bg-teal-100/50 dark:bg-teal-900/20 flex items-center justify-center">
        <CheckCircle className="w-5 h-5 text-teal-500/70 dark:text-teal-400/50" />
      </div>
    </div>
    <div className="pt-14 w-full space-y-4">
      <div className="h-2 w-3/4 bg-gray-200/40 dark:bg-gray-700/20 rounded-full"></div>
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-100/70 dark:bg-gray-800/20 flex-shrink-0"></div>
            <div className="h-6 bg-gray-100/70 dark:bg-gray-800/20 rounded flex-1 relative">
              <div className={`h-full bg-teal-200/50 dark:bg-teal-700/20 rounded`} style={{width: `${40 + i * 20}%`}}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const CommunityPreview = () => (
  <div className="flex flex-col h-full relative">
    <div className="absolute top-0 left-0">
      <div className="w-8 h-8 rounded-xl bg-blue-100/50 dark:bg-blue-900/20 flex items-center justify-center">
        <Users className="w-5 h-5 text-blue-500/70 dark:text-blue-400/50" />
      </div>
    </div>
    <div className="pt-14 w-full space-y-4">
      <div className="h-2 w-3/4 bg-gray-200/40 dark:bg-gray-700/20 rounded-full"></div>
      <div className="flex -space-x-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-8 h-8 rounded-full bg-gray-100/70 dark:bg-gray-800/20 border-2 border-white dark:border-gray-900"></div>
        ))}
      </div>
      <div className="space-y-2">
        <div className="h-1.5 bg-gray-200/40 dark:bg-gray-700/20 rounded-full w-full"></div>
        <div className="h-1.5 bg-gray-200/40 dark:bg-gray-700/20 rounded-full w-3/4"></div>
      </div>
    </div>
  </div>
);

export const AchievementPreview = () => (
  <div className="flex flex-col h-full relative">
    <div className="absolute top-0 left-0">
      <div className="w-8 h-8 rounded-xl bg-yellow-100/50 dark:bg-yellow-900/20 flex items-center justify-center">
        <Trophy className="w-5 h-5 text-yellow-500/70 dark:text-yellow-400/50" />
      </div>
    </div>
    <div className="pt-14 w-full space-y-4">
      <div className="h-2 w-3/4 bg-gray-200/40 dark:bg-gray-700/20 rounded-full"></div>
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-yellow-100/70 dark:bg-yellow-800/20 mx-auto flex items-center justify-center">
          <Trophy className="w-6 h-6 text-yellow-500/50 dark:text-yellow-400/30" />
        </div>
        <div className="h-1.5 bg-gray-200/40 dark:bg-gray-700/20 rounded-full w-2/3 mx-auto"></div>
      </div>
    </div>
  </div>
);

export const MediaPreview = () => (
  <div className="flex flex-col h-full relative">
    <div className="absolute top-0 left-0">
      <div className="w-8 h-8 rounded-xl bg-pink-100/50 dark:bg-pink-900/20 flex items-center justify-center">
        <Image className="w-5 h-5 text-pink-500/70 dark:text-pink-400/50" />
      </div>
    </div>
    <div className="pt-14 w-full space-y-4">
      <div className="h-2 w-3/4 bg-gray-200/40 dark:bg-gray-700/20 rounded-full"></div>
      <div className="grid grid-cols-2 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="aspect-square rounded bg-gray-100/70 dark:bg-gray-800/20"></div>
        ))}
      </div>
    </div>
  </div>
);

export const LiveStreamPreview = () => (
  <div className="flex flex-col h-full relative">
    <div className="absolute top-0 left-0">
      <div className="w-8 h-8 rounded-xl bg-red-100/50 dark:bg-red-900/20 flex items-center justify-center">
        <Play className="w-5 h-5 text-red-500/70 dark:text-red-400/50" />
      </div>
    </div>
    <div className="pt-14 w-full space-y-4">
      <div className="h-2 w-3/4 bg-gray-200/40 dark:bg-gray-700/20 rounded-full"></div>
      <div className="aspect-video w-full rounded bg-gray-100/70 dark:bg-gray-800/20 relative">
        <div className="absolute top-2 left-2 px-2 py-1 bg-red-500/20 rounded text-xs">
          <div className="w-2 h-2 bg-red-500/50 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
);

export const ChallengePreview = () => (
  <div className="flex flex-col h-full relative">
    <div className="absolute top-0 left-0">
      <div className="w-8 h-8 rounded-xl bg-green-100/50 dark:bg-green-900/20 flex items-center justify-center">
        <Star className="w-5 h-5 text-green-500/70 dark:text-green-400/50" />
      </div>
    </div>
    <div className="pt-14 w-full space-y-4">
      <div className="h-2 w-3/4 bg-gray-200/40 dark:bg-gray-700/20 rounded-full"></div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-1.5 bg-gray-200/40 dark:bg-gray-700/20 rounded-full w-1/2"></div>
          <div className="text-xs bg-green-100/50 dark:bg-green-900/20 px-2 py-1 rounded">
            <div className="w-8 h-2 bg-green-200/40 dark:bg-green-700/20 rounded"></div>
          </div>
        </div>
        <div className="h-2 bg-gray-100/70 dark:bg-gray-800/20 rounded-full">
          <div className="h-2 bg-green-200/50 dark:bg-green-700/20 rounded-full w-2/3"></div>
        </div>
      </div>
    </div>
  </div>
);

export const ChangelogPreview = () => (
  <div className="flex flex-col h-full relative">
    <div className="absolute top-0 left-0">
      <div className="w-8 h-8 rounded-xl bg-indigo-100/50 dark:bg-indigo-900/20 flex items-center justify-center">
        <Layout className="w-5 h-5 text-indigo-500/70 dark:text-indigo-400/50" />
      </div>
    </div>
    <div className="pt-14 w-full space-y-4">
      <div className="h-2 w-3/4 bg-gray-200/40 dark:bg-gray-700/20 rounded-full"></div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-200/50 dark:bg-indigo-700/30 mt-1.5"></div>
            <div className="flex-1 space-y-1">
              <div className="h-1.5 bg-gray-200/40 dark:bg-gray-700/20 rounded-full w-full"></div>
              <div className="h-1 bg-gray-200/30 dark:bg-gray-700/15 rounded-full w-2/3"></div>
            </div>
            <div className="flex-shrink-0 text-xs">
              <div className="w-12 h-3 bg-gray-100/50 dark:bg-gray-800/20 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Helper function to get preview component by type name
export const getPreviewComponent = (typeName: string) => {
  const lowerCaseName = typeName.toLowerCase();
  
  switch (lowerCaseName) {
    // Exact CMS types from your system
    case 'job-board':
    case 'job_board':
      return <JobListPreview />;
    case 'event':
    case 'events':
      return <EventPreview />;
    case 'qa':
    case 'q&a':
      return <QAPreview />;
    case 'ideas-wishlist':
    case 'ideas_wishlist':
    case 'wishlist':
    case 'idea':
    case 'ideas':
      return <WishlistPreview />;
    case 'knowledge-base':
    case 'knowledge_base':
    case 'knowledge':
      return <KnowledgeBasePreview />;
    case 'blog':
      return <BlogPreview />;
    case 'discussion':
    case 'discussions':
      return <DiscussionPreview />;
    case 'changelog':
    case 'change-log':
    case 'change_log':
      return <ChangelogPreview />;
    
    // Additional variations and aliases
    case 'job':
    case 'jobs':
    case 'job list':
    case 'career':
    case 'careers':
      return <JobListPreview />;
    case 'qa_question':
    case 'question':
    case 'questions':
      return <QAPreview />;
    case 'feature_request':
    case 'features':
      return <WishlistPreview />;
    case 'landing':
    case 'landing_page':
    case 'page':
      return <LandingPagePreview />;
    case 'kb_article':
    case 'knowledge base':
    case 'documentation':
    case 'docs':
      return <KnowledgeBasePreview />;
    case 'article':
    case 'post':
    case 'news':
      return <BlogPreview />;
    case 'forum':
      return <DiscussionPreview />;
    case 'updates':
    case 'release':
    case 'releases':
    case 'release_notes':
      return <ChangelogPreview />;
    
    // Additional types
    case 'announcement':
    case 'announcements':
    case 'notice':
    case 'notices':
      return <AnnouncementPreview />;
    case 'poll':
    case 'polls':
    case 'vote':
    case 'voting':
    case 'survey':
      return <PollPreview />;
    case 'community':
    case 'group':
    case 'groups':
    case 'team':
    case 'teams':
      return <CommunityPreview />;
    case 'achievement':
    case 'achievements':
    case 'badge':
    case 'badges':
    case 'award':
    case 'awards':
      return <AchievementPreview />;
    case 'media':
    case 'gallery':
    case 'photo':
    case 'photos':
    case 'image':
    case 'images':
      return <MediaPreview />;
    case 'live':
    case 'live_stream':
    case 'stream':
    case 'broadcast':
    case 'video':
      return <LiveStreamPreview />;
    case 'challenge':
    case 'challenges':
    case 'contest':
    case 'contests':
    case 'competition':
      return <ChallengePreview />;
    
    // Default fallback
    default:
      return <DiscussionPreview />;
  }
}; 