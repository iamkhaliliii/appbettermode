import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Content from "@/pages/content";
import Settings from "@/pages/settings";
import People from "@/pages/people";
import DesignStudio from "@/pages/design-studio-simple";
import SpacesFeed from "@/pages/design-studio-spaces-feed";
import Appearance from "@/pages/appearance";
import Billing from "@/pages/billing";
import Reports from "@/pages/reports";
import AppStore from "@/pages/app-store";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/content" />} />
      <Route path="/content" component={Content} />
      <Route path="/content/:section" component={Content} />
      <Route path="/people" component={People} />
      <Route path="/people/:section" component={People} />
      <Route path="/design-studio" component={DesignStudio} />
      <Route path="/design-studio/spaces/feed" component={SpacesFeed} />
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
