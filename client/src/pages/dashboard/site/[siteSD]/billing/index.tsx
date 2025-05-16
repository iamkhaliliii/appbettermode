import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useLocation, useRoute } from "wouter";
import { useEffect } from "react";
import { APP_ROUTES } from "@/config/routes";

export default function DashboardSiteBilling() {
  const [location, setLocation] = useLocation();
  const [, params] = useRoute('/dashboard/site/:siteId/billing/:section?');
  const siteId = params?.siteId;
  const section = params?.section;

  // If no siteId is provided, show an error state
  if (!siteId) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-red-600">
          No site ID provided
        </div>
      </DashboardLayout>
    );
  }

  // Redirect to the first tab (overview) if we're at the root billing route
  useEffect(() => {
    if (location === APP_ROUTES.DASHBOARD_SITE.BILLING(siteId)) {
      setLocation(APP_ROUTES.DASHBOARD_SITE.BILLING_SECTION(siteId, 'overview'));
    }
  }, [location, setLocation, siteId]);

  // If we're at the root billing URL, show a loading state until the redirect happens
  if (location === APP_ROUTES.DASHBOARD_SITE.BILLING(siteId)) {
    return <DashboardLayout currentSiteId={siteId}><div className="p-8">Loading billing information...</div></DashboardLayout>;
  }

  return (
    <DashboardLayout currentSiteId={siteId}>
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Billing</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your subscription and billing details
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center py-12">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Site Billing</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {section && <span>Currently viewing: {section.charAt(0).toUpperCase() + section.slice(1)}</span>}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 