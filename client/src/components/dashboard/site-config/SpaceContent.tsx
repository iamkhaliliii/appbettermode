import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteHeader } from "@/components/layout/site/site-header";
import { SiteSidebar } from "@/components/layout/site/site-sidebar";
import { SpaceCmsContent } from "@/components/layout/site/site-space-cms-content/index";
import { SpaceBanner } from "@/components/layout/site/site-space-cms-content/SpaceBanner";
import { ContentSkeleton } from "./ContentSkeleton";
import { useSiteData } from "@/lib/SiteDataContext";
import { getApiBaseUrl } from "@/lib/utils";
import { WidgetDropZone } from './widgets/WidgetDropZone';
import { AvailableWidget } from './widgets/types';
import { FeaturedEventWidget } from '@/components/features/events/FeaturedEventWidget';
import { GeneralWidgetPopover } from './widgets/GeneralWidgetPopover';

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
  isAddWidgetMode?: boolean;
  eventsLayout?: string;
  cardSize?: string;
  cardStyle?: string;
}

interface DroppedWidget {
  id: string;
  widget: AvailableWidget;
  position: { x: number; y: number };
  timestamp: number;
}

/**
 * Component to embed space content with full layout
 */
export function SpaceContent({ 
  siteSD, 
  spaceSlug, 
  spaceBanner, 
  spaceBannerUrl,
  isWidgetMode = false,
  isAddWidgetMode = false,
  eventsLayout = 'card',
  cardSize = 'medium',
  cardStyle = 'modern'
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

  // State for dropped widgets
  const [droppedWidgets, setDroppedWidgets] = useState<DroppedWidget[]>([]);

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
    
    // Don't capture hovers on sidebar, navigation, control elements, or popover
    const isExcludedElement = target.closest('.settings-sidebar') ||
                             target.closest('.secondary-sidebar') ||
                             target.closest('.dashboard-header') ||
                             target.closest('.general-widget-popover') ||
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
    
    // Don't capture clicks on sidebar, navigation, control elements, or popover
    const isExcludedElement = target.closest('.settings-sidebar') ||
                             target.closest('.secondary-sidebar') ||
                             target.closest('.dashboard-header') ||
                             target.closest('.general-widget-popover') ||
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
  const renderFooter = useCallback(() => {
    const footerContent = (
      <footer className="site-footer bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-4 mt-auto" 
              data-section-name="Site Footer">
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
    );

    return isWidgetMode ? (
      <GeneralWidgetPopover 
        widgetName="Site Footer"
        isSelected={!!selectedElement && selectedElement.closest('.site-footer') !== null}
      >
        {footerContent}
      </GeneralWidgetPopover>
    ) : (
      footerContent
    );
  }, [site, isWidgetMode, selectedElement]);

  // Widget drop handler
  const handleWidgetDrop = useCallback((widget: AvailableWidget, position: { x: number; y: number }) => {
    console.log('Widget dropped:', widget, 'at position:', position);
    
    // Create new dropped widget
    const newWidget: DroppedWidget = {
      id: `dropped-${widget.id}-${Date.now()}`,
      widget,
      position,
      timestamp: Date.now()
    };
    
    // Add to dropped widgets state
    setDroppedWidgets(prev => [...prev, newWidget]);
    
    // Show success notification
    console.log(`Added ${widget.name} widget to the page!`);
  }, []);

  // Render dropped widget component
  const renderDroppedWidget = useCallback((droppedWidget: DroppedWidget) => {
    const { widget, position } = droppedWidget;
    
    switch (widget.id) {
      case 'upcoming-events':
      case 'upcoming-events-trending':
        return (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {widget.name}
            </h3>
            <FeaturedEventWidget isDashboard={false} />
          </div>
        );
      
      case 'featured-events':
        return (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Featured Events
            </h3>
            <FeaturedEventWidget isDashboard={false} />
          </div>
        );
      
      case 'hero-banner':
      case 'hero-banner-trending':
        return (
          <div className="mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
              <h2 className="text-3xl font-bold mb-4">Welcome to Our Community</h2>
              <p className="text-lg opacity-90 mb-6">Discover amazing events and connect with like-minded people.</p>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Started
              </button>
            </div>
          </div>
        );
      
      case 'calendar':
        return (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Event Calendar
            </h3>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-7 gap-2 text-center">
                <div className="font-semibold text-gray-500 dark:text-gray-400 p-2">Sun</div>
                <div className="font-semibold text-gray-500 dark:text-gray-400 p-2">Mon</div>
                <div className="font-semibold text-gray-500 dark:text-gray-400 p-2">Tue</div>
                <div className="font-semibold text-gray-500 dark:text-gray-400 p-2">Wed</div>
                <div className="font-semibold text-gray-500 dark:text-gray-400 p-2">Thu</div>
                <div className="font-semibold text-gray-500 dark:text-gray-400 p-2">Fri</div>
                <div className="font-semibold text-gray-500 dark:text-gray-400 p-2">Sat</div>
                {Array.from({ length: 35 }, (_, i) => (
                  <div key={i} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                    {i + 1 <= 31 ? i + 1 : ''}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'title':
        return (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Your Custom Title
            </h2>
          </div>
        );
      
      case 'image':
        return (
          <div className="mb-6">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop&auto=format&q=80"
              alt="Sample Image"
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        );
      
      case 'video':
        return (
          <div className="mb-6">
            <div className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-800 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-lg font-semibold">Sample Video</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'button':
        return (
          <div className="mb-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              Click Me
            </button>
          </div>
        );

      default:
        return (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              {widget.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {widget.description || 'This widget will be implemented soon.'}
            </p>
          </div>
        );
    }
  }, []);

  // Early return if no site data
  if (!site) {
    return null;
  }

  // Styles are now in index.css

  // Layout with conditional widget mode
  return (
    <WidgetDropZone 
      onDrop={handleWidgetDrop} 
      isAddWidgetMode={isAddWidgetMode}
      className={`pb-8 flex flex-col bg-gray-50 dark:bg-gray-900 preview-container ${isWidgetMode ? 'widget-mode' : ''}`}
    >
      

        {/* Site Header - sticky */}
        {isWidgetMode ? (
          <GeneralWidgetPopover 
            widgetName="Site Header"
            isSelected={!!selectedElement && selectedElement.closest('.site-header') !== null}
            position="bottom"
          >
            <div className="site-header sticky top-0 z-[100] bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800" 
                 data-section-name="Site Header">
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
          </GeneralWidgetPopover>
        ) : (
          <div className="site-header sticky top-0 z-[100] bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800" 
               data-section-name="Site Header">
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
        )}

        {/* Main Content */}
        <div className="flex-1 min-h-0">
          <div className="container mx-auto px-4 h-full">
            <div className="flex flex-col md:flex-row gap-6 h-full">
              {/* Sidebar - sticky */}
              {isWidgetMode ? (
                <GeneralWidgetPopover 
                  widgetName="Site Sidebar"
                  isSelected={!!selectedElement && selectedElement.closest('.site-sidebar') !== null}
                >
                  <div className="site-sidebar md:sticky md:top-6 md:self-start" 
                       data-section-name="Site Sidebar">
                    <SiteSidebar siteSD={siteSD} activePage={spaceSlug} />
                  </div>
                </GeneralWidgetPopover>
              ) : (
                <div className="site-sidebar md:sticky md:top-6 md:self-start" 
                     data-section-name="Site Sidebar">
                  <SiteSidebar siteSD={siteSD} activePage={spaceSlug} />
                </div>
              )}

              {/* Main content area */}
              <div className="flex-1 p-4 md:p-6">
                {/* Dropped Widgets - Show above main content */}
                {droppedWidgets.length > 0 && (
                  <div className="mb-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Added Widgets ({droppedWidgets.length})
                      </h3>
                      <button 
                        onClick={() => setDroppedWidgets([])}
                        className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {droppedWidgets.map((droppedWidget) => (
                        <div 
                          key={droppedWidget.id}
                          className="relative group border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50/50 dark:bg-blue-900/20"
                        >
                          {/* Remove button */}
                          <button
                            onClick={() => setDroppedWidgets(prev => prev.filter(w => w.id !== droppedWidget.id))}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                          
                          {renderDroppedWidget(droppedWidget)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                      eventsLayout={eventsLayout}
                      cardSize={cardSize}
                      cardStyle={cardStyle}
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
      </WidgetDropZone>
  );
} 