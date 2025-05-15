import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES, getSiteAdminRoute } from "@/config/routes";
import { BaseSidebarProps } from "./types";

export const BillingSidebar: React.FC<BaseSidebarProps> = ({ 
  currentPathname, 
  isActiveUrl,
  siteId
}) => {
  // Determine if we're in site-specific context
  const inSiteContext = !!siteId;
  
  // Helper function to get the appropriate route based on context
  const getContextualRoute = (generalRoute: string, siteSpecificPath: string) => {
    return inSiteContext 
      ? getSiteAdminRoute(siteId, siteSpecificPath) 
      : generalRoute;
  };

  const basePath = inSiteContext 
    ? APP_ROUTES.DASHBOARD_SITE.BILLING(siteId)
    : '/dashboard/billing';
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
          isActive={isActiveUrl && (
            isActiveUrl(`${basePath}/summary`, currentPathname) || 
            currentPathname === basePath
          )}
        >
          Summary
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/subscription`}
          isActive={isActiveUrl && isActiveUrl(`${basePath}/subscription`, currentPathname)}
        >
          Subscription plans
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/usage`}
          isActive={isActiveUrl && isActiveUrl(`${basePath}/usage`, currentPathname)}
        >
          Service usage
        </SideNavItem>
      </div>
    </div>
  );
}; 