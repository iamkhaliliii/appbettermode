import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { SparklesIcon, SearchIcon, ArrowRightIcon, ExternalLinkIcon, FilterIcon, CheckIcon, BookOpenIcon, XIcon, PlusIcon, CommandIcon, ChevronRightIcon, ArrowUpIcon, ArrowDownIcon, MessageSquareIcon, UserIcon, BellIcon, WrenchIcon, ArrowLeftIcon, CornerDownLeftIcon, ChevronRightCircleIcon, GlobeIcon, LayoutIcon, KeyIcon, CodeIcon, ShieldIcon, MoreHorizontalIcon, CircleEllipsis, Ellipsis, Shield, Earth } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { useEffect, useState, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Lottie from "react-lottie";
import askAiAnimation from "@/public/askai.json";

// Placeholder components for different settings sections
const SiteSettings = () => <div><Card><CardHeader><CardTitle>Site Settings</CardTitle></CardHeader><CardContent>Content for Site Settings...</CardContent></Card></div>;
const AuthenticationSettings = () => <div><Card><CardHeader><CardTitle>Authentication</CardTitle></CardHeader><CardContent>Content for Authentication...</CardContent></Card></div>;
const DomainSettings = () => <div><Card><CardHeader><CardTitle>Domain</CardTitle></CardHeader><CardContent>Content for Domain...</CardContent></Card></div>;
const SearchSettings = () => {
  // State for search sources checkboxes
  const [searchSources, setSearchSources] = useState({
    posts: true,
    spaces: true,
    members: false
  });
  
  // State for knowledge base spaces
  const [knowledgeBaseSpaces, setKnowledgeBaseSpaces] = useState([
    "Getting Started",
    "Content Management",
    "Member Management",
    "Appearance & Design",
    "Reports & Analytics",
    "Apps & Integrations",
    "API & Webhooks"
  ]);
  
  // Handle remove space from knowledge base
  const removeSpace = (space: string) => {
    setKnowledgeBaseSpaces(knowledgeBaseSpaces.filter(s => s !== space));
  };
  
  // Handle adding a new space (placeholder)
  const addSpace = () => {
    // This would typically open a modal or dropdown to select spaces
    alert("This would open a space selection interface");
  };
  
  return (
  <div className="space-y-5">
    {/* Search Sources Card - Refined */}
    <Card className="w-full max-w-2xl bg-white dark:bg-gray-950 border-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_3px_12px_rgba(0,0,0,0.06)] transition-shadow duration-200">
      <CardHeader className="px-6 pt-5 pb-0">
        <CardTitle className="text-[15px] font-medium text-gray-900 dark:text-gray-100 tracking-tight mb-1">Search Sources</CardTitle>
        <CardDescription className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Admins have access to all sources. Select which content types should be available in search results for members.
        </CardDescription>
      </CardHeader>
      <div className="px-6 pt-4">
        <div className="h-px w-full bg-gray-100 dark:bg-gray-800/80"></div>
      </div>
      <CardContent className="px-6 pt-4 pb-5">        
        <div className="divide-y divide-gray-100 dark:divide-gray-800/80">
          {/* Posts Item */}
          <div className="flex items-center justify-between py-3 group">
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="posts" 
                checked={searchSources.posts} 
                disabled 
                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 h-4 w-4"
              />
              <Label htmlFor="posts" className="text font-medium text-gray-900 dark:text-white cursor-default group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                Posts
              </Label>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Always included</span>
          </div>
          
          {/* Spaces Item */}
          <div className="flex items-center justify-between py-3 group cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/10 rounded-sm transition-colors">
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="spaces" 
                checked={searchSources.spaces} 
                onCheckedChange={(checked) => setSearchSources({...searchSources, spaces: checked === true})}
                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 h-4 w-4"
              />
              <Label htmlFor="spaces" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                Spaces
              </Label>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {searchSources.spaces ? "Included" : "Not included"}
            </span>
          </div>
          
          {/* Members Item */}
          <div className="flex items-center justify-between py-3 group cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/10 rounded-sm transition-colors">
            <div className="flex items-center space-x-3">
              <Checkbox 
                id="members" 
                checked={searchSources.members} 
                onCheckedChange={(checked) => setSearchSources({...searchSources, members: checked === true})}
                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 h-4 w-4"
              />
              <Label htmlFor="members" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                Members
              </Label>
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {searchSources.members ? "Included" : "Not included"}
            </span>
          </div>
        </div>
        
        <div className="flex justify-end mt-5">
          <Button size="sm" className="h-8 px-4 text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-sm">
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
   
    {/* Knowledge Base Spaces Card - Refined */}
    <Card className="w-full max-w-2xl bg-white dark:bg-gray-950 border-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_3px_12px_rgba(0,0,0,0.06)] transition-shadow duration-200">
      <CardHeader className="px-6 pt-5 pb-0">
        <CardTitle className="text-[15px] font-medium text-gray-900 dark:text-gray-100 tracking-tight mb-1">Knowledge Base Spaces</CardTitle>
        <CardDescription className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Select the spaces that contain official knowledge or verified content in your community.
        </CardDescription>
      </CardHeader>
      <div className="px-6 pt-4">
        <div className="h-px w-full bg-gray-100 dark:bg-gray-800/80"></div>
      </div>
      <CardContent className="px-6 pt-4 pb-5">        
        <div className="border border-gray-200 dark:border-gray-700/80 rounded-md p-3.5 mb-4 min-h-[68px] bg-gray-50/50 dark:bg-gray-800/10">
          <div className="flex flex-wrap gap-2">
            {knowledgeBaseSpaces.map((space) => (
              <Badge 
                key={space} 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-1 px-2.5 rounded-full flex items-center gap-1.5 transition-colors"
              >
                <BookOpenIcon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                <span className="text-xs font-medium">{space}</span>
                <button 
                  onClick={() => removeSpace(space)} 
                  className="ml-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 p-0.5 transition-colors"
                >
                  <XIcon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                </button>
              </Badge>
            ))}
            <Badge 
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 hover:bg-blue-100 dark:hover:bg-blue-800/30 text-blue-600 dark:text-blue-400 py-1 px-2.5 rounded-full flex items-center gap-1.5 cursor-pointer transition-colors"
              onClick={addSpace}
            >
              <PlusIcon className="w-3 h-3" />
              <span className="text-xs font-medium">Add</span>
            </Badge>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-5">
          These spaces will be grouped separately from other posts in search results and prioritized when 
          generating answers with the Ask AI feature (if enabled).
        </p>
        
        <div className="flex justify-end">
          <Button size="sm" className="h-8 px-4 text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-sm">
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
    
    {/* Ask AI Access Card - Refined */}
    <Card className="w-full max-w-2xl bg-white dark:bg-gray-950 border-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_3px_12px_rgba(0,0,0,0.06)] transition-shadow duration-200">
      <CardHeader className="px-6 pt-5 pb-0">
        <div className="flex items-center space-x-2 mb-1">
          <CardTitle className="text-[15px] font-medium text-gray-900 dark:text-gray-100 tracking-tight">Ask AI access</CardTitle>
          <Badge variant="outline" className="h-5 px-1.5 py-0 bg-green-50 text-green-600 border border-green-100 font-medium text-[10px] rounded-full">New</Badge>
        </div>
        <CardDescription className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Give members access to Ask AI for smarter and more relevant search results.
        </CardDescription>
      </CardHeader>
      <div className="px-6 pt-4">
        <div className="h-px w-full bg-gray-100 dark:bg-gray-800/80"></div>
      </div>
      <CardContent className="px-6 pt-4 pb-5">
        <div className="flex items-center justify-between p-3 rounded-md bg-gray-50/70 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700/80 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/30 rounded-md">
              <SparklesIcon className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" /> 
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white block">Ask AI</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">AI-powered search assistant</span>
            </div>
          </div>
          <Button size="sm" className="h-8 px-4 text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-sm">
            Configure
          </Button>
        </div>
      </CardContent>
    </Card>

    {/* Federated Search Card - Refined */}
    <Card className="w-full max-w-2xl bg-white dark:bg-gray-950 border-0 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_3px_12px_rgba(0,0,0,0.06)] transition-shadow duration-200">
      <CardHeader className="px-6 pt-5 pb-0">
        <CardTitle className="text-[15px] font-medium text-gray-900 dark:text-gray-100 tracking-tight mb-1">Federated Search</CardTitle>
        <CardDescription className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Enhance community search by integrating both community content and external data sources.
        </CardDescription>
      </CardHeader>
      <div className="px-6 pt-4">
        <div className="h-px w-full bg-gray-100 dark:bg-gray-800/80"></div>
      </div>
      <CardContent className="px-6 pt-4 pb-5">
        <div className="flex items-center justify-between p-3 rounded-md bg-gray-50/70 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700/80 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-md">
              <SearchIcon className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" /> 
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white block">Connect external sources</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Integrate with platforms your members use</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" className="h-8 px-3 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors">
              Docs
            </Button>
            <Button size="sm" className="h-8 px-4 text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors shadow-sm">
              Configure
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
}
const MessagingSettings = () => <div><Card><CardHeader><CardTitle>Messaging</CardTitle></CardHeader><CardContent>Content for Messaging...</CardContent></Card></div>;
const ModerationSettings = () => <div><Card><CardHeader><CardTitle>Moderation</CardTitle></CardHeader><CardContent>Content for Moderation...</CardContent></Card></div>;
const LocalizationSettings = () => <div><Card><CardHeader><CardTitle>Localization</CardTitle></CardHeader><CardContent>Content for Localization...</CardContent></Card></div>;
const NotificationSettings = () => <div><Card><CardHeader><CardTitle>Notifications</CardTitle></CardHeader><CardContent>Content for Notifications...</CardContent></Card></div>;
const SEOSettings = () => <div><Card><CardHeader><CardTitle>SEO Settings</CardTitle></CardHeader><CardContent>Content for SEO Settings...</CardContent></Card></div>;
const SecurityPrivacySettings = () => <div><Card><CardHeader><CardTitle>Security & Privacy</CardTitle></CardHeader><CardContent>Content for Security & Privacy...</CardContent></Card></div>;

export default function Settings() {
  const [location, setLocation] = useLocation();
  const [match, params] = useRoute('/settings/:section?');
  const section = params?.section;
  const [isCommandMenuOpen, setIsCommandMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const commandMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const [commandMenuMode, setCommandMenuMode] = useState<'initial' | 'searching' | 'ask_ai' | 'empty'>('initial');
  const [askAiResponse, setAskAiResponse] = useState("");
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [recentSearchesScrolled, setRecentSearchesScrolled] = useState(false);

  // Ensure handleRecentSearchesScroll is defined here, and only here.
  const handleRecentSearchesScroll = () => {
    const container = document.getElementById('recent-searches-container');
    if (container) {
      setRecentSearchesScrolled(container.scrollLeft > 10);
    }
  };

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
    { id: 1, text: "login method", onClick: () => { setSearchQuery("login method"); setCommandMenuMode('searching'); } },
    { id: 2, text: "header and sidebar", onClick: () => { setSearchQuery("header and sidebar"); setCommandMenuMode('searching'); } },
    { id: 3, text: "sidebar", onClick: () => { setSearchQuery("sidebar"); setCommandMenuMode('searching'); } },
    { id: 4, text: "custom domain", onClick: () => { setSearchQuery("custom domain"); setCommandMenuMode('searching'); } },
    { id: 5, text: "SSO integration", onClick: () => { setSearchQuery("SSO integration"); setCommandMenuMode('searching'); } },
    { id: 6, text: "API access", onClick: () => { setSearchQuery("API access"); setCommandMenuMode('searching'); } },
    { id: 7, text: "moderation settings", onClick: () => { setSearchQuery("moderation settings"); setCommandMenuMode('searching'); } }
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
    const aiQuery = searchQuery || "general information"; // Use search query or a default
    
    // Using the full text with improved formatting markers for better typography
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
    setDisplayedResponse(""); // Reset displayed text
    setIsTyping(true);
    setCommandMenuMode('ask_ai');
    // Keep search query to show context in the input placeholder
  };

  // Update search input onChange
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (commandMenuMode !== 'ask_ai') { // Don't change mode if we are in Ask AI view
       setCommandMenuMode(query ? 'searching' : 'initial');
    }
  };
  
  // List of commands/settings for search
  const settingsOptions = [
    { name: "Site Settings", section: "site-settings" },
    { name: "Authentication", section: "authentication" },
    { name: "Domain", section: "domain" },
    { name: "Search", section: "search" },
    { name: "Messaging", section: "messaging" },
    { name: "Moderation", section: "moderation" },
    { name: "Localization", section: "localization" },
    { name: "Notifications", section: "notifications" },
    { name: "SEO Settings", section: "seo-settings" },
    { name: "Security & Privacy", section: "security-privacy" },
  ];

  // Filter options based on search query
  const filteredOptions = settingsOptions.filter(option => 
    option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset selected item index when search query or mode changes
  useEffect(() => {
     if (commandMenuMode === 'searching') {
       // When typing, select the first post result by default instead of Ask AI
       setSelectedItemIndex(1); 
     } else if (commandMenuMode === 'initial') {
       // When returning to initial or opening, set first trending post as default selected
       if (trendingPosts.length > 0) {
           setSelectedItemIndex(1); // Select first trending post (index 1)
       } else {
           setSelectedItemIndex(0); // Fallback to Ask AI (index 0) if no trending posts
       }
     } else { // ask_ai mode
       setSelectedItemIndex(-1); // No selection in ask_ai mode
     }
  }, [searchQuery, commandMenuMode, trendingPosts.length]); // Added trendingPosts.length

  // Handle keyboard navigation (modified for modes)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isCommandMenuOpen) return;
      
      // Block navigation in Ask AI mode (allow Escape via other listener)
      if (commandMenuMode === 'ask_ai') {
           if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === "Tab") {
              e.preventDefault();
           }
           return;
      }
      
      // console.log("Current selected index:", selectedItemIndex);
      
      // Determine the total number of selectable items based on mode
      let totalItems = 0;
      if (commandMenuMode === 'searching') {
        // ... (existing calculation for searching state) ...
        const askAI = 1;
        const numPosts = postResults.length;
        const morePostsButton = 1;
        const numSpaces = 3;
        const moreSpacesButton = 1;
        const numMembers = memberResults.length;
        const moreMembersButton = 1;
        totalItems = askAI + numPosts + morePostsButton + numSpaces + moreSpacesButton + numMembers + moreMembersButton;

      } else if (commandMenuMode === 'initial') {
        // Initial state - Ask AI + trending posts (Recent searches not navigable)
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
                 triggerAskAi(); // Trigger Ask AI if it's selected (index 0)
             } else if (commandMenuMode === 'searching') {
                 // Handle selecting search results (posts, spaces, members, more...)
                 // ... (existing search result selection logic from previous steps) ...
                  console.log(`Handle Enter on searching item: index ${selectedItemIndex}`);
             } else { // commandMenuMode === 'initial'
                 // Handle selecting trending posts (index > 0)
                 const postIndex = selectedItemIndex - 1; 
                 if (postIndex >= 0 && postIndex < trendingPosts.length) {
                   console.log(`Selected trending post: ${trendingPosts[postIndex].title}`);
                   // Add navigation or action for trending post
                 }
             }
          }
          break;
         // Tab key is handled in the other useEffect now 
      }
    }
    
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCommandMenuOpen, selectedItemIndex, commandMenuMode, searchQuery, postResults.length, memberResults.length, trendingPosts.length]); // Add commandMenuMode

  // Scroll selected item into view
  useEffect(() => {
    if (!isCommandMenuOpen || selectedItemIndex < 0 || !scrollContainerRef.current) return;

    const selectedElement = scrollContainerRef.current.querySelector(`[data-selectable-index="${selectedItemIndex}"]`);
    
    if (selectedElement) {
      selectedElement.scrollIntoView({
        block: 'nearest', // Scrolls the minimum amount to bring the element into view
        behavior: 'auto' // Use 'smooth' for smooth scrolling, 'auto' for instant
      });
    }
  }, [selectedItemIndex, isCommandMenuOpen]);

  // Handle clicking outside to close the menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (commandMenuRef.current && !commandMenuRef.current.contains(event.target as Node)) {
        setIsCommandMenuOpen(false);
      }
    }

    // Focus input when menu opens
    if (isCommandMenuOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCommandMenuOpen]);

  // Handle keyboard shortcuts (Cmd+K, Shift+Cmd+J, Escape, Tab for Ask AI)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Open/Close command menu with Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && e.key === "k" && !e.shiftKey) { // Ensure Shift is not pressed for regular Cmd+K
        e.preventDefault();
        if (!isCommandMenuOpen) {
           // Reset mode on open based on current query state
           setCommandMenuMode(searchQuery ? 'searching' : 'initial'); 
           setIsCommandMenuOpen(true);
        } else {
           setIsCommandMenuOpen(false); // Just close if already open
        }
      }

      // Show empty state with Cmd/Ctrl + G
      if ((e.metaKey || e.ctrlKey) && e.key === "g") {
        e.preventDefault();
        if (!isCommandMenuOpen) {
          setIsCommandMenuOpen(true);
        }
        setCommandMenuMode('empty');
        setSearchQuery("");
      }

      // Directly trigger Ask AI with Cmd/Ctrl + J
      if (!e.shiftKey && (e.metaKey || e.ctrlKey) && e.key === "j") { // Remove Shift check
        e.preventDefault();
        if (!isCommandMenuOpen) { // Open menu if closed
          setIsCommandMenuOpen(true);
          // Need to ensure initial mode state is set before triggering AI if menu was closed
          setCommandMenuMode('initial'); 
          // Use a small delay to allow state update before triggering AI
          setTimeout(triggerAskAi, 0); 
        } else {
          triggerAskAi(); // Trigger directly if menu is open
        }
      }
      
      // Refined Escape key handling based on mode
      if (e.key === "Escape" && isCommandMenuOpen) {
        if (commandMenuMode === 'ask_ai') {
           if (displayedResponse) {
             // First Escape in Ask AI: Clear response, stay in Ask AI mode
             setIsTyping(false); // Stop typing if ongoing
             setDisplayedResponse("");
             setAskAiResponse(""); // Prevent re-typing if user interacts again quickly
           } else {
             // Second Escape (or first if already cleared): Go back
             setCommandMenuMode(searchQuery ? 'searching' : 'initial'); 
           }
        } else if (commandMenuMode === 'empty') {
          // From empty state, go back to initial
          setCommandMenuMode('initial');
        } else if (searchQuery) {
          // If there's text in the input (and not in ask_ai mode), clear it & go to initial
          setSearchQuery("");
          setCommandMenuMode('initial');
        } else {
          // Otherwise (initial state), close the menu
          setIsCommandMenuOpen(false);
        }
      }

      // Tab key handling (only for initial Ask AI)
      if (e.key === 'Tab' && isCommandMenuOpen && commandMenuMode === 'initial' && selectedItemIndex === 0) {
        e.preventDefault(); // Prevent default tab behavior
        triggerAskAi();
      }
    }
    
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
    // Add commandMenuMode and selectedItemIndex for Tab logic
  }, [isCommandMenuOpen, searchQuery, commandMenuMode, selectedItemIndex]); 

  // Typing effect for AI response - Much faster speed
  useEffect(() => {
    if (isTyping && commandMenuMode === 'ask_ai') {
      if (displayedResponse.length < askAiResponse.length) {
        const timer = setTimeout(() => {
          setDisplayedResponse(askAiResponse.substring(0, displayedResponse.length + 3)); // Typing 3 chars at once
        }, 1); // Ultra-fast 1ms delay
        return () => clearTimeout(timer);
      } else {
        setIsTyping(false); // Typing finished
      }
    }
  }, [displayedResponse, askAiResponse, isTyping, commandMenuMode]);
  
  // THIS IS THE CORRECT PLACE FOR THE SCROLL LISTENER USEEFFECT
  useEffect(() => {
    const container = document.getElementById('recent-searches-container');
    if (container) {
      container.addEventListener('scroll', handleRecentSearchesScroll);
      handleRecentSearchesScroll(); // Call handler once initially
      return () => {
        container.removeEventListener('scroll', handleRecentSearchesScroll);
      };
    }
  }, [isCommandMenuOpen]); 

  useEffect(() => {
    // ... logic for redirecting ...
    if (match && !section) {
      setLocation('/settings/site-settings', { replace: true });
    }
  }, [location, setLocation, section, match]);
  // ---- END OF ALL USEEFFECT HOOKS ----

  // ---- Conditional Return ----
  if (!section) {
    return <DashboardLayout><div className="p-8">Loading settings...</div></DashboardLayout>;
  }
  // ---- Hooks are all defined before this point ----

  // Function to render content based on section
  const renderSectionContent = () => {
    switch (section) {
      case 'site-settings': return <SiteSettings />;
      case 'authentication': return <AuthenticationSettings />;
      case 'domain': return <DomainSettings />;
      case 'search': return <SearchSettings />;
      case 'messaging': return <MessagingSettings />;
      case 'moderation': return <ModerationSettings />;
      case 'localization': return <LocalizationSettings />;
      case 'notifications': return <NotificationSettings />;
      case 'seo-settings': return <SEOSettings />;
      case 'security-privacy': return <SecurityPrivacySettings />;
      default:
        // Optional: Redirect to default if section is invalid, or show 404
        setLocation('/settings/site-settings', { replace: true }); 
        return <div>Invalid section. Redirecting...</div>; 
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

  const getPostIconBgClass = (iconType: string) => {
    switch (iconType) {
      case 'message':
        return "bg-blue-100 dark:bg-blue-900/30";
      case 'user':
        return "bg-violet-100 dark:bg-violet-900/30";
      case 'bell':
        return "bg-amber-100 dark:bg-amber-900/30";
      case 'docs':
        return "bg-emerald-100 dark:bg-emerald-900/30";
      default:
        return "bg-gray-100 dark:bg-gray-800/30";
    }
  };

  // Define animations constant here, before the return statement
  const animations = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0% { opacity: 0.3; }
      50% { opacity: 0.7; }
      100% { opacity: 0.3; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes growExpand {
      from { max-height: 0; opacity: 0; }
      to { max-height: 500px; opacity: 1; }
    }
  `;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4">
        <style dangerouslySetInnerHTML={{ __html: scrollbarHideStyle }} />
        <div className="mb-8 relative">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
            <button 
              onClick={() => setIsCommandMenuOpen(true)}
              className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white p-2 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Search settings"
            >
              <CommandIcon className="w-4 h-4" />
              <SearchIcon className="w-4 h-4" />
              <div className="hidden sm:flex items-center space-x-1">
                <span>Search</span>
                <kbd className="px-1.5 py-0.5 text-xs font-mono rounded bg-gray-200 dark:bg-gray-700">⌘K</kbd>
              </div>
            </button>
          </div>
          
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
          
          {/* Command Menu - Refined with Square Icons and Better Keyboard Navigation */}
          {isCommandMenuOpen && (
            <div 
              ref={commandMenuRef}
              className="fixed inset-0 bg-black/10 dark:bg-black/30 flex items-start justify-center z-50 pt-[10vh]"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setIsCommandMenuOpen(false);
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
                          setIsTyping(false); // Stop typing
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
                      onChange={handleSearchChange} // Use updated handler
                      disabled={commandMenuMode === 'ask_ai'} // Disable input in Ask AI mode
                      // Focus the input when in empty mode
                      autoFocus={commandMenuMode === 'empty'}
                    />
                    {searchQuery && commandMenuMode !== 'ask_ai' && ( // Hide clear button in Ask AI mode
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
                
                {/* Add flex-1 to make the scrollable area take up available space */}
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
                      {/* Add animations stylesheet */}
                      <style dangerouslySetInnerHTML={{ __html: animations }} />
                      
                      {/* Improved response area structure - with subtle animation and better spacing */}
                      <div className="flex-1 animate-[fadeIn_0.3s_ease-out]">
                        {/* Header with icon and title side-by-side - more refined */}
                        <div className="flex items-center mb-5 space-x-1"> {/* Increased spacing */}
                          {/* Lottie container with subtle glow */}
                          <div className="w-9 h-9 rounded-full flex items-center justify-center relative"> {/* Slightly larger */}
                            <div className="absolute inset-0 rounded-full"></div> {/* Subtle glow effect */}
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
                          
                          {/* Title with better text contrast */}
                          <h4 className="text-[0.9rem] font-medium text-gray-800 dark:text-gray-200">AI Assistant:</h4>
                        </div>
                        
                        {/* Improved typography for response text - better spacing and visuals */}
                        <div className="pl-6 relative pr-2"> {/* Balanced padding */}
                          {/* Softer left border */}
                          <div className="absolute left-1 top-2 bottom-2 w-[2px] bg-gradient-to-b from-violet-100 via-violet-200/40 to-violet-100/20 dark:from-violet-800/20 dark:via-violet-700/10 dark:to-violet-800/5 rounded-full"></div>
                          
                          {/* Better typography for response - with fade-in animation on sections */}
                          <div className="text-[0.9rem]/[1.4] text-gray-700 dark:text-gray-200 response-content">
                            <style dangerouslySetInnerHTML={{ __html: `
                              .response-content strong, .response-content b {
                                font-weight: 600;
                                color: #1F2937;
                                font-family: inherit;
                                font-size: 1.05rem;
                                display: block;
                                margin-top: 1.1rem;
                                margin-bottom: 0.3rem;
                              }
                              .response-content strong:first-child, .response-content b:first-child {
                                margin-top: 0;
                              }
                              .dark .response-content strong, .dark .response-content b {
                                color: #F3F4F6;
                              }
                              .response-content p {
                                margin-bottom: 0.6rem;
                                line-height: 1.5;
                              }
                              .response-content p:last-child {
                                margin-bottom: 0;
                              }
                              .response-content ul {
                                margin-top: 0.125rem;
                                margin-bottom: 0.625rem;
                                padding-left: 0.75rem;
                              }
                              .response-content ul li {
                                position: relative;
                                padding-left: 0.75rem;
                                margin-bottom: 0.325rem;
                                line-height: 1.4;
                              }
                              .response-content ul li::before {
                                content: "•";
                                position: absolute;
                                left: -0.4rem;
                                color: #8B5CF6;
                                font-size: 1.2em;
                                animation: pulse 2s infinite;
                              }
                              .dark .response-content ul li::before {
                                color: #A78BFA;
                              }
                              .response-content p:last-of-type {
                                margin-top: 0.5rem;
                                font-style: italic;
                                color: #6B7280;
                              }
                              .dark .response-content p:last-of-type {
                                color: #9CA3AF;
                              }
                              .typing-cursor {
                                display: inline-block;
                                width: 1.5px;
                                height: 14px;
                                background-color: #8B5CF6;
                                margin-left: 1px;
                                animation: pulse 1.3s infinite;
                              }
                              .dark .typing-cursor {
                                background-color: #A78BFA;
                              }
                              @media (prefers-reduced-motion) {
                                .response-content strong, .response-content b,
                                .response-content p, .response-content ul li {
                                  animation: none;
                                }
                              }
                            `}} />
                            <div 
                              className="whitespace-pre-wrap" 
                              dangerouslySetInnerHTML={{ 
                                __html: displayedResponse
                                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **text** to <strong>
                                  .replace(/^• (.*)$/gm, '<ul><li style="--li-index: $&">$1</li></ul>') // Convert • items to list items
                                  .replace(/<\/ul>\s*<ul>/g, '') // Combine adjacent lists
                                  .replace(/\n\n/g, '</p><p>') // Convert double newlines to paragraphs
                                  .replace(/^(.+)$/m, '<p>$1</p>') // Wrap first paragraph
                              }}
                            />
                            {isTyping && <span className="typing-cursor"></span>} {/* Improved cursor with animation */}
                          </div>
                        </div>
                      </div>
                      
                      {/* Sources section - redesigned with better visual hierarchy and micro-interactions */}
                      {!isTyping && displayedResponse && ( 
                         <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800/30 animate-[fadeIn_0.4s_ease-out]"> 
                            {/* Sources accordion header - improved visual hierarchy */}
                            <button 
                              onClick={() => setSourcesExpanded(prev => !prev)}
                              className="flex items-center justify-between w-full text-left py-1 px-1 -mx-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                            >
                              <div className="flex items-center">
                                <span className="ml-3 text-xs text-gray-500 dark:text-gray-400">
                                  Searched 5 posts and 3 spaces
                                </span>
                                {/* Visual representation of sources - improved overlap and shadows */}
                                <div className="flex items-center ml-1 group"> {/* Group for hover effect */}
                                  {/* Posts circles */}
                                  <div className="flex -space-x-2 relative transform transition-transform group-hover:translate-x-0.5"> {/* Subtle movement on hover */}
                                    <div className="h-7 w-7 rounded-full border-2 border-white dark:border-gray-800 bg-violet-500 flex items-center justify-center relative z-0 shadow-sm">
                                        <Shield className="h-3.5 w-3.5 text-white dark:text-white" />
                                    </div>
                                    <div className="h-7 w-7 rounded-full border-2 border-white dark:border-gray-800 bg-blue-500 flex items-center justify-center relative z-10 shadow-sm">
                                      <MessageSquareIcon className="h-3.5 w-3.5 text-white dark:text-white" />
                                    </div>
                                    <div className="h-7 w-7 rounded-full border-2 border-white dark:border-gray-800 bg-green-500 flex items-center justify-center relative z-20 shadow-sm">
                                      <Earth className="h-3.5 w-3.5 text-white dark:text-white" />
                                    </div>
                                    {/* +2 circle with improved styling */}
                                    <div className="h-7 w-7 text-[0.8rem] font-medium rounded-full border border-white dark:border-gray-800 bg-gray-200/80 text-gray-600 dark:text-gray-400 flex items-center justify-center relative z-30 shadow-sm">
                                      +2
                                    </div>
                                  </div>
                                </div>

                              </div>
                              {/* Animated chevron with transition */}
                              <ChevronRightIcon 
                                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${sourcesExpanded ? 'rotate-90' : ''}`}
                              />
                            </button>
                            
                            {/* Expanded accordion content - with smooth animation */}
                            {sourcesExpanded && (
                              <div className="mt-3 animate-[growExpand_0.3s_ease-out] overflow-hidden">
                                {/* Posts section similar to search results - with animations */}
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
                                    {/* More posts button */}
                                    <button 
                                      className="w-full mt-0 mb-0 text-left text-[0.75rem] text-green-600 dark:text-green-400 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded flex items-center"
                                      onClick={() => {
                                        setIsCommandMenuOpen(false);
                                        setLocation(`/search/${encodeURIComponent(searchQuery || "posts")}`);
                                      }}
                                    >
                                      <div className="w-8 h-8 mr-1.5 rounded-md flex items-center justify-center flex-shrink-0">
                                        <MoreHorizontalIcon className="w-4 h-4 text-green-500 dark:text-green-400" /> 
                                      </div>
                                      <span>More post results</span>
                                      <ChevronRightIcon className="w-3 h-3 ml-1" />
                                    </button>
                                  </div>
                                </div>
                                
                                {/* Spaces section similar to search results - with animations */}
                                <div className="px-3 pt-3 pb-[0.4rem] border-b border-gray-100 dark:border-gray-800">
                                  <h3 className="text-[0.75rem] font-medium text-gray-500 dark:text-gray-300 mb-1">Spaces</h3>
                                  <div className="space-y-0">
                                    <div className="flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40">
                                      <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
                                        <div className="w-full h-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                          <BellIcon className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                                        </div>
                                      </div>
                                      <span className="text-[0.8rem] text-gray-900 dark:text-white">Community Spaces</span>
                                    </div>
                                    <div className="flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/40">
                                      <div className="w-8 h-8 flex-shrink-0 rounded-md overflow-hidden">
                                        <div className="w-full h-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                          <LayoutIcon className="w-4 h-4 text-green-500 dark:text-green-400" />
                                        </div>
                                      </div>
                                      <span className="text-[0.8rem] text-gray-900 dark:text-white">Product Updates</span>
                                    </div>
                                    {/* More spaces button */}
                                    <button 
                                      className="w-full mt-0 mb-0 text-left text-[0.75rem] text-green-600 dark:text-green-400 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded flex items-center"
                                      onClick={() => {
                                        setIsCommandMenuOpen(false);
                                        setLocation(`/search/${encodeURIComponent(searchQuery || "spaces")}?type=spaces`);
                                      }}
                                    >
                                      <div className="w-8 h-8 mr-1.5 rounded-md flex items-center justify-center flex-shrink-0">
                                        <MoreHorizontalIcon className="w-4 h-4 text-green-500 dark:text-green-400" /> 
                                      </div>
                                      <span>More space results</span>
                                      <ChevronRightIcon className="w-3 h-3 ml-1" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                         </div>
                      )}
                      
                      {/* Helper/disclaimer text - improved styling and subtle fade */}
                      <div className="mt-auto pb-4 pt-4">
                        <p className="text-xs text-gray-400 dark:text-gray-500 italic border-t border-gray-100 dark:border-gray-800/30 pt-3 opacity-80 transition-opacity hover:opacity-100"> {/* Subtle hover effect */}
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
                          onClick={triggerAskAi} // Use trigger function
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
                          {/* Conditional KBD for search state Ask AI */}
                          {selectedItemIndex === 0 ? (
                            <kbd className={`ml-2 px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 inline-flex items-center gap-1`}>
                              <CornerDownLeftIcon className="w-3 h-3" />
                            </kbd>
                          ) : (
                            <kbd className="ml-2 inline-flex items-center gap-0.5"> {/* Outer kbd for grouping */}
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
                                {post.icon === 'message' ? (
                                  <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <MessageSquareIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                                  </div>
                                ) : post.icon === 'docs' ? (
                                  <div className="w-full h-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                    <BookOpenIcon className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                                  </div>
                                ) : (
                                  <div className="w-full h-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <BellIcon className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                                  </div>
                                )}
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
                                   {/* KBD shown only when selected - updated style */}
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
                            setIsCommandMenuOpen(false);
                            setLocation(`/search/${encodeURIComponent(searchQuery)}`);
                          }}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 mr-1.5 rounded-md flex items-center justify-center flex-shrink-0">
                              <MoreHorizontalIcon className="w-4 h-4 text-green-500 dark:text-green-400" /> 
                            </div>
                            <span>More post results about "{searchQuery}"</span>
                            <ChevronRightIcon className="w-3 h-3 ml-1" />
                          </div>
                          {/* Conditional Enter KBD for More Posts button - updated style */}
                          <kbd className={`ml-auto flex-shrink-0 px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === postResults.length + 1 ? 'inline-flex' : 'hidden'}`}> 
                            <CornerDownLeftIcon className="w-3 h-3" />
                          </kbd>
                        </button>
                      </div>

                      {/* Spaces Section */}
                      <div className="px-3 pt-3 pb-[0.4rem] border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-[0.75rem] font-medium text-gray-500 dark:text-gray-300 mb-1">Spaces</h3>
                        <div className="space-y-0">
                          <div 
                            data-selectable-index={postResults.length + 2}
                            className={`flex items-center justify-between space-x-3 p-2 rounded-md cursor-pointer ${
                              selectedItemIndex === postResults.length + 2
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
                            {/* KBD shown only when selected - updated style */}
                            <kbd className={`ml-auto flex-shrink-0 px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === postResults.length + 2 ? 'inline-flex' : 'hidden'}`}> 
                              <CornerDownLeftIcon className="w-3 h-3" />
                            </kbd>
                          </div>
                          <div 
                            data-selectable-index={postResults.length + 3}
                            className={`flex items-center justify-between space-x-3 p-2 rounded-md cursor-pointer ${
                              selectedItemIndex === postResults.length + 3
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
                            {/* KBD shown only when selected - updated style */}
                            <kbd className={`ml-auto flex-shrink-0 px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === postResults.length + 3 ? 'inline-flex' : 'hidden'}`}> 
                              <CornerDownLeftIcon className="w-3 h-3" />
                            </kbd>
                          </div>
                          <div 
                            data-selectable-index={postResults.length + 4}
                            className={`flex items-center justify-between space-x-3 p-2 rounded-md cursor-pointer ${
                              selectedItemIndex === postResults.length + 4
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
                            {/* KBD shown only when selected - updated style */}
                            <kbd className={`ml-auto flex-shrink-0 px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === postResults.length + 4 ? 'inline-flex' : 'hidden'}`}> 
                              <CornerDownLeftIcon className="w-3 h-3" />
                            </kbd>
                          </div>
                        </div>
                        {/* Conditional Enter KBD for More Spaces button - updated style */}
                        <button 
                          data-selectable-index={postResults.length + 5}
                          className={`w-full mt-0 mb-0 text-left text-[0.75rem] text-green-600 dark:text-green-400 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded flex items-center justify-between ${
                            selectedItemIndex === postResults.length + 5
                            ? 'bg-gray-100 dark:bg-gray-800'
                            : ''
                          }`}
                          onClick={() => {
                            setIsCommandMenuOpen(false);
                            setLocation(`/search/${encodeURIComponent(searchQuery)}?type=spaces`);
                          }}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 mr-1.5 rounded-md flex items-center justify-center flex-shrink-0">
                              <MoreHorizontalIcon className="w-4 h-4 text-green-500 dark:text-green-400" /> 
                            </div>
                            <span>More space results about "{searchQuery}"</span>
                            <ChevronRightIcon className="w-3 h-3 ml-1" />
                          </div>
                          {/* Conditional Enter KBD for More Spaces button - updated style */}
                          <kbd className={`ml-auto flex-shrink-0 px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === postResults.length + 5 ? 'inline-flex' : 'hidden'}`}> 
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
                              data-selectable-index={index + postResults.length + 6}
                              className={`flex items-center justify-between space-x-3 p-2 rounded-md cursor-pointer ${
                                selectedItemIndex === index + postResults.length + 6
                                ? 'bg-gray-100 dark:bg-gray-800'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'
                              }`}>
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
                                    {member.avatar}
                                  </div>
                                  <span className="text-[0.8rem] text-gray-900 dark:text-white">{member.name}</span>
                                </div>
                                {/* KBD shown only when selected - updated style */}
                                <kbd className={`ml-auto flex-shrink-0 px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === index + postResults.length + 6 ? 'inline-flex' : 'hidden'}`}> 
                                  <CornerDownLeftIcon className="w-3 h-3" />
                                </kbd>
                              </div>
                            ))}
                        </div>
                        {/* Conditional Enter KBD for More Members button - updated style */}
                        <button 
                          data-selectable-index={postResults.length + memberResults.length + 6}
                          className={`w-full mt-0 mb-0 text-left text-[0.75rem] text-green-600 dark:text-green-400 px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/40 rounded flex items-center justify-between ${
                            selectedItemIndex === postResults.length + memberResults.length + 6
                            ? 'bg-gray-100 dark:bg-gray-800'
                            : ''
                          }`}
                          onClick={() => {
                            setIsCommandMenuOpen(false);
                            setLocation(`/search/${encodeURIComponent(searchQuery)}?type=members`);
                          }}
                        >
                          <div className="flex items-center">
                            <div className="w-8 h-8 mr-1.5 rounded-md flex items-center justify-center flex-shrink-0">
                              <MoreHorizontalIcon className="w-4 h-4 text-green-500 dark:text-green-400" /> 
                            </div>
                            <span>More member results about "{searchQuery}"</span>
                            <ChevronRightIcon className="w-3 h-3 ml-1" />
                          </div>
                          {/* Conditional Enter KBD for More Members button - updated style */}
                          <kbd className={`ml-auto flex-shrink-0 px-1 h-5 w-5 flex items-center justify-center py-0.5 rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400 items-center gap-1 ${selectedItemIndex === postResults.length + memberResults.length + 6 ? 'inline-flex' : 'hidden'}`}> 
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
                          {/* Conditional KBD for Tab shortcut */}
                          {selectedItemIndex === 0 ? (
                            <kbd className={`ml-2 px-1.5 h-5 flex items-center justify-center py-0.5 text-[0.65rem] font-medium rounded border bg-gray-100/80 border-gray-200 dark:bg-gray-800/80 dark:border-gray-700/80 text-gray-600 dark:text-gray-400`}>
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
                      
                      {/* Recent Searches Section */}
                      <div className="px-3 pt-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                        <h3 className="text-[0.75rem] font-medium text-gray-500 dark:text-gray-300 mb-2">Recent Searches</h3>
                        
                        {/* Horizontal Scrollable Container with Gradient Fades and Arrows */}
                        <div className="relative">
                          {/* Left Fade and Arrow - Only visible when scrolled */}
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
                              aria-hidden={!recentSearchesScrolled}
                              tabIndex={recentSearchesScrolled ? 0 : -1}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                              </svg>
                            </button>
                          </div>
                          
                          {/* Scrollable Content */}
                          <div 
                            id="recent-searches-container"
                            className="flex overflow-x-auto scrollbar-hide pr-6 pl-2 py-1 space-x-2"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                          >
                            {recentSearches.length > 0 ? (
                              recentSearches.map((item) => (
                                <div 
                                  key={item.id}
                                  onClick={() => {
                                    setSearchQuery(item.text);
                                    setCommandMenuMode('searching');
                                  }}
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
                          
                          {/* Right Fade and Arrow */}
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
                                {/* Use the helper function to set the background class dynamically */}
                                <div className={`w-full h-full ${getPostIconBgClass(post.icon)} flex items-center justify-center`}>
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
                                    {/* KBD shown only when selected */}
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
                
                {/* Minimal Compact Keyboard Navigation Footer - Update Esc text */}
                <div className="py-2 px-3 border-t border-gray-100 dark:border-gray-800 bg-gray-100/50 dark:bg-gray-800/50 flex items-center">
                  <div className="flex items-center gap-4 text-[11px] text-gray-500/90 dark:text-gray-400/90">
                    {/* Keys explanation - adapt based on mode */}
                    {commandMenuMode !== 'empty' && (
                      <>
                        {/* Only show navigation keys when not in empty state */}
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
                    
                    {/* Common keys for all modes */}
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
                      {/* Text based on mode/searchQuery */}
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
          )}
        </div>

        {/* Render dynamic content based on section */} 
        {renderSectionContent()}

      </div>
    </DashboardLayout>
  );
}