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
        "flex items-center px-3 py-2 text-sm font-medium rounded-md w-full",
        collapsed ? "justify-center" : "",
        isActive 
          ? "bg-primary-50 text-primary-700" 
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      <span className={cn(
        "flex-shrink-0",
        !collapsed && "mr-3",
        isActive 
          ? "text-primary-700" 
          : "text-gray-500"
      )}>
        {icon}
      </span>
      {!collapsed && (
        <>
          <span>{children}</span>
          {badge && (
            <span className="ml-auto bg-primary-50 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </>
      )}
    </div>
  );

  return collapsed ? (
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
  ) : (
    <Link href={href}>
      {navContent}
    </Link>
  );
}

interface MainSidebarProps {
  collapsed?: boolean;
}

export function MainSidebar({ collapsed = false }: MainSidebarProps) {
  const [location] = useLocation();

  return (
    <aside className={cn(
      "bg-white border-r border-gray-200 h-[calc(100vh-4rem)] overflow-y-auto sticky top-16",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="px-4 py-6">
        <div className={cn(
          "flex items-center mb-8",
          collapsed ? "justify-center" : ""
        )}>
          <div className="flex-shrink-0">
            <svg className="h-8 w-auto text-primary-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
          {!collapsed && (
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900">Untitled UI</h1>
            </div>
          )}
        </div>
        
        <nav className="space-y-1">
          <NavItem 
            href="/" 
            icon={<Home className="h-5 w-5" />} 
            isActive={location === '/'} 
            collapsed={collapsed}
          >
            Dashboard
          </NavItem>
          
          <NavItem 
            href="/calendar" 
            icon={<Calendar className="h-5 w-5" />} 
            isActive={location === '/calendar'} 
            collapsed={collapsed}
          >
            Calendar
          </NavItem>
          
          <NavItem 
            href="/tasks" 
            icon={<Clipboard className="h-5 w-5" />} 
            isActive={location === '/tasks'} 
            badge="10" 
            collapsed={collapsed}
          >
            Tasks
          </NavItem>
          
          <NavItem 
            href="/customers" 
            icon={<Users className="h-5 w-5" />} 
            isActive={location === '/customers'} 
            collapsed={collapsed}
          >
            Customers
          </NavItem>
          
          <NavItem 
            href="/reports" 
            icon={<BarChart2 className="h-5 w-5" />} 
            isActive={location === '/reports'} 
            collapsed={collapsed}
          >
            Reports
          </NavItem>
          
          <NavItem 
            href="/settings" 
            icon={<Settings className="h-5 w-5" />} 
            isActive={location === '/settings'} 
            collapsed={collapsed}
          >
            Settings
          </NavItem>
        </nav>
      </div>
      
      <div className={cn(
        "px-4 py-4 border-t border-gray-200 mt-6",
        collapsed ? "flex justify-center" : ""
      )}>
        {collapsed ? (
          <Tooltip.Provider delayDuration={200}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button className="relative text-gray-400 hover:text-gray-500">
                  <img 
                    className="h-8 w-8 rounded-full border-2 border-gray-200" 
                    src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                    alt="User profile" 
                  />
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
        ) : (
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img 
                className="h-8 w-8 rounded-full" 
                src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="User profile" 
              />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900 truncate">Olivia Rhye</div>
              <div className="text-sm text-gray-500 truncate">olivia@untitledui.com</div>
            </div>
            <button 
              type="button" 
              className="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-500"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
