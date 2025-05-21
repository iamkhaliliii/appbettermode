import React, { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  Plus,
  Folder,
  FileText,
  Calendar,
  HelpCircle,
  Star,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { SideNavItem, SideNavItemWithBadge } from "./SidebarNavigationItems";
import { APP_ROUTES } from "@/config/routes";
import { BaseSidebarProps } from "./types";
import { isValidUUID } from "@/lib/with-site-context";

// Define interface for CMS Type
interface CmsType {
  id: string;
  name: string;
  description?: string;
  icon_name?: string;
  color?: string;
  favorite?: boolean;
  type?: string;
}

// Utility function to get API base URL
function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
}

// Utility function to get icon component based on CMS type
function getIconComponent(cmsType: string): React.ReactNode {
  switch (cmsType.toLowerCase()) {
    case 'event':
    case 'events':
      return <Calendar className="h-3.5 w-3.5" />;
    case 'discussion':
    case 'discussions':
      return <MessageSquare className="h-3.5 w-3.5" />;
    case 'article':
    case 'articles':
      return <FileText className="h-3.5 w-3.5" />;
    case 'question':
    case 'questions':
      return <HelpCircle className="h-3.5 w-3.5" />;
    case 'wishlist':
      return <Star className="h-3.5 w-3.5" />;
    default:
      return <FileText className="h-3.5 w-3.5" />;
  }
}

export const ContentSidebar: React.FC<BaseSidebarProps> = ({ 
  currentPathname, 
  isActiveUrl,
  currentSiteIdentifier,
  onNewContent
}) => {
  const [cmsTypes, setCmsTypes] = useState<CmsType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [postCounts, setPostCounts] = useState<number>(0);
  const [siteInfo, setSiteInfo] = useState<any>(null);

  // If no currentSiteIdentifier is provided, show nothing
  if (!currentSiteIdentifier) {
    return null;
  }

  const basePath = APP_ROUTES.DASHBOARD_SITE.CONTENT(currentSiteIdentifier);

  // Fetch CMS types when component mounts
  useEffect(() => {
    const fetchCmsTypes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const API_BASE = getApiBaseUrl();
        
        // Fetch official CMS types
        const officialResponse = await fetch(`${API_BASE}/api/v1/cms-types/category/official`);
        
        if (!officialResponse.ok) {
          throw new Error('Failed to fetch CMS types');
        }
        
        const officialTypes = await officialResponse.json();
        
        // Fetch favorites (optional, might not be needed)
        try {
          const favoritesResponse = await fetch(`${API_BASE}/api/v1/cms-types/favorites`);
          if (favoritesResponse.ok) {
            const favoriteTypes = await favoritesResponse.json();
            // Merge and mark favorites
            const allTypes = [...officialTypes];
            
            // Mark types that are in favorites
            for (let i = 0; i < allTypes.length; i++) {
              const isFavorite = favoriteTypes.some((fav: CmsType) => fav.id === allTypes[i].id);
              if (isFavorite) {
                allTypes[i].favorite = true;
              }
            }
            
            setCmsTypes(allTypes);
          } else {
            setCmsTypes(officialTypes);
          }
        } catch (err) {
          // If favorites fetch fails, just use official types
          setCmsTypes(officialTypes);
        }
        
        // First, we need to get the site data to obtain the UUID if we're using a subdomain
        try {
          // Fetch site details first
          const siteResponse = await fetch(`${API_BASE}/api/v1/sites/${currentSiteIdentifier}`);
          
          if (!siteResponse.ok) {
            throw new Error('Failed to fetch site details');
          }
          
          const siteData = await siteResponse.json();
          setSiteInfo(siteData);
          
          // Now fetch posts using the UUID from the site data
          try {
            console.log(`Fetching post counts for site: ${siteData.id}`);
            const postsResponse = await fetch(`${API_BASE}/api/v1/posts/site/${siteData.id}`);
            
            if (postsResponse.ok) {
              const postsData = await postsResponse.json();
              const count = Array.isArray(postsData) ? postsData.length : 0;
              console.log(`Found ${count} posts total`);
              setPostCounts(count);
            } else {
              console.error('Failed to fetch posts count:', postsResponse.statusText);
              setPostCounts(0);
            }
          } catch (err) {
            console.error('Error fetching post counts:', err);
            setPostCounts(0);
          }
        } catch (err) {
          console.error('Error fetching site details:', err);
          setPostCounts(0);
        }
        
      } catch (err) {
        console.error('Error fetching CMS types:', err);
        setError('Failed to load CMS types');
        
        // Fallback to empty array
        setCmsTypes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCmsTypes();
  }, [currentSiteIdentifier]);
  
  // Default content sidebar - showing CMS Collections directly
  return (
    <div className="p-3">
      <div className="space-y-4">
        <div className="space-y-3">
          {/* Primary Actions */}
          <div className="space-y-0.5">
            <SideNavItemWithBadge
              href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(currentSiteIdentifier, APP_ROUTES.CONTENT_TYPES.ALL)}
              isActive={isActiveUrl && (
                isActiveUrl(APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(currentSiteIdentifier, APP_ROUTES.CONTENT_TYPES.ALL), currentPathname) || 
                currentPathname === basePath
              )}
              icon={<Folder className="h-3.5 w-3.5" />}
              badgeText={isLoading ? "..." : postCounts.toString()}
              primary={true}
            >
              All Posts
            </SideNavItemWithBadge>
          </div>

          {/* Content Types - Dynamic from API */}
          <div className="space-y-0.5 border-t border-gray-100 dark:border-gray-700 pt-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                <span className="ml-2 text-xs text-gray-400">Loading CMS types...</span>
              </div>
            ) : error ? (
              <div className="text-xs text-red-500 py-2 px-2.5">
                {error}
              </div>
            ) : (
              <>
                {cmsTypes.map((cmsType) => (
                  <SideNavItem
                    key={cmsType.id}
                    href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(currentSiteIdentifier, cmsType.name.toLowerCase())}
                    isActive={isActiveUrl && isActiveUrl(APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(currentSiteIdentifier, cmsType.name.toLowerCase()), currentPathname)}
                    icon={getIconComponent(cmsType.name)}
                  >
                    {cmsType.name}
                  </SideNavItem>
                ))}
              </>
            )}

            <Link href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(currentSiteIdentifier, APP_ROUTES.CONTENT_TYPES.NEW_CMS)}>
              <div className="flex items-center py-1.5 text-sm cursor-pointer my-0.5 transition-colors duration-150 px-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 rounded">
                <Plus className="h-3.5 w-3.5 mr-2" />
                <span className="font-normal">Add new CMS</span>
              </div>
            </Link>
          </div>

          {/* Divider and Custom View */}
          <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
            <Link href={APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(currentSiteIdentifier, APP_ROUTES.CONTENT_TYPES.CUSTOM_VIEW)}>
              <div className="flex items-center py-1.5 text-sm cursor-pointer my-0.5 transition-colors duration-150 px-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 rounded">
                <Plus className="h-3.5 w-3.5 mr-2" />
                <span className="font-normal">Add custom view</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}; 