import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { sitesApi, cmsTypesApi, Site } from '@/lib/api';

// Data context interface
interface SiteDataContextType {
  sites: Record<string, Site>;
  cmsTypes: any[];
  loadSite: (siteSD: string) => Promise<Site | null>;
  isLoading: boolean;
}

// Create context with default values
const SiteDataContext = createContext<SiteDataContextType>({
  sites: {},
  cmsTypes: [],
  loadSite: async () => null,
  isLoading: false,
});

// Hook to use the site data context
export const useSiteData = () => useContext(SiteDataContext);

interface SiteDataProviderProps {
  children: ReactNode;
}

export function SiteDataProvider({ children }: SiteDataProviderProps) {
  const [sites, setSites] = useState<Record<string, Site>>({});
  const [cmsTypes, setCmsTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cmsTypesLoaded, setCmsTypesLoaded] = useState(false);

  // Load CMS types once
  useEffect(() => {
    const loadCmsTypes = async () => {
      try {
        const types = await cmsTypesApi.getAllCmsTypes();
        setCmsTypes(types);
        setCmsTypesLoaded(true);
      } catch (err) {
        console.error("Error loading CMS types:", err);
        setCmsTypesLoaded(true);
      }
    };

    if (!cmsTypesLoaded) {
      loadCmsTypes();
    }
  }, [cmsTypesLoaded]);

  // Function to load a site data (cached or from API)
  const loadSite = async (siteSD: string): Promise<Site | null> => {
    // If we already have the site data cached, return it
    if (sites[siteSD]) {
      return sites[siteSD];
    }

    // Otherwise, fetch from API
    setIsLoading(true);
    try {
      const siteData = await sitesApi.getSite(siteSD);
      
      // Cache the result
      setSites(prev => ({
        ...prev,
        [siteSD]: siteData
      }));
      
      setIsLoading(false);
      return siteData;
    } catch (err) {
      console.error(`Error loading site ${siteSD}:`, err);
      setIsLoading(false);
      return null;
    }
  };

  const value = {
    sites,
    cmsTypes,
    loadSite,
    isLoading
  };

  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  );
} 