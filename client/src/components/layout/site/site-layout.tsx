import React, { useState, useCallback } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/layout/dashboard/header';
import { SiteHeader } from '@/components/layout/site/site-header';
import { SiteContext } from '@/pages/site/[siteSD]';
import { SearchModal } from '@/components/features/search';

interface SiteLayoutProps {
  children: React.ReactNode;
  siteSD: string;
  site?: any;
}

export function SiteLayout({ children, siteSD, site: propSite }: SiteLayoutProps) {
  const [location, setLocation] = useLocation();
  const siteContext = React.useContext(SiteContext);
  const site = propSite || siteContext?.site;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  
  // Check if we're on search page
  const isSearchPage = location.includes('/search');

  // Memoize handlers to prevent unnecessary re-renders
  const handleToggleMobileMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  // Handle search
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/site/${siteSD}/search?q=${encodeURIComponent(searchQuery)}`);
    }
  }, [searchQuery, siteSD, setLocation]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // Handle search input click to open modal
  const handleSearchInputClick = useCallback(() => {
    setIsSearchModalOpen(true);
  }, []);

  // Handle keyboard shortcut to open search modal
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    }
    
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      <Header
        onToggleMobileMenu={handleToggleMobileMenu}
        variant="site"
        siteName={site?.name}
        siteIdentifier={siteSD}
      />
      <SiteHeader 
        siteSD={siteSD}
        site={site} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen}
        searchQuery={searchQuery}
        setSearchQuery={handleSearchChange}
        handleSearch={handleSearch}
        onSearchInputClick={handleSearchInputClick}
        isSearchPage={isSearchPage}
      />
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => {
          setIsSearchModalOpen(false);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        siteSD={siteSD}
      />
      
      {/* Page content */}
      {children}
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              {site?.logo_url ? (
                <img src={site.logo_url} alt={site.name} className="h-8 w-8 object-contain" />
              ) : (
                <div 
                  className="h-8 w-8 rounded-md flex items-center justify-center font-bold text-white"
                  style={{ 
                    backgroundColor: site?.brand_color || '#6366f1',
                  }}
                >
                  {site?.name?.substring(0, 1) || 'S'}
                </div>
              )}
              <span className="font-semibold text-gray-900 dark:text-white">
                {site?.name || 'Community'}
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} {site?.name || 'Community'} - Powered by BetterMode
            </div>
          </div>
        </div>
      </footer>
    </>
  );
} 