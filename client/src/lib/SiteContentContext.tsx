import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { sitesApi, cmsTypesApi } from '@/lib/api';
import { getApiUrl } from '@/lib/utils';

// Define interfaces for the context data
interface Space {
  id: string;
  name: string;
  slug: string;
  description?: string;
  cms_type?: string;
  cms_type_name?: string;
  hidden?: boolean;
  visibility?: string;
  display_name?: string;
  site_id?: string;
}

interface CmsType {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon_name?: string;
  favorite?: boolean;
  type?: string;
  fields?: any[];
}

interface SiteContentContextType {
  // Spaces data
  spaces: Record<string, Space[]>;
  spacesLoading: Record<string, boolean>;
  spacesError: Record<string, string | null>;
  
  // CMS Types data
  cmsTypes: CmsType[];
  cmsTypesByCategory: Record<string, CmsType[]>;
  cmsTypesLoading: boolean;
  cmsTypesError: string | null;
  
  // Actions
  fetchSpaces: (siteId: string) => Promise<Space[]>;
  fetchCmsTypes: (category?: string) => Promise<CmsType[]>;
  clearCache: () => void;
  invalidateSiteSpaces: (siteId: string) => void;
}

// Create the context
const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

// Provider props interface
interface SiteContentProviderProps {
  children: ReactNode;
}

// Custom hook to use the context
export const useSiteContent = () => {
  const context = useContext(SiteContentContext);
  if (context === undefined) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};

