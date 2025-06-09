import { DashboardLayout } from "@/components/layout/dashboard/dashboard-layout";
import { useLocation, useRoute } from "wouter";
import { useEffect, useState } from "react";
import { APP_ROUTES } from "@/config/routes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/primitives";
import { AlertTriangle, Loader2 } from "lucide-react";
import { sitesApi, Site } from "@/lib/api";

export default function DashboardSiteBilling() {
  const [location, setLocation] = useLocation();
  const [, params] = useRoute('/dashboard/site/:siteSD/billing/:section?');
  const siteSD = params?.siteSD || '';
  const section = params?.section;
  
  const [siteDetails, setSiteDetails] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch site data
  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteSD) {
        setSiteDetails(null);
        setIsLoading(false);
        setError("No site identifier provided in the URL.");
        return;
      }

      setIsLoading(true);
      setError(null);
      setSiteDetails(null);

      try {
        const data = await sitesApi.getSite(siteSD);
        setSiteDetails(data);
        setIsLoading(false);
      } catch (err: any) {
        const errorMessage = err instanceof Error ? err.message : 
          "An unexpected error occurred while fetching site data.";
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, [siteSD]);

  // Redirect to the first tab if we're at the root billing route
  useEffect(() => {
    if (siteDetails && location === APP_ROUTES.DASHBOARD_SITE.BILLING(siteSD)) {
      setLocation(APP_ROUTES.DASHBOARD_SITE.BILLING_SECTION(siteSD, 'overview'));
    }
  }, [location, setLocation, siteSD, siteDetails]);

  if (isLoading) {
    return (
      <DashboardLayout currentSiteIdentifier={siteSD} siteName="Loading...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
          <p className="ml-3 text-lg">Loading site data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout currentSiteIdentifier={siteSD} siteName="Error">
        <div className="max-w-2xl mx-auto p-4 my-8 text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-red-700 dark:text-red-400">Error Loading Site</h1>
          <p className="mt-2 text-md text-gray-600 dark:text-gray-400">{error}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">Identifier: {siteSD}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!siteDetails) {
    return (
      <DashboardLayout currentSiteIdentifier={siteSD} siteName="Site Not Found">
        <div className="max-w-2xl mx-auto p-4 my-8 text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-yellow-700 dark:text-yellow-400">Site Not Available</h1>
          <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
            Could not load details for the specified site. It may not exist or there was an issue retrieving its data.
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">Identifier: {siteSD}</p>
        </div>
      </DashboardLayout>
    );
  }

  // If we're at the root billing URL and not yet redirected
  if (location === APP_ROUTES.DASHBOARD_SITE.BILLING(siteSD)) {
    return (
      <DashboardLayout currentSiteIdentifier={siteSD} siteName={siteDetails.name}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
          <p className="ml-3 text-lg">Redirecting to Billing Information...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentSiteIdentifier={siteDetails.id} siteName={siteDetails.name}>
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Billing</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage subscription and billing details for {siteDetails.name}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Billing - {section ? section.charAt(0).toUpperCase() + section.slice(1) : 'Overview'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {section && <span>Currently viewing: {section.charAt(0).toUpperCase() + section.slice(1)}</span>}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 