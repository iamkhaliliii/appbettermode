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
import { useSiteData } from '@/lib/SiteDataContext';

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
  
  // Use the site data context for centralized data management
  const { sites, loadSite, isLoading: contextLoading } = useSiteData();
  
  const [site, setSite] = useState<any>(null);
  const [space, setSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContentLoading, setIsContentLoading] = useState(true);
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

  // Animations for page transitions
  const pageVariants = useMemo(() => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.15 }
  }), []);

  // Animation for loading state
  const loadingVariants = useMemo(() => ({
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: {
        duration: 0.2
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.15
      }
    }
  }), []);

  // Memoize the footer component to prevent re-renders - MOVED BEFORE CONDITIONS
  const Footer = useMemo(() => (
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
  ), [site]);
  
  // Combined async fetch for site and spaces data to prevent sequential loading
  useEffect(() => {
    const fetchAllData = async () => {
      if (!siteSD) {
        setError('Invalid site identifier');
        setIsLoading(false);
        setIsContentLoading(false);
        return;
      }

      setIsLoading(true);
      setIsContentLoading(true);

      try {
        // 1. Get the site data (either from context or API)
        let siteData;
        if (sites[siteSD]) {
          siteData = sites[siteSD];
        } else {
          siteData = await loadSite(siteSD);
          if (!siteData) {
            throw new Error('Failed to load site data');
          }
        }
        
        setSite(siteData);
        
        // Stop here if we don't have a space slug
        if (!spaceSlug) {
          setIsLoading(false);
          setIsContentLoading(false);
          return;
        }
        
        // 2. Fetch spaces data
        const API_BASE = getApiBaseUrl();
        const response = await fetch(`${API_BASE}/api/v1/sites/${siteData.id}/spaces`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch spaces: ${response.statusText}`);
        }
        
        const spaces = await response.json();
        
        if (!Array.isArray(spaces)) {
          throw new Error("Invalid response format for spaces");
        }
        
        // 3. Find matching space
        const matchedSpace = spaces.find((s: any) => 
          s.slug.toLowerCase() === spaceSlug.toLowerCase()
        );
        
        if (matchedSpace) {
          setSpace(matchedSpace);
        } else if (siteData.content_types && Array.isArray(siteData.content_types)) {
          // Try to match with a content type
          let normalizedSlug = spaceSlug.toLowerCase();
          if (normalizedSlug === 'qa' || normalizedSlug === 'q-a') {
            normalizedSlug = 'qa';
          }
          
          const matchedType = siteData.content_types.find((type: string) => 
            type.toLowerCase() === normalizedSlug || 
            type.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedSlug.replace(/[^a-z0-9]/g, '')
          );
          
          if (matchedType) {
            // Create simulated space
            const simulatedSpace = {
              id: `simulated-${matchedType}`,
              name: matchedType.charAt(0).toUpperCase() + matchedType.slice(1),
              slug: spaceSlug,
              description: `${matchedType} content`,
              cms_type: matchedType,
              hidden: false,
              visibility: 'public' as 'public' | 'private' | 'paid',
              site_id: siteData.id
            };
            
            setSpace(simulatedSpace);
          } else {
            // No space or matching content type found
            setError(`Space "${spaceSlug}" not found for this site`);
          }
        } else {
          setError(`Space "${spaceSlug}" not found for this site`);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        // Set both loading states to false at the same time
        setIsLoading(false);
        setIsContentLoading(false);
      }
    };

    fetchAllData();
  }, [siteSD, spaceSlug, sites, loadSite]);

  // Show a single unified loading state for the whole page
  if (isLoading || isContentLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header
          onToggleMobileMenu={handleToggleMobileMenu}
          variant="site"
          siteName={site?.name || "Loading..."}
          siteIdentifier={siteSD}
        />
        <div className="flex-1 flex items-center justify-center">
          <motion.div 
            className="text-center p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Loader2 className="h-12 w-12 animate-spin text-primary-600 dark:text-primary-400 mx-auto mb-4" />
            <div className="mt-2 text-lg font-medium text-gray-700 dark:text-gray-300">Loading content...</div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Error state
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
        setSearchQuery={handleSearchChange}
        handleSearch={handleSearch}
      />

      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto px-4 flex-grow">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <SiteSidebar siteSD={siteSD || ''} activePage={spaceSlug} />

            {/* Main content area with content or empty state */}
            <div className="flex-1 p-4 md:p-6">
              <motion.div
                key={`space-${spaceSlug}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {space ? (
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
      
      {/* Footer */}
      {Footer}
    </div>
  );
} 