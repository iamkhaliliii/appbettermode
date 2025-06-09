import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { SiteLayout } from '@/components/layout/site/site-layout';
import { Input, Button } from '@/components/ui/primitives';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/primitives';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/primitives';
import { MessageSquare, HelpCircle, Star, Search as SearchIcon, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/primitives';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/primitives';
import { sitesApi } from '@/lib/api';
import { 
  BookOpenIcon, 
  BellIcon, 
  ArrowLeftIcon,
  XIcon,
  UserIcon,
  InfoIcon,
  CalendarIcon,
  CodeIcon,
  PlusIcon,
  Globe,
  ChevronRightIcon,
  MoreHorizontalIcon,
  CornerDownLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  LayoutIcon,
  ChevronDown,
  AlertCircleIcon,
  ExternalLinkIcon,
  ShieldCheck
} from "lucide-react";
import Lottie from "react-lottie";
import askAiAnimation from "@/public/askai.json";

// Mock search results for different content types
const MOCK_SEARCH_RESULTS = {
  all: [],
  discussions: [
    {
      id: 1,
      title: "How do I create a playlist with songs from different artists?",
      content: "I'm trying to create a playlist that combines songs from various artists but I'm having trouble finding an efficient way to do this. Any suggestions?",
      author: {
        name: "JaneDoe",
        avatar: "https://i.pravatar.cc/150?img=1"
      },
      type: "discussion",
      replies: 12,
      views: 340,
      likes: 28,
      tags: ["playlists", "help", "music"],
      createdAt: "2 days ago"
    },
    {
      id: 2,
      title: "Feature request: Add ability to see lyrics automatically",
      content: "It would be amazing if we could automatically see lyrics synced with songs as they play. Would make singing along so much easier!",
      author: {
        name: "MusicLover42",
        avatar: "https://i.pravatar.cc/150?img=2"
      },
      type: "discussion",
      replies: 25,
      views: 512,
      likes: 96,
      tags: ["feature", "lyrics", "suggestion"],
      createdAt: "5 days ago"
    }
  ],
  qa: [
    {
      id: 1,
      title: "How can I share my playlists with friends who don't have accounts?",
      content: "I've created some great playlists and want to share them with friends who don't have accounts. What's the easiest way to do this?",
      author: {
        name: "PlaylistMaker",
        avatar: "https://i.pravatar.cc/150?img=5"
      },
      type: "qa",
      answers: 4,
      views: 256,
      upvotes: 18,
      solved: true,
      tags: ["sharing", "playlists", "help"],
      createdAt: "3 days ago"
    }
  ],
  wishlist: [
    {
      id: 1,
      title: "Add lyrics sync for karaoke mode",
      description: "Would love to see a karaoke mode where lyrics are highlighted in real-time as the song plays. This would make sing-alongs much more fun!",
      author: {
        name: "KaraokeFan",
        avatar: "https://i.pravatar.cc/150?img=11"
      },
      type: "wishlist",
      status: "Under review",
      upvotes: 285,
      comments: 32,
      tags: ["feature", "lyrics", "playback", "popular"],
      createdAt: "2 months ago"
    }
  ],
  events: [
    {
      id: 1,
      title: "New Feature Showcase",
      description: "Join us for a live showcase of our newest features. We'll demo the updated equalizer and answer your questions.",
      type: "event",
      date: "Jun 15, 2025",
      time: "3:00 PM",
      attendees: 87
    }
  ]
};

export default function SearchPage() {
  const params = useParams();
  const siteSD = params?.siteSD || '';
  const [location, setLocation] = useLocation();
  const [site, setSite] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Extract query parameter from URL
  const urlParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  );
  const queryParam = urlParams.get('q') || '';
  const typeParam = urlParams.get('type') || '';
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedFilter, setSelectedFilter] = useState(typeParam || 'all');
  const [askAIMode, setAskAIMode] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortOption, setSortOption] = useState('relevancy');
  const [visiblePostsCount, setVisiblePostsCount] = useState(20);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [hasResults, setHasResults] = useState(true);
  const [initialVisit, setInitialVisit] = useState(false);
  
  // Site configuration (these would come from your app settings in a real app)
  const siteConfig = {
    // Search features available on this site
    enabledSearchTypes: {
      posts: true,     // Enable posts search
      spaces: true,    // Enable spaces search
      members: true,   // Enable members search
      officialResources: true, // Enable official resources search
    },
    // AI features available
    aiAssistanceEnabled: true,
    // Popular searches available (empty array means feature not available)
    popularSearches: [], // Empty array indicates no popular searches available
    // Site is new or has limited content
    isNewSite: true
  };
  
  // Function to load more posts
  const loadMorePosts = () => {
    // Simulate loading more posts - in a real app this would fetch from an API
    if (visiblePostsCount + 20 >= allPosts.length) {
      setVisiblePostsCount(allPosts.length);
      setHasMorePosts(false);
    } else {
      setVisiblePostsCount(visiblePostsCount + 20);
    }
  };
  
  // Determine which tab to show by default based on enabled search types
  useEffect(() => {
    // If 'all' isn't useful because we only have one type, default to that type
    if (!siteConfig.enabledSearchTypes.spaces && !siteConfig.enabledSearchTypes.members) {
      setSelectedFilter('posts');
    }
  }, []);
  
  // Extract search query from URL on initial load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    const type = urlParams.get('type') || '';
    
    if (query) {
      setSearchQuery(decodeURIComponent(query));
      setInitialVisit(false);
      // Demo purposes: If query contains "empty" or specific Persian terms, show empty state
      if (query.toLowerCase().includes('empty') || 
          query.toLowerCase().includes('halate') ||
          query.toLowerCase().includes('darnazar')) {
        setHasResults(false);
      } else {
        setHasResults(true);
      }
    } else {
      // User directly visited search without a query
      setInitialVisit(true);
      setHasResults(true);
    }
    
    if (type) {
      setSelectedFilter(type);
    }
  }, [location]);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const url = `/site/${siteSD}/search?q=${encodeURIComponent(searchQuery.trim())}`;
      setLocation(url);
    }
  };
  
  // Sample post results - let's create a larger array to simulate pagination
  // In a real app, these would be fetched from an API with proper pagination
  const allPosts = [
    {
      id: 1,
      title: "Automated Email Sequence for New Community Members",
      description: "Your community is growing and members are joining. Just like you welcome a guest that comes to your house, as a community...",
      category: "Articles",
      time: "2 years ago",
      icon: "message"
    },
    {
      id: 2,
      title: "Create Posts using the Composer",
      description: "A post is a form of content (text, images links, etc.) published within a Space. Create posts in the composer and share them with a...",
      category: "Content Management",
      time: "2 years ago",
      icon: "docs"
    },
    {
      id: 3,
      title: "Zapier - how to create post as a draft (not published)",
      description: "Hey team, I created ZAP to check new row in Google sheets and then create a post from the new row. It's working but it's...",
      category: "Ask the Community",
      time: "7 months ago",
      icon: "message"
    },
    {
      id: 4,
      title: "Engagement Strategy for Online Communities",
      description: "Learn how to build an effective engagement strategy to keep your community members active and participating in meaningful ways...",
      category: "Strategy",
      time: "3 months ago",
      icon: "docs"
    },
    {
      id: 5,
      title: "How to Configure Post Permissions",
      description: "In this guide, we'll walk through setting up permissions for posts, including who can create, edit, and view different types of content...",
      category: "Administration",
      time: "1 year ago",
      icon: "docs"
    },
    {
      id: 6,
      title: "Best Practices for Community Onboarding",
      description: "First impressions matter! This guide covers everything you need to know about creating an effective onboarding experience for new members...",
      category: "Guides",
      time: "5 months ago",
      icon: "message"
    },
    {
      id: 7,
      title: "Integrating Social Media with Your Community",
      description: "Connect your community with popular social platforms to increase reach and engagement. This post explains how to set up and optimize these connections...",
      category: "Integrations",
      time: "8 months ago",
      icon: "docs"
    },
    {
      id: 8,
      title: "Analytics Dashboard Overview",
      description: "Get the most out of your community data with our analytics tools. Learn how to track engagement, growth, and other key metrics to measure success...",
      category: "Analytics",
      time: "4 months ago",
      icon: "docs"
    },
    {
      id: 9,
      title: "Creating and Managing Events",
      description: "Events are a powerful way to engage your community. This guide covers everything from creating simple meetups to complex multi-day virtual conferences...",
      category: "Features",
      time: "10 months ago",
      icon: "message"
    },
    {
      id: 10,
      title: "Content Moderation Strategies",
      description: "Keep your community safe and positive with effective moderation. Learn about automated tools and manual processes to maintain community standards...",
      category: "Moderation",
      time: "6 months ago",
      icon: "docs"
    }
    // ... rest of the posts would be here in a real app
  ];
  
  // Sample space results
  const spaceResults = [
    { id: 1, name: "Community Spaces", icon: "bell", members: 324, posts: 87 },
    { id: 2, name: "Product Updates", icon: "layout", members: 256, posts: 53 },
    { id: 3, name: "General Discussion", icon: "globe", members: 512, posts: 145 },
    { id: 4, name: "Developer Zone", icon: "code", members: 189, posts: 76 },
    { id: 5, name: "Design Resources", icon: "edit", members: 142, posts: 38 },
    { id: 6, name: "Marketing Strategies", icon: "trending-up", members: 201, posts: 64 },
    { id: 7, name: "Customer Success", icon: "users", members: 178, posts: 51 },
    { id: 8, name: "Events & Meetups", icon: "calendar", members: 290, posts: 42 }
  ];
  
  // Sample member results
  const memberResults = [
    { id: 1, name: "adellhowe", avatar: "A", role: "Admin", joined: "2 years ago" },
    { id: 2, name: "Amin Ebrahimi", avatar: "A", role: "Moderator", joined: "1 year ago" },
    { id: 3, name: "Diego Fonseca", avatar: "D", role: "Member", joined: "8 months ago" },
    { id: 4, name: "Sarah Johnson", avatar: "S", role: "Moderator", joined: "1.5 years ago" },
    { id: 5, name: "Mike Chen", avatar: "M", role: "Member", joined: "6 months ago" },
    { id: 6, name: "Priya Sharma", avatar: "P", role: "Member", joined: "3 months ago" },
    { id: 7, name: "Thomas Wright", avatar: "T", role: "Admin", joined: "2.5 years ago" },
    { id: 8, name: "Olivia Bennett", avatar: "O", role: "Member", joined: "4 months ago" }
  ];
  
  // Compute the posts to display based on the tab and visible count
  const postResults = selectedFilter === 'posts' 
    ? allPosts.slice(0, visiblePostsCount)
    : allPosts.slice(0, 8); // Show only 8 in the 'all' tab
    
  // Filter spaces and members for display
  const displayedSpaceResults = selectedFilter === 'spaces'
    ? spaceResults
    : spaceResults.slice(0, 8); // Show only 8 in the 'all' tab
    
  const displayedMemberResults = selectedFilter === 'members'
    ? memberResults
    : memberResults.slice(0, 8); // Show only 8 in the 'all' tab
    
  // Reset visible posts count when switching to Posts tab
  useEffect(() => {
    if (selectedFilter === 'posts') {
      setVisiblePostsCount(20);
      setHasMorePosts(allPosts.length > 20);
    }
  }, [selectedFilter]);

  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteSD) return;
      
      setIsLoading(true);
      try {
        const siteData = await sitesApi.getSite(siteSD);
        setSite(siteData);
      } catch (error) {
        console.error('Failed to fetch site data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, [siteSD]);

  // Render icon based on type
  const renderPostIcon = (iconType: string) => {
    switch (iconType) {
      case 'message':
        return (
          <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
            <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
        );
      case 'docs':
        return (
          <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
            <div className="w-full h-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <BookOpenIcon className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            </div>
          </div>
        );
      case 'bell':
        return (
          <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
            <div className="w-full h-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <BellIcon className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            </div>
          </div>
        );
      case 'layout':
        return (
          <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
            <div className="w-full h-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <LayoutIcon className="w-4 h-4 text-green-500 dark:text-green-400" />
            </div>
          </div>
        );
      case 'globe':
        return (
          <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
            <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Globe className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
        );
      case 'code':
        return (
          <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
            <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <CodeIcon className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            </div>
          </div>
        );
      case 'edit':
        return (
          <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
            <div className="w-full h-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
              <BookOpenIcon className="w-4 h-4 text-pink-500 dark:text-pink-400" />
            </div>
          </div>
        );
      case 'trending-up':
        return (
          <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
            <div className="w-full h-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <ArrowUpIcon className="w-4 h-4 text-orange-500 dark:text-orange-400" />
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
            <div className="w-full h-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-teal-500 dark:text-teal-400" />
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
            <div className="w-full h-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4 text-red-500 dark:text-red-400" />
            </div>
          </div>
        );
      case 'inbox':
        return (
          <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
            <div className="w-full h-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <LayoutIcon className="w-4 h-4 text-violet-500 dark:text-violet-400" />
            </div>
          </div>
        );
      case 'help-circle':
        return (
          <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
            <div className="w-full h-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
              <InfoIcon className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
            </div>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
            <div className="w-full h-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <BellIcon className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            </div>
          </div>
        );
    }
  };

  // Toggle sort dropdown
  const toggleSortDropdown = () => {
    setShowSortDropdown(!showSortDropdown);
  };
  
  // Handle sort option selection
  const handleSortOptionSelect = (option: string) => {
    setSortOption(option);
    setShowSortDropdown(false);
  };

  // Initial visit empty state component
  const InitialVisitState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
        <SearchIcon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Search the community</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md">
        Type a keyword to search the community
      </p>
    </div>
  );
  
  // Empty results state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <AlertCircleIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
        We couldn't find any matches for "{searchQuery}". Please try another search term or browse content.
      </p>
      <div className="flex items-center space-x-3 justify-center">
        <Button 
          variant="outline" 
          onClick={() => setLocation(`/site/${siteSD}`)}
          className="rounded-full px-5 py-2 h-10"
        >
          Home
        </Button>
        
        {siteConfig.aiAssistanceEnabled && (
          <Button 
            variant="default" 
            onClick={() => setAskAIMode(true)}
            className="rounded-full px-5 py-2 h-10 flex items-center gap-2"
          >
            <div className="flex items-center justify-center w-4 h-4 rounded-md overflow-hidden flex-shrink-0">
              <Lottie
                options={{
                  loop: true,
                  autoplay: true,
                  animationData: askAiAnimation,
                  rendererSettings: {
                    preserveAspectRatio: "xMidYMid slice"
                  }
                }}
                height={16}
                width={16}
              />
            </div>
            Try AI
          </Button>
        )}
      </div>
    </div>
  );

  // Mock official resources data
  const officialResourcesResults = [
    {
      id: 1,
      title: "Getting Started Guide",
      description: "Learn the basics of setting up your community and configuring essential features",
      category: "Documentation",
      time: "1 month ago",
      icon: "docs",
      type: "internal"
    },
    {
      id: 3,
      title: "Community Best Practices",
      description: "Proven strategies and tips for growing and managing successful online communities",
      category: "Guides",
      time: "3 weeks ago",
      icon: "docs",
      type: "internal"
    },
    {
      id: 5,
      title: "Template Library",
      description: "Ready-to-use templates for different types of communities and use cases",
      category: "Resources",
      time: "1 month ago",
      icon: "layout",
      type: "internal"
    },
    {
      id: 2,
      title: "API Documentation",
      description: "Complete reference for integrating with our API endpoints and webhooks",
      category: "Developer Docs",
      time: "2 weeks ago",
      icon: "code",
      type: "external"
    },
    {
      id: 4,
      title: "Bettermode Academy",
      description: "Free courses and tutorials to help you become a community expert",
      category: "Learning",
      time: "1 week ago",
      icon: "bell",
      type: "external"
    },
    {
      id: 6,
      title: "Integration Marketplace",
      description: "Browse and install integrations to connect your community with other tools",
      category: "Integrations",
      time: "2 months ago",
      icon: "globe",
      type: "external"
    }
  ];
  
  // Filter official resources for display
  const displayedOfficialResources = selectedFilter === 'officialResources'
    ? officialResourcesResults
    : officialResourcesResults.slice(0, 4); // Show only 4 in the 'all' tab
  
  // If no siteSD is provided, show an error
  if (!siteSD) {
    return <div>Site identifier is missing</div>;
  }

  return (
    <SiteLayout siteSD={siteSD} site={site}>
      <div className="min-h-screen">
        {/* Main Content */}
        <div className="mx-auto pb-8">
          {/* Sticky Search Header */}
          <div className="sticky top-16 z-10 bg-gray-50 dark:bg-gray-950">
            {/* Command Menu Style Content */}
            <div className="bg-white dark:bg-gray-900">
              <form onSubmit={handleSearchSubmit} className="max-w-5xl mx-auto px-4">
                <div className="flex gap-2 py-5">
                  {/* Back Button */}
                  <button 
                    type="button"
                    onClick={() => setLocation(`/site/${siteSD}`)}
                    className="h-10 w-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <ArrowLeftIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>

                  {/* Search Input */}
                  <div className="flex-1 relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search community..."
                      className="w-full h-10 pl-10 pr-4 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <XIcon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                      </button>
                    )}
                  </div>

                  {/* Ask AI Button - Only show if enabled */}
                  {siteConfig.aiAssistanceEnabled && (
                    <button 
                      type="button"
                      className="h-10 px-4 flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => setAskAIMode(true)}
                    >
                      <div className="flex items-center justify-center w-4 h-4 rounded overflow-hidden">
                        <Lottie
                          options={{
                            loop: true,
                            autoplay: true,
                            animationData: askAiAnimation,
                            rendererSettings: {
                              preserveAspectRatio: "xMidYMid slice"
                            }
                          }}
                          height={16}
                          width={16}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ask AI</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            {/* Results Header with Tabs - Only show if not initial visit */}
            {!initialVisit && (
              <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-5xl mx-auto px-4 pt-1 pb-3">
                  {/* Tabs - Only show tabs for enabled search types */}
                  <div className="flex space-x-0.5">
                    {/* Only show 'All' tab if multiple search types are enabled */}
                    {(Object.values(siteConfig.enabledSearchTypes).filter(Boolean).length > 1) && (
                      <button 
                        className={`px-4 py-2 text-sm rounded-md transition-colors ${selectedFilter === 'all' 
                          ? 'bg-gray-100 dark:bg-gray-800/80 text-gray-900 dark:text-white' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        onClick={() => setSelectedFilter('all')}
                      >
                        All
                      </button>
                    )}
                    
                    {/* Only show Posts tab if enabled */}
                    {siteConfig.enabledSearchTypes.posts && (
                      <button 
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${selectedFilter === 'posts' 
                          ? 'bg-gray-100 dark:bg-gray-800/80 text-gray-900 dark:text-white' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        onClick={() => setSelectedFilter('posts')}
                      >
                        Posts
                      </button>
                    )}
                    
                    {/* Only show Official Resources tab if enabled */}
                    {siteConfig.enabledSearchTypes.officialResources && (
                      <button 
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${selectedFilter === 'officialResources' 
                          ? 'bg-gray-100 dark:bg-gray-800/80 text-gray-900 dark:text-white' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        onClick={() => setSelectedFilter('officialResources')}
                      >
                        Official Resources
                      </button>
                    )}
                    
                    {/* Only show Spaces tab if enabled */}
                    {siteConfig.enabledSearchTypes.spaces && (
                      <button 
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${selectedFilter === 'spaces' 
                          ? 'bg-gray-100 dark:bg-gray-800/80 text-gray-900 dark:text-white' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        onClick={() => setSelectedFilter('spaces')}
                      >
                        Spaces
                      </button>
                    )}
                    
                    {/* Only show Members tab if enabled */}
                    {siteConfig.enabledSearchTypes.members && (
                      <button 
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${selectedFilter === 'members' 
                          ? 'bg-gray-100 dark:bg-gray-800/80 text-gray-900 dark:text-white' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        onClick={() => setSelectedFilter('members')}
                      >
                        Members
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Search Results */}
          <div className="mt-6 max-w-5xl mx-auto px-4">
            {/* Posts Filters - Only show when Posts tab is selected and has results */}
            {selectedFilter === 'posts' && hasResults && !initialVisit && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {/* Publish Date Filter */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-xs py-1 px-3 h-7 border border-gray-200 dark:border-gray-700 rounded-full bg-white text-gray-600 dark:text-gray-300 font-normal"
                  >
                    Publish Date
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </div>
                
                {/* Space Filter */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-xs py-1 px-3 h-7 border border-gray-200 dark:border-gray-700 rounded-full bg-white text-gray-600 dark:text-gray-300 font-normal"
                  >
                    Space
                    <ChevronDown  className="ml-1 h-3 w-3" />
                  </Button>
                </div>
                
                {/* Member Filter */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-xs py-1 px-3 h-7 border border-gray-200 dark:border-gray-700 rounded-full bg-white text-gray-600 dark:text-gray-300 font-normal"
                  >
                    Member
                    <ChevronDown  className="ml-1 h-3 w-3" />
                  </Button>
                </div>
                
                {/* Tag Filter */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-xs py-1 px-3 h-7 border border-gray-200 dark:border-gray-700 rounded-full bg-white text-gray-600 dark:text-gray-300 font-normal"
                  >
                    Tag
                    <ChevronDown  className="ml-1 h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex-grow"></div>
                
                {/* Sort by */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-xs py-1 px-3 h-7 border border-gray-200 dark:border-gray-700 rounded-full bg-white text-gray-600 dark:text-gray-300 font-normal"
                    onClick={toggleSortDropdown}
                  >
                    Sort: {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
                    <ChevronDown  className="ml-1 h-3 w-3" />
                  </Button>
                  
                  {/* Sort Dropdown */}
                  {showSortDropdown && (
                    <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-gray-900 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 z-10">
                      <div className="p-1">
                        <button 
                          className="w-full text-left px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm flex items-center"
                          onClick={() => handleSortOptionSelect('relevancy')}
                        >
                          Relevancy
                          {sortOption === 'relevancy' && <span className="ml-auto text-green-500">✓</span>}
                        </button>
                        <button 
                          className="w-full text-left px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm flex items-center"
                          onClick={() => handleSortOptionSelect('popularity')}
                        >
                          Popularity
                          {sortOption === 'popularity' && <span className="ml-auto text-green-500">✓</span>}
                        </button>
                        <button 
                          className="w-full text-left px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-sm flex items-center"
                          onClick={() => handleSortOptionSelect('recency')}
                        >
                          Recency
                          {sortOption === 'recency' && <span className="ml-auto text-green-500">✓</span>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Content based on state */}
            {initialVisit ? (
              <div className="bg-white dark:bg-gray-900">
                <InitialVisitState />
              </div>
            ) : !hasResults ? (
              <div className="bg-white dark:bg-gray-900">
                <EmptyState />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Posts Section - Only show if posts search is enabled */}
                {siteConfig.enabledSearchTypes.posts && (selectedFilter === 'all' || selectedFilter === 'posts') && (
                  <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
                    <div className="px-3 pt-3 pb-[0.4rem]">
                      <h3 className="text-[0.75rem] font-medium text-gray-500 dark:text-gray-300 mb-1">Posts</h3>
                      <div className="space-y-1">
                        {postResults.map((post, index) => (
                          <div 
                            key={index}
                            className={`flex space-x-3 p-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 ${
                              selectedItemIndex === index 
                              ? 'bg-gray-100 dark:bg-gray-800'
                              : ''
                            }`}
                            onClick={() => setSelectedItemIndex(index)}
                          >
                            {renderPostIcon(post.icon)}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <div className="flex-1 mr-2 min-w-0">
                                  <h5 className="text-[0.7rem] font-medium text-gray-900 dark:text-white leading-tight truncate">{post.title}</h5>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{post.description}</p>
                                </div>
                                <div className="flex items-center flex-shrink-0">
                                  <div className="text-right mr-2">
                                    <span className="block text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{post.category}</span>
                                    <span className="block text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{post.time}</span>
                                  </div>
                                  <kbd className={`px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === index ? 'inline-flex' : 'hidden'}`}> 
                                    <CornerDownLeftIcon className="w-3 h-3" />
                                  </kbd>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Conditional rendering based on tab and if there are more posts */}
                      {selectedFilter === 'all' ? (
                        <button 
                          className="w-full mt-2 text-left text-[0.75rem] text-green-600 dark:text-green-400 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded flex items-center"
                          onClick={() => setSelectedFilter('posts')}
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 mr-1.5 rounded-md flex items-center justify-center flex-shrink-0">
                              <MoreHorizontalIcon className="w-4 h-4 text-green-500 dark:text-green-400" /> 
                            </div>
                            <span>More post results about "{searchQuery}"</span>
                            <ChevronRightIcon className="w-3 h-3 ml-1" />
                          </div>
                        </button>
                      ) : (
                        <>
                          {hasMorePosts ? (
                            <button 
                              className="w-full mt-2 text-left text-[0.75rem] text-green-600 dark:text-green-400 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded flex items-center justify-center"
                              onClick={loadMorePosts}
                            >
                              <span>Load more posts</span>
                              <ArrowDownIcon className="w-3 h-3 ml-1" />
                            </button>
                          ) : (
                            <div className="w-full mt-2 text-center text-[0.75rem] text-gray-500 dark:text-gray-400 px-2 py-2">
                              No more posts
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Official Resources Section - Only show if official resources search is enabled */}
                {siteConfig.enabledSearchTypes.officialResources && (selectedFilter === 'all' || selectedFilter === 'officialResources') && (
                  <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
                    <div className="px-3 pt-3 pb-[0.4rem]">
                      <h3 className="text-[0.75rem] font-medium text-gray-500 dark:text-gray-300 mb-1">Official Resources</h3>
                      <div className="space-y-1">
                        {displayedOfficialResources.map((resource, index) => (
                          <div 
                            key={index}
                            className={`flex space-x-3 p-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 ${
                              selectedItemIndex === index + postResults.length 
                              ? 'bg-gray-100 dark:bg-gray-800'
                              : ''
                            }`}
                            onClick={() => setSelectedItemIndex(index + postResults.length)}
                          >
                            {renderPostIcon(resource.icon)}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <div className="flex-1 mr-2 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <h5 className="text-[0.7rem] font-medium text-gray-900 dark:text-white leading-tight truncate">{resource.title}</h5>
                                    {resource.type === 'internal' ? (
                                      <ShieldCheck className="w-3 h-3 flex-shrink-0 text-gray-500" />
                                    ) : (
                                      <>
                                        <ShieldCheck className="w-3 h-3 flex-shrink-0 text-gray-500" />
                                        <ExternalLinkIcon className="w-3 h-3 flex-shrink-0 text-gray-500" />
                                      </>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{resource.description}</p>
                                </div>
                                <div className="flex items-center flex-shrink-0">
                                  <div className="text-right mr-2">
                                    <span className="block text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{resource.category}</span>
                                    <span className="block text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{resource.time}</span>
                                  </div>
                                  <kbd className={`px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === index + postResults.length ? 'inline-flex' : 'hidden'}`}> 
                                    <CornerDownLeftIcon className="w-3 h-3" />
                                  </kbd>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Only show "More" button in the All tab */}
                      {selectedFilter === 'all' && (
                        <button 
                          className="w-full mt-2 text-left text-[0.75rem] text-green-600 dark:text-green-400 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded flex items-center"
                          onClick={() => setSelectedFilter('officialResources')}
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 mr-1.5 rounded-md flex items-center justify-center flex-shrink-0">
                              <MoreHorizontalIcon className="w-4 h-4 text-green-500 dark:text-green-400" /> 
                            </div>
                            <span>More official resources about "{searchQuery}"</span>
                            <ChevronRightIcon className="w-3 h-3 ml-1" />
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Spaces Section - Only show if spaces search is enabled */}
                {siteConfig.enabledSearchTypes.spaces && (selectedFilter === 'all' || selectedFilter === 'spaces') && (
                  <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
                    <div className="px-3 pt-3 pb-[0.4rem]">
                      <h3 className="text-[0.75rem] font-medium text-gray-500 dark:text-gray-300 mb-1">Spaces</h3>
                      <div className="space-y-1">
                        {displayedSpaceResults.map((space, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40"
                          >
                            <div className="flex items-center space-x-3">
                              {renderPostIcon(space.icon)}
                              <div>
                                <span className="block text-[0.8rem] text-gray-900 dark:text-white">{space.name}</span>
                                <span className="block text-xs text-gray-500 dark:text-gray-400">{space.members} members • {space.posts} posts</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Only show "More" button in the All tab */}
                      {selectedFilter === 'all' && (
                        <button 
                          className="w-full mt-2 text-left text-[0.75rem] text-green-600 dark:text-green-400 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded flex items-center"
                          onClick={() => setSelectedFilter('spaces')}
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 mr-1.5 rounded-md flex items-center justify-center flex-shrink-0">
                              <MoreHorizontalIcon className="w-4 h-4 text-green-500 dark:text-green-400" /> 
                            </div>
                            <span>More space results about "{searchQuery}"</span>
                            <ChevronRightIcon className="w-3 h-3 ml-1" />
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Members Section - Only show if members search is enabled */}
                {siteConfig.enabledSearchTypes.members && (selectedFilter === 'all' || selectedFilter === 'members') && (
                  <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
                    <div className="px-3 pt-3 pb-[0.4rem]">
                      <h3 className="text-[0.75rem] font-medium text-gray-500 dark:text-gray-300 mb-1">Members</h3>
                      <div className="space-y-1">
                        {displayedMemberResults.map((member, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
                                {member.avatar}
                              </div>
                              <div>
                                <span className="block text-[0.8rem] text-gray-900 dark:text-white">{member.name}</span>
                                <span className="block text-xs text-gray-500 dark:text-gray-400">{member.role} • Joined {member.joined}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Only show "More" button in the All tab */}
                      {selectedFilter === 'all' && (
                        <button 
                          className="w-full mt-2 text-left text-[0.75rem] text-green-600 dark:text-green-400 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded flex items-center"
                          onClick={() => setSelectedFilter('members')}
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 mr-1.5 rounded-md flex items-center justify-center flex-shrink-0">
                              <MoreHorizontalIcon className="w-4 h-4 text-green-500 dark:text-green-400" /> 
                            </div>
                            <span>More member results about "{searchQuery}"</span>
                            <ChevronRightIcon className="w-3 h-3 ml-1" />
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
} 