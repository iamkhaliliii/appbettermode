import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/primitives";
import {
  Files,
  Search,
  Plus,
  Folder,
  Database,
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
  Layers2,
  FileBox,
  FileCog,
  File,
  Paintbrush
} from "lucide-react";
import { MinimalItem, TreeFolder } from "./SidebarTreeComponents";
import { NavigationItem as NavItemUI } from "@/components/features/navigation"; // Renaming to avoid conflict
import { NavigationSection as NavSectionUI } from "@/components/features/navigation"; // Renaming to avoid conflict
import { APP_ROUTES, getSiteAdminRoute } from "@/config/routes";
import { DesignStudioSidebarProps } from "./types";

// Define NavigationSection and NavigationItem locally if they are simple enough
// and not used extensively outside this sidebar. Otherwise, they should be proper components.

const NavigationSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  defaultActive?: boolean;
  children: React.ReactNode;
}> = ({ title, icon, defaultActive, children }) => {
  // Using NavSectionUI if its props match, or implement custom logic
  // For simplicity, assuming a simple collapsible structure here if NavSectionUI is complex
  const [isOpen, setIsOpen] = useState(defaultActive);
  return (
    <NavSectionUI title={title} icon={icon} defaultActive={defaultActive}>
      {children}
    </NavSectionUI>
  );
};

const NavigationItem: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => {
  // Using NavItemUI if its props match
  return <NavItemUI icon={icon} title={title} />;
};


