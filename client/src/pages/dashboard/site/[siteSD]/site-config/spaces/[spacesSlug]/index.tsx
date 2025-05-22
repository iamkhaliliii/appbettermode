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
          onTabChange={setActiveTab}
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
      <div className="flex">
        <div className="h-[calc(100vh-54px)] scrollbar-thin scrollbar-thumb-gray-100 dark:scrollbar-thumb-gray-700 overflow-y-auto">
          {/* Settings Sidebar - Now on the left */}
          <SettingsSidebar 
            siteSD={siteSD} 
            spacesSlug={spacesSlug} 
            activeTab={activeTab} 
          />
        </div>
        {/* Browser Preview - Now on the right */}
        <div className="flex-1 p-4 flex flex-col">
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