import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES } from "@/config/routes"; // Import APP_ROUTES

interface AppStoreSidebarProps {
  currentPathname: string;
  isActiveUrl: (url: string, currentPathname: string) => boolean;
}

export const AppStoreSidebar: React.FC<AppStoreSidebarProps> = ({ currentPathname, isActiveUrl }) => {
  const basePath = APP_ROUTES.APP_STORE;
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
          isActive={isActiveUrl(integrationsPath, currentPathname) || currentPathname === basePath}
        >
          <div className="space-y-1">
            <SideNavItem
              href={integrationsPath}
              isActive={isActiveUrl(integrationsPath, currentPathname) || currentPathname === basePath} // The main active check is on the parent
            >
              Apps & Integrations
            </SideNavItem>

            <SideNavItem
              href={addonsPath}
              isActive={isActiveUrl(addonsPath, currentPathname)}
            >
              Add-ons
            </SideNavItem>
          </div>
        </SideNavItem>
      </div>
    </div>
  );
}; 