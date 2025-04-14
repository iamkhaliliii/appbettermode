import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  BarChart, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingBag, 
  ClipboardList, 
  Settings, 
  Lock 
} from "lucide-react";

interface SideNavItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
  badge?: string;
}

function SideNavItem({ href, icon, children, isActive, badge }: SideNavItemProps) {
  return (
      <Link href={href}>
        <div
          className={cn(
            "flex items-center px-2 py-1.5 text-xs rounded cursor-pointer my-0.5",
            isActive 
              ? "bg-primary-50 text-primary-700 font-medium" 
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          )}
        >
          <span className={cn(
            "flex-shrink-0 mr-2",
            isActive 
              ? "text-primary-700" 
              : "text-gray-500"
          )}>
            {icon}
          </span>
          <span>{children}</span>
          {badge && (
            <span className="ml-auto bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
      </Link>
  );
}

export function SecondarySidebar() {
  const [location] = useLocation();

  return (
    <aside className="secondary-sidebar bg-white border-r border-gray-200 h-[calc(100vh-3rem)] overflow-y-auto sticky top-12 w-64">
      <div className="p-3">
        <div className="mb-3">
          <h2 className="text-base font-medium text-gray-900">Settings</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage your account settings</p>
        </div>
        
        <div className="space-y-1">
          <SideNavItem 
            href="/settings/my-details" 
            icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M6.16406 17.7279C6.38525 17.3205 6.8043 17 7.32563 17H16.6744C17.1957 17 17.6148 17.3205 17.8359 17.7279C18.5029 18.9303 17.5206 20.5 16.1173 20.5H7.88272C6.47941 20.5 5.49711 18.9303 6.16406 17.7279Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>} 
            isActive={location === '/settings/my-details'} 
          >
            My details
          </SideNavItem>
          
          <SideNavItem 
            href="/settings/profile" 
            icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 15.2C16 13.9882 15.5 13 14.5 13H9.5C8.5 13 8 13.9882 8 15.2C8 16.4118 8 18 8 18H16C16 18 16 16.4118 16 15.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M12 10C13.6569 10 15 8.65685 15 7C15 5.34315 13.6569 4 12 4C10.3431 4 9 5.34315 9 7C9 8.65685 10.3431 10 12 10Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>} 
            isActive={location === '/settings/profile'} 
            badge="10"
          >
            Profile
          </SideNavItem>
          
          <SideNavItem 
            href="/settings/password" 
            icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 10V8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M5 10H19V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V10Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M14 15C14 16.1046 13.1046 17 12 17C10.8954 17 10 16.1046 10 15C10 13.8954 10.8954 13 12 13C13.1046 13 14 13.8954 14 15Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>} 
            isActive={location === '/settings/password'} 
          >
            Password
          </SideNavItem>
          
          <SideNavItem 
            href="/settings/team" 
            icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 14C18.1046 14 19 13.1046 19 12C19 10.8954 18.1046 10 17 10C15.8954 10 15 10.8954 15 12C15 13.1046 15.8954 14 17 14Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 9C13.1046 9 14 8.10457 14 7C14 5.89543 13.1046 5 12 5C10.8954 5 10 5.89543 10 7C10 8.10457 10.8954 9 12 9Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7 14C8.10457 14 9 13.1046 9 12C9 10.8954 8.10457 10 7 10C5.89543 10 5 10.8954 5 12C5 13.1046 5.89543 14 7 14Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M17 14C17 14 17 16.1345 17 16.6224C17 17.1103 17.5511 17.126 17.7446 17.1321C18.4631 17.1535 20 17.1429 20 17.1429" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7 14C7 14 7 16.1345 7 16.6224C7 17.1103 6.44892 17.126 6.2554 17.1321C5.53689 17.1535 4 17.1429 4 17.1429" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M12 9C12 9 12 15.8335 12 16.6835C12 17.5335 10.5 17.5 9 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M12 9C12 9 12 15.8335 12 16.6835C12 17.5335 13.5 17.5 15 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>} 
            isActive={location === '/settings/team'} 
          >
            Team
          </SideNavItem>
          
          <SideNavItem 
            href="/settings/billing" 
            icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 8H20V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V8Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M4 4H20V8H4V4Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M16 15H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M4 11H20" stroke="currentColor" strokeWidth="1.5"/>
            </svg>} 
            isActive={location === '/settings/billing'} 
          >
            Billing
          </SideNavItem>
          
          <SideNavItem 
            href="/settings/notifications" 
            icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M9 15H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M12 3V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M15.5 5.5L17 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M8.5 5.5L7 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M16.5 9H19C19.5523 9 20 9.44772 20 10V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V10C4 9.44772 4.44772 9 5 9H7.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9C14.5 10.3807 13.3807 11.5 12 11.5C10.6193 11.5 9.5 10.3807 9.5 9Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>} 
            isActive={location === '/settings/notifications'} 
          >
            Notifications
          </SideNavItem>
          
          <SideNavItem 
            href="/settings/integrations" 
            icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6H7C5.89543 6 5 6.89543 5 8V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M15 6H17C18.1046 6 19 6.89543 19 8V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M5 14V16C5 17.1046 5.89543 18 7 18H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M19 14V16C19 17.1046 18.1046 18 17 18H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M12 4C13.1046 4 14 4.89543 14 6V18C14 19.1046 13.1046 20 12 20C10.8954 20 10 19.1046 10 18V6C10 4.89543 10.8954 4 12 4Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M4 12C4 10.8954 4.89543 10 6 10H18C19.1046 10 20 10.8954 20 12C20 13.1046 19.1046 14 18 14H6C4.89543 14 4 13.1046 4 12Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>} 
            isActive={location === '/settings/integrations'} 
          >
            Integrations
          </SideNavItem>
        </div>
      </div>
    </aside>
  );
}
