import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bell, 
  Menu, 
  ChevronDown, 
  ExternalLink, 
  BarChart2, 
  Files, 
  ChevronUp, 
  XIcon, 
  MessageSquare, 
  HelpCircle, 
  Star, 
  Calendar, 
  BookOpen,
  Briefcase,
  Package,
  Folder
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { sitesApi, Site } from "@/lib/api";
import { APP_ROUTES, getSiteIdentifierFromRoute } from "@/config/routes";
import { getApiBaseUrl } from "@/lib/utils";
import { useSiteContent } from "@/lib/SiteContentContext";

// Define interface for Space
interface Space {
  id: string;
  name: string;
  slug: string;
  cms_type?: string;
  description?: string;
  hidden?: boolean;
  visibility?: string;
  site_id?: string;
}

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

interface HeaderProps {
  onToggleMobileMenu: () => void;
  variant?: 'dashboard' | 'site';
  siteName?: string;
  siteIdentifier?: string;
}

export function Header({ onToggleMobileMenu, variant = 'dashboard', siteName, siteIdentifier }: HeaderProps) {
  const [location] = useLocation();
  const [isSiteHeaderVisible, setIsSiteHeaderVisible] = useState(true);
  const [siteData, setSiteData] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use our context instead of local state for spaces and CMS types
  const { 
    spaces: contextSpaces, 
    cmsTypes: contextCmsTypes,
    cmsTypesByCategory,
    spacesLoading,
    cmsTypesLoading,
    fetchSpaces,
    fetchCmsTypes
  } = useSiteContent();
  
  // Derive local spaces and CMS types from context
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [cmsTypes, setCmsTypes] = useState<CmsType[]>([]);
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [loadingCmsTypes, setLoadingCmsTypes] = useState(false);
  
  // Update local spaces from context when siteIdentifier changes
  useEffect(() => {
    if (siteIdentifier && contextSpaces[siteIdentifier]) {
      setSpaces(contextSpaces[siteIdentifier]);
    } else {
      // Use fallback data when nothing is available in context
      setSpaces([
        { id: 'fallback-1', name: 'Events', slug: 'events', site_id: siteIdentifier || '' },
        { id: 'fallback-2', name: 'Q&A', slug: 'qa', site_id: siteIdentifier || '' },
        { id: 'fallback-3', name: 'Discussions', slug: 'discussions', site_id: siteIdentifier || '' },
        { id: 'fallback-4', name: 'Wishlist', slug: 'wishlist', site_id: siteIdentifier || '' },
        { id: 'fallback-5', name: 'Knowledge Base', slug: 'knowledge', site_id: siteIdentifier || '' }
      ]);
    }
  }, [siteIdentifier, contextSpaces]);
  
  // Update local CMS types from context when it changes
  useEffect(() => {
    if (contextCmsTypes.length > 0) {
      setCmsTypes(contextCmsTypes);
    } else if (cmsTypesByCategory['official'] && cmsTypesByCategory['official'].length > 0) {
      setCmsTypes(cmsTypesByCategory['official']);
    } else {
      // Use fallback data when nothing is available in context
      setCmsTypes([
        { id: 'fallback-1', name: 'Discussions', icon_name: 'MessageSquare' },
        { id: 'fallback-2', name: 'Q&A', icon_name: 'HelpCircle' },
        { id: 'fallback-3', name: 'Events', icon_name: 'Calendar' },
        { id: 'fallback-4', name: 'Blog Posts', icon_name: 'BookOpen' },
        { id: 'fallback-5', name: 'Ideas & Wishlist', icon_name: 'Star' }
      ]);
    }
  }, [contextCmsTypes, cmsTypesByCategory]);
  
  // Update loading states from context
  useEffect(() => {
    if (siteIdentifier) {
      setLoadingSpaces(spacesLoading[siteIdentifier] || false);
    }
  }, [siteIdentifier, spacesLoading]);
  
  useEffect(() => {
    setLoadingCmsTypes(cmsTypesLoading);
  }, [cmsTypesLoading]);
  
  // Track spaces changes
  useEffect(() => {
  }, [spaces]);
  
  // Track cmsTypes changes
  useEffect(() => {
  }, [cmsTypes]);
  
  // Fetch site data when siteIdentifier changes
  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteIdentifier) {
        setSiteData(null);
        return;
      }
      
      setIsLoading(true);
      try {
        // Fetch site data using the identifier (works with both UUID and subdomain)
        const data = await sitesApi.getSite(siteIdentifier);
        setSiteData(data);
        
        // Trigger context fetch for spaces
        if (siteIdentifier) {
          fetchSpaces(siteIdentifier);
        }
        
        // Trigger context fetch for CMS types
        fetchCmsTypes('official');
      } catch (error) {
        console.error("Error fetching site data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSiteData();
  }, [siteIdentifier, fetchSpaces, fetchCmsTypes]);
  
  // Get icon component based on icon name
  const getIconComponent = (iconName: string | undefined) => {
    switch (iconName) {
      case 'MessageSquare':
        return <MessageSquare className="h-3.5 w-3.5" />;
      case 'HelpCircle':
        return <HelpCircle className="h-3.5 w-3.5" />;
      case 'Star':
        return <Star className="h-3.5 w-3.5" />;
      case 'Calendar':
        return <Calendar className="h-3.5 w-3.5" />;
      case 'BookOpen':
        return <BookOpen className="h-3.5 w-3.5" />;
      case 'Briefcase':
        return <Briefcase className="h-3.5 w-3.5" />;
      case 'Package':
        return <Package className="h-3.5 w-3.5" />;
      case 'Folder':
        return <Folder className="h-3.5 w-3.5" />;
      case 'Bell':
        return <Bell className="h-3.5 w-3.5" />;
      default:
        return <Files className="h-3.5 w-3.5" />;
    }
  };
  
  // Use site name from props or from fetched data
  const displaySiteName = siteName || siteData?.name || "Loading...";

  // Define base and variant-specific classes
  const headerBaseClasses = "sticky top-0 z-30 border-b transition-colors duration-300 ease-in-out";
  const dashboardClasses = "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700";
  const siteClasses = "bg-gray-900 dark:bg-white border-gray-700 dark:border-gray-200";
  const siteHiddenClasses = "bg-gray-900 dark:bg-white border-transparent";

  // Determine text/icon colors based on variant for better contrast
  const primaryTextColor = variant === 'site' ? "text-gray-200 dark:text-gray-700" : "text-gray-900 dark:text-white";
  const secondaryTextColor = variant === 'site' ? "text-gray-400 dark:text-gray-500" : "text-gray-500 dark:text-gray-400";
  const iconColor = variant === 'site' ? "text-gray-300 dark:text-gray-600" : "text-gray-600 dark:text-gray-300";
  const borderColor = variant === 'site' ? "border-gray-700 dark:border-gray-200" : "border-gray-200 dark:border-gray-700";
  const buttonBgHover = variant === 'site' ? "hover:bg-gray-700 dark:hover:bg-gray-200" : "hover:bg-gray-50 dark:hover:bg-gray-700";
  const buttonBg = variant === 'site' ? "bg-gray-900 dark:bg-white" : "bg-white dark:bg-gray-800";
  const logoContainerBase = "w-12 h-12 flex items-center justify-center transition-all duration-300 ease-in-out";
  const logoFixedClasses = "fixed mt-8 top-3 right-5 z-50 rounded-md shadow-lg cursor-pointer bg-gray-900 dark:bg-white";

  const handleLogoClick = () => {
    if (variant === 'site' && !isSiteHeaderVisible) {
      setIsSiteHeaderVisible(true);
    } else if (siteIdentifier) {
      // Navigate to the site dashboard
      window.location.href = APP_ROUTES.DASHBOARD_SITE.INDEX(siteIdentifier);
    }
  };

  // Animation variants for the header content
  const headerContentVariants = {
    hidden: { opacity: 0, height: 0, y: -20 },
    visible: { opacity: 1, height: "auto", y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  // Animation variants for the entire header
  const headerVariants = {
    visible: { y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    hidden: { y: "-100%", transition: { duration: 0.3, ease: "easeInOut" } },
  };
  
  // Update document title when site data changes
  useEffect(() => {
    if (variant === 'dashboard' && siteData) {
      document.title = `${siteData.name} Dashboard | BetterMode`;
    }
  }, [siteData, variant]);

  const [spacesDropdownOpen, setSpacesDropdownOpen] = useState(false);
  const [postsDropdownOpen, setPostsDropdownOpen] = useState(false);
  const [insightsDropdownOpen, setInsightsDropdownOpen] = useState(false);
  
  // Add refs for dropdown containers to handle click outside
  const spacesDropdownRef = useRef<HTMLDivElement>(null);
  const postsDropdownRef = useRef<HTMLDivElement>(null);
  const insightsDropdownRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close spaces dropdown if click is outside
      if (spacesDropdownRef.current && 
          !spacesDropdownRef.current.contains(event.target as Node) && 
          spacesDropdownOpen) {
        setSpacesDropdownOpen(false);
      }
      
      // Close posts dropdown if click is outside
      if (postsDropdownRef.current && 
          !postsDropdownRef.current.contains(event.target as Node) && 
          postsDropdownOpen) {
        setPostsDropdownOpen(false);
      }
      
      // Close insights dropdown if click is outside
      if (insightsDropdownRef.current && 
          !insightsDropdownRef.current.contains(event.target as Node) && 
          insightsDropdownOpen) {
        setInsightsDropdownOpen(false);
      }
    };
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [spacesDropdownOpen, postsDropdownOpen, insightsDropdownOpen]);

  return (
    <motion.header
      className={cn(
        "z-30 border-b transition-colors duration-300 ease-in-out",
        (variant === 'dashboard' || (variant === 'site' && isSiteHeaderVisible))
          ? "sticky top-0"
          : "absolute top-0 left-0 right-0",
        variant === 'site' ? siteClasses : dashboardClasses
      )}
      variants={headerVariants}
      animate={variant === 'site' && !isSiteHeaderVisible ? "hidden" : "visible"}
      initial={false}
    >
      <div className="h-12 flex items-center">
        {/* Logo Section - Conditionally apply fixed positioning */}
        <div 
          className={cn(
            logoContainerBase,
            variant === 'site' && !isSiteHeaderVisible 
              ? logoFixedClasses 
              : ["border-r", borderColor, variant === 'site' ? "cursor-pointer" : ""]
          )}
          onClick={handleLogoClick}
        >
          <svg width="24" height="24" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg" 
             className={cn(variant === 'site' && !isSiteHeaderVisible 
                           ? "text-white dark:text-black"
                           : variant === 'site' 
                             ? "text-white dark:text-black"
                             : "text-black dark:text-white"
                           )}>
            <path d="M28.9912 0C12.9792 0 0 12.9792 0 28.9912C0 45.0032 12.9792 57.9824 28.9912 57.9824C45.0032 57.9824 57.9824 45.0032 57.9824 28.9912C57.9824 12.9792 45.0032 0 28.9912 0ZM34.4282 38.051H23.5554C18.551 38.051 14.4967 33.9956 14.4967 28.9912C14.4967 23.9868 18.5521 19.9315 23.5554 19.9315H34.4282C39.4326 19.9315 43.4868 23.9868 43.4868 28.9912C43.4868 33.9956 39.4315 38.051 34.4282 38.051Z" fill="currentColor"/>
            <path d="M34.427 36.2389C38.4299 36.2389 41.6748 32.9939 41.6748 28.9911C41.6748 24.9882 38.4299 21.7433 34.427 21.7433C30.4242 21.7433 27.1792 24.9882 27.1792 28.9911C27.1792 32.9939 30.4242 36.2389 34.427 36.2389Z" fill="currentColor"/>
          </svg>
        </div>

        {/* Conditionally Render Rest of Header Content (NO INNER ANIMATION) */}
        {(variant === 'dashboard' || (variant === 'site' && isSiteHeaderVisible)) && (
            <div className="flex-1 flex items-center">
              {/* Middle Section - App Navigation */}
              <div className={cn("w-64 flex-shrink-0 h-full border-r", borderColor)}>

                  <div className="flex h-full items-center justify-center gap-2 px-2">
                    {/* Spaces Dropdown - Simple Implementation */}
                    <div className="relative group" ref={spacesDropdownRef}>
                      <button
                        className={cn(
                          "flex items-center gap-1 justify-center p-1.5 rounded-md border",
                          borderColor, 
                          buttonBg, 
                          iconColor,
                          buttonBgHover
                        )}
                        onClick={() => {
                          setSpacesDropdownOpen(!spacesDropdownOpen);
                          setPostsDropdownOpen(false);
                          setInsightsDropdownOpen(false);
                          if (siteIdentifier) {
                            fetchSpaces(siteIdentifier);
                          }
                        }}
                      >
                        <Files className="h-3.5 w-3.5" />
                        <ChevronDown className="h-2.5 w-2.5 opacity-40" />
                      </button>
                      
                      {spacesDropdownOpen && (
                        <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-visible z-50">
                          {loadingSpaces ? (
                            <div className="px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300">
                              Loading spaces...
                            </div>
                          ) : spaces && spaces.length > 0 ? (
                            <div className="py-1">
                              {spaces.map(space => {
                                if (siteIdentifier) {
                                  const spaceUrl = APP_ROUTES.DASHBOARD_SITE.SITE_CONFIG_SPACE(siteIdentifier, space.slug || '');
                                  return (
                                    <a 
                                      key={space.id} 
                                      href={spaceUrl} 
                                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline"
                                      onClick={() => setSpacesDropdownOpen(false)}
                                    >
                                      {space.name} ({space.slug})
                                    </a>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          ) : (
                            <div className="py-1">
                              <div className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                                No spaces available
                              </div>
                              <a 
                                href={siteIdentifier ? `/dashboard/site/${siteIdentifier}/site-config` : "#"}
                                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 no-underline"
                              >
                                Create a space
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Posts Dropdown - Simple Implementation */}
                    <div className="relative group" ref={postsDropdownRef}>
                      <button
                        className={cn(
                          "flex items-center gap-1 justify-center p-1.5 rounded-md border",
                          borderColor, 
                          buttonBg, 
                          iconColor,
                          buttonBgHover
                        )}
                        onClick={() => {
                          setPostsDropdownOpen(!postsDropdownOpen);
                          setSpacesDropdownOpen(false);
                          setInsightsDropdownOpen(false);
                          fetchCmsTypes('official');
                        }}
                      >
                        <Files className="h-3.5 w-3.5" />
                        <ChevronDown className="h-2.5 w-2.5 opacity-40" />
                      </button>
                      
                      {postsDropdownOpen && (
                        <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-visible z-50">
                          {loadingCmsTypes ? (
                            <div className="px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300">
                              Loading post types...
                            </div>
                          ) : cmsTypes && cmsTypes.length > 0 ? (
                            <div className="py-1">
                              {cmsTypes.map(type => {
                                if (siteIdentifier) {
                                  const typeSlug = type.name.toLowerCase().replace(/[\s&]+/g, '-');
                                  const contentUrl = APP_ROUTES.DASHBOARD_SITE.CONTENT_SECTION(siteIdentifier, typeSlug);
                                  return (
                                    <a 
                                      key={type.id} 
                                      href={contentUrl}
                                      className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2"
                                      onClick={() => setPostsDropdownOpen(false)}
                                    >
                                      {getIconComponent(type.icon_name)}
                                      <span>{type.name}</span>
                                    </a>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          ) : (
                            <div className="py-1">
                              <div className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                                No post types available
                              </div>
                              <a 
                                href={siteIdentifier ? `/dashboard/site/${siteIdentifier}/content` : "#"}
                                className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 no-underline"
                              >
                                Go to content
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Insights Dropdown - Simple Implementation */}
                    <div className="relative group" ref={insightsDropdownRef}>
                      <button
                        className={cn(
                          "flex items-center gap-1 justify-center p-1.5 rounded-md border",
                          borderColor, 
                          buttonBg, 
                          iconColor,
                          buttonBgHover
                        )}
                        onClick={() => {
                          setInsightsDropdownOpen(!insightsDropdownOpen);
                          setSpacesDropdownOpen(false);
                          setPostsDropdownOpen(false);
                        }}
                      >
                        <BarChart2 className="h-3.5 w-3.5" />
                        <ChevronDown className="h-2.5 w-2.5 opacity-40" />
                      </button>
                      
                      {insightsDropdownOpen && (
                        <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-visible z-50">
                          <div className="py-1">
                            <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline" onClick={() => setInsightsDropdownOpen(false)}>
                              Analytics
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline" onClick={() => setInsightsDropdownOpen(false)}>
                              Conversions
                            </a>
                            <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline" onClick={() => setInsightsDropdownOpen(false)}>
                              Traffic
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                
              </div>

              {/* Right Section - Breadcrumbs and Actions */}
              <div className="flex-1 flex items-center justify-between px-3">
                {/* Breadcrumbs */}
                <div className={cn("flex items-center text-xs", secondaryTextColor)}>
                  <span>Dashboard</span>
                  
                  {location !== '/' && location !== '/dashboard' && (
                    <>
                      {/* Extract section and subsection for all dashboard routes */}
                      {(() => {
                        const parts = location.split('/');
                        // For dashboard/site routes
                        if (location.startsWith('/dashboard/site/') && parts.length >= 5) {
                          const section = parts[4]; // e.g., 'people', 'content'
                          const subsection = parts[5]; // e.g., 'staff', 'members', 'events'
                          
                          return (
                            <>
                              <svg className="h-3 w-3 mx-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                <path d="M6 12L10 8L6 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span className={cn("font-medium", primaryTextColor)}>
                                {section.charAt(0).toUpperCase() + section.slice(1)}
                              </span>
                              
                              {subsection && (
                                <>
                                  <svg className="h-3 w-3 mx-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                    <path d="M6 12L10 8L6 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  <span className={cn("font-medium", primaryTextColor)}>
                                    {subsection.charAt(0).toUpperCase() + subsection.slice(1)}
                                  </span>
                                </>
                              )}
                            </>
                          );
                        }
                        return null;
                      })()}

                      {/* Handle non-site-specific dashboard routes */}
                      {location.startsWith('/dashboard/') && !location.startsWith('/dashboard/site/') && (
                        <>
                          {(() => {
                            const parts = location.split('/');
                            if (parts.length >= 3) {
                              const section = parts[2];
                              const subsection = parts[3];
                              
                              return (
                                <>
                                  <svg className="h-3 w-3 mx-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                    <path d="M6 12L10 8L6 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                  <span className={cn("font-medium", primaryTextColor)}>
                                    {section.charAt(0).toUpperCase() + section.slice(1)}
                                  </span>
                                  {subsection && (
                                    <>
                                      <svg className="h-3 w-3 mx-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                        <path d="M6 12L10 8L6 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                      <span className={cn("font-medium", primaryTextColor)}>
                                        {subsection.charAt(0).toUpperCase() + subsection.slice(1)}
                                      </span>
                                    </>
                                  )}
                                </>
                              );
                            }
                            return null;
                          })()}
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  {/* Conditional Button: View Site / Go to Dashboard */} 
                  {variant === 'dashboard' ? (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className={cn(borderColor, buttonBg, primaryTextColor, buttonBgHover)}
                      onClick={() => {
                        // Use the current location to ensure it works in all scenarios
                        const currentSiteIdentifier = siteIdentifier || getSiteIdentifierFromRoute(location);
                        if (currentSiteIdentifier) {
                          const targetUrl = `${window.location.origin}/site/${currentSiteIdentifier}`;
                          console.log("Opening site URL:", targetUrl);
                          window.location.href = targetUrl;
                        } else {
                          console.error("No site identifier found");
                        }
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      View Site
                    </Button>
                  ) : (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className={cn(
                        borderColor, 
                        buttonBg, 
                        variant === 'site' ? "text-gray-300 dark:text-gray-700" : "text-gray-700 dark:text-gray-300",
                        buttonBgHover
                      )}
                      onClick={() => {
                        if (siteIdentifier) {
                          // Use APP_ROUTES with window.location.origin for proper linking
                          const dashboardPath = APP_ROUTES.DASHBOARD_SITE.INDEX(siteIdentifier);
                          const dashboardUrl = `${window.location.origin}${dashboardPath}`;
                          console.log("Opening dashboard URL:", dashboardUrl);
                          window.location.href = dashboardUrl;
                        }
                      }}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Go to Dashboard
                    </Button>
                  )}

                  {/* Conditional Close Button for Site Variant */} 
                  {variant === 'site' && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsSiteHeaderVisible(false)}
                      className={cn(iconColor, buttonBgHover, "w-8 h-8 p-1.5")}
                      aria-label="Hide header"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  )}

                  {/* Publish Button (Only show in dashboard?) */} 
                  {variant === 'dashboard' && (
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger asChild>
                        <Button 
                          variant="default" 
                          size="sm" 
                        >
                          Publish
                          <ChevronDown />
                        </Button>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content 
                          className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 py-1 w-48 mt-1"
                          sideOffset={5}
                          align="end"
                        >
                          <DropdownMenu.Item className="px-3 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center text-gray-700 dark:text-gray-300">
                            Publish Now
                          </DropdownMenu.Item>
                          <DropdownMenu.Item className="px-3 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center text-gray-700 dark:text-gray-300">
                            Schedule Publish
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                          <DropdownMenu.Item className="px-3 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center text-red-600 dark:text-red-400">
                            Unpublish
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  )}

                  {/* Mobile Menu Button */}
                  <div className="lg:hidden">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={onToggleMobileMenu}
                      className={cn(iconColor, buttonBgHover)}
                    >
                      <Menu />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
    </motion.header>
  );
}


