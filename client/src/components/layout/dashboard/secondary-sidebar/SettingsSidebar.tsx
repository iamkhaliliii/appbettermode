import React, { useMemo, memo } from "react";
import { SideNavItem } from "./SidebarNavigationItems";
import { APP_ROUTES, getSiteAdminRoute } from "@/config/routes";
import { BaseSidebarProps } from "./types";
import { motion } from "framer-motion";

export const SettingsSidebar: React.FC<BaseSidebarProps> = memo(({ 
  currentPathname, 
  isActiveUrl,
  currentSiteIdentifier
}) => {
  // Determine if we're in site-specific context
  const inSiteContext = !!currentSiteIdentifier;
  
  // Helper function to get the appropriate route based on context - memoized
  const getContextualRoute = useMemo(() => {
    return (generalRoute: string, siteSpecificPath: string) => {
      return inSiteContext 
        ? getSiteAdminRoute(currentSiteIdentifier, siteSpecificPath) 
        : generalRoute;
    };
  }, [inSiteContext, currentSiteIdentifier]);

  // Helper function to safely check if a route is active - memoized
  const checkIsActive = useMemo(() => {
    return (route: string) => {
      return isActiveUrl && isActiveUrl(route, currentPathname);
    };
  }, [isActiveUrl, currentPathname]);

  // Precompute all routes for better performance
  const routes = useMemo(() => ({
    siteSettings: getContextualRoute(APP_ROUTES.SETTINGS_SITE, 'settings/site'),
    authentication: getContextualRoute(APP_ROUTES.SETTINGS_AUTHENTICATION, 'settings/authentication'),
    domain: getContextualRoute(APP_ROUTES.SETTINGS_DOMAIN, 'settings/domain'),
    search: getContextualRoute(APP_ROUTES.SETTINGS_SEARCH, 'settings/search'),
    messaging: getContextualRoute(APP_ROUTES.SETTINGS_MESSAGING, 'settings/messaging'),
    moderation: getContextualRoute(APP_ROUTES.SETTINGS_MODERATION, 'settings/moderation'),
    localization: getContextualRoute(APP_ROUTES.SETTINGS_LOCALIZATION, 'settings/localization'),
    notifications: getContextualRoute(APP_ROUTES.SETTINGS_NOTIFICATIONS, 'settings/notifications'),
    seo: getContextualRoute(APP_ROUTES.SETTINGS_SEO, 'settings/seo'),
    securityPrivacy: getContextualRoute(APP_ROUTES.SETTINGS_SECURITY_PRIVACY, 'settings/security-privacy'),
    settingsRoot: inSiteContext 
      ? getContextualRoute(APP_ROUTES.SETTINGS, 'settings')
      : APP_ROUTES.SETTINGS
  }), [getContextualRoute, inSiteContext]);

  // Precompute active states for all menu items
  const activeStates = useMemo(() => ({
    siteSettings: checkIsActive(routes.siteSettings) || 
      (inSiteContext ? currentPathname === routes.settingsRoot : currentPathname === APP_ROUTES.SETTINGS),
    authentication: checkIsActive(routes.authentication),
    domain: checkIsActive(routes.domain),
    search: checkIsActive(routes.search),
    messaging: checkIsActive(routes.messaging),
    moderation: checkIsActive(routes.moderation),
    localization: checkIsActive(routes.localization),
    notifications: checkIsActive(routes.notifications),
    seo: checkIsActive(routes.seo),
    securityPrivacy: checkIsActive(routes.securityPrivacy)
  }), [checkIsActive, routes, inSiteContext, currentPathname]);

  // Variant for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.03,
        duration: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.15 } }
  };

  return (
    <div className="p-3">
      <div className="mb-2">
        <h2 className="text-xs font-normal text-gray-400 dark:text-gray-500 capitalize">
          Settings
        </h2>
      </div>

      <motion.div 
        className="space-y-1"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <SideNavItem
            href={routes.siteSettings}
            isActive={activeStates.siteSettings}
          >
            Site settings
          </SideNavItem>
        </motion.div>

        <motion.div variants={itemVariants}>
          <SideNavItem
            href={routes.authentication}
            isActive={activeStates.authentication}
          >
            Authentication
          </SideNavItem>
        </motion.div>

        <motion.div variants={itemVariants}>
          <SideNavItem
            href={routes.domain}
            isActive={activeStates.domain}
          >
            Domain
          </SideNavItem>
        </motion.div>

        <motion.div variants={itemVariants}>
          <SideNavItem
            href={routes.search}
            isActive={activeStates.search}
          >
            Search
          </SideNavItem>
        </motion.div>

        <motion.div variants={itemVariants}>
          <SideNavItem
            href={routes.messaging}
            isActive={activeStates.messaging}
          >
            Messaging
          </SideNavItem>
        </motion.div>

        <motion.div variants={itemVariants}>
          <SideNavItem
            href={routes.moderation}
            isActive={activeStates.moderation}
          >
            Moderation
          </SideNavItem>
        </motion.div>

        <motion.div variants={itemVariants}>
          <SideNavItem
            href={routes.localization}
            isActive={activeStates.localization}
          >
            Localization
          </SideNavItem>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <SideNavItem
            href={routes.notifications}
            isActive={activeStates.notifications}
          >
            Notifications
          </SideNavItem>
        </motion.div>

        <motion.div variants={itemVariants}>
          <SideNavItem
            href={routes.seo}
            isActive={activeStates.seo}
          >
            SEO settings
          </SideNavItem>
        </motion.div>

        <motion.div variants={itemVariants}>
          <SideNavItem
            href={routes.securityPrivacy}
            isActive={activeStates.securityPrivacy}
          >
            Security & Privacy
          </SideNavItem>
        </motion.div>
      </motion.div>
    </div>
  );
});

SettingsSidebar.displayName = 'SettingsSidebar'; 