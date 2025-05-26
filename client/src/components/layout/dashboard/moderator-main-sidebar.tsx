import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Database,
  Users, 
  Settings,
  GraduationCap,
  LogOut,
  SunMedium,
  Moon,
  ShieldPlus
} from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useState, useEffect, ReactNode } from "react";
import { APP_ROUTES } from "@/config/routes";
import { sitesApi } from "@/lib/api";

// Navigation item configuration for moderators
interface NavConfig {
  icon: ReactNode;
  label: string;
  routeGetter: (identifier: string) => string;
}

// Moderator navigation items - only Content, People, and Moderation
const MODERATOR_NAV_ITEMS: NavConfig[] = [
  {
    icon: <Database className="h-4 w-4" />,
    label: "Content",
    routeGetter: APP_ROUTES.DASHBOARD_MODERATOR.CONTENT
  },
  {
    icon: <Users className="h-4 w-4" />,
    label: "People",
    routeGetter: APP_ROUTES.DASHBOARD_MODERATOR.PEOPLE
  },
  {
    icon: <ShieldPlus className="h-4 w-4" />,
    label: "Moderation",
    routeGetter: APP_ROUTES.DASHBOARD_MODERATOR.MODERATION
  }
];

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
  badge?: string;
  collapsed?: boolean;
  disabled?: boolean;
}

function NavItem({ 
  href, 
  icon, 
  children, 
  isActive, 
  badge,
  collapsed = false,
  disabled = false
}: NavItemProps) {
  const navContent = (
    <div
      className={cn(
        "flex items-center justify-center p-1.5 w-8 h-8 rounded-md relative",
        disabled && "opacity-50 cursor-not-allowed",
        isActive 
          ? "bg-primary-200 dark:bg-primary-700 text-primary-800 dark:text-primary-100 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(20,20,40,0.5)] border border-primary-300 dark:border-primary-400 dark:ring-1 dark:ring-primary-400/30"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
      )}
    >
      <span className={cn(
        disabled ? "text-gray-400 dark:text-gray-600" : "",
        isActive 
          ? "text-primary-800 dark:text-primary-100 font-bold"
          : "text-gray-500 dark:text-gray-400"
      )}>
        {icon}
      </span>
    </div>
  );

  if (disabled) {
    return (
      <Tooltip.Provider delayDuration={200}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="cursor-not-allowed">
              {navContent}
            </div>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="bg-gray-900 text-white px-2 py-1 rounded text-sm animate-in fade-in-50 data-[side=right]:slide-in-from-left-2"
              side="right"
              sideOffset={10}
            >
              <div className="flex items-center">
                <span>{children}</span>
                <span className="ml-2 text-gray-300 text-xs">(Select a site first)</span>
              </div>
              <Tooltip.Arrow className="fill-gray-900" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Link href={href}>
            {navContent}
          </Link>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-gray-900 text-white px-2 py-1 rounded text-sm animate-in fade-in-50 data-[side=right]:slide-in-from-left-2"
            side="right"
            sideOffset={10}
          >
            <div className="flex items-center">
              <span>{children}</span>
              {badge && (
                <span className="ml-2 bg-primary-50 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </div>
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

interface ModeratorMainSidebarProps {
  collapsed?: boolean;
  currentSiteIdentifier?: string;
}

// Utility for creating tooltip wrapper
function TooltipWrapper({children, label}: {children: ReactNode, label: string}) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-gray-900 text-white px-2 py-1 rounded text-sm animate-in fade-in-50 data-[side=right]:slide-in-from-left-2"
            side="right"
            sideOffset={10}
          >
            <span>{label}</span>
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

export function ModeratorMainSidebar({ collapsed = false, currentSiteIdentifier }: ModeratorMainSidebarProps) {
  const [location] = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  }
  
  // Check initial state on component mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  // Fetch the site data when site is selected
  const [siteData, setSiteData] = useState<{ id: string; subdomain: string | null }>({ id: "", subdomain: null });
  const hasSiteSelected = Boolean(currentSiteIdentifier);
  
  // Effect to fetch site data when currentSiteIdentifier changes
  useEffect(() => {
    const fetchSiteData = async () => {
      if (!currentSiteIdentifier) {
        setSiteData({ id: "", subdomain: null });
        return;
      }
      
      try {
        // Use the identifier to fetch site data from the API
        const data = await sitesApi.getSite(currentSiteIdentifier);
        setSiteData({
          id: data.id,
          subdomain: data.subdomain ?? null
        });
      } catch (error) {
        console.error("Error fetching site data:", error);
        // Fallback to using the ID directly if API fails
        setSiteData({
          id: currentSiteIdentifier,
          subdomain: null
        });
      }
    };
    
    fetchSiteData();
  }, [currentSiteIdentifier]);
  
  // Determine which identifier to use for routes - prefer subdomain if available
  const routeIdentifier = siteData.subdomain || siteData.id;

  // Helper function to render nav items from config
  const renderNavItems = (items: NavConfig[]) => {
    return items.map((item, index) => (
      <NavItem 
        key={index}
        href={hasSiteSelected ? item.routeGetter(routeIdentifier) : "#"} 
        icon={item.icon} 
        isActive={hasSiteSelected ? location.startsWith(item.routeGetter(routeIdentifier)) : false} 
        collapsed={true}
        disabled={!hasSiteSelected}
      >
        {item.label}
      </NavItem>
    ));
  };

  return (
    <aside className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-3rem)] overflow-y-auto sticky top-12 w-12">
      <div className="px-1.5 py-2 h-full flex flex-col">
        <nav className="space-y-2 flex-grow flex flex-col items-center pt-1.5">
          {/* Moderator navigation items - only Content, People, and Moderation */}
          {renderNavItems(MODERATOR_NAV_ITEMS)}
        </nav>
        
        <div className="mt-auto flex flex-col items-center gap-3 pb-2">
          {/* All Sites Link */}
          <TooltipWrapper label="All Sites">
            <Link href={APP_ROUTES.SITES_LIST} className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 p-1.5">
              <Home className="h-4 w-4" />
            </Link>
          </TooltipWrapper>
          
          {/* Onboarding Button */}
          <TooltipWrapper label="Onboarding">
            <button className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 p-1.5">
              <GraduationCap className="h-4 w-4" />
            </button>
          </TooltipWrapper>
          
          {/* Dark Mode Toggle */}
          <TooltipWrapper label={isDarkMode ? 'Light mode' : 'Dark mode'}>
            <button 
              className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 p-1.5"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <SunMedium className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </TooltipWrapper>
          
          <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button className="relative text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300">
                  <img 
                    className="h-6 w-6 rounded-full border border-gray-200 dark:border-gray-700" 
                    src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                    alt="User profile" 
                  />
                  <div className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-green-500 ring-1 ring-white dark:ring-gray-800"></div>
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-gray-900 text-white px-3 py-2 rounded text-sm animate-in fade-in-50 data-[side=right]:slide-in-from-left-2"
                  side="right"
                  sideOffset={10}
                >
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium">Moderator</span>
                    <span className="text-gray-300 text-xs">moderator@site.com</span>
                    <div className="flex items-center mt-1 pt-1 border-t border-gray-700">
                      <LogOut className="h-3 w-3 mr-1" />
                      <span className="text-xs">Sign out</span>
                    </div>
                  </div>
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      </div>
    </aside>
  );
} 