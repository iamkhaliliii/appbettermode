import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Content from "@/pages/content";
import Settings from "@/pages/settings";
import People from "@/pages/people";
function Router() {

  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/content" />} />
      <Route path="/content" component={Content} />
      <Route path="/content/:section" component={Content} />
      <Route path="/people" component={People} />
      <Route path="/people/:section" component={People} />
      <Route path="/design-studio" component={Content} />
      <Route path="/design-studio/:section" component={Content} />
      <Route path="/appearance" component={Content} />
      <Route path="/appearance/:section" component={Content} />
      <Route path="/settings" component={Settings} />
      <Route path="/settings/:section" component={Settings} />
      <Route path="/billing" component={Content} />
      <Route path="/billing/:section" component={Content} />
      <Route path="/reports" component={Content} />
      <Route path="/reports/:section" component={Content} />
      <Route path="/app-store" component={Content} />
      <Route path="/app-store/:section" component={Content} />
      <Route component={Content} />
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
