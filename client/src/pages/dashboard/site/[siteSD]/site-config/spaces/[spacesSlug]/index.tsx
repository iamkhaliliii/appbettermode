import { useRoute, useLocation } from "wouter";
import { useState, useEffect, useMemo, useCallback } from "react";
import { BrowserMockup } from "@/components/layout/dashboard/browser-mockup";
import { AddContentDialog } from "@/components/features/content";
import { SpaceSettingsSidebar } from "@/components/layout/dashboard/secondary-sidebar/SpaceSettingsSidebar";
import { SpaceContent } from "@/components/dashboard/site-config/SpaceContent";
import { SettingsSidebar } from "@/components/dashboard/site-config/SettingsSidebar";
import { DashboardPageWrapper } from "@/components/dashboard/DashboardPageWrapper";



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
  
  // Browser mockup state - consolidated
  const [browserState, setBrowserState] = useState({
    userDropdownOpen: false,
    languageDropdownOpen: false,
    themeDropdownOpen: false,
    responsiveDropdownOpen: false
  });
  
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
    if (activeTab === tabId && sidebarVisible) {
      setSidebarVisible(false);
    } else {
      setActiveTab(tabId);
      setSidebarVisible(true);
    }

  }, [activeTab, sidebarVisible]);

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

      <div className="flex relative bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-4rem)]">
        {/* Settings Sidebar - Sliding from left */}
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
            currentLayout={eventsLayout}
            currentCardSize={cardSize}
            currentCardStyle={cardStyle}
          />
        </div>
        
        {/* Browser Preview - Full width when sidebar is hidden */}
        <div className={`flex-1 p-4 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarVisible ? 'ml-80' : 'ml-0'
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
              siteUrl={siteUrl}
              hasChanges={hasChanges}
              isLoading={isLoading}
              isWidgetMode={activeTab === 'widget' && sidebarVisible}
              onSave={handleSave}
              onDiscard={handleDiscard}
            >
              <div 
                key={`space-content-${spacesSlug}`} 
                className="w-full transition-opacity duration-300"
              >
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
                />
              </div>
            </BrowserMockup>
          </div>
        </div>
      </div>


    </DashboardPageWrapper>
  );
} 