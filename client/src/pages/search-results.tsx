import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  SearchIcon, 
  FilterIcon, 
  BookOpenIcon, 
  MessageSquareIcon, 
  BellIcon, 
  ArrowLeftIcon,
  CircleEllipsis,
  XIcon,
  UserIcon,
  InfoIcon,
  FileTextIcon,
  CalendarIcon,
  CodeIcon,
  PlusIcon,
  SunIcon,
  MoonIcon,
  Globe,
  ChevronRightIcon,
  MoreHorizontalIcon,
  CornerDownLeftIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  LayoutIcon,
  ChevronDown,
  AlertCircleIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { Header } from "@/components/layout/header";
import Lottie from "react-lottie";
import askAiAnimation from "@/public/askai.json";

export default function SearchResults() {
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute('/search/:query?'); // Optional query parameter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [askAIMode, setAskAIMode] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
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
    if (params?.query) {
      setSearchQuery(decodeURIComponent(params.query));
      setInitialVisit(false);
      // Demo purposes: If query contains "empty" or specific Persian terms, show empty state
      if (params.query.toLowerCase().includes('empty') || 
          params.query.toLowerCase().includes('halate') ||
          params.query.toLowerCase().includes('darnazar')) {
        setHasResults(false);
      } else {
        setHasResults(true);
      }
    } else if (location.includes('search?q=')) {
      const queryParam = new URLSearchParams(location.split('?')[1]).get('q');
      if (queryParam) {
        setSearchQuery(decodeURIComponent(queryParam));
        setInitialVisit(false);
        // Demo purposes: If query contains "empty" or specific Persian terms, show empty state
        if (queryParam.toLowerCase().includes('empty') || 
            queryParam.toLowerCase().includes('halate') ||
            queryParam.toLowerCase().includes('darnazar')) {
          setHasResults(false);
        } else {
          setHasResults(true);
        }
      }
    } else if (location === '/search' || location === '/search/') {
      // User directly visited /search without a query
      setInitialVisit(true);
      setHasResults(true);
    }
  }, [location, params]);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search/${encodeURIComponent(searchQuery.trim())}`);
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
    },
    {
      id: 11,
      title: "Building Trust in Online Communities",
      description: "Trust is the foundation of any successful community. This guide explores strategies for fostering trust among members...",
      category: "Community Building",
      time: "1 year ago",
      icon: "message"
    },
    {
      id: 12,
      title: "User Generated Content Best Practices",
      description: "Learn how to encourage, manage, and highlight valuable user-generated content in your community...",
      category: "Content Strategy",
      time: "9 months ago",
      icon: "docs"
    },
    {
      id: 13,
      title: "Community Metrics That Matter",
      description: "Not all metrics are created equal. This post explores which KPIs truly indicate community health and growth...",
      category: "Analytics",
      time: "5 months ago",
      icon: "docs"
    },
    {
      id: 14,
      title: "Creating a Community Content Calendar",
      description: "Plan your community content effectively with this comprehensive guide to content calendars and scheduling...",
      category: "Content Management",
      time: "7 months ago",
      icon: "docs"
    },
    {
      id: 15,
      title: "Member Onboarding Automation",
      description: "Streamline your member onboarding process with these automation tips and tools...",
      category: "Automation",
      time: "4 months ago",
      icon: "message"
    },
    {
      id: 16,
      title: "Community Guidelines Development",
      description: "Create effective, inclusive community guidelines that foster positive interactions and prevent misconduct...",
      category: "Moderation",
      time: "11 months ago",
      icon: "docs"
    },
    {
      id: 17,
      title: "Encouraging Member Participation",
      description: "Practical strategies to increase engagement and participation rates in your community...",
      category: "Engagement",
      time: "3 months ago",
      icon: "message"
    },
    {
      id: 18,
      title: "Community Technology Stack",
      description: "Building the right tech foundation for your community with complementary tools and platforms...",
      category: "Technology",
      time: "8 months ago",
      icon: "docs"
    },
    {
      id: 19,
      title: "Member Recognition Programs",
      description: "Design effective recognition and rewards systems to motivate and retain your most valuable community members...",
      category: "Retention",
      time: "6 months ago",
      icon: "message"
    },
    {
      id: 20,
      title: "Community Migration Strategies",
      description: "Successfully migrate your community from one platform to another without losing engagement or members...",
      category: "Platform",
      time: "1 year ago",
      icon: "docs"
    },
    {
      id: 21,
      title: "Measuring Community ROI",
      description: "Demonstrate the business value of your community with these ROI calculation methods and metrics...",
      category: "Business",
      time: "5 months ago",
      icon: "docs"
    },
    {
      id: 22,
      title: "Building a Community-Led Growth Strategy",
      description: "Leverage your community as a growth engine for your business with these strategic approaches...",
      category: "Growth",
      time: "7 months ago",
      icon: "message"
    },
    {
      id: 23,
      title: "Community Crisis Management",
      description: "Prepare for and handle community crises effectively with this comprehensive crisis response framework...",
      category: "Management",
      time: "10 months ago",
      icon: "docs"
    },
    {
      id: 24,
      title: "Integrating Community with Customer Support",
      description: "Create synergy between your community and support functions to improve customer experience and reduce costs...",
      category: "Support",
      time: "3 months ago",
      icon: "message"
    },
    {
      id: 25,
      title: "Building an Ambassador Program",
      description: "Design, launch and manage an effective ambassador program to extend your community's reach and impact...",
      category: "Advocacy",
      time: "4 months ago",
      icon: "docs"
    },
    {
      id: 26,
      title: "Community-Based Product Development",
      description: "Involve your community in the product development process to build better features and increase adoption...",
      category: "Product",
      time: "8 months ago",
      icon: "message"
    },
    {
      id: 27,
      title: "Developing a Community Content Strategy",
      description: "Create a content strategy specifically designed to nurture and grow your community...",
      category: "Content",
      time: "6 months ago",
      icon: "docs"
    },
    {
      id: 28,
      title: "Community Governance Models",
      description: "Explore different approaches to community governance and find the right model for your community's needs...",
      category: "Structure",
      time: "11 months ago",
      icon: "docs"
    },
    {
      id: 29,
      title: "Running Effective Community Events",
      description: "Best practices for planning, executing, and following up on community events, both virtual and in-person...",
      category: "Events",
      time: "5 months ago",
      icon: "message"
    },
    {
      id: 30,
      title: "Building Communities of Practice",
      description: "Create specialized communities focused on professional development and knowledge sharing...",
      category: "Professional",
      time: "9 months ago",
      icon: "docs"
    },
    {
      id: 31,
      title: "Community Data Privacy Compliance",
      description: "Navigate the complex landscape of data privacy regulations as they apply to community management...",
      category: "Legal",
      time: "7 months ago", 
      icon: "docs"
    },
    {
      id: 32,
      title: "Scaling Community Operations",
      description: "Strategies for growing your community team and processes as your community expands...",
      category: "Operations",
      time: "4 months ago",
      icon: "message"
    },
    {
      id: 33,
      title: "Community Analytics Dashboards",
      description: "Design effective dashboards to monitor and communicate your community's performance...",
      category: "Analytics",
      time: "6 months ago",
      icon: "docs"
    },
    {
      id: 34,
      title: "Building Internal Communities",
      description: "Apply community-building principles to create effective internal communities for employees...",
      category: "Workplace",
      time: "8 months ago",
      icon: "message"
    },
    {
      id: 35,
      title: "Community Member Segmentation",
      description: "Segment your community members effectively to personalize experiences and messages...",
      category: "Strategy",
      time: "5 months ago",
      icon: "docs"
    }
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
    { id: 8, name: "Events & Meetups", icon: "calendar", members: 290, posts: 42 },
    { id: 9, name: "Feature Requests", icon: "inbox", members: 342, posts: 93 },
    { id: 10, name: "Help & Support", icon: "help-circle", members: 426, posts: 112 }
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
    { id: 8, name: "Olivia Bennett", avatar: "O", role: "Member", joined: "4 months ago" },
    { id: 9, name: "Jamal Wilson", avatar: "J", role: "Moderator", joined: "1 year ago" },
    { id: 10, name: "Emma Rodriguez", avatar: "E", role: "Member", joined: "7 months ago" }
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

  // Render icon based on type
  const renderPostIcon = (iconType: string) => {
    switch (iconType) {
      case 'message':
        return (
          <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
            <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <MessageSquareIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
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

  // Toggle filter dropdown
  const toggleFilterDropdown = () => {
    setShowFilterDropdown(!showFilterDropdown);
    if (showSortDropdown) setShowSortDropdown(false);
  };
  
  // Toggle sort dropdown
  const toggleSortDropdown = () => {
    setShowSortDropdown(!showSortDropdown);
    if (showFilterDropdown) setShowFilterDropdown(false);
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
          variant="secondary-gray" 
          onClick={() => setLocation('/')}
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <div className="bg-black dark:bg-white rounded-full h-8 w-8 flex items-center justify-center mr-1">
                <span className="text-white dark:text-black font-bold">C</span>
              </div>
              <span className="text-black dark:text-white font-bold">community.</span>
            </div>
          </div>
          
          {/* Right side icons */}
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="flag-icon flag-icon-us w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">🇺🇸</span>
            </button>
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoonIcon className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 relative">
              <MessageSquareIcon className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">1</span>
            </button>
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 relative">
              <BellIcon className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">24</span>
            </button>
            <button className="p-2 rounded-full bg-green-500 text-white">
              <PlusIcon className="w-5 h-5" />
            </button>
            <button className="w-8 h-8 rounded-full overflow-hidden">
              <img src="https://github.com/shadcn.png" alt="Profile" className="w-full h-full object-cover" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="mx-auto pb-8">
        {/* Command Menu Style Content */}
        <div className="bg-white space-y-4 dark:bg-gray-900 shadow-lg pt-4 pb-2">
          <div className="max-w-5xl mx-auto flex gap-2">
            {/* Back Button */}
            <button 
              className="w-12 h-12 flex items-center justify-center p-3 rounded-full border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40"
            >
              <ArrowLeftIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
            </button>

            {/* Search Input */}
            <div className="flex-1 p-3 border rounded-full border-gray-200 dark:border-gray-800">
              <div className="flex items-center">
                <SearchIcon className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 bg-transparent border-none outline-none text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 min-w-0"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0 ml-1"
                  >
                    <XIcon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Ask AI Button - Only show if enabled */}
            {siteConfig.aiAssistanceEnabled && (
              <button 
                className="flex items-center p-3 rounded-full border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40"
                onClick={() => setAskAIMode(true)}
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-md overflow-hidden flex-shrink-0">
                  <Lottie
                    options={{
                      loop: true,
                      autoplay: true,
                      animationData: askAiAnimation,
                      rendererSettings: {
                        preserveAspectRatio: "xMidYMid slice"
                      }
                    }}
                    height={20}
                    width={20}
                  />
                </div>
                <span className="text-sm mr-6 font-medium text-gray-900 dark:text-white">Ask AI</span>
                <div className="hidden sm:flex items-center gap-0.5">
                  <kbd className="px-1 h-5 w-5 flex items-center justify-center text-[0.75rem] font-medium rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400">⌘</kbd>
                  <kbd className="px-1 h-5 w-5 flex items-center justify-center text-[0.7rem] font-medium rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400">J</kbd>
                </div>
              </button>
            )}
          </div>
          
          {/* Results Header with Tabs - Only show if not initial visit */}
          {!initialVisit && (
            <div className="max-w-5xl mx-auto">
              {/* Tabs and Filter Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                {/* Tabs - Only show tabs for enabled search types */}
                <div className="flex space-x-0.5 overflow-x-auto">
                  {/* Only show 'All' tab if multiple search types are enabled */}
                  {(Object.values(siteConfig.enabledSearchTypes).filter(Boolean).length > 1) && (
                    <button 
                      className={`px-4 py-2 text-sm rounded-full transition-colors ${selectedFilter === 'all' 
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
                      className={`px-4 py-2 text-sm rounded-full transition-colors ${selectedFilter === 'posts' 
                        ? 'bg-gray-100 dark:bg-gray-800/80 text-gray-900 dark:text-white' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                      onClick={() => setSelectedFilter('posts')}
                    >
                      Posts
                    </button>
                  )}
                  
                  {/* Only show Spaces tab if enabled */}
                  {siteConfig.enabledSearchTypes.spaces && (
                    <button 
                      className={`px-4 py-2 text-sm rounded-full transition-colors ${selectedFilter === 'spaces' 
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
                      className={`px-4 py-2 text-sm rounded-full transition-colors ${selectedFilter === 'members' 
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
        <div className="space-y-4 mt-6 max-w-5xl mx-auto">
          {/* Posts Filters - Only show when Posts tab is selected and has results */}
          {selectedFilter === 'posts' && hasResults && !initialVisit && (
            <div className="flex flex-wrap items-center gap-2 px-2 mb-2">
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
            <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
              <InitialVisitState />
            </div>
          ) : !hasResults ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800">
              <EmptyState />
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
} 