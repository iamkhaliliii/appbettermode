import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Files,
  Search,
  Plus,
  Folder,
  AppWindowMac,
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
} from "lucide-react";
import { MinimalItem, TreeFolder } from "./SidebarTreeComponents";
import { NavigationItem as NavItemUI } from "@/components/ui/navigation-item";
import { NavigationSection as NavSectionUI } from "@/components/ui/navigation-section";
import { Link, useLocation } from "wouter";
import { type NavItem } from "./types";
import { APP_ROUTES, getSiteRoute } from "@/config/routes";

interface SiteSidebarProps {
  currentPathname: string;
  siteName?: string;
  navItems?: NavItem[];
  currentSiteId?: string;
}

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

export const SiteSidebar: React.FC<SiteSidebarProps> = ({ 
  currentPathname, 
  siteName,
  navItems = [],
  currentSiteId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location] = useLocation();

  const filteredNavItems = navItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const siteBase = currentSiteId ? APP_ROUTES.SITE_BASE_PATH(currentSiteId) : '';

  return (
    <div className="p-3 space-y-4">
      {siteName && (
        <div className="px-2 mb-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white truncate" title={siteName}>
            {siteName}
          </h2>
        </div>
      )}

      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
          <Search className="w-3.5 h-3.5 text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search in site..."
          className="w-full py-1.5 pl-7 pr-2 text-xs rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-gray-300 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <nav className="space-y-1">
        {filteredNavItems.length > 0 ? (
          filteredNavItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <a className={`flex items-center py-2 px-2.5 rounded-md text-sm font-medium transition-colors 
                            ${location === item.href 
                              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                          `}>
                {item.icon && <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />}
                <span className="truncate">{item.name}</span>
              </a>
            </Link>
          ))
        ) : (
          searchTerm && <p className="px-2.5 text-xs text-gray-500">No items match "{searchTerm}".</p>
        )}
      </nav>

      <Accordion
        type="single"
        collapsible
        defaultValue="spaces"
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
                path={currentSiteId ? getSiteRoute(currentSiteId, 'spaces/feed') : '#'} 
                icon={<AppWindowMac className="h-3.5 w-3.5" />}
                iconColor="text-gray-500"
                inSpaces={true}
                showToggle={true}
                toggleOn={true}
                isPrimary={true}
                isHomepage={true}
              />
              <TreeFolder
                name="Spaces"
                path={currentSiteId ? getSiteRoute(currentSiteId, 'spaces/connect') : '#'} 
                isExpanded={currentSiteId ? currentPathname.startsWith(getSiteRoute(currentSiteId, 'spaces/connect')) : false}
              >
                <MinimalItem
                  name="Discussions"
                  path={currentSiteId ? getSiteRoute(currentSiteId, 'spaces/connect/discussions') : '#'} 
                  icon={<AppWindowMac className="h-3.5 w-3.5" />}
                  iconColor="text-gray-500"
                  inSpaces={true}
                  level={1}
                  showToggle={false}
                  isPrimary={false}
                />
              </TreeFolder>
            </div>
          </AccordionContent>
        </AccordionItem>

        <div className="h-px bg-gray-100 dark:bg-gray-700 mx-1"></div>

        <div className="border-0">
          <div
            className="flex items-center py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline cursor-pointer"
            onClick={() => {
              const content = document.getElementById("navigation-content-site");
              const chevron = document.getElementById("navigation-chevron-site");
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
                id="navigation-chevron-site"
                className="h-3.5 w-3.5 text-gray-400 transition-transform duration-200"
              />
            </div>
          </div>
          <div id="navigation-content-site" className="pb-1 hidden">
            <div className="px-2 mb-2">
              <p className="text-[11px] text-gray-500 dark:text-gray-500">
                These settings apply globally. Customize it for an individual
                spaces if required.
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

        <div className="h-px bg-gray-100 dark:bg-gray-700 mx-1"></div>
      </Accordion>
    </div>
  );
}; 