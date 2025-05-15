import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES } from "@/config/routes";

interface BillingSidebarProps {
  currentPathname: string;
  isActiveUrl: (url: string, currentPathname: string) => boolean;
}

export const BillingSidebar: React.FC<BillingSidebarProps> = ({ currentPathname, isActiveUrl }) => {
  const basePath = APP_ROUTES.BILLING;
  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          Billing
        </h2>
      </div>

      <div className="space-y-1">
        <SideNavItem
          href={`${basePath}/summary`}
          isActive={isActiveUrl(`${basePath}/summary`, currentPathname) || currentPathname === basePath}
        >
          Summary
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/subscription`}
          isActive={isActiveUrl(`${basePath}/subscription`, currentPathname)}
        >
          Subscription plans
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/usage`}
          isActive={isActiveUrl(`${basePath}/usage`, currentPathname)}
        >
          Service usage
        </SideNavItem>
      </div>
    </div>
  );
}; 