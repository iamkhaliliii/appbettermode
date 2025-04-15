import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingBag, 
  ClipboardList, 
  Settings, 
  Lock,
  ChevronDown,
  Files,
  Layout,
  Database,
  PanelTop,
  Layers2,
  FilePlus,
  Folder,
  FolderPlus,
  Search,
  Plus
} from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { useState } from "react";

interface SideNavItemProps {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
  badge?: string;
}

function SideNavItem({ href, icon, children, isActive = false, badge }: SideNavItemProps) {
  // Debug the active state
  // console.log(`Item ${href} is active: ${isActive}`);
  return (
      <Link href={href}>
        <div
          className={cn(
            "flex items-center px-2.5 py-1.5 text-sm cursor-pointer my-0.5 transition-colors duration-150",
            isActive 
              ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-md" 
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 rounded"
          )}
        >
          {icon && (
            <span className={cn(
              "flex-shrink-0 mr-2 text-[14px]",
              isActive 
                ? "text-gray-900 dark:text-white" 
                : "text-gray-600 dark:text-gray-400"
            )}>
              {icon}
            </span>
          )}
          <span className="font-medium">{children}</span>
          {badge && (
            <span className={cn(
              "ml-auto text-[10px] px-1.5 py-0.5 rounded-full",
              isActive
                ? "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            )}>
              {badge}
            </span>
          )}
        </div>
      </Link>
  );
}

// Tree view folder component
interface TreeFolderProps {
  name: string;
  path: string;
  level?: number;
  isExpanded?: boolean;
  children?: React.ReactNode;
}

function TreeFolder({ name, path, level = 0, isExpanded = false, children }: TreeFolderProps) {
  const [expanded, setExpanded] = useState(isExpanded);
  const [location] = useLocation();
  const isActive = location === path;
  
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setExpanded(!expanded);
  };
  
  return (
    <div className="folder-tree-item">
      <div
        className={cn(
          "flex items-center px-2.5 py-1.5 text-sm cursor-pointer my-0.5 transition-colors duration-150",
          isActive 
            ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-md" 
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 rounded"
        )}
        style={{ paddingLeft: `${(level * 12) + 10}px` }}
      >
        <span 
          className="w-4 h-4 mr-2 flex-shrink-0 flex items-center justify-center"
          onClick={handleToggle}
        >
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-gray-500 transition-transform",
              expanded ? "transform rotate-0" : "transform -rotate-90"
            )}
          />
        </span>
        <Folder className="h-4 w-4 mr-2 text-gray-500" />
        <Link href={path}>
          <span className="font-medium">{name}</span>
        </Link>
      </div>
      
      {expanded && children && (
        <div className="pl-2">
          {children}
        </div>
      )}
    </div>
  );
}

