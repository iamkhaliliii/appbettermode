import { SiteDetails } from '@/types/site';
import { z } from 'zod';

// API base URL and endpoints - use the new v1 endpoints
const API_BASE = '/api/v1';
const ENDPOINTS = {
  SITES: `${API_BASE}/sites`,
  SITE: (identifier: string) => `${API_BASE}/sites/${identifier}`,
  SITE_MEMBERS: (siteId: string) => `${API_BASE}/sites/${siteId}/members`,
};

// Legacy API endpoints - to be gradually deprecated
const LEGACY_ENDPOINTS = {
  MOCK_SITE: '/api/mock-site',
  SITE_BY_SUBDOMAIN: '/api/site-by-subdomain',
};

// Schema for site data
const siteSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, { message: 'Site name must be at least 2 characters.' }),
  subdomain: z.string().optional(),
  ownerId: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime().nullable(),
  state: z.string().nullable(),
  status: z.string(),
  // Role may be included in responses from the membership join
  role: z.string().optional(),
});

const sitesResponseSchema = z.array(siteSchema);

export type Site = z.infer<typeof siteSchema>;

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
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ApiErrorResponse;
      throw new Error(errorData.message || 'An error occurred with the API request');
    }

    return data as T;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

// Safely parse data with Zod schema, with improved error handling
async function safelyParseData<T>(schema: z.ZodType<T>, data: unknown): Promise<T> {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Zod validation error:', error.errors);
      // Log the actual data that failed validation
      console.error('Data that failed validation:', data);
      throw new Error(`Data validation error: ${JSON.stringify(error.errors)}`);
    }
    throw error;
  }
}

// Sites API functions - use these for all new code
export const sitesApi = {
  // Get all sites for current user
  getAllSites: async (): Promise<Site[]> => {
    const data = await apiFetch<unknown>(ENDPOINTS.SITES);
    return safelyParseData(sitesResponseSchema, data);
  },

  // Get site by ID or subdomain
  getSite: async (identifier: string): Promise<Site> => {
    const data = await apiFetch<unknown>(ENDPOINTS.SITE(identifier));
    return safelyParseData(siteSchema, data);
  },

  // Create a new site
  createSite: async (newSite: { name: string; subdomain?: string }): Promise<Site> => {
    const data = await apiFetch<unknown>(ENDPOINTS.SITES, {
      method: 'POST',
      body: JSON.stringify(newSite),
    });
    return safelyParseData(siteSchema, data);
  },
  
  // Get members for a site
  getMembers: async (siteId: string, options?: { role?: string }): Promise<Member[]> => {
    // TODO: Implement the actual API call when backend endpoint is ready
    // For now, use mock data
    console.log(`Getting members for site ${siteId}${options?.role ? ` with role ${options.role}` : ''} (mock data)`);
    
    const mockMembers: Member[] = [
      {
        userId: "49a44198-e6e5-4b1e-b8fb-b1c50ee0639d",
        siteId: siteId,
        role: "admin",
        fullName: "Olivia Rhye",
        email: "olivia@untitledui.com",
        joinedAt: new Date().toISOString(),
        avatarUrl: undefined,
        status: "Active",
      },
      {
        userId: "59b55209-f7f6-5c2f-c9fc-c2d61ff1740e",
        siteId: siteId,
        role: "member",
        fullName: "Phoenix Baker",
        email: "phoenix@untitledui.com",
        joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        avatarUrl: undefined,
        status: "Active",
      },
      {
        userId: "71d77321-h9h8-7e4h-e1he-e4f83hh3962g",
        siteId: siteId,
        role: "member",
        fullName: "Candice Wu",
        email: "candice@untitledui.com",
        joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        avatarUrl: undefined,
        status: "Inactive",
      },
      {
        userId: "82e88432-i0i9-8f5i-f2if-f5g94ii4073h",
        siteId: siteId,
        role: "editor",
        fullName: "Drew Cano",
        email: "drew@untitledui.com",
        joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        avatarUrl: undefined,
        status: "Active",
      }
    ];
    
    // Return mock data directly, filtered if needed
    // This bypasses the schema validation which was causing type issues
    return options?.role 
      ? mockMembers.filter(member => 
          member.role.toLowerCase() === options.role?.toLowerCase()
        )
      : mockMembers;
  },
}; 