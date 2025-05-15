export const APP_ROUTES = {
  // Root and Sites List
  HOME: '/',
  SITES_LIST: '/sites',
  
  // Site Frontend Routes (public facing)
  SITE_HOME: (siteId: string) => `/site/${siteId}`,
  SITE_SEARCH: (siteId: string) => `/site/${siteId}/search`,
  SITE_PROFILE: (siteId: string, username: string) => `/site/${siteId}/profile/${username}`,
  
  // Dashboard Site Routes
  DASHBOARD_SITE: {
    INDEX: (siteId: string) => `/dashboard/site/${siteId}`,
    CONTENT: (siteId: string) => `/dashboard/site/${siteId}/content`,
    CONTENT_SECTION: (siteId: string, section: string) => `/dashboard/site/${siteId}/content/${section}`,
    PEOPLE: (siteId: string) => `/dashboard/site/${siteId}/people`,
    PEOPLE_MEMBERS: (siteId: string) => `/dashboard/site/${siteId}/people/members`,
    PEOPLE_STAFF: (siteId: string) => `/dashboard/site/${siteId}/people/staff`,
    APPEARANCE: (siteId: string) => `/dashboard/site/${siteId}/appearance`,
    APPEARANCE_SECTION: (siteId: string, section: string) => `/dashboard/site/${siteId}/appearance/${section}`,
    SETTINGS: (siteId: string) => `/dashboard/site/${siteId}/settings`,
    SETTINGS_SEARCH: (siteId: string) => `/dashboard/site/${siteId}/settings/search`,
    BILLING: (siteId: string) => `/dashboard/site/${siteId}/billing`,
    BILLING_SECTION: (siteId: string, section: string) => `/dashboard/site/${siteId}/billing/${section}`,
    REPORTS: (siteId: string) => `/dashboard/site/${siteId}/reports`,
    REPORTS_SECTION: (siteId: string, section: string) => `/dashboard/site/${siteId}/reports/${section}`,
    APP_STORE: (siteId: string) => `/dashboard/site/${siteId}/app-store`,
    APP_STORE_SECTION: (siteId: string, section: string) => `/dashboard/site/${siteId}/app-store/${section}`,
    DESIGN_STUDIO: (siteId: string) => `/dashboard/site/${siteId}/design-studio`,
    DESIGN_STUDIO_SECTION: (siteId: string, section: string) => `/dashboard/site/${siteId}/design-studio/${section}`,
    SITE_CONFIG: (siteId: string) => `/dashboard/site/${siteId}/site-config`,
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

// Helper function to extract siteId from any site-related route
export const getSiteIdFromRoute = (pathname: string): string | null => {
  // Match site ID from either public site routes or dashboard site routes
  const publicMatch = pathname.match(/^\/site\/([^\/]+)/);
  if (publicMatch) return publicMatch[1];
  
  const adminMatch = pathname.match(/^\/dashboard\/site\/([^\/]+)/);
  return adminMatch ? adminMatch[1] : null;
};

// Helper function for constructing site-specific URLs
export const getSiteRoute = (siteId: string, subPath: string): string => {
  const cleanSubPath = subPath.startsWith('/') ? subPath.substring(1) : subPath;
  return `/site/${siteId}/${cleanSubPath}`;
};

// Helper function for constructing site admin dashboard URLs
export const getSiteAdminRoute = (siteId: string, subPath?: string): string => {
  if (!subPath) return `/dashboard/site/${siteId}`;
  const cleanSubPath = subPath.startsWith('/') ? subPath.substring(1) : subPath;
  return `/dashboard/site/${siteId}/${cleanSubPath}`;
};

// Helper function for constructing site-specific content URLs
export const getSiteContentRoute = (siteId: string, collectionSlug: string, subPath?: string): string => {
  let path = `/dashboard/site/${siteId}/content/${collectionSlug}`;
  if (subPath) {
    const cleanSubPath = subPath.startsWith('/') ? subPath.substring(1) : subPath;
    path += `/${cleanSubPath}`;
  }
  return path;
};

export type AppRouteKey = keyof typeof APP_ROUTES; 