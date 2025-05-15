import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useLocation, useRoute } from "wouter";
import { useEffect } from "react";

export default function Reports() {
  const [location, setLocation] = useLocation();
  const [, params] = useRoute('/reports/:section');
  const section = params?.section;

  // Redirect to the first tab (overview) if we're at the root reports route
  useEffect(() => {
    if (location === '/reports') {
      setLocation('/reports/overview');
    }
  }, [location, setLocation]);

  // If we're at the root reports URL, show a loading state until the redirect happens
  if (location === '/reports') {
    return <DashboardLayout><div className="p-8">Loading reports...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Reports</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View analytics and reports for your site
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center py-12">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Reports Dashboard</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {section && <span>Currently viewing: {section.charAt(0).toUpperCase() + section.slice(1)}</span>}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}