import React from "react";
import {
  ArrowLeft,
  MessageSquare,
  Settings,
  Dock,
  ChevronDown,
  Plus,
  File,
  Eye,
  Pencil,
  FileBox,
  FileCog,
} from "lucide-react";
import { NavigationItem as NavItemUI } from "@/components/ui/navigation-item"; // Renaming to avoid conflict
import { NavigationSection as NavSectionUI } from "@/components/ui/navigation-section"; // Renaming to avoid conflict
import {
  AppWindow,
  Logs,
  SquareMousePointer,
  SquareDashedBottomCode,
  PanelTop,
  PanelLeft,
  PanelRight,
  PanelBottom,
} from "lucide-react"; // Icons for NavigationSection
import { DesignStudioSpacesFeedSidebarProps } from "./types";

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


export const DesignStudioSpacesFeedSidebar: React.FC<DesignStudioSpacesFeedSidebarProps> = ({ 
  siteId 
  // siteName, navItems, currentSiteId are also available but not currently used
}) => {
  return (
    <div className="p-2">
      {/* Two line header layout - ultra minimalist */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 pb-1">
        {/* First line - only back button */}
        <div className="flex items-center py-1">
          <button
            onClick={() => window.history.back()}
            className="p-0.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-3 w-3" />
          </button>
        </div>

        {/* Second line - icon/title on left, settings on right */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-1">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-1.5 rounded">
              <MessageSquare className="h-5 w-5 text-purple-500" />
            </div>
            <span className="text-lg font-bold text-gray-700 dark:text-gray-300 tracking-wide">
              Feed
            </span>
          </div>

          <button
            className="p-0.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Sections and Blocks - ultra minimal design */}
      <div>
        <div className="mt-2">
          {/* Navigation & Frames section */}
          <div className="border-0">
            <div
              className="flex items-center py-1.5 px-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline cursor-pointer"
              onClick={() => {
                const content = document.getElementById("navigation-content-feed"); // Unique ID for this instance
                const chevron = document.getElementById("navigation-chevron-feed"); // Unique ID for this instance
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
                  id="navigation-chevron-feed" // Unique ID
                  className="h-3.5 w-3.5 text-gray-400 transition-transform duration-200"
                />
              </div>
            </div>
            {/* Content for Navigation & Frames - needs to be structured like in DesignStudioSidebar */}
            <div id="navigation-content-feed" className="pb-1 hidden"> {/* Initially hidden */}
                <div className="px-2 mb-2">
                    <p className="text-[11px] text-gray-500 dark:text-gray-500">
                        These settings apply globally. Customize it for an individual spaces if required.
                    </p>
                </div>
                <div className="space-y-1">
                    <NavigationSection title="Header" icon={<PanelTop />} defaultActive={true}>
                        <NavigationItem icon={<AppWindow className="h-3.5 w-3.5 dark:text-amber-200 text-amber-600/80" />} title="Top Navigation" />
                    </NavigationSection>
                    <NavigationSection title="LeftSidebar" icon={<PanelLeft />} defaultActive={true}>
                        <NavigationItem icon={<Logs className="h-3.5 w-3.5 dark:text-amber-200 text-amber-600/80" />} title="Menu" />
                    </NavigationSection>
                    <NavigationSection title="RightSidebar" icon={<PanelRight />} defaultActive={false}>
                        <NavigationItem icon={<SquareMousePointer className="h-3.5 w-3.5 dark:text-amber-200 text-amber-600/80" />} title="Banner" />
                        <NavigationItem icon={<Logs className="h-3.5 w-3.5 dark:text-amber-200 text-amber-600/80" />} title="Menu" />
                    </NavigationSection>
                    <NavigationSection title="Footer" icon={<PanelBottom />} defaultActive={false}>
                        <NavigationItem icon={<SquareDashedBottomCode className="h-3.5 w-3.5 dark:text-amber-200 text-amber-600/80" />} title="FooterBlock" />
                    </NavigationSection>
                </div>
            </div>
          </div>
        </div>

        {/* Content Blocks section */}
        <div className="mt-3">
          <div className="pb-1 pt-1 px-2">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
              Sections and Blocks
            </h4>
          </div>
          <div className="pt-1 pb-0 px-1">
            <div className="relative">
              <button
                className="flex items-center justify-between w-full py-1.5 px-2 text-xs border border-gray-200 dark:border-gray-700 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-100"
                onClick={() => {
                  const dropdown = document.getElementById("blocks-dropdown-feed"); // Unique ID
                  if (dropdown) {
                    dropdown.classList.toggle("hidden");
                  }
                }}
              >
                <div className="flex items-center">
                  <Plus className="h-4 w-4 mr-1.5 text-gray-500" />
                  <span>Add Block</span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
              </button>

              {/* Dropdown for block options - Minimalist version */}
              <div
                id="blocks-dropdown-feed" // Unique ID
                className="absolute left-0 right-0 z-10 mt-1 hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
              >
                <div className="py-1">
                  <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-800/70 cursor-pointer text-gray-600 dark:text-gray-300">
                    <File className="h-3.5 w-3.5 text-gray-500" />
                    <span>Text</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-800/70 cursor-pointer text-gray-600 dark:text-gray-300">
                    <Eye className="h-3.5 w-3.5 text-gray-500" />
                    <span>Image</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-800/70 cursor-pointer text-gray-600 dark:text-gray-300">
                    <Pencil className="h-3.5 w-3.5 text-gray-500" />
                    <span>Video</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-800/70 cursor-pointer text-gray-600 dark:text-gray-300">
                    <FileBox className="h-3.5 w-3.5 text-gray-500" />
                    <span>Button</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-800/70 cursor-pointer text-gray-600 dark:text-gray-300">
                    <FileCog className="h-3.5 w-3.5 text-gray-500" />
                    <span>Form</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 