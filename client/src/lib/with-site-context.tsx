import React from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';

// Define site details type
export interface SiteDetails {
  id: string;
  name: string;
  subdomain?: string | null;
  role?: string;
  createdAt?: string;
  // Add other site details as needed
}

// Utility function to check if a string is a valid UUID
export function isValidUUID(uuid: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Function to fetch site details
export const fetchSiteDetails = async (siteId: string): Promise<SiteDetails | null> => {
  try {
    // Validate site ID format before making API call
    if (!isValidUUID(siteId)) {
      console.warn(`Invalid site identifier format: ${siteId}. Should be a UUID.`);
      // No need to return a mock object, just continue with the API call
      // The server will handle looking up by subdomain
    }

    const response = await fetch(`/api/v1/sites/${siteId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch site details');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching site details:', error);
    return null;
  }
};

// Type for component props that will receive site context
export interface WithSiteContextProps {
  siteId?: string;
  siteDetails?: SiteDetails | null;
  siteLoading?: boolean;
  siteError?: Error | null;
}

// Higher-order component to add site context
export function withSiteContext<P extends WithSiteContextProps>(
  Component: React.ComponentType<P>
): React.FC<Omit<P, keyof WithSiteContextProps>> {
  const WithSiteContext: React.FC<Omit<P, keyof WithSiteContextProps>> = (props) => {
    // Try to match both site and dashboard routes
    const [, siteParams] = useRoute('/site/:siteId/*');
    const [, dashboardParams] = useRoute('/dashboard/site/:siteId/*');
    
    // Get siteId from either route pattern
    const siteId = siteParams?.siteId || dashboardParams?.siteId;
    
    // Fetch site details if siteId is available
    const {
      data: siteDetails,
      isLoading: siteLoading,
      error: siteError,
    } = useQuery<SiteDetails | null, Error>({
      queryKey: ['siteDetails', siteId],
      queryFn: () => fetchSiteDetails(siteId!),
      enabled: !!siteId, // Only run query if siteId is available
    });

    // Pass all the props to the wrapped component
    return (
      <Component
        {...(props as P)}
        siteId={siteId}
        siteDetails={siteDetails}
        siteLoading={siteLoading}
        siteError={siteError || null}
      />
    );
  };

  // Set display name for easier debugging
  const displayName = Component.displayName || Component.name || 'Component';
  WithSiteContext.displayName = `WithSiteContext(${displayName})`;
  
  return WithSiteContext;
} 