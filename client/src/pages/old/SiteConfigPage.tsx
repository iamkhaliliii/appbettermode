import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import {
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Plus,
  Moon,
  X,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BrowserMockup } from "@/components/layout/browser-mockup";
import { CommunityContent } from "@/components/layout/community-content";
import { AddContentDialog } from "@/components/ui/add-content-dialog";

export default function SiteConfigPage() {
  const [location, setLocation] = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [responsiveDropdownOpen, setResponsiveDropdownOpen] = useState(false);
  const [addContentDialogOpen, setAddContentDialogOpen] = useState(false);
  
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
    <DashboardLayout>
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
          <CommunityContent isFeed={isFeed} setLocation={setLocation} />
        </BrowserMockup>
      </div>
    </DashboardLayout>
  );
} 