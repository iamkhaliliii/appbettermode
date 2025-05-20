import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import { APP_ROUTES } from "@/config/routes";

// Import site list and search pages
import SitesDashboardPage from "@/pages/sites/index";
import SearchResults from "@/pages/site/[siteSD]/search/index";

// Import dashboard site-specific pages
import DashboardSiteIndex from "@/pages/dashboard/site/[siteSD]/index";
import DashboardSitePeople from "@/pages/dashboard/site/[siteSD]/people/index";
import DashboardSitePeopleMembers from "@/pages/dashboard/site/[siteSD]/people/members/index";
import DashboardSitePeopleStaff from "@/pages/dashboard/site/[siteSD]/people/staff/index";
import DashboardSiteAppearance from "@/pages/dashboard/site/[siteSD]/appearance/index";
import DashboardSiteSettings from "@/pages/dashboard/site/[siteSD]/settings/index";
import DashboardSiteSettingsSearch from "@/pages/dashboard/site/[siteSD]/settings/search/index";
import DashboardSiteBilling from "@/pages/dashboard/site/[siteSD]/billing/index";
import DashboardSiteReports from "@/pages/dashboard/site/[siteSD]/reports/index";
import DashboardSiteAppStore from "@/pages/dashboard/site/[siteSD]/app-store/index";
import DashboardSiteDesignStudio from "@/pages/dashboard/site/[siteSD]/design-studio/index";
import DashboardSiteSiteConfig from "@/pages/dashboard/site/[siteSD]/site-config/index";
import NotFound from "@/pages/404";
import Content from "@/pages/dashboard/site/[siteSD]/content";

// Import site frontend pages (public facing)
import SiteFrontendSearch from "@/pages/site/[siteSD]/search/index";
import SiteHomePage from "@/pages/site/[siteSD]/index";
// Import dynamic space page
import SpacePage from "@/pages/site/[siteSD]/[spaceSlug]/index";

function Router() {
  return (
    <Switch>
      {/* Root redirect */}
      <Route path="/" component={() => <Redirect to="/sites" />} />
      
      {/* Sites list */}
      <Route path="/sites" component={SitesDashboardPage} />
      
      {/* Dashboard site-specific routes */}
      <Route path="/dashboard/site/:siteSD" component={DashboardSiteIndex} />
      <Route path="/dashboard/site/:siteSD/content" component={Content} />
      <Route path="/dashboard/site/:siteSD/content/:section" component={Content} />
      <Route path="/dashboard/site/:siteSD/people" component={DashboardSitePeople} />
      <Route path="/dashboard/site/:siteSD/people/members" component={DashboardSitePeopleMembers} />
      <Route path="/dashboard/site/:siteSD/people/staff" component={DashboardSitePeopleStaff} />
      <Route path="/dashboard/site/:siteSD/appearance" component={DashboardSiteAppearance} />
      <Route path="/dashboard/site/:siteSD/appearance/:section" component={DashboardSiteAppearance} />
      <Route path="/dashboard/site/:siteSD/settings" component={DashboardSiteSettings} />
      <Route path="/dashboard/site/:siteSD/settings/search" component={DashboardSiteSettingsSearch} />
      <Route path="/dashboard/site/:siteSD/billing" component={DashboardSiteBilling} />
      <Route path="/dashboard/site/:siteSD/billing/:section" component={DashboardSiteBilling} />
      <Route path="/dashboard/site/:siteSD/reports" component={DashboardSiteReports} />
      <Route path="/dashboard/site/:siteSD/reports/:section" component={DashboardSiteReports} />
      <Route path="/dashboard/site/:siteSD/app-store" component={DashboardSiteAppStore} />
      <Route path="/dashboard/site/:siteSD/app-store/:section" component={DashboardSiteAppStore} />
      <Route path="/dashboard/site/:siteSD/design-studio" component={DashboardSiteDesignStudio} />
      <Route path="/dashboard/site/:siteSD/design-studio/:section" component={DashboardSiteDesignStudio} />
      <Route path="/dashboard/site/:siteSD/site-config" component={DashboardSiteSiteConfig} />
      
      {/* Site frontend routes (public facing) */}
      <Route path="/site/:siteSD" component={SiteHomePage} />
      <Route path="/site/:siteSD/search" component={SiteFrontendSearch} />
      
      {/* Dynamic space routes - handles discussion, qa, wishlist, about, and any other spaces */}
      <Route path="/site/:siteSD/:spaceSlug" component={SpacePage} />
      
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
