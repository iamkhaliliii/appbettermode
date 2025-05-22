import { DashboardLayout } from "@/components/layout/dashboard/dashboard-layout";
import { useRoute, useLocation } from "wouter";
import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Loader2,
  MessageSquare,
  HelpCircle,
  Star,
  Calendar,
  BookOpen,
  Layout,
  Briefcase,
  FileText,
  Shield,
  Upload,
  Info,
  Link2,
  Folder,
  X
} from "lucide-react";
import { BrowserMockup } from "@/components/layout/dashboard/browser-mockup";
import { AddContentDialog } from "@/components/ui/add-content-dialog";
import { sitesApi, Site } from "@/lib/api";
import { getApiBaseUrl } from "@/lib/utils";
import { APP_ROUTES } from "@/config/routes";
import { SiteHeader } from "@/components/layout/site/site-header";
import { SiteSidebar } from "@/components/layout/site/site-sidebar";
import { SpaceCmsContent } from "@/components/layout/site/site-space-cms-content";
import { Skeleton } from "@/components/ui/skeleton";
import { cmsTypesApi } from "@/lib/api";
import { SpaceSettingsSidebar } from "@/components/layout/dashboard/secondary-sidebar/SpaceSettingsSidebar";

// Interface for space data
interface Space {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cms_type: string;
  hidden: boolean;
  visibility: 'public' | 'private' | 'paid';
  site_id: string;
}

// CSS to disable all links in the preview
const disableLinksStyle = `
  .preview-container a {
    pointer-events: none !important;
    cursor: default !important;
    color: inherit !important;
    text-decoration: none !important;
  }
`;

// Skeleton component for content loading
function ContentSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="pt-4">
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    </div>
  );
}

