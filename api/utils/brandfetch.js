/**
 * Optimized Brandfetch API integration
 * Updated to match actual API v2 response structure
 */
// Use standard fetch API
const fetch = global.fetch;
/**
 * Fetches brand information from Brandfetch API v2
 * @param domain The domain name to fetch brand data for
 * @param apiKey Brandfetch API key
 * @returns Optimized brand information
 */
export async function fetchBrandData(domain, apiKey) {
    try {
        if (!domain) {
            console.log('No domain provided, skipping Brandfetch API call');
            return {
                name: undefined,
                description: undefined,
                longDescription: undefined,
                logoUrl: null,
                brandColor: null,
                logos: [],
                colors: [],
                companyInfo: null,
                links: [],
                fonts: [],
                images: [],
                qualityScore: undefined
            };
        }
        console.log(`Fetching brand data for domain: ${domain}`);
        const response = await fetch(`https://api.brandfetch.io/v2/brands/${domain}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Brandfetch API error (${response.status}): ${errorText}`);
            return {
                name: undefined,
                description: undefined,
                longDescription: undefined,
                logoUrl: null,
                brandColor: null,
                logos: [],
                colors: [],
                companyInfo: null,
                links: [],
                fonts: [],
                images: [],
                qualityScore: undefined
            };
        }
        const data = await response.json();
        console.log(`Successfully fetched brand data for ${domain}`);
        // Extract logo URL - prefer light theme SVG, fallback to PNG
        const logoUrl = extractBestLogo(data.logos);
        // Extract primary brand color
        const brandColor = extractPrimaryColor(data.colors);
        // Extract company information
        const companyInfo = extractCompanyInfo(data);
        // Extract all logos
        const logos = data.logos.map(logo => logo.formats.map(format => ({
            type: logo.type,
            theme: logo.theme,
            url: format.src,
            format: format.format,
            width: format.width || undefined,
            height: format.height || undefined,
            background: format.background || undefined
        }))).flat();
        // Extract all colors
        const colors = data.colors.map(color => ({
            hex: color.hex,
            type: color.type,
            brightness: color.brightness
        }));
        // Extract links
        const links = data.links || [];
        // Extract fonts
        const fonts = data.fonts || [];
        // Extract images
        const images = (data.images || []).map(image => image.formats.map(format => ({
            type: image.type,
            url: format.src,
            format: format.format,
            width: format.width || undefined,
            height: format.height || undefined
        }))).flat();
        return {
            name: data.name,
            description: data.description,
            longDescription: data.longDescription,
            logoUrl,
            brandColor,
            logos,
            colors,
            companyInfo,
            links,
            fonts,
            images,
            qualityScore: data.qualityScore
        };
    }
    catch (error) {
        console.error('Error fetching brand data:', error);
        return {
            name: undefined,
            description: undefined,
            longDescription: undefined,
            logoUrl: null,
            brandColor: null,
            logos: [],
            colors: [],
            companyInfo: null,
            links: [],
            fonts: [],
            images: [],
            qualityScore: undefined
        };
    }
}
/**
 * Extract the best logo URL from the logos array
 * Priority: Light theme SVG > Light theme PNG > Any SVG > Any PNG > First available
 */
function extractBestLogo(logos) {
    if (!logos || logos.length === 0)
        return null;
    // Filter to logo type only (exclude icons)
    const logoItems = logos.filter(logo => logo.type === 'logo');
    if (logoItems.length === 0) {
        // Fallback to any logo if no 'logo' type found
        return extractLogoUrl(logos[0]);
    }
    // Prefer light theme
    const lightLogo = logoItems.find(logo => logo.theme === 'light');
    if (lightLogo) {
        return extractLogoUrl(lightLogo);
    }
    // Fallback to first logo
    return extractLogoUrl(logoItems[0]);
}
/**
 * Extract logo URL from a logo object, preferring SVG over PNG
 */
function extractLogoUrl(logo) {
    if (!logo.formats || logo.formats.length === 0)
        return null;
    // Prefer SVG format
    const svgFormat = logo.formats.find(format => format.format === 'svg');
    if (svgFormat)
        return svgFormat.src;
    // Fallback to PNG, prefer larger sizes
    const pngFormats = logo.formats
        .filter(format => format.format === 'png')
        .sort((a, b) => (b.width || 0) - (a.width || 0));
    if (pngFormats.length > 0)
        return pngFormats[0].src;
    // Fallback to any format
    return logo.formats[0].src;
}
/**
 * Extract primary brand color
 * Priority: accent > dark > first available
 */
function extractPrimaryColor(colors) {
    if (!colors || colors.length === 0)
        return null;
    // Look for accent color first
    const accentColor = colors.find(color => color.type === 'accent');
    if (accentColor)
        return accentColor.hex;
    // Then look for dark color
    const darkColor = colors.find(color => color.type === 'dark');
    if (darkColor)
        return darkColor.hex;
    // Fallback to first color
    return colors[0].hex;
}
/**
 * Extract company information from the response
 */
function extractCompanyInfo(data) {
    const company = data.company;
    return {
        name: data.name,
        description: data.description,
        industry: company?.industries?.[0]?.name,
        location: company?.location ? `${company.location.city}, ${company.location.country}` : undefined,
        employees: company?.employees
    };
}
/**
 * Test function to verify the Brandfetch API connection
 * Uses a reliable domain for testing
 */
export async function testBrandfetchAPI(apiKey) {
    try {
        console.log('Testing Brandfetch API with nike.com domain');
        const testDomain = 'nike.com';
        const data = await fetchBrandData(testDomain, apiKey);
        if (data.logoUrl || data.brandColor) {
            console.log('Brandfetch API test successful');
            return {
                success: true,
                data
            };
        }
        else {
            console.error('Brandfetch API test failed: No data returned');
            return {
                success: false,
                error: 'No brand data found for test domain'
            };
        }
    }
    catch (error) {
        console.error('Brandfetch API test failed with error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
