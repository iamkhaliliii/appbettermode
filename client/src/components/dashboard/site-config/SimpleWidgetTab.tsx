import React from 'react';
import { Tabs } from "@/components/ui/vercel-tabs";
import { PropertyRow } from "./PropertyRow";
import { 
  WidgetGallery, 
  WidgetSection, 
  widgetSections, 
  availableWidgets, 
  useWidgetManagement,
  type WidgetTabProps 
} from './widgets';
import { 
  FeaturedEventsSettings, 
  EventCategoriesSettings, 
  EventsContainerSettings, 
  SiteSectionSettings 
} from './widget-settings';
import {
  TitleWidgetSettings,
  LogoWidgetSettings,
  ImageWidgetSettings,
  VideoWidgetSettings,
  ButtonWidgetSettings,
  AccordionsWidgetSettings,
  CanvasWidgetSettings,
  MenuWidgetSettings,
  HeroBannerWidgetSettings,
  AnnouncementBannerWidgetSettings,
  HtmlScriptWidgetSettings,
  IframeWidgetSettings
} from './widget-settings';
import { 
  MousePointer, 
  CheckCircle, 
  Calendar, 
  User, 
  Layout, 
  Zap, 
  Layers, 
  Settings,
  ArrowLeft,
  ChevronDown,
  Heading,
  AlignLeft,
  Type,
  ExternalLink,
  Hash,
  Tag,
  LayoutGrid,
  LayoutList,
  Grid3x3,
  Grid2X2,
  RectangleHorizontal,
  Sparkles,
  FileText,
  Square,
  Heart,
  MessageSquare,
  Eye,
  EyeOff,
  Users,
  Plus,
  Trash2
} from "lucide-react";

