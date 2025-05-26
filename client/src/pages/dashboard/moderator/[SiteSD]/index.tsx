import { ModeratorDashboardLayout } from "@/components/layout/dashboard/moderator-dashboard-layout";
import { useRoute } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Loader2, Shield, Users, Database, Activity } from "lucide-react";
import { sitesApi, Site } from "@/lib/api";

export default function ModeratorDashboardPage() {
  const [, params] = useRoute('/dashboard/moderator/:SiteSD');
  const siteSD = params?.SiteSD || '';
  
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
      <ModeratorDashboardLayout currentSiteIdentifier={siteSD} siteName="Loading...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
          <p className="ml-3 text-lg">Loading site data...</p>
        </div>
      </ModeratorDashboardLayout>
    );
  }

  if (error) {
    return (
      <ModeratorDashboardLayout currentSiteIdentifier={siteSD} siteName="Error">
        <div className="max-w-2xl mx-auto p-4 my-8 text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-red-700 dark:text-red-400">Error Loading Site</h1>
          <p className="mt-2 text-md text-gray-600 dark:text-gray-400">{error}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">Identifier: {siteSD}</p>
        </div>
      </ModeratorDashboardLayout>
    );
  }

  if (!siteDetails) {
    return (
      <ModeratorDashboardLayout currentSiteIdentifier={siteSD} siteName="Site Not Found">
        <div className="max-w-2xl mx-auto p-4 my-8 text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-yellow-700 dark:text-yellow-400">Site Not Available</h1>
          <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
            Could not load details for the specified site. It may not exist or there was an issue retrieving its data.
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">Identifier: {siteSD}</p>
        </div>
      </ModeratorDashboardLayout>
    );
  }

  // Format dates for display
  const createdDate = siteDetails.createdAt ? new Date(siteDetails.createdAt).toLocaleDateString() : 'N/A';
  const updatedDate = siteDetails.updatedAt ? new Date(siteDetails.updatedAt).toLocaleDateString() : 'N/A';

  return (
    <ModeratorDashboardLayout currentSiteIdentifier={siteDetails.id} siteName={siteDetails.name}>
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Moderator Dashboard</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage content, people, and moderation for {siteDetails.name}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Content Items</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +20% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">567</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                -5% from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Site Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-3 gap-4 py-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Name:</span>
                <span className="col-span-2 text-sm text-gray-700 dark:text-gray-300">{siteDetails.name}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-1">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Domain:</span>
                <span className="col-span-2 text-sm text-gray-700 dark:text-gray-300">
                  {siteDetails.subdomain ? `${siteDetails.subdomain}.bettermode.com` : 'N/A'}
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Moderator Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Content Management</span>
                  </div>
                  <span className="text-xs text-gray-500">Manage posts & pages</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium">People Management</span>
                  </div>
                  <span className="text-xs text-gray-500">Manage users & roles</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium">Moderation</span>
                  </div>
                  <span className="text-xs text-gray-500">Review & moderate</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModeratorDashboardLayout>
  );
} 