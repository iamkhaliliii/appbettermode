import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useLocation, useRoute } from "wouter";
import { useEffect } from "react";

export default function DashboardAppStore() {
  const [location, setLocation] = useLocation();
  const [, params] = useRoute('/dashboard/app-store/:section');
  const section = params?.section;

  // Redirect to the first tab (integrations) if we're at the root app-store route
  useEffect(() => {
    if (location === '/dashboard/app-store') {
      setLocation('/dashboard/app-store/integrations');
    }
  }, [location, setLocation]);

  // If we're at the root app-store URL, show a loading state until the redirect happens
  if (location === '/dashboard/app-store') {
    return <DashboardLayout><div className="p-8">Loading app store...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">App Store</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Browse and manage global integrations and add-ons
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center py-12">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Global App Store</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {section && <span>Currently viewing: {section.charAt(0).toUpperCase() + section.slice(1)}</span>}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 