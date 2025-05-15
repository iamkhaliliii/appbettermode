import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES, getSiteAdminRoute } from "@/config/routes";
import { BaseSidebarProps } from "./types";

export const SiteSidebar: React.FC<BaseSidebarProps> = ({ 
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
    ? `/dashboard/site/${siteId}` 
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