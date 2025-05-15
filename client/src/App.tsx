import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import { APP_ROUTES } from "@/config/routes";

// Import site list and search pages
import SitesDashboardPage from "@/pages/sites/index";
import SearchResults from "@/pages/site/[siteId]/search/index";

// Import dashboard site-specific pages
import DashboardSiteIndex from "@/pages/dashboard/site/[siteId]/index";
import DashboardSitePeople from "@/pages/dashboard/site/[siteId]/people/index";
import DashboardSitePeopleMembers from "@/pages/dashboard/site/[siteId]/people/members/index";
import DashboardSitePeopleStaff from "@/pages/dashboard/site/[siteId]/people/staff/index";
import DashboardSiteAppearance from "@/pages/dashboard/site/[siteId]/appearance/index";
import DashboardSiteSettings from "@/pages/dashboard/site/[siteId]/settings/index";
import DashboardSiteSettingsSearch from "@/pages/dashboard/site/[siteId]/settings/search/index";
import DashboardSiteBilling from "@/pages/dashboard/site/[siteId]/billing/index";
import DashboardSiteReports from "@/pages/dashboard/site/[siteId]/reports/index";
import DashboardSiteAppStore from "@/pages/dashboard/site/[siteId]/app-store/index";
import DashboardSiteDesignStudio from "@/pages/dashboard/site/[siteId]/design-studio/index";
import DashboardSiteSiteConfig from "@/pages/dashboard/site/[siteId]/site-config/index";
import NotFound from "@/pages/not-found";
import Content from "@/pages/dashboard/site/[siteId]/content";

// Import site frontend pages (public facing)
import SiteFrontendSearch from "@/pages/site/[siteId]/search/index";

function Router() {
  return (
    <Switch>
      {/* Root redirect */}
      <Route path="/" component={() => <Redirect to="/sites" />} />
      
      {/* Sites list */}
      <Route path="/sites" component={SitesDashboardPage} />
      
      {/* Dashboard site-specific routes */}
      <Route path="/dashboard/site/:siteId" component={DashboardSiteIndex} />
      <Route path="/dashboard/site/:siteId/content" component={Content} />
      <Route path="/dashboard/site/:siteId/content/:section" component={Content} />
      <Route path="/dashboard/site/:siteId/people" component={DashboardSitePeople} />
      <Route path="/dashboard/site/:siteId/people/members" component={DashboardSitePeopleMembers} />
      <Route path="/dashboard/site/:siteId/people/staff" component={DashboardSitePeopleStaff} />
      <Route path="/dashboard/site/:siteId/appearance" component={DashboardSiteAppearance} />
      <Route path="/dashboard/site/:siteId/appearance/:section" component={DashboardSiteAppearance} />
      <Route path="/dashboard/site/:siteId/settings" component={DashboardSiteSettings} />
      <Route path="/dashboard/site/:siteId/settings/search" component={DashboardSiteSettingsSearch} />
      <Route path="/dashboard/site/:siteId/billing" component={DashboardSiteBilling} />
      <Route path="/dashboard/site/:siteId/billing/:section" component={DashboardSiteBilling} />
      <Route path="/dashboard/site/:siteId/reports" component={DashboardSiteReports} />
      <Route path="/dashboard/site/:siteId/reports/:section" component={DashboardSiteReports} />
      <Route path="/dashboard/site/:siteId/app-store" component={DashboardSiteAppStore} />
      <Route path="/dashboard/site/:siteId/app-store/:section" component={DashboardSiteAppStore} />
      <Route path="/dashboard/site/:siteId/design-studio" component={DashboardSiteDesignStudio} />
      <Route path="/dashboard/site/:siteId/design-studio/:section" component={DashboardSiteDesignStudio} />
      <Route path="/dashboard/site/:siteId/site-config" component={DashboardSiteSiteConfig} />
      
      {/* Site frontend routes (public facing) */}
      <Route path="/site/:siteId/search" component={SiteFrontendSearch} />
      <Route path="/site/:siteId/search/:query" component={SiteFrontendSearch} />
      
      {/* Catch-all for 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
