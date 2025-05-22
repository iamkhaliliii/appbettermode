import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import { SiteDataProvider } from "./lib/SiteDataContext";

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
import DashboardSiteSiteConfigSpace from "@/pages/dashboard/site/[siteSD]/site-config/spaces/[spacesSlug]/index";
import NotFound from "@/pages/404";
import Content from "@/pages/dashboard/site/[siteSD]/content";

// Import site frontend pages (public facing)
import SiteFrontendSearch from "@/pages/site/[siteSD]/search/index";
import SiteHomePage from "@/pages/site/[siteSD]/index";
// Import dynamic space page
import SpacePage from "@/pages/site/[siteSD]/[spaceSlug]/index";

// Page transition component
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Define your application component
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SiteDataProvider>
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
            <Route path="/dashboard/site/:siteSD/content" component={Content} />
            
            {/* Site config routes */}
            <Route path="/dashboard/site/:siteSD/site-config" component={DashboardSiteSiteConfig} />
            <Route path="/dashboard/site/:siteSD/site-config/spaces/:spacesSlug" component={DashboardSiteSiteConfigSpace} />
            
            {/* Site frontend routes */}
            <Route path="/site/:siteSD" component={SiteHomePage} />
            <Route path="/site/:siteSD/search" component={SiteFrontendSearch} />
            <Route path="/site/:siteSD/:spaceSlug" component={SpacePage} />
            <Route path="/site/:siteSD/:spaceSlug/:postID" component={SpacePage} />
            
            {/* 404 route */}
            <Route component={NotFound} />
          </Switch>
        </PageTransition>
        <Toaster />
      </SiteDataProvider>
    </QueryClientProvider>
  );
}
