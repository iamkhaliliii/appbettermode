import { useLocation, useRoute } from "wouter";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BrowserMockup } from "@/components/layout/dashboard/browser-mockup";
import { AddContentDialog } from "@/components/ui/add-content-dialog";
import { SpaceContent } from "@/components/dashboard/site-config/SpaceContent";
import { SiteContent } from "../../../../../components/dashboard/site-config/SiteContent";
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

export default function SiteSpecificConfigPage() {
  const [, params] = useRoute('/dashboard/site/:siteSD/site-config');
  const siteSD = params?.siteSD || '';
  
  const [location, setLocation] = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [responsiveDropdownOpen, setResponsiveDropdownOpen] = useState(false);
  const [addContentDialogOpen, setAddContentDialogOpen] = useState(false);
  
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const isFeed = location.includes('/spaces/feed');

  // Set up keyboard shortcut for opening the dialog
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if key 'n' is pressed and no input elements are focused
      if (
        event.key === 'n' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        setAddContentDialogOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <DashboardPageWrapper 
      siteSD={siteSD}
      onNewContent={() => setAddContentDialogOpen(true)}
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
      <div className="w-full p-4">
        <BrowserMockup
          userDropdownOpen={userDropdownOpen}
          setUserDropdownOpen={setUserDropdownOpen}
          languageDropdownOpen={languageDropdownOpen}
          setLanguageDropdownOpen={setLanguageDropdownOpen}
          themeDropdownOpen={themeDropdownOpen}
          setThemeDropdownOpen={setThemeDropdownOpen}
          responsiveDropdownOpen={responsiveDropdownOpen}
          setResponsiveDropdownOpen={setResponsiveDropdownOpen}
        >
          <div 
            key={selectedSpace ? `space-content-${selectedSpace}` : `site-content-${siteSD}`}
            className="w-full h-full transition-opacity duration-300"
          >
            {selectedSpace ? (
              <SpaceContent siteSD={siteSD} spaceSlug={selectedSpace} />
            ) : (
              <SiteContent siteSD={siteSD} />
            )}
          </div>
        </BrowserMockup>
      </div>
    </DashboardPageWrapper>
  );
} 