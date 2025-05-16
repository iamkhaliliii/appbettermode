import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useRoute } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SiteSettingsPage() {
  // Extract siteId from the route
  const [, params] = useRoute('/dashboard/site/:siteId/settings');
  const siteId = params?.siteId || '';
  
  // In a real app, you would fetch site data based on the siteId
  const [siteName, setSiteName] = useState('');
  const [siteSettings, setSiteSettings] = useState({
    title: '',
    description: '',
    customDomain: '',
    favicon: '',
    logo: ''
  });
  
  useEffect(() => {
    // Simulate fetching site data
    const fetchSiteData = async () => {
      // This would be an API call in a real app
      setSiteName(`Site ${siteId}`);
      setSiteSettings({
        title: `Site ${siteId}`,
        description: 'A community powered by Bettermode',
        customDomain: `example-${siteId}.bettermode.com`,
        favicon: '',
        logo: ''
      });
    };
    
    if (siteId) {
      fetchSiteData();
    }
  }, [siteId]);
  
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
  
  return (
    <DashboardLayout currentSiteId={siteId} siteName={siteName}>
      <div className="w-full p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{siteName} Settings</h1>
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
                  Your default domain is example-{siteId}.bettermode.com
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