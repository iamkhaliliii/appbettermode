import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";

interface AppStoreSidebarProps {
  currentPathname: string;
  isActiveUrl: (url: string, currentPathname: string) => boolean;
}

export const AppStoreSidebar: React.FC<AppStoreSidebarProps> = ({ currentPathname, isActiveUrl }) => {
  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          App store
        </h2>
      </div>

      <div className="space-y-1">
        {/* This structure with a SideNavItem containing other SideNavItems seems unusual.
            Typically, a section header would not be a SideNavItem itself unless it's also a clickable link.
            Replicating the original structure for now. 
        */}
        <SideNavItem
          href="/app-store/integrations" // Parent item also has a link
          isActive={isActiveUrl("/app-store/integrations", currentPathname) || currentPathname === "/app-store"}
        >
          <div className="space-y-1">
            <SideNavItem
              href="/app-store/integrations"
              // isActive for child items should be specific to their own href, 
              // but the original logic ORs with parent active state. Let's refine if needed.
              isActive={isActiveUrl("/app-store/integrations", currentPathname) || currentPathname === "/app-store"}
            >
              Apps & Integrations
            </SideNavItem>

            <SideNavItem
              href="/app-store/addons"
              isActive={isActiveUrl("/app-store/addons", currentPathname)}
            >
              Add-ons
            </SideNavItem>
          </div>
        </SideNavItem>
      </div>
    </div>
  );
}; 