export const SiteContentProvider: React.FC<SiteContentProviderProps> = ({ children }) => {
  // State for spaces
  const [spaces, setSpaces] = useState<Record<string, Space[]>>({});
  const [spacesLoading, setSpacesLoading] = useState<Record<string, boolean>>({});
  const [spacesError, setSpacesError] = useState<Record<string, string | null>>({});
  
  // State for CMS types
  const [cmsTypes, setCmsTypes] = useState<CmsType[]>([]);
  const [cmsTypesByCategory, setCmsTypesByCategory] = useState<Record<string, CmsType[]>>({});
  const [cmsTypesLoading, setCmsTypesLoading] = useState<boolean>(false);
  const [cmsTypesError, setCmsTypesError] = useState<string | null>(null);
  
  // Fetch spaces for a specific site
  const fetchSpaces = useCallback(async (siteId: string): Promise<Space[]> => {
    // Check if we already have the spaces in cache
    if (spaces[siteId]) {
      return spaces[siteId];
    }
    
    // Set loading state for this specific site
    setSpacesLoading(prev => ({ ...prev, [siteId]: true }));
    setSpacesError(prev => ({ ...prev, [siteId]: null }));
    
    try {
      // Get API base URL
      const API_BASE = getApiUrl();
      const response = await fetch(`${API_BASE}/api/v1/sites/${siteId}/spaces`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch spaces');
      }
      
      const spacesData = await response.json();
      
      if (Array.isArray(spacesData)) {
        const mappedSpaces: Space[] = spacesData.map((space: any) => ({
          id: space.id,
          name: space.name,
          slug: space.slug,
          description: space.description,
          cms_type: space.cms_type || 'custom',
          hidden: space.hidden || false,
          visibility: space.visibility || 'public',
          site_id: space.site_id || siteId
        }));
        
        // If we have spaces with CMS types, enrich them with CMS type names
        if (mappedSpaces.some(space => space.cms_type) && cmsTypes.length > 0) {
          // Create mapping of ID and name to CMS type
          const cmsTypeMap = new Map();
          cmsTypes.forEach(cmsType => {
            if (cmsType && cmsType.id) {
              cmsTypeMap.set(cmsType.id, cmsType);
              // Also map by lowercase name for fuzzy matching
              if (cmsType.name) {
                cmsTypeMap.set(cmsType.name.toLowerCase(), cmsType);
              }
            }
          });
          
          // Update spaces with CMS type names
          const spacesWithNames = mappedSpaces.map(space => {
            const cmsTypeId = space.cms_type;
            if (!cmsTypeId) return space;
            
            // Try to match by ID first
            if (cmsTypeMap.has(cmsTypeId)) {
              const cmsType = cmsTypeMap.get(cmsTypeId);
              return {
                ...space,
                cms_type_name: cmsType.name
              };
            }
            
            // Try to match by normalized name as fallback
            const normalizedId = cmsTypeId.toLowerCase();
            if (cmsTypeMap.has(normalizedId)) {
              const cmsType = cmsTypeMap.get(normalizedId);
              return {
                ...space,
                cms_type_name: cmsType.name
              };
            }
            
            // If we can't match, extract meaningful parts from UUID if necessary
            if (cmsTypeId.includes('-')) {
              return {
                ...space,
                cms_type_name: cmsTypeId.split('-')[0].replace(/[0-9]/g, '')
              };
            }
            
            return space;
          });
          
          // Update state with enriched spaces
          setSpaces(prev => ({ ...prev, [siteId]: spacesWithNames }));
          return spacesWithNames;
        }
        
        // Update state with mapped spaces
        setSpaces(prev => ({ ...prev, [siteId]: mappedSpaces }));
        return mappedSpaces;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error(`Error fetching spaces for site ${siteId}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSpacesError(prev => ({ ...prev, [siteId]: errorMessage }));
      return [];
    } finally {
      setSpacesLoading(prev => ({ ...prev, [siteId]: false }));
    }
  }, [spaces, cmsTypes]);
  
  // Fetch CMS types, optionally by category
  const fetchCmsTypes = useCallback(async (category?: string): Promise<CmsType[]> => {
    // If we're requesting a category and we already have it cached
    if (category && cmsTypesByCategory[category]) {
      return cmsTypesByCategory[category];
    }
    
    // If we're not requesting a specific category and we already have all types
    if (!category && cmsTypes.length > 0) {
      return cmsTypes;
    }
    
    setCmsTypesLoading(true);
    setCmsTypesError(null);
    
    try {
      let fetchedTypes: CmsType[];
      
      if (category) {
        // Fetch CMS types by category
        fetchedTypes = await cmsTypesApi.getCmsTypesByCategory(category);
      } else {
        // Fetch all CMS types
        fetchedTypes = await cmsTypesApi.getAllCmsTypes();
      }
      
      if (Array.isArray(fetchedTypes)) {
        // If fetching a specific category, update that category in the map
        if (category) {
          setCmsTypesByCategory(prev => ({
            ...prev,
            [category]: fetchedTypes
          }));
        }
        
        // Always update the full list if it's empty or we fetched all types
        if (!category || cmsTypes.length === 0) {
          setCmsTypes(fetchedTypes);
        }
        
        return fetchedTypes;
      } else {
        throw new Error('Invalid CMS types response format');
      }
    } catch (error) {
      console.error('Error fetching CMS types:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setCmsTypesError(errorMessage);
      return [];
    } finally {
      setCmsTypesLoading(false);
    }
  }, [cmsTypes, cmsTypesByCategory]);
  
  // Clear all cached data
  const clearCache = useCallback(() => {
    setSpaces({});
    setCmsTypes([]);
    setCmsTypesByCategory({});
    setSpacesLoading({});
    setSpacesError({});
    setCmsTypesLoading(false);
    setCmsTypesError(null);
  }, []);
  
  // Invalidate spaces data for a specific site
  const invalidateSiteSpaces = useCallback((siteId: string) => {
    setSpaces(prev => {
      const newSpaces = { ...prev };
      delete newSpaces[siteId];
      return newSpaces;
    });
  }, []);
  
  // Pre-fetch official CMS types on provider mount
  useEffect(() => {
    fetchCmsTypes('official').catch(console.error);
  }, [fetchCmsTypes]);
  
  const contextValue: SiteContentContextType = {
    spaces,
    spacesLoading,
    spacesError,
    cmsTypes,
    cmsTypesByCategory,
    cmsTypesLoading,
    cmsTypesError,
    fetchSpaces,
    fetchCmsTypes,
    clearCache,
    invalidateSiteSpaces
  };
  
  return (
    <SiteContentContext.Provider value={contextValue}>
      {children}
    </SiteContentContext.Provider>
  );
};

export default SiteContentProvider; 