import React from "react";
import { BarChart, TrendingUp, Users, DollarSign, ShoppingBag, ClipboardList } from "lucide-react";
import { SideNavItem } from "./SidebarNavigationItems";
import { isActiveUrl as isActiveUrlUtil } from "./utils";

interface DashboardSidebarProps {
  currentPathname: string;
  isActiveUrl: (url: string, currentPathname: string) => boolean;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ currentPathname, isActiveUrl }) => {
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
          href="/dashboard"
          icon={<BarChart className="h-4 w-4" />}
          isActive={isActiveUrl("/dashboard", currentPathname)}
        >
          Overview
        </SideNavItem>

        <SideNavItem
          href="/dashboard/performance"
          icon={<TrendingUp className="h-4 w-4" />}
          isActive={isActiveUrl("/dashboard/performance", currentPathname)}
        >
          Performance
        </SideNavItem>

        <SideNavItem
          href="/dashboard/customers"
          icon={<Users className="h-4 w-4" />}
          isActive={isActiveUrl("/dashboard/customers", currentPathname)}
          badge="New"
        >
          Customers
        </SideNavItem>

        <SideNavItem
          href="/dashboard/revenue"
          icon={<DollarSign className="h-4 w-4" />}
          isActive={isActiveUrl("/dashboard/revenue", currentPathname)}
        >
          Revenue
        </SideNavItem>

        <SideNavItem
          href="/dashboard/inventory"
          icon={<ShoppingBag className="h-4 w-4" />}
          isActive={isActiveUrl("/dashboard/inventory", currentPathname)}
        >
          Inventory
        </SideNavItem>

        <SideNavItem
          href="/dashboard/reports"
          icon={<ClipboardList className="h-4 w-4" />}
          isActive={isActiveUrl("/dashboard/reports", currentPathname)}
        >
          Reports
        </SideNavItem>
      </div>
    </div>
  );
}; 