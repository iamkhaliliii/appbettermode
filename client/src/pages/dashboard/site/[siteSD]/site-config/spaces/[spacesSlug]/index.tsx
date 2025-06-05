import { useRoute, useLocation } from "wouter";
import { useState, useEffect, useMemo } from "react";
import { BrowserMockup } from "@/components/layout/dashboard/browser-mockup";
import { AddContentDialog } from "@/components/ui/add-content-dialog";
import { SpaceSettingsSidebar } from "@/components/layout/dashboard/secondary-sidebar/SpaceSettingsSidebar";
import { SpaceContent } from "@/components/dashboard/site-config/SpaceContent";
import { SettingsSidebar } from "@/components/dashboard/site-config/SettingsSidebar";
import { DashboardPageWrapper } from "@/components/dashboard/DashboardPageWrapper";
import { getWidgetPreview } from "@/components/dashboard/site-config/WidgetSettingsTab";

interface Widget {
  id: string;
  name: string;
  icon: any;
  description: string;
}

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
  
  const [addContentDialogOpen, setAddContentDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [sidebarVisible, setSidebarVisible] = useState(true);
  
  // Widget tooltip state
  const [hoveredWidget, setHoveredWidget] = useState<Widget | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  
  // Browser mockup state
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [responsiveDropdownOpen, setResponsiveDropdownOpen] = useState(false);
  
  // Memoize the display space name to avoid recalculation on each render
  const displaySpaceName = useMemo(() => {
    return spacesSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [spacesSlug]);

  // Construct the URL for display in browser mockup - memoize to avoid recalculation
  const siteUrl = useMemo(() => `/site/${siteSD}/${spacesSlug}`, [siteSD, spacesSlug]);

  // Handle tab change and show sidebar
  const handleTabChange = (tabId: string) => {
    if (activeTab === tabId && sidebarVisible) {
      // If clicking the same tab and sidebar is visible, close it
      setSidebarVisible(false);
    } else {
      // Otherwise, set the new tab and show sidebar
      setActiveTab(tabId);
      setSidebarVisible(true);
    }
  };

  // Handle widget hover for tooltip
  const handleWidgetHover = (widget: Widget | null, position: { x: number; y: number }) => {
    setHoveredWidget(widget);
    setHoverPosition(position);
  };

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
      <style>
        {disableLinksStyle}
      </style>
      
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
            onWidgetHover={handleWidgetHover}
          />
        </div>
        
        {/* Browser Preview - Full width when sidebar is hidden */}
        <div className={`flex-1 p-4 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarVisible ? 'ml-80' : 'ml-0'
        }`}>
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <BrowserMockup
              userDropdownOpen={userDropdownOpen}
              setUserDropdownOpen={setUserDropdownOpen}
              languageDropdownOpen={languageDropdownOpen}
              setLanguageDropdownOpen={setLanguageDropdownOpen}
              themeDropdownOpen={themeDropdownOpen}
              setThemeDropdownOpen={setThemeDropdownOpen}
              responsiveDropdownOpen={responsiveDropdownOpen}
              setResponsiveDropdownOpen={setResponsiveDropdownOpen}
              siteUrl={siteUrl}
            >
              <div 
                key={`space-content-${spacesSlug}`} 
                className="w-full h-full transition-opacity duration-300"
              >
                <SpaceContent 
                  siteSD={siteSD} 
                  spaceSlug={spacesSlug} 
                  isWidgetMode={activeTab === 'widget' && sidebarVisible}
                />
              </div>
            </BrowserMockup>
          </div>
        </div>
      </div>

      {/* Widget Hover Tooltip */}
      {hoveredWidget && (
        <div 
          className="fixed pointer-events-none"
          style={{
            left: `${hoverPosition.x + 15}px`,
            top: `${hoverPosition.y - 10}px`,
            zIndex: 99999
          }}
        >
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl dark:shadow-black/20 p-4 w-80 h-60">
            {/* Widget Preview */}
            <div className="mb-4 border border-gray-100 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900 h-32 overflow-hidden">
              <div className="h-full">
                {getWidgetPreview(hoveredWidget)}
              </div>
            </div>
            
            {/* Widget Info */}
            <div className="space-y-2 h-16">
              <div className="flex items-center gap-2">
                <hoveredWidget.icon className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                  {hoveredWidget.name}
                </h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 overflow-hidden">
                {hoveredWidget.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </DashboardPageWrapper>
  );
} 