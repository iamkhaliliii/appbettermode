import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES } from "@/config/routes";

interface ReportsSidebarProps {
  currentPathname: string;
  isActiveUrl: (url: string, currentPathname: string) => boolean;
}

export const ReportsSidebar: React.FC<ReportsSidebarProps> = ({ currentPathname, isActiveUrl }) => {
  const basePath = APP_ROUTES.REPORTS;
  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          Reports
        </h2>
      </div>

      <div className="space-y-1">
        <SideNavItem
          href={`${basePath}/overview`}
          isActive={isActiveUrl(`${basePath}/overview`, currentPathname) || currentPathname === basePath}
        >
          Overview
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/engagement`}
          isActive={isActiveUrl(`${basePath}/engagement`, currentPathname)}
        >
          Reach & Engagement
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/people`}
          isActive={isActiveUrl(`${basePath}/people`, currentPathname)}
        >
          People
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/posts`}
          isActive={isActiveUrl(`${basePath}/posts`, currentPathname)}
        >
          Posts
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/spaces`}
          isActive={isActiveUrl(`${basePath}/spaces`, currentPathname)}
        >
          Spaces
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/messages`}
          isActive={isActiveUrl(`${basePath}/messages`, currentPathname)}
        >
          Messages
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/audit-logs`}
          isActive={isActiveUrl(`${basePath}/audit-logs`, currentPathname)}
        >
          Audit logs
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/email-logs`}
          isActive={isActiveUrl(`${basePath}/email-logs`, currentPathname)}
        >
          Email logs
        </SideNavItem>
      </div>
    </div>
  );
}; 