export function SecondarySidebar() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const renderDashboardSidebar = () => (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Overview and quick actions</p>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/dashboard" 
          icon={<BarChart className="h-4 w-4" />} 
          isActive={location === '/dashboard'}
        >
          Overview
        </SideNavItem>
        
        <SideNavItem 
          href="/dashboard/performance" 
          icon={<TrendingUp className="h-4 w-4" />} 
          isActive={location === '/dashboard/performance'}
        >
          Performance
        </SideNavItem>
        
        <SideNavItem 
          href="/dashboard/customers" 
          icon={<Users className="h-4 w-4" />} 
          isActive={location === '/dashboard/customers'}
          badge="New"
        >
          Customers
        </SideNavItem>
        
        <SideNavItem 
          href="/dashboard/revenue" 
          icon={<DollarSign className="h-4 w-4" />} 
          isActive={location === '/dashboard/revenue'}
        >
          Revenue
        </SideNavItem>
        
        <SideNavItem 
          href="/dashboard/inventory" 
          icon={<ShoppingBag className="h-4 w-4" />} 
          isActive={location === '/dashboard/inventory'}
        >
          Inventory
        </SideNavItem>
        
        <SideNavItem 
          href="/dashboard/reports" 
          icon={<ClipboardList className="h-4 w-4" />} 
          isActive={location === '/dashboard/reports'}
        >
          Reports
        </SideNavItem>
      </div>
    </div>
  );

  const renderContentSidebar = () => (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">Content</h2>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/content/posts"
          isActive={isActiveUrl('/content/posts') || location === '/content'}
        >
          Posts
        </SideNavItem>
        
        <SideNavItem 
          href="/content/spaces"
          isActive={isActiveUrl('/content/spaces')}
        >
          Spaces
        </SideNavItem>

        <SideNavItem 
          href="/content/comments"
          isActive={isActiveUrl('/content/comments')}
        >
          Comments
        </SideNavItem>
        
        <SideNavItem 
          href="/content/tags"
          isActive={isActiveUrl('/content/tags')}
        >
          Tags
        </SideNavItem>
      </div>
    </div>
  );

  const renderPeopleSidebar = () => (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">People</h2>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/people/members"
          isActive={isActiveUrl('/people/members') || location === '/people'}
        >
          Members
        </SideNavItem>
        
        <SideNavItem 
          href="/people/staff"
          isActive={isActiveUrl('/people/staff')}
        >
          Staff
        </SideNavItem>
        
        <SideNavItem 
          href="/people/invitations"
          isActive={isActiveUrl('/people/invitations')}
        >
          Invitations
        </SideNavItem>
        
        <SideNavItem 
          href="/people/profile-fields"
          isActive={isActiveUrl('/people/profile-fields')}
        >
          Profile fields
        </SideNavItem>
        
        <SideNavItem 
          href="/people/badges"
          isActive={isActiveUrl('/people/badges')}
        >
          Badges
        </SideNavItem>
      </div>
    </div>
  );

  const renderSettingsSidebar = () => (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">Settings</h2>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/settings/my-details" 
          isActive={isActiveUrl('/settings/my-details') || location === '/settings'} 
        >
          My details
        </SideNavItem>
        
        <SideNavItem 
          href="/settings/profile" 
          isActive={isActiveUrl('/settings/profile')} 
        >
          Profile
        </SideNavItem>
        
        <SideNavItem 
          href="/settings/password" 
          isActive={isActiveUrl('/settings/password')} 
        >
          Password
        </SideNavItem>
        
        <SideNavItem 
          href="/settings/team" 
          isActive={isActiveUrl('/settings/team')} 
        >
          Team
        </SideNavItem>
        
        <SideNavItem 
          href="/settings/billing" 
          isActive={isActiveUrl('/settings/billing')} 
        >
          Billing
        </SideNavItem>
        
        <SideNavItem 
          href="/settings/notifications" 
          isActive={isActiveUrl('/settings/notifications')} 
        >
          Notifications
        </SideNavItem>
        
        <SideNavItem 
          href="/settings/integrations" 
          isActive={isActiveUrl('/settings/integrations')} 
        >
          Integrations
        </SideNavItem>
      </div>
    </div>
  );

  const renderDesignStudioSidebar = () => {
    // Default expanded accordion value
    const defaultExpanded = location.includes('/design-studio/spaces') ? 'spaces' :
                           location.includes('/design-studio/templates') ? 'templates' :
                           location.includes('/design-studio/collections') ? 'collections' :
                           location.includes('/design-studio/utility') ? 'utility' : '';
  
    return (
      <div className="p-3">
        <div className="mb-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">Design studio</h2>
              <div className="flex items-center space-x-2">
                <button 
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" 
                  onClick={() => setShowSearch(!showSearch)}
                >
                  <Search className="h-3.5 w-3.5 text-gray-500" />
                </button>
                <div className="relative group">
                  <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Plus className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                  <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="py-1">
                      <a href="#" className="block px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Add new space</a>
                      <a href="#" className="block px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Add new folder</a>
                      <a href="#" className="block px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Add new page</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {showSearch && (
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <Search className="w-3.5 h-3.5 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full py-1 pl-7 pr-2 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-gray-300 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
        
        <Accordion type="single" collapsible defaultValue={defaultExpanded} className="space-y-1">
          <AccordionItem value="spaces" className="border-0">
            <AccordionTrigger className="flex items-center py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline">
              <div className="flex items-center">
                <Files className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium text-sm">Spaces</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-1">
              <div className="border-l border-gray-200 dark:border-gray-700 ml-2 pl-2">
                {/* Tree view of folders */}
                <TreeFolder 
                  name="Main Website" 
                  path="/design-studio/spaces/main-website" 
                  isExpanded={location.startsWith('/design-studio/spaces/main-website')}
                >
                  <TreeFolder 
                    name="Home" 
                    path="/design-studio/spaces/main-website/home" 
                    level={1}
                  />
                  <TreeFolder 
                    name="About" 
                    path="/design-studio/spaces/main-website/about" 
                    level={1}
                  />
                  <TreeFolder 
                    name="Blog" 
                    path="/design-studio/spaces/main-website/blog" 
                    level={1}
                  />
                </TreeFolder>
                
                <TreeFolder 
                  name="Members Area" 
                  path="/design-studio/spaces/members" 
                  isExpanded={location.startsWith('/design-studio/spaces/members')}
                >
                  <TreeFolder 
                    name="Dashboard" 
                    path="/design-studio/spaces/members/dashboard" 
                    level={1}
                  />
                  <TreeFolder 
                    name="Profile" 
                    path="/design-studio/spaces/members/profile" 
                    level={1}
                  />
                </TreeFolder>
                
                <div className="flex items-center py-1.5 px-2.5 text-sm text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer">
                  <FolderPlus className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Create new space</span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="templates" className="border-0">
            <AccordionTrigger className="flex items-center py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline">
              <div className="flex items-center">
                <Layers2 className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium text-sm">Templates</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-1">
              <div className="space-y-1 pl-6">
                <SideNavItem 
                  href="/design-studio/templates/page"
                  isActive={isActiveUrl('/design-studio/templates/page')}
                >
                  Page templates
                </SideNavItem>
                <SideNavItem 
                  href="/design-studio/templates/email"
                  isActive={isActiveUrl('/design-studio/templates/email')}
                >
                  Email templates
                </SideNavItem>
                <SideNavItem 
                  href="/design-studio/templates/popup"
                  isActive={isActiveUrl('/design-studio/templates/popup')}
                >
                  Popup templates
                </SideNavItem>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="collections" className="border-0">
            <AccordionTrigger className="flex items-center py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline">
              <div className="flex items-center">
                <Database className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium text-sm">CMS Collections</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-1">
              <div className="space-y-1 pl-6">
                <SideNavItem 
                  href="/design-studio/collections/blog"
                  isActive={isActiveUrl('/design-studio/collections/blog')}
                >
                  Blog posts
                </SideNavItem>
                <SideNavItem 
                  href="/design-studio/collections/products"
                  isActive={isActiveUrl('/design-studio/collections/products')}
                >
                  Products
                </SideNavItem>
                <SideNavItem 
                  href="/design-studio/collections/categories"
                  isActive={isActiveUrl('/design-studio/collections/categories')}
                >
                  Categories
                </SideNavItem>
                <SideNavItem 
                  href="/design-studio/collections/authors"
                  isActive={isActiveUrl('/design-studio/collections/authors')}
                >
                  Authors
                </SideNavItem>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="utility" className="border-0">
            <AccordionTrigger className="flex items-center py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline">
              <div className="flex items-center">
                <PanelTop className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium text-sm">Utility Pages</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-1">
              <div className="space-y-1 pl-6">
                <SideNavItem 
                  href="/design-studio/utility/404"
                  isActive={isActiveUrl('/design-studio/utility/404')}
                >
                  404 Page
                </SideNavItem>
                <SideNavItem 
                  href="/design-studio/utility/password"
                  isActive={isActiveUrl('/design-studio/utility/password')}
                >
                  Password Protected
                </SideNavItem>
                <SideNavItem 
                  href="/design-studio/utility/search"
                  isActive={isActiveUrl('/design-studio/utility/search')}
                >
                  Search Results
                </SideNavItem>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="mt-4 space-y-1">
          <SideNavItem 
            href="/design-studio/header"
            isActive={isActiveUrl('/design-studio/header')}
            icon={<Layout className="h-4 w-4" />}
          >
            Header and Sidebar
          </SideNavItem>
        </div>
      </div>
    );
  };
  
  const renderAppearanceSidebar = () => (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">Appearance</h2>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/appearance/logos"
          isActive={isActiveUrl('/appearance/logos') || location === '/appearance'}
        >
          Logos
        </SideNavItem>
        
        <SideNavItem 
          href="/appearance/themes"
          isActive={isActiveUrl('/appearance/themes')}
        >
          Themes
        </SideNavItem>
        
        <SideNavItem 
          href="/appearance/typographies"
          isActive={isActiveUrl('/appearance/typographies')}
        >
          Typographies
        </SideNavItem>
        
        <SideNavItem 
          href="/appearance/styles"
          isActive={isActiveUrl('/appearance/styles')}
        >
          Styles
        </SideNavItem>
      </div>
    </div>
  );
  
  const renderBillingSidebar = () => (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">Billing</h2>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/billing/summary"
          isActive={isActiveUrl('/billing/summary') || location === '/billing'}
        >
          Summary
        </SideNavItem>
        
        <SideNavItem 
          href="/billing/subscription"
          isActive={isActiveUrl('/billing/subscription')}
        >
          Subscription plans
        </SideNavItem>
        
        <SideNavItem 
          href="/billing/usage"
          isActive={isActiveUrl('/billing/usage')}
        >
          Service usage
        </SideNavItem>
      </div>
    </div>
  );
  
  const renderReportsSidebar = () => (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">Reports</h2>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/reports/overview"
          isActive={isActiveUrl('/reports/overview') || location === '/reports'}
        >
          Overview
        </SideNavItem>
        
        <SideNavItem 
          href="/reports/engagement"
          isActive={isActiveUrl('/reports/engagement')}
        >
          Reach & Engagement
        </SideNavItem>
        
        <SideNavItem 
          href="/reports/people"
          isActive={isActiveUrl('/reports/people')}
        >
          People
        </SideNavItem>
        
        <SideNavItem 
          href="/reports/posts"
          isActive={isActiveUrl('/reports/posts')}
        >
          Posts
        </SideNavItem>
        
        <SideNavItem 
          href="/reports/spaces"
          isActive={isActiveUrl('/reports/spaces')}
        >
          Spaces
        </SideNavItem>
        
        <SideNavItem 
          href="/reports/messages"
          isActive={isActiveUrl('/reports/messages')}
        >
          Messages
        </SideNavItem>
        
        <SideNavItem 
          href="/reports/audit-logs"
          isActive={isActiveUrl('/reports/audit-logs')}
        >
          Audit logs
        </SideNavItem>
        
        <SideNavItem 
          href="/reports/email-logs"
          isActive={isActiveUrl('/reports/email-logs')}
        >
          Email logs
        </SideNavItem>
      </div>
    </div>
  );
  
  const renderAppStoreSidebar = () => (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">App store</h2>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/app-store/integrations"
          isActive={isActiveUrl('/app-store/integrations') || location === '/app-store'}
        >
          Apps & Integrations
        </SideNavItem>
        
        <SideNavItem 
          href="/app-store/addons"
          isActive={isActiveUrl('/app-store/addons')}
        >
          Add-ons
        </SideNavItem>
      </div>
    </div>
  );

  // Helper function to check if a URL is active
  const isActiveUrl = (url: string): boolean => {
    if (location === url) return true;
    if (url.includes("/") && location.startsWith(url)) return true;
    
    // Special case for root menu items
    const mainSection = url.split("/")[1]; // e.g. "content" from "/content/posts"
    if (location === `/${mainSection}`) return true;
    
    return false;
  };
  
  // Uncomment for debugging
  // console.log("Current location:", location);
  
  const getSidebarForLocation = () => {
    if (location.startsWith('/content')) {
      return renderContentSidebar();
    } else if (location.startsWith('/people')) {
      return renderPeopleSidebar();
    } else if (location.startsWith('/design-studio')) {
      return renderDesignStudioSidebar();
    } else if (location.startsWith('/appearance')) {
      return renderAppearanceSidebar();
    } else if (location.startsWith('/settings')) {
      return renderSettingsSidebar();
    } else if (location.startsWith('/billing')) {
      return renderBillingSidebar();
    } else if (location.startsWith('/reports')) {
      return renderReportsSidebar();
    } else if (location.startsWith('/app-store')) {
      return renderAppStoreSidebar();
    }
    // Default to content sidebar
    return renderContentSidebar();
  };

  return (
    <aside className="secondary-sidebar bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-3rem)] overflow-y-auto sticky top-12 w-56">
      {getSidebarForLocation()}
    </aside>
  );
}
