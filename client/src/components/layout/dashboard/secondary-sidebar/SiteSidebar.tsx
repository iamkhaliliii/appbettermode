import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES, getSiteAdminRoute } from "@/config/routes";
import { SiteSidebarProps } from "./types";

export const SiteSidebar: React.FC<SiteSidebarProps> = ({ 
  currentPathname, 
  isActiveUrl,
  currentSiteId
}) => {
  // Determine if we're in site-specific context
  const inSiteContext = !!currentSiteId;
  
  // Helper function to get the appropriate route based on context
  const getContextualRoute = (generalRoute: string, siteSpecificPath: string) => {
    return inSiteContext 
      ? getSiteAdminRoute(currentSiteId, siteSpecificPath) 
      : generalRoute;
  };

  const basePath = inSiteContext 
    ? `/dashboard/site/${currentSiteId}` 
    : '/site';

  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          Site
        </h2>
      </div>

      <div className="space-y-1">
        <SideNavItem
          href={`${basePath}/overview`}
          isActive={isActiveUrl && (
            isActiveUrl(`${basePath}/overview`, currentPathname) || 
            currentPathname === basePath
          )}
        >
          Overview
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/domains`}
          isActive={isActiveUrl && isActiveUrl(`${basePath}/domains`, currentPathname)}
        >
          Domains
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/branding`}
          isActive={isActiveUrl && isActiveUrl(`${basePath}/branding`, currentPathname)}
        >
          Branding
        </SideNavItem>
      </div>
    </div>
  );
}; 