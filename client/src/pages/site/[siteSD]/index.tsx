import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useLocation, Switch, Route } from 'wouter';
import { SiteLayout } from '@/components/layout/site/site-layout';
import { SiteSidebar } from '@/components/layout/site/site-sidebar';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Avatar, AvatarFallback, AvatarImage } from '@/components/ui/primitives';
import { 
  MessageSquare, 
  HelpCircle, 
  Star, 
  Calendar, 
  Users,
  Link as LinkIcon,
  Loader2
} from 'lucide-react';
import { sitesApi, Site } from '@/lib/api';
import { Link } from 'wouter';
import { useSiteData } from '@/lib/SiteDataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/primitives';
import SpacePage from './/[spaceSlug]';

interface SiteContextType {
  site: Site | null;
  isLoading: boolean;
}

// Create a context for site data
export const SiteContext = React.createContext<SiteContextType>({ 
  site: null, 
  isLoading: false 
});

// Shared context for site data to prevent refetching
export const SiteDataProvider: React.FC<{
  siteSD: string; 
  children: React.ReactNode;
}> = ({ siteSD, children }) => {
  const { sites, loadSite } = useSiteData();
  const [site, setSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadSiteData = async () => {
      if (!siteSD) return;
      
      setIsLoading(true);
      
      try {
        if (sites[siteSD]) {
          setSite(sites[siteSD]);
        } else {
          const siteData = await loadSite(siteSD);
          if (siteData) {
            setSite(siteData);
          }
        }
      } catch (error) {
        console.error('Failed to fetch site data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSiteData();
  }, [siteSD, sites, loadSite]);
  
  const contextValue: SiteContextType = {
    site,
    isLoading
  };
  
  return (
    <SiteContext.Provider value={contextValue}>
      {children}
    </SiteContext.Provider>
  );
};

// Content skeleton component for smooth loading states
const ContentSkeleton = () => (
  <div className="space-y-6">
    <div>
      <Skeleton className="h-8 w-48 mb-4" />
    </div>
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-9 w-20" />
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-4">
            <div>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-3 w-3/4" />
            </div>
            <div>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

// Home page content component
const SiteHomeContent = () => {
  const { site, isLoading } = React.useContext(SiteContext);
  const { siteSD } = useParams();
  
  // Memoize content types to avoid recalculating on each render
  const contentTypes = useMemo(() => 
    Array.isArray(site?.content_types) ? site.content_types : [],
    [site?.content_types]
  );
  
  // Define animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        duration: 0.2
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  };
  
  if (isLoading) {
    return <ContentSkeleton />;
  }
  
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Featured Content Header */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Featured Content</h2>
      </motion.div>

      {/* Display content based on site's content types */}
      {contentTypes.includes('discussion') && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-indigo-500" />
                  <CardTitle>Latest Discussions</CardTitle>
                </div>
                <Link href={`/site/${siteSD}/discussion`}>
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-4">
                <div className="group">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    <a href={`/site/${siteSD}/discussion/1`}>What are your favorite workout playlists?</a>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    32 replies • Posted by FitnessFan • 1 week ago
                  </p>
                </div>
                
                <div className="group">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    <a href={`/site/${siteSD}/discussion/2`}>Feature request: Add ability to see lyrics automatically</a>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    25 replies • Posted by MusicLover42 • 5 days ago
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {contentTypes.includes('qa') && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-blue-500" />
                  <CardTitle>Popular Questions</CardTitle>
                </div>
                <Link href={`/site/${siteSD}/qa`}>
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-4">
                <div className="group">
                  <div className="flex items-center gap-1 mb-1">
                    <Badge className="bg-green-100 text-green-700 text-xs dark:bg-green-900/30 dark:text-green-400">Solved</Badge>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <a href={`/site/${siteSD}/qa/1`}>How can I share my playlists with friends who don't have accounts?</a>
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    4 answers • Asked by PlaylistMaker • 3 days ago
                  </p>
                </div>
                
                <div className="group">
                  <div className="flex items-center gap-1 mb-1">
                    <Badge className="bg-green-100 text-green-700 text-xs dark:bg-green-900/30 dark:text-green-400">Solved</Badge>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <a href={`/site/${siteSD}/qa/2`}>How to transfer my playlists from another music service?</a>
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    6 answers • Asked by NewUser42 • 1 week ago
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {contentTypes.includes('wishlist') && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <CardTitle>Top-Voted Ideas</CardTitle>
                </div>
                <Link href={`/site/${siteSD}/wishlist`}>
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-4">
                <div className="group">
                  <div className="flex items-center gap-1 mb-1">
                    <Badge className="bg-blue-100 text-blue-700 text-xs dark:bg-blue-900/30 dark:text-blue-400">Under review</Badge>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      <a href={`/site/${siteSD}/wishlist/1`}>Add lyrics sync for karaoke mode</a>
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    285 votes • Submitted by KaraokeFan • 2 months ago
                  </p>
                </div>
                
                <div className="group">
                  <div className="flex items-center gap-1 mb-1">
                    <Badge className="bg-purple-100 text-purple-700 text-xs dark:bg-purple-900/30 dark:text-purple-400">Planned</Badge>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      <a href={`/site/${siteSD}/wishlist/2`}>Sleep timer with gradual volume decrease</a>
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    217 votes • Submitted by NightOwl • 3 months ago
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Upcoming Events Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-500" />
                <CardTitle>Upcoming Events</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="space-y-4">
              <div className="group">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white transition-colors">
                  New Feature Showcase
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-2">
                  Jun 15, 2025 • 3:00 PM • 87 Attendees
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Join us for a live showcase of our newest features. We'll demo the updated equalizer and answer your questions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active Members Section */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-violet-500" />
                <CardTitle>Active Members</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5].map((id) => (
                <div key={id} className="flex flex-col items-center text-center">
                  <Avatar className="h-12 w-12 mb-1">
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${id + 10}`} />
                    <AvatarFallback>U{id}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xs font-medium text-gray-900 dark:text-white">
                    {['JaneDoe', 'MusicLover42', 'FitnessFan', 'AudiophileMax', 'TeamPlayer'][id - 1]}
                  </h3>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

// Main Site Page
export default function SitePage() {
  const { siteSD } = useParams();
  
  if (!siteSD) return null;
  
  return (
    <SiteDataProvider siteSD={siteSD}>
      <SiteLayout siteSD={siteSD}>
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Hero Section */}
          <motion.section 
            className="w-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-b border-gray-200 dark:border-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="container mx-auto px-4 py-8">
              <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome to <SiteContext.Consumer>{(ctx) => ctx.site?.name || 'our Community'}</SiteContext.Consumer>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  Join the conversation, get answers to your questions, and share your ideas with other members.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Main Content with Sidebar */}
          <div className="container mx-auto px-4 py-6 flex-grow">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Sidebar */}
              <SiteSidebar siteSD={siteSD} activePage="home" />

              {/* Main Content Feed with loading state */}
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  <Switch>
                    <Route path="/site/:siteSD/:spaceSlug">
                      {(params) => <SpacePage />}
                    </Route>
                    <Route path="/site/:siteSD">
                      <SiteHomeContent />
                    </Route>
                  </Switch>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </SiteLayout>
    </SiteDataProvider>
  );
} 