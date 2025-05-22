import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useLocation } from 'wouter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { sitesApi, Site } from '@/lib/api';
import { Header } from '../dashboard/header';
import { SiteHeader } from './site-header';
import { motion, AnimatePresence } from 'framer-motion';
import { useSiteData } from '@/lib/SiteDataContext';

interface SiteLayoutProps {
  children: React.ReactNode;
  siteSD: string;
}

export const SiteLayout = memo(({ children, siteSD }: SiteLayoutProps) => {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use centralized site data from context
  const { sites, loadSite, isLoading: contextLoading } = useSiteData();
  const [site, setSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize the site info to prevent unnecessary re-renders
  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteSD) return;
      
      // First check if site is already in the context
      if (sites[siteSD]) {
        setSite(sites[siteSD]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // If not in context, load the site (which will add it to context for future use)
        const siteData = await loadSite(siteSD);
        if (siteData) {
          setSite(siteData);
        }
      } catch (error) {
        console.error('Failed to fetch site data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, [siteSD, sites, loadSite]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleToggleMobileMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/site/${siteSD}/search?q=${encodeURIComponent(searchQuery)}`;
    }
  }, [searchQuery, siteSD]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // Memoize isActive check for performance
  const isActive = useCallback((path: string) => {
    return location.includes(path);
  }, [location]);

  // Memoize the year for footer
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  // Memoize the footer component to prevent unnecessary re-renders
  const Footer = useMemo(() => (
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
            © {currentYear} {site?.name || 'Community'} - Powered by BetterMode
          </div>
        </div>
      </div>
    </footer>
  ), [site, currentYear]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
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
      />
      
      {/* Main Content with animation */}
      <AnimatePresence mode="wait">
        <motion.main 
          className="flex-1"
          key={location}
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.8 }}
          transition={{ duration: 0.15 }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      {/* Footer */}
      {Footer}
    </div>
  );
});

SiteLayout.displayName = 'SiteLayout'; 