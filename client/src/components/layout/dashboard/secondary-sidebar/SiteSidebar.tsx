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
import { sitesApi } from "@/lib/api";
import { useSiteContent } from "@/lib/SiteContentContext";

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
  // Get spaces data from context
  const { 
    spaces: contextSpaces,
    spacesLoading,
    spacesError,
    fetchSpaces
  } = useSiteContent();
  
  // Local state
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

  // Use spaces from context when available
  useEffect(() => {
    if (currentSiteId && contextSpaces[currentSiteId]) {
      console.log('SiteSidebar: Using spaces from context:', contextSpaces[currentSiteId]);
      setSpaces(contextSpaces[currentSiteId]);
      setIsLoading(false);
      setError(null);
    } else if (currentSiteId) {
      // If not in context yet, trigger a fetch
      setIsLoading(true);
      fetchSpaces(currentSiteId)
        .then(fetchedSpaces => {
          if (fetchedSpaces.length > 0) {
            console.log('SiteSidebar: Fetched spaces from context:', fetchedSpaces);
            setSpaces(fetchedSpaces);
          }
        })
        .catch(err => {
          console.error('SiteSidebar: Error fetching spaces:', err);
          setError('Failed to fetch spaces');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [currentSiteId, contextSpaces, fetchSpaces]);
  
  // Update loading and error states from context
  useEffect(() => {
    if (currentSiteId) {
      setIsLoading(spacesLoading[currentSiteId] || false);
      setError(spacesError[currentSiteId] || null);
    }
  }, [currentSiteId, spacesLoading, spacesError]);

  // Fetch site ID if needed
  useEffect(() => {
    const fetchSiteId = async () => {
      if (!currentSiteId) return;
      
      // Only fetch the site data if we don't have the UUID yet 
      // (currentSiteId might be a subdomain)
      if (!siteId || !siteId.includes('-')) {
        try {
          const siteData = await sitesApi.getSite(currentSiteId);
          setSiteId(siteData.id);
        } catch (error) {
          console.error('Error fetching site ID:', error);
        }
      }
    };

    fetchSiteId();
  }, [currentSiteId, siteId]);

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
        
        {/* Spaces section */}
        <div className="pt-4 pb-1">
          <h3 className="px-2 text-[0.7rem] text-gray-500 dark:text-gray-400 tracking-wider">
            Spaces:
          </h3>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            <span className="ml-2 text-xs text-gray-500">Loading spaces...</span>
          </div>
        ) : error ? (
          <div className="p-2 text-xs text-red-500">{error}</div>
        ) : spaces.length === 0 ? (
          <div className="p-2 text-xs text-gray-500">No spaces found</div>
        ) : (
          // Display spaces
          spaces.map(space => (
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
          ))
        )}
      </div>
    </div>
  );
};