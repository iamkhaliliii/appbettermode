import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Settings, MousePointer, Eye, Layout, Edit3, Users, CheckCircle, Palette, LayoutGrid, Type, EyeOff, Grid3X3, List, Calendar, ChevronDown, MoreHorizontal, RefreshCw, Zap, Layers, Play, Pause } from 'lucide-react';
import { PropertyRow } from "./PropertyRow";

interface SimpleWidgetTabProps {
  selectedElement?: HTMLElement | null;
}

export function SimpleWidgetTab({ selectedElement }: SimpleWidgetTabProps) {
  const [activeTab, setActiveTab] = useState('active-widgets');
  const [selectedInfo, setSelectedInfo] = useState<any>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
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

  // Handle setting changes
  const handleSettingChange = useCallback((key: string) => (value: any) => {
    setWidgetSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Memoized active widgets data
  const activeWidgets = useMemo(() => [
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
    { 
      id: 'events-container', 
      name: 'Events Controls & List', 
      icon: Settings, 
      description: 'Event listing with search and filters',
      status: 'active',
      type: 'content',
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
  ], []);

  // Memoized options
  const layoutOptions = useMemo(() => [
    { 
      value: 'grid', 
      label: 'Grid Layout',
      description: 'Display items in a responsive grid',
      icon: Grid3X3
    },
    { 
      value: 'list', 
      label: 'List Layout',
      description: 'Display items in a vertical list',
      icon: List
    },
    { 
      value: 'card', 
      label: 'Card Layout',
      description: 'Display items as individual cards',
      icon: Layout
    },
    { 
      value: 'carousel', 
      label: 'Carousel',
      description: 'Display items in a horizontal carousel',
      icon: Calendar
    }
  ], []);

  const spacingOptions = useMemo(() => [
    { 
      value: 'tight', 
      label: 'Tight',
      description: 'Minimal spacing between items',
      icon: LayoutGrid
    },
    { 
      value: 'medium', 
      label: 'Medium',
      description: 'Balanced spacing between items',
      icon: LayoutGrid
    },
    { 
      value: 'loose', 
      label: 'Loose',
      description: 'Generous spacing between items',
      icon: LayoutGrid
    }
  ], []);

  const itemsPerRowOptions = useMemo(() => [
    { 
      value: '1', 
      label: '1 Column',
      description: 'Single column layout',
      icon: LayoutGrid
    },
    { 
      value: '2', 
      label: '2 Columns',
      description: 'Two column grid layout',
      icon: LayoutGrid
    },
    { 
      value: '3', 
      label: '3 Columns',
      description: 'Three column grid layout',
      icon: LayoutGrid
    },
    { 
      value: '4', 
      label: '4 Columns',
      description: 'Four column grid layout',
      icon: LayoutGrid
    }
  ], []);

  const animationOptions = useMemo(() => [
    { 
      value: 'none', 
      label: 'No Animation',
      description: 'No entry animation',
      icon: Type
    },
    { 
      value: 'fade', 
      label: 'Fade In',
      description: 'Fade in animation effect',
      icon: Type
    },
    { 
      value: 'slide', 
      label: 'Slide Up',
      description: 'Slide up animation effect',
      icon: Type
    },
    { 
      value: 'scale', 
      label: 'Scale In',
      description: 'Scale in animation effect',
      icon: Type
    },
    { 
      value: 'bounce', 
      label: 'Bounce In',
      description: 'Bounce in animation effect',
      icon: Type
    }
  ], []);

  // Memoized render function for advanced properties section
  const renderAdvancedPropertiesSection = useCallback(() => (
    <div className="pt-1 border-t border-gray-50 dark:border-gray-800">
      <button
        onClick={togglePropertiesExpanded}
        className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <span>Advanced Properties</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform flex-shrink-0 ${propertiesExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {propertiesExpanded && (
        <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
          <PropertyRow
            label="Background Color"
            value={widgetSettings.backgroundColor}
            fieldName="backgroundColor"
            type="text"
            onValueChange={handleSettingChange('backgroundColor')}
            placeholder="#ffffff"
            icon={Palette}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
            description="Background color of the section"
          />

          <PropertyRow
            label="Text Color"
            value={widgetSettings.textColor}
            fieldName="textColor"
            type="text"
            onValueChange={handleSettingChange('textColor')}
            placeholder="#000000"
            icon={Palette}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
            description="Text color of the section"
          />

          <PropertyRow
            label="Border Radius"
            value={widgetSettings.borderRadius}
            fieldName="borderRadius"
            type="text"
            onValueChange={handleSettingChange('borderRadius')}
            placeholder="8"
            icon={Layout}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
            description="Corner radius in pixels"
          />

          <PropertyRow
            label="Entry Animation"
            value={widgetSettings.animation}
            fieldName="animation"
            type="select"
            options={animationOptions}
            onValueChange={handleSettingChange('animation')}
            icon={Type}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
            description="Animation when section appears"
          />
        </div>
      )}
    </div>
  ), [propertiesExpanded, widgetSettings, editingField, handleFieldClick, handleFieldBlur, handleKeyDown, togglePropertiesExpanded, animationOptions, handleSettingChange]);

  // Widget settings form using PropertyRow
  const WidgetSettingsForm = () => (
    <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
      <PropertyRow
        label="Show Section"
        value={widgetSettings.visibility}
        fieldName="visibility"
        type="checkbox"
        onValueChange={handleSettingChange('visibility')}
        icon={widgetSettings.visibility ? Eye : EyeOff}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
        description="Toggle visibility of this section"
      />

      <PropertyRow
        label="Show Title"
        value={widgetSettings.showTitle}
        fieldName="showTitle"
        type="checkbox"
        onValueChange={handleSettingChange('showTitle')}
        icon={Type}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
        description="Display the section title"
      />

      <PropertyRow
        label="Show Description"
        value={widgetSettings.showDescription}
        fieldName="showDescription"
        type="checkbox"
        onValueChange={handleSettingChange('showDescription')}
        icon={Type}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
        description="Display the section description"
      />

      <PropertyRow
        label="Layout Style"
        value={widgetSettings.layout}
        fieldName="layout"
        type="select"
        options={layoutOptions}
        onValueChange={handleSettingChange('layout')}
        icon={layoutOptions.find(opt => opt.value === widgetSettings.layout)?.icon || LayoutGrid}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
        description="Choose how content is displayed"
      />

      <PropertyRow
        label="Items per Row"
        value={widgetSettings.itemsPerRow}
        fieldName="itemsPerRow"
        type="select"
        options={itemsPerRowOptions}
        onValueChange={handleSettingChange('itemsPerRow')}
        icon={LayoutGrid}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
        description="Number of columns in grid layout"
      />

      <PropertyRow
        label="Spacing"
        value={widgetSettings.spacing}
        fieldName="spacing"
        type="select"
        options={spacingOptions}
        onValueChange={handleSettingChange('spacing')}
        icon={LayoutGrid}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
        description="Adjust spacing between items"
      />

      {renderAdvancedPropertiesSection()}
    </div>
  );

  return (
    <div className="w-full min-w-0 space-y-4">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('active-widgets')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors min-w-0 ${
            activeTab === 'active-widgets'
              ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <span className="truncate">Active Widgets</span>
        </button>
        <button
          onClick={() => setActiveTab('widget-settings')}
          className={`flex-1 px-3 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors min-w-0 ${
            activeTab === 'widget-settings'
              ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <span className="truncate">Widget Settings</span>
        </button>
      </div>

      {/* Active Widgets Tab Content */}
      {activeTab === 'active-widgets' && (
        <div className="space-y-4 min-w-0">
          {/* Active Widgets List */}
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Page Widgets ({activeWidgets.length})</span>
            </h4>
            <div className="space-y-2">
              {activeWidgets.map((widget) => (
                <div
                  key={widget.id}
                  className="p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors min-w-0"
                >
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                        widget.type === 'system' 
                          ? 'bg-gray-100 dark:bg-gray-700' 
                          : 'bg-blue-100 dark:bg-blue-900/30'
                      }`}>
                        <widget.icon className={`w-3.5 h-3.5 ${
                          widget.type === 'system'
                            ? 'text-gray-600 dark:text-gray-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate min-w-0">
                            {widget.name}
                          </div>
                          <div className={`px-1.5 py-0.5 text-xs rounded-full flex-shrink-0 ${
                            widget.status === 'active'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                          }`}>
                            {widget.status}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className={`px-1.5 py-0.5 text-xs rounded-full flex-shrink-0 ${
                            widget.type === 'system'
                              ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          }`}>
                            {widget.type}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate min-w-0">
                            {widget.description}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                        <Settings className="w-3 h-3 text-gray-400" />
                      </button>
                      <button 
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        title={widget.settings.visibility ? 'Hide widget' : 'Show widget'}
                      >
                        {widget.settings.visibility ? (
                          <Eye className="w-3 h-3 text-gray-400" />
                        ) : (
                          <EyeOff className="w-3 h-3 text-gray-400" />
                        )}
                      </button>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                        <MoreHorizontal className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Widget Settings Tab Content */}
      {activeTab === 'widget-settings' && (
        <div className="space-y-4 min-w-0">
          {/* Selected Element Settings */}
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
              
              <WidgetSettingsForm />
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <MousePointer className="w-10 h-10 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <h3 className="text-base font-medium mb-2">Select a Widget</h3>
              <p className="text-sm mb-4 leading-relaxed">Click on any major section in the preview to configure its settings here.</p>
              
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
                  <span className="truncate">Events List - Search and listing</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 