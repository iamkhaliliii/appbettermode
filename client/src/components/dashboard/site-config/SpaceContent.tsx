import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteHeader } from "@/components/layout/site/site-header";
import { SiteSidebar } from "@/components/layout/site/site-sidebar";
import { SpaceCmsContent } from "@/components/layout/site/site-space-cms-content";
import { ContentSkeleton } from "./ContentSkeleton";
import { WidgetModeWrapper } from "./WidgetModeWrapper";
import { WidgetDropTarget } from "./WidgetDropTarget";
import { MainContentArea } from "./MainContentArea";
import { useSiteData } from "@/lib/SiteDataContext";

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
}

/**
 * Component to embed space content with full layout
 */
export function SpaceContent({ siteSD, spaceSlug, isWidgetMode = false }: SpaceContentProps) {
  // Get site data from context
  const { sites, cmsTypes } = useSiteData();
  
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
        // Simulate a slight delay for smoother transition
        setTimeout(() => {
          setIsContentLoading(false);
        }, 300);
      }
    };

    if (site && cmsTypes.length > 0) {
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
    <WidgetModeWrapper isActive={isWidgetMode}>
      <div className="h-full pb-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 dark:scrollbar-thumb-gray-700 flex flex-col bg-gray-50 dark:bg-gray-900 preview-container">
        {/* Site Header - always render */}
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

        {/* Main Content */}
        <div className="flex-1">
          <div className="container mx-auto px-4 flex-grow">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar - always render */}
              <WidgetDropTarget widgetType="Sidebar" isWidgetMode={isWidgetMode}>
                <SiteSidebar siteSD={siteSD} activePage={spaceSlug} />
              </WidgetDropTarget>

              {/* Main content area - animate between states */}
              <div className="flex-1 p-4 md:p-6">
                <MainContentArea isWidgetMode={isWidgetMode}>
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
                      >
                        <WidgetDropTarget widgetType={`${space.name} Content`} isWidgetMode={isWidgetMode}>
                          <SpaceCmsContent 
                            siteSD={siteSD}
                            space={space}
                            site={site}
                          />
                        </WidgetDropTarget>
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
                </MainContentArea>
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