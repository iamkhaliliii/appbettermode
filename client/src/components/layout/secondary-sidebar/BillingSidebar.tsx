import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";

interface BillingSidebarProps {
  currentPathname: string;
  isActiveUrl: (url: string, currentPathname: string) => boolean;
}

export const BillingSidebar: React.FC<BillingSidebarProps> = ({ currentPathname, isActiveUrl }) => {
  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          Billing
        </h2>
      </div>

      <div className="space-y-1">
        <SideNavItem
          href="/billing/summary"
          isActive={isActiveUrl("/billing/summary", currentPathname) || currentPathname === "/billing"}
        >
          Summary
        </SideNavItem>

        <SideNavItem
          href="/billing/subscription"
          isActive={isActiveUrl("/billing/subscription", currentPathname)}
        >
          Subscription plans
        </SideNavItem>

        <SideNavItem
          href="/billing/usage"
          isActive={isActiveUrl("/billing/usage", currentPathname)}
        >
          Service usage
        </SideNavItem>
      </div>
    </div>
  );
}; 