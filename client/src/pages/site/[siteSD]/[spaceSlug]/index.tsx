import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useLocation } from 'wouter';
import { sitesApi } from '@/lib/api';
import { SiteHeader } from '@/components/layout/site/site-header';
import { SiteSidebar } from '@/components/layout/site/site-sidebar';
import { SpaceCmsContent } from '@/components/layout/site/site-space-cms-content';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/dashboard/header';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiBaseUrl } from '@/lib/utils';
import { useSiteData } from '../../../../lib/SiteDataContext';
import { Avatar } from '@/components/ui/avatar';
import { SiteContext } from '../index';

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

// Full page skeleton loading component
const FullPageSkeleton = ({ siteSD }: { siteSD: string }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header skeleton */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-5 w-32 ml-3" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Site header skeleton */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center">
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-44 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Main content skeleton */}
      <div className="flex-1">
        <div className="container mx-auto px-4 flex-grow py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar skeleton */}
            <div className="w-64 flex-shrink-0 hidden md:block">
              <div className="space-y-2">
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-3/4 rounded-md" />
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-5/6 rounded-md" />
                <div className="pt-2">
                  <Skeleton className="h-8 w-full rounded-md" />
                  <Skeleton className="h-8 w-full rounded-md mt-2" />
                </div>
              </div>
            </div>
            
            {/* Main content area skeleton */}
            <div className="flex-1 p-4 md:p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="animate-pulse">
                <div className="flex items-center space-x-4 mb-6">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-[250px]" />
                    <Skeleton className="h-4 w-[180px]" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-full mb-3" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <Skeleton className="h-4 w-1/3 mb-3" />
                    <Skeleton className="h-24 w-full rounded-md" />
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <Skeleton className="h-24 w-full rounded-md" />
                  </div>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mt-4">
                  <Skeleton className="h-5 w-1/4 mb-3" />
                  <div className="flex flex-wrap gap-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex flex-col items-center">
                        <Skeleton className="h-10 w-10 rounded-full mb-2" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer skeleton */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
};

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
        <Skeleton className="h-64 w-full rounded-md" />
      </div>
    </div>
  );
}

