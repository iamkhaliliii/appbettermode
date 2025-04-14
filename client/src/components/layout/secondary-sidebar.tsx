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
    <div className="p-4">
      <div className="mb-4">
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
    <div className="p-4">
      <div className="mb-3">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500">content</h2>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/content/posts"
          isActive={location === '/content/posts' || location === '/content'}
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
          href="/content/comments"
          isActive={location === '/content/comments'}
        >
          Comments
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
      <div className="mb-3">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500">people</h2>
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
      <div className="mb-3">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500">settings</h2>
      </div>
      
      <div className="space-y-1">
        <SideNavItem 
          href="/settings/my-details" 
          isActive={location === '/settings/my-details' || location === '/settings'} 
        >
          My details
        </SideNavItem>
        
        <SideNavItem 
          href="/settings/profile" 
          isActive={location === '/settings/profile'} 
        >
          Profile
        </SideNavItem>
        
        <SideNavItem 
          href="/settings/password" 
          isActive={location === '/settings/password'} 
        >
          Password
        </SideNavItem>
        
        <SideNavItem 
          href="/settings/team" 
          isActive={location === '/settings/team'} 
        >
          Team
        </SideNavItem>
        
        <SideNavItem 
          href="/settings/billing" 
          isActive={location === '/settings/billing'} 
        >
          Billing
        </SideNavItem>
        
        <SideNavItem 
          href="/settings/notifications" 
          isActive={location === '/settings/notifications'} 
        >
          Notifications
        </SideNavItem>
        
        <SideNavItem 
          href="/settings/integrations" 
          isActive={location === '/settings/integrations'} 
        >
          Integrations
        </SideNavItem>
      </div>
    </div>
  );

  const renderDesignStudioSidebar = () => (
    <div className="p-4">
      <div className="mb-3">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500">design studio</h2>
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
      <div className="mb-3">
        <h2 className="text-xs font-normal text-gray-500 dark:text-gray-400 uppercase tracking-wider">Appearance</h2>
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
      <div className="mb-3">
        <h2 className="text-xs font-normal text-gray-500 dark:text-gray-400 uppercase tracking-wider">Billing</h2>
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
    <div className="p-4">
      <div className="mb-3">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Reports</h2>
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
    <div className="p-4">
      <div className="mb-3">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">App Store</h2>
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
