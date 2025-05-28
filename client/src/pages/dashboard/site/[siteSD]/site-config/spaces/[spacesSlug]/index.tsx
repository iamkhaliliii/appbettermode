import { useRoute, useLocation } from "wouter";
import { useState, useEffect, useMemo } from "react";
import { BrowserMockup } from "@/components/layout/dashboard/browser-mockup";
import { AddContentDialog } from "@/components/ui/add-content-dialog";
import { SpaceSettingsSidebar } from "@/components/layout/dashboard/secondary-sidebar/SpaceSettingsSidebar";
import { SpaceContent } from "@/components/dashboard/site-config/SpaceContent";
import { SettingsSidebar } from "@/components/dashboard/site-config/SettingsSidebar";
import { DashboardPageWrapper } from "@/components/dashboard/DashboardPageWrapper";

// CSS to disable all links in the preview
const disableLinksStyle = `
  .preview-container a {
    pointer-events: none !important;
    cursor: default !important;
    color: inherit !important;
    text-decoration: none !important;
  }
`;

export default function SpaceSettingsPage() {
  const [, params] = useRoute('/dashboard/site/:siteSD/site-config/spaces/:spacesSlug');
  const [location, setLocation] = useLocation();
  const siteSD = params?.siteSD || '';
  const spacesSlug = params?.spacesSlug || '';
  
  const [addContentDialogOpen, setAddContentDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
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
      <div className="flex relative">
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
          />
        </div>
        
        {/* Browser Preview - Full width when sidebar is hidden */}
        <div className={`flex-1 p-4 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarVisible ? 'ml-80' : 'ml-0'
        }`}>
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 dark:scrollbar-thumb-gray-700">
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
                <SpaceContent siteSD={siteSD} spaceSlug={spacesSlug} />
              </div>
            </BrowserMockup>
          </div>
        </div>
      </div>
    </DashboardPageWrapper>
  );
} 