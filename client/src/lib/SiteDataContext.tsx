import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { sitesApi, Site } from '@/lib/api';

interface SiteDataContextType {
  sites: Record<string, Site>;
  isLoading: boolean;
  cmsTypes: any[];
  loadSite: (siteSD: string) => Promise<Site | null>;
  clearCache: () => void;
  invalidateSite: (siteSD: string) => void;
}

const SiteDataContext = createContext<SiteDataContextType>({
  sites: {},
  isLoading: false,
  cmsTypes: [],
  loadSite: async () => null,
  clearCache: () => {},
  invalidateSite: () => {},
});

interface SiteDataProviderProps {
  children: ReactNode;
}

export const SiteDataProvider: React.FC<SiteDataProviderProps> = ({ children }) => {
  const [sites, setSites] = useState<Record<string, Site>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [cmsTypes, setCmsTypes] = useState<any[]>([]);
  
  // Load site data and cache it
  const loadSite = useCallback(async (siteSD: string): Promise<Site | null> => {
    // Check cache first
    if (sites[siteSD]) {
      return sites[siteSD];
    }
    
    setIsLoading(true);
    
    try {
      const siteData = await sitesApi.getSite(siteSD);
      
      if (siteData) {
        // Update cache
        setSites(prev => ({
          ...prev,
          [siteSD]: siteData
        }));
        
        return siteData;
      }
      
      return null;
    } catch (error) {
      console.error(`Error loading site data for ${siteSD}:`, error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [sites]);
  
  // Clear the entire cache
  const clearCache = useCallback(() => {
    setSites({});
  }, []);
  
  // Invalidate a specific site in the cache
  const invalidateSite = useCallback((siteSD: string) => {
    setSites(prev => {
      const newSites = { ...prev };
      delete newSites[siteSD];
      return newSites;
    });
  }, []);
  
  return (
    <SiteDataContext.Provider value={{ 
      sites, 
      isLoading, 
      cmsTypes,
      loadSite,
      clearCache,
      invalidateSite
    }}>
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => useContext(SiteDataContext); 