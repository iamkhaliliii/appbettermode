import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES, getSiteAdminRoute } from "@/config/routes";
import { BaseSidebarProps } from "./types";

export const PeopleSidebar: React.FC<BaseSidebarProps> = ({ 
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
  
  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          People
        </h2>
      </div>

      <div className="space-y-1">
        <SideNavItem
          href={inSiteContext ? APP_ROUTES.DASHBOARD_SITE.PEOPLE_MEMBERS(siteId) : '/dashboard/people/members'}
          isActive={
            inSiteContext 
              ? (isActiveUrl && isActiveUrl(APP_ROUTES.DASHBOARD_SITE.PEOPLE_MEMBERS(siteId), currentPathname)) || 
                (currentPathname.includes(`/dashboard/site/${siteId}/people`) && 
                !currentPathname.includes('/staff') && 
                !currentPathname.includes('/invitations') && 
                !currentPathname.includes('/profile-fields') && 
                !currentPathname.includes('/badges'))
              : (isActiveUrl && isActiveUrl('/dashboard/people/members', currentPathname)) || currentPathname === '/dashboard/people'
          }
        >
          Members
        </SideNavItem>

        <SideNavItem
          href={inSiteContext ? APP_ROUTES.DASHBOARD_SITE.PEOPLE_STAFF(siteId) : '/dashboard/people/staff'}
          isActive={isActiveUrl && isActiveUrl(
            inSiteContext 
              ? APP_ROUTES.DASHBOARD_SITE.PEOPLE_STAFF(siteId)
              : '/dashboard/people/staff', 
            currentPathname
          )}
        >
          Staff
        </SideNavItem>

        <SideNavItem
          href={inSiteContext ? getSiteAdminRoute(siteId, 'people/invitations') : '/dashboard/people/invitations'}
          isActive={isActiveUrl && isActiveUrl(
            inSiteContext 
              ? getSiteAdminRoute(siteId, 'people/invitations')
              : '/dashboard/people/invitations', 
            currentPathname
          )}
        >
          Invitations
        </SideNavItem>

        <SideNavItem
          href={inSiteContext ? getSiteAdminRoute(siteId, 'people/profile-fields') : '/dashboard/people/profile-fields'}
          isActive={isActiveUrl && isActiveUrl(
            inSiteContext 
              ? getSiteAdminRoute(siteId, 'people/profile-fields')
              : '/dashboard/people/profile-fields', 
            currentPathname
          )}
        >
          Profile fields
        </SideNavItem>

        <SideNavItem
          href={inSiteContext ? getSiteAdminRoute(siteId, 'people/badges') : '/dashboard/people/badges'}
          isActive={isActiveUrl && isActiveUrl(
            inSiteContext 
              ? getSiteAdminRoute(siteId, 'people/badges')
              : '/dashboard/people/badges', 
            currentPathname
          )}
        >
          Badges
        </SideNavItem>
      </div>
    </div>
  );
}; 