import { SiteDetails } from '@/types/site';
import { z } from 'zod';

const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i; // Define uuidRegex

/**
 * Get the base URL for API requests based on environment
 */
function getApiBaseUrl(): string {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // In production (Vercel), use relative URLs to avoid CORS issues
    // Check for Vercel-specific environment or production build
    if (window.location.hostname !== 'localhost' && 
        window.location.hostname !== '127.0.0.1') {
      console.log('[API] Using relative URLs for production');
      return '';
    }
  }
  
  // Check NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    console.log('[API] Production mode detected, using relative URLs');
    return '';
  }
  
  // In development, use the dev server
  console.log('[API] Development mode, using localhost:4000');
  return 'http://localhost:4000';
}

// API configuration
const API_BASE_URL = getApiBaseUrl();
const API_VERSION = 'v1';
const API_BASE = `${API_BASE_URL}/api/${API_VERSION}`;

// API endpoints with environment-aware URLs
const ENDPOINTS = {
  SITES: `${API_BASE}/sites`,
  SITE: (identifier: string) => `${API_BASE}/sites/${identifier}`,
  SITE_MEMBERS: (siteId: string) => `${API_BASE}/sites/${siteId}/members`,
  CMS_TYPES: `${API_BASE}/cms-types`,
};

// Legacy API endpoints - to be gradually deprecated
const LEGACY_ENDPOINTS = {
  MOCK_SITE: '/api/mock-site',
  SITE_BY_SUBDOMAIN: '/api/site-by-subdomain',
};

// Define a schema for the (populated) CMS Type object when it's part of a Site object
const PopulatedCmsTypeSchema = z.object({
  id: z.string().uuid("CMS Type ID must be a valid UUID"),
  name: z.string(),
  label: z.string(),
  icon_name: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  fields: z.array(z.any()).nullable().optional(),
});

// Schema for the raw site data (input to Zod, pre-transform)
const siteInputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, { message: 'Site name must be at least 2 characters.' }),
  subdomain: z.string().nullable().optional(),
  ownerId: z.string().uuid().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
  state: z.string().nullable().optional(), // Input can be string, null, or undefined
  status: z.string(), // Make status required on input
  role: z.string().optional(),
  logo_url: z.string().url().nullable().optional(),
  brand_color: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, { message: "Invalid hex color format" }).nullable().optional(),
  brand_colors: z.any().nullable().optional(),
  content_types: z.union([
    z.array(PopulatedCmsTypeSchema),
    z.array(z.string().uuid()), // Handle case where API returns array of IDs
    z.null(),
    z.undefined()
  ]).default([]),
  plan: z.string().nullable().optional(),
  space_ids: z.array(z.string().uuid()).default([]),
  owner: z.object({
    id: z.string().uuid(),
    username: z.string(),
    full_name: z.string().nullable().optional(),
    avatar_url: z.string().url().nullable().optional(),
  }).nullable().optional(),
});

// Define the output schema explicitly
const siteOutputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  subdomain: z.string().nullable().optional(),
  ownerId: z.string().uuid().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
  state: z.string(), // Always a string after transform
  status: z.string(),
  role: z.string().optional(),
  logo_url: z.string().url().nullable().optional(),
  brand_color: z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/).nullable().optional(),
  brand_colors: z.any().nullable().optional(),
  content_types: z.array(PopulatedCmsTypeSchema), // Always an array after transform
  plan: z.string().nullable().optional(),
  space_ids: z.array(z.string().uuid()), // Always an array after transform
  owner: z.object({
    id: z.string().uuid(),
    username: z.string(),
    full_name: z.string().nullable().optional(),
    avatar_url: z.string().url().nullable().optional(),
  }).nullable().optional(),
});

// Schema with transform for the final Site shape
const siteSchema = siteInputSchema.transform(data => {
  // Handle content_types - convert string arrays to empty array for now
  let contentTypes = data.content_types ?? [];
  if (Array.isArray(contentTypes) && contentTypes.length > 0 && typeof contentTypes[0] === 'string') {
    contentTypes = []; // Convert array of IDs to empty array for now
  }

  return siteOutputSchema.parse({
    ...data,
    state: data.state ?? data.status ?? 'unknown',
    content_types: contentTypes,
    space_ids: data.space_ids ?? [],
  });
});

const sitesResponseSchema = z.array(siteSchema);
export type Site = z.infer<typeof siteOutputSchema>;

// Schema for a member, likely a user associated with a site through a membership
export const memberSchema = z.object({
  userId: z.string().uuid(),
  siteId: z.string().uuid(),
  fullName: z.string().optional(),
  email: z.string().email(),
  avatarUrl: z.string().url().optional().nullable(),
  role: z.enum(['member', 'admin', 'editor']),
  joinedAt: z.string().datetime().optional(),
  status: z.string(),
});

export const membersResponseSchema = z.array(memberSchema);
export type Member = z.infer<typeof memberSchema>;

// API error response
interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * LEGACY FUNCTION: Fetches site data by subdomain using the old API
 * @deprecated Use sitesApi.getSite() instead
 * @param subdomain The site's subdomain
 * @returns Promise with site details or throws an error
 */
