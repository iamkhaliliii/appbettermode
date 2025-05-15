import React from "react";
import { useLocation } from "wouter";
import { isActiveUrl as isActiveUrlUtil } from "./utils";
import { type NavItem } from "./types";
import { APP_ROUTES, isSitePublicRoute, isSiteAdminRoute, getSiteIdFromRoute } from "@/config/routes"; // Updated imports

// Import all the specific sidebar components
import { DashboardSidebar } from "./DashboardSidebar";
import { ContentSidebar } from "./ContentSidebar";
import { PeopleSidebar } from "./PeopleSidebar";
import { SettingsSidebar } from "./SettingsSidebar";
import { DesignStudioSidebar } from "./DesignStudioSidebar";
import { SiteSidebar } from "./SiteSidebar";
import { SiteConfigSidebar } from "./SiteConfigSidebar";
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

  // Get the site ID from the current path if it's a site-specific route
  const siteIdFromRoute = getSiteIdFromRoute(currentPathname);
  
  // Use explicitly provided siteId or extract from route
  const effectiveSiteId = currentSiteId || siteIdFromRoute || '';
  
  // Determine if we're in a site-specific context
  const isInSiteContext = Boolean(effectiveSiteId);
  const isPublicSite = isSitePublicRoute(currentPathname);
  const isAdminSite = isSiteAdminRoute(currentPathname);

  const getSidebarForLocation = () => {
    // Handle public site-specific pages
    if (isPublicSite) {
      return (
        <SiteSidebar
          currentPathname={currentPathname}
          isActiveUrl={isActiveUrlUtil}
          siteId={effectiveSiteId}
        />
      );
    }

    // Handle dashboard routes (both general dashboard and site-specific admin)
    if (currentPathname.startsWith('/dashboard/')) {
      // Site-specific admin dashboard sections
      if (isAdminSite && effectiveSiteId) {
        if (currentPathname.includes(`/site/${effectiveSiteId}/content`)) {
          return <ContentSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} siteId={effectiveSiteId} />;
        } else if (currentPathname.includes(`/site/${effectiveSiteId}/people`)) {
          return <PeopleSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} siteId={effectiveSiteId} />;
        } else if (currentPathname.includes(`/site/${effectiveSiteId}/appearance`)) {
          return <AppearanceSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} siteId={effectiveSiteId} />;
        } else if (currentPathname.includes(`/site/${effectiveSiteId}/settings`)) {
          return <SettingsSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} siteId={effectiveSiteId} />;
        } else if (currentPathname.includes(`/site/${effectiveSiteId}/billing`)) {
          return <BillingSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} siteId={effectiveSiteId} />;
        } else if (currentPathname.includes(`/site/${effectiveSiteId}/reports`)) {
          return <ReportsSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} siteId={effectiveSiteId} />;
        } else if (currentPathname.includes(`/site/${effectiveSiteId}/site-config`)) {
          return <SiteConfigSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} siteId={effectiveSiteId} />;
        } else if (currentPathname.includes(`/site/${effectiveSiteId}/app-store`)) {
          return <AppStoreSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} siteId={effectiveSiteId} />;
        } else if (currentPathname.includes(`/site/${effectiveSiteId}/design-studio`)) {
          if (currentPathname.includes('/spaces/feed')) {
            return <DesignStudioSpacesFeedSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} siteId={effectiveSiteId} />;
          }
          return <DesignStudioSidebar currentPathname={currentPathname} siteId={effectiveSiteId} />;
        }
        
        // Default site admin sidebar
        return <SiteSidebar
          currentPathname={currentPathname}
          isActiveUrl={isActiveUrlUtil}
          siteId={effectiveSiteId}
        />;
      }
      
      // General dashboard routes (not site-specific)
      if (currentPathname.startsWith('/dashboard/content')) {
        return <ContentSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
      } else if (currentPathname.startsWith('/dashboard/people')) {
        return <PeopleSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
      } else if (currentPathname === '/dashboard/design-studio/spaces/feed') {
        return <DesignStudioSpacesFeedSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
      } else if (currentPathname.startsWith('/dashboard/design-studio')) {
        return <DesignStudioSidebar currentPathname={currentPathname} />;
      } else if (currentPathname.startsWith('/dashboard/appearance')) {
        return <AppearanceSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
      } else if (currentPathname.startsWith(APP_ROUTES.SETTINGS)) {
        return <SettingsSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
      } else if (currentPathname.startsWith('/dashboard/billing')) {
        return <BillingSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
      } else if (currentPathname.startsWith('/dashboard/reports')) {
        return <ReportsSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
      } else if (currentPathname.startsWith('/dashboard/app-store')) {
        return <AppStoreSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
      } else if (currentPathname.startsWith('/dashboard/site-config')) {
        return <SiteConfigSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
      }

    }
    
    // Old routes (for backward compatibility)
    if (currentPathname.startsWith('/content')) {
      return <ContentSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname.startsWith('/people')) {
      return <PeopleSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname === '/design-studio/spaces/feed') {
      return <DesignStudioSpacesFeedSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname.startsWith('/design-studio')) {
      return <DesignStudioSidebar currentPathname={currentPathname} />;
    } else if (currentPathname.startsWith('/appearance')) {
      return <AppearanceSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname.startsWith('/settings')) {
      return <SettingsSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname.startsWith('/billing')) {
      return <BillingSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname.startsWith('/reports')) {
      return <ReportsSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname.startsWith('/app-store')) {
      return <AppStoreSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    } else if (currentPathname.startsWith('/site-config')) {
      return <SiteConfigSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    }
    
    if (currentPathname === APP_ROUTES.SITES_LIST) { 
        return <DashboardSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
    }
    
    // Fallback: Default to DashboardSidebar if no other match
    return <DashboardSidebar currentPathname={currentPathname} isActiveUrl={isActiveUrlUtil} />;
  };

  return (
    <aside className="secondary-sidebar bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-3rem)] overflow-y-auto sticky top-12 w-64 print:hidden">
      {getSidebarForLocation()}
    </aside>
  );
}