import React from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Link } from "wouter";
import { ArrowLeft, Settings, LayoutGrid, FileText, Users, BarChart2, Loader2, AlertCircle } from 'lucide-react';
import { getSiteRoute, APP_ROUTES } from '@/config/routes'; // Import APP_ROUTES

// Placeholder API function to fetch site details by ID
// TODO: Implement this API endpoint on the server and the fetch function here
const fetchSiteDetails = async (siteId: string | undefined): Promise<SiteDetails | null> => {
  if (!siteId) return null;
  // const response = await fetch(`/api/sites/${siteId}`); // Example API call
  // if (!response.ok) throw new Error('Failed to fetch site details');
  // return response.json();
  
  // Placeholder data for now:
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  if (siteId === "a1b2c3d4-e5f6-7890-1234-567890abcdef") { // Example matching your test UUID
    return {
      id: siteId,
      name: "My First Test Site", // Fetched from API ideally
      subdomain: "myfirstsite",
      // other details...
    };
  }
  return { id: siteId, name: `Site ${siteId.substring(0,8)}...`, subdomain: 'unknown' }; // Fallback
};

interface SiteDetails {
  id: string;
  name: string;
  subdomain?: string | null;
  // Add other site-specific details you might fetch
}

interface SiteAdminPageParams {
  siteId: string;
}

const SiteAdminPage: React.FC = () => {
  const params = useParams<SiteAdminPageParams>();
  const siteId = params.siteId;

  const {
    data: siteDetails,
    isLoading,
    error,
  } = useQuery<SiteDetails | null, Error>({
    queryKey: ['siteDetails', siteId],
    queryFn: () => fetchSiteDetails(siteId),
    enabled: !!siteId, // Only run query if siteId is available
  });

  // Use getSiteRoute for dynamic sidebar navigation items
  const sidebarNavItems = siteId ? [
    { name: 'Overview', href: getSiteRoute(siteId, 'overview'), icon: LayoutGrid },
    { name: 'Content', href: getSiteRoute(siteId, 'content'), icon: FileText },
    { name: 'Members', href: getSiteRoute(siteId, 'members'), icon: Users },
    { name: 'Analytics', href: getSiteRoute(siteId, 'analytics'), icon: BarChart2 },
    { name: 'Settings', href: getSiteRoute(siteId, 'settings'), icon: Settings },
  ] : [];

  if (isLoading) {
    return (
      <DashboardLayout siteName={siteId ? `Loading Site...` : 'Site'} currentSiteId={siteId} navItems={[]}>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout siteName="Error" currentSiteId={siteId} navItems={[]}>
        <div className="p-8 text-center text-red-600">
          <AlertCircle className="mx-auto h-10 w-10 mb-2" />
          <p>Error loading site details: {error.message}</p>
          <Link href={APP_ROUTES.SITES_LIST}> 
            <a className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sites List
            </a>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  if (!siteDetails) {
    return (
      <DashboardLayout siteName="Site Not Found" currentSiteId={siteId} navItems={[]}>
        <div className="p-8 text-center">
          <p>Site not found or ID is missing.</p>
          <Link href={APP_ROUTES.SITES_LIST}> 
            <a className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sites List
            </a>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    // Pass siteName and currentSiteId to DashboardLayout if it accepts them
    // Also pass sidebarNavItems which should be dynamic based on the siteId
    <DashboardLayout siteName={siteDetails.name} currentSiteId={siteId} navItems={sidebarNavItems}>
      <div className="p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage: {siteDetails.name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Site ID: {siteId}
          </p>
        </header>
        
        {/* TODO: Add specific content for site management here */}
        <p className="mb-4">Welcome to the dashboard for your site: <strong>{siteDetails.name}</strong>.</p>
        <p>Here you will be able to manage content, members, settings, and view analytics for this site.</p>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sidebarNavItems.map(item => (
            <Link key={item.name} href={item.href}>
              <a className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
                <item.icon className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage {item.name.toLowerCase()} for this site.</p>
              </a>
            </Link>
          ))}
        </div>

        {/* Placeholder for where the actual content of sections like Overview, Content, Settings will be rendered */}
        {/* This might involve a nested Switch/Route from wouter if this page is a layout for further sub-pages */}
      </div>
    </DashboardLayout>
  );
};

export default SiteAdminPage;

// Dummy Loader2 and AlertCircle if not already imported elsewhere or for placeholder
// const Loader2: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} />; 
// const AlertCircle: React.FC<React.SVGProps<SVGSVGElement>> = (props) => <svg {...props} />; 