export async function fetchSiteBySubdomain(subdomain: string): Promise<SiteDetails> {
  if (!subdomain) {
    throw new Error('Subdomain is required');
  }

  console.log(`Fetching site with subdomain: ${subdomain}`);

  try {
    // Try the new API first, falling back to mock if needed
    const useNewApi = true; // Set to true to use the new API
    const apiUrl = useNewApi
      ? `${ENDPOINTS.SITE(subdomain)}`
      : `${LEGACY_ENDPOINTS.MOCK_SITE}?subdomain=${encodeURIComponent(subdomain)}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      // Safely try to get error message from response
      let errorMessage = `Error fetching site data: ${response.status} ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        // If response isn't valid JSON, use the default error message
        console.error('Could not parse error response as JSON', parseError);
      }
      
      if (response.status === 404) {
        errorMessage = `Site with subdomain "${subdomain}" not found.`;
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log('Successfully fetched site data:', data);
    return data;
  } catch (error: any) {
    console.error('Error in fetchSiteBySubdomain:', error);
    throw error;
  }
}

// Common fetch wrapper with error handling
async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    console.log(`[API] ${options.method || 'GET'} ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Try to parse the response, handling both JSON and non-JSON responses
    let data: any;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // For non-JSON responses, get the text and try to parse it
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { message: text };
      }
    }

    if (!response.ok) {
      const errorData = data as ApiErrorResponse;
      console.error(`[API] Error ${response.status}:`, errorData);
      
      // Create a more structured error
      const error = new Error(errorData.message || 'An error occurred with the API request');
      (error as any).status = response.status;
      (error as any).details = errorData.errors;
      throw error;
    }

    return data as T;
  } catch (error) {
    // If it's already an augmented error, just rethrow it
    if ((error as any).status) {
      throw error;
    }
    
    // Otherwise wrap it in a standard format
    console.error('[API] Error:', error);
    const wrappedError = new Error(error instanceof Error ? error.message : 'Unknown API error');
    (wrappedError as any).status = 500;
    (wrappedError as any).details = { originalError: error };
    throw wrappedError;
  }
}

// Safely parse data with Zod schema, with improved error handling
async function safelyParseData<T>(schema: z.ZodType<T>, data: unknown): Promise<T> {
  try {
    return schema.parse(data) as T;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Zod validation error:', error.errors);
      // Log the actual data that failed validation
      console.error('Data that failed validation:', data);
      const errorMessages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
      throw new Error(`Data validation error: [${errorMessages}]`);
    }
    throw error;
  }
}

// Sites API functions - use these for all new code
export const sitesApi = {
  // Get all sites for current user
  getAllSites: async (): Promise<Site[]> => {
    const rawDataArray = await apiFetch<any[]>(ENDPOINTS.SITES);
    return safelyParseData(sitesResponseSchema, rawDataArray || []) as unknown as Site[];
  },

  // Get site by ID or subdomain
  getSite: async (identifier: string): Promise<Site> => {
    const rawData = await apiFetch<any>(ENDPOINTS.SITE(identifier));
    return safelyParseData(siteSchema, rawData || {}) as unknown as Site;
  },

  // Create a new site
  createSite: async (newSiteInput: any): Promise<Site> => {
    const rawData = await apiFetch<any>(ENDPOINTS.SITES, {
      method: 'POST',
      body: JSON.stringify(newSiteInput),
    });
    return safelyParseData(siteSchema, rawData || {}) as unknown as Site;
  },
  
  // Get members for a site
  getMembers: async (siteId: string, options?: { role?: string }): Promise<Member[]> => {
    const mockMembers: Member[] = [
        { userId: "49a44198-e6e5-4b1e-b8fb-b1c50ee0639d", siteId, role: "admin", fullName: "Olivia Rhye", email: "olivia@untitledui.com", joinedAt: new Date().toISOString(), avatarUrl: null, status: "Active"},
        { userId: "59b55209-f7f6-5c2f-c9fc-c2d61ff1740e", siteId, role: "member", fullName: "Phoenix Baker", email: "phoenix@untitledui.com", joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), avatarUrl: null, status: "Active"},
    ];
    return options?.role 
      ? mockMembers.filter(member => member.role.toLowerCase() === options.role?.toLowerCase())
      : mockMembers;
  },
};

// CMS Types API functions
export const cmsTypesApi = {
  // Get all CMS types
  getAllCmsTypes: async (): Promise<any[]> => {
    return apiFetch<any[]>(ENDPOINTS.CMS_TYPES);
  },
  
  // Get CMS types by category (official/custom)
  getCmsTypesByCategory: async (category: string): Promise<any[]> => {
    return apiFetch<any[]>(`${ENDPOINTS.CMS_TYPES}/category/${category}`);
  },
  
  // Get a single CMS type by ID
  getCmsTypeById: async (id: string): Promise<any> => {
    console.log(`Fetching CMS type with ID: ${id}`);
    return apiFetch<any>(`${ENDPOINTS.CMS_TYPES}/${id}`);
  },
  
  // Get favorite CMS types
  getFavoriteCmsTypes: async (): Promise<any[]> => {
    return apiFetch<any[]>(`${ENDPOINTS.CMS_TYPES}/favorites`);
  },
}; 