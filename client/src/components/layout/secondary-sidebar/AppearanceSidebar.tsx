import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";

interface AppearanceSidebarProps {
  currentPathname: string;
  isActiveUrl: (url: string, currentPathname: string) => boolean;
}

export const AppearanceSidebar: React.FC<AppearanceSidebarProps> = ({ currentPathname, isActiveUrl }) => {
  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          Appearance
        </h2>
      </div>

      <div className="space-y-1">
        <SideNavItem
          href="/appearance/logos"
          isActive={isActiveUrl("/appearance/logos", currentPathname) || currentPathname === "/appearance"}
        >
          Logos
        </SideNavItem>

        <SideNavItem
          href="/appearance/themes"
          isActive={isActiveUrl("/appearance/themes", currentPathname)}
        >
          Themes
        </SideNavItem>

        <SideNavItem
          href="/appearance/typographies"
          isActive={isActiveUrl("/appearance/typographies", currentPathname)}
        >
          Typographies
        </SideNavItem>

        <SideNavItem
          href="/appearance/styles"
          isActive={isActiveUrl("/appearance/styles", currentPathname)}
        >
          Styles
        </SideNavItem>
      </div>
    </div>
  );
}; 