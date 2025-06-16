import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import { SiteDataProvider } from "@/lib/SiteDataContext";
import SiteContentProvider from "./lib/SiteContentContext";

import { APP_ROUTES } from "@/config/routes";

// Import site list and search pages
import SitesDashboardPage from "@/pages/sites/index";
import SearchResults from "@/pages/site/[siteSD]/search/index";

// Import dashboard site-specific pages
import DashboardSiteIndex from "@/pages/dashboard/site/[siteSD]";
import DashboardSitePeople from "@/pages/dashboard/site/[siteSD]/people";
import DashboardSitePeopleMembers from "@/pages/dashboard/site/[siteSD]/people/members";
import DashboardSitePeopleStaff from "@/pages/dashboard/site/[siteSD]/people/staff";
import DashboardSitePeopleInvitations from "@/pages/dashboard/site/[siteSD]/people/invitations";
import DashboardSiteAppearance from "@/pages/dashboard/site/[siteSD]/appearance";
import DashboardSiteSettings from "@/pages/dashboard/site/[siteSD]/settings";
import DashboardSiteSettingsSearch from "@/pages/dashboard/site/[siteSD]/settings/search";
import DashboardSiteBilling from "@/pages/dashboard/site/[siteSD]/billing";
import DashboardSiteReports from "@/pages/dashboard/site/[siteSD]/reports";
import DashboardSiteAppStore from "@/pages/dashboard/site/[siteSD]/app-store";
import DashboardSiteDesignStudio from "@/pages/dashboard/site/[siteSD]/design-studio";
import DashboardSiteSiteConfig from "@/pages/dashboard/site/[siteSD]/site-config";
import DashboardSiteSiteConfigSpace from "@/pages/dashboard/site/[siteSD]/site-config/spaces/[spacesSlug]";
import DashboardSiteModeration from "@/pages/dashboard/site/[siteSD]/moderation";
import ModeratorDashboardPage from "@/pages/dashboard/moderator/[SiteSD]";
import NotFound from "@/pages/404";
import Content from "@/pages/dashboard/site/[siteSD]/content";

// Import site frontend pages (public facing)
import SiteHomePage from "@/pages/site/[siteSD]/index";
import SiteFrontendSearch from "@/pages/site/[siteSD]/search/index";
import SiteModerationRedirect from "@/pages/site/[siteSD]/moderation";
import SiteModerationPage from "@/pages/site/[siteSD]/moderation/index";
import SitePollsPage from "@/pages/site/[siteSD]/polls/index";
import SpacePage from "@/pages/site/[siteSD]/[spaceSlug]/index";

// PageTransition component for smooth page transitions
function PageTransition({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Define your application component
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SiteDataProvider>
        <SiteContentProvider>
          <PageTransition>
            <Switch>
              {/* Redirect from root to sites */}
              <Route path="/">
                <Redirect to="/sites" />
              </Route>
              
              {/* Sites routes */}
              <Route path="/sites" component={SitesDashboardPage} />
              
              {/* Dashboard routes */}
              <Route path="/dashboard/site/:siteSD" component={DashboardSiteIndex} />
              <Route path="/dashboard/site/:siteSD/people" component={DashboardSitePeople} />
              <Route path="/dashboard/site/:siteSD/people/members" component={DashboardSitePeopleMembers} />
              <Route path="/dashboard/site/:siteSD/people/staff" component={DashboardSitePeopleStaff} />
              <Route path="/dashboard/site/:siteSD/people/invitations" component={DashboardSitePeopleInvitations} />
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
              <Route path="/dashboard/site/:siteSD/site-config/spaces/:spacesSlug" component={DashboardSiteSiteConfigSpace} />
              <Route path="/dashboard/site/:siteSD/moderation" component={DashboardSiteModeration} />
              <Route path="/dashboard/site/:siteSD/moderation/:section" component={DashboardSiteModeration} />
              <Route path="/dashboard/site/:siteSD/content" component={Content} />
              
              {/* Moderator Dashboard Routes */}
              <Route path="/dashboard/moderator/:SiteSD" component={ModeratorDashboardPage} />
              <Route path="/dashboard/moderator/:SiteSD/content" component={Content} />
              <Route path="/dashboard/moderator/:SiteSD/content/:section" component={Content} />
              <Route path="/dashboard/moderator/:SiteSD/people" component={DashboardSitePeople} />
              <Route path="/dashboard/moderator/:SiteSD/people/members" component={DashboardSitePeopleMembers} />
              <Route path="/dashboard/moderator/:SiteSD/people/staff" component={DashboardSitePeopleStaff} />
              <Route path="/dashboard/moderator/:SiteSD/people/invitations" component={DashboardSitePeopleInvitations} />
              <Route path="/dashboard/moderator/:SiteSD/moderation" component={DashboardSiteModeration} />
              <Route path="/dashboard/moderator/:SiteSD/moderation/:section" component={DashboardSiteModeration} />
              <Route path="/dashboard/site/:siteSD/content/:section" component={Content} />
              
              {/* Frontend site routes */}
              <Route path="/site/:siteSD" component={SiteHomePage} />
              <Route path="/site/:siteSD/search" component={SiteFrontendSearch} />
              <Route path="/site/:siteSD/polls" component={SitePollsPage} />
              
              {/* Site moderation pages */}
              <Route path="/site/:siteSD/moderation" component={SiteModerationRedirect} />
              <Route path="/site/:siteSD/moderation/:section" component={SiteModerationPage} />
              
              <Route path="/site/:siteSD/:spaceSlug" component={SpacePage} />
              <Route path="/site/:siteSD/:spaceSlug/:postID" component={SpacePage} />
              
              {/* 404 catch-all */}
              <Route component={NotFound} />
            </Switch>
          </PageTransition>
        </SiteContentProvider>
      </SiteDataProvider>
      <Toaster />
      <SonnerToaster position="top-right" />
    </QueryClientProvider>
  );
}
