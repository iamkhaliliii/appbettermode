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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [responsiveDropdownOpen, setResponsiveDropdownOpen] = useState(false);
  
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
              {/* Undo/Redo buttons - More stylish, medium size */}
              <div className="flex space-x-1">
                <button 
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-1.5 py-0.5 flex items-center bg-gray-50 dark:bg-gray-750"
                  style={{ width: '22px', height: '22px' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 5C7.58172 5 4 8.58172 4 13C4 17.4183 7.58172 21 12 21C16.4183 21 20 17.4183 20 13" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M15 5L12 8L9 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                
                <button 
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-1.5 py-0.5 flex items-center bg-gray-50 dark:bg-gray-750"
                  style={{ width: '22px', height: '22px' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 5C16.4183 5 20 8.58172 20 13C20 17.4183 16.4183 21 12 21C7.58172 21 4 17.4183 4 13" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M9 5L12 8L15 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              {/* Action Controls - Medium size */}
              <div className="flex space-x-1.5">
                {/* User View Button */}
                <button 
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-1.5 py-0.5 flex items-center text-xs"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <User className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">User</span>
                </button>
                
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-6 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                      <a href="#" className="block px-4 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        View as Admin
                      </a>
                      <a href="#" className="block px-4 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        View as Member
                      </a>
                      <a href="#" className="block px-4 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        View as Guest
                      </a>
                    </div>
                  </div>
                )}
                
                {/* Language Button */}
                <button 
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-1.5 py-0.5 flex items-center text-xs"
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                >
                  <span className="text-xs">EN</span>
                </button>
                
                {languageDropdownOpen && (
                  <div className="absolute right-0 mt-6 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                      <a href="#" className="block px-4 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        English
                      </a>
                      <a href="#" className="block px-4 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        中文 (Chinese)
                      </a>
                      <a href="#" className="block px-4 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        العربية (Arabic)
                      </a>
                    </div>
                  </div>
                )}
                
                {/* Theme Button */}
                <button 
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-1.5 py-0.5 flex items-center justify-center"
                  onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                  style={{ width: '22px', height: '22px' }}
                >
                  <MoonIcon className="h-3.5 w-3.5" />
                </button>
                
                {themeDropdownOpen && (
                  <div className="absolute right-0 mt-6 w-28 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                      <a href="#" className="block px-4 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Light
                      </a>
                      <a href="#" className="block px-4 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Dark
                      </a>
                    </div>
                  </div>
                )}
                
                {/* Responsive View Button */}
                <button 
                  className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-1.5 py-0.5 flex items-center justify-center"
                  onClick={() => setResponsiveDropdownOpen(!responsiveDropdownOpen)}
                  style={{ width: '22px', height: '22px' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                </button>
                
                {responsiveDropdownOpen && (
                  <div className="absolute right-0 mt-6 w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="py-1">
                      <a href="#" className="block px-4 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Desktop
                      </a>
                      <a href="#" className="block px-4 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Tablet
                      </a>
                      <a href="#" className="block px-4 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                        Mobile
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Community Platform UI - with internal scrolling - Minimal */}
          <div className="bg-gray-50 dark:bg-gray-900 overflow-y-auto h-[500px] pointer-events-none">
            {/* Community platform header - more compact */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <div className="bg-gray-900 dark:bg-gray-700 p-1 rounded">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                  </div>
                  <span className="ml-1.5 font-medium text-sm text-gray-900 dark:text-white">LaunchSimple</span>
                </div>
                
                <div className="relative hidden sm:block w-48">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                    <Search className="h-3 w-3 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-7 pr-2 py-1 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="text-gray-500 p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Plus className="h-4 w-4" />
                </button>
                <button className="text-gray-500 p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Moon className="h-4 w-4" />
                </button>
                <Avatar className="h-6 w-6">
                  <img src="https://github.com/shadcn.png" alt="Avatar" />
                </Avatar>
              </div>
            </div>
            
            {/* Main content area - more compact */}
            <div className="flex min-h-[550px]">
              {/* Left sidebar - more compact */}
              <div className="w-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-2">
                <nav className="space-y-0.5">
                  <a 
                    href="#" 
                    className="flex items-center px-2 py-1.5 text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Home className="h-3.5 w-3.5 mr-2 text-gray-500 dark:text-gray-400" />
                    Explore
                  </a>
                  
                  <a 
                    href="#" 
                    className="flex items-center px-2 py-1.5 text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-2 text-gray-500 dark:text-gray-400" />
                    Feed
                  </a>
                  
                  <a 
                    href="#" 
                    className="flex items-center px-2 py-1.5 text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Bell className="h-3.5 w-3.5 mr-2 text-gray-500 dark:text-gray-400" />
                    Notifications
                  </a>
                  
                  <a 
                    href="#" 
                    className="flex items-center px-2 py-1.5 text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Users className="h-3.5 w-3.5 mr-2 text-gray-500 dark:text-gray-400" />
                    Members
                  </a>
                  
                  <Separator className="my-1.5" />
                  
                  <a 
                    href="#" 
                    className="flex items-center px-2 py-1.5 text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-2 text-gray-500 dark:text-gray-400" />
                    Discussions
                  </a>
                  
                  <a 
                    href="#" 
                    className="flex items-center px-2 py-1.5 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <FileText className="h-3.5 w-3.5 mr-2 text-gray-700 dark:text-gray-300" />
                    Articles
                  </a>
                  
                  <a 
                    href="#" 
                    className="flex items-center px-2 py-1.5 text-xs font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Calendar className="h-3.5 w-3.5 mr-2 text-gray-500 dark:text-gray-400" />
                    Events
                  </a>
                </nav>
              </div>
              
              {/* Main content - more compact */}
              <div className="flex-1 p-3">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">Articles</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Advice and answers from the Tribe Team
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <button className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-0.5 rounded">
                      <Bell className="h-4 w-4" />
                    </button>
                    
                    <div className="ml-1.5">
                      <button className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 p-0.5 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <Tabs defaultValue="all" className="mb-3">
                  <TabsList className="bg-gray-100 dark:bg-gray-800">
                    <TabsTrigger value="all" className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">View all</TabsTrigger>
                    <TabsTrigger value="design" className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Design</TabsTrigger>
                    <TabsTrigger value="product" className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Product</TabsTrigger>
                    <TabsTrigger value="dev" className="text-xs data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Development</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Minimal Article Card 1 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="h-32 bg-purple-100 flex items-center justify-center overflow-hidden">
                      <svg className="w-full h-full object-cover" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,100 C150,200 250,0 400,100 L400,200 L0,200 Z" fill="#8B5CF6" />
                        <path d="M0,100 C150,0 250,200 400,100 L400,200 L0,200 Z" fill="#A78BFA" opacity="0.7" />
                      </svg>
                    </div>
                    <div className="p-2.5">
                      <div className="flex items-center mb-1.5">
                        <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">Design</Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">UX review presentations</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        How do you create compelling presentations that wow your colleagues and impress your managers
                      </p>
                      <div className="flex items-center mt-2">
                        <Avatar className="h-5 w-5 mr-1.5">
                          <img src="https://github.com/shadcn.png" alt="Olivia Rhye" />
                        </Avatar>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">
                          <div>Olivia Rhye</div>
                          <div>20 Jan 2024</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Minimal Article Card 2 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="h-32 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" 
                        alt="People discussing work" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2.5">
                      <div className="flex items-center mb-1.5">
                        <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">Design</Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Migrating to Linear 101</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.
                      </p>
                      <div className="flex items-center mt-2">
                        <Avatar className="h-5 w-5 mr-1.5">
                          <img src="https://github.com/shadcn.png" alt="Olivia Rhye" />
                        </Avatar>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">
                          <div>Olivia Rhye</div>
                          <div>20 Jan 2024</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Minimal Article Card 3 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="h-32 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-gray-400">
                        <path fill="currentColor" d="M 100 20 L 120 80 L 180 80 L 130 110 L 150 170 L 100 140 L 50 170 L 70 110 L 20 80 L 80 80 Z" />
                        <path fill="currentColor" d="M 100 40 L 120 100 L 180 100 L 130 130 L 150 190 L 100 160 L 50 190 L 70 130 L 20 100 L 80 100 Z" opacity="0.5" transform="rotate(15)" />
                      </svg>
                    </div>
                    <div className="p-2.5">
                      <div className="flex items-center mb-1.5">
                        <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">Design</Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Building your API stack</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        The rise of RESTful APIs has been met by a rise in tools for creating, testing, and managing them.
                      </p>
                      <div className="flex items-center mt-2">
                        <Avatar className="h-5 w-5 mr-1.5">
                          <img src="https://github.com/shadcn.png" alt="Olivia Rhye" />
                        </Avatar>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">
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
      </div>
    </DashboardLayout>
  );
}