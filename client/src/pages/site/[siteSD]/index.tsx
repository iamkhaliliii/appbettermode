import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useLocation, Switch, Route } from 'wouter';
import { SiteLayout } from '@/components/layout/site/site-layout';
import { SiteSidebar } from '@/components/layout/site/site-sidebar';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Avatar, AvatarFallback, AvatarImage } from '@/components/ui/primitives';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/forms/dropdown-menu';
import { 
  MessageSquare, 
  HelpCircle, 
  Star, 
  Calendar, 
  Users,
  Link as LinkIcon,
  Loader2,
  Music,
  Video,
  Image as ImageIcon,
  ArrowUpDown,
  Check,
  ChevronDown,
  Clock,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { sitesApi, Site } from '@/lib/api';
import { Link } from 'wouter';
import { useSiteData } from '@/lib/SiteDataContext';
import { LayoutProvider, useLayout } from '@/lib/LayoutContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/primitives';
import { SocialCard } from '@/components/ui/social-card/social-card';
import SpacePage from './/[spaceSlug]';
import PollsPage from './polls';
import SearchPage from './search';
import ModerationPage from './moderation';

interface SiteContextType {
  site: Site | null;
  isLoading: boolean;
}

// Create a context for site data
export const SiteContext = React.createContext<SiteContextType>({ 
  site: null, 
  isLoading: false 
});

// Shared context for site data to prevent refetching
export const SiteDataProvider: React.FC<{
  siteSD: string; 
  children: React.ReactNode;
}> = ({ siteSD, children }) => {
  const { sites, loadSite } = useSiteData();
  const [site, setSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadSiteData = async () => {
      if (!siteSD) return;
      
      setIsLoading(true);
      
      try {
        if (sites[siteSD]) {
          setSite(sites[siteSD]);
        } else {
          const siteData = await loadSite(siteSD);
          if (siteData) {
            setSite(siteData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch site data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSiteData();
  }, [siteSD, sites, loadSite]);
  
  const contextValue: SiteContextType = {
    site,
    isLoading
  };
  
  return (
    <SiteContext.Provider value={contextValue}>
      {children}
    </SiteContext.Provider>
  );
};

// Content skeleton component for smooth loading states
const ContentSkeleton = () => (
  <div className="space-y-6">
    <div>
      <Skeleton className="h-8 w-48 mb-4" />
    </div>
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-9 w-20" />
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <div>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Social Feed content component
const SocialFeedContent = () => {
  const { site, isLoading } = React.useContext(SiteContext);
  const { siteSD } = useParams();
  
  // Sort state
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'trending'>('latest');
  
  // Pinned posts data
  const pinnedData: Array<{
    id: number;
    author: any;
    content: any;
    engagement: any;
    engagementStyle: "default" | "reactions" | "upvote" | "event";
  }> = [
    {
      id: 101,
      author: {
        name: "Community Team",
        username: "bettermode_team",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        timeAgo: "Pinned",
        postCategory: "wishlist",
        badge: {
          text: "Admin",
          emoji: "⭐"
        },
        emoji: "📌"
      },
      content: {
        text: "🎯 Help us shape the future of music! What features would you love to see in our platform? Your ideas matter and directly influence our roadmap. Vote for your favorites below! 🚀",
        poll: {
          question: "Which feature should we prioritize next?",
          options: [
            { id: "ai_recommendations", text: "AI-powered music recommendations", votes: 1247 },
            { id: "live_collaboration", text: "Real-time collaboration tools", votes: 892 },
            { id: "advanced_analytics", text: "Advanced analytics dashboard", votes: 756 },
            { id: "mobile_app", text: "Native mobile application", votes: 1523 },
            { id: "playlist_sharing", text: "Enhanced playlist sharing", votes: 634 }
          ],
          totalVotes: 5052,
          hasVoted: false,
          timeLeft: "5 days left"
        },
      },
      engagement: {
        likes: 847,
        comments: 234,
        shares: 89,
        isLiked: false,
        isBookmarked: true,
        upvotes: 1429,
        downvotes: 67,
        isUpvoted: false,
        isDownvoted: false,
      },
      engagementStyle: "upvote",
    },
  ];

  // Sample feed data with Unsplash images
  const feedData: Array<{
    id: number;
    author: any;
    content: any;
    engagement: any;
    engagementStyle: "default" | "reactions" | "upvote" | "event";
  }> = [
    {
      id: 1,
      author: {
        name: "Sarah Chen",
        username: "sarahmusic",
        avatar: "https://mighty.tools/mockmind-api/content/human/129.jpg",
        timeAgo: "2h ago",
        postCategory: "discussion",
        badge: {
          text: "New member",
          emoji: "👋"
        },
        emoji: "🥉"
      },
      content: {
        text: "Just discovered this amazing playlist for coding sessions! The mix of lo-fi and ambient sounds really helps with focus. What do you all use for background music while working? 🎵",
        link: {
          title: "Focus Flow - Deep Work Playlist",
          description: "3 hours of carefully curated ambient and lo-fi tracks",
          icon: <Music className="w-5 h-5 text-blue-500" />,
        },
      },
      engagement: {
        likes: 42,
        comments: 18,
        shares: 7,
        isLiked: false,
        isBookmarked: true,
      },
      engagementStyle: "default",
    },
    {
      id: 2,
      author: {
        name: "Alex Rodriguez",
        username: "audiotech",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        timeAgo: "4h ago",
        postCategory: "general",
        badge: {
          text: "Expert",
          emoji: "🎧"
        },
      },
      content: {
        text: "PSA: Remember to take listening breaks every hour! Your ears will thank you later. I've been using the 60/60 rule - 60% volume for max 60 minutes, then a 10-minute break. Game changer for long mixing sessions! 🎧",
        images: [
          {
            src: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop",
            alt: "Professional studio headphones on mixing desk"
          },
          {
            src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
            alt: "Audio mixing console with sliders"
          },
          {
            src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop",
            alt: "Studio monitor speakers setup"
          }
        ]
      },
      engagement: {
        likes: 156,
        comments: 23,
        shares: 31,
        isLiked: true,
        isBookmarked: false,
        reactions: {
          heart: 119,
          clap: 87,
          fire: 87,
        },
        userReaction: "❤️",
      },
      engagementStyle: "reactions",
    },
    {
      id: 3,
      author: {
        name: "Maya Patel",
        username: "vinylcollector",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        timeAgo: "6h ago",
        postCategory: "wishlist",
        badge: {
          text: "Vinyl Collector",
          emoji: "💿"
        },
        emoji: "🥇"
      },
      content: {
        text: "Found this gem at a local record store today! 1975 pressing of Pink Floyd's 'Wish You Were Here' in pristine condition. The sound quality is just incredible compared to digital. Sometimes analog really is magic ✨",
        poll: {
          question: "Vinyl vs Digital: The Great Debate",
          options: [
            { id: "vinyl", text: "Vinyl - Nothing beats that warm analog sound", votes: 234 },
            { id: "digital", text: "Digital - Convenience and quality combined", votes: 145 },
            { id: "both", text: "Both have their place in my collection", votes: 189 },
            { id: "streaming", text: "Streaming is the future", votes: 67 }
          ],
          totalVotes: 635,
          hasVoted: false,
          timeLeft: "2 days left"
        },
      },
      engagement: {
        likes: 89,
        comments: 34,
        shares: 12,
        isLiked: false,
        isBookmarked: false,
        upvotes: 52,
        downvotes: 7,
        isUpvoted: false,
        isDownvoted: false,
      },
      engagementStyle: "upvote",
    },
    {
      id: 4,
      author: {
        name: "Jordan Kim",
        username: "eventhost",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        timeAgo: "8h ago",
        postCategory: "events",
        badge: {
          text: "Event Host",
          emoji: "🎪"
        },
        emoji: "🥉"
      },
      content: {
        text: "Join us for our Monthly Music Meetup! 🎵 We'll be showcasing new artists, discussing latest trends, and networking with fellow music enthusiasts. Free snacks and drinks provided!",
        event: {
          title: "Monthly Music Meetup - March 2024",
          date: "Saturday, March 23rd",
          time: "7:00 PM",
          location: "Community Center",
          attendees: 67,
          category: "Networking",
          status: "upcoming",
          host: {
            name: "Jordan Kim",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
          }
        },
      },
      engagement: {
        comments: 23,
        shares: 8,
        isBookmarked: false,
        rsvp: {
          yes: 42,
          no: 3,
          maybe: 15,
        },
        userRSVP: null,
      },
      engagementStyle: "event",
    },
    {
      id: 5,
      author: {
        name: "Chris Thompson",
        username: "basshunter",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        timeAgo: "12h ago",
        postCategory: "qa",
        badge: {
          text: "Musician",
          emoji: "🎸"
        },
      },
      content: {
        text: "Working on a new bass line that's been stuck in my head all week. Sometimes the best melodies come when you're not even trying! Anyone else get those random musical moments? 🎸",
        form: {
          title: "Share Your Musical Moment",
          description: "Tell us about your latest musical inspiration or creative breakthrough!",
          fields: [
            {
              id: "instrument",
              label: "What instrument?",
              type: "select",
              options: ["Guitar", "Bass", "Piano", "Drums", "Vocals", "Other"],
              required: true
            },
            {
              id: "moment_type",
              label: "Type of moment",
              type: "radio",
              options: ["Spontaneous melody", "Rhythmic pattern", "Chord progression", "Lyrical idea"],
              required: true
            },
            {
              id: "description",
              label: "Describe your moment",
              type: "textarea",
              placeholder: "Share the details of your musical inspiration...",
              required: true
            },
            {
              id: "inspiration_source",
              label: "What inspired you?",
              type: "text",
              placeholder: "Walking in nature, listening to music, etc.",
              required: false
            }
          ],
          submitText: "Share My Moment",
          responses: 23
        }
      },
      engagement: {
        likes: 73,
        comments: 19,
        shares: 8,
        isLiked: false,
        isBookmarked: false,
        upvotes: 68,
        downvotes: 5,
        isUpvoted: true,
        isDownvoted: false,
      },
      engagementStyle: "upvote",
    },
    {
      id: 6,
      author: {
        name: "Emma Wilson",
        username: "musicproducer",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b7cf?w=150&h=150&fit=crop&crop=face",
        timeAgo: "1d ago",
        postCategory: "discussion",
        badge: {
          text: "Producer",
          emoji: "🎹"
        },
      },
      content: {
        text: "Just finished mastering my latest track! The process took 3 weeks but I'm so happy with how it turned out. Sometimes patience really pays off in music production.",
        video: {
          embedUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          title: "Music Production: The Art of Mastering",
          description: "A deep dive into the mastering process that brings your tracks to life. Learn the techniques and patience required for professional results.",
          platform: "YouTube",
          duration: "12:34"
        }
      },
      engagement: {
        likes: 91,
        comments: 25,
        shares: 12,
        isLiked: false,
        isBookmarked: false,
        reactions: {
          heart: 91,
          clap: 45,
          fire: 67,
        },
        userReaction: "",
      },
      engagementStyle: "reactions",
    },
  ];

  // Leaderboard data
  const leaderboardData = [
    {
      rank: 1,
      name: "David Williams",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      points: 981
    },
    {
      rank: 2,
      name: "Emma Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b7cf?w=150&h=150&fit=crop&crop=face",
      points: 562
    },
    {
      rank: 3,
      name: "Noah Reynolds",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      points: 485
    },
    {
      rank: 4,
      name: "Isabella Garcia",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      points: 370
    },
    {
      rank: 5,
      name: "Lisa White",
      avatar: "https://mighty.tools/mockmind-api/content/human/129.jpg",
      points: 245
    }
  ];
  
  // Define animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.3
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  
  const handleAction = (id: number, action: string) => {
    console.log(`Post ${id}: ${action}`);
  };
  
  if (isLoading) {
    return <ContentSkeleton />;
  }
  
  return (
      <div className="flex gap-6">
        {/* Left Side - Social Cards */}
        <div className="flex-1 space-y-8">
          {/* Pinned Posts Section */}
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Pinned posts
            </h2>
            <div className="space-y-4">
              {pinnedData.map((post) => (
                <motion.div key={post.id} variants={itemVariants}>
                  <SocialCard
                    author={post.author}
                    content={post.content}
                    engagement={post.engagement}
                    engagementStyle={post.engagementStyle}
                    onLike={() => handleAction(post.id, 'liked')}
                    onComment={() => handleAction(post.id, 'commented')}
                    onShare={() => handleAction(post.id, 'shared')}
                    onBookmark={() => handleAction(post.id, 'bookmarked')}
                    onMore={() => handleAction(post.id, 'more')}
                    onUpvote={() => handleAction(post.id, 'upvoted')}
                    onDownvote={() => handleAction(post.id, 'downvoted')}
                    onReaction={(reaction: string) => handleAction(post.id, `reacted with ${reaction}`)}
                    onRSVP={(response: string) => handleAction(post.id, `RSVP ${response}`)}
                    onPollVote={(optionId: string) => handleAction(post.id, `voted for ${optionId}`)}
                    className="h-fit"
                  />
                </motion.div>
              ))}
            </div>
      </motion.div>

          {/* Feed Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Feed
              </h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    <span className="capitalize">{sortBy}</span>
                    <ChevronDown className="w-3 h-3 ml-1 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => setSortBy('latest')}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>Latest</span>
                    {sortBy === 'latest' && <Check className="w-4 h-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortBy('popular')}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>Popular</span>
                    {sortBy === 'popular' && <Check className="w-4 h-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortBy('trending')}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>Trending</span>
                    {sortBy === 'trending' && <Check className="w-4 h-4" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-4">
              {feedData.map((post) => (
                <motion.div key={post.id} variants={itemVariants}>
                  <SocialCard
                    author={post.author}
                    content={post.content}
                    engagement={post.engagement}
                    engagementStyle={post.engagementStyle}
                    onLike={() => handleAction(post.id, 'liked')}
                    onComment={() => handleAction(post.id, 'commented')}
                    onShare={() => handleAction(post.id, 'shared')}
                    onBookmark={() => handleAction(post.id, 'bookmarked')}
                    onMore={() => handleAction(post.id, 'more')}
                    onUpvote={() => handleAction(post.id, 'upvoted')}
                    onDownvote={() => handleAction(post.id, 'downvoted')}
                    onReaction={(reaction: string) => handleAction(post.id, `reacted with ${reaction}`)}
                    onRSVP={(response: string) => handleAction(post.id, `RSVP ${response}`)}
                    onPollVote={(optionId: string) => handleAction(post.id, `voted for ${optionId}`)}
                    className="h-fit"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
                </div>

      {/* Right Sidebar */}
      <div className="w-80 space-y-6">
        {/* Leaderboard */}
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
            Leaderboard
          </h2>
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <CardContent className="space-y-3 p-4">
              <div className="flex gap-1 mb-4">
                <Button size="sm" variant="default" className="text-xs px-3 py-1 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">
                  All time
                </Button>
                <Button size="sm" variant="ghost" className="text-xs px-3 py-1 rounded-full text-zinc-500 hover:text-zinc-700">
                  Month
                </Button>
                <Button size="sm" variant="ghost" className="text-xs px-3 py-1 rounded-full text-zinc-500 hover:text-zinc-700">
                  Week
                </Button>
              </div>
              {leaderboardData.map((user) => (
                <div key={user.rank} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 w-4">
                    {user.rank}
                  </span>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {user.name}
                  </p>
                </div>
                  <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    {user.points}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
                </div>

        {/* Next Event */}
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
            Next event
          </h2>
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Date and Time */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Today</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">6:30</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">PM</div>
                  </div>
                </div>
                
                {/* Event Title */}
                <div>
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                    Let's talk about future of AI
                    </h3>
                  <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <div className="w-5 h-5 bg-zinc-900 dark:bg-zinc-100 rounded-lg flex items-center justify-center">
                      <Video className="w-3 h-3 text-white dark:text-zinc-900" />
                    </div>
                    <span>BetterHub</span>
                    <span className="text-zinc-400">•</span>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span className="text-xs">247 attending</span>
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <MapPin className="w-4 h-4" />
                  <span>20 Grand Ave, San Francisco</span>
                </div>
                
                {/* Join Button */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    Starts in 2h 30m
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-1 px-2 py-1 text-sm bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 rounded-full transition-colors font-medium"
                  >
                    View Event
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
              </div>
            </div>
            </div>
  );
};

// Main Site Page
export default function SitePage() {
  const { siteSD } = useParams();
  const [location] = useLocation();
  
  // Determine active page based on current route
  const getActivePage = () => {
    if (location.includes('/polls')) return 'polls';
    if (location.includes('/search')) return 'search';
    if (location.includes('/moderation')) return 'moderation';
    return 'home';
  };
  
  if (!siteSD) return null;
  
  return (
    <LayoutProvider>
      <SiteDataProvider siteSD={siteSD}>
        <SiteLayout siteSD={siteSD}>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Main Content with Sidebar */}
          <div className="container mx-auto px-4 py-6 flex-grow">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar */}
              <SiteSidebar siteSD={siteSD} activePage={getActivePage()} isAdminHeaderVisible={true} />

              {/* Main Content Feed with loading state */}
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  <Switch>
                    <Route path="/site/:siteSD/polls">
                      <PollsPage />
                    </Route>
                    <Route path="/site/:siteSD/search">
                      <SearchPage />
                    </Route>
                    <Route path="/site/:siteSD/moderation/:section?">
                      <ModerationPage />
                    </Route>
                    <Route path="/site/:siteSD/:spaceSlug">
                      {(params) => <SpacePage />}
                    </Route>
                    <Route path="/site/:siteSD">
                      <SocialFeedContent />
                    </Route>
                  </Switch>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </SiteLayout>
    </SiteDataProvider>
    </LayoutProvider>
  );
} 