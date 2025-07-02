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
  onSectionSettings
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
                      {droppedWidgets.map((droppedWidget, index) => (
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
                              'Calendar': 'calendar'
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
                      ) : (
                        <div 
                          className="mb-6"
                          data-section-id="space-header"
                          onDragOver={isDraggingWidget ? (e) => handleSectionDragOver(e as any, 'space-header') : undefined}
                        >
                          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {space.name}
                          </h1>
                          {space.description && (
                            <p className="text-gray-600 dark:text-gray-400">{space.description}</p>
                          )}
                        </div>
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