import React from "react";
import { BarChart, TrendingUp, Users, DollarSign, ShoppingBag, ClipboardList } from "lucide-react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES } from "@/config/routes";

interface DashboardSidebarProps {
  currentPathname: string;
  isActiveUrl: (url: string, currentPathname: string) => boolean;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ currentPathname, isActiveUrl }) => {
  const basePath = '/dashboard';
  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">
          Dashboard
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Overview and quick actions
        </p>
      </div>

      <div className="space-y-1">
        <SideNavItem
          href={basePath}
          icon={<BarChart className="h-4 w-4" />}
          isActive={currentPathname === basePath || isActiveUrl(basePath, currentPathname)}
        >
          Overview
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/performance`}
          icon={<TrendingUp className="h-4 w-4" />}
          isActive={isActiveUrl(`${basePath}/performance`, currentPathname)}
        >
          Performance
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/customers`}
          icon={<Users className="h-4 w-4" />}
          isActive={isActiveUrl(`${basePath}/customers`, currentPathname)}
          badge="New"
        >
          Customers
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/revenue`}
          icon={<DollarSign className="h-4 w-4" />}
          isActive={isActiveUrl(`${basePath}/revenue`, currentPathname)}
        >
          Revenue
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/inventory`}
          icon={<ShoppingBag className="h-4 w-4" />}
          isActive={isActiveUrl(`${basePath}/inventory`, currentPathname)}
        >
          Inventory
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/reports`}
          icon={<ClipboardList className="h-4 w-4" />}
          isActive={isActiveUrl(`${basePath}/reports`, currentPathname)}
        >
          Reports
        </SideNavItem>
      </div>
    </div>
  );
}; 