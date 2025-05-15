import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES, getSiteAdminRoute } from "@/config/routes";
import { BaseSidebarProps } from "./types";

export const ReportsSidebar: React.FC<BaseSidebarProps> = ({ 
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
    ? APP_ROUTES.DASHBOARD_SITE.REPORTS(siteId)
    : '/dashboard/reports';
    
  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          Reports
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
          href={`${basePath}/engagement`}
          isActive={isActiveUrl && isActiveUrl(`${basePath}/engagement`, currentPathname)}
        >
          Reach & Engagement
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/people`}
          isActive={isActiveUrl && isActiveUrl(`${basePath}/people`, currentPathname)}
        >
          People
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/posts`}
          isActive={isActiveUrl && isActiveUrl(`${basePath}/posts`, currentPathname)}
        >
          Posts
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/spaces`}
          isActive={isActiveUrl && isActiveUrl(`${basePath}/spaces`, currentPathname)}
        >
          Spaces
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/messages`}
          isActive={isActiveUrl && isActiveUrl(`${basePath}/messages`, currentPathname)}
        >
          Messages
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/audit-logs`}
          isActive={isActiveUrl && isActiveUrl(`${basePath}/audit-logs`, currentPathname)}
        >
          Audit logs
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/email-logs`}
          isActive={isActiveUrl && isActiveUrl(`${basePath}/email-logs`, currentPathname)}
        >
          Email logs
        </SideNavItem>
      </div>
    </div>
  );
}; 