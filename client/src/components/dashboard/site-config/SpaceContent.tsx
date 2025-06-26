import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteHeader } from "@/components/layout/site/site-header";
import { SiteSidebar } from "@/components/layout/site/site-sidebar";
import { SpaceCmsContent } from "@/components/layout/site/site-space-cms-content/index";
import { SpaceBanner } from "@/components/layout/site/site-space-cms-content/SpaceBanner";
import { ContentSkeleton } from "./ContentSkeleton";
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
  spaceBanner?: boolean;
  spaceBannerUrl?: string;
  isWidgetMode?: boolean;
}

/**
 * Component to embed space content with full layout
 */
export function SpaceContent({ 
  siteSD, 
  spaceSlug, 
  spaceBanner, 
  spaceBannerUrl,
  isWidgetMode = false
}: SpaceContentProps) {
  // Get site data from context
  const { sites, cmsTypes } = useSiteData();
  
  // States - simplified
  const [site, setSite] = useState<any>(null);
  const [space, setSpace] = useState<Space | null>(null);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null);

  // Set up site data from context
  useEffect(() => {
    if (sites[siteSD]) {
      setSite(sites[siteSD]);
    }
  }, [siteSD, sites]);

  // Optimized handlers
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // In preview mode, just prevent default
  }, []);

  // Widget mode hover tracking
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);

  // Widget mode mouse hover handler - only for major sections
  const handleElementHover = useCallback((e: MouseEvent) => {
    if (!isWidgetMode) return;
    
    const target = e.target as HTMLElement;
    
    // Don't capture hovers on sidebar, navigation, or control elements
    const isExcludedElement = target.closest('.settings-sidebar') ||
                             target.closest('.secondary-sidebar') ||
                             target.closest('.dashboard-header') ||
                             target.closest('[data-exclude-widget]');
    
    if (isExcludedElement) {
      return;
    }
    
    // Only apply hover for preview content
    const isInPreview = target.closest('.preview-container');
    if (!isInPreview) {
      return;
    }
    
    // Find the closest major section
    const majorSection = target.closest('[data-widget-section]') ||
                         target.closest('.site-header') ||
                         target.closest('.site-sidebar') ||
                         target.closest('.featured-events') ||
                         target.closest('.categories') ||
                         target.closest('.events-container') ||
                         target.closest('.events-display') ||
                         target.closest('.site-footer');
    
    if (!majorSection) {
      return; // Not a major section, skip
    }
    
    const sectionElement = majorSection as HTMLElement;
    
    // Remove previous hover
    if (hoveredElement && hoveredElement !== sectionElement) {
      hoveredElement.classList.remove('widget-hover');
    }
    
    // Add hover to new section
    if (sectionElement !== hoveredElement) {
      sectionElement.classList.add('widget-hover');
      setHoveredElement(sectionElement);
    }
  }, [isWidgetMode, hoveredElement]);

  // Widget mode mouse leave handler
  const handleElementLeave = useCallback((e: MouseEvent) => {
    if (!isWidgetMode) return;
    
    const target = e.target as HTMLElement;
    target.classList.remove('widget-hover');
    
    if (hoveredElement === target) {
      setHoveredElement(null);
    }
  }, [isWidgetMode, hoveredElement]);

  // Widget mode element selection handler - only for major sections
  const handleElementClick = useCallback((e: MouseEvent) => {
    if (!isWidgetMode) return;
    
    const target = e.target as HTMLElement;
    
    // Don't capture clicks on sidebar, navigation, or control elements
    const isExcludedElement = target.closest('.settings-sidebar') ||
                             target.closest('.secondary-sidebar') ||
                             target.closest('.dashboard-header') ||
                             target.closest('[data-exclude-widget]');
    
    if (isExcludedElement) {
      return; // Allow normal interaction
    }
    
    // Only prevent default for preview content
    const isInPreview = target.closest('.preview-container');
    if (!isInPreview) {
      return; // Allow normal interaction outside preview
    }
    
    // Find the closest major section
    const majorSection = target.closest('[data-widget-section]') ||
                         target.closest('.site-header') ||
                         target.closest('.site-sidebar') ||
                         target.closest('.featured-events') ||
                         target.closest('.categories') ||
                         target.closest('.events-container') ||
                         target.closest('.events-display') ||
                         target.closest('.site-footer');
    
    if (!majorSection) {
      return; // Not a major section, skip
    }
    
    e.preventDefault();
    e.stopPropagation();
    
    const sectionElement = majorSection as HTMLElement;
    
    // Check if this element is already selected (toggle behavior)
    if (sectionElement.classList.contains('selected-element')) {
      // If already selected, deselect it
      sectionElement.classList.remove('selected-element');
      setSelectedElement(null);
      
      // Remove has-selection class to remove blur effect
      const previewContainer = document.querySelector('.preview-container');
      if (previewContainer) {
        previewContainer.classList.remove('has-selection');
      }
    } else {
      // Remove previous selection
      const previousSelected = document.querySelector('.selected-element');
      if (previousSelected) {
        previousSelected.classList.remove('selected-element');
      }
      
      // Add selection to new section
      sectionElement.classList.add('selected-element');
      setSelectedElement(sectionElement);
      
      // Add has-selection class to preview container for blur effect
      const previewContainer = document.querySelector('.preview-container');
      if (previewContainer) {
        previewContainer.classList.add('has-selection');
      }
    }
  }, [isWidgetMode]);

  // Add mouse event listeners for widget mode
  useEffect(() => {
    if (isWidgetMode) {
      document.addEventListener('click', handleElementClick, true);
      document.addEventListener('mouseover', handleElementHover, true);
      document.addEventListener('mouseout', handleElementLeave, true);
      
      return () => {
        document.removeEventListener('click', handleElementClick, true);
        document.removeEventListener('mouseover', handleElementHover, true);
        document.removeEventListener('mouseout', handleElementLeave, true);
      };
    } else {
      // Clear all widget mode effects when exiting
      const selectedElements = document.querySelectorAll('.selected-element');
      const hoveredElements = document.querySelectorAll('.widget-hover');
      
      selectedElements.forEach(el => el.classList.remove('selected-element'));
      hoveredElements.forEach(el => el.classList.remove('widget-hover'));
      
      // Remove has-selection class when exiting widget mode
      const previewContainer = document.querySelector('.preview-container');
      if (previewContainer) {
        previewContainer.classList.remove('has-selection');
      }
      
      setSelectedElement(null);
      setHoveredElement(null);
    }
  }, [isWidgetMode, handleElementClick, handleElementHover, handleElementLeave]);

  // Create space from content type - optimized
  useEffect(() => {
    if (!site || !spaceSlug) return;

    const createSpace = async () => {
      setIsContentLoading(true);
      setError(null);
      
      try {
        // Try to fetch real spaces from the site
        try {
          const API_BASE = getApiBaseUrl();
          const spacesResponse = await fetch(`${API_BASE}/api/v1/sites/${site.id}/spaces`);
          
          if (spacesResponse.ok) {
            const realSpaces = await spacesResponse.json();
            
            if (Array.isArray(realSpaces)) {
              const matchedSpace = realSpaces.find((s: any) => 
                s.slug?.toLowerCase() === spaceSlug.toLowerCase()
              );
              
              if (matchedSpace) {
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
          // Fall back to content type matching
        }
        
        // Try to match with content types from site data
        if (site.content_types && Array.isArray(site.content_types)) {
          let normalizedSlug = spaceSlug.toLowerCase();
          
          // Handle special mappings
          const mappings: Record<string, string> = {
            'qa': 'qa',
            'q-a': 'qa',
            'job-board': 'jobs',
            'jobboard': 'jobs',
            'ideas-wishlist': 'wishlist',
            'knowledge-base': 'knowledge'
          };
          
          normalizedSlug = mappings[normalizedSlug] || normalizedSlug;
          
          const matchedType = site.content_types.find((type: any) => {
            const nameMatch = type.name?.toLowerCase() === normalizedSlug;
            const cleanNameMatch = type.name?.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedSlug.replace(/[^a-z0-9]/g, '');
            return nameMatch || cleanNameMatch;
          });
          
          if (matchedType) {
            setSpace({
              id: `simulated-${matchedType.name}`,
              name: matchedType.label || matchedType.name.charAt(0).toUpperCase() + matchedType.name.slice(1),
              slug: spaceSlug,
              description: matchedType.description || `${matchedType.label || matchedType.name} space for the community`,
              cms_type: matchedType.name,
              hidden: false,
              visibility: 'public',
              site_id: site.id
            });
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
          return;
        }
        
        // Final fallback: create demo space
        const defaultName = spaceSlug.charAt(0).toUpperCase() + spaceSlug.slice(1);
        
        const nameMap: Record<string, string> = {
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
        
      } catch (err) {
        setError('Failed to create space');
      } finally {
        setTimeout(() => {
          setIsContentLoading(false);
        }, 300);
      }
    };

    createSpace();
  }, [site, spaceSlug, cmsTypes]);

  // Performance optimization: Render the footer outside the AnimatePresence
  const renderFooter = useCallback(() => (
    <footer className="site-footer bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-4 mt-auto" data-section-name="Site Footer">
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

  // Early return if no site data
  if (!site) {
    return null;
  }

  // Styles are now in index.css

  // Layout with conditional widget mode
  return (
    <div className={`pb-8 flex flex-col bg-gray-50 dark:bg-gray-900 preview-container ${isWidgetMode ? 'widget-mode' : ''}`}>
      

      {/* Site Header - sticky */}
      <div className="site-header sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800" data-section-name="Site Header">
        <SiteHeader 
          siteSD={siteSD}
          site={site}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0">
        <div className="container mx-auto px-4 h-full">
          <div className="flex flex-col md:flex-row gap-6 h-full">
            {/* Sidebar - sticky */}
            <div className="site-sidebar md:sticky md:top-6 md:self-start" data-section-name="Site Sidebar">
              <SiteSidebar siteSD={siteSD} activePage={spaceSlug} />
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
                    <ContentSkeleton />
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center"
                  >
                    <p className="text-red-500">{error}</p>
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
                      <AnimatePresence mode="wait">
                        <SpaceBanner 
                          key="space-banner"
                          show={spaceBanner} 
                          bannerUrl={spaceBannerUrl} 
                          spaceName={space.name} 
                        />
                      </AnimatePresence>
                    ) : (
                      <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {space.name}
                        </h1>
                        {space.description && (
                          <p className="text-gray-600 dark:text-gray-400">{space.description}</p>
                        )}
                      </div>
                    )}
                    
                    {/* Main Content */}
                    <SpaceCmsContent 
                      siteSD={siteSD}
                      space={space}
                      site={site}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center"
                  >
                    <p className="text-gray-600 dark:text-gray-400">
                      No content available for this space.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {renderFooter()}
    </div>
  );
} 