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

interface ContentSidebarProps {
  currentPathname: string;
  isActiveUrl: (url: string, currentPathname: string) => boolean;
}

export const ContentSidebar: React.FC<ContentSidebarProps> = ({ currentPathname, isActiveUrl }) => {
  // For the Inbox page
  if (isActiveUrl("/content/inbox", currentPathname) || currentPathname.startsWith("/content/inbox/")) {
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
            href="/content/inbox/unread"
            isActive={isActiveUrl("/content/inbox/unread", currentPathname) || currentPathname === "/content/inbox"}
          >
            Unread
          </SideNavItem>

          <SideNavItem
            href="/content/inbox/important"
            isActive={isActiveUrl("/content/inbox/important", currentPathname)}
          >
            Important
          </SideNavItem>

          <SideNavItem
            href="/content/inbox/archived"
            isActive={isActiveUrl("/content/inbox/archived", currentPathname)}
          >
            Archived
          </SideNavItem>
        </div>
      </div>
    );
  }

  // For the general Inbox page (top level /inbox)
  if (isActiveUrl("/inbox", currentPathname) || currentPathname.startsWith("/inbox/")) {
    return (
      <div className="p-3">
        <div className="space-y-4">
          <div className="space-y-3">
            {/* Primary Actions */}
            <div className="space-y-0.5">
              <SideNavItemWithBadge
                href="/inbox/all-activity"
                isActive={isActiveUrl("/inbox/all-activity", currentPathname) || currentPathname === "/inbox"}
                icon={<Inbox className="h-3.5 w-3.5" />}
                badgeText="12"
                primary={true}
              >
                All Activity
              </SideNavItemWithBadge>
              <SideNavItemWithBadge
                href="/inbox/unread"
                isActive={isActiveUrl("/inbox/unread", currentPathname)}
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
                href="/inbox/comments"
                isActive={isActiveUrl("/inbox/comments", currentPathname)}
                icon={<MessageSquare className="h-3.5 w-3.5" />}
                badgeText="24"
              >
                Comments
              </SideNavItemWithBadge>
              <SideNavItemWithBadge
                href="/inbox/reactions"
                isActive={isActiveUrl("/inbox/reactions", currentPathname)}
                icon={<ThumbsUp className="h-3.5 w-3.5" />}
                badgeText="8"
              >
                Reactions
              </SideNavItemWithBadge>
              <SideNavItemWithBadge
                href="/inbox/mentions"
                isActive={isActiveUrl("/inbox/mentions", currentPathname)}
                icon={<AtSign className="h-3.5 w-3.5" />}
                badgeText="3"
              >
                Mentions
              </SideNavItemWithBadge>
              <SideNavItemWithBadge
                href="/inbox/reports"
                isActive={isActiveUrl("/inbox/reports", currentPathname)}
                icon={<Flag className="h-3.5 w-3.5" />}
                badgeText="5"
              >
                Reports
              </SideNavItemWithBadge>
              <SideNavItem
                href="/inbox/rsvps"
                isActive={isActiveUrl("/inbox/rsvps", currentPathname)}
                icon={<CalendarCheck className="h-3.5 w-3.5" />}
              >
                RSVPs
              </SideNavItem>
              <SideNavItem
                href="/inbox/forms"
                isActive={isActiveUrl("/inbox/forms", currentPathname)}
                icon={<ClipboardList className="h-3.5 w-3.5" />}
              >
                Forms
              </SideNavItem>
            </div>
          </div>

          {/* Content Types Group with Accordion */}
          <div>
            <Accordion
              type="single"
              collapsible
              defaultValue={currentPathname.includes("/inbox/cms/") ? "cms" : undefined}
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
                      href="/inbox/cms/articles"
                      isActive={isActiveUrl("/inbox/cms/articles", currentPathname)}
                      icon={<FileText className="h-3.5 w-3.5" />}
                    >
                      Articles
                    </SideNavItem>

                    <SideNavItem
                      href="/inbox/cms/events"
                      isActive={isActiveUrl("/inbox/cms/events", currentPathname)}
                      icon={<Calendar className="h-3.5 w-3.5" />}
                    >
                      Events
                    </SideNavItem>

                    <SideNavItem
                      href="/inbox/cms/questions"
                      isActive={isActiveUrl("/inbox/cms/questions", currentPathname)}
                      icon={<HelpCircle className="h-3.5 w-3.5" />}
                    >
                      Questions
                    </SideNavItem>

                    <SideNavItem
                      href="/inbox/cms/wishlist"
                      isActive={isActiveUrl("/inbox/cms/wishlist", currentPathname)}
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

  // Default content sidebar - showing CMS Collections directly
  return (
    <div className="p-3">
      <div className="space-y-4">
        <div className="space-y-3">
          {/* Primary Actions */}
          <div className="space-y-0.5">
            <SideNavItemWithBadge
              href="/content/all"
              isActive={isActiveUrl("/content/all", currentPathname) || currentPathname === "/content"}
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
              href="/content/events"
              isActive={isActiveUrl("/content/events", currentPathname)}
              icon={<Calendar className="h-3.5 w-3.5" />}
            >
              Events
            </SideNavItem>

            <SideNavItem
              href="/content/discussions"
              isActive={isActiveUrl("/content/discussions", currentPathname)}
              icon={<MessageSquare className="h-3.5 w-3.5" />}
            >
              Discussion
            </SideNavItem>

            <SideNavItem
              href="/content/articles"
              isActive={isActiveUrl("/content/articles", currentPathname)}
              icon={<FileText className="h-3.5 w-3.5" />}
            >
              Articles
            </SideNavItem>

            <SideNavItem
              href="/content/questions"
              isActive={isActiveUrl("/content/questions", currentPathname)}
              icon={<HelpCircle className="h-3.5 w-3.5" />}
            >
              Questions
            </SideNavItem>

            <SideNavItem
              href="/content/wishlist"
              isActive={isActiveUrl("/content/wishlist", currentPathname)}
              icon={<Star className="h-3.5 w-3.5" />}
            >
              Wishlist
            </SideNavItem>

            <Link href="/content/new-cms">
              <div className="flex items-center py-1.5 text-sm cursor-pointer my-0.5 transition-colors duration-150 px-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 rounded">
                <Plus className="h-3.5 w-3.5 mr-2" />
                <span className="font-normal">Add new CMS</span>
              </div>
            </Link>
          </div>

          {/* Divider and Custom View */}
          <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
            <Link href="/content/custom-view">
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