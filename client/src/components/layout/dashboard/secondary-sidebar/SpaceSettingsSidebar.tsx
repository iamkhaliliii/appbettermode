import React, { useMemo, memo } from "react";
import { ChevronLeft, Users, Settings, Palette, Layout, Search, AlertTriangle } from "lucide-react";
import { APP_ROUTES } from "@/config/routes";
import { SideNavItem } from "./SidebarNavigationItems";
import { motion } from "framer-motion";

interface SpaceSettingsSidebarProps {
  siteSD: string;
  spaceName: string;
  spaceSlug: string;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

// Custom TabNavItem component memoized for better performance
const TabNavItem = memo(({ 
  id, 
  isActive, 
  children, 
  onClick
}: { 
  id: string;
  isActive: boolean;
  children: React.ReactNode;
  onClick: (id: string) => void;
}) => {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(id)}
      className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
        isActive
          ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
      } cursor-pointer`}
    >
      {children}
    </motion.div>
  );
});

TabNavItem.displayName = 'TabNavItem';

export const SpaceSettingsSidebar: React.FC<SpaceSettingsSidebarProps> = memo(({
  siteSD,
  spaceName,
  spaceSlug,
  activeTab,
  onTabChange,
}) => {
  // Memoize paths to prevent recalculation on rerenders
  const paths = useMemo(() => {
    const basePath = APP_ROUTES.DASHBOARD_SITE.SITE_CONFIG(siteSD);
    return {
      siteConfigPath: basePath
    };
  }, [siteSD]);

  // Memoize menu items to prevent recreation on each render
  const menuItems = useMemo(() => [
    { id: "general", label: "General" },
    { id: "widget", label: "Customize Widgets" },
    { id: "display", label: "Content Layout" },
    { id: "member-management", label: "Member Management" },
    { id: "seo", label: "SEO" },
    { id: "danger", label: "Danger Zone" },
  ], []);

  return (
    <div className="p-3 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="flex items-center mb-4">
        <a 
          href={paths.siteConfigPath}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </a>
      </div>

      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          {spaceName} Settings
        </h2>
      </div>

      <motion.div 
        className="space-y-1"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.05, duration: 0.2 }}
      >
        {menuItems.map((item) => (
          <TabNavItem 
            key={item.id}
            id={item.id}
            isActive={activeTab === item.id}
            onClick={onTabChange}
          >
            {item.id === "general" && <Settings className="w-4 h-4 mr-2" />}
            {item.id === "widget" && <Palette className="w-4 h-4 mr-2" />}
            {item.id === "display" && <Layout className="w-4 h-4 mr-2" />}
            {item.id === "member-management" && <Users className="w-4 h-4 mr-2" />}
            {item.id === "seo" && <Search className="w-4 h-4 mr-2" />}
            {item.id === "danger" && <AlertTriangle className="w-4 h-4 mr-2" />}
            {item.label}
          </TabNavItem>
        ))}
      </motion.div>
    </div>
  );
});

SpaceSettingsSidebar.displayName = 'SpaceSettingsSidebar'; 