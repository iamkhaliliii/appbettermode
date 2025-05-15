import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES } from "@/config/routes";

interface SettingsSidebarProps {
  currentPathname: string;
  isActiveUrl: (url: string, currentPathname: string) => boolean;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ currentPathname, isActiveUrl }) => {
  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          Settings
        </h2>
      </div>

      <div className="space-y-1">
        <SideNavItem
          href={APP_ROUTES.SETTINGS_SITE}
          isActive={isActiveUrl(APP_ROUTES.SETTINGS_SITE, currentPathname) || currentPathname === APP_ROUTES.SETTINGS}
        >
          Site settings
        </SideNavItem>

        <SideNavItem
          href={APP_ROUTES.SETTINGS_AUTHENTICATION}
          isActive={isActiveUrl(APP_ROUTES.SETTINGS_AUTHENTICATION, currentPathname)}
        >
          Authentication
        </SideNavItem>

        <SideNavItem
          href={APP_ROUTES.SETTINGS_DOMAIN}
          isActive={isActiveUrl(APP_ROUTES.SETTINGS_DOMAIN, currentPathname)}
        >
          Domain
        </SideNavItem>

        <SideNavItem
          href={APP_ROUTES.SETTINGS_SEARCH}
          isActive={isActiveUrl(APP_ROUTES.SETTINGS_SEARCH, currentPathname)}
        >
          Search
        </SideNavItem>

        <SideNavItem
          href={APP_ROUTES.SETTINGS_MESSAGING}
          isActive={isActiveUrl(APP_ROUTES.SETTINGS_MESSAGING, currentPathname)}
        >
          Messaging
        </SideNavItem>

        <SideNavItem
          href={APP_ROUTES.SETTINGS_MODERATION}
          isActive={isActiveUrl(APP_ROUTES.SETTINGS_MODERATION, currentPathname)}
        >
          Moderation
        </SideNavItem>

        <SideNavItem
          href={APP_ROUTES.SETTINGS_LOCALIZATION}
          isActive={isActiveUrl(APP_ROUTES.SETTINGS_LOCALIZATION, currentPathname)}
        >
          Localization
        </SideNavItem>
        
        <SideNavItem
          href={APP_ROUTES.SETTINGS_NOTIFICATIONS}
          isActive={isActiveUrl(APP_ROUTES.SETTINGS_NOTIFICATIONS, currentPathname)}
        >
          Notifications
        </SideNavItem>

        <SideNavItem
          href={APP_ROUTES.SETTINGS_SEO}
          isActive={isActiveUrl(APP_ROUTES.SETTINGS_SEO, currentPathname)}
        >
          SEO settings
        </SideNavItem>

        <SideNavItem
          href={APP_ROUTES.SETTINGS_SECURITY_PRIVACY}
          isActive={isActiveUrl(APP_ROUTES.SETTINGS_SECURITY_PRIVACY, currentPathname)}
        >
          Security & Privacy
        </SideNavItem>
      </div>
    </div>
  );
}; 