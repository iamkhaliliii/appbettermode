import React from "react";
import {
  FileCheck,
  AlertTriangle,
  UserCheck,
  UserX,
} from "lucide-react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES } from "@/config/routes";
import { BaseSidebarProps } from "./types";

export const ModerationSidebar: React.FC<BaseSidebarProps> = ({ 
  currentPathname, 
  isActiveUrl,
  currentSiteIdentifier
}) => {
  // If no currentSiteIdentifier is provided, show nothing
  if (!currentSiteIdentifier) {
    return null;
  }

  const basePath = APP_ROUTES.DASHBOARD_SITE.MODERATION(currentSiteIdentifier);

  // Helper function to check if the current path matches the given path
  const checkActive = (path: string): boolean => {
    if (isActiveUrl) {
      return isActiveUrl(path, currentPathname);
    }
    return currentPathname === path;
  };

  return (
    <div className="p-3">
      <div className="space-y-4">
        <div className="space-y-3">
          {/* Moderation Items for Posts */}
          <div className="space-y-0.5">
            <h2 className="text-xs text-gray-400 font-semibold uppercase px-2.5 py-1.5">
              Content Moderation
            </h2>
            

            <SideNavItem
              href={APP_ROUTES.DASHBOARD_SITE.MODERATION_SECTION(currentSiteIdentifier, APP_ROUTES.MODERATION_TYPES.PENDING_POSTS)}
              isActive={checkActive(APP_ROUTES.DASHBOARD_SITE.MODERATION_SECTION(currentSiteIdentifier, APP_ROUTES.MODERATION_TYPES.PENDING_POSTS))}
              icon={<FileCheck className="h-3.5 w-3.5" />}
            >
              Pending Posts
            </SideNavItem>
            
            <SideNavItem
              href={APP_ROUTES.DASHBOARD_SITE.MODERATION_SECTION(currentSiteIdentifier, APP_ROUTES.MODERATION_TYPES.REPORTED_POSTS)}
              isActive={checkActive(APP_ROUTES.DASHBOARD_SITE.MODERATION_SECTION(currentSiteIdentifier, APP_ROUTES.MODERATION_TYPES.REPORTED_POSTS))}
              icon={<AlertTriangle className="h-3.5 w-3.5" />}
            >
              Reported Posts
            </SideNavItem>
          </div>

          {/* Moderation Items for Members */}
          <div className="space-y-0.5 border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
            <h2 className="text-xs text-gray-400 font-semibold uppercase px-2.5 py-1.5">
              Member Moderation
            </h2>
            
            <SideNavItem
              href={APP_ROUTES.DASHBOARD_SITE.MODERATION_SECTION(currentSiteIdentifier, APP_ROUTES.MODERATION_TYPES.PENDING_MEMBERS)}
              isActive={checkActive(APP_ROUTES.DASHBOARD_SITE.MODERATION_SECTION(currentSiteIdentifier, APP_ROUTES.MODERATION_TYPES.PENDING_MEMBERS))}
              icon={<UserCheck className="h-3.5 w-3.5" />}
            >
              Pending Members
            </SideNavItem>
            
            <SideNavItem
              href={APP_ROUTES.DASHBOARD_SITE.MODERATION_SECTION(currentSiteIdentifier, APP_ROUTES.MODERATION_TYPES.REPORTED_MEMBERS)}
              isActive={checkActive(APP_ROUTES.DASHBOARD_SITE.MODERATION_SECTION(currentSiteIdentifier, APP_ROUTES.MODERATION_TYPES.REPORTED_MEMBERS))}
              icon={<UserX className="h-3.5 w-3.5" />}
            >
              Reported Members
            </SideNavItem>
          </div>
        </div>
      </div>
    </div>
  );
}; 