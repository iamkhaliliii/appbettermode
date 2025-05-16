/**
 * Represents the structure of a site's details
 * Matches exactly with the database schema
 */
export interface SiteDetails {
  id: string;              // UUID
  name: string;            // Site name
  subdomain: string;       // Unique subdomain
  owner_id?: string;       // UUID of site owner
  created_at?: string;     // Creation timestamp
  updated_at?: string;     // Last update timestamp
  state?: string;          // Site state
} 