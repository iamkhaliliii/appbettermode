import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Content from "@/pages/content";
import Settings from "@/pages/settings";
import { useEffect } from "react";
import { useLocation } from "wouter";

function Router() {
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Handle clicks on main-sidebar links
    const handleClick = (e: MouseEvent) => {
      const link = e.target.closest('a');
      if (link && link.getAttribute('href').startsWith('/') && !link.getAttribute('href').includes('//')) {
        const href = link.getAttribute('href');
        if (href.startsWith('/people') || 
            href.startsWith('/design-studio') || 
            href.startsWith('/appearance') || 
            href.startsWith('/billing') || 
            href.startsWith('/reports') || 
            href.startsWith('/app-store')) {
          e.preventDefault();
          setLocation('/content');
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [setLocation]);

  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/content" />} />
      <Route path="/content" component={Content} />
      <Route path="/content/:section" component={Content} />
      <Route path="/settings" component={Settings} />
      <Route path="/settings/:section" component={Settings} />
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