// Space page content component - this is only the content section
export function SpaceContent() {
  const { siteSD, spaceSlug } = useParams();
  const { site, isLoading: siteIsLoading } = React.useContext(SiteContext);
  const [space, setSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch spaces when site data and space slug are available
  useEffect(() => {
    const fetchSpaceData = async () => {
      if (!site || !spaceSlug) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Get spaces for this site
        const API_BASE = getApiBaseUrl();
        const response = await fetch(`${API_BASE}/api/v1/sites/${site.id}/spaces`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch spaces: ${response.statusText}`);
        }
        
        const spaces = await response.json();
        
        if (!Array.isArray(spaces)) {
          throw new Error("Invalid response format for spaces");
        }
        
        // Try to find a matching space
        const matchedSpace = spaces.find((s: any) => 
          s.slug.toLowerCase() === spaceSlug.toLowerCase()
        );
        
        if (matchedSpace) {
          setSpace(matchedSpace);
        } else if (site.content_types && Array.isArray(site.content_types)) {
          // Try to match with a content type
          let normalizedSlug = spaceSlug.toLowerCase();
          if (normalizedSlug === 'qa' || normalizedSlug === 'q-a') {
            normalizedSlug = 'qa';
          }
          
          const matchedType = site.content_types.find((type: string) => 
            type.toLowerCase() === normalizedSlug || 
            type.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedSlug.replace(/[^a-z0-9]/g, '')
          );
          
          if (matchedType) {
            const simulatedSpace = {
              id: `simulated-${matchedType}`,
              name: matchedType.charAt(0).toUpperCase() + matchedType.slice(1),
              slug: spaceSlug,
              description: `${matchedType} content`,
              cms_type: matchedType,
              hidden: false,
              visibility: 'public' as 'public' | 'private' | 'paid',
              site_id: site.id
            };
            
            setSpace(simulatedSpace);
          } else {
            setError(`Space "${spaceSlug}" not found for this site`);
          }
        } else {
          setError(`Space "${spaceSlug}" not found for this site`);
        }
      } catch (err) {
        console.error("Error fetching space data:", err);
        setError(err instanceof Error ? err.message : 'Failed to load space data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpaceData();
  }, [site, spaceSlug]);
  
  if (isLoading || siteIsLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <ContentSkeleton />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
      </div>
    );
  }
  
  if (!space) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          No content available for this space.
        </p>
      </div>
    );
  }
  
  return (
    <SpaceCmsContent 
      siteSD={siteSD || ''}
      space={space}
      site={site}
    />
  );
}

// Main export - compatible with both standalone and nested routing
export default function SpacePage() {
  // Check if we're using nested routing through the SiteContext
  const siteContext = React.useContext(SiteContext);
  const { siteSD, spaceSlug } = useParams();
  
  // If we have siteContext, we're in nested routing mode
  if (siteContext && siteContext.site) {
    return (
      <motion.div
        key={`space-${spaceSlug}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <SpaceContent />
      </motion.div>
    );
  }
  
  // If we're not in a site context, render the full standalone page
  // This fallback ensures this component still works when accessed directly
  const [, setLocation] = useLocation();
  const { sites, loadSite } = useSiteData();
  const [site, setSite] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Memoize handlers to prevent unnecessary re-renders
  const handleToggleMobileMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Handle search
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/site/${siteSD}/search?q=${encodeURIComponent(searchQuery)}`);
    }
  }, [searchQuery, siteSD, setLocation]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleBackToHomepage = useCallback(() => {
    setLocation(`/site/${siteSD}`);
  }, [siteSD, setLocation]);
  
  // Fetch site data in standalone mode
  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteSD) {
        setError('Invalid site identifier');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        if (sites[siteSD]) {
          setSite(sites[siteSD]);
        } else {
          const siteData = await loadSite(siteSD);
          if (siteData) {
            setSite(siteData);
          }
        }
      } catch (err) {
        console.error("Error fetching site data:", err);
        setError('Failed to load site data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSiteData();
  }, [siteSD, sites, loadSite]);

  // In standalone mode, create a site context for SpaceContent
  const standaloneContext = useMemo(() => ({
    site,
    isLoading
  }), [site, isLoading]);

  // Full page skeleton loading for standalone mode
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header
          onToggleMobileMenu={handleToggleMobileMenu}
          variant="site"
          siteName="Loading..."
          siteIdentifier={siteSD}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary-600 dark:text-primary-400 mx-auto" />
            <span className="mt-4 block text-lg font-medium text-gray-700 dark:text-gray-300">Loading site...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state for standalone mode
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header
          onToggleMobileMenu={handleToggleMobileMenu}
          variant="site"
          siteName={site?.name || "Error"}
          siteIdentifier={siteSD}
        />
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Error</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
            <button 
              onClick={handleBackToHomepage}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Back to Homepage
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Standalone mode UI
  return (
    <SiteContext.Provider value={standaloneContext}>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header
          onToggleMobileMenu={handleToggleMobileMenu}
          variant="site"
          siteName={site?.name}
          siteIdentifier={siteSD}
        />
        <SiteHeader 
          siteSD={siteSD || ''} 
          site={site} 
          isMenuOpen={isMenuOpen} 
          setIsMenuOpen={setIsMenuOpen}
          searchQuery={searchQuery}
          setSearchQuery={handleSearchChange}
          handleSearch={handleSearch}
        />

        <div className="flex-1">
          <div className="container mx-auto px-4 flex-grow">
            <div className="flex flex-col md:flex-row gap-6">
              <SiteSidebar siteSD={siteSD || ''} activePage={spaceSlug} />

              <div className="flex-1 p-4 md:p-6">
                <motion.div
                  key={`space-${spaceSlug}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <SpaceContent />
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
    </SiteContext.Provider>
  );
} 