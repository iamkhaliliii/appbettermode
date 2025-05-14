import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";

interface PeopleSidebarProps {
  currentPathname: string;
  isActiveUrl: (url: string, currentPathname: string) => boolean;
}

export const PeopleSidebar: React.FC<PeopleSidebarProps> = ({ currentPathname, isActiveUrl }) => {
  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          People
        </h2>
      </div>

      <div className="space-y-1">
        <SideNavItem
          href="/people/members"
          isActive={isActiveUrl("/people/members", currentPathname) || currentPathname === "/people"}
        >
          Members
        </SideNavItem>

        <SideNavItem
          href="/people/staff"
          isActive={isActiveUrl("/people/staff", currentPathname)}
        >
          Staff
        </SideNavItem>

        <SideNavItem
          href="/people/invitations"
          isActive={isActiveUrl("/people/invitations", currentPathname)}
        >
          Invitations
        </SideNavItem>

        <SideNavItem
          href="/people/profile-fields"
          isActive={isActiveUrl("/people/profile-fields", currentPathname)}
        >
          Profile fields
        </SideNavItem>

        <SideNavItem
          href="/people/badges"
          isActive={isActiveUrl("/people/badges", currentPathname)}
        >
          Badges
        </SideNavItem>
      </div>
    </div>
  );
}; 