// Component to embed space content with full layout
const SpaceContent = ({ siteSD, spaceSlug }: { siteSD: string, spaceSlug: string }) => {
  const [site, setSite] = useState<any>(null);
  const [space, setSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cmsTypes, setCmsTypes] = useState<any[]>([]);

  // Fetch CMS types for matching content types properly
  useEffect(() => {
    const fetchCmsTypes = async () => {
      try {
        const types = await cmsTypesApi.getAllCmsTypes();
        setCmsTypes(types);
      } catch (err) {
        console.error("Error fetching CMS types:", err);
      }
    };
    
    fetchCmsTypes();
  }, []);

  // Fetch site data
  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteSD) {
        setError('Invalid site identifier');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch site data
        const siteData = await sitesApi.getSite(siteSD);
        setSite(siteData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching site data:", err);
        setError('Failed to load site data');
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, [siteSD]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In preview mode, just prevent default
  };

  // Create space from content type
  useEffect(() => {
    const createSpace = () => {
      if (!site || !spaceSlug || cmsTypes.length === 0) {
        return;
      }

      setIsContentLoading(true);
      
      try {
        // First, find CMS type by slug (case-insensitive)
        const matchingCmsType = cmsTypes.find(type => 
          type.slug?.toLowerCase() === spaceSlug.toLowerCase() || 
          type.name?.toLowerCase() === spaceSlug.toLowerCase()
        );
        
        // Then check if site includes this type by ID
        let matchedTypeId = null;
        
        if (matchingCmsType && site.content_types?.includes(matchingCmsType.id)) {
          matchedTypeId = matchingCmsType.id;
        } else if (Array.isArray(site.content_types)) {
          // If no direct match, check if any of the site's content types match the slug
          const contentTypeDetails = cmsTypes.filter(type => site.content_types.includes(type.id));
          const matchBySlug = contentTypeDetails.find(type => 
            type.slug?.toLowerCase() === spaceSlug.toLowerCase() || 
            type.name?.toLowerCase() === spaceSlug.toLowerCase()
          );
          
          if (matchBySlug) {
            matchedTypeId = matchBySlug.id;
          }
        }
        
        if (matchedTypeId) {
          // Find the details for this type
          const typeDetails = cmsTypes.find(type => type.id === matchedTypeId);
          
          // Create a space from this content type
          setSpace({
            id: `space-${matchedTypeId}`,
            name: typeDetails?.name || spaceSlug.charAt(0).toUpperCase() + spaceSlug.slice(1),
            slug: spaceSlug,
            description: typeDetails?.description || `${spaceSlug} space for the community`,
            cms_type: matchedTypeId,
            hidden: false,
            visibility: 'public',
            site_id: site.id
          });
        } else {
          // For demo/preview purposes, create a generic space if not found
          // This helps when testing with URLs like /site-config/spaces/events
          const defaultName = spaceSlug.charAt(0).toUpperCase() + spaceSlug.slice(1);
          
          // Map common space names to readable formats
          const nameMap: {[key: string]: string} = {
            'events': 'Events',
            'qa': 'Q&A',
            'blog': 'Blog',
            'discussion': 'Discussions',
            'wishlist': 'Ideas & Wishlist',
            'knowledge': 'Knowledge Base',
            'landing': 'Landing Pages',
            'jobs': 'Job Board',
          };
          
          setSpace({
            id: `demo-space-${spaceSlug}`,
            name: nameMap[spaceSlug.toLowerCase()] || defaultName,
            slug: spaceSlug,
            description: `${nameMap[spaceSlug.toLowerCase()] || defaultName} space for the community`,
            cms_type: spaceSlug,
            hidden: false,
            visibility: 'public',
            site_id: site.id
          });
        }
      } catch (err) {
        console.error("Error creating space:", err);
        setError('Failed to create space');
      } finally {
        setIsContentLoading(false);
      }
    };

    if (site && cmsTypes.length > 0) {
      createSpace();
    }
  }, [site, spaceSlug, cmsTypes]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        <p className="ml-3">Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full pb-8 overflow-y-auto flex flex-col bg-gray-50 dark:bg-gray-900 preview-container">
      {/* Site Header */}
      <SiteHeader 
        siteSD={siteSD}
        site={site}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto px-4 flex-grow">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <SiteSidebar siteSD={siteSD} activePage={spaceSlug} />

            {/* Main content area */}
            <div className="flex-1 p-4 md:p-6">
              {isContentLoading ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <ContentSkeleton />
                </div>
              ) : space ? (
                <SpaceCmsContent 
                  siteSD={siteSD}
                  space={space}
                  site={site}
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    No content available for this space.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-4 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              {site?.logo_url ? (
                <img src={site.logo_url} alt={site.name} className="h-6 w-6 object-contain" />
              ) : (
                <div 
                  className="h-6 w-6 rounded-md flex items-center justify-center font-bold text-white"
                  style={{ 
                    backgroundColor: site?.brand_color || '#6366f1',
                  }}
                >
                  {site?.name?.substring(0, 1) || 'S'}
                </div>
              )}
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {site?.name || 'Community'}
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} {site?.name || 'Community'} - Powered by BetterMode
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Settings Component for Settings Sidebar
const SettingsSidebar = ({ 
  siteSD, 
  spacesSlug, 
  activeTab, 
  siteDetails 
}: { 
  siteSD: string; 
  spacesSlug: string; 
  activeTab: string; 
  siteDetails: Site | null;
}) => {
  // Get capitalized space name for display
  const getDisplaySpaceName = () => {
    // Convert from slug to display name (capitalize first letter and replace hyphens with spaces)
    return spacesSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const [name, setName] = useState(getDisplaySpaceName());
  const [description, setDescription] = useState(`Advice and answers from the Tribe Team`);
  const [slug, setSlug] = useState(spacesSlug);
  const [spaceIconUrl, setSpaceIconUrl] = useState("");
  const [spaceBannerUrl, setSpaceBannerUrl] = useState("");
  const [visibility, setVisibility] = useState<string>("public");
  const [inviteOnly, setInviteOnly] = useState(false);
  const [anyoneCanInvite, setAnyoneCanInvite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get the title for the current tab
  const getTabTitle = () => {
    switch(activeTab) {
      case 'general': return 'General settings';
      case 'permissions': return 'Permissions Settings';
      case 'seo': return 'SEO Settings';
      case 'display': return 'Display Settings';
      case 'customize': return 'Customize Settings';
      case 'danger': return 'Danger Zone';
      default: return 'Settings';
    }
  };

  // Render form content based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Icon</h3>
                <div className="text-gray-400 w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <span className="text-[10px]">?</span>
                </div>
              </div>
              <div className="mt-1">
                {spaceIconUrl ? (
                  <div className="inline-flex relative">
                    <img 
                      src={spaceIconUrl} 
                      alt="Icon" 
                      className="h-12 w-12 rounded-md object-cover" 
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMTZDMTQuMjA5MSAxNiAxNiAxNC4yMDkxIDE2IDEyQzE2IDkuNzkwODYgMTQuMjA5MSA4IDEyIDhDOS43OTA4NiA4IDggOS43OTA4NiA4IDEyQzggMTQuMjA5MSA5Ljc5MDg2IDE2IDEyIDE2WiIgc3Ryb2tlPSIjNjk3MDg2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0zIDEyQzMgMTIgNyAyMSAxMiAyMUMxNyAyMSAyMSAxMiAyMSAxMkMyMSAxMiAxNyAzIDEyIDNDNyAzIDMgMTIgMyAxMloiIHN0cm9rZT0iIzY5NzA4NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=';
                      }}
                    />
                    <button
                      onClick={() => setSpaceIconUrl('')}
                      className="absolute -top-1.5 -right-1.5 bg-gray-500/90 text-white rounded-full w-4 h-4 flex items-center justify-center"
                      type="button"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          // This would normally upload to server, but for now we'll use a placeholder
                          setSpaceIconUrl(URL.createObjectURL(file));
                        }
                      };
                      input.click();
                    }}
                    className="cursor-pointer border border-dashed border-gray-300 dark:border-gray-600 rounded-md h-12 w-12 flex flex-col items-center justify-center"
                  >
                    <Upload className="h-3.5 w-3.5 text-gray-400 mb-0.5" />
                    <div className="text-[10px] text-indigo-500 dark:text-indigo-400">Upload</div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-1.5">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name
                </label>
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                required
              />
            </div>
            
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <div className="text-gray-400 w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <span className="text-[10px]">?</span>
                </div>
              </div>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            
            <div>
              <div className="mb-1.5">
                <label htmlFor="banner" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Banner
                </label>
              </div>
              
              {spaceBannerUrl ? (
                <div className="relative">
                  <img 
                    src={spaceBannerUrl} 
                    alt="Banner" 
                    className="w-full h-24 object-cover rounded-md" 
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkgM0g1QzMuODk1NDMgMyAzIDMuODk1NDMgMyA1VjE5QzMgMjAuMTA0NiAzLjg5NTQzIDIxIDUgMjFIMTlDMjAuMTA0NiAyMSAyMSAyMC4xMDQ2IDIxIDE5VjVDMjEgMy44OTU0MyAyMC4xMDQ2IDMgMTkgM1oiIHN0cm9rZT0iIzY5NzA4NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNOC41IDEwQzkuMzI4NDMgMTAgMTAgOS4zMjg0MyAxMCA4LjVDMTAgNy42NzE1NyA5LjMyODQzIDcgOC41IDdDNy42NzE1NyA3IDcgNy42NzE1NyA3IDguNUM3IDkuMzI4NDMgNy42NzE1NyAxMCA4LjUgMTBaIiBzdHJva2U9IiM2OTcwODYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTIxIDE1TDE2IDEwTDUgMjEiIHN0cm9rZT0iIzY5NzA4NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=';
                    }}
                  />
                  <button
                    onClick={() => setSpaceBannerUrl('')}
                    className="absolute top-1.5 right-1.5 bg-gray-600/90 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    type="button"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        // This would normally upload to server, but for now we'll use a placeholder
                        setSpaceBannerUrl(URL.createObjectURL(file));
                      }
                    };
                    input.click();
                  }}
                  className="cursor-pointer border border-dashed border-gray-300 dark:border-gray-600 rounded-md h-24 flex flex-col items-center justify-center"
                >
                  <Upload className="h-4 w-4 text-gray-400 mb-1" />
                  <div className="text-xs text-indigo-500 dark:text-indigo-400">Click to upload</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">SVG, PNG, JPG or GIF (max. 800×400px)</div>
                </div>
              )}
            </div>
            
            <div>
              <div className="mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Web address
                </label>
              </div>
              <div className="flex rounded-md">
                <span className="flex items-center px-2 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 text-xs">
                  bettermode.com/.../
                </span>
                <input 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-r-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
            </div>
            
            <div>
              <div className="pt-1 pb-3">
                <div className="flex items-center py-1.5">
                  <input
                    type="checkbox"
                    id="make_private"
                    checked={visibility === 'private'}
                    onChange={(e) => setVisibility(e.target.checked ? 'private' : 'public')}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="make_private" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Make private
                  </label>
                </div>
                
                <div className="flex items-center py-1.5">
                  <input
                    type="checkbox"
                    id="invite_only"
                    checked={inviteOnly}
                    onChange={(e) => setInviteOnly(e.target.checked)}
                    disabled={visibility === 'private'}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="invite_only" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Make invite-only
                  </label>
                </div>
                
                <div className="flex items-center py-1.5">
                  <input
                    type="checkbox"
                    id="anyone_can_invite"
                    checked={anyoneCanInvite}
                    onChange={(e) => setAnyoneCanInvite(e.target.checked)}
                    disabled={!inviteOnly || visibility === 'private'}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="anyone_can_invite" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Anyone can invite
                  </label>
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        );
      case 'permissions':
        return (
          <div className="space-y-6">
            <div className="flex items-start p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
              <Shield className="h-5 w-5 text-amber-500 dark:text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Permissions Configuration</h3>
                <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
                  Define who can access this space and what actions they can perform.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-1 mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Who can post?
                </label>
                <div className="text-gray-400 w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <span className="text-[10px]">?</span>
                </div>
              </div>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                defaultValue="all"
              >
                <option value="all">All members</option>
                <option value="members">Members Only</option>
                <option value="staff">Staff Only</option>
                <option value="admin">Admin Only</option>
              </select>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-1 mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Who can reply?
                </label>
                <div className="text-gray-400 w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <span className="text-[10px]">?</span>
                </div>
              </div>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                defaultValue="all"
              >
                <option value="all">All members</option>
                <option value="members">Members Only</option>
                <option value="staff">Staff Only</option>
                <option value="admin">Admin Only</option>
              </select>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-1 mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Who can react?
                </label>
                <div className="text-gray-400 w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <span className="text-[10px]">?</span>
                </div>
              </div>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                defaultValue="all"
              >
                <option value="all">All members</option>
                <option value="members">Members Only</option>
                <option value="staff">Staff Only</option>
                <option value="admin">Admin Only</option>
              </select>
            </div>
            
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Save Changes
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="py-6 px-2 text-center text-gray-500 dark:text-gray-400">
            Select settings from the sidebar to configure this space.
          </div>
        );
    }
  };

  return (
    <div className="w-80 h-full overflow-hidden border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 flex flex-col">
      <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center flex-shrink-0">
        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-md flex items-center justify-center text-primary-600 dark:text-primary-300 mr-3">
          <FileText className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-medium text-gray-900 dark:text-white">{getTabTitle()}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Edit space settings</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default function SpaceSettingsPage() {
  const [, params] = useRoute('/dashboard/site/:siteSD/site-config/spaces/:spacesSlug');
  const [location, setLocation] = useLocation();
  const siteSD = params?.siteSD || '';
  const spacesSlug = params?.spacesSlug || '';
  
  const [siteDetails, setSiteDetails] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addContentDialogOpen, setAddContentDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // Browser mockup state
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [responsiveDropdownOpen, setResponsiveDropdownOpen] = useState(false);
  
  // Fetch site data
  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteSD) {
        setSiteDetails(null);
        setIsLoading(false);
        setError("No site identifier provided in the URL.");
        return;
      }

      setIsLoading(true);
      setError(null);
      setSiteDetails(null);

      try {
        const data = await sitesApi.getSite(siteSD);
        setSiteDetails(data);
        setIsLoading(false);
      } catch (err: any) {
        const errorMessage = err instanceof Error ? err.message : 
          "An unexpected error occurred while fetching site data.";
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, [siteSD]);

  if (isLoading) {
    return (
      <DashboardLayout currentSiteIdentifier={siteSD} siteName="Loading...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary-500" />
          <p className="ml-3 text-lg">Loading site data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout currentSiteIdentifier={siteSD} siteName="Error">
        <div className="max-w-2xl mx-auto p-4 my-8 text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-red-700 dark:text-red-400">Error Loading Site</h1>
          <p className="mt-2 text-md text-gray-600 dark:text-gray-400">{error}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">Identifier: {siteSD}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!siteDetails) {
    return (
      <DashboardLayout currentSiteIdentifier={siteSD} siteName="Site Not Found">
        <div className="max-w-2xl mx-auto p-4 my-8 text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-yellow-700 dark:text-yellow-400">Site Not Available</h1>
          <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
            Could not load details for the specified site. It may not exist or there was an issue retrieving its data.
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">Identifier: {siteSD}</p>
        </div>
      </DashboardLayout>
    );
  }

  // Get capitalized space name for display
  const getDisplaySpaceName = () => {
    // Convert from slug to display name (capitalize first letter and replace hyphens with spaces)
    return spacesSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Construct the URL for display in browser mockup
  const siteUrl = `/site/${siteSD}/${spacesSlug}`;

  return (
    <DashboardLayout 
      currentSiteIdentifier={siteDetails.id} 
      siteName={siteDetails.name}
      onNewContent={() => setAddContentDialogOpen(true)}
      secondarySidebar={
        <SpaceSettingsSidebar 
          siteSD={siteSD} 
          spaceName={getDisplaySpaceName()} 
          spaceSlug={spacesSlug}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      }
    >
      {/* CSS to disable links in preview */}
      <style>
        {disableLinksStyle}
      </style>
      
      {/* Add Content Dialog */}
      <AddContentDialog
        open={addContentDialogOpen}
        onOpenChange={setAddContentDialogOpen}
      />
      <div className="flex">
      <div className="h-[calc(100vh-54px)] overflow-y-auto">
        {/* Settings Sidebar - Now on the left */}
        <SettingsSidebar 
          siteSD={siteSD} 
          spacesSlug={spacesSlug} 
          activeTab={activeTab} 
          siteDetails={siteDetails} 
        />
        </div>
        {/* Browser Preview - Now on the right */}
        <div className="flex-1 p-4 flex flex-col">
        
          <div className="flex-1 overflow-auto">
        <BrowserMockup
          userDropdownOpen={userDropdownOpen}
          setUserDropdownOpen={setUserDropdownOpen}
          languageDropdownOpen={languageDropdownOpen}
          setLanguageDropdownOpen={setLanguageDropdownOpen}
          themeDropdownOpen={themeDropdownOpen}
          setThemeDropdownOpen={setThemeDropdownOpen}
          responsiveDropdownOpen={responsiveDropdownOpen}
          setResponsiveDropdownOpen={setResponsiveDropdownOpen}
          siteUrl={siteUrl}
        >
          <SpaceContent siteSD={siteSD} spaceSlug={spacesSlug} />
        </BrowserMockup>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 