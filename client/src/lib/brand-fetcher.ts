import { BrandLogo, BrandColor, CompanyInfo } from '../pages/sites/types';
import { getApiUrl } from '@/lib/utils';

interface BrandInfo {
  logo?: string;
  name?: string;
  domain?: string;
  colors?: string[];
}

function getApiBaseUrl(): string {
  return getApiUrl();
}

// Use environment-aware URLs
const API_BASE = getApiBaseUrl();
const FETCH_BRAND_ENDPOINT = `${API_BASE}/api/v1/brand-fetch`;
const TEST_BRAND_ENDPOINT = `${API_BASE}/api/v1/test-brandfetch`;

/**
 * Test the Brandfetch API connection
 * This uses the free brandfetch.com domain which doesn't count against quotas
 * @returns Test result with connection status
 */
export async function testBrandfetchConnection(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    console.log(`Testing Brandfetch API connection at: ${TEST_BRAND_ENDPOINT}`);
    
    // Add cache-busting parameter
    const url = `${TEST_BRAND_ENDPOINT}?_t=${Date.now()}`;
    console.log(`Test URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      mode: 'cors',
      credentials: 'omit'
    });
    
    console.log(`Test response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Test error response: ${errorText}`);
      throw new Error(errorText || `Test failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      success: data.status === 'success',
      message: data.message || 'Connection test completed'
    };
  } catch (error) {
    console.error('Error testing Brandfetch connection:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

interface BrandfetchResponse {
  name?: string;
  description?: string;
  longDescription?: string;
  logos?: Array<{
    type: string;
    theme?: string;
    formats: Array<{
      src: string;
      format: string;
      width?: number;
      height?: number;
      background?: string;
    }>;
  }>;
  colors?: Array<{
    hex: string;
    type: string;
    brightness?: number;
  }>;
  companyInfo?: {
    name: string;
    description: string;
    industry?: string;
    location?: string;
    employees?: number;
  };
  links?: Array<{
    name: string;
    url: string;
  }>;
  fonts?: Array<{
    name: string;
    type: string;
    origin?: string;
  }>;
  images?: Array<{
    type: string;
    formats: Array<{
      src: string;
      format: string;
      width?: number;
      height?: number;
    }>;
  }>;
  qualityScore?: number;
  error?: string;
}

/**
 * Fetch brand information for a domain
 * 
 * @param domain The domain to fetch brand info for
 * @returns Brand information including logos and colors
 */
export async function fetchBrandInfo(domain: string): Promise<{
  name?: string;
  description?: string;
  longDescription?: string;
  logos: BrandLogo[];
  colors: BrandColor[];
  companyInfo?: CompanyInfo;
  links?: Array<{ name: string; url: string }>;
  fonts?: Array<{ name: string; type: string; origin?: string }>;
  images?: Array<{ type: string; url: string; format: string; width?: number; height?: number }>;
  qualityScore?: number;
  error: string | null;
}> {
  if (!domain) {
    return {
      logos: [],
      colors: [],
      description: undefined,
      longDescription: undefined,
      companyInfo: undefined,
      links: undefined,
      fonts: undefined,
      images: undefined,
      qualityScore: undefined,
      error: 'No domain provided'
    };
  }

  try {
    // First test the connection using the free test domain
    const testResult = await testBrandfetchConnection();
    if (!testResult.success) {
      console.warn('Brandfetch API connection test failed:', testResult.message);
      // Continue anyway as the actual domain request might still work
    }
    
    const cleanDomain = domain.trim().toLowerCase();
    // If domain includes protocol, remove it
    const domainWithoutProtocol = cleanDomain.replace(/^(https?:\/\/)?(www\.)?/, '');

    console.log(`Fetching brand data for domain: ${domainWithoutProtocol} from ${FETCH_BRAND_ENDPOINT}`);
    
    // Add cache-busting timestamp and set no-cache headers
    const url = `${FETCH_BRAND_ENDPOINT}?domain=${encodeURIComponent(domainWithoutProtocol)}&_t=${Date.now()}`;
    console.log(`Request URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      mode: 'cors',
      credentials: 'omit'
    });
    
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error response: ${errorText}`);
      throw new Error(errorText || `Failed to fetch brand data (${response.status})`);
    }
    
    const data: BrandfetchResponse = await response.json();
    
    // Transform the response to our format
    const logos: BrandLogo[] = [];
    if (data.logos && data.logos.length > 0) {
      data.logos.forEach(logo => {
        logo.formats.forEach(format => {
          logos.push({
            type: logo.type,
            theme: logo.theme,
            url: format.src,
            format: format.format,
            width: format.width,
            height: format.height,
            background: format.background
          });
        });
      });
    }
    
    const colors: BrandColor[] = data.colors?.map(color => ({
      hex: color.hex,
      type: color.type,
      brightness: color.brightness
    })) || [];
    
    // Extract company information if available
    const companyInfo = data.companyInfo ? { ...data.companyInfo } : undefined;
    
    // Extract social links
    const links = data.links || [];
    
    // Extract fonts
    const fonts = data.fonts || [];
    
    // Extract images and transform to our format
    const images: Array<{ type: string; url: string; format: string; width?: number; height?: number }> = [];
    if (data.images && data.images.length > 0) {
      data.images.forEach(image => {
        // Take the first format for each image
        if (image.formats && image.formats.length > 0) {
          const format = image.formats[0];
          images.push({
            type: image.type,
            url: format.src,
            format: format.format,
            width: format.width,
            height: format.height
          });
        }
      });
    }
    
    return {
      name: data.name,
      description: data.description,
      longDescription: data.longDescription,
      logos,
      colors,
      companyInfo,
      links,
      fonts,
      images,
      qualityScore: data.qualityScore,
      error: null
    };
  } catch (error) {
    console.error('Error fetching brand data:', error);
    return {
      logos: [],
      colors: [],
      description: undefined,
      longDescription: undefined,
      companyInfo: undefined,
      links: undefined,
      fonts: undefined,
      images: undefined,
      qualityScore: undefined,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 