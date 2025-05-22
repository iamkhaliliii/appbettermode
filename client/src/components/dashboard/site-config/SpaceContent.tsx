import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sitesApi } from "@/lib/api";
import { SiteHeader } from "@/components/layout/site/site-header";
import { SiteSidebar } from "@/components/layout/site/site-sidebar";
import { SpaceCmsContent } from "@/components/layout/site/site-space-cms-content";
import { ContentSkeleton } from "./ContentSkeleton";
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

interface SpaceContentProps {
  siteSD: string;
  spaceSlug: string;
}

/**
 * Component to embed space content with full layout
 */
export function SpaceContent({ siteSD, spaceSlug }: SpaceContentProps) {
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

  return (
    <div className="h-full pb-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 dark:scrollbar-thumb-gray-700 flex flex-col bg-gray-50 dark:bg-gray-900 preview-container">
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
            className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 dark:scrollbar-thumb-gray-700"
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
} 