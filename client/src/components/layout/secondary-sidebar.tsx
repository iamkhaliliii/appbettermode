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
    <li>
      <Link href={href}>
        <a
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md",
            isActive 
              ? "bg-primary-50 text-primary-700" 
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          )}
        >
          <span className={cn(
            "flex-shrink-0 mr-3",
            isActive 
              ? "text-primary-700" 
              : "text-gray-500"
          )}>
            {icon}
          </span>
          <span>{children}</span>
          {badge && (
            <span className="ml-auto bg-primary-50 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </a>
      </Link>
    </li>
  );
}

export function SecondarySidebar() {
  const [location] = useLocation();

  return (
    <aside className="secondary-sidebar bg-white border-r border-gray-200 h-[calc(100vh-4rem)] overflow-y-auto sticky top-16 w-80">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input 
            type="text" 
            className="pl-10" 
            placeholder="Search reports" 
          />
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Overview</h3>
            <ul className="space-y-2">
              <SideNavItem 
                href="/analytics/dashboard" 
                icon={<BarChart className="h-5 w-5" />} 
                isActive={location === '/analytics/dashboard'} 
              >
                Dashboard
              </SideNavItem>
              
              <SideNavItem 
                href="/analytics/performance" 
                icon={<TrendingUp className="h-5 w-5" />} 
                isActive={location === '/analytics/performance'} 
              >
                Performance
              </SideNavItem>
              
              <SideNavItem 
                href="/analytics/audience" 
                icon={<Users className="h-5 w-5" />} 
                isActive={location === '/analytics/audience'} 
              >
                Audience
              </SideNavItem>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Reports</h3>
            <ul className="space-y-2">
              <SideNavItem 
                href="/analytics/revenue" 
                icon={<DollarSign className="h-5 w-5" />} 
                isActive={location === '/analytics/revenue'} 
              >
                Revenue
              </SideNavItem>
              
              <SideNavItem 
                href="/analytics/products" 
                icon={<ShoppingBag className="h-5 w-5" />} 
                isActive={location === '/analytics/products'} 
                badge="New"
              >
                Products
              </SideNavItem>
              
              <SideNavItem 
                href="/analytics/orders" 
                icon={<ClipboardList className="h-5 w-5" />} 
                isActive={location === '/analytics/orders'} 
              >
                Orders
              </SideNavItem>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Settings</h3>
            <ul className="space-y-2">
              <SideNavItem 
                href="/analytics/settings/general" 
                icon={<Settings className="h-5 w-5" />} 
                isActive={location === '/analytics/settings/general'} 
              >
                General
              </SideNavItem>
              
              <SideNavItem 
                href="/analytics/settings/security" 
                icon={<Lock className="h-5 w-5" />} 
                isActive={location === '/analytics/settings/security'} 
              >
                Security
              </SideNavItem>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
