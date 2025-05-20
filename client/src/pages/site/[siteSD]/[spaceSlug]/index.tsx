import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { sitesApi } from '@/lib/api';
import { SiteHeader } from '@/components/layout/site/site-header';
import { SiteSidebar } from '@/components/layout/site/site-sidebar';
import { SpaceCmsContent } from '@/components/layout/site/site-space-cms-content';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/dashboard/header';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

// Types
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

// Main Component
export default function SpacePage() {
  const { siteSD, spaceSlug } = useParams();
  const [, setLocation] = useLocation();
  const [site, setSite] = useState<any>(null);
  const [space, setSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch site data once
  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteSD) {
        setError('Invalid site identifier');
        setIsLoading(false);
        return;
      }

      try {
        // 1. Fetch site data
        const siteData = await sitesApi.getSite(siteSD);
        setSite(siteData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching site data:", err);
        setError('Failed to load site data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, [siteSD]);

  // Fetch space data when spaceSlug changes
  useEffect(() => {
    const fetchSpaceData = async () => {
      if (!siteSD || !spaceSlug || !site) {
        return;
      }

      setIsContentLoading(true);
      setSpace(null); // Clear previous space while loading new one

      try {
        // Simulate space fetching by looking in space_ids or checking associated spaces
        if ((site as any).space_ids && Array.isArray((site as any).space_ids)) {
          // Proper implementation would fetch the space by ID or slug
          console.log("Would fetch space with slugs:", spaceSlug);
          console.log("Site has space_ids:", (site as any).space_ids);
          
          // Temporary simulation - get spaces for the site and find by slug
          try {
            const spaces = await fetch(`/api/v1/sites/${site.id}/spaces`).then(res => res.json());
            const matchedSpace = spaces.find((s: any) => s.slug === spaceSlug);
            
            if (matchedSpace) {
              setSpace(matchedSpace);
            } else {
              // If we can't find the space, try to guess from the content_types
              if (site.content_types && Array.isArray(site.content_types)) {
                // Assume the spaceSlug might directly match a content type
                const matchedType = site.content_types.find((type: string) => 
                  type === spaceSlug || 
                  type.toLowerCase() === spaceSlug ||
                  (spaceSlug === 'qa' && type === 'qa')
                );
                
                if (matchedType) {
                  // Create a simulated space based on the content type
                  setSpace({
                    id: `simulated-${matchedType}`,
                    name: matchedType.charAt(0).toUpperCase() + matchedType.slice(1),
                    slug: spaceSlug,
                    description: `${matchedType} content`,
                    cms_type: matchedType,
                    hidden: false,
                    visibility: 'public',
                    site_id: site.id
                  });
                  setIsContentLoading(false);
                  return;
                } else {
                  setError(`Space "${spaceSlug}" not found for this site`);
                }
              } else {
                setError(`Space "${spaceSlug}" not found for this site`);
              }
            }
          } catch (spaceError) {
            console.error("Error fetching spaces:", spaceError);
            
            // Fallback if API is not implemented: use the slug as the CMS type
            if (site.content_types && Array.isArray(site.content_types)) {
              const matchedType = site.content_types.find((type: string) => 
                type === spaceSlug || 
                type.toLowerCase() === spaceSlug ||
                (spaceSlug === 'qa' && type === 'qa')
              );
              
              if (matchedType) {
                // Create a simulated space based on the content type
                setSpace({
                  id: `simulated-${matchedType}`,
                  name: matchedType.charAt(0).toUpperCase() + matchedType.slice(1),
                  slug: spaceSlug,
                  description: `${matchedType} content`,
                  cms_type: matchedType,
                  hidden: false,
                  visibility: 'public',
                  site_id: site.id
                });
                setIsContentLoading(false);
                return;
              } else {
                setError(`Space "${spaceSlug}" not found for this site`);
              }
            }
          }
        } else {
          // No space_ids, try to match with content_types
          if (site.content_types && Array.isArray(site.content_types)) {
            const matchedType = site.content_types.find((type: string) => 
              type === spaceSlug || 
              type.toLowerCase() === spaceSlug ||
              (spaceSlug === 'qa' && type === 'qa')
            );
            
            if (matchedType) {
              // Create a simulated space based on the content type
              setSpace({
                id: `simulated-${matchedType}`,
                name: matchedType.charAt(0).toUpperCase() + matchedType.slice(1),
                slug: spaceSlug,
                description: `${matchedType} content`,
                cms_type: matchedType,
                hidden: false,
                visibility: 'public',
                site_id: site.id
              });
              setIsContentLoading(false);
              return;
            } else {
              setError(`Space "${spaceSlug}" not found for this site`);
            }
          } else {
            setError(`No content types found for site "${site.name}"`);
          }
        }
      } catch (err) {
        console.error("Error fetching space data:", err);
        setError('Failed to load space data. Please try again later.');
      } finally {
        setIsContentLoading(false);
      }
    };

    if (site) {
      fetchSpaceData();
    }
  }, [siteSD, spaceSlug, site]);

  const handleToggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/site/${siteSD}/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Full page loading state (first load)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 dark:text-primary-400 mx-auto" />
          <span className="mt-4 block text-lg font-medium text-gray-700 dark:text-gray-300">Loading site...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => setLocation(`/site/${siteSD}`)}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Back to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header
        onToggleMobileMenu={handleToggleMobileMenu}
        variant="site"
        siteName={site?.name}
        siteIdentifier={siteSD}
      />
      {/* Site Header */}
      <SiteHeader 
        siteSD={siteSD || ''} 
        site={site} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto px-4 py-6 flex-grow">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Only render sidebar when not on mobile or when menu is open */}
              <SiteSidebar siteSD={siteSD || ''} activePage={spaceSlug} />


            {/* Main content area that changes based on space CMS type */}
            <div className="flex-1 p-4 md:p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                key={spaceSlug} // Re-renders animation when space changes
              >
                {isContentLoading ? (
                  // Skeleton UI while content is loading
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <ContentSkeleton />
                  </div>
                ) : space ? (
                  <SpaceCmsContent 
                    siteSD={siteSD || ''}
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
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              {site?.logo_url ? (
                <img src={site.logo_url} alt={site.name} className="h-8 w-8 object-contain" />
              ) : (
                <div 
                  className="h-8 w-8 rounded-md flex items-center justify-center font-bold text-white"
                  style={{ 
                    backgroundColor: site?.brand_color || '#6366f1',
                  }}
                >
                  {site?.name?.substring(0, 1) || 'S'}
                </div>
              )}
              <span className="font-semibold text-gray-900 dark:text-white">
                {site?.name || 'Community'}
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} {site?.name || 'Community'} - Powered by BetterMode
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 