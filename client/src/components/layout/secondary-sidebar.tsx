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
  PanelLeft,
  PanelRight,
  Columns,
  EyeOff,
  ArrowLeft,
  ChevronRight,
  MessageSquare,
  Edit,
  Check
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface SideNavItemProps {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
  badge?: string;
}

function SideNavItem({ href, icon, children, isActive = false, badge }: SideNavItemProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center py-1.5 text-sm cursor-pointer my-0.5 transition-colors duration-150",
          isActive 
            ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-md" 
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 rounded"
        )}
        style={{paddingLeft: "10px", paddingRight: "10px"}}
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
  
  if (hidden && !showDropdown) return (
    <div className="relative group" onMouseLeave={() => setShowDropdown(false)}>
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
        <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-[100]">
          <div className="py-1 text-xs">
            {showHideOption && (
              <a href="#" className="flex items-center px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={toggleHidden}>
                <Eye className="mr-2 h-3 w-3" />
                <span>Unhide</span>
              </a>
            )}
            <a href="#" className="flex items-center px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Pencil className="mr-2 h-3 w-3" />
              <span>Rename</span>
            </a>
            <a href="#" className="flex items-center px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Pencil className="mr-2 h-3 w-3" />
              <span>Edit</span>
            </a>
            <a href="#" className="flex items-center px-3 py-1 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Trash2 className="mr-2 h-3 w-3" />
              <span>Delete</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="relative group" onMouseLeave={() => setShowDropdown(false)}>
      <div
        className={cn(
          "flex items-center px-2 py-1 text-xs cursor-pointer my-0.5 transition-colors duration-150 rounded",
          isActive 
            ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" 
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
        )}
        style={{ paddingLeft: level === 0 ? "12px" : `${(level * 10) + 16}px` }}
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
        <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-[100]">
          <div className="py-1 text-xs">
            {showHideOption && (
              <a href="#" className="flex items-center px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={toggleHidden}>
                <EyeOff className="mr-2 h-3 w-3" />
                <span>Hide</span>
              </a>
            )}
            <a href="#" className="flex items-center px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Pencil className="mr-2 h-3 w-3" />
              <span>Rename</span>
            </a>
            <a href="#" className="flex items-center px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Pencil className="mr-2 h-3 w-3" />
              <span>Edit</span>
            </a>
            <a href="#" className="flex items-center px-3 py-1 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Trash2 className="mr-2 h-3 w-3" />
              <span>Delete</span>
            </a>
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
  
  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded(!expanded);
  };
  
  return (
    <div className="folder-tree-item">
      <div className="relative group" onMouseLeave={() => setShowDropdown(false)}>
        <div
          className={cn(
            "flex items-center px-2 py-1 text-xs my-0.5 transition-colors duration-150 rounded",
            isActive 
              ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white" 
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          )}
          style={{ paddingLeft: level === 0 ? "12px" : `${(level * 10) + 16}px` }}
        >
          <span 
            className="w-4 h-4 mr-1 flex-shrink-0 flex items-center justify-center cursor-pointer"
            onClick={handleToggle}
          >
            <ChevronDown
              className={cn(
                "h-3 w-3 text-gray-500 transition-transform",
                expanded ? "transform rotate-0" : "transform -rotate-90"
              )}
            />
          </span>
          <div className="flex items-center cursor-pointer" onClick={handleToggle}>
            <Folder className="h-3.5 w-3.5 mr-1 text-gray-400" />
            <span className="font-medium text-gray-500">{name}</span>
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
          <div className="absolute right-0 mt-1 w-28 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-[100]">
            <div className="py-1 text-xs">
              <a href="#" className="flex items-center px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Pencil className="mr-2 h-3 w-3" />
                <span>Rename</span>
              </a>
              <a href="#" className="flex items-center px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Pencil className="mr-2 h-3 w-3" />
                <span>Edit</span>
              </a>
              <a href="#" className="flex items-center px-3 py-1 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Trash2 className="mr-2 h-3 w-3" />
                <span>Delete</span>
              </a>
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
                           location.includes('/design-studio/collections') ? 'collections' :
                           location.includes('/design-studio/templates') ? 'templates' :
                           location.includes('/design-studio/utility') ? 'utility' : '';
  
    return (
      <div className="p-3">
        <div className="mb-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">Design studio</h2>
            </div>
            
            <div className="relative w-full mb-2">
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
          </div>
        </div>
        
        <Accordion type="single" collapsible defaultValue={defaultExpanded} className="space-y-1">
          <AccordionItem value="spaces" className="border-0">
            <AccordionTrigger className="flex items-center py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Files className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium text-sm">Spaces</span>
                </div>
                <div className="relative group ml-6">
                  <div className="p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center cursor-pointer">
                    <Plus className="h-3 w-3 text-gray-400" />
                  </div>
                  <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="py-1">
                      <a href="#" className="flex items-center px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Files className="h-3 w-3 mr-2 text-gray-500" />
                        <span>Create new Space</span>
                      </a>
                      <a href="#" className="flex items-center px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Folder className="h-3 w-3 mr-2 text-gray-500" />
                        <span>Create new Folder</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-1">
              <div className="space-y-1">
                {/* Root files first */}
                <MinimalItem 
                  name="Feed" 
                  path="/design-studio/spaces/feed"
                  icon={<FileCode2 className="h-3.5 w-3.5" />}
                  iconColor="text-[#A694FF]"
                  inSpaces={true}
                />
                <MinimalItem 
                  name="Explore" 
                  path="/design-studio/spaces/explore"
                  icon={<File className="h-3.5 w-3.5" />}
                  iconColor="text-gray-500"
                  inSpaces={true}
                />
                
                {/* Connect folder */}
                <TreeFolder 
                  name="Connect" 
                  path="/design-studio/spaces/connect" 
                  isExpanded={location.startsWith('/design-studio/spaces/connect')}
                >
                  <MinimalItem 
                    name="Intros & Networking" 
                    path="/design-studio/spaces/connect/intros"
                    icon={<FileCode2 className="h-3.5 w-3.5" />}
                    iconColor="text-[#A694FF]"
                    level={1}
                    inSpaces={true}
                  />
                  <MinimalItem 
                    name="Ask the Community" 
                    path="/design-studio/spaces/connect/ask"
                    icon={<FileCode2 className="h-3.5 w-3.5" />}
                    iconColor="text-[#A694FF]"
                    level={1}
                    inSpaces={true}
                  />
                  <MinimalItem 
                    name="Hire Experts" 
                    path="/design-studio/spaces/connect/hire"
                    icon={<File className="h-3.5 w-3.5" />}
                    iconColor="text-gray-500"
                    level={1}
                    inSpaces={true}
                  />
                </TreeFolder>
                
                {/* Help Center folder */}
                <TreeFolder 
                  name="Help Center" 
                  path="/design-studio/spaces/help-center" 
                  isExpanded={location.startsWith('/design-studio/spaces/help-center')}
                >
                  <MinimalItem 
                    name="Getting Started" 
                    path="/design-studio/spaces/help-center/getting-started"
                    icon={<FileCode2 className="h-3.5 w-3.5" />}
                    iconColor="text-[#A694FF]"
                    level={1}
                    inSpaces={true}
                  />
                  <MinimalItem 
                    name="Account & Billing" 
                    path="/design-studio/spaces/help-center/account"
                    icon={<FileCode2 className="h-3.5 w-3.5" />}
                    iconColor="text-[#A694FF]"
                    level={1}
                    inSpaces={true}
                  />
                  <MinimalItem 
                    name="Content Management" 
                    path="/design-studio/spaces/help-center/content"
                    icon={<FileCode2 className="h-3.5 w-3.5" />}
                    iconColor="text-[#A694FF]"
                    level={1}
                    inSpaces={true}
                  />
                  <MinimalItem 
                    name="Member Management" 
                    path="/design-studio/spaces/help-center/members"
                    icon={<FileCode2 className="h-3.5 w-3.5" />}
                    iconColor="text-[#A694FF]"
                    level={1}
                    inSpaces={true}
                  />
                  <MinimalItem 
                    name="Appearance & Design" 
                    path="/design-studio/spaces/help-center/appearance"
                    icon={<FileCode2 className="h-3.5 w-3.5" />}
                    iconColor="text-[#A694FF]"
                    level={1}
                    inSpaces={true}
                  />
                  <MinimalItem 
                    name="Reports & Analytics" 
                    path="/design-studio/spaces/help-center/reports"
                    icon={<FileCode2 className="h-3.5 w-3.5" />}
                    iconColor="text-[#A694FF]"
                    level={1}
                    inSpaces={true}
                  />
                  <MinimalItem 
                    name="Apps & Integrations" 
                    path="/design-studio/spaces/help-center/apps"
                    icon={<FileCode2 className="h-3.5 w-3.5" />}
                    iconColor="text-[#A694FF]"
                    level={1}
                    inSpaces={true}
                  />
                  <MinimalItem 
                    name="API & Webhooks" 
                    path="/design-studio/spaces/help-center/api"
                    icon={<FileCode2 className="h-3.5 w-3.5" />}
                    iconColor="text-[#A694FF]"
                    level={1}
                    inSpaces={true}
                  />
                  <MinimalItem 
                    name="Get Inspired" 
                    path="/design-studio/spaces/help-center/inspired"
                    icon={<FileCode2 className="h-3.5 w-3.5" />}
                    iconColor="text-[#A694FF]"
                    level={1}
                    inSpaces={true}
                  />
                </TreeFolder>
                

              </div>
            </AccordionContent>
          </AccordionItem>
          
          <div className="h-px bg-gray-100 dark:bg-gray-700 mx-1"></div>
          
          <AccordionItem value="collections" className="border-0">
            <AccordionTrigger className="flex items-center py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Database className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium text-sm">CMS Pages</span>
                </div>
                <div className="relative group ml-6">
                  <div className="p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center cursor-pointer">
                    <Plus className="h-3 w-3 text-gray-400" />
                  </div>
                  <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="py-1">
                      <a href="#" className="flex items-center px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <FileBox className="h-3 w-3 mr-2 text-[#A694FF]" />
                        <span>Create new CMS</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-1">
              <div className="space-y-1">
                <MinimalItem 
                  name="Event" 
                  path="/design-studio/collections/event"
                  icon={<FileBox className="h-3.5 w-3.5" />}
                  iconColor="text-[#A694FF]"
                  level={1}
                />
                <MinimalItem 
                  name="Discussion" 
                  path="/design-studio/collections/discussion"
                  icon={<FileBox className="h-3.5 w-3.5" />}
                  iconColor="text-[#A694FF]"
                  level={1}
                />
                <MinimalItem 
                  name="Blog" 
                  path="/design-studio/collections/blog"
                  icon={<FileBox className="h-3.5 w-3.5" />}
                  iconColor="text-[#A694FF]"
                  level={1}
                />
                <MinimalItem 
                  name="Job List" 
                  path="/design-studio/collections/jobs"
                  icon={<FileBox className="h-3.5 w-3.5" />}
                  iconColor="text-[#A694FF]"
                  level={1}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <div className="h-px bg-gray-100 dark:bg-gray-700 mx-1"></div>
          
          <AccordionItem value="templates" className="border-0">
            <AccordionTrigger className="flex items-center py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Layers2 className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="font-medium text-sm">Templates</span>
                </div>
                <div className="relative group ml-6">
                  <div className="p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center cursor-pointer">
                    <Plus className="h-3 w-3 text-gray-400" />
                  </div>
                  <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <div className="py-1">
                      <a href="#" className="flex items-center px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <FileCog className="h-3 w-3 mr-2 text-[#57ABFF]" />
                        <span>Create new Template</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-1">
              <div className="space-y-1">
                <MinimalItem 
                  name="General template" 
                  path="/design-studio/templates/general"
                  icon={<FileCog className="h-3.5 w-3.5" />}
                  iconColor="text-[#57ABFF]"
                  level={1}
                />
                <MinimalItem 
                  name="Product" 
                  path="/design-studio/templates/product"
                  icon={<FileCog className="h-3.5 w-3.5" />}
                  iconColor="text-[#57ABFF]"
                  level={1}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <div className="h-px bg-gray-100 dark:bg-gray-700 mx-1"></div>
          
          <AccordionItem value="utility" className="border-0">
            <AccordionTrigger className="flex items-center py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline">
              <div className="flex items-center">
                <PanelTop className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium text-sm">Utility Pages</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 pb-1">
              <div className="space-y-1">
                <MinimalItem 
                  name="404 Page" 
                  path="/design-studio/utility/404"
                  icon={<File className="h-3.5 w-3.5" />}
                  iconColor="text-gray-500"
                  level={1}
                />
                <MinimalItem 
                  name="Search result" 
                  path="/design-studio/utility/search"
                  icon={<File className="h-3.5 w-3.5" />}
                  iconColor="text-gray-500"
                  level={1}
                />
                <MinimalItem 
                  name="Member profile" 
                  path="/design-studio/utility/member-profile"
                  icon={<File className="h-3.5 w-3.5" />}
                  iconColor="text-gray-500"
                  level={1}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        

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
  
  const renderDesignStudioSpacesFeedSidebar = () => {
    return (
      <div className="p-2">
        {/* Two line header layout - ultra minimalist */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 border-b border-gray-100 dark:border-gray-800 pb-1">
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
          <div className="px-0.5 mb-4">

            
            {/* Navigation Section with Toggles - Ultra minimal version */}
            <div className="mb-5">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="layout-components" className="border-0">
                  <AccordionTrigger className="py-1 hover:no-underline">
                    <h4 className="text-[11px] uppercase tracking-wide font-medium text-gray-500 dark:text-gray-400">Layout Components</h4>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-1 px-0">
                    <div className="space-y-1">
                      {/* Header Navigation Row */}
                      <div 
                        id="header-section" 
                        className="flex items-center justify-between py-1.5 px-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-sm group transition-colors duration-150"
                      >
                        <div className="flex items-center gap-1.5">
                          <Layout className="h-3 w-3 text-blue-400" />
                          <span className="text-[10px] text-gray-600 dark:text-gray-300">Header</span>
                        </div>
                        <Switch 
                          id="header-toggle" 
                          className="h-3 w-5 data-[state=checked]:bg-blue-400"
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
                        className="flex items-center justify-between py-1.5 px-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-sm group transition-colors duration-150"
                      >
                        <div className="flex items-center gap-1.5">
                          <PanelRight className="h-3 w-3 text-red-400" />
                          <span className="text-[10px] text-gray-600 dark:text-gray-300">Right Sidebar</span>
                        </div>
                        <Switch 
                          id="right-sidebar-toggle" 
                          className="h-3 w-5 data-[state=checked]:bg-red-400"
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
                        className="flex items-center justify-between py-1.5 px-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-sm group transition-colors duration-150"
                      >
                        <div className="flex items-center gap-1.5">
                          <PanelLeft className="h-3 w-3 text-green-400" />
                          <span className="text-[10px] text-gray-600 dark:text-gray-300">Left Sidebar</span>
                        </div>
                        <Switch 
                          id="left-sidebar-toggle" 
                          className="h-3 w-5 data-[state=checked]:bg-green-400"
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
                        className="flex items-center justify-between py-1.5 px-1 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-sm group transition-colors duration-150"
                      >
                        <div className="flex items-center gap-1.5">
                          <Columns className="h-3 w-3 text-yellow-400" />
                          <span className="text-[10px] text-gray-600 dark:text-gray-300">Footer</span>
                        </div>
                        <Switch 
                          id="footer-toggle" 
                          className="h-3 w-5 data-[state=checked]:bg-yellow-400"
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
            
            {/* Content Blocks section with accordion */}
            <div className="mt-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="content-blocks" className="border-0">
                  <AccordionTrigger className="py-1 hover:no-underline">
                    <h4 className="text-[11px] uppercase tracking-wide font-medium text-gray-500 dark:text-gray-400">Content Blocks</h4>
                  </AccordionTrigger>
                  <AccordionContent className="py-2 px-0">
                    <div className="relative">
                      <button
                        className="flex items-center justify-between w-full py-1.5 px-2 text-[10px] border border-gray-200 dark:border-gray-700 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-100"
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
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
    } else if (location === '/design-studio/spaces/feed') {
      return renderDesignStudioSpacesFeedSidebar();
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
    <aside className="secondary-sidebar bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-3rem)] overflow-y-auto sticky top-12 w-64">
      {getSidebarForLocation()}
    </aside>
  );
}
