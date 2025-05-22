import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { APP_ROUTES } from "@/config/routes";
import { BaseSidebarProps } from "./types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  Plus,
  Files,
  Dock,
  PanelTop,
  PanelLeft,
  PanelRight,
  PanelBottom,
  ChevronDown,
  AppWindow,
  Logs,
  SquareMousePointer,
  SquareDashedBottomCode,
  AppWindowMac,
  Folder,
  MessageSquare,
  HelpCircle,
  FileText,
  Calendar,
  Star,
  Loader2,
  BookOpen,
  Layout,
  Briefcase
} from "lucide-react";
import { motion } from "framer-motion";
import { NavigationItem as NavItemUI } from "@/components/ui/navigation-item";
import { NavigationSection as NavSectionUI } from "@/components/ui/navigation-section";
import { SideNavItem } from "./SidebarNavigationItems";
import { MinimalItem, TreeFolder } from "./SidebarTreeComponents";
import { sitesApi } from "@/lib/api";
import { getApiBaseUrl } from "@/lib/utils";
import { EditSpaceDialog } from "@/components/ui/edit-space-dialog";
import { useSiteData } from "../../../../lib/SiteDataContext";

// Define interface for spaces
interface Space {
  id: string;
  name: string;
  slug: string;
  cms_type?: string; // This is now a CMS type ID
  cms_type_name?: string; // Human-readable name for display
  description?: string;
  hidden?: boolean;
  visibility?: string;
  site_id: string;
}

