import React, { useState, useEffect } from "react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES, getSiteAdminRoute } from "@/config/routes";
import { SiteSidebarProps } from "./types";
import { 
  Home, 
  MessageSquare, 
  HelpCircle, 
  Star, 
  FileText, 
  Calendar,
  BookOpen,
  Layout,
  Briefcase,
  Loader2,
  Hash
} from "lucide-react";
import { getApiBaseUrl } from "@/lib/utils";
import { sitesApi, cmsTypesApi } from "@/lib/api";

// Define interface for spaces
interface Space {
  id: string;
  name: string;
  slug: string;
  description?: string;
  cms_type?: string;
  cms_type_name?: string; // Human-readable name
  hidden?: boolean;
  visibility?: string;
}

export const SiteSidebar: React.FC<SiteSidebarProps> = ({ 
  currentPathname, 
  isActiveUrl,
  currentSiteId
}) => {
  // State for spaces
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [siteId, setSiteId] = useState<string | null>(currentSiteId || null);
  
  // Determine if we're in site-specific context
  const inSiteContext = !!currentSiteId;
  
  // Helper function to get the appropriate route based on context
  const getContextualRoute = (generalRoute: string, siteSpecificPath: string) => {
    return inSiteContext 
      ? getSiteAdminRoute(currentSiteId, siteSpecificPath) 
      : generalRoute;
  };

  const basePath = inSiteContext 
    ? `/dashboard/site/${currentSiteId}` 
    : '/site';

  // Fetch site spaces when component mounts
  useEffect(() => {
    const fetchSpaces = async () => {
      if (!currentSiteId) return;
      
      console.log(`Fetching spaces for site ID: ${currentSiteId}`);
      setIsLoading(true);
      setError(null);
      
      try {
        // First get the site details to ensure we have the UUID if needed
        const siteData = await sitesApi.getSite(currentSiteId);
        setSiteId(siteData.id);
        console.log(`Site details fetched: ID=${siteData.id}, name=${siteData.name}`);
        
        // Fetch spaces using the site UUID
        const API_BASE = getApiBaseUrl();
        const spaceApiUrl = `${API_BASE}/api/v1/sites/${siteData.id}/spaces`;
        console.log(`Fetching spaces from: ${spaceApiUrl}`);
        
        const response = await fetch(spaceApiUrl);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch spaces');
        }
        
        const spacesData = await response.json();
        console.log('Fetched spaces for site sidebar:', spacesData);
        
        if (Array.isArray(spacesData)) {
          const mappedSpaces: Space[] = spacesData.map((space: any) => ({
            id: space.id,
            name: space.name,
            slug: space.slug,
            description: space.description,
            cms_type: space.cms_type || 'custom',
            hidden: space.hidden || false,
            visibility: space.visibility || 'public'
          }));
          
          console.log('Mapped spaces:', mappedSpaces);
          
          setSpaces(mappedSpaces);
          
          // If we have CMS type IDs, fetch CMS type details to get names
          if (mappedSpaces.some(space => space.cms_type)) {
            try {
              // Get unique CMS type IDs
              const cmsTypeIds = Array.from(
                new Set(
                  mappedSpaces
                    .map(space => space.cms_type)
                    .filter((id): id is string => !!id)
                )
              );
                
              if (cmsTypeIds.length > 0) {
                console.log('Fetching CMS type details for IDs:', cmsTypeIds);
                
                // First try to get official CMS types
                try {
                  const officialCmsTypes = await cmsTypesApi.getCmsTypesByCategory('official');
                  console.log('Fetched official CMS types:', officialCmsTypes);
                  
                  // Create a mapping of ID to CMS type details
                  const cmsTypeMap = new Map();
                  
                  // Add official types to the map
                  if (Array.isArray(officialCmsTypes)) {
                    officialCmsTypes.forEach(cmsType => {
                      if (cmsType && cmsType.id) {
                        cmsTypeMap.set(cmsType.id, cmsType);
                        
                        // Also map by name (lowercase) for fallback matching
                        if (cmsType.name) {
                          cmsTypeMap.set(cmsType.name.toLowerCase(), cmsType);
                        }
                      }
                    });
                  }
                  
                  // Update spaces with appropriate CMS type information
                  setSpaces(prevSpaces => prevSpaces.map(space => {
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
                    
                    // Try to match by normalized name as fallback (for legacy data)
                    const normalizedId = cmsTypeId.toLowerCase();
                    if (cmsTypeMap.has(normalizedId)) {
                      const cmsType = cmsTypeMap.get(normalizedId);
                      return {
                        ...space,
                        cms_type_name: cmsType.name
                      };
                    }
                    
                    // If we still don't have a match, use a normalized version of the ID
                    // This handles cases where cms_type might be a UUID/slug instead of a proper CMS type
                    return {
                      ...space,
                      cms_type_name: cmsTypeId.split('-')[0].replace(/[0-9]/g, '')
                    };
                  }));
                } catch (err) {
                  console.error("Error fetching official CMS types:", err);
                }
              }
            } catch (err) {
              console.error("Error processing CMS types:", err);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch spaces:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch spaces');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpaces();
  }, [currentSiteId]);

  // Get icon for space based on CMS type
  const getIconForSpace = (space: Space) => {
    // Try to use cms_type_name first if available, otherwise fall back to cms_type
    const spaceType = space.cms_type_name || space.cms_type || '';
    const normalizedType = spaceType.toLowerCase();
    
    // Match by known types
    if (normalizedType.includes('discussion')) {
      return <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />;
    } else if (normalizedType.includes('qa') || normalizedType.includes('question')) {
      return <HelpCircle className="h-4 w-4 mr-2 text-purple-500" />;
    } else if (normalizedType.includes('blog') || normalizedType.includes('article')) {
      return <FileText className="h-4 w-4 mr-2 text-pink-500" />;
    } else if (normalizedType.includes('wishlist') || normalizedType.includes('idea')) {
      return <Star className="h-4 w-4 mr-2 text-yellow-500" />;
    } else if (normalizedType.includes('knowledge') || normalizedType.includes('guide')) {
      return <BookOpen className="h-4 w-4 mr-2 text-red-500" />;
    } else if (normalizedType.includes('event') || normalizedType.includes('calendar')) {
      return <Calendar className="h-4 w-4 mr-2 text-green-500" />;
    } else if (normalizedType.includes('job') || normalizedType.includes('career')) {
      return <Briefcase className="h-4 w-4 mr-2 text-cyan-500" />;
    } else if (normalizedType.includes('landing') || normalizedType.includes('page')) {
      return <Layout className="h-4 w-4 mr-2 text-indigo-500" />;
    } else {
      // Default to a generic icon if no matches
      return <Hash className="h-4 w-4 mr-2 text-gray-500" />;
    }
  };

  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          Site
        </h2>
      </div>

      <div className="space-y-1">
        <SideNavItem
          href={`${basePath}/overview`}
          isActive={isActiveUrl && (
            isActiveUrl(`${basePath}/overview`, currentPathname) || 
            currentPathname === basePath
          )}
        >
          Overview
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/domains`}
          isActive={isActiveUrl && isActiveUrl(`${basePath}/domains`, currentPathname)}
        >
          Domains
        </SideNavItem>

        <SideNavItem
          href={`${basePath}/branding`}
          isActive={isActiveUrl && isActiveUrl(`${basePath}/branding`, currentPathname)}
        >
          Branding
        </SideNavItem>
        
        {/* Spaces heading */}
        {spaces.length > 0 && (
          <div className="pt-4 pb-1">
            <h3 className="px-2 text-[0.7rem] text-gray-500 dark:text-gray-400 tracking-wider">
              Spaces:
            </h3>
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center px-2 py-2 text-sm text-gray-500">
            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
            <span>Loading spaces...</span>
          </div>
        )}
        
        {/* Error message */}
        {error && (
          <div className="px-2 py-2 text-sm text-red-500">
            {error}
          </div>
        )}
        
        {/* Space navigation items */}
        {!isLoading && spaces.map(space => (
          !space.hidden && (
            <SideNavItem
              key={space.id}
              href={`${basePath}/content/${space.slug}`}
              isActive={isActiveUrl && isActiveUrl(`${basePath}/content/${space.slug}`, currentPathname)}
              icon={getIconForSpace(space)}
            >
              {space.name}
            </SideNavItem>
          )
        ))}
      </div>
    </div>
  );
};