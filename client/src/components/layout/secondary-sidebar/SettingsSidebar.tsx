import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";

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
          href="/settings/site-settings"
          isActive={isActiveUrl("/settings/site-settings", currentPathname) || currentPathname === "/settings"}
        >
          Site settings
        </SideNavItem>

        <SideNavItem
          href="/settings/authentication"
          isActive={isActiveUrl("/settings/authentication", currentPathname)}
        >
          Authentication
        </SideNavItem>

        <SideNavItem
          href="/settings/domain"
          isActive={isActiveUrl("/settings/domain", currentPathname)}
        >
          Domain
        </SideNavItem>

        <SideNavItem
          href="/settings/search"
          isActive={isActiveUrl("/settings/search", currentPathname)}
        >
          Search
        </SideNavItem>

        <SideNavItem
          href="/settings/messaging"
          isActive={isActiveUrl("/settings/messaging", currentPathname)}
        >
          Messaging
        </SideNavItem>

        <SideNavItem
          href="/settings/moderation"
          isActive={isActiveUrl("/settings/moderation", currentPathname)}
        >
          Moderation
        </SideNavItem>

        <SideNavItem
          href="/settings/localization"
          isActive={isActiveUrl("/settings/localization", currentPathname)}
        >
          Localization
        </SideNavItem>
        
        <SideNavItem
          href="/settings/notifications"
          isActive={isActiveUrl("/settings/notifications", currentPathname)}
        >
          Notifications
        </SideNavItem>

        <SideNavItem
          href="/settings/seo-settings"
          isActive={isActiveUrl("/settings/seo-settings", currentPathname)}
        >
          SEO settings
        </SideNavItem>

        <SideNavItem
          href="/settings/security-privacy"
          isActive={isActiveUrl("/settings/security-privacy", currentPathname)}
        >
          Security & Privacy
        </SideNavItem>
      </div>
    </div>
  );
}; 