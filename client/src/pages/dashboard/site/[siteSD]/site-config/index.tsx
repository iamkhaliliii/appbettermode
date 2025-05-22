import { DashboardLayout } from "@/components/layout/dashboard/dashboard-layout";
import { useLocation, useRoute } from "wouter";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Plus,
  Moon,
  X,
  Settings,
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
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BrowserMockup } from "@/components/layout/dashboard/browser-mockup";
import { AddContentDialog } from "@/components/ui/add-content-dialog";
import { sitesApi, Site } from "@/lib/api";
import { SiteHeader } from "@/components/layout/site/site-header";
import { SiteSidebar } from "@/components/layout/site/site-sidebar";
import { SpaceCmsContent } from "@/components/layout/site/site-space-cms-content";
import { Skeleton } from "@/components/ui/skeleton";

// Types for space data
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

// Component to embed the full site content with layout
const SiteContent = ({ siteSD }: { siteSD: string }) => {
  const [site, setSite] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteSD) return;
      
      setIsLoading(true);
      try {
        const siteData = await sitesApi.getSite(siteSD);
        setSite(siteData);
      } catch (error) {
        console.error('Failed to fetch site data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, [siteSD]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In preview mode, just prevent default
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        <p className="ml-3">Loading site content...</p>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">Failed to load site content</p>
      </div>
    );
  }

  // Dynamically determine available content types
  const contentTypes = Array.isArray(site?.content_types) ? site.content_types : [];
  
  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 flex flex-col bg-gray-50 dark:bg-gray-900 preview-container">
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
            <SiteSidebar siteSD={siteSD} activePage="home" />

            {/* Main Content Feed */}
            <div className="flex-1 p-4 md:p-6">
              {/* Featured Content Header */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to {site?.name || 'our Community'}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Join the conversation, get answers to your questions, and share your ideas with other members.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Display content based on site's content types */}
                {contentTypes.includes('discussion') && (
                  <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                      <h3 className="font-medium">Latest Discussions</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">Join conversations with community members</p>
                    <div className="text-sm text-gray-500">No recent discussions yet</div>
                  </div>
                )}

                {contentTypes.includes('event') && (
                  <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-5 w-5 text-emerald-500" />
                      <h3 className="font-medium">Upcoming Events</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">Attend and organize community events</p>
                    <div className="text-sm text-gray-500">No upcoming events</div>
                  </div>
                )}

                {contentTypes.includes('qa') && (
                  <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-3">
                      <HelpCircle className="h-5 w-5 text-violet-500" />
                      <h3 className="font-medium">Questions & Answers</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">Get help from the community</p>
                    <div className="text-sm text-gray-500">No recent questions</div>
                  </div>
                )}

                {contentTypes.includes('wishlist') && (
                  <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="h-5 w-5 text-amber-500" />
                      <h3 className="font-medium">Ideas & Wishlist</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">Share and vote on ideas</p>
                    <div className="text-sm text-gray-500">No ideas submitted yet</div>
                  </div>
                )}
              </div>
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

// Component to embed space content with full layout
const SpaceContent = ({ siteSD, spaceSlug }: { siteSD: string, spaceSlug: string }) => {
  const [site, setSite] = useState<any>(null);
  const [space, setSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
      if (!site || !spaceSlug) {
        return;
      }

      setIsContentLoading(true);
      
      try {
        // Create a simulated space based on the content type
        if (site.content_types && Array.isArray(site.content_types)) {
          const matchedType = site.content_types.find((type: string) => 
            type === spaceSlug || 
            type.toLowerCase() === spaceSlug ||
            (spaceSlug === 'qa' && type === 'qa')
          );
          
          if (matchedType) {
            let name;
            
            switch (matchedType) {
              case 'discussion': name = 'Discussions'; break;
              case 'qa': name = 'Q&A'; break;
              case 'wishlist': name = 'Ideas & Wishlist'; break;
              case 'blog': name = 'Blog'; break;
              case 'event': name = 'Events'; break;
              case 'knowledge': name = 'Knowledge Base'; break;
              case 'landing': name = 'Landing Pages'; break;
              case 'jobs': name = 'Job Board'; break;
              default: name = matchedType.charAt(0).toUpperCase() + matchedType.slice(1);
            }
            
            setSpace({
              id: `space-${matchedType}`,
              name,
              slug: spaceSlug,
              description: `${name} space for the community`,
              cms_type: matchedType,
              hidden: false,
              visibility: 'public',
              site_id: site.id
            });
          } else {
            setError(`Space "${spaceSlug}" not found for this site`);
          }
        } else {
          setError(`No content types found for this site`);
        }
      } catch (err) {
        console.error("Error creating space:", err);
        setError('Failed to create space');
      } finally {
        setIsContentLoading(false);
      }
    };

    if (site) {
      createSpace();
    }
  }, [site, spaceSlug]);

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
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 flex flex-col bg-gray-50 dark:bg-gray-900 preview-container">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center h-full"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
            <p className="ml-3">Loading content...</p>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="p-4 text-center"
          >
            <p className="text-red-500">{error}</p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function SiteSpecificConfigPage() {
  const [, params] = useRoute('/dashboard/site/:siteSD/site-config');
  const siteSD = params?.siteSD || '';
  
  const [siteDetails, setSiteDetails] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [location, setLocation] = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [responsiveDropdownOpen, setResponsiveDropdownOpen] = useState(false);
  const [addContentDialogOpen, setAddContentDialogOpen] = useState(false);
  
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const isFeed = location.includes('/spaces/feed');

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
        {/* Space selection controls
        <div className="flex flex-wrap gap-2 mb-4">
          <button 
            onClick={() => setSelectedSpace(null)}
            className={cn(
              "px-3 py-1.5 text-sm rounded-md border transition-colors flex items-center gap-1.5",
              !selectedSpace 
                ? "bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-300" 
                : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            )}
          >
            Feed
          </button>
          
          {siteDetails.content_types?.map((type: string) => {
            let name;
            switch (type) {
              case 'discussion': name = 'Discussions'; break;
              case 'qa': name = 'Q&A'; break;
              case 'wishlist': name = 'Ideas & Wishlist'; break;
              case 'blog': name = 'Blog'; break;
              case 'event': name = 'Events'; break;
              case 'knowledge': name = 'Knowledge Base'; break;
              case 'landing': name = 'Landing Pages'; break;
              case 'jobs': name = 'Job Board'; break;
              default: name = type.charAt(0).toUpperCase() + type.slice(1);
            }
            
            return (
              <button 
                key={type}
                onClick={() => setSelectedSpace(type.toLowerCase())}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md border transition-colors flex items-center gap-1.5",
                  selectedSpace === type.toLowerCase()
                    ? "bg-primary-50 border-primary-200 text-primary-700 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-300" 
                    : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                )}
              >
                {getSpaceIcon(type)}
                {name}
              </button>
            );
          })}
        </div> */}
        
        <BrowserMockup
          userDropdownOpen={userDropdownOpen}
          setUserDropdownOpen={setUserDropdownOpen}
          languageDropdownOpen={languageDropdownOpen}
          setLanguageDropdownOpen={setLanguageDropdownOpen}
          themeDropdownOpen={themeDropdownOpen}
          setThemeDropdownOpen={setThemeDropdownOpen}
          responsiveDropdownOpen={responsiveDropdownOpen}
          setResponsiveDropdownOpen={setResponsiveDropdownOpen}
        >
          <div 
            key={selectedSpace ? `space-content-${selectedSpace}` : `site-content-${siteSD}`}
            className="w-full h-full transition-opacity duration-300"
          >
            {selectedSpace ? (
              <SpaceContent siteSD={siteSD} spaceSlug={selectedSpace} />
            ) : (
              <SiteContent siteSD={siteSD} />
            )}
          </div>
        </BrowserMockup>
      </div>
    </DashboardLayout>
  );
} 