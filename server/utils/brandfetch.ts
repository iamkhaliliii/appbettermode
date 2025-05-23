// Use standard fetch API
const fetch = global.fetch;

// Define types for Brandfetch API response
interface BrandfetchLogo {
  type: string;
  theme?: string;
  formats: {
    src: string;
    format: string;
    height?: number;
    width?: number;
    size?: number;
    background?: string;
  }[];
  tags?: string[];
}

interface BrandfetchColor {
  hex: string;
  type: string;
  brightness?: number;
}

interface BrandfetchResponse {
  id: string;
  name: string;
  domain: string;
  claimed: boolean;
  description: string;
  longDescription?: string;
  links: { name: string; url: string }[];
  logos: BrandfetchLogo[];
  colors: BrandfetchColor[];
  fonts: { 
    name: string; 
    type: string;
    origin?: string;
    originId?: string;
    weights?: number[];
  }[];
  images: { url: string; type: string }[];
  qualityScore?: number;
  company?: {
    employees?: number;
    foundedYear?: number;
    industries?: {
      score: number;
      id: string;
      name: string;
      emoji: string;
      parent: any;
      slug: string;
    }[];
    kind?: string;
    location?: {
      city: string;
      country: string;
      countryCode: string;
      region: string;
      state: string;
      subregion: string;
    };
  };
  isNsfw?: boolean;
  urn?: string;
}

interface BrandfetchData {
  logoUrl: string | null;
  brandColor: string | null;
  companyInfo?: {
    name: string;
    description: string;
    industry?: string;
    location?: string;
  } | null;
}

/**
 * Fetches brand information from Brandfetch API
 * @param domain The domain name to fetch brand data for
 * @param apiKey Brandfetch API key
 * @returns Brand information including logo URL and colors
 * 
 * Note: For testing, you can use the domain 'brandfetch.com' which is free
 * and doesn't count against your API quota.
 */
export async function fetchBrandData(domain: string, apiKey: string): Promise<BrandfetchData> {
  try {
    // Skip if domain is not provided
    if (!domain) {
      console.log('No domain provided, skipping Brandfetch API call');
      return { logoUrl: null, brandColor: null, companyInfo: null };
    }

    console.log(`Fetching brand data for domain: ${domain}`);
    
    const response = await fetch(`https://api.brandfetch.io/v2/brands/${domain}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Brandfetch API error (${response.status}): ${errorText}`);
      
      // Don't throw, just return null values
      return { logoUrl: null, brandColor: null, companyInfo: null };
    }

    const data = await response.json() as BrandfetchResponse;
    
    // Extract the logo URL (prefer SVG format)
    let logoUrl: string | null = null;
    const logos = data.logos || [];
    
    // Get all logo formats
    let primaryLogos = logos.filter(logo => logo.type === 'logo');
    let iconLogos = logos.filter(logo => logo.type === 'icon');
    
    // Sort by theme preference: light, no theme, dark
    const sortByThemePreference = (a: BrandfetchLogo, b: BrandfetchLogo) => {
      if (a.theme === 'light' && b.theme !== 'light') return -1;
      if (b.theme === 'light' && a.theme !== 'light') return 1;
      if (!a.theme && b.theme) return -1;
      if (!b.theme && a.theme) return 1;
      return 0;
    };
    
    primaryLogos.sort(sortByThemePreference);
    iconLogos.sort(sortByThemePreference);
    
    // Function to get best format (prefer SVG, then PNG, then others)
    const getBestFormatUrl = (logo: BrandfetchLogo): string | null => {
      if (!logo || !logo.formats || logo.formats.length === 0) return null;
      
      // Prefer SVG for better quality, then PNG
      const svgFormat = logo.formats.find(f => f.format === 'svg');
      const pngFormat = logo.formats.find(f => f.format === 'png');
      
      // Get highest quality PNG if multiple are available
      if (!svgFormat && pngFormat) {
        const allPngs = logo.formats.filter(f => f.format === 'png')
          .sort((a, b) => (b.width || 0) - (a.width || 0));
        return allPngs[0]?.src || null;
      }
      
      return svgFormat?.src || pngFormat?.src || logo.formats[0]?.src || null;
    };
    
    // First try to get a primary logo with light theme
    if (primaryLogos.length > 0) {
      logoUrl = getBestFormatUrl(primaryLogos[0]);
    }
    
    // If no primary logo found, try icon logo
    if (!logoUrl && iconLogos.length > 0) {
      logoUrl = getBestFormatUrl(iconLogos[0]);
    }
    
    // If still no logo, try any logo available
    if (!logoUrl && logos.length > 0) {
      logoUrl = getBestFormatUrl(logos[0]);
    }
    
    // Extract the primary color
    let brandColor: string | null = null;
    const colors = data.colors || [];
    
    // Look for a color with type "primary"
    const primaryColorObj = colors.find(color => color.type === 'primary');
    brandColor = primaryColorObj?.hex || null;
    
    // If no primary color, take the first color
    if (!brandColor && colors.length > 0) {
      brandColor = colors[0].hex;
    }
    
    console.log(`Successfully fetched brand data for ${domain}`);
    
    return {
      logoUrl,
      brandColor,
      companyInfo: {
        name: data.name,
        description: data.description,
        industry: data.company?.industries && data.company.industries.length > 0 ? data.company.industries[0].name : undefined,
        location: data.company?.location ? `${data.company.location.city}, ${data.company.location.country}` : undefined
      }
    };
  } catch (error) {
    console.error('Error fetching brand data:', error);
    return { logoUrl: null, brandColor: null, companyInfo: null };
  }
}

/**
 * Test function to verify the Brandfetch API connection
 * Uses the brandfetch.com domain which doesn't count against API quota
 * 
 * @param apiKey Brandfetch API key
 * @returns Test result with brand data for brandfetch.com
 */
export async function testBrandfetchAPI(apiKey: string): Promise<{
  success: boolean;
  data?: BrandfetchData;
  error?: string;
}> {
  try {
    console.log('Testing Brandfetch API with brandfetch.com domain');
    const testDomain = 'brandfetch.com';
    
    const data = await fetchBrandData(testDomain, apiKey);
    
    if (data.logoUrl || data.brandColor) {
      console.log('Brandfetch API test successful');
      return {
        success: true,
        data
      };
    } else {
      console.error('Brandfetch API test failed: No data returned');
      return {
        success: false,
        error: 'No brand data found for brandfetch.com'
      };
    }
  } catch (error) {
    console.error('Brandfetch API test failed with error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 