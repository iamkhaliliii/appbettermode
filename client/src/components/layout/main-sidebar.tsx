import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Database,
  Users, 
  Shapes, 
  Settings,
  CreditCard,
  BarChart2,
  ShoppingBag,
  GraduationCap,
  LogOut,
  SunMedium,
  Moon,
  MonitorCog
} from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useState, useEffect } from "react";
import { APP_ROUTES } from "@/config/routes";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
  badge?: string;
  collapsed?: boolean;
  isPro?: boolean;
}

function NavItem({ 
  href, 
  icon, 
  children, 
  isActive, 
  badge,
  collapsed = false,
  isPro = false
}: NavItemProps) {
  const navContent = (
    <div
      className={cn(
        "flex items-center justify-center p-1.5 w-8 h-8 rounded-md relative",
        isPro
          ? cn(
              "rounded-lg border border-[var(--Gradient-skeuemorphic-gradient-border,rgba(255,255,255,0.12))] bg-[var(--Colors-Blue-500,#2E90FA)] shadow-[0px_0px_0px_1px_rgba(16,24,40,0.24)_inset,0px_3px_3px_0px_rgba(255,255,255,0.10)_inset,0px_-3px_3px_0px_rgba(0,0,0,0.10)_inset,0px_3px_4px_-1px_rgba(42,42,42,0.14),0px_1px_1px_0px_rgba(42,42,42,0.08)]",
              isActive
                ? "brightness-95"
                : "hover:brightness-105"
            )
          : isActive 
            ? "bg-primary-200 dark:bg-primary-700 text-primary-800 dark:text-primary-100 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(20,20,40,0.5)] border border-primary-300 dark:border-primary-400 dark:ring-1 dark:ring-primary-400/30"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
      )}
    >
      {!isPro && isActive && (
        <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-6 bg-primary-600 dark:bg-primary-300 rounded-r-sm"></span>
      )}
      <span className={cn(
        isPro 
          ? "text-white"
          : isActive 
            ? "text-primary-800 dark:text-primary-100 font-bold"
            : "text-gray-500 dark:text-gray-400"
      )}>
        {icon}
      </span>
    </div>
  );

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

interface MainSidebarProps {
  collapsed?: boolean;
  currentSiteIdentifier?: string;
}

// Create a custom NavButton component for the Inbox icon that will open a drawer
interface NavButtonProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  badge?: string;
}

function NavButton({ 
  icon, 
  children, 
  isActive,
  onClick,
  badge
}: NavButtonProps) {
  const navContent = (
    <div
      className={cn(
        "flex items-center justify-center p-1.5 w-8 h-8 rounded-md relative",
        isActive 
          ? "bg-primary-200 dark:bg-primary-700 text-primary-800 dark:text-primary-100 shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(20,20,40,0.5)] border border-primary-300 dark:border-primary-400 dark:ring-1 dark:ring-primary-400/30" 
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
      )}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-6 bg-primary-600 dark:bg-primary-300 rounded-r-sm"></span>
      )}
      <span className={cn(
        isActive 
          ? "text-primary-800 dark:text-primary-100 font-bold" 
          : "text-gray-500 dark:text-gray-400"
      )}>
        {icon}
      </span>
    </div>
  );

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button onClick={onClick}>
            {navContent}
          </button>
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

