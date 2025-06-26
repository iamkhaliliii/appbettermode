import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Settings, 
  Grid2X2, 
  MousePointer, 
  Calendar, 
  Users, 
  Layout,
  LayoutGrid,
  LayoutList,
  Rows3,
  Columns,
  ExternalLink,
  Square,
  Hash,
  ChevronDown,
  Heading,
  AlignLeft,
  User,
  Heart,
  MessageSquare,
  Eye,
  EyeOff,
  Type,
  Zap,
  Layers,
  ArrowLeft,
  CheckCircle,
  Grid3x3,
  SquareStack,
  RectangleHorizontal,
  Sparkles,
  FileText
} from "lucide-react";
import { PropertyRow } from "./PropertyRow";
import { Tabs } from "@/components/ui/vercel-tabs";

interface SimpleWidgetTabProps {
  selectedElement?: HTMLElement | null;
  onWidgetSettingsModeChange?: (isWidgetSettingsMode: boolean) => void;
  onLayoutChange?: (layout: string) => void;
  onCardSizeChange?: (cardSize: string) => void;
  onCardStyleChange?: (cardStyle: string) => void;
  // Initial values from parent
  initialLayout?: string;
  initialCardSize?: string;
  initialCardStyle?: string;
}

export function SimpleWidgetTab({ 
  selectedElement, 
  onWidgetSettingsModeChange, 
  onLayoutChange, 
  onCardSizeChange, 
  onCardStyleChange,
  initialLayout = 'card',
  initialCardSize = 'medium', 
  initialCardStyle = 'modern'
}: SimpleWidgetTabProps) {
  const [activeTab, setActiveTab] = useState('active-widgets');
  const [selectedInfo, setSelectedInfo] = useState<any>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [selectedWidget, setSelectedWidget] = useState<any>(null);
  const [isWidgetSettingsMode, setIsWidgetSettingsMode] = useState(false);
  const [widgetSettings, setWidgetSettings] = useState({
    visibility: true,
    layout: 'grid',
    showTitle: true,
    showDescription: true,
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderRadius: '8',
    spacing: 'medium',
    animation: 'fade',
    itemsPerRow: '3'
  });
  const [propertiesExpanded, setPropertiesExpanded] = useState(false);
  const [baseSectionExpanded, setBaseSectionExpanded] = useState(false);
  const [mainWidgetExpanded, setMainWidgetExpanded] = useState(true);
  const [customWidgetsExpanded, setCustomWidgetsExpanded] = useState(false);
  
  // Events content settings state
  const [layout, setLayout] = useState(initialLayout);
  const [showAuthor, setShowAuthor] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [cardSize, setCardSize] = useState(initialCardSize);
  const [cardStyle, setCardStyle] = useState(initialCardStyle);
  const [openPageIn, setOpenPageIn] = useState('post_page');
  const [showTitle, setShowTitle] = useState(true);
  const [showExcerpt, setShowExcerpt] = useState(true);
  const [showReactions, setShowReactions] = useState(true);
  const [showComments, setShowComments] = useState(true);
  
  // New section settings
  const [sectionTitle, setSectionTitle] = useState('Events');
  const [sectionSubtitle, setSectionSubtitle] = useState('Discover upcoming events');
  const [sortOption, setSortOption] = useState('date_desc');

  // Sync local state with parent state when props change
  useEffect(() => {
    setLayout(initialLayout);
    setCardSize(initialCardSize);
    setCardStyle(initialCardStyle);
  }, [initialLayout, initialCardSize, initialCardStyle]);

  // Listen for element selections - improved detection
  useEffect(() => {
    const checkSelectedElement = () => {
      const selectedElement = document.querySelector('.selected-element');
      if (selectedElement) {
        const sectionName = selectedElement.getAttribute('data-section-name') || selectedElement.className.split(' ').find((c: string) => c.includes('site-')) || 'Unknown Section';
        setSelectedInfo({
          tagName: selectedElement.tagName,
          className: selectedElement.className || 'No class',
          textContent: selectedElement.textContent?.slice(0, 60) || 'No text content',
          id: selectedElement.id || 'No ID',
          sectionName: sectionName
        });
      } else {
        setSelectedInfo(null);
      }
    };

    checkSelectedElement();
    const interval = setInterval(checkSelectedElement, 500);
    
    return () => clearInterval(interval);
  }, []);

  // Optimized event handlers
  const handleFieldClick = useCallback((fieldName: string) => {
    setEditingField(fieldName);
  }, []);

  const handleFieldBlur = useCallback(() => {
    setEditingField(null);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, fieldName: string) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setEditingField(null);
    }
  }, []);

  const togglePropertiesExpanded = useCallback(() => {
    setPropertiesExpanded(prev => !prev);
  }, []);

  const toggleBaseSectionExpanded = useCallback(() => {
    setBaseSectionExpanded(prev => !prev);
  }, []);

  const toggleMainWidgetExpanded = useCallback(() => {
    setMainWidgetExpanded(prev => !prev);
  }, []);

  const toggleCustomWidgetsExpanded = useCallback(() => {
    setCustomWidgetsExpanded(prev => !prev);
  }, []);

  // Handle layout change with callback
  const handleLayoutChange = useCallback((newLayout: string) => {
    setLayout(newLayout);
    onLayoutChange?.(newLayout);
  }, [onLayoutChange]);

  // Handle card size change with callback
  const handleCardSizeChange = useCallback((newCardSize: string) => {
    setCardSize(newCardSize);
    onCardSizeChange?.(newCardSize);
  }, [onCardSizeChange]);

  // Handle card style change with callback
  const handleCardStyleChange = useCallback((newCardStyle: string) => {
    setCardStyle(newCardStyle);
    onCardStyleChange?.(newCardStyle);
  }, [onCardStyleChange]);

  // Handle widget click - scroll to section and show settings
  const handleWidgetClick = useCallback((widget: any) => {
    // Set selected widget and enable settings mode
    setSelectedWidget(widget);
    setIsWidgetSettingsMode(true);
    
    // Notify parent about mode change
    onWidgetSettingsModeChange?.(true);
    
    // Scroll to the target section in browser mockup
    const getTargetSelector = (widgetId: string) => {
      switch (widgetId) {
        case 'events-container':
          return '.events-container, .site-event-content, [data-section="events"], .event-controls-bar, .events-content, .events-list';
        case 'featured-events':
          return '.featured-events, .featured-event-widget, [data-section="featured-events"]';
        case 'categories':
          return '.categories, .event-categories, [data-section="categories"]';
        case 'site-header':
          return '.site-header, .header';
        case 'site-sidebar':
          return '.site-sidebar, .sidebar';
        case 'site-footer':
          return '.site-footer, .footer';
        default:
          return `.${widgetId}`;
      }
    };
    
    // Try to find the element in the browser mockup
    setTimeout(() => {
      const targetSelector = getTargetSelector(widget.id);
      
      // Remove previous selections first
      document.querySelectorAll('.widget-selected, .selected-element').forEach(el => {
        el.classList.remove('widget-selected', 'selected-element');
      });
      
      // Look for the element in various contexts
      let targetElement: HTMLElement | null = null;
      
      // Try multiple selector approaches
      const selectors = targetSelector.split(', ');
      for (const selector of selectors) {
        targetElement = document.querySelector(selector.trim()) as HTMLElement;
        if (targetElement) break;
      }
      
      // If still not found, try in iframe
      if (!targetElement) {
        const browserFrame = document.querySelector('.browser-mockup iframe') as HTMLIFrameElement;
        if (browserFrame && browserFrame.contentDocument) {
          for (const selector of selectors) {
            targetElement = browserFrame.contentDocument.querySelector(selector.trim()) as HTMLElement;
            if (targetElement) break;
          }
        }
      }
      
      if (targetElement) {
        // Add highlight classes
        targetElement.classList.add('widget-selected', 'selected-element');
        targetElement.setAttribute('data-section-name', widget.name);
        
        // Add has-selection class to preview container for blur effect
        const previewContainer = document.querySelector('.preview-container');
        if (previewContainer) {
          previewContainer.classList.add('has-selection');
        }
        
        // Scroll to element
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
        
        console.log(`Selected widget: ${widget.name} (${widget.id})`);
      } else {
        console.warn(`Could not find element for widget: ${widget.name} (${widget.id})`);
      }
    }, 100);
  }, [onWidgetSettingsModeChange]);

  // Handle back button - return to widget list
  const handleBackClick = useCallback(() => {
    setSelectedWidget(null);
    setIsWidgetSettingsMode(false);
    
    // Notify parent about mode change
    onWidgetSettingsModeChange?.(false);
    
    // Remove selection from browser mockup
    document.querySelectorAll('.widget-selected, .selected-element').forEach(el => {
      el.classList.remove('widget-selected', 'selected-element');
      el.removeAttribute('data-section-name');
    });
    
    // Remove has-selection class from preview container
    const previewContainer = document.querySelector('.preview-container');
    if (previewContainer) {
      previewContainer.classList.remove('has-selection');
    }
  }, [onWidgetSettingsModeChange]);

  // Handle setting changes
  const handleSettingChange = useCallback((key: string) => (value: any) => {
    setWidgetSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Memoized active widgets data organized by sections
  const widgetSections = useMemo(() => ({
    base: [
      { 
        id: 'site-header', 
        name: 'Site Header', 
        icon: Layout, 
        description: 'Navigation and branding',
        status: 'active',
        type: 'system',
        settings: { visibility: true, customizable: false }
      },
      { 
        id: 'site-sidebar', 
        name: 'Site Sidebar', 
        icon: Eye, 
        description: 'Navigation menu',
        status: 'active',
        type: 'system',
        settings: { visibility: true, customizable: true }
      },
      { 
        id: 'site-footer', 
        name: 'Site Footer', 
        icon: Layout, 
        description: 'Footer information and links',
        status: 'active',
        type: 'system',
        settings: { visibility: true, customizable: false }
      },
    ],
    main: [
      { 
        id: 'events-container', 
        name: 'Events content', 
        icon: Settings, 
        description: 'Event listing with search and filters',
        status: 'active',
        type: 'content',
        settings: { visibility: true, customizable: true }
      },
    ],
    custom: [
      { 
        id: 'featured-events', 
        name: 'Featured Events', 
        icon: Zap, 
        description: 'Event highlights with carousel',
        status: 'active',
        type: 'content',
        settings: { visibility: true, customizable: true }
      },
      { 
        id: 'categories', 
        name: 'Event Categories', 
        icon: Layers, 
        description: 'Interactive category filters',
        status: 'active',
        type: 'content',
        settings: { visibility: true, customizable: true }
      },
    ]
  }), []);

  // Memoized options
  const layoutOptions = useMemo(() => [
    { value: 'card', label: 'Card', icon: LayoutGrid },
    { value: 'list', label: 'List', icon: LayoutList },
    { value: 'calendar', label: 'Calendar', icon: Calendar }
  ], []);

  const cardSizeOptions = useMemo(() => [
    { 
      value: 'small', 
      label: 'Small',
      description: 'Compact cards with minimal content preview (4 per row)',
      icon: LayoutGrid
    },
    { 
      value: 'medium', 
      label: 'Medium',
      description: 'Balanced size with good content visibility (3 per row)',
      icon: Grid3x3
    },
    { 
      value: 'large', 
      label: 'Large',
      description: 'Spacious cards with detailed content preview (2 per row)',
      icon: Grid2X2
    },
    { 
      value: 'extra_large', 
      label: 'Extra Large',
      description: 'Maximum size cards with full content display (1 per row)',
      icon: RectangleHorizontal
    }
  ], []);

  const cardStyleOptions = useMemo(() => [
    { 
      value: 'modern', 
      label: 'Modern Style',
      description: 'Text overlay on image with gradient background',
      icon: Sparkles
    },
    { 
      value: 'simple', 
      label: 'Simple Card',
      description: 'Clean layout with text below image',
      icon: FileText
    }
  ], []);

  const openPageOptions = useMemo(() => [
    { 
      value: 'modal_content', 
      label: 'Modal content',
      description: 'Open posts in an overlay modal window',
      icon: Square
    },
    { 
      value: 'post_page', 
      label: 'Post page',
      description: 'Navigate to a dedicated post page',
      icon: ExternalLink
    }
  ], []);

  const sortOptions = useMemo(() => [
    { 
      value: 'date_desc', 
      label: 'Newest first',
      description: 'Sort by event date (newest to oldest)',
      icon: Calendar
    },
    { 
      value: 'date_asc', 
      label: 'Oldest first',
      description: 'Sort by event date (oldest to newest)',
      icon: Calendar
    },
    { 
      value: 'title_asc', 
      label: 'Title A-Z',
      description: 'Sort alphabetically by title',
      icon: Type
    },
    { 
      value: 'title_desc', 
      label: 'Title Z-A',
      description: 'Sort reverse alphabetically by title',
      icon: Type
    },
    { 
      value: 'attendees_desc', 
      label: 'Most popular',
      description: 'Sort by attendees count (high to low)',
      icon: Users
    },
    { 
      value: 'attendees_asc', 
      label: 'Least popular',
      description: 'Sort by attendees count (low to high)',
      icon: Users
    }
  ], []);

  // Memoized render function for properties section
  const renderPropertiesSection = useCallback(() => (
    <div className="pt-1 border-t border-gray-50 dark:border-gray-800">
      <button
        onClick={togglePropertiesExpanded}
        className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <span>Properties</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${propertiesExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {propertiesExpanded && (
        <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
          <PropertyRow
            label="Title"
            value={showTitle}
            fieldName="showTitle"
            type="checkbox"
            onValueChange={setShowTitle}
            icon={Heading}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
            disabled={true}
          />

          <PropertyRow
            label="Excerpt"
            value={showExcerpt}
            fieldName="showExcerpt"
            type="checkbox"
            onValueChange={setShowExcerpt}
            icon={AlignLeft}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
            disabled={true}
          />

          <PropertyRow
            label="Author"
            value={showAuthor}
            fieldName="showAuthor"
            type="checkbox"
            onValueChange={setShowAuthor}
            icon={User}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
            disabled={true}
          />

          <PropertyRow
            label="Date"
            value={showDate}
            fieldName="showDate"
            type="checkbox"
            onValueChange={setShowDate}
            icon={Calendar}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
          />

          <PropertyRow
            label="Tags"
            value={showTags}
            fieldName="showTags"
            type="checkbox"
            onValueChange={setShowTags}
            icon={Hash}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
          />

          <PropertyRow
            label="Reactions"
            value={showReactions}
            fieldName="showReactions"
            type="checkbox"
            onValueChange={setShowReactions}
            icon={Heart}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
          />

          <PropertyRow
            label="Comments"
            value={showComments}
            fieldName="showComments"
            type="checkbox"
            onValueChange={setShowComments}
            icon={MessageSquare}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}
    </div>
  ), [propertiesExpanded, showTitle, showExcerpt, showAuthor, showDate, showTags, showReactions, showComments, editingField, handleFieldClick, handleFieldBlur, handleKeyDown, togglePropertiesExpanded]);

  // Memoized card settings
  const cardSettings = useMemo(() => (
    <>
      <PropertyRow
        key={`cardSize-${cardSize}`}
        label="Card size"
        value={cardSize}
        fieldName="cardSize"
        type="select"
        options={cardSizeOptions}
        onValueChange={handleCardSizeChange}
        icon={cardSizeOptions.find(option => option.value === cardSize)?.icon || Grid3x3}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        key={`cardStyle-${cardStyle}`}
        label="Card style"
        value={cardStyle}
        fieldName="cardStyle"
        type="select"
        options={cardStyleOptions}
        onValueChange={handleCardStyleChange}
        icon={cardStyleOptions.find(option => option.value === cardStyle)?.icon || Sparkles}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="Open page in"
        value={openPageIn}
        fieldName="openPageIn"
        type="select"
        options={openPageOptions}
        onValueChange={setOpenPageIn}
        icon={ExternalLink}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      {renderPropertiesSection()}
    </>
  ), [cardSize, cardStyle, cardSizeOptions, cardStyleOptions, openPageIn, openPageOptions, editingField, handleFieldClick, handleFieldBlur, handleKeyDown, renderPropertiesSection, handleCardSizeChange, handleCardStyleChange]);

  // Memoized list/calendar settings
  const listCalendarSettings = useMemo(() => (
    <>
      <PropertyRow
        label="Open page in"
        value={openPageIn}
        fieldName="openPageIn"
        type="select"
        options={openPageOptions}
        onValueChange={setOpenPageIn}
        icon={ExternalLink}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      {renderPropertiesSection()}
    </>
  ), [openPageIn, openPageOptions, editingField, handleFieldClick, handleFieldBlur, handleKeyDown, renderPropertiesSection]);

  // Define tabs for the Vercel-style tabs component
  const tabs = useMemo(() => [
    { id: 'active-widgets', label: 'All events' },
    { id: 'widget-settings', label: 'Single Event' }
  ], []);

  return (
    <div className="w-full min-w-0 space-y-4">
      {/* Widget Settings Mode */}
      {isWidgetSettingsMode && selectedWidget ? (
        <div className="space-y-4 min-w-0">
          {/* Back Button */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Customize</span>
            </button>
          </div>

          {/* Widget Header */}
          <div className="flex items-center gap-3 mb-4 ml-2 mt-3">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {selectedWidget.name} Settings
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {selectedWidget.description}
              </p>
            </div>
          </div>

          {/* Events Content Settings for selected widget */}
          <div className="space-y-2">

            {/* Section Settings */}
            <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
              <PropertyRow
                label="Section title"
                value={sectionTitle}
                fieldName="sectionTitle"
                type="text"
                onValueChange={setSectionTitle}
                icon={Heading}
                editingField={editingField}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
              />

              <PropertyRow
                label="Section subtitle"
                value={sectionSubtitle}
                fieldName="sectionSubtitle"
                type="textarea"
                onValueChange={setSectionSubtitle}
                placeholder="Enter section subtitle"
                icon={AlignLeft}
                editingField={editingField}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
              />

              <PropertyRow
                label="Sort"
                value={sortOption}
                fieldName="sortOption"
                type="select"
                options={sortOptions}
                onValueChange={setSortOption}
                icon={sortOptions.find(option => option.value === sortOption)?.icon || Calendar}
                editingField={editingField}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
              />
            </div>

            {/* Visual Layout Selector */}
            <div>
              <div className="grid grid-cols-3 gap-2 px-2">
                              {layoutOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleLayoutChange(option.value)}
                  className={`flex flex-col items-center justify-center aspect-square p-2 rounded-lg border-2 transition-all ${
                    layout === option.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                    <option.icon className={`w-6 h-6 mb-1 ${
                      layout === option.value 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                    <span className={`text-xs ${
                      layout === option.value 
                        ? 'text-primary-600 dark:text-primary-400 font-medium' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Conditional Settings */}
            <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
              {layout === 'card' && cardSettings}
              {(layout === 'list' || layout === 'calendar') && listCalendarSettings}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Tab Navigation */}
          <div className="flex justify-center py-2">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              className="w-full max-w-md"
            />
          </div>

          {/* Active Widgets Tab Content */}
          {activeTab === 'active-widgets' && (
            <div className="space-y-5 min-w-0 px-2">
              {/* Base Section */}
              <div className="min-w-0">
                <button
                  onClick={toggleBaseSectionExpanded}
                  className="w-full flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mb-2"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="truncate">Base Section</span>
                  </div>
                  <ChevronDown className={`w-3 h-3 transition-transform flex-shrink-0 ${baseSectionExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                {baseSectionExpanded && (
                  <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {widgetSections.base.map((widget) => (
                      <div
                        key={widget.id}
                        className="px-1 py-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors min-w-0 cursor-pointer"
                        onClick={() => handleWidgetClick(widget)}
                      >
                        <div className="flex items-center justify-between gap-2 min-w-0">
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <widget.icon className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                            <div className="text-sm text-gray-900 dark:text-white truncate min-w-0">
                              {widget.name}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button 
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                              title={widget.settings.visibility ? 'Hide widget' : 'Show widget'}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {widget.settings.visibility ? (
                                <Eye className="w-3 h-3 text-gray-400" />
                              ) : (
                                <EyeOff className="w-3 h-3 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Main Widget */}
              <div className="min-w-0">
                <button
                  onClick={toggleMainWidgetExpanded}
                  className="w-full flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mb-2"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="truncate">Main Widget</span>
                  </div>
                  <ChevronDown className={`w-3 h-3 transition-transform flex-shrink-0 ${mainWidgetExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                {mainWidgetExpanded && (
                  <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {widgetSections.main.map((widget) => (
                      <div
                        key={widget.id}
                        className="px-1 py-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors min-w-0 cursor-pointer"
                        onClick={() => handleWidgetClick(widget)}
                      >
                        <div className="flex items-center justify-between gap-2 min-w-0">
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <widget.icon className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                            <div className="text-sm text-gray-900 dark:text-white truncate min-w-0">
                              {widget.name}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button 
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                              title={widget.settings.visibility ? 'Hide widget' : 'Show widget'}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {widget.settings.visibility ? (
                                <Eye className="w-3 h-3 text-gray-400" />
                              ) : (
                                <EyeOff className="w-3 h-3 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Widgets */}
              <div className="min-w-0">
                <button
                  onClick={toggleCustomWidgetsExpanded}
                  className="w-full flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mb-2"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="truncate">Custom Widgets</span>
                  </div>
                  <ChevronDown className={`w-3 h-3 transition-transform flex-shrink-0 ${customWidgetsExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                {customWidgetsExpanded && (
                  <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {widgetSections.custom.map((widget) => (
                      <div
                        key={widget.id}
                        className="px-1 py-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors min-w-0 cursor-pointer"
                        onClick={() => handleWidgetClick(widget)}
                      >
                        <div className="flex items-center justify-between gap-2 min-w-0">
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <widget.icon className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                            <div className="text-sm text-gray-900 dark:text-white truncate min-w-0">
                              {widget.name}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button 
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                              title={widget.settings.visibility ? 'Hide widget' : 'Show widget'}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {widget.settings.visibility ? (
                                <Eye className="w-3 h-3 text-gray-400" />
                              ) : (
                                <EyeOff className="w-3 h-3 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Widget Settings Tab Content - Single Event */}
          {activeTab === 'widget-settings' && (
            <div className="space-y-4 min-w-0">
              {selectedInfo ? (
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="truncate">{selectedInfo.sectionName} Settings</span>
                  </h4>
                  <div className="p-3 border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 rounded-lg mb-4">
                    <div className="text-sm font-medium text-green-800 dark:text-green-300 mb-1 truncate">
                      {selectedInfo.sectionName}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 leading-relaxed break-words">
                      Element: {selectedInfo.tagName.toLowerCase()}.{selectedInfo.className.split(' ').find((c: string) => c.includes('site-')) || selectedInfo.className.split(' ')[0]}
                    </div>
                  </div>
                  
                  <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
                    <PropertyRow
                      label="Show content details"
                      value={true}
                      fieldName="showContentDetails"
                      type="checkbox"
                      onValueChange={() => {}}
                      icon={Calendar}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                    />
                    
                    <PropertyRow
                      label="Show action button"
                      value={true}
                      fieldName="showActionButton"
                      type="checkbox"
                      onValueChange={() => {}}
                      icon={User}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                    />
                    
                    <PropertyRow
                      label="Show related users"
                      value={true}
                      fieldName="showRelatedUsers"
                      type="checkbox"
                      onValueChange={() => {}}
                      icon={User}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <MousePointer className="w-10 h-10 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <h3 className="text-base font-medium mb-2">Select a Widget</h3>
                  <p className="text-sm mb-4 leading-relaxed">Click on any widget from the "All events" tab to configure its settings here.</p>
                  
                  <div className="text-left max-w-full mx-auto space-y-2 text-xs">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded min-w-0">
                      <Layout className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="truncate">Site Header - Navigation and branding</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded min-w-0">
                      <Zap className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="truncate">Featured Events - Event highlights</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded min-w-0">
                      <Layers className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="truncate">Categories - Interactive filters</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded min-w-0">
                      <Settings className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="truncate">Events content - Search and listing</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
} 