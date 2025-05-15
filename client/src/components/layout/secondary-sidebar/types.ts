import React from "react";

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
  level?: number;
  isExpanded?: boolean;
  children?: React.ReactNode;
} 
export interface NavItem { // یا type NavItem
  name: string;
  href: string;
  icon?: React.ElementType; // آیکون به عنوان یک کامپوننت React
  current?: boolean;        // برای مشخص کردن آیتم فعال
  children?: NavItem[];     // برای آیتم‌های زیرمنو (در صورت نیاز)
  // سایر فیلدهای لازم
}