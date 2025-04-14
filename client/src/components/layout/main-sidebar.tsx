import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Calendar, 
  Clipboard, 
  Users, 
  BarChart2, 
  Settings,
  LogOut
} from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";

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
        "flex items-center justify-center p-2 w-10 h-10 rounded-full",
        isActive 
          ? "bg-primary-50 text-primary-700" 
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      <span className={cn(
        isActive 
          ? "text-primary-700" 
          : "text-gray-500"
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

  return (
    <aside className="bg-white border-r border-gray-200 h-[calc(100vh-4rem)] overflow-y-auto sticky top-16 w-16">
      <div className="px-2 py-5 h-full flex flex-col">
        <nav className="space-y-3 flex-grow flex flex-col items-center pt-2">
          <NavItem 
            href="/" 
            icon={<Home className="h-5 w-5" />} 
            isActive={location === '/'} 
            collapsed={true}
          >
            Home
          </NavItem>
          
          <NavItem 
            href="/pages" 
            icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V5Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M15 4V11C15 11.5523 14.5523 12 14 12H10C9.44772 12 9 11.5523 9 11V4" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 16H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>} 
            isActive={location === '/pages'} 
            collapsed={true}
          >
            Pages
          </NavItem>
          
          <NavItem 
            href="/media" 
            icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 10L20 15M20 15L15 20M20 15H10M8 15C8 16.6569 6.65685 18 5 18C3.34315 18 2 16.6569 2 15C2 13.3431 3.34315 12 5 12C6.65685 12 8 13.3431 8 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>} 
            isActive={location === '/media'} 
            collapsed={true}
          >
            Media
          </NavItem>
          
          <NavItem 
            href="/settings" 
            icon={<Settings className="h-5 w-5" />} 
            isActive={location.includes('/settings')} 
            collapsed={true}
          >
            Settings
          </NavItem>
          
          <NavItem 
            href="/logs" 
            icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 13H13V17H11V13H7V11H11V7H13V11H17V13Z" fill="currentColor"/>
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>} 
            isActive={location === '/logs'} 
            collapsed={true}
          >
            Activity Logs
          </NavItem>
        </nav>
        
        <div className="mt-auto flex justify-center pb-2">
          <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button className="relative text-gray-400 hover:text-gray-500">
                  <img 
                    className="h-8 w-8 rounded-full border-2 border-gray-200" 
                    src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                    alt="User profile" 
                  />
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white"></div>
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
