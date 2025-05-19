import { DashboardLayout } from "@/components/layout/dashboard/dashboard-layout";
import { useRoute } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { sitesApi, Site } from "@/lib/api";

export default function SiteSettingsPage() {
  // Extract siteSD from the route
  const [, params] = useRoute('/dashboard/site/:siteSD/settings');
  const siteSD = params?.siteSD || '';
  
  const [siteDetails, setSiteDetails] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [siteSettings, setSiteSettings] = useState({
    title: '',
    description: '',
    customDomain: '',
    favicon: '',
    logo: ''
  });
  
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
        
        // Initialize settings with actual site data
        setSiteSettings({
          title: data.name,
          description: 'A community powered by Bettermode',
          customDomain: `${data.subdomain || `example-${siteSD}`}.bettermode.com`,
          favicon: '',
          logo: ''
        });
        
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSiteSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would submit to an API in a real app
    console.log('Submitting site settings:', siteSettings);
  };
  
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
  
  return (
    <DashboardLayout currentSiteIdentifier={siteDetails.id} siteName={siteDetails.name}>
      <div className="w-full p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{siteDetails.name} Settings</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure site-specific settings
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <Card className="w-full max-w-2xl mb-6">
            <CardHeader>
              <CardTitle>Site Details</CardTitle>
              <CardDescription>
                Basic information about your site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Site Name</Label>
                <Input 
                  id="title" 
                  name="title" 
                  value={siteSettings.title} 
                  onChange={handleChange} 
                  placeholder="My Awesome Community" 
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  name="description" 
                  value={siteSettings.description} 
                  onChange={handleChange} 
                  placeholder="A brief description of your community" 
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="w-full max-w-2xl mb-6">
            <CardHeader>
              <CardTitle>Domain</CardTitle>
              <CardDescription>
                Configure the domain for your site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="customDomain">Custom Domain</Label>
                <Input 
                  id="customDomain" 
                  name="customDomain" 
                  value={siteSettings.customDomain} 
                  onChange={handleChange} 
                  placeholder="mycommunity.com" 
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Your default domain is {siteDetails.subdomain || `example-${siteSD}`}.bettermode.com
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="w-full max-w-2xl mb-6">
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>
                Customize your site's brand assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="logo">Logo URL</Label>
                <Input 
                  id="logo" 
                  name="logo" 
                  value={siteSettings.logo} 
                  onChange={handleChange} 
                  placeholder="https://example.com/logo.png" 
                />
              </div>
              
              <div>
                <Label htmlFor="favicon">Favicon URL</Label>
                <Input 
                  id="favicon" 
                  name="favicon" 
                  value={siteSettings.favicon} 
                  onChange={handleChange} 
                  placeholder="https://example.com/favicon.ico" 
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end w-full max-w-2xl">
            <Button type="submit" className="bg-primary-600 hover:bg-primary-700">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
} 