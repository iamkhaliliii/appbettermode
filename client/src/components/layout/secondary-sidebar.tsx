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
  icon?: React.ReactNode;
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
              ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium" 
              : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200"
          )}
        >
          {icon && (
            <span className={cn(
              "flex-shrink-0 mr-2",
              isActive 
                ? "text-primary-700 dark:text-primary-300" 
                : "text-gray-500 dark:text-gray-400"
            )}>
              {icon}
            </span>
          )}
          <span>{children}</span>
          {badge && (
            <span className="ml-auto bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
      </Link>
  );
}

export function SecondarySidebar() {
  const [location] = useLocation();

  const renderDashboardSidebar = () => (
    <div className="p-3">
      <div className="mb-3">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Overview and quick actions</p>
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
      <div className="mb-3">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">Content</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manage your content</p>
      </div>
      
      <div className="relative w-full mb-3">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        <Input placeholder="Search content..." className="pl-7 h-8 text-xs" />
      </div>
      
      <div className="mb-3">
        <Button variant="default" size="sm" className="w-full text-xs">
          <Plus className="h-3.5 w-3.5 mr-1" /> Add New Content
        </Button>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/content/pages" 
          icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 7.8C5 6.11984 5 5.27976 5.32698 4.63803C5.6146 4.07354 6.07354 3.6146 6.63803 3.32698C7.27976 3 8.11984 3 9.8 3H14.2C15.8802 3 16.7202 3 17.362 3.32698C17.9265 3.6146 18.3854 4.07354 18.673 4.63803C19 5.27976 19 6.11984 19 7.8V16.2C19 17.8802 19 18.7202 18.673 19.362C18.3854 19.9265 17.9265 20.3854 17.362 20.673C16.7202 21 15.8802 21 14.2 21H9.8C8.11984 21 7.27976 21 6.63803 20.673C6.07354 20.3854 5.6146 19.9265 5.32698 19.362C5 18.7202 5 17.8802 5 16.2V7.8Z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M9 17H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M9 12H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M9 7H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>} 
          isActive={location === '/content/pages'}
        >
          Pages
        </SideNavItem>
        
        <SideNavItem 
          href="/content/articles" 
          icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 9H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M9 12H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M9 15H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M19.5 3H4.5C3.67157 3 3 3.67157 3 4.5V19.5C3 20.3284 3.67157 21 4.5 21H19.5C20.3284 21 21 20.3284 21 19.5V4.5C21 3.67157 20.3284 3 19.5 3Z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>} 
          isActive={location === '/content/articles'}
          badge="3"
        >
          Articles
        </SideNavItem>
        
        <SideNavItem 
          href="/content/media" 
          icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 14L14.5 10.5L11.5 13.5L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 14C8.10457 14 9 13.1046 9 12C9 10.8954 8.10457 10 7 10C5.89543 10 5 10.8954 5 12C5 13.1046 5.89543 14 7 14Z" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          </svg>} 
          isActive={location === '/content/media'}
        >
          Media
        </SideNavItem>
        
        <SideNavItem 
          href="/content/forms" 
          icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M16 10H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M16 14H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>} 
          isActive={location === '/content/forms'}
        >
          Forms
        </SideNavItem>
        
        <SideNavItem 
          href="/content/templates" 
          icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 9L13 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M20 12H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M20 15H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M4 9H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M4 12H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M4 15H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M10 22L10 2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M4 4L20 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M4 20L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>} 
          isActive={location === '/content/templates'}
        >
          Templates
        </SideNavItem>
      </div>
    </div>
  );

  const renderAnalyticsSidebar = () => (
    <div className="p-3">
      <div className="mb-3">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">Analytics</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">View and analyze data</p>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/analytics/overview" 
          icon={<BarChart className="h-4 w-4" />} 
          isActive={location === '/analytics/overview' || location === '/analytics'}
        >
          Overview
        </SideNavItem>
        
        <SideNavItem 
          href="/analytics/traffic" 
          icon={<TrendingUp className="h-4 w-4" />} 
          isActive={location === '/analytics/traffic'}
          badge="Live"
        >
          Traffic
        </SideNavItem>
        
        <SideNavItem 
          href="/analytics/engagement" 
          icon={<Users className="h-4 w-4" />} 
          isActive={location === '/analytics/engagement'}
        >
          Engagement
        </SideNavItem>
        
        <SideNavItem 
          href="/analytics/conversions" 
          icon={<DollarSign className="h-4 w-4" />} 
          isActive={location === '/analytics/conversions'}
        >
          Conversions
        </SideNavItem>
        
        <SideNavItem 
          href="/analytics/campaigns" 
          icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21L12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M15.5 5.5C15.5 7.433 13.933 9 12 9C10.067 9 8.5 7.433 8.5 5.5C8.5 3.567 10.067 2 12 2C13.933 2 15.5 3.567 15.5 5.5Z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M5 10V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M19 10V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M5 16C5 18.7614 8.13401 21 12 21C15.866 21 19 18.7614 19 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>} 
          isActive={location === '/analytics/campaigns'}
        >
          Campaigns
        </SideNavItem>
        
        <SideNavItem 
          href="/analytics/reports" 
          icon={<ClipboardList className="h-4 w-4" />} 
          isActive={location === '/analytics/reports'}
        >
          Reports
        </SideNavItem>
      </div>
    </div>
  );

  const renderSettingsSidebar = () => (
    <div className="p-3">
      <div className="mb-3">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">Settings</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manage your account settings</p>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/settings/my-details" 
          icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10Z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6.16406 17.7279C6.38525 17.3205 6.8043 17 7.32563 17H16.6744C17.1957 17 17.6148 17.3205 17.8359 17.7279C18.5029 18.9303 17.5206 20.5 16.1173 20.5H7.88272C6.47941 20.5 5.49711 18.9303 6.16406 17.7279Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>} 
          isActive={location === '/settings/my-details' || location === '/settings'} 
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
          icon={<Lock className="h-4 w-4" />} 
          isActive={location === '/settings/password'} 
        >
          Password
        </SideNavItem>
        
        <SideNavItem 
          href="/settings/team" 
          icon={<Users className="h-4 w-4" />} 
          isActive={location === '/settings/team'} 
        >
          Team
        </SideNavItem>
        
        <SideNavItem 
          href="/settings/billing" 
          icon={<DollarSign className="h-4 w-4" />} 
          isActive={location === '/settings/billing'} 
        >
          Billing
        </SideNavItem>
        
        <SideNavItem 
          href="/settings/notifications" 
          icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          icon={<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  );

  const getSidebarForLocation = () => {
    if (location.startsWith('/dashboard')) {
      return renderDashboardSidebar();
    } else if (location.startsWith('/content')) {
      return renderContentSidebar();
    } else if (location.startsWith('/analytics')) {
      return renderAnalyticsSidebar();
    } else if (location.startsWith('/settings')) {
      return renderSettingsSidebar();
    }
    // Default to dashboard sidebar
    return renderDashboardSidebar();
  };

  return (
    <aside className="secondary-sidebar bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-3rem)] overflow-y-auto sticky top-12 w-48">
      {getSidebarForLocation()}
    </aside>
  );
}
