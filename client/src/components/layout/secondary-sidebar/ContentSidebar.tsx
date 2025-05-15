import React from "react";
import { Link } from "wouter";
import {
  Plus,
  Folder,
  Inbox,
  MessageCircle,
  ThumbsUp,
  AtSign,
  Flag,
  CalendarCheck,
  ClipboardList,
  FileText,
  Calendar,
  HelpCircle,
  Star,
  MessageSquare,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SideNavItem, SideNavItemWithBadge } from "./SidebarNavigationItems";
import { APP_ROUTES } from "@/config/routes";
import { BaseSidebarProps } from "./types";

export const ContentSidebar: React.FC<BaseSidebarProps> = ({ 
  currentPathname, 
  isActiveUrl,
  siteId
}) => {
  // If no siteId is provided, show nothing
  if (!siteId) {
    return null;
  }

  const basePath = APP_ROUTES.DASHBOARD_SITE.CONTENT(siteId);

  // Default content sidebar - showing CMS Collections directly
  return (
    <div className="p-3">
      <div className="space-y-4">
        <div className="space-y-3">
          {/* Primary Actions */}
          <div className="space-y-0.5">
            <SideNavItemWithBadge
              href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.ALL)}
              isActive={isActiveUrl && (
                isActiveUrl(APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.ALL), currentPathname) || 
                currentPathname === basePath
              )}
              icon={<Folder className="h-3.5 w-3.5" />}
              badgeText="24"
              primary={true}
            >
              All CMS Posts
            </SideNavItemWithBadge>
          </div>

          {/* Content Types - More Compact */}
          <div className="space-y-0.5 border-t border-gray-100 dark:border-gray-700 pt-2">
            <SideNavItem
              href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.EVENTS)}
              isActive={isActiveUrl && isActiveUrl(APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.EVENTS), currentPathname)}
              icon={<Calendar className="h-3.5 w-3.5" />}
            >
              Events
            </SideNavItem>

            <SideNavItem
              href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.DISCUSSIONS)}
              isActive={isActiveUrl && isActiveUrl(APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.DISCUSSIONS), currentPathname)}
              icon={<MessageSquare className="h-3.5 w-3.5" />}
            >
              Discussion
            </SideNavItem>

            <SideNavItem
              href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.ARTICLES)}
              isActive={isActiveUrl && isActiveUrl(APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.ARTICLES), currentPathname)}
              icon={<FileText className="h-3.5 w-3.5" />}
            >
              Articles
            </SideNavItem>

            <SideNavItem
              href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.QUESTIONS)}
              isActive={isActiveUrl && isActiveUrl(APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.QUESTIONS), currentPathname)}
              icon={<HelpCircle className="h-3.5 w-3.5" />}
            >
              Questions
            </SideNavItem>

            <SideNavItem
              href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.WISHLIST)}
              isActive={isActiveUrl && isActiveUrl(APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.WISHLIST), currentPathname)}
              icon={<Star className="h-3.5 w-3.5" />}
            >
              Wishlist
            </SideNavItem>

            <Link href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.NEW_CMS)}>
              <div className="flex items-center py-1.5 text-sm cursor-pointer my-0.5 transition-colors duration-150 px-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 rounded">
                <Plus className="h-3.5 w-3.5 mr-2" />
                <span className="font-normal">Add new CMS</span>
              </div>
            </Link>
          </div>

          {/* Divider and Custom View */}
          <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
            <Link href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.CUSTOM_VIEW)}>
              <div className="flex items-center py-1.5 text-sm cursor-pointer my-0.5 transition-colors duration-150 px-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 rounded">
                <Plus className="h-3.5 w-3.5 mr-2" />
                <span className="font-normal">Add custom view</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}; 