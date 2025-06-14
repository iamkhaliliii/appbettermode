import React from "react";
import { useLocation } from "wouter";
import { type NavItem } from "./types";
import { APP_ROUTES, isSitePublicRoute, isSiteAdminRoute, getSiteIdentifierFromRoute } from "@/config/routes";

// Import all the specific sidebar components
import { DashboardSidebar } from "./DashboardSidebar";
import { ContentSidebar } from "./ContentSidebar";
import { PeopleSidebar } from "./PeopleSidebar";
import { AppearanceSidebar } from "./AppearanceSidebar";
import { SettingsSidebar } from "./SettingsSidebar";
import { BillingSidebar } from "./BillingSidebar";
import { ReportsSidebar } from "./ReportsSidebar";
import { AppStoreSidebar } from "./AppStoreSidebar";
import { DesignStudioSidebar } from "./DesignStudioSidebar";
import { SiteConfigSidebar } from "./SiteConfigSidebar";
import { ModerationSidebar } from "./ModerationSidebar";

import { GlobalAdminSidebar } from "./global-admin-sidebar";
import { SitePublicSidebar } from "./site-public-sidebar";

interface SecondarySidebarProps {
  currentSiteIdentifier?: string; // This is the canonical ID (e.g., UUID) passed from DashboardLayout
  siteName?: string;
  navItems?: NavItem[];
  onNewContent?: () => void; // Callback for when the New button is clicked
}

export function SecondarySidebar({
  currentSiteIdentifier, // This is the canonical ID (e.g., UUID) passed from DashboardLayout
  siteName,
  navItems = [],
  onNewContent,
}: SecondarySidebarProps) {
  const [currentPathname] = useLocation();

  const siteIdentifierFromUrl = getSiteIdentifierFromRoute(currentPathname) || ''; // Identifier from the URL segment
  const isPublicSite = isSitePublicRoute(currentPathname);
  const isAdminSite = isSiteAdminRoute(currentPathname);

  // For internal logic and passing to children that build URLs, use the identifier from the URL.
  // The canonical ID (currentSiteIdentifier) can be passed if needed for data, etc.

  const getSidebarForLocation = () => {
    // Check for moderator dashboard routes first
    if (currentPathname.startsWith('/dashboard/moderator/') && siteIdentifierFromUrl) {
      if (currentPathname.startsWith(APP_ROUTES.DASHBOARD_MODERATOR.CONTENT(siteIdentifierFromUrl))) {
        return <ContentSidebar currentSiteIdentifier={siteIdentifierFromUrl} currentPathname={currentPathname} onNewContent={onNewContent} />;
      }
      if (currentPathname.startsWith(APP_ROUTES.DASHBOARD_MODERATOR.PEOPLE(siteIdentifierFromUrl))) {
        return <PeopleSidebar currentSiteIdentifier={siteIdentifierFromUrl} currentPathname={currentPathname} />;
      }
      if (currentPathname.startsWith(APP_ROUTES.DASHBOARD_MODERATOR.MODERATION(siteIdentifierFromUrl))) {
        return <ModerationSidebar currentSiteIdentifier={siteIdentifierFromUrl} currentPathname={currentPathname} />;
      }
      if (currentPathname === APP_ROUTES.DASHBOARD_MODERATOR.INDEX(siteIdentifierFromUrl)) {
        return <DashboardSidebar currentSiteIdentifier={siteIdentifierFromUrl} canonicalSiteId={currentSiteIdentifier} currentPathname={currentPathname} siteName={siteName} navItems={navItems} />;
      }
    }

    if (isAdminSite && siteIdentifierFromUrl) {
      if (currentPathname.startsWith(APP_ROUTES.DASHBOARD_SITE.CONTENT(siteIdentifierFromUrl))) {
        return <ContentSidebar currentSiteIdentifier={siteIdentifierFromUrl} currentPathname={currentPathname} onNewContent={onNewContent} />;
      }
      if (currentPathname.startsWith(APP_ROUTES.DASHBOARD_SITE.PEOPLE(siteIdentifierFromUrl))) {
        return <PeopleSidebar currentSiteIdentifier={siteIdentifierFromUrl} currentPathname={currentPathname} />;
      }
      if (currentPathname.startsWith(APP_ROUTES.DASHBOARD_SITE.APPEARANCE(siteIdentifierFromUrl))) {
        return <AppearanceSidebar currentSiteIdentifier={siteIdentifierFromUrl} currentPathname={currentPathname} />;
      }
      if (currentPathname.startsWith(APP_ROUTES.DASHBOARD_SITE.SETTINGS(siteIdentifierFromUrl))) {
        return <SettingsSidebar currentSiteIdentifier={siteIdentifierFromUrl} currentPathname={currentPathname} />;
      }
      if (currentPathname.startsWith(APP_ROUTES.DASHBOARD_SITE.BILLING(siteIdentifierFromUrl))) {
        return <BillingSidebar currentSiteIdentifier={siteIdentifierFromUrl} currentPathname={currentPathname} />;
      }
      if (currentPathname.startsWith(APP_ROUTES.DASHBOARD_SITE.REPORTS(siteIdentifierFromUrl))) {
        return <ReportsSidebar currentSiteIdentifier={siteIdentifierFromUrl} currentPathname={currentPathname} />;
      }
      if (currentPathname.startsWith(APP_ROUTES.DASHBOARD_SITE.APP_STORE(siteIdentifierFromUrl))) {
        return <AppStoreSidebar currentSiteIdentifier={siteIdentifierFromUrl} currentPathname={currentPathname} />;
      }
      if (currentPathname.startsWith(APP_ROUTES.DASHBOARD_SITE.DESIGN_STUDIO(siteIdentifierFromUrl))) {
        return <DesignStudioSidebar currentSiteIdentifier={siteIdentifierFromUrl} currentPathname={currentPathname} />;
      }
      if (currentPathname.startsWith(APP_ROUTES.DASHBOARD_SITE.SITE_CONFIG(siteIdentifierFromUrl))) {
        return <SiteConfigSidebar currentSiteIdentifier={siteIdentifierFromUrl} currentPathname={currentPathname} onNewContent={onNewContent} />;
      }
      if (currentPathname.startsWith(APP_ROUTES.DASHBOARD_SITE.MODERATION(siteIdentifierFromUrl))) {
        return <ModerationSidebar currentSiteIdentifier={siteIdentifierFromUrl} currentPathname={currentPathname} />;
      }
      if (currentPathname === APP_ROUTES.DASHBOARD_SITE.INDEX(siteIdentifierFromUrl)) {
        // Pass siteIdentifierFromUrl for link building, but DashboardSidebar might also want the canonicalId via currentSiteIdentifier
        return <DashboardSidebar currentSiteIdentifier={siteIdentifierFromUrl} canonicalSiteId={currentSiteIdentifier} currentPathname={currentPathname} siteName={siteName} navItems={navItems} />;
      }
    }

    if (isPublicSite && siteIdentifierFromUrl) {
      return <SitePublicSidebar currentSiteIdentifier={siteIdentifierFromUrl} currentPath={currentPathname} />;
    }
    
    if (currentPathname.startsWith(APP_ROUTES.SITES_LIST) || currentPathname === APP_ROUTES.HOME) {
      return <GlobalAdminSidebar currentPath={currentPathname} />;
    }
    
    return null;
  };

  return (
    <aside className="secondary-sidebar bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-3rem)] overflow-y-auto sticky top-12 w-64 print:hidden">
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
        <div className="space-y-2 font-medium">
          {getSidebarForLocation()}
        </div>
      </div>
    </aside>
  );
} 