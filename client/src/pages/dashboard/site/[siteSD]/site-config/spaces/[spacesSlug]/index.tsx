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
  FileText
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

export default function SpacePreviewPage() {
  const [, params] = useRoute('/dashboard/site/:siteSD/site-config/spaces/:spacesSlug');
  const [location, setLocation] = useLocation();
  const siteSD = params?.siteSD || '';
  const spacesSlug = params?.spacesSlug || '';
  
  const [siteDetails, setSiteDetails] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [responsiveDropdownOpen, setResponsiveDropdownOpen] = useState(false);
  const [addContentDialogOpen, setAddContentDialogOpen] = useState(false);

  // Construct the URL for display in browser mockup
  const siteUrl = `/site/${siteSD}/${spacesSlug}`;
  
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

  // Set up keyboard shortcut for opening the dialog
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if key 'n' is pressed and no input elements are focused
      if (
        event.key === 'n' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        setAddContentDialogOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Check if the current route matches the expected format
  useEffect(() => {
    if (siteSD && spacesSlug && location !== APP_ROUTES.DASHBOARD_SITE.SITE_CONFIG_SPACE(siteSD, spacesSlug)) {
      // If we're on the right page but with a different route format, update the location
      setLocation(APP_ROUTES.DASHBOARD_SITE.SITE_CONFIG_SPACE(siteSD, spacesSlug));
    }
  }, [siteSD, spacesSlug, location, setLocation]);

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

  // Get icon based on space type
  const getSpaceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'discussion':
        return <MessageSquare className="h-4 w-4" />;
      case 'qa':
        return <HelpCircle className="h-4 w-4" />;
      case 'blog':
        return <FileText className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'wishlist':
        return <Star className="h-4 w-4" />;
      case 'knowledge':
        return <BookOpen className="h-4 w-4" />;
      case 'landing':
        return <Layout className="h-4 w-4" />;
      case 'jobs':
        return <Briefcase className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <DashboardLayout 
      currentSiteIdentifier={siteDetails.id} 
      siteName={siteDetails.name}
      onNewContent={() => setAddContentDialogOpen(true)}
    >
      {/* CSS to disable links in preview */}
      <style>
        {disableLinksStyle}
      </style>
      
      {/* Add Content Dialog */}
      <AddContentDialog
        open={addContentDialogOpen}
        onOpenChange={setAddContentDialogOpen}
      />
      
      <div className="w-full p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Previewing space: 
            </div>
            <div className="flex items-center bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 px-2.5 py-1 rounded-md text-sm font-medium">
              {getSpaceIcon(spacesSlug)}
              <span className="ml-1.5 capitalize">{spacesSlug}</span>
            </div>
          </div>
        </div>
        
        <BrowserMockup
          userDropdownOpen={userDropdownOpen}
          setUserDropdownOpen={setUserDropdownOpen}
          languageDropdownOpen={languageDropdownOpen}
          setLanguageDropdownOpen={setLanguageDropdownOpen}
          themeDropdownOpen={themeDropdownOpen}
          setThemeDropdownOpen={setThemeDropdownOpen}
          responsiveDropdownOpen={responsiveDropdownOpen}
          setResponsiveDropdownOpen={setResponsiveDropdownOpen}
          siteUrl={siteUrl}
        >
          <SpaceContent siteSD={siteSD} spaceSlug={spacesSlug} />
        </BrowserMockup>
      </div>
    </DashboardLayout>
  );
} 