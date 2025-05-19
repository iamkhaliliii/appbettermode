import { DashboardLayout } from "@/components/layout/dashboard/dashboard-layout";
import { useRoute } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";
import { sitesApi, Site } from "@/lib/api";

export default function SiteAdminPage() {
  const [, params] = useRoute('/dashboard/site/:siteSD');
  const siteSD = params?.siteSD || '';
  
  const [siteDetails, setSiteDetails] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Format dates for display
  const createdDate = siteDetails.createdAt ? new Date(siteDetails.createdAt).toLocaleDateString() : 'N/A';
  const updatedDate = siteDetails.updatedAt ? new Date(siteDetails.updatedAt).toLocaleDateString() : 'N/A';

  return (
    <DashboardLayout currentSiteIdentifier={siteDetails.id} siteName={siteDetails.name}>
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{siteDetails.name} Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage site details
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Site Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-4 py-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">ID:</span>
                <span className="col-span-2 text-sm font-mono text-gray-700 dark:text-gray-300">{siteDetails.id}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Name:</span>
                <span className="col-span-2 text-sm text-gray-700 dark:text-gray-300">{siteDetails.name}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Subdomain:</span>
                <span className="col-span-2 text-sm text-gray-700 dark:text-gray-300">{siteDetails.subdomain || 'N/A'}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Domain:</span>
                <span className="col-span-2 text-sm text-gray-700 dark:text-gray-300">
                  {siteDetails.subdomain ? `${siteDetails.subdomain}.bettermode.com` : 'N/A'}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Owner ID:</span>
                <span className="col-span-2 text-sm font-mono text-gray-700 dark:text-gray-300">
                  {siteDetails.ownerId || 'N/A'}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">State:</span>
                <span className="col-span-2 text-sm text-gray-700 dark:text-gray-300">
                  {siteDetails.state || 'N/A'}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Created:</span>
                <span className="col-span-2 text-sm text-gray-700 dark:text-gray-300">{createdDate}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated:</span>
                <span className="col-span-2 text-sm text-gray-700 dark:text-gray-300">{updatedDate}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Site Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${siteDetails.state === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm font-medium capitalize">{siteDetails.state || 'unknown'}</span>
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Last Activity</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {updatedDate}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}