import { useState, useEffect, useCallback } from 'react';
import { WidgetSettings } from './types';

export function useWidgetManagement(
  onWidgetSettingsModeChange?: (isWidgetSettingsMode: boolean) => void,
  onAddWidgetModeChange?: (isAddWidgetMode: boolean) => void,
  onLayoutChange?: (layout: string) => void,
  onCardSizeChange?: (cardSize: string) => void,
  onCardStyleChange?: (cardStyle: string) => void
) {
  // State management
  const [activeTab, setActiveTab] = useState('active-widgets');
  const [selectedInfo, setSelectedInfo] = useState<any>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [selectedWidget, setSelectedWidget] = useState<any>(null);
  const [isWidgetSettingsMode, setIsWidgetSettingsMode] = useState(false);
  const [isAddWidgetMode, setIsAddWidgetMode] = useState(false);
  
  const [widgetSettings, setWidgetSettings] = useState<WidgetSettings>({
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

  // Section expansion states
  const [baseSectionExpanded, setBaseSectionExpanded] = useState(false);
  const [mainWidgetExpanded, setMainWidgetExpanded] = useState(true);
  const [customWidgetsExpanded, setCustomWidgetsExpanded] = useState(false);
  
  // Widget-specific expansion states
  const [featuredPropertiesExpanded, setFeaturedPropertiesExpanded] = useState(false);
  const [propertiesExpanded, setPropertiesExpanded] = useState(false);
  
  // Events content settings state
  const [layout, setLayout] = useState('card');
  const [cardSize, setCardSize] = useState('medium');
  const [cardStyle, setCardStyle] = useState('modern');
  const [showGroup, setShowGroup] = useState(false);
  const [groupOptions, setGroupOptions] = useState<string[]>([]);

  // Listen for element selections
  useEffect(() => {
    const checkSelectedElement = () => {
      const selectedElement = document.querySelector('.selected-element');
      if (selectedElement) {
        const sectionName = selectedElement.getAttribute('data-section-name') || 
          selectedElement.className.split(' ').find((c: string) => c.includes('site-')) || 
          'Unknown Section';
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

  // Event handlers
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

  // Section toggle handlers
  const toggleBaseSectionExpanded = useCallback(() => {
    setBaseSectionExpanded(prev => !prev);
  }, []);

  const toggleMainWidgetExpanded = useCallback(() => {
    setMainWidgetExpanded(prev => !prev);
  }, []);

  const toggleCustomWidgetsExpanded = useCallback(() => {
    setCustomWidgetsExpanded(prev => !prev);
  }, []);

  const toggleFeaturedPropertiesExpanded = useCallback(() => {
    setFeaturedPropertiesExpanded(prev => !prev);
  }, []);

  const togglePropertiesExpanded = useCallback(() => {
    setPropertiesExpanded(prev => !prev);
  }, []);

  // Events content handlers
  const handleLayoutChange = useCallback((newLayout: string) => {
    setLayout(newLayout);
    onLayoutChange?.(newLayout);
    console.log('Layout changed to:', newLayout);
  }, [onLayoutChange]);

  const handleCardSizeChange = useCallback((newCardSize: string) => {
    setCardSize(newCardSize);
    onCardSizeChange?.(newCardSize);
    console.log('Card size changed to:', newCardSize);
  }, [onCardSizeChange]);

  const handleCardStyleChange = useCallback((newCardStyle: string) => {
    setCardStyle(newCardStyle);
    onCardStyleChange?.(newCardStyle);
    console.log('Card style changed to:', newCardStyle);
  }, [onCardStyleChange]);

  const handleGroupChange = useCallback((enabled: boolean) => {
    setShowGroup(enabled);
    if (!enabled) {
      setGroupOptions([]); // Clear options when group is disabled
    }
    console.log('Group enabled:', enabled);
  }, []);

  const handleGroupOptionsChange = useCallback((options: string[]) => {
    setGroupOptions(options);
    console.log('Group options changed:', options);
  }, []);

  // Widget interaction handlers
  const handleWidgetClick = useCallback((widget: any) => {
    setSelectedWidget(widget);
    setIsWidgetSettingsMode(true);
    onWidgetSettingsModeChange?.(true);
    
    // Scroll to target section in browser mockup
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
    
    setTimeout(() => {
      const targetSelector = getTargetSelector(widget.id);
      
      // Remove previous selections
      document.querySelectorAll('.widget-selected, .selected-element').forEach(el => {
        el.classList.remove('widget-selected', 'selected-element');
      });
      
      // Find target element
      let targetElement: HTMLElement | null = null;
      const selectors = targetSelector.split(', ');
      for (const selector of selectors) {
        targetElement = document.querySelector(selector.trim()) as HTMLElement;
        if (targetElement) break;
      }
      
      // Try in iframe if not found
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
        targetElement.classList.add('widget-selected', 'selected-element');
        targetElement.setAttribute('data-section-name', widget.name);
        
        const previewContainer = document.querySelector('.preview-container');
        if (previewContainer) {
          previewContainer.classList.add('has-selection');
        }
        
        targetElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 100);
  }, [onWidgetSettingsModeChange]);

  const handleBackClick = useCallback(() => {
    setSelectedWidget(null);
    setIsWidgetSettingsMode(false);
    onWidgetSettingsModeChange?.(false);
    
    // Remove selections
    document.querySelectorAll('.widget-selected, .selected-element').forEach(el => {
      el.classList.remove('widget-selected', 'selected-element');
      el.removeAttribute('data-section-name');
    });
    
    const previewContainer = document.querySelector('.preview-container');
    if (previewContainer) {
      previewContainer.classList.remove('has-selection');
    }
  }, [onWidgetSettingsModeChange]);

  const handleAddWidgetClick = useCallback(() => {
    setIsAddWidgetMode(true);
    onAddWidgetModeChange?.(true);
  }, [onAddWidgetModeChange]);

  const handleBackFromAddWidget = useCallback(() => {
    setIsAddWidgetMode(false);
    onAddWidgetModeChange?.(false);
  }, [onAddWidgetModeChange]);

  const handleAddWidget = useCallback((widget: any) => {
    const newWidget = {
      ...widget,
      id: `${widget.id}-${Date.now()}`,
      status: 'active',
      type: 'content',
      settings: { visibility: true, customizable: true }
    };
    
    console.log('Adding widget:', newWidget);
    
    setIsAddWidgetMode(false);
    onAddWidgetModeChange?.(false);
  }, [onAddWidgetModeChange]);

  const handleSettingChange = useCallback((key: string) => (value: any) => {
    setWidgetSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  return {
    // State
    activeTab,
    selectedInfo,
    editingField,
    selectedWidget,
    isWidgetSettingsMode,
    isAddWidgetMode,
    widgetSettings,
    baseSectionExpanded,
    mainWidgetExpanded,
    customWidgetsExpanded,
    featuredPropertiesExpanded,
    propertiesExpanded,
    layout,
    cardSize,
    cardStyle,
    showGroup,
    groupOptions,
    
    // State setters
    setActiveTab,
    
    // Handlers
    handleFieldClick,
    handleFieldBlur,
    handleKeyDown,
    toggleBaseSectionExpanded,
    toggleMainWidgetExpanded,
    toggleCustomWidgetsExpanded,
    toggleFeaturedPropertiesExpanded,
    togglePropertiesExpanded,
    handleLayoutChange,
    handleCardSizeChange,
    handleCardStyleChange,
    handleGroupChange,
    handleGroupOptionsChange,
    handleWidgetClick,
    handleBackClick,
    handleAddWidgetClick,
    handleBackFromAddWidget,
    handleAddWidget,
    handleSettingChange
  };
} 