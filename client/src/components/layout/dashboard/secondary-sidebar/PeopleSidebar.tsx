import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES, getSiteAdminRoute } from "@/config/routes";
import { BaseSidebarProps } from "./types";

export const PeopleSidebar: React.FC<BaseSidebarProps> = ({ 
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
  
  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          People
        </h2>
      </div>

      <div className="space-y-1">
        <SideNavItem
          href={inSiteContext ? APP_ROUTES.DASHBOARD_SITE.PEOPLE_MEMBERS(currentSiteIdentifier) : '/dashboard/people/members'}
          isActive={
            inSiteContext 
              ? currentPathname === APP_ROUTES.DASHBOARD_SITE.PEOPLE_MEMBERS(currentSiteIdentifier) || 
                (currentPathname === APP_ROUTES.DASHBOARD_SITE.PEOPLE(currentSiteIdentifier))
              : currentPathname === '/dashboard/people/members' || currentPathname === '/dashboard/people'
          }
        >
          Members
        </SideNavItem>

        <SideNavItem
          href={inSiteContext ? APP_ROUTES.DASHBOARD_SITE.PEOPLE_STAFF(currentSiteIdentifier) : '/dashboard/people/staff'}
          isActive={
            inSiteContext 
              ? currentPathname === APP_ROUTES.DASHBOARD_SITE.PEOPLE_STAFF(currentSiteIdentifier)
              : currentPathname === '/dashboard/people/staff'
          }
        >
          Staff
        </SideNavItem>

        <SideNavItem
          href={inSiteContext ? APP_ROUTES.DASHBOARD_SITE.PEOPLE_INVITATIONS(currentSiteIdentifier) : '/dashboard/people/invitations'}
          isActive={
            inSiteContext 
              ? currentPathname === APP_ROUTES.DASHBOARD_SITE.PEOPLE_INVITATIONS(currentSiteIdentifier)
              : currentPathname === '/dashboard/people/invitations'
          }
        >
          Invitations
        </SideNavItem>

        <SideNavItem
          href={inSiteContext ? getSiteAdminRoute(currentSiteIdentifier, 'people/profile-fields') : '/dashboard/people/profile-fields'}
          isActive={
            inSiteContext 
              ? currentPathname === getSiteAdminRoute(currentSiteIdentifier, 'people/profile-fields')
              : currentPathname === '/dashboard/people/profile-fields'
          }
        >
          Profile fields
        </SideNavItem>

        <SideNavItem
          href={inSiteContext ? getSiteAdminRoute(currentSiteIdentifier, 'people/badges') : '/dashboard/people/badges'}
          isActive={
            inSiteContext 
              ? currentPathname === getSiteAdminRoute(currentSiteIdentifier, 'people/badges')
              : currentPathname === '/dashboard/people/badges'
          }
        >
          Badges
        </SideNavItem>
      </div>
    </div>
  );
}; 