export const DesignStudioSidebar: React.FC<DesignStudioSidebarProps> = ({ 
  currentPathname,
  currentSiteIdentifier
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Determine if we're in site-specific context
  const inSiteContext = !!currentSiteIdentifier;
  
  // Base path for Design Studio based on context
  const basePath = inSiteContext 
    ? APP_ROUTES.DASHBOARD_SITE.DESIGN_STUDIO(currentSiteIdentifier)
    : '/dashboard/design-studio';

  // Feed path
  const feedPath = inSiteContext
    ? `${APP_ROUTES.DASHBOARD_SITE.DESIGN_STUDIO(currentSiteIdentifier)}/spaces/feed`
    : '/dashboard/design-studio/spaces/feed';

  const defaultExpanded = currentPathname.includes(`${basePath}/spaces`)
    ? "spaces"
    : currentPathname.includes(`${basePath}/collections`)
      ? "collections"
      : currentPathname.includes(`${basePath}/templates`)
        ? "templates"
        : currentPathname.includes(`${basePath}/utility`)
          ? "utility"
          : "";

  return (
    <div className="p-3">
      <div className="mb-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-normal text-gray-400 dark:textgray-500 capitalize">
              Design studio
            </h2>
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
        defaultValue={defaultExpanded}
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
              {/* Root files first */}
              <MinimalItem
                name="Feed"
                path={feedPath}
                currentPathname={currentPathname}
                icon={<AppWindowMac className="h-3.5 w-3.5" />}
                iconColor="text-[#A694FF]"
                inSpaces={true}
                decorationIcon={<Database />}
              />
              <MinimalItem
                name="Explore"
                path={`${basePath}/spaces/explore`}
                currentPathname={currentPathname}
                icon={<AppWindowMac className="h-3.5 w-3.5" />}
                iconColor="text-gray-500"
                inSpaces={true}
              />

              {/* Connect folder */}
              <TreeFolder
                name="Connect"
                path={`${basePath}/spaces/connect`}
                currentPathname={currentPathname}
                isExpanded={currentPathname.startsWith(`${basePath}/spaces/connect`)}
              >
                <MinimalItem
                  name="Intros & Networking"
                  path={`${basePath}/spaces/connect/intros`}
                  currentPathname={currentPathname}
                  icon={<AppWindowMac className="h-3.5 w-3.5" />}
                  iconColor="text-[#A694FF]"
                  inSpaces={true}
                  decorationIcon={<Database />}
                  level={1}
                />
                <MinimalItem
                  name="Ask the Community"
                  path={`${basePath}/spaces/connect/ask`}
                  currentPathname={currentPathname}
                  icon={<AppWindowMac className="h-3.5 w-3.5" />}
                  iconColor="text-[#A694FF]"
                  inSpaces={true}
                  decorationIcon={<Database />}
                  level={1}
                />
                <MinimalItem
                  name="Hire Experts"
                  path={`${basePath}/spaces/connect/hire`}
                  currentPathname={currentPathname}
                  icon={<AppWindowMac className="h-3.5 w-3.5" />}
                  iconColor="text-[#A694FF]"
                  inSpaces={true}
                  decorationIcon={<Database />}
                  level={1}
                />
              </TreeFolder>

              {/* Help Center folder */}
              <TreeFolder
                name="Help Center"
                path={`${basePath}/spaces/help-center`}
                currentPathname={currentPathname}
                isExpanded={currentPathname.startsWith(`${basePath}/spaces/help-center`)}
              >
                <MinimalItem
                  name="Getting Started"
                  path={`${basePath}/spaces/help-center/getting-started`}
                  currentPathname={currentPathname}
                  icon={<AppWindowMac className="h-3.5 w-3.5" />}
                  iconColor="text-[#A694FF]"
                  inSpaces={true}
                  decorationIcon={<Database />}
                  level={1}
                />
                <MinimalItem
                  name="Account & Billing"
                  path={`${basePath}/spaces/help-center/account`}
                  currentPathname={currentPathname}
                  icon={<AppWindowMac className="h-3.5 w-3.5" />}
                  iconColor="text-[#A694FF]"
                  inSpaces={true}
                  decorationIcon={<Database />}
                  level={1}
                />
                <MinimalItem
                  name="Content Management"
                  path={`${basePath}/spaces/help-center/content`}
                  currentPathname={currentPathname}
                  icon={<AppWindowMac className="h-3.5 w-3.5" />}
                  iconColor="text-[#A694FF]"
                  inSpaces={true}
                  decorationIcon={<Database />}
                  level={1}
                />
                <MinimalItem
                  name="Member Management"
                  path={`${basePath}/spaces/help-center/members`}
                  currentPathname={currentPathname}
                  icon={<AppWindowMac className="h-3.5 w-3.5" />}
                  iconColor="text-[#A694FF]"
                  inSpaces={true}
                  decorationIcon={<Database />}
                  level={1}
                />
                <MinimalItem
                  name="Appearance & Design"
                  path={`${basePath}/spaces/help-center/appearance`}
                  currentPathname={currentPathname}
                  icon={<AppWindowMac className="h-3.5 w-3.5" />}
                  iconColor="text-[#A694FF]"
                  inSpaces={true}
                  decorationIcon={<Database />}
                  level={1}
                />
                <MinimalItem
                  name="Reports & Analytics"
                  path={`${basePath}/spaces/help-center/reports`}
                  currentPathname={currentPathname}
                  icon={<AppWindowMac className="h-3.5 w-3.5" />}
                  iconColor="text-[#A694FF]"
                  inSpaces={true}
                  decorationIcon={<Database />}
                  level={1}
                />
                <MinimalItem
                  name="Apps & Integrations"
                  path={`${basePath}/spaces/help-center/apps`}
                  currentPathname={currentPathname}
                  icon={<AppWindowMac className="h-3.5 w-3.5" />}
                  iconColor="text-[#A694FF]"
                  inSpaces={true}
                  decorationIcon={<Database />}
                  level={1}
                />
                <MinimalItem
                  name="API & Webhooks"
                  path={`${basePath}/spaces/help-center/api`}
                  currentPathname={currentPathname}
                  icon={<AppWindowMac className="h-3.5 w-3.5" />}
                  iconColor="text-[#A694FF]"
                  inSpaces={true}
                  decorationIcon={<Database />}
                  level={1}
                />
                <MinimalItem
                  name="Get Inspired"
                  path={`${basePath}/spaces/help-center/inspired`}
                  currentPathname={currentPathname}
                  icon={<AppWindowMac className="h-3.5 w-3.5" />}
                  iconColor="text-[#A694FF]"
                  inSpaces={true}
                  decorationIcon={<Database />}
                  level={1}
                />
              </TreeFolder>
            </div>
          </AccordionContent>
        </AccordionItem>

        <div className="h-px bg-gray-100 dark:bg-gray-700 mx-1"></div>

        <AccordionItem value="collections" className="border-0">
          <AccordionTrigger className="flex items-center py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Database className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium text-sm">CMS Pages</span>
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
                      <FileBox className="h-3 w-3 mr-2 text-[#A694FF]" />
                      <span>Create new CMS</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-1">
            <div className="space-y-1">
              <MinimalItem
                name="Event"
                path={`${basePath}/collections/event`}
                currentPathname={currentPathname}
                icon={<File className="h-3.5 w-3.5" />}
                iconColor="text-[#A694FF]"
                decorationIcon={<Database />}
              />
              <MinimalItem
                name="Discussion"
                path={`${basePath}/collections/discussion`}
                currentPathname={currentPathname}
                icon={<File className="h-3.5 w-3.5" />}
                iconColor="text-[#A694FF]"
                decorationIcon={<Database />}
              />
              <MinimalItem
                name="Blog"
                path={`${basePath}/collections/blog`}
                currentPathname={currentPathname}
                icon={<File className="h-3.5 w-3.5" />}
                iconColor="text-[#A694FF]"
                decorationIcon={<Database />}
              />
              <MinimalItem
                name="Job List"
                path={`${basePath}/collections/jobs`}
                currentPathname={currentPathname}
                icon={<File className="h-3.5 w-3.5" />}
                iconColor="text-[#A694FF]"
                decorationIcon={<Database />}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <div className="h-px bg-gray-100 dark:bg-gray-700 mx-1"></div>

        {/* Navigation Sections */}
        <div className="border-0">
          <div
            className="flex items-center py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline cursor-pointer"
            onClick={() => {
              const content = document.getElementById("navigation-content-ds"); // Unique ID
              const chevron = document.getElementById("navigation-chevron-ds"); // Unique ID
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
                  Navigation & Frames
                </span>
              </div>
              <ChevronDown
                id="navigation-chevron-ds" // Unique ID
                className="h-3.5 w-3.5 text-gray-400 transition-transform duration-200"
              />
            </div>
          </div>
          <div id="navigation-content-ds" className="pb-1 hidden"> {/* Unique ID, hidden by default */}
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

        <AccordionItem value="templates" className="border-0">
          <AccordionTrigger className="flex items-center py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <Layers2 className="h-4 w-4 mr-2 text-gray-500" />
                <span className="font-medium text-sm">Templates</span>
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
                      <FileCog className="h-3 w-3 mr-2 text-[#57ABFF]" />
                      <span>Create new Template</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-1">
            <div className="space-y-1">
              <MinimalItem
                name="General template"
                path={`${basePath}/templates/general`}
                currentPathname={currentPathname}
                icon={<File className="h-3.5 w-3.5" />}
                iconColor="text-[#57ABFF]"
                decorationIcon={<Paintbrush />}
              />
              <MinimalItem
                name="Product"
                path={`${basePath}/templates/product`}
                currentPathname={currentPathname}
                icon={<File className="h-3.5 w-3.5" />}
                iconColor="text-[#57ABFF]"
                decorationIcon={<Paintbrush />}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <div className="h-px bg-gray-100 dark:bg-gray-700 mx-1"></div>

        <AccordionItem value="utility" className="border-0">
          <AccordionTrigger className="flex items-center py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline">
            <div className="flex items-center">
              <PanelTop className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium text-sm">Utility Pages</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-1">
            <div className="space-y-1">
              <MinimalItem
                name="404 Page"
                path={`${basePath}/utility/404`}
                currentPathname={currentPathname}
                icon={<File className="h-3.5 w-3.5" />}
                iconColor="text-gray-500"
              />
              <MinimalItem
                name="Search result"
                path={`${basePath}/utility/search`}
                currentPathname={currentPathname}
                icon={<File className="h-3.5 w-3.5" />}
                iconColor="text-gray-500"
              />
              <MinimalItem
                name="Member profile"
                path={`${basePath}/utility/member-profile`}
                currentPathname={currentPathname}
                icon={<File className="h-3.5 w-3.5" />}
                iconColor="text-gray-500"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}; 