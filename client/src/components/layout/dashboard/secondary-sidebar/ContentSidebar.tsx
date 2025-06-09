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
  AlarmClockCheck,
  MessageSquareDashed,
  Save,
  Clock,
  ChevronDown,
  ChevronRight,
  Columns,
  Heart,
  Search,
  Lightbulb,
  Megaphone,
  Briefcase,
  BookOpen,
  Package,
  Music,
  Utensils,
  ShoppingBag,
  HelpingHand,
  Code,
  Palette,
  Camera,
  Zap,
  Layout,
} from "lucide-react";
import { SideNavItem, SideNavItemWithBadge } from "./SidebarNavigationItems";
import { APP_ROUTES } from "@/config/routes";
import { BaseSidebarProps } from "./types";
import { isValidUUID } from "@/lib/with-site-context";
import { AddContentDialog } from "@/components/features/content/add-content-dialog";
import { useSiteContent } from "@/lib/SiteContentContext";
import { getApiUrl } from '@/lib/utils';

// Define interface for CMS Type
interface CmsType {
  id: string;
  name: string;
  label: string;
  description?: string;
  icon_name?: string;
  color?: string;
  favorite?: boolean;
  type?: string;
}

// Utility function to get API base URL
function getApiBaseUrl(): string {
  return getApiUrl();
}

// Updated utility function to get icon component based on icon_name string
function getIconByName(iconName?: string): React.ReactNode {
  if (!iconName) return <FileText className="h-3.5 w-3.5" />;
  const normalizedIcon = iconName.toLowerCase().trim();
  switch (normalizedIcon) {
    case 'calendar': return <Calendar className="h-3.5 w-3.5" />;
    case 'message-square':
    case 'messagesquare':
    case 'message-circle':
      return <MessageSquare className="h-3.5 w-3.5" />;
    case 'file-text':
    case 'filetext':
    case 'feather':
      return <FileText className="h-3.5 w-3.5" />;
    case 'help-circle':
    case 'helpcircle':
      return <HelpCircle className="h-3.5 w-3.5" />;
    case 'star':
    case 'lightbulb':
      return <Star className="h-3.5 w-3.5" />;
    case 'layout': return <Layout className="h-3.5 w-3.5" />;
    case 'book-open':
    case 'bookopen':
    case 'book':
      return <BookOpen className="h-3.5 w-3.5" />;
    case 'briefcase': return <Briefcase className="h-3.5 w-3.5" />;
    default:
      console.warn(`[ContentSidebar] Unknown icon_name: ${iconName}, using default FileText.`);
      return <FileText className="h-3.5 w-3.5" />;
  }
}

