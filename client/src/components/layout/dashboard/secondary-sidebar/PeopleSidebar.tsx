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
  
  // Determine if we're in moderator context
  const isModerator = currentPathname.startsWith('/dashboard/moderator/');
  
  // Helper function to get the appropriate route based on context
  const getContextualRoute = (generalRoute: string, siteSpecificPath: string) => {
    return inSiteContext 
      ? getSiteAdminRoute(currentSiteIdentifier, siteSpecificPath) 
      : generalRoute;
  };
  
  // Helper function to get people section URLs
  const getPeopleUrl = (section: string) => {
    if (isModerator && currentSiteIdentifier) {
      return `${APP_ROUTES.DASHBOARD_MODERATOR.PEOPLE(currentSiteIdentifier)}/${section}`;
    }
    if (inSiteContext && currentSiteIdentifier) {
      switch (section) {
        case 'members':
          return APP_ROUTES.DASHBOARD_SITE.PEOPLE_MEMBERS(currentSiteIdentifier);
        case 'staff':
          return APP_ROUTES.DASHBOARD_SITE.PEOPLE_STAFF(currentSiteIdentifier);
        case 'invitations':
          return APP_ROUTES.DASHBOARD_SITE.PEOPLE_INVITATIONS(currentSiteIdentifier);
        default:
          return APP_ROUTES.DASHBOARD_SITE.PEOPLE(currentSiteIdentifier);
      }
    }
    return `/dashboard/people/${section}`;
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
          href={getPeopleUrl('members')}
          isActive={
            currentPathname === getPeopleUrl('members') || 
            (isModerator && currentPathname === APP_ROUTES.DASHBOARD_MODERATOR.PEOPLE(currentSiteIdentifier || '')) ||
            (!isModerator && inSiteContext && currentPathname === APP_ROUTES.DASHBOARD_SITE.PEOPLE(currentSiteIdentifier || '')) ||
            (!isModerator && !inSiteContext && currentPathname === '/dashboard/people')
          }
        >
          Members
        </SideNavItem>

        <SideNavItem
          href={getPeopleUrl('staff')}
          isActive={currentPathname === getPeopleUrl('staff')}
        >
          Staff
        </SideNavItem>

        <SideNavItem
          href={getPeopleUrl('invitations')}
          isActive={currentPathname === getPeopleUrl('invitations')}
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