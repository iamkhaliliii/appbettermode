import { DashboardLayout } from "@/components/layout/dashboard/dashboard-layout";
import { useRoute, useLocation } from "wouter";
import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Loader2,
  MessageSquare,
  HelpCircle,
  Star,
  Calendar,
  BookOpen,
  Layout,
  Briefcase,
  FileText,
  Shield
} from "lucide-react";
import { BrowserMockup } from "@/components/layout/dashboard/browser-mockup";
import { AddContentDialog } from "@/components/ui/add-content-dialog";
import { sitesApi, Site } from "@/lib/api";
import { getApiBaseUrl } from "@/lib/utils";
import { APP_ROUTES } from "@/config/routes";
import { SiteHeader } from "@/components/layout/site/site-header";
import { SiteSidebar } from "@/components/layout/site/site-sidebar";
import { SpaceCmsContent } from "@/components/layout/site/site-space-cms-content";
import { Skeleton } from "@/components/ui/skeleton";
import { cmsTypesApi } from "@/lib/api";
import { SpaceSettingsSidebar } from "@/components/layout/dashboard/secondary-sidebar/SpaceSettingsSidebar";

// Interface for space data
interface Space {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cms_type: string;
  hidden: boolean;
  visibility: 'public' | 'private' | 'paid';
  site_id: string;
}

// CSS to disable all links in the preview
const disableLinksStyle = `
  .preview-container a {
    pointer-events: none !important;
    cursor: default !important;
    color: inherit !important;
    text-decoration: none !important;
  }
`;

// Skeleton component for content loading
function ContentSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="pt-4">
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );
}

