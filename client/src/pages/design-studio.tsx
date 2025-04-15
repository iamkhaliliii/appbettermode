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

export default function DesignStudio() {
  const [, setLocation] = useLocation();
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Design Studio</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Preview and customize community platform design
          </p>
        </div>

        {/* Browser mockup */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 max-h-[700px]">
          {/* Browser chrome */}
          <div className="bg-gray-100 dark:bg-gray-850 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center">
            {/* Traffic lights */}
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex space-x-2 mr-4">
              <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            
            {/* Address bar */}
            <div className="flex-1 mx-2">
              <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                <span className="opacity-50 mr-1">https://</span>community.bettermode.io
              </div>
            </div>
            
            {/* Browser controls */}
            <div className="flex space-x-3">
              <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
              <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">EN</span>
                <ChevronDown className="h-3 w-3 text-gray-500" />
              </div>
              <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <MoonIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* Community Platform UI - with internal scrolling */}
          <div className="bg-gray-50 dark:bg-gray-900 overflow-y-auto h-[600px] pointer-events-none">
            {/* Community platform header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-3 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="bg-gray-900 dark:bg-gray-700 p-1.5 rounded">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                  <span className="ml-2 font-semibold text-gray-900 dark:text-white">LaunchSimple</span>
                </div>
                
                <div className="relative hidden sm:block w-64">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for topics and discussions"
                    className="w-full pl-10 pr-4 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="text-gray-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Plus className="h-5 w-5" />
                </button>
                <button className="text-gray-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Moon className="h-5 w-5" />
                </button>
                <Avatar className="h-8 w-8">
                  <img src="https://github.com/shadcn.png" alt="Avatar" />
                </Avatar>
              </div>
            </div>
            
            {/* Main content area */}
            <div className="flex min-h-[800px]">
              {/* Left sidebar */}
              <div className="w-56 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
                <nav className="space-y-1">
                  <a 
                    href="#" 
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Home className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                    Explore
                  </a>
                  
                  <a 
                    href="#" 
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <MessageSquare className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                    Feed
                  </a>
                  
                  <a 
                    href="#" 
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Bell className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                    Notifications
                  </a>
                  
                  <a 
                    href="#" 
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Users className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                    Members
                  </a>
                  
                  <a 
                    href="#" 
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                    My profile
                  </a>
                  
                  <Separator className="my-2" />
                  
                  <a 
                    href="#" 
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <MessageSquare className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                    Discussions
                  </a>
                  
                  <a 
                    href="#" 
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <FileText className="h-5 w-5 mr-3 text-gray-700 dark:text-gray-300" />
                    Articles
                  </a>
                  
                  <a 
                    href="#" 
                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Calendar className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                    Events
                  </a>
                </nav>
              </div>
              
              {/* Main content */}
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Articles</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Advice and answers from the Tribe Team
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <button className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded">
                      <Bell className="h-5 w-5" />
                    </button>
                    
                    <div className="ml-2">
                      <button className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <Tabs defaultValue="all" className="mb-6">
                  <TabsList className="bg-gray-100 dark:bg-gray-800">
                    <TabsTrigger value="all" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">View all</TabsTrigger>
                    <TabsTrigger value="design" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Design</TabsTrigger>
                    <TabsTrigger value="product" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Product</TabsTrigger>
                    <TabsTrigger value="development" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Software Development</TabsTrigger>
                    <TabsTrigger value="success" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Customer Success</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Article Card 1 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="h-48 bg-purple-100 flex items-center justify-center overflow-hidden">
                      <svg className="w-full h-full object-cover" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,100 C150,200 250,0 400,100 L400,200 L0,200 Z" fill="#8B5CF6" />
                        <path d="M0,100 C150,0 250,200 400,100 L400,200 L0,200 Z" fill="#A78BFA" opacity="0.7" />
                      </svg>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">Design</Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">UX review presentations</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        How do you create compelling presentations that wow your colleagues and impress your managers
                      </p>
                      <div className="flex items-center mt-4">
                        <Avatar className="h-8 w-8 mr-2">
                          <img src="https://github.com/shadcn.png" alt="Olivia Rhye" />
                        </Avatar>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <div>Olivia Rhye</div>
                          <div>20 Jan 2024</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Article Card 2 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                        alt="People discussing work" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">Design</Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">Migrating to Linear 101</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.
                      </p>
                      <div className="flex items-center mt-4">
                        <Avatar className="h-8 w-8 mr-2">
                          <img src="https://github.com/shadcn.png" alt="Olivia Rhye" />
                        </Avatar>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <div>Olivia Rhye</div>
                          <div>20 Jan 2024</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Article Card 3 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="h-48 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32 text-gray-400">
                        <path fill="currentColor" d="M 100 20 L 120 80 L 180 80 L 130 110 L 150 170 L 100 140 L 50 170 L 70 110 L 20 80 L 80 80 Z" />
                        <path fill="currentColor" d="M 100 40 L 120 100 L 180 100 L 130 130 L 150 190 L 100 160 L 50 190 L 70 130 L 20 100 L 80 100 Z" opacity="0.5" transform="rotate(15)" />
                      </svg>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-2">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">Design</Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1">Building your API stack</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.
                      </p>
                      <div className="flex items-center mt-4">
                        <Avatar className="h-8 w-8 mr-2">
                          <img src="https://github.com/shadcn.png" alt="Olivia Rhye" />
                        </Avatar>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          <div>Olivia Rhye</div>
                          <div>20 Jan 2024</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>This is a non-functional preview of a community platform interface. All elements are for display only.</p>
          <p className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              Preview Mode
            </span>
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}