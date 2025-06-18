import { Button } from "@/components/ui/primitives";
import { Input } from "@/components/ui/primitives";
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
  Folder,
  Sparkles,
  Cog,
      Database,
    FilesIcon,
    AppWindowMac,
    ScreenShare,
    MonitorCog,
    ShieldPlus,
    UserPlus
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
import { CreateContentDialog } from "@/components/features/content";
import { NewPeopleDialog } from "@/components/features/people";
import { AddContentDialog } from "@/components/features/content/ContentTypeManagerDialog";

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
  
  // Extract siteIdentifier from URL if not provided as prop
  const currentSiteIdentifier = siteIdentifier || getSiteIdentifierFromRoute(location);
  
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
  
  // Update local spaces from context when currentSiteIdentifier changes
  useEffect(() => {
    if (currentSiteIdentifier && contextSpaces[currentSiteIdentifier]) {
      setSpaces(contextSpaces[currentSiteIdentifier]);
    } else {
      // Use fallback data when nothing is available in context
      setSpaces([
        { id: 'fallback-1', name: 'Events', slug: 'events', site_id: currentSiteIdentifier || '' },
        { id: 'fallback-2', name: 'Q&A', slug: 'qa', site_id: currentSiteIdentifier || '' },
        { id: 'fallback-3', name: 'Discussions', slug: 'discussions', site_id: currentSiteIdentifier || '' },
        { id: 'fallback-4', name: 'Wishlist', slug: 'wishlist', site_id: currentSiteIdentifier || '' },
        { id: 'fallback-5', name: 'Knowledge Base', slug: 'knowledge', site_id: currentSiteIdentifier || '' }
      ]);
    }
  }, [currentSiteIdentifier, contextSpaces]);
  
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
    if (currentSiteIdentifier) {
      setLoadingSpaces(spacesLoading[currentSiteIdentifier] || false);
    }
  }, [currentSiteIdentifier, spacesLoading]);
  
  useEffect(() => {
    setLoadingCmsTypes(cmsTypesLoading);
  }, [cmsTypesLoading]);
  
  // Track spaces changes
  useEffect(() => {
  }, [spaces]);
  
  // Track cmsTypes changes
  useEffect(() => {
  }, [cmsTypes]);
  
  // Fetch site data when currentSiteIdentifier changes
  useEffect(() => {
    const fetchSiteData = async () => {
      if (!currentSiteIdentifier) {
        setSiteData(null);
        return;
      }
      
      setIsLoading(true);
      try {
        // Fetch site data using the identifier (works with both UUID and subdomain)
        const data = await sitesApi.getSite(currentSiteIdentifier);
        setSiteData(data);
        
        // Trigger context fetch for spaces
        if (currentSiteIdentifier) {
          fetchSpaces(currentSiteIdentifier);
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
  }, [currentSiteIdentifier, fetchSpaces, fetchCmsTypes]);
  
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
  const logoFixedClasses = "fixed mt-8 top-3 right-5 z-[99999] rounded-md shadow-lg cursor-pointer bg-gray-900 dark:bg-white";

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (variant === 'site' && !isSiteHeaderVisible) {
      setIsSiteHeaderVisible(true);
    } else {
      // Toggle the logo dropdown instead of navigating
      console.log('Logo clicked, toggling dropdown. Current state:', logoDropdownOpen);
      console.log('Site identifier:', currentSiteIdentifier);
      setLogoDropdownOpen(!logoDropdownOpen);
      // Close other dropdowns
      setSpacesDropdownOpen(false);
      setPostsDropdownOpen(false);
      setInsightsDropdownOpen(false);
      setModerationDropdownOpen(false);
      setAddDropdownOpen(false);
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
  const [moderationDropdownOpen, setModerationDropdownOpen] = useState(false);
  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const [logoDropdownOpen, setLogoDropdownOpen] = useState(false);
  const [moreSubmenuOpen, setMoreSubmenuOpen] = useState(false);
  
  // Dialog states
  const [newPostDialogOpen, setNewPostDialogOpen] = useState(false);
  const [newPeopleDialogOpen, setNewPeopleDialogOpen] = useState(false);
  const [addContentDialogOpen, setAddContentDialogOpen] = useState(false);
  
  // Add refs for dropdown containers to handle click outside
  const spacesDropdownRef = useRef<HTMLDivElement>(null);
  const postsDropdownRef = useRef<HTMLDivElement>(null);
  const insightsDropdownRef = useRef<HTMLDivElement>(null);
  const moderationDropdownRef = useRef<HTMLDivElement>(null);
  const addDropdownRef = useRef<HTMLDivElement>(null);
  const logoDropdownRef = useRef<HTMLDivElement>(null);
  const moreSubmenuRef = useRef<HTMLDivElement>(null);
  
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
      
      // Close moderation dropdown if click is outside
      if (moderationDropdownRef.current && 
          !moderationDropdownRef.current.contains(event.target as Node) && 
          moderationDropdownOpen) {
        setModerationDropdownOpen(false);
      }
      
      // Close add dropdown if click is outside
      if (addDropdownRef.current && 
          !addDropdownRef.current.contains(event.target as Node) && 
          addDropdownOpen) {
        setAddDropdownOpen(false);
        setMoreSubmenuOpen(false);
      }
      
      // Close logo dropdown if click is outside
      if (logoDropdownRef.current && 
          !logoDropdownRef.current.contains(event.target as Node) && 
          logoDropdownOpen) {
        setLogoDropdownOpen(false);
      }
      
      // Close more submenu if click is outside
      if (moreSubmenuRef.current && 
          !moreSubmenuRef.current.contains(event.target as Node) && 
          moreSubmenuOpen) {
        setMoreSubmenuOpen(false);
      }
    };
    
    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [spacesDropdownOpen, postsDropdownOpen, insightsDropdownOpen, moderationDropdownOpen, addDropdownOpen, logoDropdownOpen, moreSubmenuOpen]);

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
            "relative", // Add relative positioning for dropdown
            logoContainerBase,
            variant === 'site' && !isSiteHeaderVisible 
              ? logoFixedClasses 
              : ["border-r", borderColor, "cursor-pointer"],
            logoDropdownOpen && variant === 'dashboard' ? "bg-gray-50 dark:bg-gray-700" : ""
          )}
          ref={logoDropdownRef}
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
          
          {/* Logo Dropdown */}
          {logoDropdownOpen && variant === 'dashboard' && (
            <div className="absolute left-0 top-full mt-1 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-visible z-[99999]">
              <div className="py-1">
                <button 
                  className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2"
                  onClick={() => {
                    console.log('All Sites clicked');
                    setLogoDropdownOpen(false);
                    window.location.href = '/sites';
                  }}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                  <span>All Sites</span>
                </button>
                
                <button 
                  className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2"
                  onClick={() => {
                    console.log('Moderator clicked, URL:', currentSiteIdentifier ? APP_ROUTES.DASHBOARD_MODERATOR.INDEX(currentSiteIdentifier) : 'No site identifier');
                    setLogoDropdownOpen(false);
                    if (currentSiteIdentifier) {
                      window.location.href = APP_ROUTES.DASHBOARD_MODERATOR.INDEX(currentSiteIdentifier);
                    }
                  }}
                >
                  <ShieldPlus className="h-4 w-4" />
                  <span>Moderator</span>
                </button>
                
                <button 
                  className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2"
                  onClick={() => {
                    console.log('Admin Dashboard clicked, URL:', currentSiteIdentifier ? APP_ROUTES.DASHBOARD_SITE.INDEX(currentSiteIdentifier) : 'No site identifier');
                    setLogoDropdownOpen(false);
                    if (currentSiteIdentifier) {
                      window.location.href = APP_ROUTES.DASHBOARD_SITE.INDEX(currentSiteIdentifier);
                    }
                  }}
                >
                  <MonitorCog className="h-4 w-4" />
                  <span>Admin Dashboard</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Conditionally Render Rest of Header Content (NO INNER ANIMATION) */}
        {(variant === 'dashboard' || (variant === 'site' && isSiteHeaderVisible)) && (
            <div className="flex-1 flex items-center">
              {/* Middle Section - App Navigation */}
              <div className={cn("w-64 flex-shrink-0 h-full border-r", borderColor)}>

                  <div className="flex h-full items-center justify-center gap-2 px-2">
                    {/* Spaces Dropdown - Mock Data */}
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
                          setModerationDropdownOpen(false);
                        }}
                      >
                        <FilesIcon className="h-3.5 w-3.5" />
                        <ChevronDown className="h-2.5 w-2.5 opacity-40" />
                      </button>
                      
                      {spacesDropdownOpen && (
                        <div className="absolute left-0 mt-1 w-64 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-visible z-[99999]">
                          <div className="py-1">
                            {/* Top section - Feed */}
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2"
                              onClick={() => setSpacesDropdownOpen(false)}
                            >
                              <AppWindowMac className="h-3.5 w-3.5" />
                              <span>Feed</span>
                            </a>
                            
                            {/* Divider */}
                            <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                            
                            {/* Spaces section */}
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center justify-between"
                              onClick={() => setSpacesDropdownOpen(false)}
                            >
                              <div className="flex items-center gap-2">
                                <Folder className="h-3.5 w-3.5" />
                                <span>General Discussion</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ExternalLink className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
                                <Cog className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
                              </div>
                            </a>
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center justify-between"
                              onClick={() => setSpacesDropdownOpen(false)}
                            >
                              <div className="flex items-center gap-2">
                                <HelpCircle className="h-3.5 w-3.5" />
                                <span>Q&A</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ExternalLink className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
                                <Cog className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
                              </div>
                            </a>
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center justify-between"
                              onClick={() => setSpacesDropdownOpen(false)}
                            >
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Events</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ExternalLink className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
                                <Cog className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
                              </div>
                            </a>
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center justify-between"
                              onClick={() => setSpacesDropdownOpen(false)}
                            >
                              <div className="flex items-center gap-2">
                                <Star className="h-3.5 w-3.5" />
                                <span>Feature Requests</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ExternalLink className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
                                <Cog className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
                              </div>
                            </a>
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center justify-between"
                              onClick={() => setSpacesDropdownOpen(false)}
                            >
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-3.5 w-3.5" />
                                <span>Knowledge Base</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ExternalLink className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
                                <Cog className="h-3.5 w-3.5 opacity-60 hover:opacity-100" />
                              </div>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Posts Dropdown - Mock Data */}
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
                          setModerationDropdownOpen(false);
                        }}
                      >
                        <Database className="h-3.5 w-3.5" />
                        <ChevronDown className="h-2.5 w-2.5 opacity-40" />
                      </button>
                      
                      {postsDropdownOpen && (
                        <div className="absolute left-0 mt-1 w-64 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-visible z-[99999]">
                          <div className="py-1">
                            {/* Top section - All Posts, Scheduled, Draft */}
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2"
                              onClick={() => setPostsDropdownOpen(false)}
                            >
                              <Files className="h-3.5 w-3.5" />
                              <span>All Posts</span>
                            </a>
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2"
                              onClick={() => setPostsDropdownOpen(false)}
                            >
                              <Calendar className="h-3.5 w-3.5" />
                              <span>All Scheduled</span>
                            </a>
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2"
                              onClick={() => setPostsDropdownOpen(false)}
                            >
                              <Package className="h-3.5 w-3.5" />
                              <span>All Draft</span>
                            </a>
                            
                            {/* Divider */}
                            <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                            
                            {/* Content types section */}
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2"
                              onClick={() => setPostsDropdownOpen(false)}
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span>Discussions</span>
                            </a>
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2"
                              onClick={() => setPostsDropdownOpen(false)}
                            >
                              <HelpCircle className="h-3.5 w-3.5" />
                              <span>Q&A</span>
                            </a>
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2"
                              onClick={() => setPostsDropdownOpen(false)}
                            >
                              <Calendar className="h-3.5 w-3.5" />
                              <span>Events</span>
                            </a>
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2"
                              onClick={() => setPostsDropdownOpen(false)}
                            >
                              <BookOpen className="h-3.5 w-3.5" />
                              <span>Blog Posts</span>
                            </a>
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2"
                              onClick={() => setPostsDropdownOpen(false)}
                            >
                              <Star className="h-3.5 w-3.5" />
                              <span>Ideas & Wishlist</span>
                            </a>
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2"
                              onClick={() => setPostsDropdownOpen(false)}
                            >
                              <Bell className="h-3.5 w-3.5" />
                              <span>Announcements</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Insights Dropdown - Mock Data */}
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
                          setModerationDropdownOpen(false);
                        }}
                      >
                        <BarChart2 className="h-3.5 w-3.5" />
                        <ChevronDown className="h-2.5 w-2.5 opacity-40" />
                      </button>
                      
                      {insightsDropdownOpen && (
                        <div className="absolute left-0 mt-1 w-64 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-visible z-[99999]">
                          <div className="py-1">
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2" 
                              onClick={() => setInsightsDropdownOpen(false)}
                            >
                              <BarChart2 className="h-3.5 w-3.5" />
                              <span>Analytics</span>
                            </a>
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2" 
                              onClick={() => setInsightsDropdownOpen(false)}
                            >
                              <Package className="h-3.5 w-3.5" />
                              <span>Conversions</span>
                            </a>
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2" 
                              onClick={() => setInsightsDropdownOpen(false)}
                            >
                              <Briefcase className="h-3.5 w-3.5" />
                              <span>Traffic</span>
                            </a>
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2" 
                              onClick={() => setInsightsDropdownOpen(false)}
                            >
                              <Star className="h-3.5 w-3.5" />
                              <span>Engagement</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Moderation Dropdown - Mock Data */}
                    <div className="relative group" ref={moderationDropdownRef}>
                      <button
                        className={cn(
                          "flex items-center gap-1 justify-center p-1.5 rounded-md border",
                          borderColor, 
                          buttonBg, 
                          iconColor,
                          buttonBgHover
                        )}
                        onClick={() => {
                          setModerationDropdownOpen(!moderationDropdownOpen);
                          setSpacesDropdownOpen(false);
                          setPostsDropdownOpen(false);
                          setInsightsDropdownOpen(false);
                        }}
                      >
                        <ShieldPlus className="h-3.5 w-3.5" />
                        <ChevronDown className="h-2.5 w-2.5 opacity-40" />
                      </button>
                      
                      {moderationDropdownOpen && (
                        <div className="absolute left-0 mt-1 w-64 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-visible z-[99999]">
                          <div className="py-1">
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2" 
                              onClick={() => setModerationDropdownOpen(false)}
                            >
                              <Package className="h-3.5 w-3.5" />
                              <span>Pending Posts</span>
                            </a>
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2" 
                              onClick={() => setModerationDropdownOpen(false)}
                            >
                              <Files className="h-3.5 w-3.5" />
                              <span>Reported Posts</span>
                            </a>
                            
                            {/* Divider */}
                            <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                            
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2" 
                              onClick={() => setModerationDropdownOpen(false)}
                            >
                              <Briefcase className="h-3.5 w-3.5" />
                              <span>Pending Members</span>
                            </a>
                            <a 
                              href="#" 
                              className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 no-underline flex items-center gap-2" 
                              onClick={() => setModerationDropdownOpen(false)}
                            >
                              <Star className="h-3.5 w-3.5" />
                              <span>Reported Members</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                
              </div>

              {/* Right Section - Breadcrumbs and Actions */}
              <div className="flex-1 flex items-center justify-between pl-3">
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
                  {/* Site Mode Action Buttons with Tooltips */}
                  {variant === 'site' && (
                    <Tooltip.Provider>
                      <div className="flex items-center">
                        {/* Add Dropdown for Site Mode */}
                        <div className={cn("h-12 flex items-center justify-center border-r border-l", borderColor)} ref={addDropdownRef}>
                          <div className="relative">
                            <Tooltip.Root>
                              <Tooltip.Trigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className={cn(
                                    "w-12 h-12 transition-all duration-200",
                                    variant === 'site' 
                                      ? "bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-200 text-gray-300 dark:text-gray-600" 
                                      : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                                  )}
                                  onClick={() => setAddDropdownOpen(!addDropdownOpen)}
                                >
                                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M5 12h14" />
                                  </svg>
                                </Button>
                              </Tooltip.Trigger>
                              <Tooltip.Portal>
                                <Tooltip.Content 
                                  className="bg-gray-900 dark:bg-gray-700 text-white px-2 py-1 rounded-md text-xs font-medium shadow-lg"
                                  sideOffset={8}
                                >
                                  Add
                                  <Tooltip.Arrow className="fill-gray-900 dark:fill-gray-700" />
                                </Tooltip.Content>
                              </Tooltip.Portal>
                            </Tooltip.Root>
                            
                            {addDropdownOpen && (
                              <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-visible z-[99999]">
                                <div className="py-1">
                                  <button 
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center gap-2"
                                    onClick={() => {
                                      setAddDropdownOpen(false);
                                      setNewPostDialogOpen(true);
                                    }}
                                  >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M12 5v14M5 12h14" />
                                    </svg>
                                    <span>New Content</span>
                                  </button>
                                  <button 
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center gap-2"
                                    onClick={() => {
                                      setAddDropdownOpen(false);
                                      setNewPeopleDialogOpen(true);
                                    }}
                                  >
                                    <UserPlus className="h-4 w-4" />
                                    <span>New People</span>
                                  </button>
                                  
                                  {/* More submenu */}
                                  <div 
                                    className="relative" 
                                    ref={moreSubmenuRef}
                                    onMouseEnter={() => setMoreSubmenuOpen(true)}
                                    onMouseLeave={() => setMoreSubmenuOpen(false)}
                                  >
                                    <button 
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center justify-between gap-2"
                                    >
                                      <div className="flex items-center gap-2">
                                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <circle cx="12" cy="12" r="1"/>
                                          <circle cx="19" cy="12" r="1"/>
                                          <circle cx="5" cy="12" r="1"/>
                                        </svg>
                                        <span>More</span>
                                      </div>
                                      <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                        <path d="M6 12L10 8L6 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </button>
                                    
                                    {moreSubmenuOpen && (
                                      <div 
                                        className="absolute right-full top-0 mr-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-visible z-[99999]"
                                      >
                                        <div className="py-1">
                                          <button 
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center gap-2"
                                            onClick={() => {
                                              setAddDropdownOpen(false);
                                              setMoreSubmenuOpen(false);
                                              setAddContentDialogOpen(true);
                                            }}
                                          >
                                            <Package className="h-4 w-4" />
                                            <span>New Content Type</span>
                                          </button>
                                          <button 
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center gap-2"
                                            onClick={() => {
                                              setAddDropdownOpen(false);
                                              setMoreSubmenuOpen(false);
                                              // Add New Moderator functionality here
                                              console.log("New Moderator clicked");
                                            }}
                                          >
                                            <ShieldPlus className="h-4 w-4" />
                                            <span>New Moderator</span>
                                          </button>
                                          <button 
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center gap-2"
                                            onClick={() => {
                                              setAddDropdownOpen(false);
                                              setMoreSubmenuOpen(false);
                                              // Add New App functionality here
                                              console.log("New App clicked");
                                            }}
                                          >
                                            <AppWindowMac className="h-4 w-4" />
                                            <span>New App</span>
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* View Dashboard Button */}
                        <div className={cn("h-12 flex items-center justify-center border-r", borderColor)}>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className={cn(
                                  "w-12 h-12 transition-all duration-200",
                                  variant === 'site' 
                                    ? "bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-200 text-gray-300 dark:text-gray-600" 
                                    : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                                )}
                                onClick={() => {
                                  if (currentSiteIdentifier) {
                                    // Use APP_ROUTES with window.location.origin for proper linking
                                    const dashboardPath = APP_ROUTES.DASHBOARD_SITE.INDEX(currentSiteIdentifier);
                                    const dashboardUrl = `${window.location.origin}${dashboardPath}`;
                                    console.log("Opening dashboard URL:", dashboardUrl);
                                    window.location.href = dashboardUrl;
                                  }
                                }}
                              >
                                <Cog className="h-4 w-4" />
                              </Button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content 
                                className="bg-gray-900 dark:bg-gray-700 text-white px-2 py-1 rounded-md text-xs font-medium shadow-lg"
                                sideOffset={8}
                              >
                                View Dashboard
                                <Tooltip.Arrow className="fill-gray-900 dark:fill-gray-700" />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        </div>

                        {/* Better Copilot Button */}
                        <div className="h-12 flex items-center justify-center">
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className={cn(
                                  "w-12 h-12 transition-all duration-200",
                                  variant === 'site' 
                                    ? "bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-200 text-gray-300 dark:text-gray-600" 
                                    : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                                )}
                                onClick={() => {
                                  // Add Better Copilot functionality here
                                  console.log("Better Copilot clicked");
                                }}
                              >
                                <Sparkles className="h-4 w-4" />
                              </Button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content 
                                className="bg-gray-900 dark:bg-gray-700 text-white px-2 py-1 rounded-md text-xs font-medium shadow-lg"
                                sideOffset={8}
                              >
                                Better Copilot
                                <Tooltip.Arrow className="fill-gray-900 dark:fill-gray-700" />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        </div>
                      </div>
                    </Tooltip.Provider>
                  )}

                  {/* Dashboard Action Buttons with Tooltips */}
                  {variant === 'dashboard' && (
                    <Tooltip.Provider>
                      <div className="flex items-center">
                        {/* Add Dropdown */}
                        <div className={cn("h-12 flex items-center justify-center border-r border-l", borderColor)} ref={addDropdownRef}>
                          <div className="relative">
                            <Tooltip.Root>
                              <Tooltip.Trigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="w-12 h-12 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200"
                                  onClick={() => setAddDropdownOpen(!addDropdownOpen)}
                                >
                                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M5 12h14" />
                                  </svg>
                                </Button>
                              </Tooltip.Trigger>
                              <Tooltip.Portal>
                                <Tooltip.Content 
                                  className="bg-gray-900 dark:bg-gray-700 text-white px-2 py-1 rounded-md text-xs font-medium shadow-lg"
                                  sideOffset={8}
                                >
                                  Add
                                  <Tooltip.Arrow className="fill-gray-900 dark:fill-gray-700" />
                                </Tooltip.Content>
                              </Tooltip.Portal>
                            </Tooltip.Root>
                            
                            {addDropdownOpen && (
                              <div className="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-visible z-[99999]">
                                <div className="py-1">
                                  <button 
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center gap-2"
                                    onClick={() => {
                                      setAddDropdownOpen(false);
                                      setNewPostDialogOpen(true);
                                    }}
                                  >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M12 5v14M5 12h14" />
                                    </svg>
                                    <span>New Content</span>
                                  </button>
                                  <button 
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center gap-2"
                                    onClick={() => {
                                      setAddDropdownOpen(false);
                                      setNewPeopleDialogOpen(true);
                                    }}
                                  >
                                    <UserPlus className="h-4 w-4" />
                                    <span>New People</span>
                                  </button>
                                  
                                  {/* More submenu */}
                                  <div 
                                    className="relative" 
                                    ref={moreSubmenuRef}
                                    onMouseEnter={() => setMoreSubmenuOpen(true)}
                                    onMouseLeave={() => setMoreSubmenuOpen(false)}
                                  >
                                    <button 
                                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center justify-between gap-2"
                                    >
                                      <div className="flex items-center gap-2">
                                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                          <circle cx="12" cy="12" r="1"/>
                                          <circle cx="19" cy="12" r="1"/>
                                          <circle cx="5" cy="12" r="1"/>
                                        </svg>
                                        <span>More</span>
                                      </div>
                                      <svg className="h-3 w-3" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                        <path d="M6 12L10 8L6 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </button>
                                    
                                    {moreSubmenuOpen && (
                                      <div 
                                        className="absolute right-full top-0 mr-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-visible z-[99999]"
                                      >
                                        <div className="py-1">
                                          <button 
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center gap-2"
                                            onClick={() => {
                                              setAddDropdownOpen(false);
                                              setMoreSubmenuOpen(false);
                                              setAddContentDialogOpen(true);
                                            }}
                                          >
                                            <Package className="h-4 w-4" />
                                            <span>New Content Type</span>
                                          </button>
                                          <button 
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center gap-2"
                                            onClick={() => {
                                              setAddDropdownOpen(false);
                                              setMoreSubmenuOpen(false);
                                              // Add New Moderator functionality here
                                              console.log("New Moderator clicked");
                                            }}
                                          >
                                            <ShieldPlus className="h-4 w-4" />
                                            <span>New Moderator</span>
                                          </button>
                                          <button 
                                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center gap-2"
                                            onClick={() => {
                                              setAddDropdownOpen(false);
                                              setMoreSubmenuOpen(false);
                                              // Add New App functionality here
                                              console.log("New App clicked");
                                            }}
                                          >
                                            <AppWindowMac className="h-4 w-4" />
                                            <span>New App</span>
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* View Site Button */}
                        <div className={cn("h-12 flex items-center justify-center border-r", borderColor)}>
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="w-12 h-12 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200"
                                onClick={() => {
                                  const siteId = currentSiteIdentifier || getSiteIdentifierFromRoute(location);
                                  if (siteId) {
                                    const targetUrl = `${window.location.origin}/site/${siteId}`;
                                    window.location.href = targetUrl;
                                  }
                                }}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content 
                                className="w-12 h-12 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200"
                                sideOffset={8}
                              >
                                View Site
                                <Tooltip.Arrow className="fill-gray-900 dark:fill-gray-700" />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        </div>

                        {/* Better Copilot Button */}
                        <div className="h-12 flex items-center justify-center">
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="w-12 h-12 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-all duration-200"
                                onClick={() => {
                                  // Add Better Copilot functionality here
                                  console.log("Better Copilot clicked");
                                }}
                              >
                                <Sparkles className="h-4 w-4" />

                              </Button>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content 
                                className="bg-gray-900 dark:bg-gray-700 text-white px-2 py-1 rounded-md text-xs font-medium shadow-lg"
                                sideOffset={8}
                              >
                                Better Copilot
                                <Tooltip.Arrow className="fill-gray-900 dark:fill-gray-700" />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        </div>
                      </div>
                    </Tooltip.Provider>
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
      
      {/* Dialogs */}
      <CreateContentDialog 
        open={newPostDialogOpen} 
        onOpenChange={setNewPostDialogOpen} 
      />
      <NewPeopleDialog 
        open={newPeopleDialogOpen} 
        onOpenChange={setNewPeopleDialogOpen} 
      />
      <AddContentDialog 
        open={addContentDialogOpen} 
        onOpenChange={setAddContentDialogOpen} 
      />
    </motion.header>
  );
}


