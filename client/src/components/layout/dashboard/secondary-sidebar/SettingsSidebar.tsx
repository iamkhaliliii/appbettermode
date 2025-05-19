import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES, getSiteAdminRoute } from "@/config/routes";
import { BaseSidebarProps } from "./types";

export const SettingsSidebar: React.FC<BaseSidebarProps> = ({ 
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

  // Helper function to safely check if a route is active
  const checkIsActive = (route: string) => {
    return isActiveUrl && isActiveUrl(route, currentPathname);
  };

  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          Settings
        </h2>
      </div>

      <div className="space-y-1">
        <SideNavItem
          href={getContextualRoute(APP_ROUTES.SETTINGS_SITE, 'settings/site')}
          isActive={
            checkIsActive(getContextualRoute(APP_ROUTES.SETTINGS_SITE, 'settings/site')) || 
            (inSiteContext 
              ? currentPathname === getContextualRoute(APP_ROUTES.SETTINGS, 'settings')
              : currentPathname === APP_ROUTES.SETTINGS)
          }
        >
          Site settings
        </SideNavItem>

        <SideNavItem
          href={getContextualRoute(APP_ROUTES.SETTINGS_AUTHENTICATION, 'settings/authentication')}
          isActive={checkIsActive(
            getContextualRoute(APP_ROUTES.SETTINGS_AUTHENTICATION, 'settings/authentication')
          )}
        >
          Authentication
        </SideNavItem>

        <SideNavItem
          href={getContextualRoute(APP_ROUTES.SETTINGS_DOMAIN, 'settings/domain')}
          isActive={checkIsActive(
            getContextualRoute(APP_ROUTES.SETTINGS_DOMAIN, 'settings/domain')
          )}
        >
          Domain
        </SideNavItem>

        <SideNavItem
          href={getContextualRoute(APP_ROUTES.SETTINGS_SEARCH, 'settings/search')}
          isActive={checkIsActive(
            getContextualRoute(APP_ROUTES.SETTINGS_SEARCH, 'settings/search')
          )}
        >
          Search
        </SideNavItem>

        <SideNavItem
          href={getContextualRoute(APP_ROUTES.SETTINGS_MESSAGING, 'settings/messaging')}
          isActive={checkIsActive(
            getContextualRoute(APP_ROUTES.SETTINGS_MESSAGING, 'settings/messaging')
          )}
        >
          Messaging
        </SideNavItem>

        <SideNavItem
          href={getContextualRoute(APP_ROUTES.SETTINGS_MODERATION, 'settings/moderation')}
          isActive={checkIsActive(
            getContextualRoute(APP_ROUTES.SETTINGS_MODERATION, 'settings/moderation')
          )}
        >
          Moderation
        </SideNavItem>

        <SideNavItem
          href={getContextualRoute(APP_ROUTES.SETTINGS_LOCALIZATION, 'settings/localization')}
          isActive={checkIsActive(
            getContextualRoute(APP_ROUTES.SETTINGS_LOCALIZATION, 'settings/localization')
          )}
        >
          Localization
        </SideNavItem>
        
        <SideNavItem
          href={getContextualRoute(APP_ROUTES.SETTINGS_NOTIFICATIONS, 'settings/notifications')}
          isActive={checkIsActive(
            getContextualRoute(APP_ROUTES.SETTINGS_NOTIFICATIONS, 'settings/notifications')
          )}
        >
          Notifications
        </SideNavItem>

        <SideNavItem
          href={getContextualRoute(APP_ROUTES.SETTINGS_SEO, 'settings/seo')}
          isActive={checkIsActive(
            getContextualRoute(APP_ROUTES.SETTINGS_SEO, 'settings/seo')
          )}
        >
          SEO settings
        </SideNavItem>

        <SideNavItem
          href={getContextualRoute(APP_ROUTES.SETTINGS_SECURITY_PRIVACY, 'settings/security-privacy')}
          isActive={checkIsActive(
            getContextualRoute(APP_ROUTES.SETTINGS_SECURITY_PRIVACY, 'settings/security-privacy')
          )}
        >
          Security & Privacy
        </SideNavItem>
      </div>
    </div>
  );
}; 