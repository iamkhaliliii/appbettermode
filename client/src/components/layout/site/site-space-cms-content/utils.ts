import { getApiBaseUrl } from '@/lib/utils';

export interface FetchContentOptions {
  siteId: string;
  spaceId?: string;
  cmsType: string;
  status?: string;
  limit?: number;
}

/**
 * Build API URL for fetching content posts
 * Handles simulated spaces by excluding spaceId from the query
 */
export function buildContentApiUrl(options: FetchContentOptions): string {
  const { siteId, spaceId, cmsType, status = 'published', limit = 50 } = options;
  
  const API_BASE = getApiBaseUrl();
  
  // Map frontend content types to their database equivalents
  let dbCmsType = cmsType;
  switch (cmsType) {
    case 'jobs':
      dbCmsType = 'job-board';
      break;
    case 'wishlist':
      dbCmsType = 'ideas-wishlist';
      break;
    case 'knowledge':
      dbCmsType = 'knowledge-base';
      break;
    case 'qa':
      dbCmsType = 'qa'; // This might be 'q&a' in some cases
      break;
    // Add more mappings as needed
    default:
      dbCmsType = cmsType;
  }
  
  console.log(`🔄 Mapping frontend cmsType "${cmsType}" to database cmsType "${dbCmsType}"`);
  
  let apiUrl = `${API_BASE}/api/v1/posts/site/${siteId}?cmsType=${dbCmsType}&status=${status}&limit=${limit}`;
  
  // Only include spaceId if it's a real space (not simulated)
  if (spaceId && !spaceId.startsWith('simulated-')) {
    apiUrl += `&spaceId=${spaceId}`;
    console.log(`🔗 Including real spaceId in API call: ${spaceId}`);
  } else if (spaceId) {
    console.log(`⏭️ Skipping simulated spaceId in API call: ${spaceId}`);
  }
  
  return apiUrl;
}

/**
 * Fetch content data with proper error handling and logging
 */
export async function fetchContentData(options: FetchContentOptions): Promise<any[]> {
  const { siteId, spaceId, cmsType } = options;
  
  // Validate required parameters
  if (!siteId) {
    throw new Error('Missing site information');
  }
  
  console.log(`📡 Fetching ${cmsType} content for site ${siteId}${spaceId ? ` and space ${spaceId}` : ''}`);
  
  const apiUrl = buildContentApiUrl(options);
  console.log(`🌐 API URL: ${apiUrl}`);
  
  const response = await fetch(apiUrl);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${cmsType} content: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log(`📋 Fetched ${Array.isArray(data) ? data.length : 0} ${cmsType} items:`, data);
  
  if (Array.isArray(data)) {
    return data;
  } else {
    console.warn(`⚠️ Expected array response for ${cmsType} content, got:`, typeof data);
    return [];
  }
}

/**
 * Enhanced useEffect hook for content components
 */
export function useContentFetch(
  site: any,
  space: any,
  cmsType: string,
  setContent: (data: any[]) => void,
  setUseMockData: (value: boolean) => void,
  setIsLoading: (value: boolean) => void,
  setError: (error: string | null) => void,
  mockData: any[],
  dependencies: any[] = []
) {
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchContentData({
        siteId: site.id,
        spaceId: space?.id,
        cmsType: cmsType
      });
      
      if (data.length > 0) {
        setContent(data);
        setUseMockData(false);
        console.log(`✅ Successfully loaded ${data.length} ${cmsType} items`);
      } else {
        console.log(`📭 No ${cmsType} content found, showing empty state`);
        setContent([]);
        setUseMockData(false);
      }
    } catch (err) {
      console.error(`💥 Error fetching ${cmsType} content:`, err);
      setError(`Failed to load ${cmsType} content. Using demo data as a fallback.`);
      
      // Fall back to mock data on error
      setContent(mockData.map(item => ({
        ...item,
        space_id: space?.id || '',
        site_id: site?.id || ''
      })));
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Return the fetch function for manual calls and useEffect dependency
  return {
    fetchData,
    shouldFetch: site && space
  };
}

/**
 * Check if a space is simulated (created for content type matching)
 */
export function isSimulatedSpace(space: any): boolean {
  return space?.id?.startsWith('simulated-') || false;
}

/**
 * Get display-friendly space info
 */
export function getSpaceInfo(space: any) {
  return {
    id: space?.id || '',
    name: space?.name || 'Unknown Space',
    isSimulated: isSimulatedSpace(space),
    cmsType: space?.cms_type || 'unknown'
  };
} 