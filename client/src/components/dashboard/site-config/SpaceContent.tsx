import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteHeader } from "@/components/layout/site/site-header";
import { SiteSidebar } from "@/components/layout/site/site-sidebar";
import { SpaceCmsContent } from "@/components/layout/site/site-space-cms-content/index";
import { SpaceBanner } from "@/components/layout/site/site-space-cms-content/SpaceBanner";
import { ContentSkeleton } from "./ContentSkeleton";
import { WidgetModeWrapper } from "./WidgetModeWrapper";
import { WidgetDropTarget } from "./WidgetDropTarget";
import { MainContentArea } from "./MainContentArea";
import { useSiteData } from "@/lib/SiteDataContext";
import { getApiBaseUrl } from "@/lib/utils";

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
  isWidgetMode?: boolean;
  spaceBanner?: boolean;
  spaceBannerUrl?: string;
}

/**
 * Component to embed space content with full layout
 */
export function SpaceContent({ siteSD, spaceSlug, isWidgetMode = false, spaceBanner, spaceBannerUrl }: SpaceContentProps) {
  // Get site data from context
  const { sites, cmsTypes } = useSiteData();
  const [isDragging, setIsDragging] = useState(false);
  
  const [site, setSite] = useState<any>(null);
  const [space, setSpace] = useState<Space | null>(null);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Set up site data from context
  useEffect(() => {
    if (sites[siteSD]) {
      setSite(sites[siteSD]);
    }
  }, [siteSD, sites]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // In preview mode, just prevent default
  }, []);

  // Create space from content type
  useEffect(() => {
    const createSpace = async () => {
      if (!site || !spaceSlug) {
        return;
      }

      setIsContentLoading(true);
      setError(null);
      
      try {
        console.log(`🔍 SpaceContent (dashboard): Looking for space with slug "${spaceSlug}"`);
        
        // First, try to fetch real spaces from the site
        try {
          const API_BASE = getApiBaseUrl();
          const spacesResponse = await fetch(`${API_BASE}/api/v1/sites/${site.id}/spaces`);
          
          if (spacesResponse.ok) {
            const realSpaces = await spacesResponse.json();
            console.log(`📋 Found ${Array.isArray(realSpaces) ? realSpaces.length : 0} real spaces:`, realSpaces);
            
            if (Array.isArray(realSpaces)) {
              // Try to find exact slug match
              const matchedSpace = realSpaces.find((s: any) => 
                s.slug?.toLowerCase() === spaceSlug.toLowerCase()
              );
              
              if (matchedSpace) {
                console.log('✅ Found real space with exact slug match:', matchedSpace);
                setSpace({
                  id: matchedSpace.id,
                  name: matchedSpace.name,
                  slug: matchedSpace.slug,
                  description: matchedSpace.description,
                  cms_type: matchedSpace.cms_type,
                  hidden: matchedSpace.hidden || false,
                  visibility: matchedSpace.visibility || 'public',
                  site_id: matchedSpace.site_id || site.id
                });
                return;
              }
            }
          }
        } catch (fetchError) {
          console.log('⚠️ Could not fetch real spaces, falling back to content type matching:', fetchError);
        }
        
        // If no real space found, try to match with content types from site data
        if (site.content_types && Array.isArray(site.content_types)) {
          console.log(`📝 Checking ${site.content_types.length} content types from site data`);
          
          let normalizedSlug = spaceSlug.toLowerCase();
          // Handle special mappings
          if (normalizedSlug === 'qa' || normalizedSlug === 'q-a') {
            normalizedSlug = 'qa';
          }
          if (normalizedSlug === 'job-board' || normalizedSlug === 'jobboard') {
            normalizedSlug = 'jobs';
          }
          if (normalizedSlug === 'ideas-wishlist' || normalizedSlug === 'wishlist') {
            normalizedSlug = 'wishlist';
          }
          if (normalizedSlug === 'knowledge-base' || normalizedSlug === 'knowledge') {
            normalizedSlug = 'knowledge';
          }
          
          const matchedType = site.content_types.find((type: any) => {
            const nameMatch = type.name?.toLowerCase() === normalizedSlug;
            const cleanNameMatch = type.name?.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedSlug.replace(/[^a-z0-9]/g, '');
            return nameMatch || cleanNameMatch;
          });
          
          if (matchedType) {
            console.log('📋 Found matching content type:', matchedType);
            
            // Create simulated space with content type data
            setSpace({
              id: `simulated-${matchedType.name}`,
              name: matchedType.label || matchedType.name.charAt(0).toUpperCase() + matchedType.name.slice(1),
              slug: spaceSlug,
              description: matchedType.description || `${matchedType.label || matchedType.name} space for the community`,
              cms_type: matchedType.name, // Use the string name, not UUID
              hidden: false,
              visibility: 'public',
              site_id: site.id
            });
            console.log('🔧 Created simulated space from content type');
            return;
          }
        }
        
        // Legacy fallback from cmsTypes context 
        const matchingCmsType = cmsTypes.find(type => 
          type.slug?.toLowerCase() === spaceSlug.toLowerCase() || 
          type.name?.toLowerCase() === spaceSlug.toLowerCase()
        );
        
        let matchedTypeId = null;
        
        if (matchingCmsType && site.content_types?.includes(matchingCmsType.id)) {
          matchedTypeId = matchingCmsType.id;
        } else if (Array.isArray(site.content_types)) {
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
          const typeDetails = cmsTypes.find(type => type.id === matchedTypeId);
          
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
          console.log('🔧 Created space from cmsTypes context');
          return;
        }
        
        // Final fallback: create demo space (only as last resort)
        console.log('⚠️ No content type match found, creating demo space as fallback');
        const defaultName = spaceSlug.charAt(0).toUpperCase() + spaceSlug.slice(1);
        
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
        console.log('🔧 Created demo space as last resort');
        
      } catch (err) {
        console.error("💥 Error creating space:", err);
        setError('Failed to create space');
      } finally {
        setTimeout(() => {
          setIsContentLoading(false);
        }, 300);
      }
    };

    if (site && spaceSlug) {
      createSpace();
    }
  }, [site, spaceSlug, cmsTypes]);

  // Performance optimization: Render the footer outside the AnimatePresence
  const renderFooter = useCallback(() => (
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
  ), [site]);

  // If we don't have site data yet, just render a placeholder
  if (!site) {
    return null;
  }

  return (
    <WidgetModeWrapper isActive={isWidgetMode} isDragging={isDragging}>
      <div className="pb-8 flex flex-col bg-gray-50 dark:bg-gray-900 preview-container">
        {/* Site Header - sticky */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
          <WidgetDropTarget widgetType="Header" isWidgetMode={isWidgetMode}>
            <SiteHeader 
              siteSD={siteSD}
              site={site}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
            />
          </WidgetDropTarget>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0">
          <div className="container mx-auto px-4 h-full">
            <div className="flex flex-col md:flex-row gap-6 h-full">
              {/* Sidebar - sticky */}
              <div className="md:sticky md:top-6 md:self-start">
                <WidgetDropTarget widgetType="Sidebar" isWidgetMode={isWidgetMode}>
                  <SiteSidebar siteSD={siteSD} activePage={spaceSlug} />
                </WidgetDropTarget>
              </div>

              {/* Main content area */}
              <div className="flex-1 p-4 md:p-6">
                <AnimatePresence mode="wait">
                  {isContentLoading ? (
                    <motion.div
                      key="skeleton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                    >
                      <WidgetDropTarget widgetType="Content Loading" isWidgetMode={isWidgetMode}>
                        <ContentSkeleton />
                      </WidgetDropTarget>
                    </motion.div>
                  ) : error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center"
                    >
                      <WidgetDropTarget widgetType="Error Message" isWidgetMode={isWidgetMode}>
                        <p className="text-red-500">{error}</p>
                      </WidgetDropTarget>
                    </motion.div>
                  ) : space ? (
                    <motion.div
                      key={`space-${spaceSlug}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Space Header/Banner Section */}
                      {spaceBanner ? (
                        <WidgetDropTarget widgetType="Space Banner" isWidgetMode={isWidgetMode}>
                          <AnimatePresence mode="wait">
                            <SpaceBanner 
                              key="space-banner"
                              show={spaceBanner} 
                              bannerUrl={spaceBannerUrl} 
                              spaceName={space.name} 
                            />
                          </AnimatePresence>
                        </WidgetDropTarget>
                      ) : (
                        <WidgetDropTarget widgetType="Space Header" isWidgetMode={isWidgetMode}>
                          <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                              {space.name}
                            </h1>
                            {space.description && (
                              <p className="text-gray-600 dark:text-gray-400">{space.description}</p>
                            )}
                          </div>
                        </WidgetDropTarget>
                      )}
                      
                      {/* Main Content with Widget Drop Areas */}
                      <MainContentArea isWidgetMode={isWidgetMode} onDragStateChange={setIsDragging}>
                        <WidgetDropTarget widgetType={`${space.name} Content`} isWidgetMode={isWidgetMode}>
                          <SpaceCmsContent 
                            siteSD={siteSD}
                            space={space}
                            site={site}
                            isWidgetMode={isWidgetMode}
                          />
                        </WidgetDropTarget>
                      </MainContentArea>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="no-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center"
                    >
                      <WidgetDropTarget widgetType="Empty State" isWidgetMode={isWidgetMode}>
                        <p className="text-gray-600 dark:text-gray-400">
                          No content available for this space.
                        </p>
                      </WidgetDropTarget>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <WidgetDropTarget widgetType="Footer" isWidgetMode={isWidgetMode}>
          {renderFooter()}
        </WidgetDropTarget>
      </div>
    </WidgetModeWrapper>
  );
} 