import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  FileText as FileTextIcon,
  Folder,
  PanelsLeftBottom, 
  Users, 
  Shapes, 
  Layers, 
  Settings,
  CreditCard,
  BarChart2,
  ShoppingBag,
  GraduationCap,
  LogOut,
  SunMedium,
  Moon
} from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useState, useEffect } from "react";

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
  badge?: string;
  collapsed?: boolean;
}

function NavItem({ 
  href, 
  icon, 
  children, 
  isActive, 
  badge,
  collapsed = false 
}: NavItemProps) {
  const navContent = (
    <div
      className={cn(
        "flex items-center justify-center p-1.5 w-8 h-8 rounded-md",
        isActive 
          ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300" 
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
      )}
    >
      <span className={cn(
        isActive 
          ? "text-primary-700 dark:text-primary-300" 
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
}

export function MainSidebar({ collapsed = false }: MainSidebarProps) {
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

  return (
    <aside className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-3rem)] overflow-y-auto sticky top-12 w-12">
      <div className="px-1.5 py-3 h-full flex flex-col">
        <nav className="space-y-2 flex-grow flex flex-col items-center pt-1.5">
          <NavItem 
            href="/content" 
            icon={<Folder className="h-4 w-4" />} 
            isActive={location === '/content'} 
            collapsed={true}
          >
            Content
          </NavItem>
          
          <NavItem 
            href="/people" 
            icon={<Users className="h-4 w-4" />} 
            isActive={location === '/people'} 
            collapsed={true}
          >
            People
          </NavItem>
          
          <NavItem 
            href="/design-studio" 
            icon={<PanelsLeftBottom className="h-4 w-4" />} 
            isActive={location === '/design-studio'} 
            collapsed={true}
          >
            Design Studio
          </NavItem>
          
          <NavItem 
            href="/appearance" 
            icon={<Shapes className="h-4 w-4" />} 
            isActive={location === '/appearance'} 
            collapsed={true}
          >
            Appearance
          </NavItem>
          
          <NavItem 
            href="/settings" 
            icon={<Settings className="h-4 w-4" />} 
            isActive={location.includes('/settings')} 
            collapsed={true}
          >
            Settings
          </NavItem>
          
          <NavItem 
            href="/billing" 
            icon={<CreditCard className="h-4 w-4" />} 
            isActive={location === '/billing'} 
            collapsed={true}
          >
            Billing
          </NavItem>
          
          <NavItem 
            href="/reports" 
            icon={<BarChart2 className="h-4 w-4" />} 
            isActive={location === '/reports'} 
            collapsed={true}
          >
            Reports
          </NavItem>
          
          <NavItem 
            href="/app-store" 
            icon={<ShoppingBag className="h-4 w-4" />} 
            isActive={location === '/app-store'} 
            collapsed={true}
          >
            App Store
          </NavItem>
        </nav>
        
        <div className="mt-auto flex flex-col items-center gap-3 pb-2">
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
