export const APP_ROUTES = {
  // Root and Sites List
  HOME: '/',
  SITES_LIST: '/sites',
  
  // Site Frontend Routes (public facing)
  SITE_HOME: (siteSD: string) => `/site/${siteSD}`,
  SITE_SEARCH: (siteSD: string) => `/site/${siteSD}/search`,
  SITE_PROFILE: (siteSD: string, username: string) => `/site/${siteSD}/profile/${username}`,
  
  // Dashboard Site Routes
  DASHBOARD_SITE: {
    INDEX: (siteSD: string) => `/dashboard/site/${siteSD}`,
    CONTENT: (siteSD: string) => `/dashboard/site/${siteSD}/content`,
    CONTENT_SECTION: (siteSD: string, section: string) => `/dashboard/site/${siteSD}/content/${section}`,
    PEOPLE: (siteSD: string) => `/dashboard/site/${siteSD}/people`,
    PEOPLE_MEMBERS: (siteSD: string) => `/dashboard/site/${siteSD}/people/members`,
    PEOPLE_STAFF: (siteSD: string) => `/dashboard/site/${siteSD}/people/staff`,
    APPEARANCE: (siteSD: string) => `/dashboard/site/${siteSD}/appearance`,
    APPEARANCE_SECTION: (siteSD: string, section: string) => `/dashboard/site/${siteSD}/appearance/${section}`,
    SETTINGS: (siteSD: string) => `/dashboard/site/${siteSD}/settings`,
    SETTINGS_SEARCH: (siteSD: string) => `/dashboard/site/${siteSD}/settings/search`,
    BILLING: (siteSD: string) => `/dashboard/site/${siteSD}/billing`,
    BILLING_SECTION: (siteSD: string, section: string) => `/dashboard/site/${siteSD}/billing/${section}`,
    REPORTS: (siteSD: string) => `/dashboard/site/${siteSD}/reports`,
    REPORTS_SECTION: (siteSD: string, section: string) => `/dashboard/site/${siteSD}/reports/${section}`,
    APP_STORE: (siteSD: string) => `/dashboard/site/${siteSD}/app-store`,
    APP_STORE_SECTION: (siteSD: string, section: string) => `/dashboard/site/${siteSD}/app-store/${section}`,
    DESIGN_STUDIO: (siteSD: string) => `/dashboard/site/${siteSD}/design-studio`,
    DESIGN_STUDIO_SECTION: (siteSD: string, section: string) => `/dashboard/site/${siteSD}/design-studio/${section}`,
    SITE_CONFIG: (siteSD: string) => `/dashboard/site/${siteSD}/site-config`,
  },
  
  // Content Types (for use in content sections)
  CONTENT_TYPES: {
    ALL: 'all',
    EVENTS: 'events',
    DISCUSSIONS: 'discussions',
    ARTICLES: 'articles',
    QUESTIONS: 'questions',
    WISHLIST: 'wishlist',
    NEW_CMS: 'new-cms',
    CUSTOM_VIEW: 'custom-view',
  },

  // Settings Routes
  SETTINGS: '/settings',
  SETTINGS_SITE: '/settings/site',
  SETTINGS_AUTHENTICATION: '/settings/authentication',
  SETTINGS_DOMAIN: '/settings/domain',
  SETTINGS_SEARCH: '/settings/search',
  SETTINGS_MESSAGING: '/settings/messaging',
  SETTINGS_MODERATION: '/settings/moderation',
  SETTINGS_LOCALIZATION: '/settings/localization',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_SEO: '/settings/seo',
  SETTINGS_SECURITY_PRIVACY: '/settings/security-privacy',
};

// Helper function for checking if a route is site-specific (public site frontend)
export const isSitePublicRoute = (pathname: string): boolean => {
  return pathname.match(/^\/site\/[^\/]+/) !== null && 
         !pathname.match(/^\/dashboard\/site\/[^\/]+/);
};

// Helper function for checking if a route is site admin-specific (dashboard for a site)
export const isSiteAdminRoute = (pathname: string): boolean => {
  return pathname.match(/^\/dashboard\/site\/[^\/]+/) !== null;
};

// Helper function to extract site identifier (e.g., siteSD) from any site-related route
export const getSiteIdentifierFromRoute = (pathname: string): string | null => {
  // Match site identifier from either public site routes or dashboard site routes
  const publicMatch = pathname.match(/^\/site\/([^\/]+)/);
  if (publicMatch) return publicMatch[1];
  
  const adminMatch = pathname.match(/^\/dashboard\/site\/([^\/]+)/);
  return adminMatch ? adminMatch[1] : null;
};

// Helper function for constructing site-specific URLs
export const getSiteRoute = (siteSD: string, subPath: string): string => {
  const cleanSubPath = subPath.startsWith('/') ? subPath.substring(1) : subPath;
  return `/site/${siteSD}/${cleanSubPath}`;
};

// Helper function for constructing site admin dashboard URLs
export const getSiteAdminRoute = (siteSD: string, subPath?: string): string => {
  if (!subPath) return `/dashboard/site/${siteSD}`;
  const cleanSubPath = subPath.startsWith('/') ? subPath.substring(1) : subPath;
  return `/dashboard/site/${siteSD}/${cleanSubPath}`;
};

// Helper function for constructing site-specific content URLs
export const getSiteContentRoute = (siteSD: string, collectionSlug: string, subPath?: string): string => {
  let path = `/dashboard/site/${siteSD}/content/${collectionSlug}`;
  if (subPath) {
    const cleanSubPath = subPath.startsWith('/') ? subPath.substring(1) : subPath;
    path += `/${cleanSubPath}`;
  }
  return path;
};

export type AppRouteKey = keyof typeof APP_ROUTES; 