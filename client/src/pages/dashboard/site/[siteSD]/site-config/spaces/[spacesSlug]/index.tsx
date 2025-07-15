import { useRoute, useLocation } from "wouter";
import { useState, useEffect, useMemo, useCallback } from "react";
import { BrowserMockup } from "@/components/layout/dashboard/browser-mockup";
import { AddContentDialog } from "@/components/features/content";
import { SpaceSettingsSidebar } from "@/components/layout/dashboard/secondary-sidebar/SpaceSettingsSidebar";
import { SpaceContent } from "@/components/dashboard/site-config/SpaceContent";
import { SettingsSidebar } from "@/components/dashboard/site-config/SettingsSidebar";
import { DashboardPageWrapper } from "@/components/dashboard/DashboardPageWrapper";
import { widgetSections, availableWidgets, type AvailableWidget } from "@/components/dashboard/site-config/widgets";
import { CustomizePlusTab } from "@/components/dashboard/site-config/CustomizePlusTab";
import { cn } from "@/lib/utils";



// CSS to disable all links in the preview and improve dark mode
const disableLinksStyle = `
  .preview-container a {
    pointer-events: none !important;
    cursor: default !important;
    color: inherit !important;
    text-decoration: none !important;
  }
  
  /* Custom scrollbar for dark mode */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgb(209 213 219);
    border-radius: 3px;
  }
  
  .dark ::-webkit-scrollbar-thumb {
    background: rgb(55 65 81);
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(156 163 175);
  }
  
  .dark ::-webkit-scrollbar-thumb:hover {
    background: rgb(75 85 99);
  }
`;

