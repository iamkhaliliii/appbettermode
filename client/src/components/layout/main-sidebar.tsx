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
      <div className="px-2 py-6 h-full flex flex-col">
        <nav className="space-y-4 flex-grow flex flex-col items-center">
          <NavItem 
            href="/" 
            icon={<Home className="h-5 w-5" />} 
            isActive={location === '/'} 
            collapsed={true}
          >
            Dashboard
          </NavItem>
          
          <NavItem 
            href="/calendar" 
            icon={<Calendar className="h-5 w-5" />} 
            isActive={location === '/calendar'} 
            collapsed={true}
          >
            Calendar
          </NavItem>
          
          <NavItem 
            href="/tasks" 
            icon={<Clipboard className="h-5 w-5" />} 
            isActive={location === '/tasks'} 
            badge="10" 
            collapsed={true}
          >
            Tasks
          </NavItem>
          
          <NavItem 
            href="/customers" 
            icon={<Users className="h-5 w-5" />} 
            isActive={location === '/customers'} 
            collapsed={true}
          >
            Customers
          </NavItem>
          
          <NavItem 
            href="/reports" 
            icon={<BarChart2 className="h-5 w-5" />} 
            isActive={location === '/reports'} 
            collapsed={true}
          >
            Reports
          </NavItem>
          
          <NavItem 
            href="/settings" 
            icon={<Settings className="h-5 w-5" />} 
            isActive={location === '/settings'} 
            collapsed={true}
          >
            Settings
          </NavItem>
        </nav>
        
        <div className="mt-auto flex justify-center">
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
