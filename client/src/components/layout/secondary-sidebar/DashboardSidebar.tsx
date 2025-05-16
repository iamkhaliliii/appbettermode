import React from "react";
import { BarChart, TrendingUp, Users, DollarSign, ShoppingBag, ClipboardList } from "lucide-react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES } from "@/config/routes";
import { type DashboardSidebarProps, type NavItem } from "./types";

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  currentPathname,
  isActiveUrl,
  currentSiteIdentifier,
  siteName,
  navItems = []
}) => {
  const basePath = `/dashboard/site/${currentSiteIdentifier}`;

  const checkActive = isActiveUrl || ((url: string, path: string) => path === url);

  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-base font-medium text-gray-900 dark:text-white">
          {siteName || "Dashboard"}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Overview for {currentSiteIdentifier}
        </p>
      </div>

      {navItems && navItems.length > 0 ? (
        <div className="space-y-1">
          {navItems.map((item: NavItem) => {
            const IconComponent = item.icon as React.ElementType;
            return (
              <SideNavItem
                key={item.name}
                href={item.href}
                icon={IconComponent && <IconComponent className="h-4 w-4" />}
                isActive={checkActive(item.href, currentPathname)}
              >
                {item.name}
              </SideNavItem>
            );
          })}
        </div>
      ) : (
        <div className="space-y-1">
          <SideNavItem
            href={basePath}
            icon={<BarChart className="h-4 w-4" />}
            isActive={checkActive(basePath, currentPathname)}
          >
            Overview
          </SideNavItem>

          <SideNavItem
            href={APP_ROUTES.DASHBOARD_SITE.CONTENT(currentSiteIdentifier)}
            icon={<ClipboardList className="h-4 w-4" />}
            isActive={checkActive(APP_ROUTES.DASHBOARD_SITE.CONTENT(currentSiteIdentifier), currentPathname)}
          >
            Content
          </SideNavItem>
          <SideNavItem
            href={APP_ROUTES.DASHBOARD_SITE.PEOPLE(currentSiteIdentifier)}
            icon={<Users className="h-4 w-4" />}
            isActive={checkActive(APP_ROUTES.DASHBOARD_SITE.PEOPLE(currentSiteIdentifier), currentPathname)}
          >
            People
          </SideNavItem>
        </div>
      )}
    </div>
  );
};
