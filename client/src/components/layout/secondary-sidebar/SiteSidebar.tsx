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
  Paintbrush,
  MoreHorizontal,
  Eye,
  EyeOff,
  Pencil,
  Settings2,
  Trash2,
} from "lucide-react";
import { MinimalItem, TreeFolder } from "./SidebarTreeComponents";
import { NavigationItem as NavItemUI } from "@/components/ui/navigation-item";
import { NavigationSection as NavSectionUI } from "@/components/ui/navigation-section";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SiteSidebarProps {
  currentPathname: string;
}

// Local NavigationSection and NavigationItem components (can be shared if identical to DesignStudioSidebar)
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

export const SiteSidebar: React.FC<SiteSidebarProps> = ({ currentPathname }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const defaultExpanded = currentPathname.includes("/site/spaces")
    ? "spaces"
    : currentPathname.includes("/site/collections")
      ? "collections"
      : currentPathname.includes("/site/templates")
        ? "templates"
        : currentPathname.includes("/site/utility")
          ? "utility"
          : "";

  return (
    <div className="p-3">
      <div className="mb-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
              Site
            </h2>
            <button className="p-0.5 px-1 rounded-md bg-blue-500 hover:bg-blue-600 flex items-center justify-center cursor-pointer">
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
                path="/site/spaces/feed"
                icon={<AppWindowMac className="h-3.5 w-3.5" />}
                iconColor="text-gray-500"
                inSpaces={true}
                showToggle={true}
                toggleOn={true}
                isPrimary={true}
                isHomepage={true}
              />

              {/* Connect folder */}
              <TreeFolder
                name="Spaces"
                path="/site/spaces/connect"
                isExpanded={currentPathname.startsWith("/site/spaces/connect")}
              >
                <MinimalItem
                  name="Discussions"
                  path="/site/spaces/connect/discussions"
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

        {/* Navigation Sections */}
        <div className="border-0">
          <div
            className="flex items-center py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline cursor-pointer"
            onClick={() => {
              const content = document.getElementById("navigation-content-site"); // Unique ID
              const chevron = document.getElementById("navigation-chevron-site"); // Unique ID
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
                id="navigation-chevron-site" // Unique ID
                className="h-3.5 w-3.5 text-gray-400 transition-transform duration-200"
              />
            </div>
          </div>
          <div id="navigation-content-site" className="pb-1 hidden"> {/* Unique ID, hidden by default */}
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

        {/* <AccordionItem value="utility" className="border-0">
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
                path="/site/utility/404"
                icon={<File className="h-3.5 w-3.5" />}
                iconColor="text-gray-500"
                showToggle={true}
              />
              <MinimalItem
                name="Search result"
                path="/site/utility/search"
                icon={<File className="h-3.5 w-3.5" />}
                iconColor="text-gray-500"
                showToggle={true}
              />
              <MinimalItem
                name="Member profile"
                path="/site/utility/member-profile"
                icon={<File className="h-3.5 w-3.5" />}
                iconColor="text-gray-500"
                showToggle={true}
              />
            </div>
          </AccordionContent>
        </AccordionItem> */}
      </Accordion>
    </div>
  );
}; 