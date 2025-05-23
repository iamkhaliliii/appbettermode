/**
 * Represents the structure of a site's details
 * Matches the Site type from api.ts
 */
export interface SiteDetails {
  id: string;              // UUID
  name: string;            // Site name
  subdomain: string | null; // Unique subdomain
  ownerId?: string;        // UUID of site owner
  createdAt?: string;      // Creation timestamp
  updatedAt?: string;      // Last update timestamp
  /** @deprecated Use status instead */
  state?: string;          // Deprecated - use status instead
  status: string;          // Site status (active, inactive, etc.)
} 