// Local NavigationSection and NavigationItem components
const NavigationSection = memo(({ 
  title, 
  icon, 
  defaultActive, 
  children 
}: {
  title: string;
  icon: React.ReactNode;
  defaultActive?: boolean;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(defaultActive);
  return (
    <NavSectionUI title={title} icon={icon} defaultActive={defaultActive}>
      {children}
    </NavSectionUI>
  );
});

NavigationSection.displayName = 'NavigationSection';

const NavigationItem = memo(({ 
  icon, 
  title 
}: { 
  icon: React.ReactNode; 
  title: string 
}) => {
  return <NavItemUI icon={icon} title={title} />;
});

NavigationItem.displayName = 'NavigationItem';

export const SiteConfigSidebar: React.FC<BaseSidebarProps> = memo(({ 
  currentPathname, 
  isActiveUrl,
  currentSiteIdentifier,
  onNewContent
}) => {
  // If no currentSiteIdentifier is provided, show nothing
  if (!currentSiteIdentifier) {
    return null;
  }

  const [searchTerm, setSearchTerm] = useState("");
  
  // Get site data and CMS types from context
  const { sites, cmsTypes: contextCmsTypes, loadSite } = useSiteData();
  
  // Space management states
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [siteId, setSiteId] = useState<string | null>(currentSiteIdentifier || null);
  
  // Space editing states
  const [editSpaceDialogOpen, setEditSpaceDialogOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);

  // CMS Types for proper naming
  const [localCmsTypes, setLocalCmsTypes] = useState<Record<string, string>>({});
  
  // Create cms types mapping
  useEffect(() => {
    if (contextCmsTypes && contextCmsTypes.length > 0) {
      // Create a mapping of CMS type IDs to names
      const typeMap: Record<string, string> = {};
      contextCmsTypes.forEach((type: any) => {
        typeMap[type.id] = type.name;
      });
      
      setLocalCmsTypes(typeMap);
    }
  }, [contextCmsTypes]);

  // Fetch site details to get proper ID if needed
  useEffect(() => {
    const fetchSiteDetails = async () => {
      if (!currentSiteIdentifier) return;
      
      try {
        // Check if site is in context
        if (sites[currentSiteIdentifier]) {
          setSiteId(sites[currentSiteIdentifier].id);
          return;
        }
        
        // Otherwise load from API
        const siteData = await loadSite(currentSiteIdentifier);
        if (siteData) {
          setSiteId(siteData.id);
        }
      } catch (error) {
        console.error("Error fetching site details:", error);
        setError("Failed to load site details");
      }
    };
    
    fetchSiteDetails();
  }, [currentSiteIdentifier, sites, loadSite]);

  // Fetch actual spaces from API once we have the siteId
  useEffect(() => {
    const fetchSpaces = async () => {
      if (!siteId) return;
      
      // Only proceed if siteId looks like a UUID (basic check)
      if (!siteId.includes('-')) {
        console.log('Waiting for site UUID to be fetched...');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const API_BASE = getApiBaseUrl();
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
            cms_type: space.cms_type || 'custom',
            description: space.description,
            hidden: space.hidden,
            visibility: space.visibility,
            site_id: space.site_id || siteId
          }));
          
          setSpaces(mappedSpaces);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching spaces:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpaces();
  }, [siteId]);

  // Update spaces with CMS type names
  useEffect(() => {
    if (Object.keys(localCmsTypes).length > 0 && spaces.length > 0) {
      // Add CMS type names to spaces
      const updatedSpaces = spaces.map(space => {
        if (space.cms_type && localCmsTypes[space.cms_type]) {
          return {
            ...space,
            cms_type_name: localCmsTypes[space.cms_type]
          };
        }
        return space;
      });
      
      setSpaces(updatedSpaces);
    }
  }, [localCmsTypes, spaces]);

  // Handle space edit request
  const handleEditSpace = useCallback((space: Space) => {
    setSelectedSpace(space);
    setEditSpaceDialogOpen(true);
  }, []);

  // Handle space update completion
  const handleSpaceUpdated = useCallback(() => {
    // Refetch spaces to get the updated data
    if (siteId) {
      // Only proceed if siteId looks like a UUID (basic check)
      if (!siteId.includes('-')) {
        console.log('Waiting for site UUID to be fetched...');
        return;
      }
      
      const fetchSpaces = async () => {
        setIsLoading(true);
        try {
          const API_BASE = getApiBaseUrl();
          const response = await fetch(`${API_BASE}/api/v1/sites/${siteId}/spaces`);
          
          if (!response.ok) {
            throw new Error('Failed to refresh spaces');
          }
          
          const spacesData = await response.json();
          
          if (Array.isArray(spacesData)) {
            const mappedSpaces: Space[] = spacesData.map((space: any) => ({
              id: space.id,
              name: space.name,
              slug: space.slug,
              cms_type: space.cms_type || 'custom',
              description: space.description,
              hidden: space.hidden,
              visibility: space.visibility,
              site_id: space.site_id || siteId
            }));
            
            setSpaces(mappedSpaces);
          }
        } catch (error) {
          console.error('Error refreshing spaces:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchSpaces();
    }
  }, [siteId]);

  // Get icon based on space type - memoized for performance
  const getSpaceIcon = useCallback((space: Space) => {
    // Use cms_type_name if available, otherwise fall back to cms_type
    const typeForIcon = space.cms_type_name || space.cms_type || 'custom';
    
    switch (typeForIcon.toLowerCase()) {
      case 'discussion':
        return <MessageSquare className="h-3.5 w-3.5" />;
      case 'qa':
        return <HelpCircle className="h-3.5 w-3.5" />;
      case 'blog':
        return <FileText className="h-3.5 w-3.5" />;
      case 'event':
        return <Calendar className="h-3.5 w-3.5" />;
      case 'wishlist':
        return <Star className="h-3.5 w-3.5" />;
      case 'knowledge':
        return <BookOpen className="h-3.5 w-3.5" />;
      case 'landing':
        return <Layout className="h-3.5 w-3.5" />;
      case 'jobs':
        return <Briefcase className="h-3.5 w-3.5" />;
      default:
        return <AppWindowMac className="h-3.5 w-3.5" />;
    }
  }, []);

  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Filter spaces based on search term - memoized to prevent recalculation
  const filteredSpaces = useMemo(() => 
    spaces.filter(space => 
      space.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [spaces, searchTerm]
  );

  // Determine if the accordion should be expanded by default
  const accordionShouldBeExpanded = useMemo(() => 
    currentPathname.startsWith(APP_ROUTES.DASHBOARD_SITE.SITE_CONFIG(currentSiteIdentifier)),
    [currentPathname, currentSiteIdentifier]
  );
  
  const defaultAccordionState = accordionShouldBeExpanded ? "spaces" : "";

  const basePath = useMemo(() => 
    APP_ROUTES.DASHBOARD_SITE.SITE_CONFIG(currentSiteIdentifier),
    [currentSiteIdentifier]
  );

  // Handle new content button click
  const handleNewContent = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (onNewContent) onNewContent();
  }, [onNewContent]);

  return (
    <div className="p-3">
      {/* Edit Space Dialog */}
      <EditSpaceDialog 
        open={editSpaceDialogOpen} 
        onOpenChange={setEditSpaceDialogOpen} 
        space={selectedSpace} 
        siteId={siteId || ''} 
        onSpaceUpdated={handleSpaceUpdated}
      />
      
      <motion.div 
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="mb-3"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
              Site
            </h2>
            <button 
              className="p-0.5 px-1 rounded-md bg-blue-500 hover:bg-blue-600 flex items-center justify-center cursor-pointer"
              onClick={onNewContent}
            >
              <Plus className="h-3 w-3 text-white" />
              <span className="text-[11px] font-medium text-white">New</span>
            </button>
          </div>

          <div className="relative w-full mb-2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
              <Search className="w-3.5 h-3.5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-1 pl-7 pr-2 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-gray-300 focus:outline-none"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </motion.div>

      <Accordion
        type="single"
        collapsible
        defaultValue={defaultAccordionState}
        className="space-y-1"
      >
        <AccordionItem value="spaces" className="border-0">
          <AccordionTrigger className="flex items-center py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Files className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium text-sm">Spaces</span>
              </div>
              <div className="relative ml-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const dropdown = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (dropdown) {
                      dropdown.classList.toggle("hidden");
                    }
                  }}
                  className="p-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center cursor-pointer"
                >
                  <Plus className="h-3 w-3 text-gray-400" />
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 hidden z-50">
                  <div className="py-1">
                    <a
                      href="#"
                      className="flex items-center px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={handleNewContent}
                    >
                      <Files className="h-3 w-3 mr-2 text-gray-500" />
                      <span>Create new Space</span>
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Folder className="h-3 w-3 mr-2 text-gray-500" />
                      <span>Create new Folder</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-1">
            <div>
              <MinimalItem
                name="Feed"
                path={basePath}
                currentPathname={currentPathname}
                icon={<AppWindowMac className="h-3.5 w-3.5" />}
                iconColor="text-gray-500"
                inSpaces={true}
                showToggle={true}
                toggleOn={true}
                isPrimary={true}
                isHomepage={true}
              />
              {/* Spaces folder with real data */}
              <TreeFolder
                name="Spaces"
                path={basePath}
                currentPathname={currentPathname}
                isExpanded={currentPathname.startsWith(basePath)}
              >
                {isLoading ? (
                  <motion.div 
                    className="flex items-center justify-center py-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />
                    <span className="text-xs text-gray-500 ml-2">Loading spaces...</span>
                  </motion.div>
                ) : error ? (
                  <motion.div 
                    className="text-xs text-red-500 py-2 px-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {error}
                  </motion.div>
                ) : filteredSpaces.length === 0 ? (
                  <motion.div 
                    className="text-xs text-gray-500 py-2 px-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {searchTerm ? "No spaces match your search" : "No spaces found"}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.02, duration: 0.2 }}
                  >
                    {filteredSpaces.map((space) => (
                      <MinimalItem
                        key={space.id}
                        name={space.name}
                        path={APP_ROUTES.DASHBOARD_SITE.SITE_CONFIG_SPACE(currentSiteIdentifier, space.slug)}
                        currentPathname={currentPathname}
                        icon={getSpaceIcon(space)}
                        iconColor="text-gray-500"
                        inSpaces={true}
                        level={1}
                        showToggle={false}
                        isPrimary={false}
                        onEdit={() => handleEditSpace(space)}
                      />
                    ))}
                  </motion.div>
                )}
              </TreeFolder>
            </div>
          </AccordionContent>
        </AccordionItem>

        <div className="border-0">
          <div
            className="flex items-center py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline cursor-pointer"
            onClick={() => {
              const content = document.getElementById("navigation-content-people");
              const chevron = document.getElementById("navigation-chevron-people");
              if (content && chevron) {
                content.classList.toggle("hidden");
                chevron.style.transform = content.classList.contains("hidden")
                  ? "rotate(-90deg)"
                  : "rotate(0deg)";
              }
            }}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Dock className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium text-sm">
                  Navigation
                </span>
              </div>
              <ChevronDown
                id="navigation-chevron-people"
                className="h-3.5 w-3.5 text-gray-400 transition-transform duration-200"
              />
            </div>
          </div>
          <div id="navigation-content-people" className="pb-1 hidden">
            <div className="px-2 mb-2">
              <p className="text-[11px] text-gray-500 dark:text-gray-500">
                These settings apply globally. Customize it for individual
                people sections if required.
              </p>
            </div>
            <div className="space-y-1">
              <NavigationSection
                title="Header"
                icon={<PanelTop />}
                defaultActive={true}
              >
                <NavigationItem
                  icon={<AppWindow className="h-3.5 w-3.5 dark:text-amber-200 text-amber-600/80" />}
                  title="Top Navigation"
                />
              </NavigationSection>
              <NavigationSection
                title="LeftSidebar"
                icon={<PanelLeft />}
                defaultActive={true}
              >
                <NavigationItem
                  icon={<Logs className="h-3.5 w-3.5 dark:text-amber-200 text-amber-600/80" />}
                  title="Menu"
                />
              </NavigationSection>
              <NavigationSection
                title="RightSidebar"
                icon={<PanelRight />}
                defaultActive={false}
              >
                <NavigationItem
                  icon={<SquareMousePointer className="h-3.5 w-3.5 dark:text-amber-200 text-amber-600/80" />}
                  title="Banner"
                />
                <NavigationItem
                  icon={<Logs className="h-3.5 w-3.5 dark:text-amber-200 text-amber-600/80" />}
                  title="Menu"
                />
              </NavigationSection>
              <NavigationSection
                title="Footer"
                icon={<PanelBottom />}
                defaultActive={false}
              >
                <NavigationItem
                  icon={<SquareDashedBottomCode className="h-3.5 w-3.5 dark:text-amber-200 text-amber-600/80" />}
                  title="FooterBlock"
                />
              </NavigationSection>
            </div>
          </div>
        </div>
      </Accordion>
    </div>
  );
});

SiteConfigSidebar.displayName = 'SiteConfigSidebar';