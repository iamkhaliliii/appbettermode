import { useLocation } from "wouter";
import { 
  Search, 
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
  MessageSquare,
  BarChart, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingBag, 
  ClipboardList,
  Lock,
  Files,
  Database,
  PanelTop,
  Layers2,
  FilePlus,
  Folder,
  FolderPlus
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useState } from "react";

// ================== Common UI Components ==================

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

// ================== Header Components ==================

interface SimpleHeaderProps {
  title: string;
  subtitle?: string;
}

function SimpleHeader({ title, subtitle }: SimpleHeaderProps) {
  return (
    <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 pb-1 pt-2 px-3">
      <h2 className="text-base font-medium text-gray-900 dark:text-white">{title}</h2>
      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
      )}
    </div>
  );
}

interface BackHeaderProps {
  title: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
}

function BackHeader({ title, icon, iconBgColor = "bg-purple-50", iconColor = "text-purple-500" }: BackHeaderProps) {
  return (
    <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 pb-1">
      {/* First line - only back button */}
      <div className="flex items-center py-1 px-2">
        <button 
          onClick={() => window.history.back()}
          className="p-0.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="h-3 w-3" />
        </button>
      </div>
      
      {/* Second line - icon/title on left, settings on right */}
      <div className="flex items-center justify-between py-1 px-2">
        <div className="flex items-center gap-1">
          {icon && (
            <div className={`${iconBgColor} dark:bg-opacity-20 p-1.5 rounded`}>
              {icon}
            </div>
          )}
          <span className="text-lg font-bold text-gray-700 dark:text-gray-300 tracking-wide">{title}</span>
        </div>
        
        <button 
          className="p-0.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded transition-colors"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface SearchHeaderProps {
  title: string;
  placeholder?: string;
  onSearch?: (term: string) => void;
}

function SearchHeader({ title, placeholder = "Search...", onSearch }: SearchHeaderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (onSearch) onSearch(term);
  };
  
  return (
    <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 pb-2 pt-2 px-3">
      <h2 className="text-base font-medium text-gray-900 dark:text-white mb-2">{title}</h2>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input 
          type="text"
          className="pl-9 text-sm py-1 h-8"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
}

// ================== Content Components ==================

interface SimpleListProps {
  items: {
    href: string;
    icon?: React.ReactNode;
    label: string;
    isActive?: boolean;
    badge?: string;
  }[];
}

function SimpleList({ items }: SimpleListProps) {
  return (
    <div className="space-y-1 p-3 pt-2">
      {items.map((item, index) => (
        <SideNavItem
          key={index}
          href={item.href}
          icon={item.icon}
          isActive={item.isActive}
          badge={item.badge}
        >
          {item.label}
        </SideNavItem>
      ))}
    </div>
  );
}

interface AccordionListProps {
  sections: {
    title: string;
    value: string;
    items: {
      id: string;
      label: string;
      icon?: React.ReactNode;
      hasToggle?: boolean;
      toggleCallback?: (checked: boolean) => void;
    }[];
  }[];
}

function AccordionList({ sections }: AccordionListProps) {
  return (
    <div className="mt-2">
      {sections.map((section) => (
        <div key={section.value} className="mb-2">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={section.value} className="border-0">
              <AccordionTrigger className="py-1 px-1 hover:no-underline">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                  {section.title}
                </h4>
              </AccordionTrigger>
              <AccordionContent className="pt-1 pb-0 px-1">
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <div 
                      key={item.id}
                      id={item.id} 
                      className="flex items-center justify-between py-2 px-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-sm group transition-colors duration-150"
                    >
                      <div className="flex items-center gap-1.5">
                        {item.icon && <span className="h-3.5 w-3.5 text-gray-500">{item.icon}</span>}
                        <span className="text-xs text-gray-600 dark:text-gray-300">{item.label}</span>
                      </div>
                      {item.hasToggle && (
                        <Switch 
                          id={`${item.id}-toggle`} 
                          className="h-3 w-5 data-[state=checked]:bg-gray-500"
                          onCheckedChange={item.toggleCallback}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  );
}

interface TitleWithButtonProps {
  title: string;
  buttonText: string;
  buttonIcon?: React.ReactNode;
  onClick?: () => void;
  dropdownItems?: {
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
  }[];
}

function TitleWithButton({ title, buttonText, buttonIcon, onClick, dropdownItems }: TitleWithButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const handleButtonClick = () => {
    if (dropdownItems && dropdownItems.length > 0) {
      setIsDropdownOpen(!isDropdownOpen);
    } else if (onClick) {
      onClick();
    }
  };
  
  return (
    <div className="mt-0">
      <div className="pb-1 pt-1 px-2">
        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">{title}</h4>
      </div>
      <div className="pt-1 pb-0 px-1">
        <div className="relative">
          <button
            className="flex items-center justify-between w-full py-1.5 px-2 text-[11px] border border-gray-200 dark:border-gray-700 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-100"
            onClick={handleButtonClick}
          >
            <div className="flex items-center">
              {buttonIcon || <Plus className="h-3 w-3 mr-1.5 text-gray-500" />}
              <span>{buttonText}</span>
            </div>
            {dropdownItems && dropdownItems.length > 0 && (
              <ChevronDown className="h-3 w-3 text-gray-500" />
            )}
          </button>
          
          {dropdownItems && dropdownItems.length > 0 && (
            <div 
              className={`absolute left-0 right-0 z-10 mt-1 ${!isDropdownOpen && 'hidden'} rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm`}
            >
              <div className="py-1">
                {dropdownItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center gap-2 px-2 py-1.5 text-[10px] hover:bg-gray-50 dark:hover:bg-gray-800/70 cursor-pointer text-gray-600 dark:text-gray-400"
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      setIsDropdownOpen(false);
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ================== Main Enhanced Sidebar Component ==================

export function EnhancedSidebar() {
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
  
  // -------------------- Dashboard Sidebar --------------------
  const renderDashboardSidebar = () => (
    <>
      <SimpleHeader 
        title="Dashboard" 
        subtitle="Overview and quick actions" 
      />
      <SimpleList 
        items={[
          {
            href: "/dashboard",
            icon: <BarChart className="h-4 w-4" />,
            label: "Overview",
            isActive: location === '/dashboard'
          },
          {
            href: "/dashboard/performance",
            icon: <TrendingUp className="h-4 w-4" />,
            label: "Performance",
            isActive: location === '/dashboard/performance'
          },
          {
            href: "/dashboard/customers",
            icon: <Users className="h-4 w-4" />,
            label: "Customers",
            isActive: location === '/dashboard/customers',
            badge: "New"
          },
          {
            href: "/dashboard/revenue",
            icon: <DollarSign className="h-4 w-4" />,
            label: "Revenue",
            isActive: location === '/dashboard/revenue'
          },
          {
            href: "/dashboard/inventory",
            icon: <ShoppingBag className="h-4 w-4" />,
            label: "Inventory",
            isActive: location === '/dashboard/inventory'
          },
          {
            href: "/dashboard/reports",
            icon: <ClipboardList className="h-4 w-4" />,
            label: "Reports",
            isActive: location === '/dashboard/reports'
          }
        ]}
      />
    </>
  );

  // -------------------- Design Studio Feed Sidebar --------------------
  const renderDesignStudioFeedSidebar = () => {
    // Layout Component toggles
    const handleHeaderToggle = (checked: boolean) => {
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
    };
    
    const handleRightSidebarToggle = (checked: boolean) => {
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
    };
    
    const handleLeftSidebarToggle = (checked: boolean) => {
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
    };
    
    const handleFooterToggle = (checked: boolean) => {
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
    };
    
    return (
      <div className="p-2">
        <BackHeader 
          title="Feed"
          icon={<MessageSquare className="h-5 w-5 text-purple-500" />}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-500"
        />
        
        <AccordionList 
          sections={[
            {
              title: "Layout Components",
              value: "layout-components",
              items: [
                {
                  id: "header-section",
                  label: "Header",
                  icon: <Layout />,
                  hasToggle: true,
                  toggleCallback: handleHeaderToggle
                },
                {
                  id: "right-sidebar-section",
                  label: "Right Sidebar",
                  icon: <PanelRight />,
                  hasToggle: true,
                  toggleCallback: handleRightSidebarToggle
                },
                {
                  id: "left-sidebar-section",
                  label: "Left Sidebar",
                  icon: <PanelLeft />,
                  hasToggle: true,
                  toggleCallback: handleLeftSidebarToggle
                },
                {
                  id: "footer-section",
                  label: "Footer",
                  icon: <Columns />,
                  hasToggle: true,
                  toggleCallback: handleFooterToggle
                }
              ]
            }
          ]}
        />
        
        <TitleWithButton 
          title="Sections and Blocks"
          buttonText="Add Block"
          buttonIcon={<Plus className="h-3 w-3 mr-1.5 text-gray-500" />}
          dropdownItems={[
            {
              id: "text-block",
              label: "Text",
              icon: <File className="h-2.5 w-2.5 text-gray-500" />
            },
            {
              id: "image-block",
              label: "Image",
              icon: <Eye className="h-2.5 w-2.5 text-gray-500" />
            },
            {
              id: "video-block",
              label: "Video",
              icon: <Pencil className="h-2.5 w-2.5 text-gray-500" />
            },
            {
              id: "button-block",
              label: "Button",
              icon: <FileBox className="h-2.5 w-2.5 text-gray-500" />
            },
            {
              id: "form-block",
              label: "Form",
              icon: <FileCog className="h-2.5 w-2.5 text-gray-500" />
            }
          ]}
        />
      </div>
    );
  };
  
  // -------------------- Design Studio Sidebar --------------------
  const renderDesignStudioSidebar = () => (
    <>
      <SearchHeader 
        title="Design Studio"
        placeholder="Search components..."
      />
      <SimpleList 
        items={[
          {
            href: "/design-studio/components",
            icon: <Layout className="h-4 w-4" />,
            label: "Components",
            isActive: isActiveUrl('/design-studio/components')
          },
          {
            href: "/design-studio/templates",
            icon: <Files className="h-4 w-4" />,
            label: "Templates",
            isActive: isActiveUrl('/design-studio/templates')
          },
          {
            href: "/design-studio/spaces",
            icon: <Folder className="h-4 w-4" />,
            label: "Spaces",
            isActive: isActiveUrl('/design-studio/spaces'),
            badge: "New"
          }
        ]}
      />
    </>
  );
  
  // -------------------- Content Sidebar --------------------
  const renderContentSidebar = () => (
    <>
      <SimpleHeader 
        title="Content"
        subtitle="Manage your content"
      />
      <SimpleList
        items={[
          {
            href: "/content/posts",
            icon: <File className="h-4 w-4" />,
            label: "Posts",
            isActive: isActiveUrl('/content/posts')
          },
          {
            href: "/content/pages",
            icon: <Files className="h-4 w-4" />,
            label: "Pages",
            isActive: isActiveUrl('/content/pages')
          },
          {
            href: "/content/media",
            icon: <Eye className="h-4 w-4" />,
            label: "Media",
            isActive: isActiveUrl('/content/media')
          }
        ]}
      />
    </>
  );
  
  // -------------------- Main Render Logic --------------------
  const renderSidebarContent = () => {
    // Design Studio spaces feed
    if (location === '/design-studio/spaces/feed') {
      return renderDesignStudioFeedSidebar();
    }
    
    // Design Studio
    if (location.startsWith('/design-studio')) {
      return renderDesignStudioSidebar();
    }
    
    // Dashboard
    if (location.startsWith('/dashboard')) {
      return renderDashboardSidebar();
    }
    
    // Content
    if (location.startsWith('/content')) {
      return renderContentSidebar();
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