import React from "react";
import { ChevronLeft } from "lucide-react";
import { APP_ROUTES } from "@/config/routes";
import { SideNavItem } from "./SidebarNavigationItems";

interface SpaceSettingsSidebarProps {
  siteSD: string;
  spaceName: string;
  spaceSlug: string;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const SpaceSettingsSidebar: React.FC<SpaceSettingsSidebarProps> = ({
  siteSD,
  spaceName,
  spaceSlug,
  activeTab,
  onTabChange,
}) => {
  const basePath = APP_ROUTES.DASHBOARD_SITE.SITE_CONFIG(siteSD);
  const spacesPath = basePath + "/spaces";

  const menuItems = [
    { id: "general", label: "General" },
    { id: "permissions", label: "Permissions" },
    { id: "seo", label: "SEO" },
    { id: "display", label: "Display" },
    { id: "customize", label: "Customize" },
    { id: "danger", label: "Danger Zone" },
  ];

  // Custom SideNavItem that works with tabs instead of navigation
  const TabNavItem: React.FC<{
    id: string;
    isActive: boolean;
    children: React.ReactNode;
  }> = ({ id, isActive, children }) => {
    return (
      <div
        onClick={() => onTabChange(id)}
        className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
          isActive
            ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        } cursor-pointer`}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="p-3">
      <div className="flex items-center mb-4">
        <a 
          href={spacesPath}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Spaces
        </a>
      </div>

      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          {spaceName} Settings
        </h2>
      </div>

      <div className="space-y-1">
        {menuItems.map((item) => (
          <TabNavItem 
            key={item.id}
            id={item.id}
            isActive={activeTab === item.id}
          >
            {item.label}
          </TabNavItem>
        ))}
      </div>
    </div>
  );
}; 