import React from "react";
import { useLocation } from "wouter";
import { isActiveUrl as isActiveUrlUtil } from "./utils";

// Import all the new sidebar components
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

// MiniToggle might be used by some sidebars if they have toggles directly, 
// but it seems it was only used by NavigationItem which is now separate.
// If not used by any of the new sidebar components directly, this import can be removed.
// import { MiniToggle } from "./MiniToggle"; 

// Separator, Accordion etc. are imported within the components that use them.
// Icons are also imported directly within the components that use them.

export function SecondarySidebar() {
  const [locationObject] = useLocation();
  const currentPathname = locationObject; // wouter's useLocation()[0] is the path string

  const getSidebarForLocation = () => {
    // Ensure isActiveUrlUtil is correctly passed and used
    if (currentPathname.startsWith("/content")) {
      return <ContentSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname.startsWith("/people")) {
      return <PeopleSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname === "/design-studio/spaces/feed") {
      return <DesignStudioSpacesFeedSidebar />;
    } else if (currentPathname.startsWith("/site")) {
      return <SiteSidebar currentPathname={currentPathname} />;
    } else if (currentPathname.startsWith("/design-studio")) {
      return <DesignStudioSidebar currentPathname={currentPathname} />;
    } else if (currentPathname.startsWith("/appearance")) {
      return <AppearanceSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname.startsWith("/settings")) {
      return <SettingsSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname.startsWith("/billing")) {
      return <BillingSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname.startsWith("/reports")) {
      return <ReportsSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname.startsWith("/app-store")) {
      return <AppStoreSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    }
    // Default to Dashboard sidebar if no match, or Content as per original logic for root/dashboard
    // The original default was renderContentSidebar(). Let's check if /dashboard should render DashboardSidebar
    if (currentPathname.startsWith("/dashboard")) {
        return <DashboardSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    }
    // Fallback to ContentSidebar as per original default
    return <ContentSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
  };

  return (
    <aside className="secondary-sidebar bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-3rem)] overflow-y-auto sticky top-12 w-64">
      {getSidebarForLocation()}
    </aside>
  );
} 