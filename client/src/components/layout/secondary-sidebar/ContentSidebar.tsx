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

interface ContentSidebarProps {
  currentPathname: string;
  isActiveUrl: (url: string, currentPathname: string) => boolean;
}

export const ContentSidebar: React.FC<ContentSidebarProps> = ({ currentPathname, isActiveUrl }) => {
  // For the Inbox page within Content section
  if (isActiveUrl(APP_ROUTES.CONTENT_INBOX_ROOT, currentPathname) || currentPathname.startsWith(APP_ROUTES.CONTENT_INBOX_ROOT + '/')) {
    return (
      <div className="p-3">
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
                Inbox
              </h2>
            </div>
            <div className="relative group">
              <div className="p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center cursor-pointer">
                <Plus className="h-3.5 w-3.5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <SideNavItem
            href={APP_ROUTES.CONTENT_INBOX_UNREAD_SUB}
            isActive={isActiveUrl(APP_ROUTES.CONTENT_INBOX_UNREAD_SUB, currentPathname) || currentPathname === APP_ROUTES.CONTENT_INBOX_ROOT}
          >
            Unread
          </SideNavItem>

          <SideNavItem
            href={APP_ROUTES.CONTENT_INBOX_IMPORTANT}
            isActive={isActiveUrl(APP_ROUTES.CONTENT_INBOX_IMPORTANT, currentPathname)}
          >
            Important
          </SideNavItem>

          <SideNavItem
            href={APP_ROUTES.CONTENT_INBOX_ARCHIVED}
            isActive={isActiveUrl(APP_ROUTES.CONTENT_INBOX_ARCHIVED, currentPathname)}
          >
            Archived
          </SideNavItem>
        </div>
      </div>
    );
  }

  // For the general Inbox page (top level /inbox) - this logic seems to be for APP_ROUTES.INBOX, not content specific
  if (isActiveUrl(APP_ROUTES.INBOX, currentPathname) || currentPathname.startsWith(APP_ROUTES.INBOX + '/')) {
    return (
      <div className="p-3">
        <div className="space-y-4">
          <div className="space-y-3">
            {/* Primary Actions */}
            <div className="space-y-0.5">
              <SideNavItemWithBadge
                href={APP_ROUTES.INBOX_ALL_ACTIVITY}
                isActive={isActiveUrl(APP_ROUTES.INBOX_ALL_ACTIVITY, currentPathname) || currentPathname === APP_ROUTES.INBOX}
                icon={<Inbox className="h-3.5 w-3.5" />}
                badgeText="12"
                primary={true}
              >
                All Activity
              </SideNavItemWithBadge>
              <SideNavItemWithBadge
                href={APP_ROUTES.INBOX_UNREAD}
                isActive={isActiveUrl(APP_ROUTES.INBOX_UNREAD, currentPathname)}
                icon={<MessageCircle className="h-3.5 w-3.5" />}
                badgeText="5"
                primary={true}
              >
                Unread
              </SideNavItemWithBadge>
            </div>

            {/* Interactions - More Compact */}
            <div className="space-y-0.5 border-t border-gray-100 dark:border-gray-700 pt-2">
              <SideNavItemWithBadge
                href={APP_ROUTES.INBOX_COMMENTS}
                isActive={isActiveUrl(APP_ROUTES.INBOX_COMMENTS, currentPathname)}
                icon={<MessageSquare className="h-3.5 w-3.5" />}
                badgeText="24"
              >
                Comments
              </SideNavItemWithBadge>
              <SideNavItemWithBadge
                href={APP_ROUTES.INBOX_REACTIONS}
                isActive={isActiveUrl(APP_ROUTES.INBOX_REACTIONS, currentPathname)}
                icon={<ThumbsUp className="h-3.5 w-3.5" />}
                badgeText="8"
              >
                Reactions
              </SideNavItemWithBadge>
              <SideNavItemWithBadge
                href={APP_ROUTES.INBOX_MENTIONS}
                isActive={isActiveUrl(APP_ROUTES.INBOX_MENTIONS, currentPathname)}
                icon={<AtSign className="h-3.5 w-3.5" />}
                badgeText="3"
              >
                Mentions
              </SideNavItemWithBadge>
              <SideNavItemWithBadge
                href={APP_ROUTES.INBOX_REPORTS} // General inbox reports
                isActive={isActiveUrl(APP_ROUTES.INBOX_REPORTS, currentPathname)}
                icon={<Flag className="h-3.5 w-3.5" />}
                badgeText="5"
              >
                Reports
              </SideNavItemWithBadge>
              <SideNavItem
                href={APP_ROUTES.INBOX_RSVPS}
                isActive={isActiveUrl(APP_ROUTES.INBOX_RSVPS, currentPathname)}
                icon={<CalendarCheck className="h-3.5 w-3.5" />}
              >
                RSVPs
              </SideNavItem>
              <SideNavItem
                href={APP_ROUTES.INBOX_FORMS}
                isActive={isActiveUrl(APP_ROUTES.INBOX_FORMS, currentPathname)}
                icon={<ClipboardList className="h-3.5 w-3.5" />}
              >
                Forms
              </SideNavItem>
            </div>
          </div>

          {/* Content Types Group with Accordion (within general /inbox) */}
          <div>
            <Accordion
              type="single"
              collapsible
              defaultValue={currentPathname.includes('/inbox/cms/') ? "cms" : undefined}
            >
              <AccordionItem value="cms" className="border-0">
                <AccordionTrigger className="flex items-center py-1 px-0 hover:no-underline">
                  <h3 className="text-[11px] uppercase tracking-wide font-medium text-gray-500 dark:text-gray-400">
                    Content Types
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-0">
                  <div className="space-y-1 pl-2">
                    <SideNavItem
                      href={APP_ROUTES.INBOX_CMS_ARTICLES}
                      isActive={isActiveUrl(APP_ROUTES.INBOX_CMS_ARTICLES, currentPathname)}
                      icon={<FileText className="h-3.5 w-3.5" />}
                    >
                      Articles
                    </SideNavItem>

                    <SideNavItem
                      href={APP_ROUTES.INBOX_CMS_EVENTS}
                      isActive={isActiveUrl(APP_ROUTES.INBOX_CMS_EVENTS, currentPathname)}
                      icon={<Calendar className="h-3.5 w-3.5" />}
                    >
                      Events
                    </SideNavItem>

                    <SideNavItem
                      href={APP_ROUTES.INBOX_CMS_QUESTIONS}
                      isActive={isActiveUrl(APP_ROUTES.INBOX_CMS_QUESTIONS, currentPathname)}
                      icon={<HelpCircle className="h-3.5 w-3.5" />}
                    >
                      Questions
                    </SideNavItem>

                    <SideNavItem
                      href={APP_ROUTES.INBOX_CMS_WISHLIST}
                      isActive={isActiveUrl(APP_ROUTES.INBOX_CMS_WISHLIST, currentPathname)}
                      icon={<Star className="h-3.5 w-3.5" />}
                    >
                      Wishlist
                    </SideNavItem>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    );
  }

  // Default content sidebar - showing CMS Collections directly under /content
  return (
    <div className="p-3">
      <div className="space-y-4">
        <div className="space-y-3">
          {/* Primary Actions */}
          <div className="space-y-0.5">
            <SideNavItemWithBadge
              href={APP_ROUTES.CONTENT_ALL}
              isActive={isActiveUrl(APP_ROUTES.CONTENT_ALL, currentPathname) || currentPathname === APP_ROUTES.CONTENT}
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
              href={APP_ROUTES.CONTENT_EVENTS}
              isActive={isActiveUrl(APP_ROUTES.CONTENT_EVENTS, currentPathname)}
              icon={<Calendar className="h-3.5 w-3.5" />}
            >
              Events
            </SideNavItem>

            <SideNavItem
              href={APP_ROUTES.CONTENT_DISCUSSIONS}
              isActive={isActiveUrl(APP_ROUTES.CONTENT_DISCUSSIONS, currentPathname)}
              icon={<MessageSquare className="h-3.5 w-3.5" />}
            >
              Discussion
            </SideNavItem>

            <SideNavItem
              href={APP_ROUTES.CONTENT_ARTICLES}
              isActive={isActiveUrl(APP_ROUTES.CONTENT_ARTICLES, currentPathname)}
              icon={<FileText className="h-3.5 w-3.5" />}
            >
              Articles
            </SideNavItem>

            <SideNavItem
              href={APP_ROUTES.CONTENT_QUESTIONS}
              isActive={isActiveUrl(APP_ROUTES.CONTENT_QUESTIONS, currentPathname)}
              icon={<HelpCircle className="h-3.5 w-3.5" />}
            >
              Questions
            </SideNavItem>

            <SideNavItem
              href={APP_ROUTES.CONTENT_WISHLIST}
              isActive={isActiveUrl(APP_ROUTES.CONTENT_WISHLIST, currentPathname)}
              icon={<Star className="h-3.5 w-3.5" />}
            >
              Wishlist
            </SideNavItem>

            <Link href={APP_ROUTES.CONTENT_NEW_CMS}>
              <div className="flex items-center py-1.5 text-sm cursor-pointer my-0.5 transition-colors duration-150 px-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 rounded">
                <Plus className="h-3.5 w-3.5 mr-2" />
                <span className="font-normal">Add new CMS</span>
              </div>
            </Link>
          </div>

          {/* Divider and Custom View */}
          <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
            <Link href={APP_ROUTES.CONTENT_CUSTOM_VIEW}>
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