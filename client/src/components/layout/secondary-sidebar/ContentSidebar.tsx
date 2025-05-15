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
import { SideNavItem } from "./SidebarNavigationItems";
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

  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          Content
        </h2>
      </div>

      <div className="space-y-1">
        <SideNavItem
          href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.ALL)}
          isActive={isActiveUrl && isActiveUrl(APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.ALL), currentPathname)}
        >
          All Content
        </SideNavItem>

        <SideNavItem
          href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.EVENTS)}
          isActive={isActiveUrl && isActiveUrl(APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.EVENTS), currentPathname)}
        >
          Events
        </SideNavItem>

        <SideNavItem
          href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.DISCUSSIONS)}
          isActive={isActiveUrl && isActiveUrl(APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.DISCUSSIONS), currentPathname)}
        >
          Discussions
        </SideNavItem>

        <SideNavItem
          href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.ARTICLES)}
          isActive={isActiveUrl && isActiveUrl(APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.ARTICLES), currentPathname)}
        >
          Articles
        </SideNavItem>

        <SideNavItem
          href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.QUESTIONS)}
          isActive={isActiveUrl && isActiveUrl(APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.QUESTIONS), currentPathname)}
        >
          Questions
        </SideNavItem>

        <SideNavItem
          href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.WISHLIST)}
          isActive={isActiveUrl && isActiveUrl(APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.WISHLIST), currentPathname)}
        >
          Wishlist
        </SideNavItem>

        <SideNavItem
          href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.NEW_CMS)}
          isActive={isActiveUrl && isActiveUrl(APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.NEW_CMS), currentPathname)}
        >
          New CMS
        </SideNavItem>

        <SideNavItem
          href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.CUSTOM_VIEW)}
          isActive={isActiveUrl && isActiveUrl(APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteId, APP_ROUTES.CONTENT_TYPES.CUSTOM_VIEW), currentPathname)}
        >
          Custom View
        </SideNavItem>
      </div>
    </div>
  );
}; 