export const ContentSidebar: React.FC<BaseSidebarProps> = ({ 
  currentPathname, 
  isActiveUrl,
  currentSiteIdentifier,
  onNewContent
}) => {
  // Get CMS types from context
  const { 
    cmsTypes: contextCmsTypes,
    cmsTypesByCategory,
    cmsTypesLoading,
    cmsTypesError,
    fetchCmsTypes
  } = useSiteContent();
  
  // Local state
  const [cmsTypes, setCmsTypes] = useState<CmsType[]>([]);
  const [activeCmsTypes, setActiveCmsTypes] = useState<CmsType[]>([]); // Active CMS types for this site
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [postCounts, setPostCounts] = useState<number>(0);
  const [siteInfo, setSiteInfo] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  // If no currentSiteIdentifier is provided, show nothing
  if (!currentSiteIdentifier) {
    return null;
  }

  // Determine if we're in moderator context
  const isModerator = currentPathname.startsWith('/dashboard/moderator/');
  const basePath = isModerator 
    ? APP_ROUTES.DASHBOARD_MODERATOR.CONTENT(currentSiteIdentifier)
    : APP_ROUTES.DASHBOARD_SITE.CONTENT(currentSiteIdentifier);
  
  // Helper function to get content section URL
  const getContentSectionUrl = (section: string) => {
    return isModerator 
      ? `${APP_ROUTES.DASHBOARD_MODERATOR.CONTENT(currentSiteIdentifier)}/${section}`
      : APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(currentSiteIdentifier, section);
  };

  // Use CMS types from context when available
  useEffect(() => {
    if (cmsTypesByCategory['official'] && cmsTypesByCategory['official'].length > 0) {
      console.log('ContentSidebar: Using official CMS types from context:', cmsTypesByCategory['official']);
      setCmsTypes(cmsTypesByCategory['official']);
      setIsLoading(false);
      setError(null);
    } else if (contextCmsTypes.length > 0) {
      console.log('ContentSidebar: Using CMS types from context:', contextCmsTypes);
      setCmsTypes(contextCmsTypes);
      setIsLoading(false);
      setError(null);
    } else {
      // Request CMS types via context
      setIsLoading(true);
      fetchCmsTypes('official')
        .then(types => {
          console.log('ContentSidebar: Fetched CMS types from context:', types);
          setCmsTypes(types);
        })
        .catch(err => {
          console.error('ContentSidebar: Error fetching CMS types:', err);
          setError('Failed to load CMS types');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [contextCmsTypes, cmsTypesByCategory, fetchCmsTypes]);
  
  // Update loading and error states from context
  useEffect(() => {
    setIsLoading(cmsTypesLoading);
    setError(cmsTypesError);
  }, [cmsTypesLoading, cmsTypesError]);

  // Filter active CMS types based on site's content_types
  useEffect(() => {
    if (siteInfo && cmsTypes.length > 0) {
      const siteContentTypes = siteInfo.content_types || [];
      console.log('Site content_types:', siteContentTypes);
      console.log('Available CMS types:', cmsTypes);
      
      if (siteContentTypes.length > 0) {
        // Filter CMS types that are active in this site
        const activeTypes = cmsTypes.filter(cmsType => {
          // Check if this CMS type is in the site's content_types array
          const isActive = siteContentTypes.some((activeCmsType: any) => {
            // Handle both string IDs and objects
            if (typeof activeCmsType === 'string') {
              return activeCmsType === cmsType.id || activeCmsType === cmsType.name;
            } else if (typeof activeCmsType === 'object') {
              return activeCmsType.id === cmsType.id;
            }
            return false;
          });
          return isActive;
        });
        
        console.log('Filtered active CMS types:', activeTypes);
        setActiveCmsTypes(activeTypes);
      } else {
        // If no content types are set, show empty
        setActiveCmsTypes([]);
      }
    }
  }, [siteInfo, cmsTypes]);
  
  // Fetch site info and post counts
  useEffect(() => {
    const fetchSiteData = async () => {
      if (!currentSiteIdentifier) return;
      
      try {
        const API_BASE = getApiBaseUrl();
        
        // Always fetch site details to get content_types
        console.log(`Fetching site details for: ${currentSiteIdentifier}`);
        const siteResponse = await fetch(`${API_BASE}/api/v1/sites/${currentSiteIdentifier}`);
        
        if (!siteResponse.ok) {
          throw new Error('Failed to fetch site details');
        }
        
        const siteData = await siteResponse.json();
        console.log('Site data received:', siteData);
        setSiteInfo(siteData);
        
        // Use the site's UUID for posts
        const siteId = siteData.id;
        
        // Fetch posts using the UUID
        console.log(`Fetching post counts for site: ${siteId}`);
        const postsResponse = await fetch(`${API_BASE}/api/v1/posts/site/${siteId}`);
        
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
        console.error('Error fetching site data:', err);
        setPostCounts(0);
      }
    };
    
    fetchSiteData();
  }, [currentSiteIdentifier]);
  
  // Default content sidebar - showing CMS Collections directly
  return (
    <div className="p-3">
      <div className="space-y-4">
        <div className="space-y-3">
          {/* Primary Actions */}
          <div className="space-y-0.5">
            <SideNavItemWithBadge
              href={getContentSectionUrl(APP_ROUTES.CONTENT_TYPES.ALL)}
              isActive={isActiveUrl && (
                isActiveUrl(getContentSectionUrl(APP_ROUTES.CONTENT_TYPES.ALL), currentPathname) || 
                currentPathname === basePath
              )}
              icon={<Folder className="h-3.5 w-3.5" />}
              badgeText={isLoading ? "..." : postCounts.toString()}
              primary={true}
            >
              All Content
            </SideNavItemWithBadge>

            <SideNavItem
              href={getContentSectionUrl('scheduled')}
              isActive={isActiveUrl && isActiveUrl(getContentSectionUrl('scheduled'), currentPathname)}
              icon={<Clock className="h-3.5 w-3.5" />}
            >
              All Scheduled
            </SideNavItem>

            <SideNavItem
              href={getContentSectionUrl('draft')}
              isActive={isActiveUrl && isActiveUrl(getContentSectionUrl('draft'), currentPathname)}
              icon={<Save className="h-3.5 w-3.5" />}
            >
              All Draft
            </SideNavItem>
          </div>

          {/* Content Types - Active in this site only */}
          <div className="space-y-0.5 border-t border-gray-100 dark:border-gray-700 pt-2">
            <div className="mb-2">
              <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
                Content Type
              </h2>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                <span className="ml-2 text-xs text-gray-400">Loading...</span>
              </div>
            ) : error ? (
              <div className="text-xs text-red-500 py-2 px-2.5">
                {error}
              </div>
            ) : activeCmsTypes.length > 0 ? (
              <>
                {activeCmsTypes.map((cmsType) => (
                  <SideNavItem
                    key={cmsType.id}
                    href={getContentSectionUrl(cmsType.name.toLowerCase())}
                    isActive={isActiveUrl && isActiveUrl(getContentSectionUrl(cmsType.name.toLowerCase()), currentPathname)}
                    icon={getIconByName(cmsType.icon_name)}
                  >
                    {cmsType.label}
                  </SideNavItem>
                ))}
              </>
            ) : (
              <div className="text-xs text-gray-400 py-2 px-2.5">
                No content types activated yet
              </div>
            )}

            <div 
              onClick={() => setDialogOpen(true)}
              className="flex items-center py-1.5 text-sm cursor-pointer my-0.5 transition-colors duration-150 px-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 rounded"
            >
              <Plus className="h-3.5 w-3.5 mr-2" />
              <span className="font-normal">Add new content type</span>
            </div>
            
            {/* Add Content Dialog */}
            <AddContentDialog open={dialogOpen} onOpenChange={setDialogOpen} />
          </div>

          {/* Custom Views Section */}
          <div className="border-t border-gray-100 dark:border-gray-700 mt-2 pt-2">
            <div className="mb-2">
              <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
                Custom Views
              </h2>
            </div>
            <div id="custom-views-container">
              {/* Custom views will be rendered here by the main content component */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 