import React, { useState, useEffect } from "react";
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
import { NavigationItem as NavItemUI } from "@/components/ui/navigation-item";
import { NavigationSection as NavSectionUI } from "@/components/ui/navigation-section";
import { SideNavItem } from "./SidebarNavigationItems";
import { MinimalItem, TreeFolder } from "./SidebarTreeComponents";
import { sitesApi, cmsTypesApi } from "@/lib/api";
import { getApiBaseUrl } from "@/lib/utils";

// Define interface for spaces
interface Space {
  id: string;
  name: string;
  slug: string;
  cms_type?: string; // This is now a CMS type ID
  cms_type_name?: string; // Human-readable name for display
}

// Local NavigationSection and NavigationItem components
const NavigationSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  defaultActive?: boolean;
  children: React.ReactNode;
}> = ({ title, icon, defaultActive, children }) => {
  const [isOpen, setIsOpen] = useState(defaultActive);
  return (
    <NavSectionUI title={title} icon={icon} defaultActive={defaultActive}>
      {children}
    </NavSectionUI>
  );
};

const NavigationItem: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => {
  return <NavItemUI icon={icon} title={title} />;
};

export const SiteConfigSidebar: React.FC<BaseSidebarProps> = ({ 
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
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [siteId, setSiteId] = useState<string | null>(null);

  // First fetch the site to get its UUID
  useEffect(() => {
    const fetchSiteData = async () => {
      if (!currentSiteIdentifier) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch site data using the sitesApi
        const siteData = await sitesApi.getSite(currentSiteIdentifier);
        setSiteId(siteData.id);
        
        // Continue with generating spaces if we can't fetch real ones yet
        if (siteData.content_types && Array.isArray(siteData.content_types)) {
          const generatedSpaces: Space[] = siteData.content_types.map((cmsType: string) => {
            let name;
            
            switch (cmsType) {
              case 'discussion':
                name = 'Discussions';
                break;
              case 'qa':
                name = 'Q&A';
                break;
              case 'wishlist':
                name = 'Ideas & Wishlist';
                break;
              case 'blog':
                name = 'Blog';
                break;
              case 'event':
                name = 'Events';
                break;
              case 'knowledge':
                name = 'Knowledge Base';
                break;
              case 'landing':
                name = 'Landing Pages';
                break;
              case 'jobs':
                name = 'Job Board';
                break;
              default:
                name = cmsType.charAt(0).toUpperCase() + cmsType.slice(1);
            }
            
            return {
              id: `space-${cmsType}`,
              name,
              slug: cmsType.toLowerCase(),
              cms_type: cmsType,
            };
          });
          
          setSpaces(generatedSpaces);
        }
      } catch (err) {
        console.error("Error fetching site data:", err);
        setError(err instanceof Error ? err.message : "Failed to load site data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, [currentSiteIdentifier]);

  // Fetch actual spaces from API once we have the siteId
  useEffect(() => {
    const fetchSpaces = async () => {
      if (!siteId) return;
      
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
        console.log('Fetched spaces:', spacesData);
        
        if (Array.isArray(spacesData)) {
          const mappedSpaces: Space[] = spacesData.map((space: any) => ({
            id: space.id,
            name: space.name,
            slug: space.slug,
            cms_type: space.cms_type || 'custom',
          }));
          
          setSpaces(mappedSpaces);
          
          // If we have CMS type IDs, we should also fetch CMS type details to get the names
          if (mappedSpaces.some(space => space.cms_type)) {
            try {
              // Get a list of unique CMS type IDs, filtering out undefined values
              const cmsTypeIds = Array.from(
                new Set(
                  mappedSpaces
                    .map(space => space.cms_type)
                    .filter((id): id is string => !!id) // Type guard to ensure non-null values
                )
              );
              
              if (cmsTypeIds.length > 0) {
                console.log('Fetching CMS type details for IDs:', cmsTypeIds);
                
                // Fetch each CMS type one by one
                const cmsTypeDetails = await Promise.all(
                  cmsTypeIds.map(async (typeId) => {
                    try {
                      return await cmsTypesApi.getCmsTypeById(typeId);
                    } catch (err) {
                      console.error(`Error fetching CMS type ${typeId}:`, err);
                      return null;
                    }
                  })
                );
                
                // Create a mapping of ID to CMS type details
                const cmsTypeMap = new Map();
                cmsTypeDetails
                  .filter(Boolean)
                  .forEach(cmsType => {
                    if (cmsType && cmsType.id) {
                      cmsTypeMap.set(cmsType.id, cmsType);
                    }
                  });
                
                // Update spaces with CMS type names
                if (cmsTypeMap.size > 0) {
                  setSpaces(prevSpaces => prevSpaces.map(space => {
                    const cmsTypeId = space.cms_type;
                    if (cmsTypeId && cmsTypeMap.has(cmsTypeId)) {
                      const cmsType = cmsTypeMap.get(cmsTypeId);
                      if (cmsType) {
                        return {
                          ...space,
                          cms_type_name: cmsType.name // Store the name separately
                        };
                      }
                    }
                    return space;
                  }));
                }
              }
            } catch (err) {
              console.error("Error fetching CMS type details:", err);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching spaces:", err);
        // Don't set error - we'll keep the generated spaces if we can't fetch real ones
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpaces();
  }, [siteId]);

  // Get icon based on space type
  const getSpaceIcon = (space: Space) => {
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
  };

  // Filter spaces based on search term
  const filteredSpaces = spaces.filter(space => 
    space.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determine if the accordion should be expanded by default
  const accordionShouldBeExpanded = currentPathname.startsWith(APP_ROUTES.DASHBOARD_SITE.SITE_CONFIG(currentSiteIdentifier));
  const defaultAccordionState = accordionShouldBeExpanded ? "spaces" : "";

  const basePath = APP_ROUTES.DASHBOARD_SITE.SITE_CONFIG(currentSiteIdentifier);

  return (
    <div className="p-3">
      <div className="mb-3">
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

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
                      onClick={(e) => {
                        e.preventDefault();
                        if (onNewContent) onNewContent();
                      }}
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
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />
                    <span className="text-xs text-gray-500 ml-2">Loading spaces...</span>
                  </div>
                ) : error ? (
                  <div className="text-xs text-red-500 py-2 px-2">
                    {error}
                  </div>
                ) : filteredSpaces.length === 0 ? (
                  <div className="text-xs text-gray-500 py-2 px-2">
                    {searchTerm ? "No spaces match your search" : "No spaces found"}
                  </div>
                ) : (
                  filteredSpaces.map((space) => (
                    <MinimalItem
                      key={space.id}
                      name={space.name}
                      path={`${basePath}/spaces/${space.slug}`}
                      currentPathname={currentPathname}
                      icon={getSpaceIcon(space)}
                      iconColor="text-gray-500"
                      inSpaces={true}
                      level={1}
                      showToggle={false}
                      isPrimary={false}
                    />
                  ))
                )}
              </TreeFolder>
            </div>
          </AccordionContent>
        </AccordionItem>

        <div className="h-px bg-gray-100 dark:bg-gray-700 mx-1"></div>

        {/* Navigation Sections */}
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
};