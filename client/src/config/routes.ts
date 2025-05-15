export const APP_ROUTES = {
  // Main Navigation Routes
  HOME: '/',
  DASHBOARD: '/dashboard',
  INBOX: '/inbox',
  CONTENT: '/content',
  SITE: '/site',
  PEOPLE: '/people',
  APPEARANCE: '/appearance',
  SETTINGS: '/settings',
  BILLING: '/billing',
  REPORTS: '/reports',
  APP_STORE: '/app-store',
  DESIGN_STUDIO: '/design-studio',

  // Site-specific routes
  SITES_LIST: '/sites',
  SITE_BASE_PATH: (siteId: string) => `/site/${siteId}`,
  SITE_DETAIL: (siteId: string) => `/site/${siteId}`,
  
  // Site-specific sections
  SITE_CONTENT: (siteId: string) => `/site/${siteId}/content`,
  SITE_PEOPLE: (siteId: string) => `/site/${siteId}/people`,
  SITE_APPEARANCE: (siteId: string) => `/site/${siteId}/appearance`,
  SITE_SETTINGS: (siteId: string) => `/site/${siteId}/settings`,
  SITE_BILLING: (siteId: string) => `/site/${siteId}/billing`,
  SITE_REPORTS: (siteId: string) => `/site/${siteId}/reports`,
  SITE_DESIGN_STUDIO: (siteId: string) => `/site/${siteId}/design-studio`,
  SITE_APP_STORE: (siteId: string) => `/site/${siteId}/app-store`,
  SITE_ANALYTICS: (siteId: string) => `/site/${siteId}/analytics`,
  SITE_OVERVIEW: (siteId: string) => `/site/${siteId}/overview`,

  // Content Sidebar Specific Routes
  CONTENT_ALL: '/content/all',
  CONTENT_EVENTS: '/content/events',
  CONTENT_DISCUSSIONS: '/content/discussions',
  CONTENT_ARTICLES: '/content/articles',
  CONTENT_QUESTIONS: '/content/questions',
  CONTENT_WISHLIST: '/content/wishlist',
  CONTENT_NEW_CMS: '/content/new-cms',
  CONTENT_CUSTOM_VIEW: '/content/custom-view',

  // Inbox Specific Routes
  INBOX_ALL_ACTIVITY: '/inbox/all-activity',
  INBOX_UNREAD: '/inbox/unread',
  INBOX_COMMENTS: '/inbox/comments',
  INBOX_REACTIONS: '/inbox/reactions',
  INBOX_MENTIONS: '/inbox/mentions',
  INBOX_REPORTS: '/inbox/reports',
  INBOX_RSVPS: '/inbox/rsvps',
  INBOX_FORMS: '/inbox/forms',
  INBOX_CMS_ARTICLES: '/inbox/cms/articles',
  INBOX_CMS_EVENTS: '/inbox/cms/events',
  INBOX_CMS_QUESTIONS: '/inbox/cms/questions',
  INBOX_CMS_WISHLIST: '/inbox/cms/wishlist',
  
  // Content Inbox specific
  CONTENT_INBOX_ROOT: '/content/inbox',
  CONTENT_INBOX_UNREAD_SUB: '/content/inbox/unread',
  CONTENT_INBOX_IMPORTANT: '/content/inbox/important',
  CONTENT_INBOX_ARCHIVED: '/content/inbox/archived',

  // Design Studio Specific
  DESIGN_STUDIO_SPACES_FEED: '/design-studio/spaces/feed',

  // People Sidebar Specific Routes
  PEOPLE_MEMBERS: '/people/members',
  PEOPLE_STAFF: '/people/staff',
  PEOPLE_INVITATIONS: '/people/invitations',
  PEOPLE_PROFILE_FIELDS: '/people/profile-fields',
  PEOPLE_BADGES: '/people/badges',

  // Settings Sidebar Specific Routes
  SETTINGS_SITE: '/settings/site-settings',
  SETTINGS_AUTHENTICATION: '/settings/authentication',
  SETTINGS_DOMAIN: '/settings/domain',
  SETTINGS_SEARCH: '/settings/search',
  SETTINGS_MESSAGING: '/settings/messaging',
  SETTINGS_MODERATION: '/settings/moderation',
  SETTINGS_LOCALIZATION: '/settings/localization',
  SETTINGS_NOTIFICATIONS: '/settings/notifications',
  SETTINGS_SEO: '/settings/seo-settings',
  SETTINGS_SECURITY_PRIVACY: '/settings/security-privacy',
};

// Helper function for constructing site-specific URLs
export const getSiteRoute = (siteId: string, subPath: string): string => {
  const cleanSubPath = subPath.startsWith('/') ? subPath.substring(1) : subPath;
  return `/site/${siteId}/${cleanSubPath}`;
};

// Helper function for checking if a route is site-specific
export const isSiteSpecificRoute = (pathname: string): boolean => {
  return pathname.match(/^\/site\/[^\/]+/) !== null;
};

// Helper function to extract siteId from a site-specific route
export const getSiteIdFromRoute = (pathname: string): string | null => {
  const match = pathname.match(/^\/site\/([^\/]+)/);
  return match ? match[1] : null;
};

// Helper function for constructing content-specific URLs under /content/:collectionSlug
export const getContentCollectionRoute = (collectionSlug: string, subPath?: string): string => {
  let path = `/content/${collectionSlug}`;
  if (subPath) {
    const cleanSubPath = subPath.startsWith('/') ? subPath.substring(1) : subPath;
    path += `/${cleanSubPath}`;
  }
  return path;
};

// Helper function for constructing site-specific content URLs
export const getSiteContentRoute = (siteId: string, collectionSlug: string, subPath?: string): string => {
  let path = `/site/${siteId}/content/${collectionSlug}`;
  if (subPath) {
    const cleanSubPath = subPath.startsWith('/') ? subPath.substring(1) : subPath;
    path += `/${cleanSubPath}`;
  }
  return path;
};

export type AppRouteKey = keyof typeof APP_ROUTES; 