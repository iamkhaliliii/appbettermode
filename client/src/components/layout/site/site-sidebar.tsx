import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, 
  MessageSquare, 
  HelpCircle, 
  Star, 
  FileText, 
  Search,
  Calendar,
  BookOpen,
  Layout,
  Briefcase,
  Rss,
  AlignLeft,
  Hash,
  Loader2
} from 'lucide-react';
import { sitesApi, cmsTypesApi } from '@/lib/api';
import { getApiBaseUrl } from '@/lib/utils';

// Define type for spaces
interface Space {
  id: string;
  name: string;
  slug: string;
  description?: string;
  cms_type?: string;
  cms_type_name?: string; // Added to store the human-readable name
  hidden?: boolean;
  visibility?: string;
  display_name?: string;
}

interface SiteSidebarProps {
  siteSD: string;
  activePage?: string;
}

export function SiteSidebar({ siteSD, activePage = 'home' }: SiteSidebarProps) {
  const [location] = useLocation();
  const [site, setSite] = useState<any>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeNavItem, setActiveNavItem] = useState(activePage);
  const [siteId, setSiteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset error when site changes
  useEffect(() => {
    setError(null);
  }, [siteSD]);

  // Fetch site data
  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteSD) return;
      
      setIsLoading(true);
      try {
        console.log(`Fetching site data for site: ${siteSD}`);
        setError(null);
        const siteData = await sitesApi.getSite(siteSD);
        
        // Log what we got from the API
        console.log(`Site data retrieved:`, siteData);
        console.log(`Site has UUID: ${siteData.id}`);
        
        // Important: Don't create any spaces from content_types here
        // Just store the site ID for the next data fetch
        setSite(siteData);
        setSiteId(siteData.id);
        console.log(`Site data fetched successfully: ID=${siteData.id}, name=${siteData.name}`);
        
        // We'll fetch spaces separately using the site ID
      } catch (error) {
        console.error('Failed to fetch site data:', error);
        setError('Failed to load site data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, [siteSD]);

  // Fetch actual spaces once we have the site ID
  useEffect(() => {
    const fetchSpaces = async () => {
      if (!siteId) return;
      
      setIsLoading(true);
      try {
        console.log(`Fetching spaces for site ID: ${siteId}`);
        setError(null);
        const API_BASE = getApiBaseUrl();
        const spacesUrl = `${API_BASE}/api/v1/sites/${siteId}/spaces`;
        console.log(`API URL used for spaces: ${spacesUrl}`);
        
        const response = await fetch(spacesUrl);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Error response from spaces API: ${JSON.stringify(errorData)}`);
          throw new Error(errorData.message || 'Failed to fetch spaces');
        }
        
        const spacesData = await response.json();
        console.log('Raw spaces data received:', spacesData);
        
        if (Array.isArray(spacesData) && spacesData.length > 0) {
          // Print first space for debugging
          console.log('First space details:', spacesData[0]);
          
          // Check if cms_type field is present
          const hasCmsTypeField = spacesData.some(space => space.cms_type);
          console.log('Spaces have cms_type field:', hasCmsTypeField);
          
          // Check if slugs are working correctly
          console.log('Space slugs:', spacesData.map(s => s.slug).join(', '));
          
          const mappedSpaces: Space[] = spacesData.map((space: any) => ({
            id: space.id,
            name: space.name,
            slug: space.slug || generateSlug(space.name), // Ensure there's always a slug
            description: space.description,
            cms_type: space.cms_type || 'custom',
            hidden: space.hidden || false,
            visibility: space.visibility || 'public'
          }));
          
          console.log('Mapped spaces after initial transform:', mappedSpaces);
          setSpaces(mappedSpaces);
          
          // Handle spaces that have UUID-like names (temporary client-side fix)
          const improvedSpaces = mappedSpaces.map(space => {
            // Debug each space name
            console.log(`Processing space: "${space.name}" with cms_type: "${space.cms_type}"`);
            
            // Check if space name appears to be a UUID (has hyphens and is long)
            if (space.name && space.name.includes('-') && space.name.length > 30) {
              console.log(`Space ${space.id} has a UUID-like name: ${space.name}`);
              let displayName = '';
              
              // Try to generate a better name from the cms_type
              if (space.cms_type) {
                if (space.cms_type.toLowerCase().includes('discussion')) {
                  displayName = 'Discussions';
                } else if (space.cms_type.toLowerCase().includes('qa')) {
                  displayName = 'Q&A';
                } else if (space.cms_type.toLowerCase().includes('blog')) {
                  displayName = 'Blog';
                } else if (space.cms_type.toLowerCase().includes('knowledge')) {
                  displayName = 'Knowledge Base';
                } else if (space.cms_type.toLowerCase().includes('event')) {
                  displayName = 'Events';
                } else if (space.cms_type.toLowerCase().includes('wishlist')) {
                  displayName = 'Wishlist';
                } else {
                  // Try to extract a name from the UUID
                  const namePart = space.name.split('-')[0].replace(/[0-9]/g, '');
                  if (namePart.length > 1) {
                    displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
                  } else {
                    displayName = `Space ${space.id.substring(0, 5)}`;
                  }
                }
              } else {
                displayName = `Space ${space.id.substring(0, 5)}`;
              }
              
              console.log(`Generated display name: ${displayName}`);
              
              return {
                ...space,
                display_name: displayName
              };
            }
            
            return {
              ...space,
              display_name: space.name // Use original name
            };
          });
          
          console.log('Spaces with display names:', improvedSpaces);
          setSpaces(improvedSpaces);
          
          // Fetch official CMS types for proper naming and icons
          try {
            const officialCmsTypes = await cmsTypesApi.getCmsTypesByCategory('official');
            console.log('Fetched official CMS types:', officialCmsTypes);
            
            if (Array.isArray(officialCmsTypes)) {
              // Create mapping of ID and name to CMS type
              const cmsTypeMap = new Map();
              officialCmsTypes.forEach(cmsType => {
                if (cmsType && cmsType.id) {
                  cmsTypeMap.set(cmsType.id, cmsType);
                  // Also map by lowercase name for fuzzy matching
                  if (cmsType.name) {
                    cmsTypeMap.set(cmsType.name.toLowerCase(), cmsType);
                  }
                }
              });
              
              // Update spaces with CMS type names
              setSpaces(prevSpaces => prevSpaces.map(space => {
                const cmsTypeId = space.cms_type;
                if (!cmsTypeId) return space;
                
                // Try to match by ID first
                if (cmsTypeMap.has(cmsTypeId)) {
                  const cmsType = cmsTypeMap.get(cmsTypeId);
                  return {
                    ...space,
                    cms_type_name: cmsType.name
                  };
                }
                
                // Try to match by lowercase name
                const normalizedId = cmsTypeId.toLowerCase();
                if (cmsTypeMap.has(normalizedId)) {
                  const cmsType = cmsTypeMap.get(normalizedId);
                  return {
                    ...space,
                    cms_type_name: cmsType.name
                  };
                }
                
                // If we can't match, extract meaningful parts from UUID if necessary
                if (cmsTypeId.includes('-')) {
                  return {
                    ...space,
                    cms_type_name: cmsTypeId.split('-')[0].replace(/[0-9]/g, '')
                  };
                }
                
                return space;
              }));
            }
          } catch (err) {
            console.error("Error fetching CMS types:", err);
          }
          
          console.log('Mapped spaces with CMS types:', mappedSpaces);
        } else {
          console.warn('No spaces found or empty spaces array returned');
        }
      } catch (err) {
        console.error("Error fetching spaces for site sidebar:", err);
        setError('Failed to load spaces. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSpaces();
  }, [siteId]);

  // Set active navigation item based on current location
  useEffect(() => {
    if (location === `/site/${siteSD}`) {
      setActiveNavItem('home');
      return;
    }
    
    // Try to find which space the current path corresponds to
    if (spaces.length > 0) {
      const matchedSpace = spaces.find(space => 
        location.includes(`/site/${siteSD}/${space.slug}`)
      );
      
      if (matchedSpace) {
        setActiveNavItem(matchedSpace.slug);
        return;
      }
    }
    
    // Check for special pages
    if (location.includes('/search')) {
      setActiveNavItem('search');
    } else if (location.includes('/about')) {
      setActiveNavItem('about');
    }
  }, [location, spaces, siteSD]);

  // Get icon for space based on CMS type
  const getIconForSpace = (space: Space) => {
    // Try to use cms_type_name first if available, otherwise fall back to cms_type
    const spaceType = space.cms_type_name || space.cms_type || '';
    const normalizedType = spaceType.toLowerCase();
    
    // Match by known types with partial matching
    if (normalizedType.includes('discussion')) {
      return <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />;
    } else if (normalizedType.includes('qa') || normalizedType.includes('question')) {
      return <HelpCircle className="h-4 w-4 mr-2 text-purple-500" />;
    } else if (normalizedType.includes('blog') || normalizedType.includes('article')) {
      return <FileText className="h-4 w-4 mr-2 text-pink-500" />;
    } else if (normalizedType.includes('wishlist') || normalizedType.includes('idea')) {
      return <Star className="h-4 w-4 mr-2 text-yellow-500" />;
    } else if (normalizedType.includes('knowledge') || normalizedType.includes('guide')) {
      return <BookOpen className="h-4 w-4 mr-2 text-red-500" />;
    } else if (normalizedType.includes('event') || normalizedType.includes('calendar')) {
      return <Calendar className="h-4 w-4 mr-2 text-green-500" />;
    } else if (normalizedType.includes('job') || normalizedType.includes('career')) {
      return <Briefcase className="h-4 w-4 mr-2 text-cyan-500" />;
    } else if (normalizedType.includes('landing') || normalizedType.includes('page')) {
      return <Layout className="h-4 w-4 mr-2 text-indigo-500" />;
    } else {
      // Default to a generic icon if no matches
      return <Hash className="h-4 w-4 mr-2 text-gray-500" />;
    }
  };

  // Helper function to generate a slug if one doesn't exist
  function generateSlug(name: string): string {
    if (!name) return 'space';
    return name.toLowerCase()
      .replace(/\s+/g, '-')        // Replace spaces with -
      .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
      .replace(/\-\-+/g, '-')      // Replace multiple - with single -
      .replace(/^-+/, '')          // Trim - from start of text
      .replace(/-+$/, '');         // Trim - from end of text
  }

  return (
    <div className="md:w-64 flex-shrink-0">
      <div className="sticky top-16">
        <div className="py-4">
          <div className="">
            <nav className="space-y-1">
              {/* Home changed to Feed - always present */}
              <Link 
                href={`/site/${siteSD}`}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeNavItem === 'home' 
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setActiveNavItem('home')}
              >
                <AlignLeft className="mr-3 h-5 w-5 text-gray-400" />
                <span>Feed</span>
              </Link>
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
                  <span className="ml-2 text-sm text-gray-500">Loading spaces...</span>
                </div>
              )}
              
              {/* Error message */}
              {error && (
                <div className="px-3 py-3 text-sm text-red-500">
                  {error}
                </div>
              )}
              
              {/* Spaces Label */}
              {!isLoading && !error && spaces.length > 0 && (
                <div className="pt-4 pb-1">
                  <h3 className="px-2 text-[0.7rem] text-gray-500 dark:text-gray-400 tracking-wider">
                    Spaces:
                  </h3>
                </div>
              )}
              
              {/* Dynamic Space Navigation Links */}
              {!isLoading && !error && spaces.map(space => (
                !space.hidden && (
                  <Link 
                    key={space.id}
                    href={`/site/${siteSD}/${space.slug}`}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      activeNavItem === space.slug 
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                        : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50'
                    }`}
                    onClick={() => setActiveNavItem(space.slug)}
                  >
                    {getIconForSpace(space)}
                    <span>{space.display_name || space.name}</span>
                  </Link>
                )
              ))}

              {/* These are always present */}
            </nav>
          </div>
        </div>

      </div>
    </div>
  );
} 