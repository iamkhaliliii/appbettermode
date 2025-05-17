// Use standard fetch API
const fetch = global.fetch;
/**
 * Fetches brand information from Brandfetch API
 * @param domain The domain name to fetch brand data for
 * @param apiKey Brandfetch API key
 * @returns Brand information including logo URL and colors
 */
export async function fetchBrandData(domain, apiKey) {
    try {
        // Skip if domain is not provided
        if (!domain) {
            console.log('No domain provided, skipping Brandfetch API call');
            return { logoUrl: null, primaryColor: null, brandColors: null };
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
            return { logoUrl: null, primaryColor: null, brandColors: null };
        }
        const data = await response.json();
        // Extract the logo URL (prefer SVG format)
        let logoUrl = null;
        const logos = data.logos || [];
        // First try to find a logo with type "icon" and theme "light"
        const iconLogo = logos.find(logo => logo.type === 'icon' && logo.theme === 'light');
        if (iconLogo) {
            // Prefer SVG format, then PNG
            const svgFormat = iconLogo.formats.find(f => f.format === 'svg');
            const pngFormat = iconLogo.formats.find(f => f.format === 'png');
            logoUrl = svgFormat?.src || pngFormat?.src || null;
        }
        // If no icon logo, try primary logo
        if (!logoUrl) {
            const primaryLogo = logos.find(logo => logo.type === 'logo' && (!logo.theme || logo.theme === 'light'));
            if (primaryLogo) {
                const svgFormat = primaryLogo.formats.find(f => f.format === 'svg');
                const pngFormat = primaryLogo.formats.find(f => f.format === 'png');
                logoUrl = svgFormat?.src || pngFormat?.src || null;
            }
        }
        // Extract the primary color
        let primaryColor = null;
        const colors = data.colors || [];
        // Look for a color with type "primary"
        const primaryColorObj = colors.find(color => color.type === 'primary');
        primaryColor = primaryColorObj?.hex || null;
        // If no primary color, take the first color
        if (!primaryColor && colors.length > 0) {
            primaryColor = colors[0].hex;
        }
        console.log(`Successfully fetched brand data for ${domain}`);
        return {
            logoUrl,
            primaryColor,
            brandColors: colors.length > 0 ? colors : null
        };
    }
    catch (error) {
        console.error('Error fetching brand data:', error);
        return { logoUrl: null, primaryColor: null, brandColors: null };
    }
}
