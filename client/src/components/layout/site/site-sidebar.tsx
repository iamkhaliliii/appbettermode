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
  AlignLeft
} from 'lucide-react';
import { sitesApi } from '@/lib/api';

// Interface for Space objects
interface Space {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  cms_type: string;
  hidden: boolean;
  visibility: 'public' | 'private' | 'paid';
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

  // Fetch site data and spaces
  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteSD) return;
      
      setIsLoading(true);
      try {
        // Fetch site data
        const siteData = await sitesApi.getSite(siteSD);
        setSite(siteData);
        
        // For now, we'll simulate spaces based on content_types
        // This would be replaced with a real API call to get spaces
        // const spacesData = await fetch(`/api/v1/sites/${siteData.id}/spaces`).then(res => res.json());
        
        // Simulate spaces from content types
        if (siteData.content_types && Array.isArray(siteData.content_types)) {
          const simulatedSpaces: Space[] = siteData.content_types.map((cmsType: string) => {
            let name, icon;
            
            switch (cmsType) {
              case 'discussion':
                name = 'Discussions';
                break;
              case 'qa':
                name = 'Q&A';
                break;
              case 'wishlist':
                name = 'Ideas & Wishlist';
                break;
              case 'blog':
                name = 'Blog';
                break;
              case 'event':
                name = 'Events';
                break;
              case 'knowledge':
                name = 'Knowledge Base';
                break;
              case 'landing':
                name = 'Landing Pages';
                break;
              case 'jobs':
                name = 'Job Board';
                break;
              default:
                name = cmsType.charAt(0).toUpperCase() + cmsType.slice(1);
            }
            
            return {
              id: `simulated-${cmsType}`,
              name,
              slug: cmsType.toLowerCase(),
              cms_type: cmsType,
              hidden: false,
              visibility: 'public'
            };
          });
          
          setSpaces(simulatedSpaces);
        }
      } catch (error) {
        console.error('Failed to fetch site data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, [siteSD]);

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

  // Function to get the appropriate icon for a content type
  const getIconForContentType = (cmsType: string) => {
    switch (cmsType.toLowerCase()) {
      case 'discussion':
        return <MessageSquare className="mr-3 h-5 w-5 text-gray-400" />;
      case 'qa':
        return <HelpCircle className="mr-3 h-5 w-5 text-gray-400" />;
      case 'wishlist':
        return <Star className="mr-3 h-5 w-5 text-gray-400" />;
      case 'blog':
        return <FileText className="mr-3 h-5 w-5 text-gray-400" />;
      case 'event':
        return <Calendar className="mr-3 h-5 w-5 text-gray-400" />;
      case 'knowledge':
        return <BookOpen className="mr-3 h-5 w-5 text-gray-400" />;
      case 'landing':
        return <Layout className="mr-3 h-5 w-5 text-gray-400" />;
      case 'jobs':
        return <Briefcase className="mr-3 h-5 w-5 text-gray-400" />;
      default:
        return <FileText className="mr-3 h-5 w-5 text-gray-400" />;
    }
  };

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
              
              {/* Spaces Label */}
              {spaces.length > 0 && (
                <div className="pt-4 pb-1">
                  <h3 className="px-2 text-[0.7rem] text-gray-500 dark:text-gray-400 tracking-wider">
                    Spaces:
                  </h3>
                </div>
              )}
              
              {/* Dynamic Space Navigation Links */}
              {spaces.map(space => (
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
                    {getIconForContentType(space.cms_type)}
                    <span>{space.name}</span>
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