// Component to embed space content with full layout
const SpaceContent = ({ siteSD, spaceSlug }: { siteSD: string, spaceSlug: string }) => {
  const [site, setSite] = useState<any>(null);
  const [space, setSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cmsTypes, setCmsTypes] = useState<any[]>([]);

  // Fetch CMS types for matching content types properly
  useEffect(() => {
    const fetchCmsTypes = async () => {
      try {
        const types = await cmsTypesApi.getAllCmsTypes();
        setCmsTypes(types);
      } catch (err) {
        console.error("Error fetching CMS types:", err);
      }
    };
    
    fetchCmsTypes();
  }, []);

  // Fetch site data
  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteSD) {
        setError('Invalid site identifier');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch site data
        const siteData = await sitesApi.getSite(siteSD);
        setSite(siteData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching site data:", err);
        setError('Failed to load site data');
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, [siteSD]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In preview mode, just prevent default
  };

  // Create space from content type
  useEffect(() => {
    const createSpace = () => {
      if (!site || !spaceSlug || cmsTypes.length === 0) {
        return;
      }

      setIsContentLoading(true);
      
      try {
        // First, find CMS type by slug (case-insensitive)
        const matchingCmsType = cmsTypes.find(type => 
          type.slug?.toLowerCase() === spaceSlug.toLowerCase() || 
          type.name?.toLowerCase() === spaceSlug.toLowerCase()
        );
        
        // Then check if site includes this type by ID
        let matchedTypeId = null;
        
        if (matchingCmsType && site.content_types?.includes(matchingCmsType.id)) {
          matchedTypeId = matchingCmsType.id;
        } else if (Array.isArray(site.content_types)) {
          // If no direct match, check if any of the site's content types match the slug
          const contentTypeDetails = cmsTypes.filter(type => site.content_types.includes(type.id));
          const matchBySlug = contentTypeDetails.find(type => 
            type.slug?.toLowerCase() === spaceSlug.toLowerCase() || 
            type.name?.toLowerCase() === spaceSlug.toLowerCase()
          );
          
          if (matchBySlug) {
            matchedTypeId = matchBySlug.id;
          }
        }
        
        if (matchedTypeId) {
          // Find the details for this type
          const typeDetails = cmsTypes.find(type => type.id === matchedTypeId);
          
          // Create a space from this content type
          setSpace({
            id: `space-${matchedTypeId}`,
            name: typeDetails?.name || spaceSlug.charAt(0).toUpperCase() + spaceSlug.slice(1),
            slug: spaceSlug,
            description: typeDetails?.description || `${spaceSlug} space for the community`,
            cms_type: matchedTypeId,
            hidden: false,
            visibility: 'public',
            site_id: site.id
          });
        } else {
          // For demo/preview purposes, create a generic space if not found
          // This helps when testing with URLs like /site-config/spaces/events
          const defaultName = spaceSlug.charAt(0).toUpperCase() + spaceSlug.slice(1);
          
          // Map common space names to readable formats
          const nameMap: {[key: string]: string} = {
            'events': 'Events',
            'qa': 'Q&A',
            'blog': 'Blog',
            'discussion': 'Discussions',
            'wishlist': 'Ideas & Wishlist',
            'knowledge': 'Knowledge Base',
            'landing': 'Landing Pages',
            'jobs': 'Job Board',
          };
          
          setSpace({
            id: `demo-space-${spaceSlug}`,
            name: nameMap[spaceSlug.toLowerCase()] || defaultName,
            slug: spaceSlug,
            description: `${nameMap[spaceSlug.toLowerCase()] || defaultName} space for the community`,
            cms_type: spaceSlug,
            hidden: false,
            visibility: 'public',
            site_id: site.id
          });
        }
      } catch (err) {
        console.error("Error creating space:", err);
        setError('Failed to create space');
      } finally {
        setIsContentLoading(false);
      }
    };

    if (site && cmsTypes.length > 0) {
      createSpace();
    }
  }, [site, spaceSlug, cmsTypes]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        <p className="ml-3">Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full pb-8 overflow-y-auto flex flex-col bg-gray-50 dark:bg-gray-900 preview-container">
      {/* Site Header */}
      <SiteHeader 
        siteSD={siteSD}
        site={site}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto px-4 flex-grow">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <SiteSidebar siteSD={siteSD} activePage={spaceSlug} />

            {/* Main content area */}
            <div className="flex-1 p-4 md:p-6">
              {isContentLoading ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <ContentSkeleton />
                </div>
              ) : space ? (
                <SpaceCmsContent 
                  siteSD={siteSD}
                  space={space}
                  site={site}
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    No content available for this space.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-4 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              {site?.logo_url ? (
                <img src={site.logo_url} alt={site.name} className="h-6 w-6 object-contain" />
              ) : (
                <div 
                  className="h-6 w-6 rounded-md flex items-center justify-center font-bold text-white"
                  style={{ 
                    backgroundColor: site?.brand_color || '#6366f1',
                  }}
                >
                  {site?.name?.substring(0, 1) || 'S'}
                </div>
              )}
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {site?.name || 'Community'}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} {site?.name || 'Community'} - Powered by BetterMode
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function SpaceSettingsPage() {
  const [, params] = useRoute('/dashboard/site/:siteSD/site-config/spaces/:spacesSlug');
  const [location, setLocation] = useLocation();
  const siteSD = params?.siteSD || '';
  const spacesSlug = params?.spacesSlug || '';
  
  const [siteDetails, setSiteDetails] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addContentDialogOpen, setAddContentDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
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

  // Get capitalized space name for display
  const getDisplaySpaceName = () => {
    // Convert from slug to display name (capitalize first letter and replace hyphens with spaces)
    return spacesSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get the title for the current tab
  const getTabTitle = () => {
    switch(activeTab) {
      case 'general': return 'General Settings';
      case 'permissions': return 'Permissions Settings';
      case 'seo': return 'SEO Settings';
      case 'display': return 'Display Settings';
      case 'customize': return 'Customize Settings';
      case 'danger': return 'Danger Zone';
      default: return 'Settings';
    }
  };

  return (
    <DashboardLayout 
      currentSiteIdentifier={siteDetails.id} 
      siteName={siteDetails.name}
      onNewContent={() => setAddContentDialogOpen(true)}
      secondarySidebar={
        <SpaceSettingsSidebar 
          siteSD={siteSD} 
          spaceName={getDisplaySpaceName()} 
          spaceSlug={spacesSlug}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      }
    >
      {/* Add Content Dialog */}
      <AddContentDialog
        open={addContentDialogOpen}
        onOpenChange={setAddContentDialogOpen}
      />
      
      <div className="w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{getTabTitle()}</h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            {/* General Settings Tab */}
            {activeTab === 'general' && (
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Space Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      defaultValue={getDisplaySpaceName()}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      The name of your space as displayed to users.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Space Slug
                    </label>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      defaultValue={spacesSlug}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      The URL-friendly version of the name. It is usually all lowercase and contains only letters, numbers, and hyphens.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      defaultValue={`This is the ${getDisplaySpaceName()} space`}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      A brief description of what this space is about.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Visibility
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="public"
                          name="visibility"
                          value="public"
                          defaultChecked
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor="public" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Public (visible to all users)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="private"
                          name="visibility"
                          value="private"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor="private" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Private (visible only to staff and admins)
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="members"
                          name="visibility"
                          value="members"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600"
                        />
                        <label htmlFor="members" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Members (visible only to registered members)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Permissions Tab */}
            {activeTab === 'permissions' && (
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex items-start p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
                    <Shield className="h-5 w-5 text-amber-500 dark:text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Permissions Configuration</h3>
                      <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                        Define who can access this space and what actions they can perform.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">Access Control</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="canView"
                          name="canView"
                          defaultChecked
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label htmlFor="canView" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          All users can view content
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="canCreate"
                          name="canCreate"
                          defaultChecked
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label htmlFor="canCreate" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Members can create content
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="canComment"
                          name="canComment"
                          defaultChecked
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label htmlFor="canComment" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Members can comment
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="moderationRequired"
                          name="moderationRequired"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label htmlFor="moderationRequired" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Require moderation for new content
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-base font-medium text-gray-900 dark:text-white">Advanced Permissions</h3>
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Role
                          </th>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            View
                          </th>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Create
                          </th>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Comment
                          </th>
                          <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Moderate
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            Admin
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            <input
                              type="checkbox"
                              checked
                              disabled
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            <input
                              type="checkbox"
                              checked
                              disabled
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            <input
                              type="checkbox"
                              checked
                              disabled
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            <input
                              type="checkbox"
                              checked
                              disabled
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            Moderator
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            <input
                              type="checkbox"
                              checked
                              disabled
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            <input
                              type="checkbox"
                              checked
                              disabled
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            <input
                              type="checkbox"
                              checked
                              disabled
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                            />
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            <input
                              type="checkbox"
                              checked
                              disabled
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* SEO Tab */}
            {activeTab === 'seo' && (
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="seo-title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      id="seo-title"
                      name="seo-title"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      defaultValue={`${getDisplaySpaceName()} | ${siteDetails.name}`}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      The title that will appear in search engines.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="meta-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Meta Description
                    </label>
                    <textarea
                      id="meta-description"
                      name="meta-description"
                      rows={3}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      defaultValue={`Explore ${getDisplaySpaceName()} on ${siteDetails.name}. Join discussions, share ideas, and connect with others.`}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      A brief description that appears in search engine results.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="meta-keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      id="meta-keywords"
                      name="meta-keywords"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      defaultValue={`${spacesSlug}, ${siteDetails.name}, community`}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Keywords related to this space, separated by commas.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Display Tab */}
            {activeTab === 'display' && (
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Space Icon
                    </label>
                    <div className="flex items-center">
                      <div className="h-16 w-16 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-4">
                        <span className="text-xl font-bold text-gray-700 dark:text-gray-300">
                          {getDisplaySpaceName().substring(0, 1)}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                      >
                        Upload Icon
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="accent-color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Accent Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        id="accent-color"
                        name="accent-color"
                        defaultValue="#6366f1"
                        className="h-10 w-20 p-1 rounded-md border border-gray-300 dark:border-gray-600"
                      />
                      <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                        #6366f1
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      This color will be used for various UI elements in this space.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="banner" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Banner Image
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 flex flex-col items-center">
                      <div className="text-gray-600 dark:text-gray-400 text-sm text-center">
                        <p>Drag and drop an image here, or click to upload</p>
                        <p className="mt-1 text-xs">Recommended size: 1200 x 300 pixels</p>
                      </div>
                      <button
                        type="button"
                        className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                      >
                        Upload Image
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Customize Tab */}
            {activeTab === 'customize' && (
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="layout" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Content Layout
                    </label>
                    <select
                      id="layout"
                      name="layout"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      defaultValue="list"
                    >
                      <option value="list">List View</option>
                      <option value="grid">Grid View</option>
                      <option value="masonry">Masonry Layout</option>
                      <option value="compact">Compact View</option>
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Choose how content is displayed in this space.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Content Elements
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="show-author"
                          name="show-author"
                          defaultChecked
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label htmlFor="show-author" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Show author information
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="show-date"
                          name="show-date"
                          defaultChecked
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label htmlFor="show-date" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Show publish date
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="show-reactions"
                          name="show-reactions"
                          defaultChecked
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label htmlFor="show-reactions" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Enable reactions
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured-image"
                          name="featured-image"
                          defaultChecked
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded"
                        />
                        <label htmlFor="featured-image" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Show featured images
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="items-per-page" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Items Per Page
                    </label>
                    <input
                      type="number"
                      id="items-per-page"
                      name="items-per-page"
                      min="5"
                      max="50"
                      className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      defaultValue="20"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Number of items to display per page (5-50).
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* Danger Zone Tab */}
            {activeTab === 'danger' && (
              <div className="space-y-6">
                <div className="border border-red-200 dark:border-red-800 rounded-md p-4 bg-red-50 dark:bg-red-900/20">
                  <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Danger Zone</h3>
                  <p className="text-sm text-red-700 dark:text-red-400 mb-4">
                    These actions are destructive and cannot be undone. Please proceed with caution.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Archive Space</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Archive this space. It will not be visible to users but can be restored later.
                          </p>
                        </div>
                        <button
                          type="button"
                          className="px-3 py-1.5 bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 rounded text-xs font-medium hover:bg-amber-200 dark:hover:bg-amber-900"
                        >
                          Archive
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Reset Space</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Delete all content but keep the space. All posts, comments, and other content will be permanently removed.
                          </p>
                        </div>
                        <button
                          type="button"
                          className="px-3 py-1.5 bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300 rounded text-xs font-medium hover:bg-orange-200 dark:hover:bg-orange-900"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Delete Space</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Permanently delete this space and all its content. This action cannot be undone.
                          </p>
                        </div>
                        <button
                          type="button"
                          className="px-3 py-1.5 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded text-xs font-medium hover:bg-red-200 dark:hover:bg-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 