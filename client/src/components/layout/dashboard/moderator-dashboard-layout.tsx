import { useState, useEffect, useCallback, memo } from "react";
import { Header } from "./header";
import { ModeratorMainSidebar } from "./moderator-main-sidebar";
import { SecondarySidebar } from "./secondary-sidebar/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { type NavItem } from "./secondary-sidebar/types";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

interface ModeratorDashboardLayoutProps {
  children: React.ReactNode;
  siteName?: string;        // Optional: Name of the current site, to be displayed possibly in Header or SecondarySidebar
  currentSiteIdentifier?: string;   // Optional: ID of the current site, can be used for dynamic links or data fetching within layout
  navItems?: NavItem[];     // Optional: Navigation items specific to the current site/context for SecondarySidebar
  onNewContent?: () => void; // Optional: Function to call when the New button is clicked in the secondary sidebar
  secondarySidebar?: React.ReactNode; // Optional: Custom secondary sidebar component
}

const ModeratorDashboardLayoutComponent = ({
  children,
  siteName,
  currentSiteIdentifier,
  navItems = [],
  onNewContent,
  secondarySidebar
}: ModeratorDashboardLayoutProps) => {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle search functionality
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // Implement search logic here
    console.log("Searching for:", query);
  }, []);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  }, [searchQuery, handleSearch]);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery("");
    }
  }, [isSearchOpen]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  // Close search on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        toggleSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, toggleSearch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header 
        onToggleMobileMenu={toggleMobileMenu} 
        variant="dashboard"
        siteName={siteName}
        siteIdentifier={currentSiteIdentifier}
      />
      
      <div className="flex h-[calc(100vh-3rem)]">
        {/* Main Sidebar - Moderator Version */}
        <ModeratorMainSidebar 
          collapsed={isMobile} 
          currentSiteIdentifier={currentSiteIdentifier}
        />
        
        {/* Secondary Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          {secondarySidebar || (
            <SecondarySidebar
              currentSiteIdentifier={currentSiteIdentifier}
              siteName={siteName}
              navItems={navItems}
              onNewContent={onNewContent}
            />
          )}
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3"
              >
                <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search content, people, or moderation items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-10"
                      autoFocus
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={toggleSearch}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export const ModeratorDashboardLayout = memo(ModeratorDashboardLayoutComponent); 