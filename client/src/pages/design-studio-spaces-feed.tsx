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
  Calendar,
  Layout,
  Layers2,
  ChevronRight,
  FileCode2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

// Feed post interface for sample data
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

// Feed sample data
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

// Feed component content
function FeedContent() {
  return (
    <div className="p-2.5">
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

// Using the global secondary sidebar now

// Main component
export default function DesignStudioSpacesFeed() {
  const [location, setLocation] = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [responsiveDropdownOpen, setResponsiveDropdownOpen] = useState(false);
  
  // Check if we're in the feed section
  const isFeed = true;

  return (
    <DashboardLayout>
      <div className="w-full p-4">
        {/* Browser mockup - with shadow */}
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-3xl w-full h-[calc(100vh-100px)]" 
            style={{ 
              boxShadow: '0px 32px 64px -12px rgba(16, 24, 40, 0.14)'
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
                  <span className="opacity-50 mr-1">https://</span>community.bettermode.io/spaces/feed
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
                </button>
                
                {/* Device Button */}
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
          
          {/* Main content area - Ultra minimal */}
          <div className="flex flex-1 overflow-auto">
            {/* Left sidebar - Ultra minimal - No background */}
            <div id="mockup-left-sidebar" className="w-36 p-1.5 border-r border-gray-200/50 dark:border-gray-700/50 bg-transparent" style={{borderRight: '1px solid var(--border)'}}>
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
            
            {/* Main content area with header/footer indicators */}
            <div className="flex-1 flex flex-col">
              {/* Header - initially hidden, shown when header toggle is activated */}
              <div id="mockup-header" className="h-8 border-b border-gray-200 dark:border-gray-700" style={{display: 'none', background: 'var(--background)'}}>
                <div className="h-full flex items-center px-4">
                  <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="ml-auto flex space-x-3">
                    <div className="w-6 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="w-6 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="w-6 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Main content with flex layout to accommodate right sidebar */}
              <div className="flex-1 flex overflow-auto">
                {/* Feed content in the main area */}
                <div className="flex-1 flex justify-center overflow-auto">
                  <div className="max-w-4xl w-full">
                    <FeedContent />
                  </div>
                </div>
                
                {/* Right sidebar - initially hidden, shown when right sidebar toggle is activated */}
                <div id="mockup-right-sidebar" className="w-36 p-1.5 border-l border-gray-200/50 dark:border-gray-700/50" style={{display: 'none'}}>
                  <div className="space-y-2">
                    <div className="w-full h-8 bg-gray-100 dark:bg-gray-800 rounded"></div>
                    <div className="w-full h-8 bg-gray-100 dark:bg-gray-800 rounded"></div>
                    <div className="w-full h-8 bg-gray-100 dark:bg-gray-800 rounded"></div>
                  </div>
                </div>
              </div>
              
              {/* Footer - initially hidden, shown when footer toggle is activated */}
              <div id="mockup-footer" className="h-8 border-t border-gray-200 dark:border-gray-700" style={{display: 'none', background: 'var(--background)'}}>
                <div className="h-full flex items-center justify-center">
                  <div className="flex space-x-4">
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}