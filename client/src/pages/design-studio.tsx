import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useLocation } from "wouter";
import { useState } from "react";
import { 
  RefreshCw, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Home, 
  Search, 
  Moon, 
  ChevronDown,
  X,
  Settings,
  Bell,
  User,
  Moon as MoonIcon,
  FileText,
  Users,
  MessageSquare,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Feed post interface
interface FeedPost {
  id: string;
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  time: string;
  tags?: string[];
}

// Feed component
function FeedContent() {
  // Sample feed data
  const feedPosts: FeedPost[] = [
    {
      id: "1",
      author: {
        name: "Olivia Rhye",
        avatar: "https://github.com/shadcn.png",
        role: "Product Designer"
      },
      content: "Just released our new design system guidelines! Check out the documentation to see how we're improving accessibility across all our digital products.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2344&q=80",
      likes: 24,
      comments: 5,
      time: "2h ago",
      tags: ["Design", "Accessibility"]
    },
    {
      id: "2",
      author: {
        name: "Alex Morgan",
        avatar: "https://github.com/shadcn.png",
        role: "Developer"
      },
      content: "I've been learning about microservices architecture and how it can improve scalability. Any recommended resources for diving deeper into this topic?",
      likes: 16,
      comments: 8,
      time: "3h ago",
      tags: ["Development", "Architecture"]
    },
    {
      id: "3",
      author: {
        name: "Sophia Chen",
        avatar: "https://github.com/shadcn.png",
        role: "UX Researcher"
      },
      content: "Just conducted a fascinating user research session on our new onboarding flow. The insights we gathered will help us significantly improve user retention.",
      image: "https://images.unsplash.com/photo-1531685250784-7569952593d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
      likes: 32,
      comments: 11,
      time: "5h ago",
      tags: ["Research", "UX"]
    }
  ];

  return (
    <div className="flex-1 p-2.5">
      <div className="flex items-center justify-between mb-2.5">
        <div>
          <h1 className="text-base font-bold text-gray-900 dark:text-white">Feed</h1>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
            Updates from your community
          </p>
        </div>
        
        <div className="flex items-center space-x-1">
          <button className="text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 p-0.5 rounded transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </button>
          <button className="text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 p-0.5 rounded transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* New post input */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm border border-gray-200/60 dark:border-gray-700/60 p-2 mb-3">
        <div className="flex items-center">
          <Avatar className="h-6 w-6 mr-2">
            <img src="https://github.com/shadcn.png" alt="Your avatar" />
          </Avatar>
          <div className="flex-1 bg-gray-100/60 dark:bg-gray-700/60 rounded-full px-3 py-1.5">
            <span className="text-[10px] text-gray-500 dark:text-gray-400">What's on your mind?</span>
          </div>
        </div>
        <div className="flex justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/40">
          <div className="flex space-x-2">
            <button className="text-[10px] text-gray-600 dark:text-gray-300 flex items-center space-x-1 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded px-1.5 py-0.5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Photos</span>
            </button>
            <button className="text-[10px] text-gray-600 dark:text-gray-300 flex items-center space-x-1 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded px-1.5 py-0.5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Link</span>
            </button>
          </div>
          <button className="text-[10px] bg-purple-600 text-white rounded px-2 py-0.5 hover:bg-purple-700 transition-colors">
            Post
          </button>
        </div>
      </div>
      
      {/* Feed posts */}
      <div className="space-y-3">
        {feedPosts.map(post => (
          <div key={post.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200/60 dark:border-gray-700/60 p-2.5">
            {/* Post header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-5 w-5 mr-1.5">
                  <img src={post.author.avatar} alt={post.author.name} />
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-900 dark:text-white mr-1">{post.author.name}</span>
                    <span className="text-[9px] text-gray-500 dark:text-gray-400">{post.time}</span>
                  </div>
                  {post.author.role && (
                    <span className="text-[9px] text-gray-500 dark:text-gray-400">{post.author.role}</span>
                  )}
                </div>
              </div>
              <button className="text-gray-500 dark:text-gray-400 p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
            
            {/* Post content */}
            <div className="mt-1.5">
              <p className="text-[10px] text-gray-700 dark:text-gray-300 leading-relaxed">{post.content}</p>
              
              {post.image && (
                <div className="mt-2 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700/50">
                  <img src={post.image} alt="Post attachment" className="w-full h-36 object-cover" />
                </div>
              )}
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-[9px] bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-full px-1.5 py-0.5">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* Post actions */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/40">
              <div className="flex space-x-3">
                <button className="text-[9px] text-gray-600 dark:text-gray-300 flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{post.likes}</span>
                </button>
                <button className="text-[9px] text-gray-600 dark:text-gray-300 flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{post.comments}</span>
                </button>
              </div>
              <button className="text-[9px] text-gray-600 dark:text-gray-300 flex items-center space-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DesignStudio() {
  const [location, setLocation] = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [responsiveDropdownOpen, setResponsiveDropdownOpen] = useState(false);
  
  // Check if we're in the feed section
  const isFeed = location.includes('/spaces/feed');

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4">
        {/* Browser mockup - with shadow */}
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 max-h-[600px] shadow-3xl" 
            style={{ 
              boxShadow: '0px 32px 64px -12px rgba(16, 24, 40, 0.14)',
              maxWidth: '900px',
              margin: '0 auto'
            }}>
          
          {/* Browser chrome - Balanced minimal */}
          <div className="bg-gray-100 dark:bg-gray-850 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            {/* Left side with traffic lights */}
            <div className="flex space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
            </div>
            
            {/* Centered Address bar */}
            <div className="flex-1 flex justify-center">
              <div className="w-56">
                <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 truncate">
                  <span className="opacity-50 mr-1">https://</span>community.bettermode.io
                </div>
              </div>
            </div>
            
            {/* Browser controls - Right aligned */}
            <div className="flex items-center space-x-3">
              {/* Undo/Redo buttons */}
              <div className="flex space-x-1">
                <button className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-1.5 py-0.5 flex items-center bg-gray-50 dark:bg-gray-750" style={{ width: '22px', height: '22px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 5C7.58172 5 4 8.58172 4 13C4 17.4183 7.58172 21 12 21C16.4183 21 20 17.4183 20 13" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M15 5L12 8L9 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <button className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-1.5 py-0.5 flex items-center bg-gray-50 dark:bg-gray-750" style={{ width: '22px', height: '22px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 5C16.4183 5 20 8.58172 20 13C20 17.4183 16.4183 21 12 21C7.58172 21 4 17.4183 4 13" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M9 5L12 8L15 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              {/* Action Controls */}
              <div className="flex space-x-1.5">
                {/* User View Button */}
                <button 
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-1.5 py-0.5 flex items-center text-xs"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <User className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">User</span>
                </button>
                
                {/* Language Button */}
                <button 
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-1.5 py-0.5 flex items-center text-xs"
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                >
                  <span className="text-xs">EN</span>
                  <ChevronDown className="h-3 w-3 ml-0.5" />
                </button>
                
                {/* Theme Button */}
                <button 
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-1.5 py-0.5 flex items-center text-xs"
                  onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                >
                  <MoonIcon className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Dark</span>
                  <ChevronDown className="h-3 w-3 ml-0.5" />
                </button>
                
                {/* Responsive View Button */}
                <button 
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-1.5 py-0.5 flex items-center text-xs"
                  onClick={() => setResponsiveDropdownOpen(!responsiveDropdownOpen)}
                >
                  <span className="text-xs">Desktop</span>
                  <ChevronDown className="h-3 w-3 ml-0.5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Browser content */}
          <div className="h-[530px] overflow-hidden flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
            {/* Community header */}
            <div className="bg-white dark:bg-gray-800 px-3 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-purple-600 dark:bg-purple-500 h-4 w-4 rounded flex items-center justify-center mr-1.5">
                  <span className="text-[10px] font-bold text-white">T</span>
                </div>
                <h1 className="text-sm font-semibold text-gray-900 dark:text-white">Tribe Community</h1>
              </div>
              
              <div className="flex items-center space-x-1">
                <button className="text-gray-600 dark:text-gray-300 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xs">
                  <Search className="h-3 w-3" />
                </button>
                <button className="text-gray-600 dark:text-gray-300 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-xs">
                  <Bell className="h-3 w-3" />
                </button>
                <Avatar className="h-5 w-5 ml-0.5">
                  <img src="https://github.com/shadcn.png" alt="User avatar" />
                </Avatar>
              </div>
            </div>
            
            {/* Main content area - Ultra minimal */}
            <div className="flex min-h-[550px]">
              {/* Left sidebar - Ultra minimal - No background */}
              <div className="w-36 p-1.5 border-r border-gray-200/50 dark:border-gray-700/50 bg-transparent">
                <nav className="space-y-0">
                  <a 
                    href="#" 
                    className="flex items-center px-1.5 py-1 text-[10px] rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <Home className="h-3 w-3 mr-1.5 text-gray-500 dark:text-gray-400" />
                    Explore
                  </a>
                  
                  <a 
                    href="/design-studio/spaces/feed" 
                    onClick={(e) => {
                      e.preventDefault();
                      setLocation('/design-studio/spaces/feed');
                    }}
                    className={`flex items-center px-1.5 py-1 text-[10px] rounded ${isFeed ? 'bg-gray-100/60 dark:bg-gray-800/60 text-purple-700 dark:text-purple-400 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'} transition-colors`}
                  >
                    <MessageSquare className={`h-3 w-3 mr-1.5 ${isFeed ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`} />
                    Feed
                  </a>
                  
                  <a 
                    href="#" 
                    className="flex items-center px-1.5 py-1 text-[10px] rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <Bell className="h-3 w-3 mr-1.5 text-gray-500 dark:text-gray-400" />
                    Notifications
                  </a>
                  
                  <a 
                    href="#" 
                    className="flex items-center px-1.5 py-1 text-[10px] rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <Users className="h-3 w-3 mr-1.5 text-gray-500 dark:text-gray-400" />
                    Members
                  </a>
                  
                  <div className="h-[1px] bg-gray-200/50 dark:bg-gray-700/50 my-1"></div>
                  
                  <a 
                    href="#" 
                    className="flex items-center px-1.5 py-1 text-[10px] rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <MessageSquare className="h-3 w-3 mr-1.5 text-gray-500 dark:text-gray-400" />
                    Discussions
                  </a>
                  
                  <a 
                    href="/design-studio"
                    onClick={(e) => {
                      e.preventDefault();
                      setLocation('/design-studio');
                    }}
                    className={`flex items-center px-1.5 py-1 text-[10px] rounded ${!isFeed ? 'bg-gray-100/60 dark:bg-gray-800/60 text-purple-700 dark:text-purple-400 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'} transition-colors`}
                  >
                    <FileText className={`h-3 w-3 mr-1.5 ${!isFeed ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'}`} />
                    Articles
                  </a>
                  
                  <a 
                    href="#" 
                    className="flex items-center px-1.5 py-1 text-[10px] rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <Calendar className="h-3 w-3 mr-1.5 text-gray-500 dark:text-gray-400" />
                    Events
                  </a>
                </nav>
              </div>
              
              {/* Conditionally render Feed or Articles content based on URL */}
              {isFeed ? (
                <FeedContent />
              ) : (
                <div className="flex-1 p-2.5">
                  <div className="flex items-center justify-between mb-2.5">
                    <div>
                      <h1 className="text-base font-bold text-gray-900 dark:text-white">Articles</h1>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                        Advice and answers from the Tribe Team
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button className="text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 p-0.5 rounded transition-colors">
                        <Bell className="h-3.5 w-3.5" />
                      </button>
                      <button className="text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 p-0.5 rounded transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="all" className="mb-2.5">
                    <TabsList className="bg-transparent border border-gray-200/60 dark:border-gray-700/60 rounded-md">
                      <TabsTrigger value="all" className="text-[10px] data-[state=active]:bg-white/70 dark:data-[state=active]:bg-gray-800/70 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400">View all</TabsTrigger>
                      <TabsTrigger value="design" className="text-[10px] data-[state=active]:bg-white/70 dark:data-[state=active]:bg-gray-800/70 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400">Design</TabsTrigger>
                      <TabsTrigger value="product" className="text-[10px] data-[state=active]:bg-white/70 dark:data-[state=active]:bg-gray-800/70 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400">Product</TabsTrigger>
                      <TabsTrigger value="dev" className="text-[10px] data-[state=active]:bg-white/70 dark:data-[state=active]:bg-gray-800/70 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400">Dev</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Article Card 1 */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200/60 dark:border-gray-700/60 group">
                      <div className="h-28 bg-gradient-to-br from-purple-500 to-indigo-600 relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/90 to-indigo-600/90 group-hover:opacity-90 transition-opacity"></div>
                        <svg className="w-20 h-20 text-white/30 relative z-10" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 14.7V9.3c0-.77-.62-1.4-1.39-1.4-.2 0-.39.04-.57.11l-2.46.91V9.3c0-.77-.62-1.4-1.39-1.4-.2 0-.39.04-.57.11L12 8.8l-2.62-.98c-.18-.07-.37-.11-.57-.11-.77 0-1.39.62-1.39 1.4v.48l-2.46-.91c-.18-.07-.37-.11-.57-.11-.77 0-1.39.62-1.39 1.4v5.39c0 .61.4 1.14.97 1.33l2.65.86 2.78.9c.13.04.26.06.4.06.31 0 .6-.1.84-.29.24.19.54.29.84.29.14 0 .27-.02.4-.06l2.78-.9 2.65-.86c.58-.19.97-.72.97-1.33z" />
                        </svg>
                        <div className="absolute top-0 right-0 mt-1.5 mr-1.5 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                          <span className="text-[10px] font-medium text-white">Design</span>
                        </div>
                      </div>
                      <div className="p-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-xs leading-tight mb-1 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">UX review presentations</h3>
                        <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight mb-1.5 line-clamp-2">
                          How do you create compelling presentations that wow your colleagues and impress your managers
                        </p>
                        <div className="flex items-center mt-1.5 pt-1.5 border-t border-gray-100 dark:border-gray-700/40">
                          <Avatar className="h-4 w-4 mr-1">
                            <img src="https://github.com/shadcn.png" alt="Olivia Rhye" />
                          </Avatar>
                          <div className="text-[9px] text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Olivia Rhye</span>
                            <span className="mx-1.5 opacity-50">•</span>
                            <span>Jan 20</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Article Card 2 */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200/60 dark:border-gray-700/60 group">
                      <div className="h-28 relative overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                          alt="People discussing work" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        <div className="absolute top-0 right-0 mt-1.5 mr-1.5 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                          <span className="text-[10px] font-medium text-white">Product</span>
                        </div>
                      </div>
                      <div className="p-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-xs leading-tight mb-1 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">Migrating to Linear 101</h3>
                        <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight mb-1.5 line-clamp-2">
                          Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.
                        </p>
                        <div className="flex items-center mt-1.5 pt-1.5 border-t border-gray-100 dark:border-gray-700/40">
                          <Avatar className="h-4 w-4 mr-1">
                            <img src="https://github.com/shadcn.png" alt="Olivia Rhye" />
                          </Avatar>
                          <div className="text-[9px] text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Olivia Rhye</span>
                            <span className="mx-1.5 opacity-50">•</span>
                            <span>Jan 20</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Article Card 3 */}
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200/60 dark:border-gray-700/60 group">
                      <div className="h-28 bg-gradient-to-br from-gray-700 to-gray-900 relative flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700/90 to-gray-900/90 group-hover:opacity-90 transition-opacity"></div>
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-300/30 relative z-10 group-hover:scale-110 transition-transform duration-500">
                          <path fill="currentColor" d="M 100 20 L 120 80 L 180 80 L 130 110 L 150 170 L 100 140 L 50 170 L 70 110 L 20 80 L 80 80 Z" />
                          <path fill="currentColor" d="M 100 40 L 120 100 L 180 100 L 130 130 L 150 190 L 100 160 L 50 190 L 70 130 L 20 100 L 80 100 Z" opacity="0.5" transform="rotate(15)" />
                        </svg>
                        <div className="absolute top-0 right-0 mt-1.5 mr-1.5 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded px-1.5 py-0.5">
                          <span className="text-[10px] font-medium text-white">Dev</span>
                        </div>
                      </div>
                      <div className="p-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-xs leading-tight mb-1 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">Building your API stack</h3>
                        <p className="text-[10px] text-gray-600 dark:text-gray-400 leading-tight mb-1.5 line-clamp-2">
                          The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.
                        </p>
                        <div className="flex items-center mt-1.5 pt-1.5 border-t border-gray-100 dark:border-gray-700/40">
                          <Avatar className="h-4 w-4 mr-1">
                            <img src="https://github.com/shadcn.png" alt="Olivia Rhye" />
                          </Avatar>
                          <div className="text-[9px] text-gray-500 dark:text-gray-400">
                            <span className="font-medium">Olivia Rhye</span>
                            <span className="mx-1.5 opacity-50">•</span>
                            <span>Jan 20</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}