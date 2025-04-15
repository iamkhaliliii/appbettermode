import { useLocation } from "wouter";
import { 
  Settings, 
  ChevronDown,
  Layout,
  Plus,
  FileBox,
  FileCog,
  File,
  Pencil,
  Eye,
  PanelLeft,
  PanelRight,
  Columns,
  ArrowLeft,
  MessageSquare
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";

interface SideNavItemProps {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
  badge?: string;
}

function SideNavItem({ href, icon, children, isActive = false, badge }: SideNavItemProps) {
  return (
    <a 
      href={href}
      className={`
        flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors
        ${isActive 
          ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white' 
          : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50'
        }
      `}
    >
      <span className="flex items-center gap-3">
        {icon && <span className="text-gray-500 dark:text-gray-400">{icon}</span>}
        <span>{children}</span>
      </span>
      
      {badge && (
        <span className="ml-auto rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-500 dark:bg-blue-500/20">
          {badge}
        </span>
      )}
    </a>
  );
}

export function CustomSecondarySidebar() {
  const [location] = useLocation();

  // Helper function to check if a URL is active
  const isActiveUrl = (url: string): boolean => {
    if (location === url) return true;
    if (url.includes("/") && location.startsWith(url)) return true;
    
    // Special case for root menu items
    const mainSection = url.split("/")[1]; // e.g. "content" from "/content/posts"
    if (location === `/${mainSection}`) return true;
    
    return false;
  };

  // Render design studio spaces feed sidebar with minimal design
  const renderDesignStudioSpacesFeedSidebar = () => {
    return (
      <div className="p-2">
        {/* Two line header layout - ultra minimalist */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 pb-1">
          {/* First line - only back button */}
          <div className="flex items-center py-1">
            <button 
              onClick={() => window.history.back()}
              className="p-0.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-3 w-3" />
            </button>
          </div>
          
          {/* Second line - icon/title on left, settings on right */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-1">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-1.5 rounded">
                <MessageSquare className="h-5 w-5 text-purple-500" />
              </div>
              <span className="text-lg font-bold text-gray-700 dark:text-gray-300 tracking-wide">Feed</span>
            </div>
            
            <button 
              className="p-0.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded transition-colors"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Sections and Blocks - ultra minimal design */}
        <div>
          <div className="mt-2">
            
            {/* Navigation Section with Toggles - Ultra minimal version */}
            <div className="mb-2">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="layout-components" className="border-0">
                  <AccordionTrigger className="py-1 px-1 hover:no-underline">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">Layout Components</h4>
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 pb-0 px-1">
                    <div className="space-y-2">
                      {/* Header Navigation Row */}
                      <div 
                        id="header-section" 
                        className="flex items-center justify-between py-2 px-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-sm group transition-colors duration-150"
                      >
                        <div className="flex items-center gap-1.5">
                          <Layout className="h-3.5 w-3.5 text-gray-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-300">Header</span>
                        </div>
                        <Switch 
                          id="header-toggle" 
                          className="h-3 w-5 data-[state=checked]:bg-gray-500"
                          onCheckedChange={(checked) => {
                            // Toggle visibility of options
                            const options = document.getElementById('header-options');
                            if (options) {
                              options.classList.toggle('hidden', !checked);
                            }
                            
                            // Using only community elements now
                            // Also change the community header with animation
                            const communityHeader = document.getElementById('community-header');
                            if (communityHeader) {
                              if (checked) {
                                communityHeader.style.display = "flex";
                                communityHeader.style.opacity = "1";
                                communityHeader.style.transform = "translateY(0)";
                                communityHeader.style.backgroundColor = 'rgba(219, 234, 254, 0.1)';
                                communityHeader.style.borderBottom = '1px solid var(--border)';
                              } else {
                                setTimeout(() => {
                                  communityHeader.style.display = "none";
                                }, 300);
                                communityHeader.style.opacity = "0";
                                communityHeader.style.transform = "translateY(-20px)";
                              }
                            }
                          }} 
                        />
                      </div>
                      
                      {/* Right Sidebar Navigation Row */}
                      <div 
                        id="right-sidebar-section" 
                        className="flex items-center justify-between py-2 px-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-sm group transition-colors duration-150"
                      >
                        <div className="flex items-center gap-1.5">
                          <PanelRight className="h-3.5 w-3.5 text-gray-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-300">Right Sidebar</span>
                        </div>
                        <Switch 
                          id="right-sidebar-toggle" 
                          className="h-3 w-5 data-[state=checked]:bg-gray-500"
                          onCheckedChange={(checked) => {
                            // Using only community elements with animation  
                            // Also change the community right sidebar with animation
                            const communityRightSidebar = document.getElementById('community-right-sidebar');
                            if (communityRightSidebar) {
                              if (checked) {
                                communityRightSidebar.style.display = "block";
                                communityRightSidebar.style.transform = "translateX(0)";
                                communityRightSidebar.style.opacity = "1";
                                communityRightSidebar.style.width = '9rem';
                                communityRightSidebar.style.borderLeft = '1px solid var(--border)';
                                communityRightSidebar.style.backgroundColor = 'rgba(254, 226, 226, 0.1)';
                              } else {
                                setTimeout(() => {
                                  communityRightSidebar.style.display = "none";
                                }, 300);
                                communityRightSidebar.style.transform = "translateX(20px)";
                                communityRightSidebar.style.opacity = "0";
                                communityRightSidebar.style.width = '0';
                                communityRightSidebar.style.padding = '0';
                                communityRightSidebar.style.overflow = "hidden";
                              }
                            }
                          }} 
                        />
                      </div>
                      
                      {/* Left Sidebar Navigation Row */}
                      <div 
                        id="left-sidebar-section" 
                        className="flex items-center justify-between py-2 px-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-sm group transition-colors duration-150"
                      >
                        <div className="flex items-center gap-1.5">
                          <PanelLeft className="h-3.5 w-3.5 text-gray-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-300">Left Sidebar</span>
                        </div>
                        <Switch 
                          id="left-sidebar-toggle" 
                          className="h-3 w-5 data-[state=checked]:bg-gray-500"
                          onCheckedChange={(checked) => {
                            // Using only community elements with animation
                            // Also change the community left sidebar with animation
                            const communityLeftSidebar = document.getElementById('community-left-sidebar');
                            if (communityLeftSidebar) {
                              if (checked) {
                                communityLeftSidebar.style.transform = "translateX(0)";
                                communityLeftSidebar.style.opacity = "1";
                                communityLeftSidebar.style.backgroundColor = 'rgba(220, 252, 231, 0.1)'; 
                                communityLeftSidebar.style.borderRight = '1px solid var(--border)';
                                communityLeftSidebar.style.width = '9rem';
                              } else {
                                communityLeftSidebar.style.transform = "translateX(-20px)";
                                communityLeftSidebar.style.width = '0';
                                communityLeftSidebar.style.padding = '0';
                                communityLeftSidebar.style.opacity = "0";
                                communityLeftSidebar.style.overflow = "hidden";
                              }
                            }
                          }} 
                        />
                      </div>
                      
                      {/* Footer Navigation Row */}
                      <div 
                        id="footer-section" 
                        className="flex items-center justify-between py-2 px-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-sm group transition-colors duration-150"
                      >
                        <div className="flex items-center gap-1.5">
                          <Columns className="h-3.5 w-3.5 text-gray-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-300">Footer</span>
                        </div>
                        <Switch 
                          id="footer-toggle" 
                          className="h-3 w-5 data-[state=checked]:bg-gray-500"
                          onCheckedChange={(checked) => {
                            // Using only community elements with animation
                            // Also change the community footer with animation
                            const communityFooter = document.getElementById('community-footer');
                            if (communityFooter) {
                              if (checked) {
                                communityFooter.style.display = "flex";
                                communityFooter.style.opacity = "1";
                                communityFooter.style.transform = "translateY(0)";
                                communityFooter.style.backgroundColor = 'rgba(254, 240, 138, 0.1)'; 
                                communityFooter.style.borderTop = '1px solid var(--border)';
                              } else {
                                setTimeout(() => {
                                  communityFooter.style.display = "none";
                                }, 300);
                                communityFooter.style.opacity = "0";
                                communityFooter.style.transform = "translateY(20px)";
                              }
                            }
                          }} 
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            {/* Content Blocks section */}
            <div className="mt-0">
              <div className="pb-1 pt-1 px-2">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">Sections and Blocks</h4>
              </div>
              <div className="pt-1 pb-0 px-1">
                <div className="relative">
                  <button
                    className="flex items-center justify-between w-full py-1.5 px-2 text-[11px] border border-gray-200 dark:border-gray-700 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-100"
                    onClick={() => {
                      const dropdown = document.getElementById('blocks-dropdown');
                      if (dropdown) {
                        dropdown.classList.toggle('hidden');
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <Plus className="h-3 w-3 mr-1.5 text-gray-500" />
                      <span>Add Block</span>
                    </div>
                    <ChevronDown className="h-3 w-3 text-gray-500" />
                  </button>
                  
                  {/* Dropdown for block options - Minimalist version */}
                  <div id="blocks-dropdown" className="absolute left-0 right-0 z-10 mt-1 hidden rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                    <div className="py-1">
                      <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] hover:bg-gray-50 dark:hover:bg-gray-800/70 cursor-pointer text-gray-600 dark:text-gray-400">
                        <File className="h-2.5 w-2.5 text-gray-500" />
                        <span>Text</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] hover:bg-gray-50 dark:hover:bg-gray-800/70 cursor-pointer text-gray-600 dark:text-gray-400">
                        <Eye className="h-2.5 w-2.5 text-gray-500" />
                        <span>Image</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] hover:bg-gray-50 dark:hover:bg-gray-800/70 cursor-pointer text-gray-600 dark:text-gray-400">
                        <Pencil className="h-2.5 w-2.5 text-gray-500" />
                        <span>Video</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] hover:bg-gray-50 dark:hover:bg-gray-800/70 cursor-pointer text-gray-600 dark:text-gray-400">
                        <FileBox className="h-2.5 w-2.5 text-gray-500" />
                        <span>Button</span>
                      </div>
                      <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] hover:bg-gray-50 dark:hover:bg-gray-800/70 cursor-pointer text-gray-600 dark:text-gray-400">
                        <FileCog className="h-2.5 w-2.5 text-gray-500" />
                        <span>Form</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main sidebar render logic
  const renderSidebarContent = () => {
    if (location === '/design-studio/spaces/feed') {
      return renderDesignStudioSpacesFeedSidebar();
    }
    
    // Default fallback
    return (
      <div className="p-3">
        <p className="text-sm text-gray-500">Select a section</p>
      </div>
    );
  };

  return (
    <aside className="secondary-sidebar bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-3rem)] overflow-y-auto sticky top-12 w-64">
      {renderSidebarContent()}
    </aside>
  );
}