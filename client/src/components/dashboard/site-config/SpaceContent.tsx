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
import { EventContent } from '@/components/layout/site/site-space-cms-content/event';

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
  spaceHeaderSettings?: any;
  onSectionSettings?: (sectionName: string) => void;
}

interface DroppedWidget {
  id: string;
  widget: AvailableWidget;
  position: { x: number; y: number };
  timestamp: number;
  isHidden?: boolean;
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
  cardStyle = 'modern',
  spaceHeaderSettings,
  onSectionSettings
}: SpaceContentProps) {
  // console.log('🔄 SpaceContent: Received spaceHeaderSettings prop:', spaceHeaderSettings);
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

  // New drag state management
  const [isDraggingWidget, setIsDraggingWidget] = useState(false);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);
  const [insertionPoint, setInsertionPoint] = useState<{ sectionId: string; position: 'before' | 'after' } | null>(null);

  // Section visibility state
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>({
    header: true,
    sidebar: true,
    footer: true,
    spaceBanner: true,
    spaceHeader: true,
    mainContent: true
  });

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

  // Global drag state detection
  useEffect(() => {
    const handleDragStart = (e: DragEvent) => {
      // Check if we're dragging a widget
      const dragData = e.dataTransfer?.types.includes('application/json');
      if (dragData && isAddWidgetMode) {
        setIsDraggingWidget(true);
      }
    };

    const handleDragEnd = () => {
      setIsDraggingWidget(false);
      setDragOverSection(null);
      setInsertionPoint(null);
      // Remove all drag classes
      document.querySelectorAll('.drag-over-section').forEach(el => {
        el.classList.remove('drag-over-section');
      });
      document.querySelectorAll('.widget-insertion-indicator').forEach(el => {
        el.remove();
      });
    };

    if (isAddWidgetMode) {
      document.addEventListener('dragstart', handleDragStart);
      document.addEventListener('dragend', handleDragEnd);
      document.addEventListener('drop', handleDragEnd);
    }

    return () => {
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('dragend', handleDragEnd);
      document.removeEventListener('drop', handleDragEnd);
    };
  }, [isAddWidgetMode]);

  // Handle section drag over
  const handleSectionDragOver = useCallback((e: DragEvent, sectionId: string) => {
    if (!isDraggingWidget || !isAddWidgetMode) return;

    e.preventDefault();
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const y = e.clientY - rect.top;
    const isTopHalf = y < rect.height / 2;
    
    // Determine insertion point
    const insertPoint = isTopHalf ? `before-${sectionId}` : `after-${sectionId}`;
    const newInsertionPoint = { sectionId, position: isTopHalf ? 'before' : 'after' as 'before' | 'after' };
    
    if (!insertionPoint || 
        insertionPoint.sectionId !== sectionId || 
        insertionPoint.position !== (isTopHalf ? 'before' : 'after')) {
      setInsertionPoint(newInsertionPoint);
      
      // Remove previous indicators
      document.querySelectorAll('.widget-insertion-indicator').forEach(el => el.remove());
      
      // Add insertion indicator
      const section = e.currentTarget as HTMLElement;
      const indicator = document.createElement('div');
      indicator.className = 'widget-insertion-indicator';
      
      if (isTopHalf) {
        section.parentNode?.insertBefore(indicator, section);
      } else {
        section.parentNode?.insertBefore(indicator, section.nextSibling);
      }
      
      // Move section down if hovering over it
      if (dragOverSection !== sectionId) {
        // Remove previous drag over class
        document.querySelectorAll('.drag-over-section').forEach(el => {
          el.classList.remove('drag-over-section');
        });
        
        // Add to current section
        section.classList.add('drag-over-section');
        setDragOverSection(sectionId);
      }
    }
  }, [isDraggingWidget, isAddWidgetMode, insertionPoint, dragOverSection]);

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

  // Toggle section visibility
  const toggleSectionVisibility = useCallback((sectionName: string) => {
    setSectionVisibility(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  }, []);

  // Section action callbacks
  const handleSectionSettings = useCallback((sectionName: string) => {
    // Reduced debug logging to prevent spam
    // console.log('SpaceContent handleSectionSettings called with:', sectionName);
    // console.log('onSectionSettings prop:', onSectionSettings);
    if (onSectionSettings) {
      onSectionSettings(sectionName);
    } else {
      // console.log(`Opening settings for ${sectionName}`);
    }
  }, [onSectionSettings]);

  const handleSectionDelete = useCallback((sectionName: string) => {
    console.log(`Removing ${sectionName} section`);
    setSectionVisibility(prev => ({
      ...prev,
      [sectionName]: false
    }));
  }, []);

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
        widgetType="section"
        isSelected={!!selectedElement && selectedElement.closest('.site-footer') !== null}
        isHidden={!sectionVisibility.footer}
        onSettings={() => handleSectionSettings('footer')}
        onToggleVisibility={() => toggleSectionVisibility('footer')}
        onDelete={() => handleSectionDelete('footer')}
        isWidgetMode={isWidgetMode}
      >
        {footerContent}
      </GeneralWidgetPopover>
    ) : (
      footerContent
    );
  }, [site, isWidgetMode, selectedElement, sectionVisibility, handleSectionSettings, toggleSectionVisibility, handleSectionDelete]);

  // Widget drop handler - simple version
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
    
    // Clear any drag states
    setInsertionPoint(null);
    setDragOverSection(null);
    
    // Clean up any insertion indicators
    document.querySelectorAll('.widget-insertion-indicator').forEach(el => el.remove());
    document.querySelectorAll('.drag-over-section').forEach(el => {
      el.classList.remove('drag-over-section');
    });
    
    // Show success notification
    console.log(`Added ${widget.name} widget to the page!`);
  }, []);

  // Toggle widget visibility
  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    setDroppedWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, isHidden: !widget.isHidden }
          : widget
      )
    );
  }, []);

  // Render dropped widget component - simple version
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
      
      case 'logo':
        return (
          <div className="mb-6">
            <div className="flex items-center justify-center p-4">
              <div className="w-32 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">LOGO</span>
              </div>
            </div>
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

      case 'accordions':
        return (
          <div className="mb-6">
            <div className="space-y-2">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <button className="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <span className="font-medium text-gray-900 dark:text-white">Accordion Item 1</span>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="px-4 py-3 text-gray-600 dark:text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700">
                  This is the content for the first accordion item. You can add any content here.
                </div>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <button className="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <span className="font-medium text-gray-900 dark:text-white">Accordion Item 2</span>
                  <svg className="w-5 h-5 text-gray-500 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <button className="w-full px-4 py-3 text-left bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <span className="font-medium text-gray-900 dark:text-white">Accordion Item 3</span>
                  <svg className="w-5 h-5 text-gray-500 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );

      case 'members-list':
        return (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Community Members
            </h3>
            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium text-sm">U{i}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        User {i}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        Member since Jan 2024
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                      Active
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.floor(Math.random() * 100)} posts
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Show More Button */}
            <div className="mt-4 text-center">
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                Show more members
              </button>
            </div>
          </div>
        );

      case 'spaces-list':
        return (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Available Spaces
            </h3>
            {/* Responsive Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[
                { name: 'General Discussion', posts: 45, members: 128, color: 'bg-blue-500' },
                { name: 'Events', posts: 23, members: 85, color: 'bg-purple-500' },
                { name: 'Announcements', posts: 12, members: 156, color: 'bg-green-500' },
                { name: 'Q&A', posts: 67, members: 94, color: 'bg-orange-500' },
                { name: 'Resources', posts: 34, members: 112, color: 'bg-red-500' },
                { name: 'Feedback', posts: 19, members: 73, color: 'bg-indigo-500' },
                { name: 'Help & Support', posts: 28, members: 67, color: 'bg-teal-500' },
                { name: 'Ideas & Suggestions', posts: 41, members: 89, color: 'bg-pink-500' }
              ].map((space, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 ${space.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-medium text-sm">
                        {space.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {space.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        Community space
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span>{space.posts} posts</span>
                    <span>{space.members} members</span>
                  </div>
                  <button className="w-full px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                    Join Space
                  </button>
                </div>
              ))}
            </div>
            {/* Show More Button */}
            <div className="mt-4 text-center">
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                Show more spaces
              </button>
            </div>
          </div>
        );

      case 'space-header':
        // Use settings to determine visibility and content
        const settings = spaceHeaderSettings || {};
        console.log('🔄 SpaceContent: Rendering space-header with settings:', settings);
        const showIcon = settings.showIcon !== false;
        const showTitle = settings.showTitle !== false;
        const showDescription = settings.showDescription !== false;
        const showStats = settings.showStats !== false;
        const showActions = settings.showActions !== false;
        const showJoin = settings.showJoin !== false;
        const showMembers = settings.showMembers !== false;
        const selectedStyle = settings.selectedStyle || 'simple';
        const backgroundFile = settings.backgroundFile || '';
        
        // Style variations
        const getHeaderStyle = () => {
          switch (selectedStyle) {
            case 'colorstyle':
              return 'bg-blue-600 text-white rounded-lg p-6';
            case 'imagestyle':
              return backgroundFile 
                ? `bg-cover bg-center bg-no-repeat text-white relative rounded-lg p-6`
                : 'bg-blue-600 text-white rounded-lg p-6';
            case 'videostyle':
              return 'bg-gray-900 text-white relative overflow-hidden rounded-lg p-6';
            case 'patternstyle':
              return 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white relative rounded-lg p-6';
            case 'gradientstyle':
              return backgroundFile 
                ? `text-white relative rounded-lg p-6`
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6';
            case 'minimal':
              return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg p-6';
            default: // simple
              return 'text-gray-900 dark:text-white'; // No background, no padding
          }
        };
        
        const getTextColor = () => {
          return selectedStyle === 'colorstyle' || selectedStyle === 'imagestyle' || selectedStyle === 'videostyle' || selectedStyle === 'gradientstyle'
            ? 'text-white' 
            : 'text-gray-900 dark:text-white';
        };
        
        const getSubtextColor = () => {
          return selectedStyle === 'colorstyle' || selectedStyle === 'imagestyle' || selectedStyle === 'videostyle' || selectedStyle === 'gradientstyle'
            ? 'text-white/80' 
            : 'text-gray-600 dark:text-gray-400';
        };
        
        return (
          <div className="mb-6">
            <div className={`${getHeaderStyle()} transition-all duration-300 ease-in-out`} style={
              selectedStyle === 'imagestyle' && backgroundFile 
                ? { backgroundImage: `url(${backgroundFile})` }
                : selectedStyle === 'gradientstyle' && backgroundFile 
                  ? { background: backgroundFile }
                  : {}
            }>
              {/* Background overlay for better text readability */}
              {(selectedStyle === 'imagestyle' || selectedStyle === 'videostyle') && (
                <div className="absolute inset-0 bg-black/30 rounded-lg transition-opacity duration-300 ease-in-out"></div>
              )}
              
              {/* Video background */}
              {selectedStyle === 'videostyle' && backgroundFile && (
                <video 
                  className="absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-300 ease-in-out"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                >
                  <source src={backgroundFile} type="video/mp4" />
                </video>
              )}
              
              {/* Pattern background */}
              {selectedStyle === 'patternstyle' && (
                <div className="absolute inset-0 opacity-10 transition-opacity duration-300 ease-in-out">
                  <div className="w-full h-full bg-repeat transition-opacity duration-300 ease-in-out" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #333 2px, transparent 2px)`,
                    backgroundSize: '20px 20px'
                  }}></div>
                </div>
              )}
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {showIcon && (
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out ${
                      selectedStyle === 'colorstyle' || selectedStyle === 'imagestyle' || selectedStyle === 'videostyle' || selectedStyle === 'gradientstyle'
                        ? 'bg-white/20' 
                        : selectedStyle === 'simple' 
                          ? 'bg-gray-100 dark:bg-gray-800'
                          : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      <span className={`text-lg font-bold transition-colors duration-300 ease-in-out ${getTextColor()}`}>B</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {showTitle && (
                        <h1 className={`text-2xl font-bold transition-colors duration-300 ease-in-out ${getTextColor()}`}>
                          Bettermode community
                        </h1>
                      )}
                      {/* User avatars - controlled by showMembers */}
                      {showMembers && (
                        <div className="flex items-center -space-x-1">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">A</span>
                          </div>
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-teal-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">B</span>
                          </div>
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">C</span>
                          </div>
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">D</span>
                          </div>
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">E</span>
                          </div>
                          <div className="w-7 h-7 rounded-full bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">+5</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {showDescription && (
                      <p className={`text-sm mb-2 transition-colors duration-300 ease-in-out ${
                        selectedStyle === 'colorstyle' || selectedStyle === 'imagestyle' || selectedStyle === 'videostyle' || selectedStyle === 'gradientstyle'
                          ? 'text-white/80' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        Welcome to the "Ask the Community" channel!
                      </p>
                    )}
                    {showStats && (
                      <div className={`flex items-center gap-4 text-xs transition-colors duration-300 ease-in-out ${
                        selectedStyle === 'colorstyle' || selectedStyle === 'imagestyle' || selectedStyle === 'videostyle' || selectedStyle === 'gradientstyle'
                          ? 'text-white/60' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>4</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>4</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>created 3 months ago</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {showActions && (
                  <div className="flex items-center gap-2">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-in-out">
                      Add Post
                    </button>
                    {showJoin && (
                      <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out">
                        Joined
                      </button>
                    )}
                    <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                    <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        );

      case 'canvas':
        return (
          <div className="mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Canvas Content
              </h3>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  This is a rich content canvas where you can add formatted text, images, videos, polls, and more using the BlockNote editor.
                </p>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border-l-4 border-blue-500">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sample Rich Content</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Content created with the Canvas widget supports rich formatting, including:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                    <li>Bold and italic text</li>
                    <li>Headers and lists</li>
                    <li>Images and videos</li>
                    <li>Interactive polls</li>
                    <li>Code blocks and more</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 'menu':
        return (
          <div className="mb-6">
            <nav className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <ul className="flex space-x-6">
                <li><a href="#" className="text-gray-900 dark:text-white hover:text-blue-600 transition-colors font-medium">Home</a></li>
                <li><a href="#" className="text-gray-900 dark:text-white hover:text-blue-600 transition-colors font-medium">About</a></li>
                <li><a href="#" className="text-gray-900 dark:text-white hover:text-blue-600 transition-colors font-medium">Services</a></li>
                <li><a href="#" className="text-gray-900 dark:text-white hover:text-blue-600 transition-colors font-medium">Contact</a></li>
              </ul>
            </nav>
          </div>
        );

      case 'hero-banner-advance':
        return (
          <div className="mb-6">
            <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative p-12 text-center">
                <h1 className="text-4xl font-bold mb-4">Advanced Hero Banner</h1>
                <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                  Create stunning hero sections with advanced customization options, background media, and powerful call-to-action buttons.
                </p>
                <div className="flex justify-center gap-4">
                  <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Get Started
                  </button>
                  <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'announcement-banner':
        return (
          <div className="mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 text-blue-600 dark:text-blue-400">
                    <svg fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 15a1 1 0 110-2 1 1 0 010 2zm1-4h-2V7h2v6z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-blue-900 dark:text-blue-100 font-medium">
                      Important announcement: New features are now available!
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium">
                    Learn More
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.3 5.71a.996.996 0 00-1.41 0L12 10.59 7.11 5.7A.996.996 0 105.7 7.11L10.59 12 5.7 16.89a.996.996 0 101.41 1.41L12 13.41l4.89 4.89a.996.996 0 101.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'html-script':
        return (
          <div className="mb-6">
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm">
              <div className="mb-2 text-gray-400">// Custom HTML/JavaScript Widget</div>
              <div>&lt;<span className="text-blue-400">div</span> <span className="text-yellow-400">class</span>=<span className="text-green-300">"custom-widget"</span>&gt;</div>
              <div className="ml-4">&lt;<span className="text-blue-400">h3</span>&gt;Custom Script Output&lt;/<span className="text-blue-400">h3</span>&gt;</div>
              <div className="ml-4">&lt;<span className="text-blue-400">p</span>&gt;This widget can execute custom HTML, CSS, and JavaScript code.&lt;/<span className="text-blue-400">p</span>&gt;</div>
              <div>&lt;/<span className="text-blue-400">div</span>&gt;</div>
              <div className="mt-4 p-3 bg-gray-800 rounded border border-yellow-500">
                <div className="text-yellow-400 text-xs mb-1">⚠️ Security Notice</div>
                <div className="text-gray-300 text-xs">Always use trusted code sources</div>
              </div>
            </div>
          </div>
        );

      case 'iframe':
        return (
          <div className="mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                    https://example.com
                  </div>
                </div>
              </div>
              <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1 16v-5.5a.5.5 0 00-.5-.5h-3a.5.5 0 00-.5.5V18H5V6h2v5.5a.5.5 0 00.5.5h3a.5.5 0 00.5-.5V6h2v12h-2z"/>
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-semibold">Embedded Content</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">External website iframe</p>
                </div>
              </div>
            </div>
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
    <div className={`pb-8 flex flex-col bg-gray-50 dark:bg-gray-900 preview-container ${isWidgetMode ? 'widget-mode' : ''} ${isAddWidgetMode ? 'add-widget-mode' : ''} ${isDraggingWidget ? 'widget-dragging' : ''}`}>
        {/* Site Header - sticky */}
        {isWidgetMode ? (
          <GeneralWidgetPopover 
            widgetName="Site Header"
            widgetType="section"
            isSelected={!!selectedElement && selectedElement.closest('.site-header') !== null}
            position="bottom"
            isHidden={!sectionVisibility.header}
            onSettings={() => handleSectionSettings('header')}
            onToggleVisibility={() => toggleSectionVisibility('header')}
            onDelete={() => handleSectionDelete('header')}
            isWidgetMode={isWidgetMode}
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
                  widgetType="section"
                  isSelected={!!selectedElement && selectedElement.closest('.site-sidebar') !== null}
                  isHidden={!sectionVisibility.sidebar}
                  onSettings={() => handleSectionSettings('sidebar')}
                  onToggleVisibility={() => toggleSectionVisibility('sidebar')}
                  onDelete={() => handleSectionDelete('sidebar')}
                  isWidgetMode={isWidgetMode}
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

              {/* Main content area - Only this part should be the drop zone */}
              <WidgetDropZone 
                onDrop={handleWidgetDrop} 
                isAddWidgetMode={isAddWidgetMode}
                className="flex-1 p-4 md:p-6"
              >
                {/* Dropped Widgets - Show above main content */}
                {droppedWidgets.length > 0 && (
                  <div 
                    className="mb-6 space-y-4"
                    data-section-id="dropped-widgets"
                    onDragOver={isDraggingWidget ? (e) => handleSectionDragOver(e as any, 'dropped-widgets') : undefined}
                  >
                    <div className="space-y-4">
                      {droppedWidgets
                        .filter(droppedWidget => {
                          // Don't show space header widget if space banner is active
                          if (droppedWidget.widget.id === 'space-header' && spaceBanner) {
                            return false;
                          }
                          return true;
                        })
                        .map((droppedWidget, index) => (
                        <GeneralWidgetPopover
                          key={droppedWidget.id}
                          widgetName={droppedWidget.widget.name}
                          widgetType="widget"
                          isHidden={droppedWidget.isHidden}
                          onSettings={() => {
                            // Map widget names to section names for settings
                            const widgetToSectionMap: Record<string, string> = {
                              'Upcoming Events': 'featured-events',
                              'Featured Events': 'featured-events', 
                              'Hero Banner': 'hero-banner',
                              'Event Calendar': 'calendar',
                              'Calendar': 'calendar',
                              // Content Widgets
                              'Members List': 'members-list',
                              'Spaces List': 'spaces-list',
                              // Basic Widgets - use their IDs directly
                              'Title': 'title',
                              'Logo': 'logo',
                              'Image': 'image',
                              'Video': 'video',
                              'Button': 'button',
                              'Accordions': 'accordions'
                            };
                            const sectionName = widgetToSectionMap[droppedWidget.widget.name] || droppedWidget.widget.name.toLowerCase().replace(/\s+/g, '-');
                            handleSectionSettings(sectionName);
                          }}
                          onToggleVisibility={() => toggleWidgetVisibility(droppedWidget.id)}
                          onDelete={() => setDroppedWidgets(prev => prev.filter(w => w.id !== droppedWidget.id))}
                          isWidgetMode={isWidgetMode}
                        >
                          <div 
                            className="relative group border border-orange-200 dark:border-orange-800 rounded-lg p-4 transition-all bg-orange-50/50 dark:bg-orange-900/20"
                            data-section-id={`widget-${index}`}
                            onDragOver={isDraggingWidget ? (e) => handleSectionDragOver(e as any, `widget-${index}`) : undefined}
                          >
                            {/* Widget Content */}
                            {renderDroppedWidget(droppedWidget)}
                          </div>
                        </GeneralWidgetPopover>
                      ))}
                    </div>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {isContentLoading && (
                    <motion.div
                      key="skeleton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
                      data-section-id="loading"
                      onDragOver={isDraggingWidget ? (e) => handleSectionDragOver(e as any, 'loading') : undefined}
                    >
                      <ContentSkeleton />
                    </motion.div>
                  )}
                  {!isContentLoading && error && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center"
                      data-section-id="error"
                      onDragOver={isDraggingWidget ? (e) => handleSectionDragOver(e as any, 'error') : undefined}
                    >
                      <p className="text-red-500">{error}</p>
                    </motion.div>
                  )}
                  {!isContentLoading && !error && space && (
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
                        isWidgetMode ? (
                          <GeneralWidgetPopover 
                            widgetName="Space Banner"
                            widgetType="main"
                            isSelected={!!selectedElement && selectedElement.closest('[data-section-id="space-banner"]') !== null}
                            isHidden={!sectionVisibility.spaceBanner}
                            onSettings={() => handleSectionSettings('spaceBanner')}
                            onToggleVisibility={() => toggleSectionVisibility('spaceBanner')}
                            onDelete={() => handleSectionDelete('spaceBanner')}
                            isWidgetMode={isWidgetMode}
                          >
                            <div 
                              data-section-id="space-banner"
                              onDragOver={isDraggingWidget ? (e) => handleSectionDragOver(e as any, 'space-banner') : undefined}
                            >
                              <SpaceBanner 
                                show={spaceBanner} 
                                bannerUrl={spaceBannerUrl} 
                                spaceName={space.name} 
                              />
                            </div>
                          </GeneralWidgetPopover>
                        ) : (
                          <div 
                            data-section-id="space-banner"
                            onDragOver={isDraggingWidget ? (e) => handleSectionDragOver(e as any, 'space-banner') : undefined}
                          >
                            <SpaceBanner 
                              show={spaceBanner} 
                              bannerUrl={spaceBannerUrl} 
                              spaceName={space.name} 
                            />
                          </div>
                        )
                      ) : (
                        // Only render default space header if no space header widget is dropped
                        !droppedWidgets.some(w => w.widget.id === 'space-header') && (
                          isWidgetMode ? (
                            <GeneralWidgetPopover 
                              widgetName="Space Header"
                              widgetType="main"
                              isSelected={!!selectedElement && selectedElement.closest('[data-section-id="space-header"]') !== null}
                              isHidden={!sectionVisibility.spaceHeader}
                              onSettings={() => handleSectionSettings('spaceHeader')}
                              onToggleVisibility={() => toggleSectionVisibility('spaceHeader')}
                              onDelete={() => handleSectionDelete('spaceHeader')}
                              isWidgetMode={isWidgetMode}
                            >
                              <div 
                                className="mb-6"
                                data-section-id="space-header"
                                onDragOver={isDraggingWidget ? (e) => handleSectionDragOver(e as any, 'space-header') : undefined}
                              >
                                {/* Render space header using the dynamic space-header widget */}
                                {(() => {
                            // Use settings to determine visibility and content
                            const settings = spaceHeaderSettings || {};
                            // console.log('🔄 SpaceContent: Rendering default space-header with settings:', settings);
                            const showIcon = settings.showIcon !== false;
                            const showTitle = settings.showTitle !== false;
                            const showDescription = settings.showDescription !== false;
                            const showStats = settings.showStats !== false;
                            const showActions = settings.showActions !== false;
                            const showJoin = settings.showJoin !== false;
                            const showMembers = settings.showMembers !== false;
                            const selectedStyle = settings.selectedStyle || 'simple';
                            const backgroundFile = settings.backgroundFile || '';
                            
                            // Style variations
                            const getHeaderStyle = () => {
                              switch (selectedStyle) {
                                case 'colorstyle':
                                  return 'bg-blue-600 text-white rounded-lg p-6';
                                case 'imagestyle':
                                  return backgroundFile 
                                    ? `bg-cover bg-center bg-no-repeat text-white relative rounded-lg p-6`
                                    : 'bg-blue-600 text-white rounded-lg p-6';
                                case 'videostyle':
                                  return 'bg-gray-900 text-white relative overflow-hidden rounded-lg p-6';
                                case 'patternstyle':
                                  return 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white relative rounded-lg p-6';
                                case 'gradientstyle':
                                  return backgroundFile 
                                    ? `text-white relative rounded-lg p-6`
                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-6';
                                case 'minimal':
                                  return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg p-6';
                                default: // simple
                                  return 'text-gray-900 dark:text-white'; // No background, no padding
                              }
                            };
                            
                            const getTextColor = () => {
                              return selectedStyle === 'colorstyle' || selectedStyle === 'imagestyle' || selectedStyle === 'videostyle' || selectedStyle === 'gradientstyle'
                                ? 'text-white' 
                                : 'text-gray-900 dark:text-white';
                            };
                            
                            const getSubtextColor = () => {
                              return selectedStyle === 'colorstyle' || selectedStyle === 'imagestyle' || selectedStyle === 'videostyle' || selectedStyle === 'gradientstyle'
                                ? 'text-white/80' 
                                : 'text-gray-600 dark:text-gray-400';
                            };
                            
                            return (
                                                          <div className={`${getHeaderStyle()} transition-all duration-300 ease-in-out`} style={
                              selectedStyle === 'imagestyle' && backgroundFile 
                                ? { backgroundImage: `url(${backgroundFile})` }
                                : selectedStyle === 'gradientstyle' && backgroundFile 
                                  ? { background: backgroundFile }
                                  : {}
                            }>
                                {/* Background overlay for better text readability */}
                                {(selectedStyle === 'imagestyle' || selectedStyle === 'videostyle') && (
                                  <div className="absolute inset-0 bg-black/30 rounded-lg transition-opacity duration-300 ease-in-out"></div>
                                )}
                                
                                {/* Video background */}
                                {selectedStyle === 'videostyle' && backgroundFile && (
                                  <video 
                                    className="absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-300 ease-in-out"
                                    autoPlay 
                                    loop 
                                    muted 
                                    playsInline
                                  >
                                    <source src={backgroundFile} type="video/mp4" />
                                  </video>
                                )}
                                
                                {/* Pattern background */}
                                {selectedStyle === 'patternstyle' && (
                                  <div className="absolute inset-0 opacity-10 transition-opacity duration-300 ease-in-out">
                                    <div className="w-full h-full bg-repeat transition-opacity duration-300 ease-in-out" style={{
                                      backgroundImage: `radial-gradient(circle at 25% 25%, #333 2px, transparent 2px)`,
                                      backgroundSize: '20px 20px'
                                    }}></div>
                                  </div>
                                )}
                                
                                <div className="relative z-10 flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    {showIcon && (
                                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out ${
                                        selectedStyle === 'colorstyle' || selectedStyle === 'imagestyle' || selectedStyle === 'videostyle' || selectedStyle === 'gradientstyle'
                                          ? 'bg-white/20' 
                                          : selectedStyle === 'simple' 
                                            ? 'bg-gray-100 dark:bg-gray-800'
                                            : 'bg-gray-200 dark:bg-gray-700'
                                      }`}>
                                        <span className={`text-lg font-bold transition-colors duration-300 ease-in-out ${getTextColor()}`}>
                                          {space.name?.charAt(0) || 'S'}
                                        </span>
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        {showTitle && (
                                          <h1 className={`text-2xl font-bold transition-colors duration-300 ease-in-out ${getTextColor()}`}>
                                            {space.name}
                                          </h1>
                                        )}
                                        {/* User avatars - controlled by showMembers */}
                                        {showMembers && (
                                          <div className="flex items-center -space-x-1">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                              <span className="text-white text-xs font-semibold">A</span>
                                            </div>
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-teal-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                              <span className="text-white text-xs font-semibold">B</span>
                                            </div>
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                              <span className="text-white text-xs font-semibold">C</span>
                                            </div>
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                              <span className="text-white text-xs font-semibold">D</span>
                                            </div>
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                              <span className="text-white text-xs font-semibold">E</span>
                                            </div>
                                            <div className="w-7 h-7 rounded-full bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                              <span className="text-white text-xs font-semibold">+5</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      {showDescription && space.description && (
                                        <p className={`text-sm mb-2 transition-colors duration-300 ease-in-out ${
                                          selectedStyle === 'colorstyle' || selectedStyle === 'imagestyle' || selectedStyle === 'videostyle' || selectedStyle === 'gradientstyle'
                                            ? 'text-white/80' 
                                            : 'text-gray-600 dark:text-gray-400'
                                        }`}>
                                          {space.description}
                                        </p>
                                      )}
                                      {showStats && (
                                        <div className={`flex items-center gap-4 text-xs transition-colors duration-300 ease-in-out ${
                                          selectedStyle === 'colorstyle' || selectedStyle === 'imagestyle' || selectedStyle === 'videostyle' || selectedStyle === 'gradientstyle'
                                            ? 'text-white/60' 
                                            : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                          <div className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span>4</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span>4</span>
                                          </div>
                                          <div className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>created 3 months ago</span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  {showActions && (
                                    <div className="flex items-center gap-2">
                                      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-in-out">
                                        Add Post
                                      </button>
                                      {showJoin && (
                                        <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out">
                                          Joined
                                        </button>
                                      )}
                                      <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                      </button>
                                      <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                      </button>
                                    </div>
                                  )}
                                </div>

                              </div>
                            );
                          })()}
                              </div>
                            </GeneralWidgetPopover>
                          ) : (
                            <div 
                              className="mb-6"
                              data-section-id="space-header"
                              onDragOver={isDraggingWidget ? (e) => handleSectionDragOver(e as any, 'space-header') : undefined}
                            >
                              {/* Render space header using the dynamic space-header widget */}
                              {(() => {
                              // Use settings to determine visibility and content
                              const settings = spaceHeaderSettings || {};
                              // console.log('🔄 SpaceContent: Rendering default space-header with settings:', settings);
                              const showIcon = settings.showIcon !== false;
                              const showTitle = settings.showTitle !== false;
                              const showDescription = settings.showDescription !== false;
                              const showStats = settings.showStats !== false;
                              const showActions = settings.showActions !== false;
                              const showJoin = settings.showJoin !== false;
                              const showMembers = settings.showMembers !== false;
                              const selectedStyle = settings.selectedStyle || 'simple';
                              
                              // Style variations
                              const getHeaderStyle = () => {
                                switch (selectedStyle) {
                                  case 'colorstyle':
                                  case 'gradient':
                                    return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white';
                                  case 'minimal':
                                    return 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white';
                                  case 'banner':
                                    return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white';
                                  default:
                                    return 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white';
                                }
                              };
                              
                              const getTextColor = () => {
                                return selectedStyle === 'colorstyle' || selectedStyle === 'gradient' || selectedStyle === 'banner' 
                                  ? 'text-white' 
                                  : 'text-gray-900 dark:text-white';
                              };
                              
                              const getSubtextColor = () => {
                                return selectedStyle === 'colorstyle' || selectedStyle === 'gradient' || selectedStyle === 'banner' 
                                  ? 'text-white/80' 
                                  : 'text-gray-600 dark:text-gray-400';
                              };
                              
                              return (
                                <div className={`rounded-lg p-6 ${getHeaderStyle()}`}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      {showIcon && (
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                          selectedStyle === 'colorstyle' || selectedStyle === 'gradient' || selectedStyle === 'banner' 
                                            ? 'bg-white/20' 
                                            : 'bg-gray-200 dark:bg-gray-700'
                                        }`}>
                                          <span className={`text-lg font-bold ${getTextColor()}`}>
                                            {space.name?.charAt(0) || 'S'}
                                          </span>
                                        </div>
                                      )}
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          {showTitle && (
                                            <h1 className={`text-2xl font-bold ${getTextColor()}`}>
                                              {space.name}
                                            </h1>
                                          )}
                                          {/* User avatars - controlled by showMembers */}
                                          {showMembers && (
                                            <div className="flex items-center -space-x-1">
                                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                                <span className="text-white text-xs font-semibold">A</span>
                                              </div>
                                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-teal-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                                <span className="text-white text-xs font-semibold">B</span>
                                              </div>
                                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-500 to-red-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                                <span className="text-white text-xs font-semibold">C</span>
                                              </div>
                                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                                <span className="text-white text-xs font-semibold">D</span>
                                              </div>
                                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                                <span className="text-white text-xs font-semibold">E</span>
                                              </div>
                                              <div className="w-7 h-7 rounded-full bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                                <span className="text-white text-xs font-semibold">+5</span>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        {showDescription && space.description && (
                                          <p className={`text-sm mb-2 ${
                                            selectedStyle === 'colorstyle' || selectedStyle === 'gradient' || selectedStyle === 'banner' 
                                              ? 'text-white/80' 
                                              : 'text-gray-600 dark:text-gray-400'
                                          }`}>
                                            {space.description}
                                          </p>
                                        )}
                                        {showStats && (
                                          <div className={`flex items-center gap-4 text-xs ${
                                            selectedStyle === 'colorstyle' || selectedStyle === 'gradient' || selectedStyle === 'banner' 
                                              ? 'text-white/60' 
                                              : 'text-gray-500 dark:text-gray-400'
                                          }`}>
                                            <div className="flex items-center gap-1">
                                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                              </svg>
                                              <span>4</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                              </svg>
                                              <span>4</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                              </svg>
                                              <span>created 3 months ago</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    {showActions && (
                                      <div className="flex items-center gap-2">
                                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ease-in-out">
                                          Add Post
                                        </button>
                                        {showJoin && (
                                          <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out">
                                            Joined
                                          </button>
                                        )}
                                        <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out">
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                          </svg>
                                        </button>
                                        <button className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 p-2 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 ease-in-out">
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                          </svg>
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                </div>
                              );
                            })()}
                            </div>
                          )
                        )
                      )}
                      
                      {/* Main Content */}
                      <div 
                        data-section-id="main-content"
                        onDragOver={isDraggingWidget ? (e) => handleSectionDragOver(e as any, 'main-content') : undefined}
                      >
                        <EventContent 
                          siteSD={siteSD}
                          space={space}
                          site={site}
                          eventsLayout={eventsLayout}
                          cardSize={cardSize}
                          cardStyle={cardStyle}
                          isWidgetMode={isWidgetMode}
                          onSectionSettings={onSectionSettings}
                          hideSpaceHeader={true}
                        />
                      </div>
                    </motion.div>
                  )}
                  {!isContentLoading && !error && !space && (
                    <motion.div
                      key="no-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center"
                      data-section-id="no-content"
                      onDragOver={isDraggingWidget ? (e) => handleSectionDragOver(e as any, 'no-content') : undefined}
                    >
                      <p className="text-gray-600 dark:text-gray-400">
                        No content available for this space.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </WidgetDropZone>
            </div>
          </div>
        </div>

        {/* Footer */}
          {renderFooter()}
      </div>
  );
}