import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useRouter, useRoute } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SiteAdminPage() {
  // Extract siteId from the route
  const [, params] = useRoute('/dashboard/site/:siteId');
  const siteId = params?.siteId || '';
  
  // In a real app, you would fetch site data based on the siteId
  const [siteName, setSiteName] = useState('');
  
  useEffect(() => {
    // Simulate fetching site data
    const fetchSiteData = async () => {
      // This would be an API call in a real app
      setSiteName(`Site ${siteId}`);
    };
    
    if (siteId) {
      fetchSiteData();
    }
  }, [siteId]);
  
  return (
    <DashboardLayout currentSiteId={siteId} siteName={siteName}>
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{siteName} Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your site settings and view analytics
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Overview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Site ID: {siteId}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Domain: example-{siteId}.bettermode.com
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Plan: Pro
              </p>
            </CardContent>
          </Card>
          
          {/* Traffic Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Traffic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Visitors (today)
                  </p>
                  <p className="text-2xl font-semibold">
                    842
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pageviews (today)
                  </p>
                  <p className="text-2xl font-semibold">
                    3,219
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Members Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Total
                  </p>
                  <p className="text-2xl font-semibold">
                    2,451
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    New (30d)
                  </p>
                  <p className="text-2xl font-semibold">
                    278
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 