export function MainSidebar({ collapsed = false, currentSiteIdentifier }: MainSidebarProps) {
  const [location] = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  
  // Check initial state on component mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  // MainSidebar now always renders a consistent set of icons.
  // The href and isActive logic for each NavItem will adapt based on currentSiteIdentifier.
  return (
    <aside className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-3rem)] overflow-y-auto sticky top-12 w-12">
      <div className="px-1.5 py-2 h-full flex flex-col">
        <nav className="space-y-2 flex-grow flex flex-col items-center pt-1.5">
          {/* Sites List / Home - Always available, but behavior might change */} 
          <NavItem 
            href={currentSiteIdentifier ? APP_ROUTES.DASHBOARD_SITE.CONTENT(currentSiteIdentifier) : "#"} 
            icon={<Database className="h-4 w-4" />} 
            isActive={currentSiteIdentifier ? location.startsWith(APP_ROUTES.DASHBOARD_SITE.CONTENT(currentSiteIdentifier)) : false} 
            collapsed={true}
            // Add a class to disable if no currentSiteIdentifier, or handle in NavItem
            // className={!currentSiteIdentifier ? "opacity-50 pointer-events-none" : ""}
          >
            Content
          </NavItem>
          
          <NavItem 
            href={currentSiteIdentifier ? APP_ROUTES.DASHBOARD_SITE.SITE_CONFIG(currentSiteIdentifier) : "#"} 
            icon={<MonitorCog className="h-4 w-4" />} 
            isActive={currentSiteIdentifier ? location.startsWith(APP_ROUTES.DASHBOARD_SITE.SITE_CONFIG(currentSiteIdentifier)) : false} 
            collapsed={true}
          >
            Site
          </NavItem>
          
          <NavItem 
            href={currentSiteIdentifier ? APP_ROUTES.DASHBOARD_SITE.PEOPLE(currentSiteIdentifier) : "#"} 
            icon={<Users className="h-4 w-4" />} 
            isActive={currentSiteIdentifier ? location.startsWith(APP_ROUTES.DASHBOARD_SITE.PEOPLE(currentSiteIdentifier)) : false} 
            collapsed={true}
          >
            People
          </NavItem>
          
          <NavItem 
            href={currentSiteIdentifier ? APP_ROUTES.DASHBOARD_SITE.APPEARANCE(currentSiteIdentifier) : "#"} 
            icon={<Shapes className="h-4 w-4" />} 
            isActive={currentSiteIdentifier ? location.startsWith(APP_ROUTES.DASHBOARD_SITE.APPEARANCE(currentSiteIdentifier)) : false} 
            collapsed={true}
          >
            Appearance
          </NavItem>
          
          <NavItem 
            href={currentSiteIdentifier ? APP_ROUTES.DASHBOARD_SITE.SETTINGS(currentSiteIdentifier) : "#"} 
            icon={<Settings className="h-4 w-4" />} 
            isActive={currentSiteIdentifier ? location.startsWith(APP_ROUTES.DASHBOARD_SITE.SETTINGS(currentSiteIdentifier)) : false} 
            collapsed={true}
          >
            Settings
          </NavItem>
          
          <NavItem 
            href={currentSiteIdentifier ? APP_ROUTES.DASHBOARD_SITE.BILLING(currentSiteIdentifier) : "#"} 
            icon={<CreditCard className="h-4 w-4" />} 
            isActive={currentSiteIdentifier ? location.startsWith(APP_ROUTES.DASHBOARD_SITE.BILLING(currentSiteIdentifier)) : false} 
            collapsed={true}
          >
            Billing
          </NavItem>
          
          <NavItem 
            href={currentSiteIdentifier ? APP_ROUTES.DASHBOARD_SITE.REPORTS(currentSiteIdentifier) : "#"} 
            icon={<BarChart2 className="h-4 w-4" />} 
            isActive={currentSiteIdentifier ? location.startsWith(APP_ROUTES.DASHBOARD_SITE.REPORTS(currentSiteIdentifier)) : false} 
            collapsed={true}
          >
            Reports
          </NavItem>
          
          <NavItem 
            href={currentSiteIdentifier ? APP_ROUTES.DASHBOARD_SITE.APP_STORE(currentSiteIdentifier) : "#"} 
            icon={<ShoppingBag className="h-4 w-4" />} 
            isActive={currentSiteIdentifier ? location.startsWith(APP_ROUTES.DASHBOARD_SITE.APP_STORE(currentSiteIdentifier)) : false} 
            collapsed={true}
          >
            App Store
          </NavItem>

          {/* Divider */}
          <div className="my-2 border-t border-gray-200 dark:border-gray-700 w-8/12 mx-auto"></div>
          
          <NavItem 
            href={currentSiteIdentifier ? APP_ROUTES.DASHBOARD_SITE.DESIGN_STUDIO(currentSiteIdentifier) : "#"} 
            icon={<Shapes className="text-white h-4 w-4" />} 
            isActive={currentSiteIdentifier ? location.startsWith(APP_ROUTES.DASHBOARD_SITE.DESIGN_STUDIO(currentSiteIdentifier)) : false} 
            collapsed={true}
            isPro={true}
          >
            Design Studio
          </NavItem>
        </nav>
        
        <div className="mt-auto flex flex-col items-center gap-3 pb-2">
          {/* Return to sites list button (already global, no change needed) */}
          <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Link href={APP_ROUTES.SITES_LIST} className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 p-1.5">
                  <Home className="h-4 w-4" />
                </Link>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-gray-900 text-white px-2 py-1 rounded text-sm animate-in fade-in-50 data-[side=right]:slide-in-from-left-2"
                  side="right"
                  sideOffset={10}
                >
                  <span>All Sites</span>
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
          
          {/* Onboarding button with GraduationCap icon */}
          <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 p-1.5">
                  <GraduationCap className="h-4 w-4" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-gray-900 text-white px-2 py-1 rounded text-sm animate-in fade-in-50 data-[side=right]:slide-in-from-left-2"
                  side="right"
                  sideOffset={10}
                >
                  <span>Onboarding</span>
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
          
          {/* Dark mode toggle button */}
          <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button 
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 p-1.5"
                  onClick={toggleDarkMode}
                >
                  {isDarkMode ? (
                    <SunMedium className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-gray-900 text-white px-2 py-1 rounded text-sm animate-in fade-in-50 data-[side=right]:slide-in-from-left-2"
                  side="right"
                  sideOffset={10}
                >
                  <span>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
                  <Tooltip.Arrow className="fill-gray-900" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
          
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
                    <span className="font-medium">Olivia Rhye</span>
                    <span className="text-gray-300 text-xs">olivia@untitledui.com</span>
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
