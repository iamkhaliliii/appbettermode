import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES } from "@/config/routes";

interface AppearanceSidebarProps {
  currentPathname: string;
  isActiveUrl: (url: string, currentPathname: string) => boolean;
}

export const AppearanceSidebar: React.FC<AppearanceSidebarProps> = ({ currentPathname, isActiveUrl }) => {
  const basePath = APP_ROUTES.APPEARANCE;
  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          Appearance
        </h2>
      </div>

      <div className="space-y-1">
        <SideNavItem
          href={`${basePath}/logos`}
          isActive={isActiveUrl(`${basePath}/logos`, currentPathname) || currentPathname === basePath}
        >
          Logos
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/themes`}
          isActive={isActiveUrl(`${basePath}/themes`, currentPathname)}
        >
          Themes
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/typographies`}
          isActive={isActiveUrl(`${basePath}/typographies`, currentPathname)}
        >
          Typographies
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/styles`}
          isActive={isActiveUrl(`${basePath}/styles`, currentPathname)}
        >
          Styles
        </SideNavItem>
      </div>
    </div>
  );
}; 