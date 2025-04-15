import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useLocation } from "wouter";
import { useState } from "react";
import { 
  Home, 
  Search, 
  Bell,
  User,
  Moon,
  FileText,
  Users,
  MessageSquare,
  Calendar,
  ArrowLeft,
  Settings,
  Layout,
  Layers2
} from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
    }
  ];

  return (
    <div className="p-2.5">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <h1 className="text-base font-bold text-gray-900 dark:text-white">Feed</h1>
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
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1">
          Updates from your community
        </p>
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

export default function SpacesFeed() {
  const [location, setLocation] = useLocation();
  
  return (
    <DashboardLayout>
      {/* Custom Header with Back Button and Page Title */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => setLocation('/design-studio')}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          <Breadcrumb>
            <BreadcrumbList className="text-xs">
              <BreadcrumbItem>
                <BreadcrumbLink href="/design-studio" className="text-gray-500 dark:text-gray-400">Design Studio</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/design-studio/spaces" className="text-gray-500 dark:text-gray-400">Spaces</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink className="text-gray-900 dark:text-white font-medium">Feed</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <button className="flex items-center text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <Settings className="h-4 w-4" />
        </button>
      </div>
      
      {/* Secondary Sidebar Actions */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-3">
        <Accordion type="single" collapsible className="space-y-1">
          <AccordionItem value="layout_template" className="border-0">
            <AccordionTrigger className="flex items-center py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline">
              <div className="flex items-center">
                <Layout className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium text-sm">Layout & Templates</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-1">
              <div className="space-y-1 px-2">
                <button className="w-full text-left text-xs text-gray-700 dark:text-gray-300 py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  Choose Template
                </button>
                <button className="w-full text-left text-xs text-gray-700 dark:text-gray-300 py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  Edit Layout
                </button>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="sections_blocks" className="border-0">
            <AccordionTrigger className="flex items-center py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline">
              <div className="flex items-center">
                <Layers2 className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium text-sm">Sections & Blocks</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-1">
              <div className="space-y-1 px-2">
                <button className="w-full text-left text-xs text-gray-700 dark:text-gray-300 py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  Add Section
                </button>
                <button className="w-full text-left text-xs text-gray-700 dark:text-gray-300 py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  Add Block
                </button>
                <button className="w-full text-left text-xs text-gray-700 dark:text-gray-300 py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  Manage Sections
                </button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <FeedContent />
    </DashboardLayout>
  );
}