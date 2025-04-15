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
  Plus,
  FileBox,
  FileCog,
  File,
  FileCode2,
  MoreHorizontal,
  Trash2,
  Pencil,
  Eye,
  EyeOff
} from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { useState, useRef, useEffect } from "react";

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

// Minimal menu item component with action dropdown
interface MinimalItemProps {
  name: string;
  path: string;
  icon: React.ReactNode;
  iconColor?: string;
  level?: number;
  isHidden?: boolean; 
  isFile?: boolean;
  inSpaces?: boolean;
}

function MinimalItem({ 
  name, 
  path, 
  icon, 
  iconColor = "text-gray-500", 
  level = 0, 
  isHidden = false,
  isFile = true,
  inSpaces = false
}: MinimalItemProps) {
  const [location] = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [hidden, setHidden] = useState(isHidden);
  const isActive = location === path;
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Format the name to remove file extension
  const displayName = name.includes('.') ? name.split('.')[0] : name;
  
  // Only show hide/unhide for files in Spaces section
  const showHideOption = inSpaces && isFile;
  
  const toggleHidden = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHidden(!hidden);
    setShowDropdown(false);
  };
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  if (hidden && !showDropdown) return (
    <div className="relative group">
      <div
        className={cn(
          "flex items-center px-2 py-1 text-xs cursor-pointer my-0.5 transition-colors duration-150 rounded opacity-50",
          isActive 
            ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" 
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        )}
        style={{ paddingLeft: `${(level * 10) + 4}px` }}
      >
        <EyeOff className="h-3 w-3 mr-1 text-gray-400" />
        <span className="font-medium text-gray-400">{displayName}</span>
        <div 
          className="ml-auto opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDropdown(!showDropdown);
          }}
        >
          <MoreHorizontal className="h-3 w-3 text-gray-400" />
        </div>
      </div>
      
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 top-6 w-28 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-[9999]"
        >
          <div className="py-1 text-xs">
            {showHideOption && (
              <button className="w-full text-left flex items-center px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={toggleHidden}>
                <Eye className="mr-2 h-3 w-3" />
                <span>Unhide</span>
              </button>
            )}
            <button className="w-full text-left flex items-center px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Pencil className="mr-2 h-3 w-3" />
              <span>Rename</span>
            </button>
            <button className="w-full text-left flex items-center px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Pencil className="mr-2 h-3 w-3" />
              <span>Edit</span>
            </button>
            <button className="w-full text-left flex items-center px-3 py-1 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Trash2 className="mr-2 h-3 w-3" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="relative group">
      <div
        className={cn(
          "flex items-center px-2 py-1 text-xs cursor-pointer my-0.5 transition-colors duration-150 rounded",
          isActive 
            ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" 
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        )}
        style={{ paddingLeft: `${(level * 10) + 4}px` }}
      >
        <span className={cn("flex-shrink-0 mr-1.5", iconColor)}>
          {icon}
        </span>
        <Link href={path}>
          <span className={cn("font-medium", iconColor)}>{displayName}</span>
        </Link>
        <div 
          className="ml-auto opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDropdown(!showDropdown);
          }}
        >
          <MoreHorizontal className="h-3 w-3 text-gray-400" />
        </div>
      </div>
      
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute right-0 top-6 w-28 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-[9999]"
        >
          <div className="py-1 text-xs">
            {showHideOption && (
              <button className="w-full text-left flex items-center px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={toggleHidden}>
                <EyeOff className="mr-2 h-3 w-3" />
                <span>Hide</span>
              </button>
            )}
            <button className="w-full text-left flex items-center px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Pencil className="mr-2 h-3 w-3" />
              <span>Rename</span>
            </button>
            <button className="w-full text-left flex items-center px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Pencil className="mr-2 h-3 w-3" />
              <span>Edit</span>
            </button>
            <button className="w-full text-left flex items-center px-3 py-1 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Trash2 className="mr-2 h-3 w-3" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
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
  const [showDropdown, setShowDropdown] = useState(false);
  const isActive = location === path;
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded(!expanded);
  };
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setExpanded(!expanded);
  };
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  return (
    <div className="folder-tree-item">
      <div className="relative group">
        <div
          className={cn(
            "flex items-center px-2 py-1 text-xs my-0.5 transition-colors duration-150 rounded cursor-pointer",
            isActive 
              ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" 
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          )}
          style={{ paddingLeft: `${(level * 10) + 4}px` }}
          onClick={handleClick}
        >
          <span 
            className="w-4 h-4 mr-1 flex-shrink-0 flex items-center justify-center"
            onClick={handleToggle}
          >
            <ChevronDown
              className={cn(
                "h-3 w-3 text-gray-500 transition-transform",
                expanded ? "transform rotate-0" : "transform -rotate-90"
              )}
            />
          </span>
          <div className="flex items-center">
            <Folder className="h-3.5 w-3.5 mr-1 text-gray-500" />
            <span className="font-medium">{name}</span>
          </div>
          <div 
            className="ml-auto opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
          >
            <MoreHorizontal className="h-3 w-3 text-gray-400" />
          </div>
        </div>
        
        {showDropdown && (
          <div 
            ref={dropdownRef}
            className="absolute right-0 top-6 w-28 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-[9999]"
          >
            <div className="py-1 text-xs">
              <button className="w-full text-left flex items-center px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Pencil className="mr-2 h-3 w-3" />
                <span>Rename</span>
              </button>
              <button className="w-full text-left flex items-center px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Pencil className="mr-2 h-3 w-3" />
                <span>Edit</span>
              </button>
              <button className="w-full text-left flex items-center px-3 py-1 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Trash2 className="mr-2 h-3 w-3" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {expanded && children && (
        <div>
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
          href="/people/invites"
          isActive={isActiveUrl('/people/invites')}
        >
          Invites
        </SideNavItem>
      </div>
    </div>
  );
  
  const renderAnalyticsSidebar = () => (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">Analytics</h2>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/analytics/overview"
          isActive={isActiveUrl('/analytics/overview') || location === '/analytics'}
        >
          Overview
        </SideNavItem>
        
        <SideNavItem 
          href="/analytics/reports"
          isActive={isActiveUrl('/analytics/reports')}
        >
          Reports
        </SideNavItem>
        
        <SideNavItem 
          href="/analytics/audiences"
          isActive={isActiveUrl('/analytics/audiences')}
        >
          Audiences
        </SideNavItem>
        
        <SideNavItem 
          href="/analytics/campaigns"
          isActive={isActiveUrl('/analytics/campaigns')}
        >
          Campaigns
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
          href="/billing/overview"
          isActive={isActiveUrl('/billing/overview') || location === '/billing'}
        >
          Overview
        </SideNavItem>
        
        <SideNavItem 
          href="/billing/plans"
          isActive={isActiveUrl('/billing/plans')}
        >
          Plans
        </SideNavItem>
        
        <SideNavItem 
          href="/billing/invoices"
          isActive={isActiveUrl('/billing/invoices')}
        >
          Invoices
        </SideNavItem>
        
        <SideNavItem 
          href="/billing/payment-methods"
          isActive={isActiveUrl('/billing/payment-methods')}
        >
          Payment Methods
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
          href="/settings/general"
          isActive={isActiveUrl('/settings/general') || location === '/settings'}
        >
          General
        </SideNavItem>
        
        <SideNavItem 
          href="/settings/profile"
          isActive={isActiveUrl('/settings/profile')}
        >
          Profile
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
          href="/settings/security"
          icon={<Lock className="h-4 w-4" />}
          isActive={isActiveUrl('/settings/security')}
        >
          Security
        </SideNavItem>
      </div>
    </div>
  );
  
  const renderDesignStudioSidebar = () => (
    <div className="p-3">
      {/* Header with search and add button */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full mr-2">
          <input
            type="text"
            placeholder="Search..."
            className={cn(
              "w-full text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-transparent px-3 py-1.5",
              "focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600",
              "transition-all duration-200",
              !showSearch && "w-[28px] px-7",
            )}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowSearch(true)}
            onBlur={() => {
              if (searchTerm === '') {
                setShowSearch(false);
              }
            }}
          />
          <Search className={cn(
            "h-3.5 w-3.5 text-gray-500 absolute top-1/2 transform -translate-y-1/2",
            showSearch ? "left-2.5" : "left-2"
          )} />
        </div>
        <div className="flex-shrink-0">
          <button className="flex items-center justify-center h-7 w-7 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            <Plus className="h-3.5 w-3.5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>
      
      {/* Accordion sections */}
      <Accordion type="multiple" defaultValue={["spaces", "templates", "cms", "utility"]}>
        {/* Spaces Section */}
        <AccordionItem value="spaces" className="border-none">
          <AccordionTrigger className="py-1.5 px-0.5 text-xs font-normal text-gray-700 dark:text-gray-300 hover:no-underline">
            <div className="flex items-center">
              <Files className="h-4 w-4 mr-1" />
              <span>Spaces</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-0">
            <div className="space-y-0.5">
              {/* Project structure as tree view */}
              <TreeFolder name="Components" path="/design-studio/components" level={0} isExpanded={true}>
                <MinimalItem 
                  name="Button.tsx" 
                  path="/design-studio/components/button" 
                  icon={<FileCode2 className="h-3 w-3" />} 
                  iconColor="text-blue-500"
                  level={1}
                  inSpaces={true}
                />
                <MinimalItem 
                  name="Card.tsx" 
                  path="/design-studio/components/card" 
                  icon={<FileCode2 className="h-3 w-3" />}
                  iconColor="text-blue-500" 
                  level={1}
                  inSpaces={true}
                />
                <MinimalItem 
                  name="Modal.tsx" 
                  path="/design-studio/components/modal" 
                  icon={<FileCode2 className="h-3 w-3" />}
                  iconColor="text-blue-500" 
                  level={1}
                  inSpaces={true}
                />
              </TreeFolder>
              
              <TreeFolder name="Pages" path="/design-studio/pages" level={0} isExpanded={true}>
                <TreeFolder name="Dashboard" path="/design-studio/pages/dashboard" level={1}>
                  <MinimalItem 
                    name="Overview.tsx" 
                    path="/design-studio/pages/dashboard/overview" 
                    icon={<FileCode2 className="h-3 w-3" />}
                    iconColor="text-blue-500" 
                    level={2}
                    inSpaces={true}
                  />
                  <MinimalItem 
                    name="Analytics.tsx" 
                    path="/design-studio/pages/dashboard/analytics" 
                    icon={<FileCode2 className="h-3 w-3" />}
                    iconColor="text-blue-500" 
                    level={2}
                    isHidden={true}
                    inSpaces={true}
                  />
                </TreeFolder>
                
                <MinimalItem 
                  name="Login.tsx" 
                  path="/design-studio/pages/login" 
                  icon={<FileCode2 className="h-3 w-3" />}
                  iconColor="text-blue-500" 
                  level={1}
                  inSpaces={true}
                />
                <MinimalItem 
                  name="Register.tsx" 
                  path="/design-studio/pages/register" 
                  icon={<FileCode2 className="h-3 w-3" />}
                  iconColor="text-blue-500" 
                  level={1}
                  inSpaces={true}
                />
              </TreeFolder>
              
              <MinimalItem 
                name="styles.css" 
                path="/design-studio/styles" 
                icon={<File className="h-3 w-3" />}
                level={0}
                inSpaces={true}
              />
              <MinimalItem 
                name="tailwind.config.js" 
                path="/design-studio/tailwind-config" 
                icon={<File className="h-3 w-3" />}
                level={0}
                inSpaces={true}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Templates Section */}
        <AccordionItem value="templates" className="border-none">
          <AccordionTrigger className="py-1.5 px-0.5 text-xs font-normal text-gray-700 dark:text-gray-300 hover:no-underline">
            <div className="flex items-center">
              <Layout className="h-4 w-4 mr-1" />
              <span>Templates</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-0">
            <div className="space-y-0.5">
              <MinimalItem 
                name="Blog Post" 
                path="/design-studio/templates/blog-post" 
                icon={<FileBox className="h-3 w-3" />}
                iconColor="text-blue-500" 
                level={0}
              />
              <MinimalItem 
                name="Landing Page" 
                path="/design-studio/templates/landing-page" 
                icon={<FileBox className="h-3 w-3" />}
                iconColor="text-blue-500" 
                level={0}
              />
              <MinimalItem 
                name="Product Page" 
                path="/design-studio/templates/product-page" 
                icon={<FileBox className="h-3 w-3" />}
                iconColor="text-blue-500" 
                level={0}
              />
              <MinimalItem 
                name="Checkout" 
                path="/design-studio/templates/checkout" 
                icon={<FileBox className="h-3 w-3" />}
                iconColor="text-blue-500" 
                level={0}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* CMS Pages Section */}
        <AccordionItem value="cms" className="border-none">
          <AccordionTrigger className="py-1.5 px-0.5 text-xs font-normal text-gray-700 dark:text-gray-300 hover:no-underline">
            <div className="flex items-center">
              <Database className="h-4 w-4 mr-1" />
              <span>CMS Pages</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-0">
            <div className="space-y-0.5">
              <MinimalItem 
                name="Blog Collection" 
                path="/design-studio/cms/blog-collection" 
                icon={<FileCog className="h-3 w-3" />}
                iconColor="text-purple-500" 
                level={0}
              />
              <MinimalItem 
                name="Products Collection" 
                path="/design-studio/cms/products-collection" 
                icon={<FileCog className="h-3 w-3" />}
                iconColor="text-purple-500" 
                level={0}
              />
              <MinimalItem 
                name="Authors Collection" 
                path="/design-studio/cms/authors-collection" 
                icon={<FileCog className="h-3 w-3" />}
                iconColor="text-purple-500" 
                level={0}
              />
              <MinimalItem 
                name="Categories Collection" 
                path="/design-studio/cms/categories-collection" 
                icon={<FileCog className="h-3 w-3" />}
                iconColor="text-purple-500" 
                level={0}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Utility Pages Section */}
        <AccordionItem value="utility" className="border-none">
          <AccordionTrigger className="py-1.5 px-0.5 text-xs font-normal text-gray-700 dark:text-gray-300 hover:no-underline">
            <div className="flex items-center">
              <PanelTop className="h-4 w-4 mr-1" />
              <span>Utility Pages</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-0">
            <div className="space-y-0.5">
              <MinimalItem 
                name="404 Not Found" 
                path="/design-studio/utility/404" 
                icon={<FileBox className="h-3 w-3" />}
                iconColor="text-purple-500" 
                level={0}
              />
              <MinimalItem 
                name="Password Protected" 
                path="/design-studio/utility/password-protected" 
                icon={<FileBox className="h-3 w-3" />}
                iconColor="text-purple-500" 
                level={0}
              />
              <MinimalItem 
                name="License" 
                path="/design-studio/utility/license" 
                icon={<FileBox className="h-3 w-3" />}
                iconColor="text-purple-500" 
                level={0}
              />
              <MinimalItem 
                name="Changelog" 
                path="/design-studio/utility/changelog" 
                icon={<FileBox className="h-3 w-3" />}
                iconColor="text-purple-500" 
                level={0}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  // Helper function to check if a URL is active
  function isActiveUrl(url: string): boolean {
    return location.startsWith(url);
  }

  // Determine which sidebar to render based on the current location
  function renderSidebar() {
    if (location.startsWith('/dashboard')) {
      return renderDashboardSidebar();
    } else if (location.startsWith('/content')) {
      return renderContentSidebar();
    } else if (location.startsWith('/people')) {
      return renderPeopleSidebar();
    } else if (location.startsWith('/analytics')) {
      return renderAnalyticsSidebar();
    } else if (location.startsWith('/billing')) {
      return renderBillingSidebar();
    } else if (location.startsWith('/settings')) {
      return renderSettingsSidebar();
    } else if (location.startsWith('/design-studio')) {
      return renderDesignStudioSidebar();
    } else {
      return renderDashboardSidebar();
    }
  }

  return (
    <div className="w-60 h-full overflow-y-auto border-r border-gray-200 dark:border-gray-800">
      {renderSidebar()}
    </div>
  );
}