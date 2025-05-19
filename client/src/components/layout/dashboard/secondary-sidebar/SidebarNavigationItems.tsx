import React from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { SideNavItemProps, SideNavItemWithBadgeProps } from "./types";

export function SideNavItem({
  href,
  icon,
  children,
  isActive = false,
  badge,
  className,
}: SideNavItemProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center py-1.5 text-sm cursor-pointer my-0.5 transition-colors duration-150 px-2.5",
          isActive
            ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-md"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 rounded",
          className,
        )}
      >
        {icon && (
          <span
            className={cn(
              "flex-shrink-0 mr-2 text-[14px]",
              isActive
                ? "text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-400",
            )}
          >
            {icon}
          </span>
        )}
        <span className="font-medium">{children}</span>
      </div>
    </Link>
  );
}

export function SideNavItemWithBadge({
  href,
  icon,
  children,
  isActive = false,
  badgeText,
  primary = false,
  className,
}: SideNavItemWithBadgeProps) {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex items-center py-1.5 text-sm cursor-pointer my-0.5 transition-colors duration-150 px-2.5",
          isActive
            ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-md"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 rounded",
          className,
        )}
      >
        {icon && (
          <span
            className={cn(
              "flex-shrink-0 mr-2 text-[14px]",
              isActive
                ? "text-gray-900 dark:text-white"
                : "text-gray-600 dark:text-gray-400",
            )}
          >
            {icon}
          </span>
        )}
        <span className="font-medium">{children}</span>
        <span
          className={cn(
            "ml-auto flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-medium",
            primary
              ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
          )}
        >
          {badgeText}
        </span>
      </div>
    </Link>
  );
} 