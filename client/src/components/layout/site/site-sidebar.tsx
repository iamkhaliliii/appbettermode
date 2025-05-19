import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, 
  MessageSquare, 
  HelpCircle, 
  Star, 
  FileText, 
  Search 
} from 'lucide-react';
import { sitesApi } from '@/lib/api';

interface SiteSidebarProps {
  siteSD: string;
  activePage?: string;
}

export function SiteSidebar({ siteSD, activePage = 'home' }: SiteSidebarProps) {
  const [location] = useLocation();
  const [site, setSite] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeNavItem, setActiveNavItem] = useState(activePage);

  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteSD) return;
      
      setIsLoading(true);
      try {
        const siteData = await sitesApi.getSite(siteSD);
        setSite(siteData);
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
    if (location.includes('/discussion')) {
      setActiveNavItem('discussion');
    } else if (location.includes('/qa')) {
      setActiveNavItem('qa');
    } else if (location.includes('/wishlist')) {
      setActiveNavItem('wishlist');
    } else if (location.includes('/search')) {
      setActiveNavItem('search');
    } else if (location.includes('/about')) {
      setActiveNavItem('about');
    } else {
      setActiveNavItem('home');
    }
  }, [location]);

  // Dynamically determine available content types from the database
  const contentTypes = Array.isArray(site?.content_types) ? site.content_types : [];

  return (
    <div className="md:w-64 flex-shrink-0">
      <div className="sticky top-20">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4">
            <nav className="space-y-1">
              <Link 
                href={`/site/${siteSD}`}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeNavItem === 'home' 
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setActiveNavItem('home')}
              >
                <Home className="mr-3 h-5 w-5 text-gray-400" />
                <span>Home</span>
              </Link>
              
              {/* Dynamic Content Type Navigation */}
              {contentTypes.includes('discussion') && (
                <Link 
                  href={`/site/${siteSD}/discussion`}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeNavItem === 'discussion' 
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => setActiveNavItem('discussion')}
                >
                  <MessageSquare className="mr-3 h-5 w-5 text-gray-400" />
                  <span>Discussions</span>
                </Link>
              )}

              {contentTypes.includes('qa') && (
                <Link 
                  href={`/site/${siteSD}/qa`}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeNavItem === 'qa' 
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => setActiveNavItem('qa')}
                >
                  <HelpCircle className="mr-3 h-5 w-5 text-gray-400" />
                  <span>Q&A</span>
                </Link>
              )}

              {contentTypes.includes('wishlist') && (
                <Link 
                  href={`/site/${siteSD}/wishlist`}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeNavItem === 'wishlist' 
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => setActiveNavItem('wishlist')}
                >
                  <Star className="mr-3 h-5 w-5 text-gray-400" />
                  <span>Wishlist</span>
                </Link>
              )}

              {/* These are always present */}
              <Link 
                href={`/site/${siteSD}/search`}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeNavItem === 'search' 
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setActiveNavItem('search')}
              >
                <Search className="mr-3 h-5 w-5 text-gray-400" />
                <span>Search</span>
              </Link>

              <Link 
                href={`/site/${siteSD}/about`}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeNavItem === 'about' 
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400' 
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setActiveNavItem('about')}
              >
                <FileText className="mr-3 h-5 w-5 text-gray-400" />
                <span>About</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Community Stats Card */}
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Community Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Members</span>
              <span className="text-sm font-medium">1,245</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Posts</span>
              <span className="text-sm font-medium">3,872</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Online</span>
              <span className="text-sm font-medium">42</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 