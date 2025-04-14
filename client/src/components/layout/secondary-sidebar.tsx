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
            "flex items-center px-3 py-2 text-sm rounded cursor-pointer my-0.5 transition-colors duration-100",
            isActive 
              ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium" 
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
          )}
        >
          {icon && (
            <span className={cn(
              "flex-shrink-0 mr-2",
              isActive 
                ? "text-gray-900 dark:text-gray-100" 
                : "text-gray-500 dark:text-gray-400"
            )}>
              {icon}
            </span>
          )}
          <span className={isActive ? "font-medium" : "font-normal"}>{children}</span>
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
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">Content</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage your content</p>
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
          href="/content"
          isActive={location === '/content'}
        >
          Content
        </SideNavItem>
        
        <SideNavItem 
          href="/content/posts"
          isActive={location === '/content/posts'}
        >
          Posts
        </SideNavItem>
        
        <SideNavItem 
          href="/content/spaces"
          isActive={location === '/content/spaces'}
        >
          Spaces
        </SideNavItem>
        
        <SideNavItem 
          href="/content/tags"
          isActive={location === '/content/tags'}
        >
          Tags
        </SideNavItem>
      </div>
    </div>
  );

  const renderPeopleSidebar = () => (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">People</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage users and permissions</p>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/people/members"
          isActive={location === '/people/members' || location === '/people'}
        >
          Members
        </SideNavItem>
        
        <SideNavItem 
          href="/people/staff"
          isActive={location === '/people/staff'}
        >
          Staff
        </SideNavItem>
        
        <SideNavItem 
          href="/people/invitations"
          isActive={location === '/people/invitations'}
        >
          Invitations
        </SideNavItem>
        
        <SideNavItem 
          href="/people/profile-fields"
          isActive={location === '/people/profile-fields'}
        >
          Profile fields
        </SideNavItem>
        
        <SideNavItem 
          href="/people/badges"
          isActive={location === '/people/badges'}
        >
          Badges
        </SideNavItem>
      </div>
    </div>
  );

  const renderSettingsSidebar = () => (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">Settings</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage your account settings</p>
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

  const renderDesignStudioSidebar = () => (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">Design Studio</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Customize your site design</p>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/design-studio/collections"
          isActive={location === '/design-studio/collections' || location === '/design-studio'}
        >
          Collections and spaces
        </SideNavItem>
        
        <SideNavItem 
          href="/design-studio/header"
          isActive={location === '/design-studio/header'}
        >
          Header and sidebar
        </SideNavItem>
      </div>
    </div>
  );
  
  const renderAppearanceSidebar = () => (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">Appearance</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Customize your site's appearance</p>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/appearance/logos"
          isActive={location === '/appearance/logos' || location === '/appearance'}
        >
          Logos
        </SideNavItem>
        
        <SideNavItem 
          href="/appearance/themes"
          isActive={location === '/appearance/themes'}
        >
          Themes
        </SideNavItem>
        
        <SideNavItem 
          href="/appearance/typographies"
          isActive={location === '/appearance/typographies'}
        >
          Typographies
        </SideNavItem>
        
        <SideNavItem 
          href="/appearance/styles"
          isActive={location === '/appearance/styles'}
        >
          Styles
        </SideNavItem>
      </div>
    </div>
  );
  
  const renderBillingSidebar = () => (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">Billing</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage subscriptions and payments</p>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/billing/summary"
          isActive={location === '/billing/summary' || location === '/billing'}
        >
          Summary
        </SideNavItem>
        
        <SideNavItem 
          href="/billing/subscription"
          isActive={location === '/billing/subscription'}
        >
          Subscription plans
        </SideNavItem>
        
        <SideNavItem 
          href="/billing/usage"
          isActive={location === '/billing/usage'}
        >
          Service usage
        </SideNavItem>
      </div>
    </div>
  );
  
  const renderReportsSidebar = () => (
    <div className="p-3">
      <div className="mb-3">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">Reports</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">View analytics and logs</p>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/reports/overview"
          isActive={location === '/reports/overview' || location === '/reports'}
        >
          Overview
        </SideNavItem>
        
        <SideNavItem 
          href="/reports/engagement"
          isActive={location === '/reports/engagement'}
        >
          Reach & Engagement
        </SideNavItem>
        
        <SideNavItem 
          href="/reports/people"
          isActive={location === '/reports/people'}
        >
          People
        </SideNavItem>
        
        <SideNavItem 
          href="/reports/posts"
          isActive={location === '/reports/posts'}
        >
          Posts
        </SideNavItem>
        
        <SideNavItem 
          href="/reports/spaces"
          isActive={location === '/reports/spaces'}
        >
          Spaces
        </SideNavItem>
        
        <SideNavItem 
          href="/reports/messages"
          isActive={location === '/reports/messages'}
        >
          Messages
        </SideNavItem>
        
        <SideNavItem 
          href="/reports/audit-logs"
          isActive={location === '/reports/audit-logs'}
        >
          Audit logs
        </SideNavItem>
        
        <SideNavItem 
          href="/reports/email-logs"
          isActive={location === '/reports/email-logs'}
        >
          Email logs
        </SideNavItem>
      </div>
    </div>
  );
  
  const renderAppStoreSidebar = () => (
    <div className="p-3">
      <div className="mb-3">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">App Store</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Extend your site with apps</p>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/app-store/integrations"
          isActive={location === '/app-store/integrations' || location === '/app-store'}
        >
          Apps & Integrations
        </SideNavItem>
        
        <SideNavItem 
          href="/app-store/addons"
          isActive={location === '/app-store/addons'}
        >
          Add-ons
        </SideNavItem>
      </div>
    </div>
  );

  const getSidebarForLocation = () => {
    if (location.startsWith('/content')) {
      return renderContentSidebar();
    } else if (location.startsWith('/people')) {
      return renderPeopleSidebar();
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