export function SimpleWidgetTab(props: WidgetTabProps) {
  const {
    onWidgetSettingsModeChange,
    onAddWidgetModeChange,
    onLayoutChange,
    onCardSizeChange,
    onCardStyleChange,
    selectedWidget,
    isWidgetSettingsMode,
    initialLayout = 'card',
    initialCardSize = 'medium',
    initialCardStyle = 'modern'
  } = props;

  // Debug logs - reduced to prevent spam
  // console.log('SimpleWidgetTab props:', {
  //   selectedWidget,
  //   isWidgetSettingsMode,
  //   hasOnWidgetSettingsModeChange: !!onWidgetSettingsModeChange
  // });

  // State for widget visibility
  const [hiddenWidgets, setHiddenWidgets] = React.useState<Set<string>>(new Set());
  
  // Track previous selectedWidget to avoid infinite loops
  const prevSelectedWidgetRef = React.useRef<string | null>(null);

  // Toggle widget visibility
  const toggleWidgetVisibility = React.useCallback((widgetId: string) => {
    setHiddenWidgets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(widgetId)) {
        newSet.delete(widgetId);
      } else {
        newSet.add(widgetId);
      }
      return newSet;
    });
  }, []);

  const {
    activeTab,
    selectedInfo,
    editingField,
    selectedWidget: managedSelectedWidget,
    isWidgetSettingsMode: managedIsWidgetSettingsMode,
    isAddWidgetMode,
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
    setActiveTab,
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
    resetManagedState
  } = useWidgetManagement(
    onWidgetSettingsModeChange, 
    onAddWidgetModeChange,
    onLayoutChange,
    onCardSizeChange, 
    onCardStyleChange
  );

  // Track when selectedWidget prop changes to ensure we update properly
  React.useEffect(() => {
    const currentWidgetId = selectedWidget?.id;
    const previousWidgetId = prevSelectedWidgetRef.current;
    
    // Reduced debug logging to prevent spam
    // console.log('📊 SimpleWidgetTab useEffect - selectedWidget prop changed:', {
    //   newWidget: selectedWidget?.name,
    //   newWidgetId: currentWidgetId,
    //   prevWidgetId: previousWidgetId,
    //   isWidgetSettingsMode,
    //   managedWidget: managedSelectedWidget?.name,
    //   timestamp: Date.now()
    // });

    // If we receive a selectedWidget via props and it's different from previous
    if (selectedWidget && isWidgetSettingsMode && currentWidgetId !== previousWidgetId) {
      // console.log('🔄 Setting managed state from props:', selectedWidget?.name);
      prevSelectedWidgetRef.current = currentWidgetId;
      // Call handleWidgetClick without including it in dependencies to avoid infinite loop
      handleWidgetClick(selectedWidget);
    }
  }, [selectedWidget, isWidgetSettingsMode]); // Removed handleWidgetClick and managedSelectedWidget from deps

  // Always use managed state for consistency
  const currentWidget = managedSelectedWidget;
  const currentIsWidgetSettingsMode = managedIsWidgetSettingsMode;

  // Debug logs for widget state - reduced to prevent spam
  // console.log('Widget states:', {
  //   'props.selectedWidget': selectedWidget?.name,
  //   'props.isWidgetSettingsMode': isWidgetSettingsMode,
  //   'managed.selectedWidget': managedSelectedWidget?.name,
  //   'managed.isWidgetSettingsMode': managedIsWidgetSettingsMode,
  //   'currentWidget': currentWidget?.name,
  //   'currentIsWidgetSettingsMode': currentIsWidgetSettingsMode,
  //   'shouldShowSettings': currentIsWidgetSettingsMode && currentWidget
  // });

  // Simple widget click handler for sidebar
  const handleSidebarWidgetClick = React.useCallback((widget: any) => {
    console.log('🔄 Sidebar widget click:', widget?.name);
    handleWidgetClick(widget);
  }, [handleWidgetClick]);

  // Get widget icon and color based on widget type
  const getWidgetIconAndColor = React.useCallback((widget: any) => {
    if (!widget) return { icon: Settings, color: 'blue' };

    // Check if it's a base widget (General widgets)
    const baseWidget = widgetSections.base.find(w => w.id === widget.id);
    if (baseWidget) {
      return {
        icon: baseWidget.icon,
        color: 'purple',
        bgColor: 'bg-purple-100 dark:bg-purple-900/30',
        textColor: 'text-purple-600 dark:text-purple-400'
      };
    }

    // Check if it's a main widget
    const mainWidget = widgetSections.main.find(w => w.id === widget.id);
    if (mainWidget) {
      return {
        icon: mainWidget.icon,
        color: 'blue',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        textColor: 'text-blue-600 dark:text-blue-400'
      };
    }

    // Check if it's a custom widget
    const customWidget = widgetSections.custom.find(w => w.id === widget.id);
    if (customWidget) {
      return {
        icon: customWidget.icon,
        color: 'orange',
        bgColor: 'bg-orange-100 dark:bg-orange-900/30',
        textColor: 'text-orange-600 dark:text-orange-400'
      };
    }

    // Default fallback
    return {
      icon: Settings,
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400'
    };
  }, []);

  const tabs = [
    { id: 'active-widgets', label: 'All events page' },
    { id: 'widget-settings', label: 'Event details page' }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Show widget settings if we have a valid widget and are in settings mode */}
      {currentIsWidgetSettingsMode && currentWidget ? (
        /* Widget Settings Mode */
        <div className="space-y-4 min-w-0">
          {/* Widget Settings Header */}
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                // Clear parent state if available
                if (onWidgetSettingsModeChange) {
                  onWidgetSettingsModeChange(false);
                }
                // Clear internal managed state
                handleBackClick();
                // Reset previous widget ref
                prevSelectedWidgetRef.current = null;
              }}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              title="Back to widgets"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {(() => {
                const { icon: WidgetIcon, bgColor, textColor } = getWidgetIconAndColor(currentWidget);
                return (
                  <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}>
                    <WidgetIcon className={`w-4 h-4 ${textColor}`} />
                  </div>
                );
              })()}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {currentWidget?.name} Settings
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {currentWidget?.description}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {/* Featured Events Settings */}
            {currentWidget?.id === 'featured-events' && (
              <FeaturedEventsSettings
                editingField={editingField}
                featuredPropertiesExpanded={featuredPropertiesExpanded}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
                onToggleFeaturedPropertiesExpanded={toggleFeaturedPropertiesExpanded}
              />
            )}

            {/* Event Categories Settings */}
            {currentWidget?.id === 'categories' && (
              <EventCategoriesSettings
                editingField={editingField}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
              />
            )}

            {/* Events Content Settings (Main Widget) */}
            {currentWidget?.id === 'events-container' && (
              <EventsContainerSettings
                editingField={editingField}
                showGroup={showGroup}
                groupOptions={groupOptions}
                layout={layout}
                cardSize={cardSize}
                cardStyle={cardStyle}
                propertiesExpanded={propertiesExpanded}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
                onGroupChange={handleGroupChange}
                onGroupOptionsChange={handleGroupOptionsChange}
                onLayoutChange={handleLayoutChange}
                onCardSizeChange={handleCardSizeChange}
                onCardStyleChange={handleCardStyleChange}
                onTogglePropertiesExpanded={togglePropertiesExpanded}
              />
            )}

            {/* Site Section Settings */}
            {(currentWidget?.id === 'site-header' || 
              currentWidget?.id === 'site-sidebar' || 
              currentWidget?.id === 'site-footer') && (
              <SiteSectionSettings
                sectionName={currentWidget?.name}
                editingField={editingField}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
              />
            )}

            {/* Basic Widget Settings */}
            {currentWidget?.id === 'title' && (
              <TitleWidgetSettings
                editingField={editingField}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
              />
            )}

            {currentWidget?.id === 'logo' && (
              <LogoWidgetSettings
                editingField={editingField}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
              />
            )}

            {currentWidget?.id === 'image' && (
              <ImageWidgetSettings
                editingField={editingField}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
              />
            )}

            {currentWidget?.id === 'video' && (
              <VideoWidgetSettings
                editingField={editingField}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
              />
            )}

            {currentWidget?.id === 'button' && (
              <ButtonWidgetSettings
                editingField={editingField}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
              />
            )}

            {currentWidget?.id === 'accordions' && (
              <AccordionsWidgetSettings
                editingField={editingField}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
              />
            )}

            {currentWidget?.id === 'canvas' && (
              <CanvasWidgetSettings
                editingField={editingField}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
              />
            )}

            {/* Advanced Widget Settings */}
            {currentWidget?.id === 'menu' && (
              <MenuWidgetSettings
                editingField={editingField}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
              />
            )}

            {(currentWidget?.id === 'hero-banner-advance' || currentWidget?.id === 'hero-banner-trending') && (
              <HeroBannerWidgetSettings
                editingField={editingField}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
              />
            )}

            {currentWidget?.id === 'announcement-banner' && (
              <AnnouncementBannerWidgetSettings
                editingField={editingField}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
              />
            )}

            {currentWidget?.id === 'html-script' && (
              <HtmlScriptWidgetSettings
                editingField={editingField}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
              />
            )}

            {currentWidget?.id === 'iframe' && (
              <IframeWidgetSettings
                editingField={editingField}
                onFieldClick={handleFieldClick}
                onFieldBlur={handleFieldBlur}
                onKeyDown={handleKeyDown}
              />
            )}
          </div>
        </div>
      ) : isAddWidgetMode ? (
        <WidgetGallery
          availableWidgets={availableWidgets}
          onAddWidget={handleAddWidget}
          onBack={handleBackFromAddWidget}
        />
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
            <div className="space-y-5 min-w-0 px-2 mt-6">
              {/* General Widgets List */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-300">
                    General widgets
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Header, sidebar, and footer sections
                  </p>
                </div>
                <div className="space-y-1">
                  {widgetSections.base.map((widget) => (
                    <div
                      key={widget.id}
                      onClick={() => handleSidebarWidgetClick(widget)}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors rounded-md group border border-gray-100 dark:border-gray-800"
                    >
                      <widget.icon className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white flex-1 truncate">
                        {widget.name}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSidebarWidgetClick(widget);
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                          title="Settings"
                        >
                          <Settings className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Widget List */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-300">
                    Main Widget
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Primary content container with events list
                  </p>
                </div>
                <div className="space-y-1">
                  {widgetSections.main.map((widget) => (
                    <div
                      key={widget.id}
                      onClick={() => handleSidebarWidgetClick(widget)}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors rounded-md group border border-gray-100 dark:border-gray-800"
                    >
                      <widget.icon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-white flex-1 truncate">
                        {widget.name}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSidebarWidgetClick(widget);
                          }}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                          title="Settings"
                        >
                          <Settings className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Widgets List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-300">
                    Custom Widgets
                  </h3>
                  <button
                    onClick={handleAddWidgetClick}
                    className="flex items-center gap-1 px-2 py-1 bg-orange-50/50 dark:bg-orange-950/10 border border-orange-200/40 dark:border-orange-800/40 text-orange-600 dark:text-orange-400 hover:bg-orange-100/50 dark:hover:bg-orange-950/20 hover:border-orange-300/60 dark:hover:border-orange-700/60 rounded text-xs font-medium transition-colors"
                    title="Add new widget"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>
                <div className="space-y-1">
                  {widgetSections.custom.map((widget) => {
                    const isHidden = hiddenWidgets.has(widget.id);
                    return (
                      <div
                        key={widget.id}
                        onClick={() => handleSidebarWidgetClick(widget)}
                        className={`flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors rounded-md group border border-gray-100 dark:border-gray-800 ${
                          isHidden ? 'opacity-50' : ''
                        }`}
                      >
                        <widget.icon className={`w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 ${
                          isHidden ? 'opacity-50' : ''
                        }`} />
                        <span className={`text-sm text-gray-900 dark:text-white flex-1 truncate ${
                          isHidden ? 'line-through opacity-60' : ''
                        }`}>
                          {widget.name}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWidgetVisibility(widget.id);
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                            title={isHidden ? "Show widget" : "Hide widget"}
                          >
                            {isHidden ? (
                              <EyeOff className="w-3 h-3 text-gray-500" />
                            ) : (
                              <Eye className="w-3 h-3 text-gray-500" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSidebarWidgetClick(widget);
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                            title="Settings"
                          >
                            <Settings className="w-3 h-3 text-gray-500" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Delete action
                            }}
                            className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3 text-gray-500" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Widget Settings Tab Content */}
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
                  <p className="text-sm mb-4 leading-relaxed">Click on any widget from the "Widgets" tab to configure its settings here.</p>
                  
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