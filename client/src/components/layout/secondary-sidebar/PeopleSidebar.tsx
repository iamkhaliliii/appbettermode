import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES } from "@/config/routes";

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
          href={APP_ROUTES.PEOPLE_MEMBERS}
          isActive={isActiveUrl(APP_ROUTES.PEOPLE_MEMBERS, currentPathname) || currentPathname === APP_ROUTES.PEOPLE}
        >
          Members
        </SideNavItem>

        <SideNavItem
          href={APP_ROUTES.PEOPLE_STAFF}
          isActive={isActiveUrl(APP_ROUTES.PEOPLE_STAFF, currentPathname)}
        >
          Staff
        </SideNavItem>

        <SideNavItem
          href={APP_ROUTES.PEOPLE_INVITATIONS}
          isActive={isActiveUrl(APP_ROUTES.PEOPLE_INVITATIONS, currentPathname)}
        >
          Invitations
        </SideNavItem>

        <SideNavItem
          href={APP_ROUTES.PEOPLE_PROFILE_FIELDS}
          isActive={isActiveUrl(APP_ROUTES.PEOPLE_PROFILE_FIELDS, currentPathname)}
        >
          Profile fields
        </SideNavItem>

        <SideNavItem
          href={APP_ROUTES.PEOPLE_BADGES}
          isActive={isActiveUrl(APP_ROUTES.PEOPLE_BADGES, currentPathname)}
        >
          Badges
        </SideNavItem>
      </div>
    </div>
  );
}; 