export default function SpaceSettingsPage() {
  const [, params] = useRoute('/dashboard/site/:siteSD/site-config/spaces/:spacesSlug');
  const [location, setLocation] = useLocation();
  const siteSD = params?.siteSD || '';
  const spacesSlug = params?.spacesSlug || '';
  
  // Main states - simplified
  const [addContentDialogOpen, setAddContentDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
  // Space banner state for live preview
  const [spaceBanner, setSpaceBanner] = useState(false);
  const [spaceBannerUrl, setSpaceBannerUrl] = useState('');
  
  // Save state for browser preview
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Events layout state
  const [eventsLayout, setEventsLayout] = useState('card');
  const [cardSize, setCardSize] = useState('medium');
  const [cardStyle, setCardStyle] = useState('modern');
  
  // Widget mode state
  const [isAddWidgetMode, setIsAddWidgetMode] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<any>(null);
  const [isWidgetSettingsMode, setIsWidgetSettingsMode] = useState(false);
  
  // Browser mockup state - consolidated
  const [browserState, setBrowserState] = useState({
    userDropdownOpen: false,
    languageDropdownOpen: false,
    themeDropdownOpen: false,
    responsiveDropdownOpen: false
  });
  
  // Space header settings state for live preview
  const [spaceHeaderSettings, setSpaceHeaderSettings] = useState<any>(null);
  
  // Memoized values
  const displaySpaceName = useMemo(() => {
    return spacesSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [spacesSlug]);

  const siteUrl = useMemo(() => `/site/${siteSD}/${spacesSlug}`, [siteSD, spacesSlug]);

  // Event handlers - optimized with useCallback
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
    if (!sidebarVisible) {
      setSidebarVisible(true);
    }
  }, [sidebarVisible]);

  const handleSave = useCallback(() => {
    setIsLoading(true);
    // Simulate save process
    setTimeout(() => {
      setIsLoading(false);
      setHasChanges(false);
    }, 1000);
  }, []);

  const handleDiscard = useCallback(() => {
    setHasChanges(false);
  }, []);

  // Layout change handler
  const handleLayoutChange = useCallback((layout: string) => {
    setEventsLayout(layout);
    console.log('Layout changed to:', layout);
  }, []);

  // Card size change handler
  const handleCardSizeChange = useCallback((size: string) => {
    setCardSize(size);
    console.log('Card size changed to:', size);
  }, []);
  
  // Space header settings handler
  const handleSpaceHeaderSettingsChange = useCallback((settings: any) => {
    setSpaceHeaderSettings(settings);
    setHasChanges(true);
  }, []);

  // Card style change handler
  const handleCardStyleChange = useCallback((style: string) => {
    setCardStyle(style);
    console.log('Card style changed to:', style);
  }, []);

  // Add widget mode handler
  const handleAddWidgetModeChange = useCallback((isAddWidgetMode: boolean) => {
    setIsAddWidgetMode(isAddWidgetMode);
    console.log('Add widget mode:', isAddWidgetMode);
  }, []);

  // Browser state handlers
  const updateBrowserState = useCallback((key: string, value: boolean) => {
    setBrowserState(prev => ({ ...prev, [key]: value }));
  }, []);

  // Widget click handler to open settings
  const handleWidgetClick = useCallback((widget: any) => {
    // Reduced debug logging to prevent spam
    // console.log('🔧 handleWidgetClick called with widget:', widget?.name);
    // console.log('🔧 Current state before update:', {
    //   selectedWidget: selectedWidget?.name,
    //   isWidgetSettingsMode,
    //   activeTab
    // });
    
    // Always set the new widget state - React will handle the transition
    setSelectedWidget(widget);
    setIsWidgetSettingsMode(true);
    // console.log('✅ Widget state set to:', widget?.name);
    
    // Switch to widget tab if not already there
    if (activeTab !== 'widget') {
      setActiveTab('widget');
    }
    
    // Ensure sidebar is visible
    if (!sidebarVisible) {
      setSidebarVisible(true);
    }
  }, [activeTab, sidebarVisible, selectedWidget, isWidgetSettingsMode]);

  // Handle widget settings mode change
  const handleWidgetSettingsModeChange = useCallback((isWidgetSettingsMode: boolean) => {
    setIsWidgetSettingsMode(isWidgetSettingsMode);
    if (!isWidgetSettingsMode) {
      setSelectedWidget(null);
    }
  }, []);

  // Create widget mapping for sections
  const getWidgetForSection = useCallback((sectionName: string) => {
    const sectionMap: Record<string, any> = {
      // From SpaceContent.tsx GeneralWidgetPopover components
      'header': widgetSections.base.find(w => w.id === 'site-header'),
      'sidebar': widgetSections.base.find(w => w.id === 'site-sidebar'), 
      'footer': widgetSections.base.find(w => w.id === 'site-footer'),
      // From EventContent GeneralWidgetPopover components
      'featuredEvents': widgetSections.custom.find(w => w.id === 'featured-events'),
      'spaceHeader': widgetSections.main.find(w => w.id === 'space-header'),
      'eventsContainer': widgetSections.main.find(w => w.id === 'events-container'),
      'categories': widgetSections.custom.find(w => w.id === 'categories'),
      // From dropped widgets
      'featured-events': widgetSections.custom.find(w => w.id === 'featured-events'),
      'hero-banner': { id: 'hero-banner', name: 'Hero Banner', icon: () => null },
      'calendar': { id: 'calendar', name: 'Calendar', icon: () => null },
      // Basic Widgets - from availableWidgets
      'title': availableWidgets.find((w: AvailableWidget) => w.id === 'title'),
      'logo': availableWidgets.find((w: AvailableWidget) => w.id === 'logo'),
      'image': availableWidgets.find((w: AvailableWidget) => w.id === 'image'),
      'video': availableWidgets.find((w: AvailableWidget) => w.id === 'video'),
      'button': availableWidgets.find((w: AvailableWidget) => w.id === 'button'),
      'accordions': availableWidgets.find((w: AvailableWidget) => w.id === 'accordions'),
      // Content Widgets - from availableWidgets
      'space-header': availableWidgets.find((w: AvailableWidget) => w.id === 'space-header'),
      'members-list': availableWidgets.find((w: AvailableWidget) => w.id === 'members-list'),
      'spaces-list': availableWidgets.find((w: AvailableWidget) => w.id === 'spaces-list'),
      // Advanced Widgets - from availableWidgets
      'canvas': availableWidgets.find((w: AvailableWidget) => w.id === 'canvas'),
      'menu': availableWidgets.find((w: AvailableWidget) => w.id === 'menu'),
      'hero-banner-advance': availableWidgets.find((w: AvailableWidget) => w.id === 'hero-banner-advance'),
      'hero-banner-trending': availableWidgets.find((w: AvailableWidget) => w.id === 'hero-banner-trending'),
      'announcement-banner': availableWidgets.find((w: AvailableWidget) => w.id === 'announcement-banner'),
      'html-script': availableWidgets.find((w: AvailableWidget) => w.id === 'html-script'),
      'iframe': availableWidgets.find((w: AvailableWidget) => w.id === 'iframe')
    };
    
    return sectionMap[sectionName] || null;
  }, []);

  // Handle section settings click from mockup
  const handleSectionSettings = useCallback((sectionName: string) => {
    const widget = getWidgetForSection(sectionName);
    if (widget) {
      handleWidgetClick(widget);
    } else {
      console.error('No widget found for section:', sectionName);
    }
  }, [getWidgetForSection, handleWidgetClick]);

  return (
    <DashboardPageWrapper 
      siteSD={siteSD}
      onNewContent={() => setAddContentDialogOpen(true)}
      secondarySidebar={
        <SpaceSettingsSidebar 
          siteSD={siteSD} 
          spaceName={displaySpaceName} 
          spaceSlug={spacesSlug}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      }
    >
      {/* CSS to disable links in preview */}
      <style>{disableLinksStyle}</style>
      
      {/* Add Content Dialog */}
      <AddContentDialog
        open={addContentDialogOpen}
        onOpenChange={setAddContentDialogOpen}
      />

      <div className={cn(
        "flex relative min-h-[calc(100vh-4rem)]",
        activeTab === 'customize-plus' ? "bg-gray-100 dark:bg-gray-950" : "bg-gray-50 dark:bg-gray-900"
      )}>
        {/* Settings Sidebar - Hidden when in customize-plus mode */}
        {activeTab !== 'customize-plus' && (
          <div 
            className={`absolute left-0 top-0 h-[calc(100vh-54px)] z-10 transform transition-transform duration-300 ease-in-out ${
              sidebarVisible ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <SettingsSidebar 
              siteSD={siteSD} 
              spacesSlug={spacesSlug} 
              activeTab={activeTab}
              onClose={() => setSidebarVisible(false)}
              spaceBanner={spaceBanner}
              setSpaceBanner={setSpaceBanner}
              spaceBannerUrl={spaceBannerUrl}
              setSpaceBannerUrl={setSpaceBannerUrl}
              hasChanges={hasChanges}
              setHasChanges={setHasChanges}
              isLoading={isLoading}
              onSave={handleSave}
              onDiscard={handleDiscard}
              onLayoutChange={handleLayoutChange}
              onCardSizeChange={handleCardSizeChange}
              onCardStyleChange={handleCardStyleChange}
              onAddWidgetModeChange={handleAddWidgetModeChange}
              onWidgetSettingsModeChange={handleWidgetSettingsModeChange}
              onSpaceHeaderSettingsChange={handleSpaceHeaderSettingsChange}
              currentLayout={eventsLayout}
              currentCardSize={cardSize}
              currentCardStyle={cardStyle}
              selectedWidget={selectedWidget}
              isWidgetSettingsMode={isWidgetSettingsMode}
            />
          </div>
        )}
        
        {/* Browser Preview - Full width when sidebar is hidden or in customize-plus mode */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          activeTab === 'customize-plus' ? 'ml-0 px-4 py-6' : (sidebarVisible ? 'ml-80 p-4' : 'ml-0 p-4')
        }`}>
                    <div className="flex-1">
            <BrowserMockup
              userDropdownOpen={browserState.userDropdownOpen}
              setUserDropdownOpen={(value) => updateBrowserState('userDropdownOpen', value)}
              languageDropdownOpen={browserState.languageDropdownOpen}
              setLanguageDropdownOpen={(value) => updateBrowserState('languageDropdownOpen', value)}
              themeDropdownOpen={browserState.themeDropdownOpen}
              setThemeDropdownOpen={(value) => updateBrowserState('themeDropdownOpen', value)}
              responsiveDropdownOpen={browserState.responsiveDropdownOpen}
              setResponsiveDropdownOpen={(value) => updateBrowserState('responsiveDropdownOpen', value)}
              hasChanges={hasChanges}
              isLoading={isLoading}
              isWidgetMode={activeTab === 'widget' && sidebarVisible}
              fullWidth={activeTab === 'customize-plus'}
              disableScale={activeTab === 'customize-plus'}
              onSave={handleSave}
              onDiscard={handleDiscard}
            >
              <div 
                key={`space-content-${spacesSlug}`} 
                className="w-full transition-opacity duration-300"
              >
                {activeTab === 'customize-plus' ? (
                  // Advanced editor inside browser frame
                  <div className="h-full bg-white dark:bg-gray-900">
                    <div className="h-full flex flex-col">
                      {/* Header inside browser */}
                      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-purple-500 rounded-md"></div>
                            <div>
                              <h1 className="text-base font-semibold text-gray-900 dark:text-white">
                                {displaySpaceName} - Advanced Editor
                              </h1>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Use "/" to add widgets, polls, and content blocks directly
                              </p>
                            </div>
                          </div>
                          <div className="text-xs text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20 px-3 py-1 rounded-full">
                            Live Editor
                          </div>
                        </div>
                      </div>
                      
                      {/* Advanced Content Editor - Full Height */}
                      <div className="flex-1 overflow-hidden">
                        <CustomizePlusTab 
                          initialContent={[]}
                          onContentSave={(content: any[]) => {
                            console.log('Saving advanced layout content:', content);
                            setHasChanges(false);
                          }}
                          onWidgetAdd={(widget: AvailableWidget) => {
                            console.log('Widget added in advanced mode:', widget);
                            setHasChanges(true);
                          }}
                          onWidgetEdit={(widgetId: string, settings: any) => {
                            console.log('Widget edited in advanced mode:', widgetId, settings);
                            setHasChanges(true);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Normal space content for other tabs
                  <SpaceContent 
                    siteSD={siteSD} 
                    spaceSlug={spacesSlug} 
                    spaceBanner={spaceBanner}
                    spaceBannerUrl={spaceBannerUrl}
                    isWidgetMode={activeTab === 'widget' && sidebarVisible}
                    isAddWidgetMode={isAddWidgetMode}
                    eventsLayout={eventsLayout}
                    cardSize={cardSize}
                    cardStyle={cardStyle}
                    spaceHeaderSettings={spaceHeaderSettings}
                    onSectionSettings={handleSectionSettings}
                  />
                )}
              </div>
            </BrowserMockup>
          </div>
        </div>
      </div>


    </DashboardPageWrapper>
  );
} 