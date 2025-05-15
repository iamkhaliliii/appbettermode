import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES, getSiteAdminRoute } from "@/config/routes";
import { BaseSidebarProps } from "./types";

export const AppearanceSidebar: React.FC<BaseSidebarProps> = ({ 
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
    ? APP_ROUTES.DASHBOARD_SITE.APPEARANCE(siteId)
    : '/dashboard/appearance';

  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          Appearance
        </h2>
      </div>

      <div className="space-y-1">
        <SideNavItem
          href={`${basePath}/logos`}
          isActive={isActiveUrl && (
            isActiveUrl(`${basePath}/logos`, currentPathname) || 
            currentPathname === basePath
          )}
        >
          Logos
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/themes`}
          isActive={isActiveUrl && isActiveUrl(`${basePath}/themes`, currentPathname)}
        >
          Themes
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/typographies`}
          isActive={isActiveUrl && isActiveUrl(`${basePath}/typographies`, currentPathname)}
        >
          Typographies
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/styles`}
          isActive={isActiveUrl && isActiveUrl(`${basePath}/styles`, currentPathname)}
        >
          Styles
        </SideNavItem>
      </div>
    </div>
  );
}; 