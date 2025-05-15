import React from "react";
import { useLocation } from "wouter";
import { isActiveUrl as isActiveUrlUtil } from "./utils";
import { type NavItem } from "./types";
import { APP_ROUTES, getSiteRoute } from "@/config/routes"; // Import routes

// Import all the specific sidebar components
import { DashboardSidebar } from "./DashboardSidebar";
import { ContentSidebar } from "./ContentSidebar";
import { PeopleSidebar } from "./PeopleSidebar";
import { SettingsSidebar } from "./SettingsSidebar";
import { DesignStudioSidebar } from "./DesignStudioSidebar";
import { SiteSidebar } from "./SiteSidebar";
import { AppearanceSidebar } from "./AppearanceSidebar";
import { BillingSidebar } from "./BillingSidebar";
import { ReportsSidebar } from "./ReportsSidebar";
import { DesignStudioSpacesFeedSidebar } from "./DesignStudioSpacesFeedSidebar";
import { AppStoreSidebar } from "./AppStoreSidebar";

// Define Props for SecondarySidebar itself
interface SecondarySidebarProps {
  siteName?: string;
  navItems?: NavItem[];
  currentSiteId?: string; 
}

export function SecondarySidebar({
  siteName,
  navItems,
  currentSiteId, 
}: SecondarySidebarProps) {
  const [locationObject] = useLocation();
  const currentPathname = locationObject;

  const getSidebarForLocation = () => {
    if (currentSiteId && currentPathname.startsWith(APP_ROUTES.SITE_BASE_PATH(currentSiteId))) {
      return (
        <SiteSidebar
          currentPathname={currentPathname}
          siteName={siteName}
          navItems={navItems}
          currentSiteId={currentSiteId}
        />
      );
    } else if (currentPathname.startsWith(APP_ROUTES.CONTENT)) {
      return <ContentSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname.startsWith(APP_ROUTES.PEOPLE)) {
      return <PeopleSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname === APP_ROUTES.DESIGN_STUDIO_SPACES_FEED) {
      return <DesignStudioSpacesFeedSidebar />;
    } else if (currentPathname.startsWith(APP_ROUTES.DESIGN_STUDIO)) {
      return <DesignStudioSidebar currentPathname={currentPathname} />;
    } else if (currentPathname.startsWith(APP_ROUTES.APPEARANCE)) {
      return <AppearanceSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname.startsWith(APP_ROUTES.SETTINGS)) {
      return <SettingsSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname.startsWith(APP_ROUTES.BILLING)) {
      return <BillingSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname.startsWith(APP_ROUTES.REPORTS)) {
      return <ReportsSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname.startsWith(APP_ROUTES.APP_STORE)) {
      return <AppStoreSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    }
    
    if (currentPathname === APP_ROUTES.SITES_LIST) { 
        return <DashboardSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    }
    
    // Fallback: Default to ContentSidebar if no other match
    // Consider if APP_ROUTES.CONTENT is the best fallback or if another route/sidebar is more appropriate.
    return <ContentSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
  };

  return (
    <aside className="secondary-sidebar bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-3rem)] overflow-y-auto sticky top-12 w-64 print:hidden">
      {getSidebarForLocation()}
    </aside>
  );
}