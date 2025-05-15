import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Content from "@/pages/content";
import Settings from "@/pages/settings";
import People from "@/pages/people";
import Inbox from "@/pages/inbox";
import DesignStudio from "@/pages/design-studio";
import SiteConfigPage from "@/pages/SiteConfigPage";
import DesignStudioSpacesFeed from "@/pages/design-studio-spaces-feed";
import Appearance from "@/pages/appearance";
import Billing from "@/pages/billing";
import Reports from "@/pages/reports";
import AppStore from "@/pages/app-store";
import SearchResults from "@/pages/search-results";
import SitesDashboardPage from "@/pages/SitesDashboardPage";
import SiteAdminPage from "@/pages/SiteAdminPage";
import { APP_ROUTES } from "@/config/routes";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/sites" />} />
      <Route path="/sites" component={SitesDashboardPage} />
      
      {/* Site Administration Routes - Base routes */}
      <Route path="/site/:siteId/overview" component={SiteAdminPage} />
      <Route path="/site/:siteId" component={SiteAdminPage} />

      {/* Site-specific Section Routes */}
      <Route path="/site/:siteId/content" component={Content} />
      <Route path="/site/:siteId/content/:section" component={Content} />
      <Route path="/site/:siteId/people" component={People} />
      <Route path="/site/:siteId/people/:section" component={People} />
      <Route path="/site/:siteId/appearance" component={Appearance} />
      <Route path="/site/:siteId/appearance/:section" component={Appearance} />
      <Route path="/site/:siteId/settings" component={Settings} />
      <Route path="/site/:siteId/settings/:section" component={Settings} />
      <Route path="/site/:siteId/billing" component={Billing} />
      <Route path="/site/:siteId/billing/:section" component={Billing} />
      <Route path="/site/:siteId/reports" component={Reports} />
      <Route path="/site/:siteId/reports/:section" component={Reports} />
      <Route path="/site/:siteId/app-store" component={AppStore} />
      <Route path="/site/:siteId/app-store/:section" component={AppStore} />
      <Route path="/site/:siteId/design-studio" component={DesignStudio} />
      <Route path="/site/:siteId/design-studio/:section" component={DesignStudio} />
      <Route path="/site/:siteId/design-studio/:section/:subsection" component={DesignStudio} />
      <Route path="/site/:siteId/spaces/feed" component={DesignStudioSpacesFeed} />

      {/* General /site route if needed (without siteId) */}
      <Route path="/site" component={SiteConfigPage} /> 
      
      {/* Global Section Routes */}
      <Route path="/content" component={Content} />
      <Route path="/content/:section" component={Content} />
      <Route path="/inbox" component={Inbox} />
      <Route path="/inbox/:section" component={Inbox} />
      <Route path="/content/comments" component={() => <Redirect to="/content/activity" />} />
      <Route path="/content/tags" component={() => <Redirect to="/content" />} />
      <Route path="/content/inbox" component={() => <Redirect to="/inbox" />} />
      <Route path="/people" component={People} />
      <Route path="/people/:section" component={People} />
      <Route path="/design-studio" component={DesignStudio} />
      <Route path="/design-studio/spaces/feed" component={DesignStudioSpacesFeed} />
      <Route path="/design-studio/:section" component={DesignStudio} />
      <Route path="/design-studio/:section/:subsection" component={DesignStudio} />
      <Route path="/appearance" component={Appearance} />
      <Route path="/appearance/:section" component={Appearance} />
      <Route path="/settings" component={Settings} />
      <Route path="/settings/:section" component={Settings} />
      <Route path="/billing" component={Billing} />
      <Route path="/billing/:section" component={Billing} />
      <Route path="/reports" component={Reports} />
      <Route path="/reports/:section" component={Reports} />
      <Route path="/app-store" component={AppStore} />
      <Route path="/app-store/:section" component={AppStore} />
      <Route path="/search" component={SearchResults} />
      <Route path="/search/:query" component={SearchResults} />
      
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
