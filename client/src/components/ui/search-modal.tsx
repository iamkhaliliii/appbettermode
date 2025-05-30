import React, { useState, useRef, useEffect } from "react";
import { 
  SearchIcon, 
  XIcon, 
  ArrowLeftIcon, 
  CornerDownLeftIcon, 
  ChevronRightIcon, 
  ArrowUpIcon, 
  ArrowDownIcon, 
  MessageSquareIcon, 
  UserIcon, 
  BellIcon, 
  WrenchIcon, 
  MoreHorizontalIcon, 
  Shield, 
  Earth, 
  GlobeIcon, 
  LayoutIcon,
  BookOpenIcon,
  ExternalLinkIcon,
  ShieldCheck 
} from "lucide-react";
import Lottie from "react-lottie";
import askAiAnimation from "@/public/askai.json";
import { useLocation } from "wouter";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  siteSD?: string;
}

export function SearchModal({ isOpen, onClose, searchQuery: externalSearchQuery, onSearchQueryChange, siteSD }: SearchModalProps) {
  const [location, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery || "");
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const commandMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // New state for sources accordion in Ask AI view
  const [sourcesExpanded, setSourcesExpanded] = useState(false);

  // New state for command menu mode and AI response
  const [commandMenuMode, setCommandMenuMode] = useState<'initial' | 'searching' | 'ask_ai' | 'empty'>('initial');
  const [askAiResponse, setAskAiResponse] = useState("");
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // New state for tracking scroll position of recent searches
  const [recentSearchesScrolled, setRecentSearchesScrolled] = useState(false);

  // Sample post search results
  const postResults = [
    {
      title: "Accepting payments",
      description: "how can i accept payments with bettermode?",
      category: "Ask the Community",
      time: "7 months ago",
      icon: "message"
    },
    {
      title: "Customer Support Metrics: Top 14 for High...",
      description: "Can you estimate the percentage of customers who don't ...",
      category: "Articles",
      time: "2 years ago",
      icon: "docs"
    },
    {
      title: "Make a \"Following\" feed",
      description: "We already are able to 'Follow' people (The bell icon on a...",
      category: "Wishlist",
      time: "6 months ago",
      icon: "bell"
    }
  ];
  
  // Sample official resources
  const officialResourcesResults = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of setting up your community and configuring essential features",
      category: "Documentation",
      time: "1 month ago",
      icon: "docs",
      type: "internal"
    },
    {
      title: "Community Best Practices",
      description: "Proven strategies and tips for growing and managing successful online communities",
      category: "Guides",
      time: "3 weeks ago",
      icon: "docs",
      type: "internal"
    },
    {
      title: "API Documentation",
      description: "Complete reference for integrating with our API endpoints and webhooks",
      category: "Developer Docs",
      time: "2 weeks ago",
      icon: "code",
      type: "external"
    }
  ];
  
  // Sample member search results
  const memberResults = [
    { name: "adellhowe", avatar: "A" },
    { name: "Amin Ebrahimi", avatar: "A" },
    { name: "Diego Fonseca", avatar: "D" }
  ];
  
  // CSS for hiding scrollbars
  const scrollbarHideStyle = `
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `;
  
  // Updated search results with IDs for removal functionality
  const [recentSearches, setRecentSearches] = useState([
    { id: 1, text: "login method", onClick: () => setSearchQuery("login method") },
    { id: 2, text: "header and sidebar", onClick: () => setSearchQuery("header and sidebar") },
    { id: 3, text: "sidebar", onClick: () => setSearchQuery("sidebar") },
    { id: 4, text: "custom domain", onClick: () => setSearchQuery("custom domain") },
    { id: 5, text: "SSO integration", onClick: () => setSearchQuery("SSO integration") },
    { id: 6, text: "API access", onClick: () => setSearchQuery("API access") },
    { id: 7, text: "moderation settings", onClick: () => setSearchQuery("moderation settings") }
  ]);
  
  // Function to remove a search item
  const removeSearchItem = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(recentSearches.filter(item => item.id !== id));
  };
  
  // Updated trending posts with 5 items and better icons
  const trendingPosts = [
    { 
      title: "New Search Only Returning Old Results", 
      description: "We're noticing that the new search is returning older...",
      category: "Ask the Community",
      time: "a month ago",
      icon: "message"
    },
    { 
      title: "No mobile support for Editor/Customizer yet", 
      description: "I would like to express my concern regarding the lack of...",
      category: "Ask the Community",
      time: "13 days ago",
      icon: "message"
    },
    { 
      title: "Turn it into an app or offer notification plugin", 
      description: "I would love if bettermode could be turned into an app or...",
      category: "Wishlist",
      time: "13 days ago",
      icon: "bell"
    },
    { 
      title: "Update: Appears to be resolved as of 4/15", 
      description: "Adding this post to call out this issue and give a place to...",
      category: "Wishlist",
      time: "a month ago",
      icon: "bell"
    },
    { 
      title: "White-label social login options", 
      description: "Currently, the social login options (SSO) display the...",
      category: "Ask the Community",
      time: "15 days ago",
      icon: "user"
    }
  ];

  // Function to trigger Ask AI mode
  const triggerAskAi = () => {
    const aiQuery = searchQuery || "general information";
    
    const fullResponse = `Creating a post on Bettermode Community is a fantastic way to share your ideas, ask questions, or provide valuable information to your community members. Here's a positive and straightforward way to make a post:

**Navigate to the Composer:**

• Go to the space where you want to create a post.
• Click on the composer block to start creating a new post.

**Add a Post Title:**

• Give your post a clear and engaging title that summarizes the content.

**Add Body Text:**

• Write the main content of your post. 
• You can customize it with tags, emojis, images, and files to make it more engaging.

**Customize Your Post:**

• Use the formatting options to add tags, emojis, and other elements to enhance your post.
• Attach or embed images and files to support your content.

**Publish Your Post:**

• Once you're satisfied with your post, click on Publish to make it live for your community members.
Remember, Bettermode Community offers a variety of tools to help you create and manage your posts effectively. Whether you're looking to start a discussion, share information, or ask a question, the platform provides the flexibility and features you need to make your posts impactful.

Happy posting!`;

    setAskAiResponse(fullResponse);
    setDisplayedResponse("");
    setIsTyping(true);
    setCommandMenuMode('ask_ai');
  };

  // Update search input onChange
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearchQueryChange) {
      onSearchQueryChange(query);
    }
    if (commandMenuMode !== 'ask_ai') {
       setCommandMenuMode(query ? 'searching' : 'initial');
    }
  };

  // Function to render post icon based on icon type
  const renderPostIcon = (iconType: string) => {
    switch (iconType) {
      case 'message':
        return <MessageSquareIcon className="w-4 h-4 text-blue-500" />;
      case 'user':
        return <UserIcon className="w-4 h-4 text-violet-500" />;
      case 'bell':
        return <BellIcon className="w-4 h-4 text-amber-500" />;
      case 'docs':
        return <BookOpenIcon className="w-4 h-4 text-emerald-500" />;
      default:
        return <WrenchIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  // Function to check scroll position and update state
  const handleRecentSearchesScroll = () => {
    const container = document.getElementById('recent-searches-container');
    if (container) {
      setRecentSearchesScrolled(container.scrollLeft > 10);
    }
  };

  // Sync external search query
  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  // Reset selected item index when search query or mode changes
  useEffect(() => {
     if (commandMenuMode === 'searching') {
       setSelectedItemIndex(1); 
     } else if (commandMenuMode === 'initial') {
       if (trendingPosts.length > 0) {
           setSelectedItemIndex(1);
       } else {
           setSelectedItemIndex(0);
       }
     } else {
       setSelectedItemIndex(-1);
     }
  }, [searchQuery, commandMenuMode, trendingPosts.length]);

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;
      
      if (commandMenuMode === 'ask_ai') {
           if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === "Tab") {
              e.preventDefault();
           }
           return;
      }
      
      let totalItems = 0;
      if (commandMenuMode === 'searching') {
        const askAI = 1;
        const numPosts = postResults.length;
        const morePostsButton = 1;
        const numOfficialResources = officialResourcesResults.length;
        const moreOfficialResourcesButton = 1;
        const numSpaces = 3;
        const moreSpacesButton = 1;
        const numMembers = memberResults.length;
        const moreMembersButton = 1;
        totalItems = askAI + numPosts + morePostsButton + numOfficialResources + moreOfficialResourcesButton + numSpaces + moreSpacesButton + numMembers + moreMembersButton;
      } else if (commandMenuMode === 'initial') {
        totalItems = 1 + trendingPosts.length; 
      }
      
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedItemIndex(prev => (prev + 1) % totalItems);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedItemIndex(prev => (prev <= 0 ? totalItems - 1 : prev - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedItemIndex >= 0) {
             if (selectedItemIndex === 0) {
                 triggerAskAi();
             } else if (commandMenuMode === 'searching') {
                  console.log(`Handle Enter on searching item: index ${selectedItemIndex}`);
             } else {
                 const postIndex = selectedItemIndex - 1; 
                 if (postIndex >= 0 && postIndex < trendingPosts.length) {
                   console.log(`Selected trending post: ${trendingPosts[postIndex].title}`);
                 }
             }
          }
          break;
      }
    }
    
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, selectedItemIndex, commandMenuMode, searchQuery, postResults.length, officialResourcesResults.length, memberResults.length, trendingPosts.length]);

  // Scroll selected item into view
  useEffect(() => {
    if (!isOpen || selectedItemIndex < 0 || !scrollContainerRef.current) return;

    const selectedElement = scrollContainerRef.current.querySelector(`[data-selectable-index="${selectedItemIndex}"]`);
    
    if (selectedElement) {
      selectedElement.scrollIntoView({
        block: 'nearest',
        behavior: 'auto'
      });
    }
  }, [selectedItemIndex, isOpen]);

  // Handle clicking outside to close the menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (commandMenuRef.current && !commandMenuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        if (commandMenuMode === 'ask_ai') {
           if (displayedResponse) {
             setIsTyping(false);
             setDisplayedResponse("");
             setAskAiResponse("");
           } else {
             setCommandMenuMode(searchQuery ? 'searching' : 'initial'); 
           }
        } else if (commandMenuMode === 'empty') {
          setCommandMenuMode('initial');
        } else if (searchQuery) {
          setSearchQuery("");
          setCommandMenuMode('initial');
        } else {
          onClose();
        }
      }

      if (e.key === 'Tab' && isOpen && commandMenuMode === 'initial' && selectedItemIndex === 0) {
        e.preventDefault();
        triggerAskAi();
      }
    }
    
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, searchQuery, commandMenuMode, selectedItemIndex, onClose]); 

  // Typing effect for AI response
  useEffect(() => {
    if (isTyping && commandMenuMode === 'ask_ai') {
      if (displayedResponse.length < askAiResponse.length) {
        const timer = setTimeout(() => {
          setDisplayedResponse(askAiResponse.substring(0, displayedResponse.length + 3));
        }, 1);
        return () => clearTimeout(timer);
      } else {
        setIsTyping(false);
      }
    }
  }, [displayedResponse, askAiResponse, isTyping, commandMenuMode]);

  // Add scroll event listener for recent searches container
  useEffect(() => {
    const container = document.getElementById('recent-searches-container');
    if (container) {
      container.addEventListener('scroll', handleRecentSearchesScroll);
      return () => {
        container.removeEventListener('scroll', handleRecentSearchesScroll);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollbarHideStyle }} />
      <div 
        ref={commandMenuRef}
        className="fixed inset-0 bg-black/10 dark:bg-black/30 flex items-start justify-center z-50 pt-[10vh]"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="w-full max-w-[800px] bg-white dark:bg-gray-900 shadow-lg rounded-lg overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800 h-[70vh]">
          {/* Search Input Area */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center">
              {commandMenuMode === 'ask_ai' ? (
                <button
                  onClick={() => {
                    setIsTyping(false);
                    setCommandMenuMode(searchQuery ? 'searching' : 'initial');
                  }}
                  className="p-1 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="Back to search"
                >
                  <ArrowLeftIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              ) : (
                <SearchIcon className="w-4 h-4 text-gray-400 mr-3" />
              )}
              <input
                ref={searchInputRef}
                type="text"
                placeholder={
                  commandMenuMode === 'ask_ai' 
                    ? `Asking AI about \"${searchQuery || 'general information'}\"...` 
                    : commandMenuMode === 'empty'
                      ? "Type a keyword to search settings"
                      : "Search or ask a question..."
                }
                className="flex-1 bg-transparent border-none outline-none text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={searchQuery}
                onChange={handleSearchChange}
                disabled={commandMenuMode === 'ask_ai'}
                autoFocus={commandMenuMode === 'empty'}
              />
              {searchQuery && commandMenuMode !== 'ask_ai' && (
                <button
                  onClick={() => {
                      setSearchQuery("");
                      setCommandMenuMode('initial');
                  }}
                  className="p-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <XIcon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                </button>
              )}
            </div>
          </div>
          
          {/* Modal Content - will be added in next part */}
          <div ref={scrollContainerRef} className="overflow-y-auto max-h-[70vh] flex-1">
            {commandMenuMode === 'empty' ? (
              // Empty State View
              <div className="flex flex-col h-full">
                {/* Ask AI Item */}
                <div className="py-2 px-3 border-b border-gray-100 dark:border-gray-800">
                  <div 
                    className="flex items-center justify-between py-2 px-3 rounded-md transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 text-violet-600 dark:text-violet-400"
                    onClick={triggerAskAi}
                  >
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 mr-1 rounded-md overflow-hidden">
                        <Lottie
                          options={{
                            loop: true,
                            autoplay: true,
                            animationData: askAiAnimation,
                            rendererSettings: {
                              preserveAspectRatio: "xMidYMid slice"
                            }
                          }}
                          height={30}
                          width={30}
                        />
                      </div>
                      <h5 className="text-[0.8rem] font-medium text-gray-900 dark:text-white leading-tight truncate">Ask AI about anything</h5>
                    </div>
                    <kbd className="ml-2 inline-flex items-center gap-0.5">
                      <kbd className="px-1 h-5 w-5 flex items-center justify-center py-0.5 text-[1rem] font-medium rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400">⌘</kbd>
                      <kbd className="px-1 h-5 w-5 flex items-center justify-center py-0.5 text-[0.7rem] font-medium rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400">J</kbd>
                    </kbd>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center flex-1 py-12 px-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <SearchIcon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">How can I help?</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    Type a keyword to find what you need
                  </p>
                </div>
              </div>
            ) : commandMenuMode === 'ask_ai' ? (
              // Ask AI View
              <div className="p-4 text-sm text-gray-800 dark:text-gray-200 flex flex-col h-full">
                {/* AI Response */}
                <div className="flex-1">
                  <div className="flex items-center mb-5 space-x-1">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center relative">
                      <Lottie
                        options={{
                          loop: true,
                          autoplay: true,
                          animationData: askAiAnimation,
                          rendererSettings: {
                            preserveAspectRatio: "xMidYMid slice"
                          }
                        }}
                        height={30}
                        width={30}
                      />
                    </div>
                    <h4 className="text-[0.9rem] font-medium text-gray-800 dark:text-gray-200">AI Assistant:</h4>
                  </div>
                  
                  <div className="pl-6 relative pr-2">
                    <div className="absolute left-1 top-2 bottom-2 w-[2px] bg-gradient-to-b from-violet-100 via-violet-200/40 to-violet-100/20 dark:from-violet-800/20 dark:via-violet-700/10 dark:to-violet-800/5 rounded-full"></div>
                    <div className="text-[0.9rem]/[1.4] text-gray-700 dark:text-gray-200">
                      <div 
                        className="whitespace-pre-wrap" 
                        dangerouslySetInnerHTML={{ 
                          __html: displayedResponse
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/^• (.*)$/gm, '<ul><li>$1</li></ul>')
                            .replace(/<\/ul>\s*<ul>/g, '')
                            .replace(/\n\n/g, '</p><p>')
                            .replace(/^(.+)$/m, '<p>$1</p>')
                        }}
                      />
                      {isTyping && <span className="typing-cursor inline-block w-1.5 h-3.5 bg-violet-500 ml-1"></span>}
                    </div>
                  </div>
                </div>
                
                {/* Sources section */}
                {!isTyping && displayedResponse && ( 
                   <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800"> 
                      <button 
                        onClick={() => setSourcesExpanded(prev => !prev)}
                        className="flex items-center justify-between w-full text-left py-1 px-1 -mx-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                      >
                        <div className="flex items-center">
                          <span className="ml-3 text-xs text-gray-500 dark:text-gray-400">
                            Searched 5 posts and 3 spaces
                          </span>
                          <div className="flex items-center ml-1 group">
                            <div className="flex -space-x-2 relative transform transition-transform group-hover:translate-x-0.5">
                              <div className="h-7 w-7 rounded-full border-2 border-white dark:border-gray-800 bg-violet-500 flex items-center justify-center relative z-0 shadow-sm">
                                  <Shield className="h-3.5 w-3.5 text-white dark:text-white" />
                              </div>
                              <div className="h-7 w-7 rounded-full border-2 border-white dark:border-gray-800 bg-blue-500 flex items-center justify-center relative z-10 shadow-sm">
                                <MessageSquareIcon className="h-3.5 w-3.5 text-white dark:text-white" />
                              </div>
                              <div className="h-7 w-7 rounded-full border-2 border-white dark:border-gray-800 bg-green-500 flex items-center justify-center relative z-20 shadow-sm">
                                <Earth className="h-3.5 w-3.5 text-white dark:text-white" />
                              </div>
                              <div className="h-7 w-7 text-[0.8rem] font-medium rounded-full border border-white dark:border-gray-800 bg-gray-200/80 text-gray-600 dark:text-gray-400 flex items-center justify-center relative z-30 shadow-sm">
                                +2
                              </div>
                            </div>
                          </div>
                        </div>
                        <ChevronRightIcon 
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${sourcesExpanded ? 'rotate-90' : ''}`}
                        />
                      </button>
                      
                      {sourcesExpanded && (
                        <div className="mt-3 overflow-hidden">
                          <div className="px-3 pt-3 pb-[0.4rem] border-b border-gray-100 dark:border-gray-800">
                            <h3 className="text-[0.75rem] font-medium text-gray-500 dark:text-gray-300 mb-1">Posts</h3>
                            <div className="space-y-1">
                              {postResults.slice(0, 3).map((post, index) => (
                                <div 
                                  key={index}
                                  className="flex space-x-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/40 cursor-pointer transition-colors"
                                >
                                  <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
                                    <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                      <MessageSquareIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-[0.7rem] font-medium text-gray-900 dark:text-white leading-tight truncate">{post.title}</h5>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{post.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                   </div>
                )}
                
                <div className="mt-auto pb-4 pt-4">
                  <p className="text-xs text-gray-400 dark:text-gray-500 italic border-t border-gray-100 dark:border-gray-800/30 pt-3 opacity-80 transition-opacity hover:opacity-100">
                    AI responses may contain errors. Your data stays private and isn't shared with third-party AI models.
                  </p>
                </div>
              </div>
            ) : commandMenuMode === 'searching' ? (
              // Search Results View
              <>
                {/* Ask AI Item */}
                <div className="py-1 px-3 border-b border-gray-100 dark:border-gray-800">
                  <div 
                    data-selectable-index={0} 
                    className={`flex items-center justify-between py-2 px-3 rounded-md transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 text-violet-600 dark:text-violet-400 ${ 
                      selectedItemIndex === 0 ? 'bg-gray-100 dark:bg-gray-800' : ''
                    }`}
                    onClick={triggerAskAi}
                  >
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 mr-1 rounded-md overflow-hidden">
                        <Lottie
                          options={{
                            loop: true,
                            autoplay: true,
                            animationData: askAiAnimation,
                            rendererSettings: {
                              preserveAspectRatio: "xMidYMid slice"
                            }
                          }}
                          height={30}
                          width={30}
                        />
                      </div>
                      <h5 className="text-[0.8rem] font-medium text-gray-900 dark:text-white leading-tight truncate">Ask AI about "{searchQuery}"</h5>
                    </div>
                    {selectedItemIndex === 0 ? (
                      <kbd className="ml-2 px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 inline-flex items-center gap-1">
                        <CornerDownLeftIcon className="w-3 h-3" />
                      </kbd>
                    ) : (
                      <kbd className="ml-2 inline-flex items-center gap-0.5">
                        <kbd className="px-1 h-5 w-5 flex items-center justify-center py-0.5 text-[1rem] font-medium rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400">⌘</kbd>
                        <kbd className="px-1 h-5 w-5 flex items-center justify-center py-0.5 text-[0.7rem] font-medium rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400">J</kbd>
                      </kbd>
                    )}
                  </div>
                </div>
                
                {/* Posts Section */}
                <div className="px-3 pt-3 pb-[0.4rem] border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-[0.75rem] font-medium text-gray-500 dark:text-gray-300 mb-1">Posts</h3>
                  <div className="space-y-1">
                    {postResults.map((post, index) => (
                      <div 
                        key={index}
                        data-selectable-index={index + 1}
                        className={`flex space-x-3 p-2 rounded-md cursor-pointer ${
                          selectedItemIndex === index + 1 
                          ? 'bg-gray-100 dark:bg-gray-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
                        }`}
                      >
                        <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
                          <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            {renderPostIcon(post.icon)}
                          </div>
                        </div>
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
                             <kbd className={`px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === index + 1 ? 'inline-flex' : 'hidden'}`}> 
                               <CornerDownLeftIcon className="w-3 h-3" />
                             </kbd>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    data-selectable-index={postResults.length + 1}
                    className={`w-full mt-0 mb-0 text-left text-[0.75rem] text-green-600 dark:text-green-400 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded flex items-center justify-between ${
                      selectedItemIndex === postResults.length + 1
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : ''
                    }`}
                    onClick={() => {
                      onClose();
                      setLocation(siteSD ? `/site/${siteSD}/search?q=${encodeURIComponent(searchQuery)}` : `/search/${encodeURIComponent(searchQuery)}`);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-1.5 rounded-md flex items-center justify-center flex-shrink-0">
                        <MoreHorizontalIcon className="w-4 h-4 text-green-500 dark:text-green-400" /> 
                      </div>
                      <span>More post results about "{searchQuery}"</span>
                      <ChevronRightIcon className="w-3 h-3 ml-1" />
                    </div>
                    <kbd className={`ml-auto flex-shrink-0 px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === postResults.length + 1 ? 'inline-flex' : 'hidden'}`}> 
                      <CornerDownLeftIcon className="w-3 h-3" />
                    </kbd>
                  </button>
                </div>
                  
                {/* Official Resources Section */}
                <div className="px-3 pt-3 pb-[0.4rem] border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-[0.75rem] font-medium text-gray-500 dark:text-gray-300 mb-1">Official Resources</h3>
                  <div className="space-y-1">
                    {officialResourcesResults.map((resource, index) => (
                      <div 
                        key={index}
                        data-selectable-index={index + postResults.length + 2}
                        className={`flex space-x-3 p-2 rounded-md cursor-pointer ${
                          selectedItemIndex === index + postResults.length + 2 
                          ? 'bg-gray-100 dark:bg-gray-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
                        }`}
                      >
                        <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
                          <div className="w-full h-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            {renderPostIcon(resource.icon)}
                          </div>
                        </div>
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
                             <kbd className={`px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === index + postResults.length + 2 ? 'inline-flex' : 'hidden'}`}> 
                               <CornerDownLeftIcon className="w-3 h-3" />
                             </kbd>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button 
                    data-selectable-index={postResults.length + officialResourcesResults.length + 2}
                    className={`w-full mt-0 mb-0 text-left text-[0.75rem] text-green-600 dark:text-green-400 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded flex items-center justify-between ${
                      selectedItemIndex === postResults.length + officialResourcesResults.length + 2
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : ''
                    }`}
                    onClick={() => {
                      onClose();
                      setLocation(siteSD ? `/site/${siteSD}/search?q=${encodeURIComponent(searchQuery)}&type=officialResources` : `/search/${encodeURIComponent(searchQuery)}?type=officialResources`);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-1.5 rounded-md flex items-center justify-center flex-shrink-0">
                        <MoreHorizontalIcon className="w-4 h-4 text-green-500 dark:text-green-400" /> 
                      </div>
                      <span>More official resources about "{searchQuery}"</span>
                      <ChevronRightIcon className="w-3 h-3 ml-1" />
                    </div>
                    <kbd className={`ml-auto flex-shrink-0 px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === postResults.length + officialResourcesResults.length + 2 ? 'inline-flex' : 'hidden'}`}> 
                      <CornerDownLeftIcon className="w-3 h-3" />
                    </kbd>
                  </button>
                </div>

                {/* Spaces Section */}
                <div className="px-3 pt-3 pb-[0.4rem] border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-[0.75rem] font-medium text-gray-500 dark:text-gray-300 mb-1">Spaces</h3>
                  <div className="space-y-0">
                    <div 
                      data-selectable-index={postResults.length + officialResourcesResults.length + 3}
                      className={`flex items-center justify-between space-x-3 p-2 rounded-md cursor-pointer ${
                        selectedItemIndex === postResults.length + officialResourcesResults.length + 3
                        ? 'bg-gray-100 dark:bg-gray-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
                      }`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
                          <div className="w-full h-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <BellIcon className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                          </div>
                        </div>
                        <span className="text-[0.8rem] text-gray-900 dark:text-white">Community Spaces</span>
                      </div>
                      <kbd className={`ml-auto flex-shrink-0 px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === postResults.length + officialResourcesResults.length + 3 ? 'inline-flex' : 'hidden'}`}> 
                        <CornerDownLeftIcon className="w-3 h-3" />
                      </kbd>
                    </div>
                    <div 
                      data-selectable-index={postResults.length + officialResourcesResults.length + 4}
                      className={`flex items-center justify-between space-x-3 p-2 rounded-md cursor-pointer ${
                        selectedItemIndex === postResults.length + officialResourcesResults.length + 4
                        ? 'bg-gray-100 dark:bg-gray-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
                      }`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
                          <div className="w-full h-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <LayoutIcon className="w-4 h-4 text-green-500 dark:text-green-400" />
                          </div>
                        </div>
                        <span className="text-[0.8rem] text-gray-900 dark:text-white">Product Updates</span>
                      </div>
                      <kbd className={`ml-auto flex-shrink-0 px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === postResults.length + officialResourcesResults.length + 4 ? 'inline-flex' : 'hidden'}`}> 
                        <CornerDownLeftIcon className="w-3 h-3" />
                      </kbd>
                    </div>
                    <div 
                      data-selectable-index={postResults.length + officialResourcesResults.length + 5}
                      className={`flex items-center justify-between space-x-3 p-2 rounded-md cursor-pointer ${
                        selectedItemIndex === postResults.length + officialResourcesResults.length + 5
                        ? 'bg-gray-100 dark:bg-gray-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
                      }`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
                          <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <GlobeIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          </div>
                        </div>
                        <span className="text-[0.8rem] text-gray-900 dark:text-white">General Discussion</span>
                      </div>
                      <kbd className={`ml-auto flex-shrink-0 px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === postResults.length + officialResourcesResults.length + 5 ? 'inline-flex' : 'hidden'}`}> 
                        <CornerDownLeftIcon className="w-3 h-3" />
                      </kbd>
                    </div>
                  </div>
                  
                  <button 
                    data-selectable-index={postResults.length + officialResourcesResults.length + 6}
                    className={`w-full mt-0 mb-0 text-left text-[0.75rem] text-green-600 dark:text-green-400 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded flex items-center justify-between ${
                      selectedItemIndex === postResults.length + officialResourcesResults.length + 6
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : ''
                    }`}
                    onClick={() => {
                      onClose();
                      setLocation(siteSD ? `/site/${siteSD}/search?q=${encodeURIComponent(searchQuery)}&type=spaces` : `/search/${encodeURIComponent(searchQuery)}?type=spaces`);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-1.5 rounded-md flex items-center justify-center flex-shrink-0">
                        <MoreHorizontalIcon className="w-4 h-4 text-green-500 dark:text-green-400" /> 
                      </div>
                      <span>More space results about "{searchQuery}"</span>
                      <ChevronRightIcon className="w-3 h-3 ml-1" />
                    </div>
                    <kbd className={`ml-auto flex-shrink-0 px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === postResults.length + officialResourcesResults.length + 6 ? 'inline-flex' : 'hidden'}`}> 
                      <CornerDownLeftIcon className="w-3 h-3" />
                    </kbd>
                  </button>
                </div>
                
                {/* Members Section */}
                <div className="px-3 pt-3 pb-[0.4rem] border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-[0.75rem] font-medium text-gray-500 dark:text-gray-300 mb-1">Members</h3>
                  <div className="space-y-0">
                    {memberResults.map((member, index) => (
                      <div 
                        key={index}
                        data-selectable-index={index + postResults.length + officialResourcesResults.length + 7}
                        className={`flex items-center justify-between space-x-3 p-2 rounded-md cursor-pointer ${
                          selectedItemIndex === index + postResults.length + officialResourcesResults.length + 7
                          ? 'bg-gray-100 dark:bg-gray-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
                        }`}>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
                              {member.avatar}
                            </div>
                            <span className="text-[0.8rem] text-gray-900 dark:text-white">{member.name}</span>
                          </div>
                          <kbd className={`ml-auto flex-shrink-0 px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === index + postResults.length + officialResourcesResults.length + 7 ? 'inline-flex' : 'hidden'}`}> 
                            <CornerDownLeftIcon className="w-3 h-3" />
                          </kbd>
                        </div>
                      ))}
                  </div>
                  
                  <button 
                    data-selectable-index={postResults.length + officialResourcesResults.length + memberResults.length + 7}
                    className={`w-full mt-0 mb-0 text-left text-[0.75rem] text-green-600 dark:text-green-400 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded flex items-center justify-between ${
                      selectedItemIndex === postResults.length + officialResourcesResults.length + memberResults.length + 7
                      ? 'bg-gray-100 dark:bg-gray-800'
                      : ''
                    }`}
                    onClick={() => {
                      onClose();
                      setLocation(siteSD ? `/site/${siteSD}/search?q=${encodeURIComponent(searchQuery)}&type=members` : `/search/${encodeURIComponent(searchQuery)}?type=members`);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 mr-1.5 rounded-md flex items-center justify-center flex-shrink-0">
                        <MoreHorizontalIcon className="w-4 h-4 text-green-500 dark:text-green-400" /> 
                      </div>
                      <span>More member results about "{searchQuery}"</span>
                      <ChevronRightIcon className="w-3 h-3 ml-1" />
                    </div>
                    <kbd className={`ml-auto flex-shrink-0 px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === postResults.length + officialResourcesResults.length + memberResults.length + 7 ? 'inline-flex' : 'hidden'}`}> 
                      <CornerDownLeftIcon className="w-3 h-3" />
                    </kbd>
                  </button>
                </div>
              </>
            ) : ( 
              // Initial View
              <>
                {/* Ask AI Item */}
                <div className="py-1 px-3 border-b border-gray-100 dark:border-gray-800">
                  <div 
                    data-selectable-index={0} 
                    className={`flex items-center justify-between py-2 px-3 rounded-md transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40 text-violet-600 dark:text-violet-400 ${ 
                      selectedItemIndex === 0 ? 'bg-gray-100 dark:bg-gray-800' : ''
                    }`}
                    onClick={triggerAskAi}
                  >
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 mr-1 rounded-md overflow-hidden">
                        <Lottie
                          options={{
                            loop: true,
                            autoplay: true,
                            animationData: askAiAnimation,
                            rendererSettings: {
                              preserveAspectRatio: "xMidYMid slice"
                            }
                          }}
                          height={30}
                          width={30}
                        />
                      </div>
                      <h5 className="text-[0.8rem] font-medium text-gray-900 dark:text-white leading-tight truncate">Ask AI about anything</h5>
                    </div>
                    {selectedItemIndex === 0 ? (
                      <kbd className="ml-2 px-1.5 h-5 flex items-center justify-center py-0.5 text-[0.65rem] font-medium rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400">
                        tab
                      </kbd>
                    ) : (
                      <kbd className="ml-2 inline-flex items-center gap-0.5">
                        <kbd className="px-1 h-5 w-5 flex items-center justify-center py-0.5 text-[1rem] font-medium rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400">⌘</kbd>
                        <kbd className="px-1 h-5 w-5 flex items-center justify-center py-0.5 text-[0.7rem] font-medium rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400">J</kbd>
                      </kbd>
                    )}
                  </div>
                </div>
                
                {/* Recent Searches Section */}
                <div className="px-3 pt-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-[0.75rem] font-medium text-gray-500 dark:text-gray-300 mb-2">Recent Searches</h3>
                  
                  <div className="relative">
                    <div className={`absolute left-0 top-0 bottom-0 z-10 flex items-center transition-opacity duration-200 ${recentSearchesScrolled ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="h-full w-32 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
                      <button 
                        className="absolute left-1 p-1 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                        onClick={() => {
                          const container = document.getElementById('recent-searches-container');
                          if (container) {
                            container.scrollBy({ left: -200, behavior: 'smooth' });
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                      </button>
                    </div>
                    
                    <div 
                      id="recent-searches-container"
                      className="flex overflow-x-auto scrollbar-hide pr-6 pl-2 py-1 space-x-2"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {recentSearches.length > 0 ? (
                        recentSearches.map((item) => (
                          <div 
                            key={item.id}
                            onClick={item.onClick}
                            className="inline-flex items-center flex-shrink-0 h-7 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors text-xs group"
                          >
                            <SearchIcon className="w-3 h-3 text-gray-500 dark:text-gray-400 mr-1.5" />
                            <span>{item.text}</span>
                            <button 
                              onClick={(e) => removeSearchItem(item.id, e)}
                              className="ml-1.5 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 p-0.5 transition-colors opacity-70 group-hover:opacity-100"
                            >
                              <XIcon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-gray-500 dark:text-gray-400 italic py-1">No recent searches</div>
                      )}
                    </div>
                    
                    <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center">
                      <div className="h-full w-32 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
                      <button 
                        className="absolute right-1 p-1 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                        onClick={() => {
                          const container = document.getElementById('recent-searches-container');
                          if (container) {
                            container.scrollBy({ left: 200, behavior: 'smooth' });
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Trending Posts Section */}
                <div className="px-3 pt-3 pb-[0.4rem]">
                  <h3 className="text-[0.75rem] font-medium text-gray-500 dark:text-gray-300 mb-1">Trending Posts</h3>
                  <div className="space-y-1">
                    {trendingPosts.map((post, index) => (
                      <div 
                        key={index}
                        data-selectable-index={index + 1}
                        className={`flex space-x-3 p-2 rounded-md cursor-pointer ${
                          selectedItemIndex === index + 1 
                          ? 'bg-gray-100 dark:bg-gray-800'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
                        }`}
                      >
                        <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
                          <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            {renderPostIcon(post.icon)}
                          </div>
                        </div>
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
                             <kbd className={`px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === index + 1 ? 'inline-flex' : 'hidden'}`}> 
                               <CornerDownLeftIcon className="w-3 h-3" />
                             </kbd>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Footer Navigation */}
          <div className="py-2 px-3 border-t border-gray-100 dark:border-gray-800 bg-gray-100/50 dark:bg-gray-800/50 flex items-center">
            <div className="flex items-center gap-4 text-[11px] text-gray-500/90 dark:text-gray-400/90">
              {commandMenuMode !== 'empty' && (
                <>
                  <div className="flex items-center gap-1.5">
                    <div className="inline-flex items-center gap-0.5"> 
                      <kbd className="px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400">
                        <ArrowUpIcon className="h-3 w-3" />
                      </kbd>
                      <kbd className="px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400">
                        <ArrowDownIcon className="h-3 w-3" />
                      </kbd>
                    </div>
                    <span>navigate</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400">
                      <CornerDownLeftIcon className="h-3 w-3" />
                    </kbd>
                    <span>select</span>
                  </div>
                </>
              )}
              
              <div className="flex items-center gap-1.5">
                <div className="inline-flex items-center gap-0.5"> 
                  <kbd className="px-1 h-5 w-5 flex items-center justify-center py-0.5 text-[1rem] font-medium rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400">⌘</kbd>
                  <kbd className="px-1 h-5 w-5 flex items-center justify-center py-0.5 text-[0.7rem] font-medium rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400">K</kbd>
                </div>
                <span>commands</span>
              </div>
              
              {commandMenuMode !== 'empty' && (
                <div className="flex items-center gap-1.5">
                  <div className="inline-flex items-center gap-0.5"> 
                    <kbd className="px-1 h-5 w-5 flex items-center justify-center py-0.5 text-[1rem] font-medium rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400">⌘</kbd>
                    <kbd className="px-1 h-5 w-5 flex items-center justify-center py-0.5 text-[0.7rem] font-medium rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400">J</kbd>
                  </div>
                  <span>ask AI</span>
                </div>
              )}
              
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 h-5 flex items-center justify-center py-0.5 text-[0.65rem] font-medium rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400">esc</kbd>
                <span>
                  {commandMenuMode === 'ask_ai' 
                    ? (displayedResponse ? 'clear' : 'back') 
                    : commandMenuMode === 'empty'
                      ? 'back'
                      : (searchQuery ? 'clear' : 'close')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 