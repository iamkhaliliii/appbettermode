import React from "react";
import { SideNavItem } from "./SidebarNavigationItems";

interface ReportsSidebarProps {
  currentPathname: string;
  isActiveUrl: (url: string, currentPathname: string) => boolean;
}

export const ReportsSidebar: React.FC<ReportsSidebarProps> = ({ currentPathname, isActiveUrl }) => {
  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          Reports
        </h2>
      </div>

      <div className="space-y-1">
        <SideNavItem
          href="/reports/overview"
          isActive={isActiveUrl("/reports/overview", currentPathname) || currentPathname === "/reports"}
        >
          Overview
        </SideNavItem>

        <SideNavItem
          href="/reports/engagement"
          isActive={isActiveUrl("/reports/engagement", currentPathname)}
        >
          Reach & Engagement
        </SideNavItem>

        <SideNavItem
          href="/reports/people"
          isActive={isActiveUrl("/reports/people", currentPathname)}
        >
          People
        </SideNavItem>

        <SideNavItem
          href="/reports/posts"
          isActive={isActiveUrl("/reports/posts", currentPathname)}
        >
          Posts
        </SideNavItem>

        <SideNavItem
          href="/reports/spaces"
          isActive={isActiveUrl("/reports/spaces", currentPathname)}
        >
          Spaces
        </SideNavItem>

        <SideNavItem
          href="/reports/messages"
          isActive={isActiveUrl("/reports/messages", currentPathname)}
        >
          Messages
        </SideNavItem>

        <SideNavItem
          href="/reports/audit-logs"
          isActive={isActiveUrl("/reports/audit-logs", currentPathname)}
        >
          Audit logs
        </SideNavItem>

        <SideNavItem
          href="/reports/email-logs"
          isActive={isActiveUrl("/reports/email-logs", currentPathname)}
        >
          Email logs
        </SideNavItem>
      </div>
    </div>
  );
}; 