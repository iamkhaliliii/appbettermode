import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES, getSiteAdminRoute } from "@/config/routes";
import { BaseSidebarProps } from "./types";

export const AppStoreSidebar: React.FC<BaseSidebarProps> = ({ 
  currentPathname, 
  isActiveUrl,
  currentSiteIdentifier
}) => {
  // Determine if we're in site-specific context
  const inSiteContext = !!currentSiteIdentifier;
  
  // Helper function to get the appropriate route based on context
  const getContextualRoute = (generalRoute: string, siteSpecificPath: string) => {
    return inSiteContext 
      ? getSiteAdminRoute(currentSiteIdentifier, siteSpecificPath) 
      : generalRoute;
  };

  const basePath = inSiteContext 
    ? APP_ROUTES.DASHBOARD_SITE.APP_STORE(currentSiteIdentifier)
    : '/dashboard/app-store';
    
  const integrationsPath = `${basePath}/integrations`;
  const addonsPath = `${basePath}/addons`;

  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          App store
        </h2>
      </div>

      <div className="space-y-1">
            <SideNavItem
              href={integrationsPath}
              isActive={isActiveUrl && (
                isActiveUrl(integrationsPath, currentPathname) || 
                currentPathname === basePath
              )}
            >
              Apps & Integrations
            </SideNavItem>

            <SideNavItem
              href={addonsPath}
              isActive={isActiveUrl && isActiveUrl(addonsPath, currentPathname)}
            >
              Add-ons
            </SideNavItem>
          </div>

      </div>

  );
}; 