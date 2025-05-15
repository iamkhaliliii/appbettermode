import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export interface SideNavItemProps {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
  badge?: string;
  className?: string;
}

export interface SideNavItemWithBadgeProps {
  href: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
  badgeText: string;
  primary?: boolean;
  className?: string;
}

export interface MinimalItemProps {
  name: string;
  path: string;
  icon: React.ReactNode;
  currentPathname: string;
  iconColor?: string;
  level?: number;
  isHidden?: boolean;
  isFile?: boolean;
  inSpaces?: boolean;
  decorationIcon?: React.ReactNode;
  showToggle?: boolean;
  toggleOn?: boolean;
  isPrimary?: boolean;
  isHomepage?: boolean;
}

export interface TreeFolderProps {
  name: string;
  path: string;
  currentPathname: string;
  level?: number;
  isExpanded?: boolean;
  children?: React.ReactNode;
}

export interface NavItem {
  name: string;
  href: string;
  icon?: LucideIcon | React.FC;
  active?: boolean;
  children?: NavItem[];
  disabled?: boolean;
  expanded?: boolean;
}

// Common props for all sidebar components
export interface BaseSidebarProps {
  currentPathname: string;
  isActiveUrl: (url: string | undefined, currentPathname: string | undefined) => boolean;
  siteId?: string; // Added for site-specific sidebars
}

// Specific props for each sidebar type
export interface ContentSidebarProps extends BaseSidebarProps {}
export interface PeopleSidebarProps extends BaseSidebarProps {}
export interface AppearanceSidebarProps extends BaseSidebarProps {}
export interface SettingsSidebarProps extends BaseSidebarProps {}
export interface BillingSidebarProps extends BaseSidebarProps {}
export interface ReportsSidebarProps extends BaseSidebarProps {}
export interface AppStoreSidebarProps extends BaseSidebarProps {}
export interface DashboardSidebarProps extends BaseSidebarProps {}

export interface DesignStudioSidebarProps {
  currentPathname: string;
  siteId?: string; // Added for site-specific context
}

export interface DesignStudioSpacesFeedSidebarProps {
  siteId?: string; // Added for site-specific context
}

export interface SiteSidebarProps {
  currentPathname: string;
  siteName?: string;
  navItems?: NavItem[];
  currentSiteId?: string;
}