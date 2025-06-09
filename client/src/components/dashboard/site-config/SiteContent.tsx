import { useState, useEffect, useCallback } from "react";
import { MessageSquare, HelpCircle, Star, Calendar, BookOpen, Layout, Briefcase, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SiteHeader } from "@/components/layout/site/site-header";
import { SiteSidebar } from "@/components/layout/site/site-sidebar";
import { Skeleton } from "@/components/ui/primitives";
import { useSiteData } from "@/lib/SiteDataContext";

// Skeleton component for content feed items
function ContentFeedSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <Skeleton className="h-3 w-full mb-2" />
          <Skeleton className="h-3 w-3/4 mb-3" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}

// Component to embed the full site content with layout
export function SiteContent({ siteSD }: { siteSD: string }) {
  const { sites } = useSiteData();
  
  const [site, setSite] = useState<any>(null);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set up site data from context
  useEffect(() => {
    if (sites[siteSD]) {
      setSite(sites[siteSD]);
      
      // Add a slight delay to make transitions smoother
      setTimeout(() => {
        setIsContentLoading(false);
      }, 300);
    }
  }, [siteSD, sites]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    // In preview mode, just prevent default
  }, []);

  // Footer component - extracted to reduce render cost
  const renderFooter = useCallback(() => (
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
  ), [site]);

  // If we don't have site data yet, just render a placeholder
  if (!site) {
    return null;
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 dark:scrollbar-thumb-gray-700 flex flex-col bg-gray-50 dark:bg-gray-900 preview-container">
      {/* Site Header - always render */}
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
            {/* Sidebar - always render */}
            <SiteSidebar siteSD={siteSD} activePage="home" />

            {/* Main Content Feed - animate between states */}
            <div className="flex-1 p-4 md:p-6">
              {/* Featured Content Header */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to {site?.name || 'our Community'}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Join the conversation, get answers to your questions, and share your ideas with other members.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {isContentLoading ? (
                  <motion.div
                    key="skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ContentFeedSkeleton />
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-center py-4"
                  >
                    <p className="text-red-500">{error}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {/* Display content based on site's content types */}
                    {site?.content_types?.includes('discussion') && (
                      <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                        <div className="flex items-center gap-2 mb-3">
                          <MessageSquare className="h-5 w-5 text-blue-500" />
                          <h3 className="font-medium">Latest Discussions</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">Join conversations with community members</p>
                        <div className="text-sm text-gray-500">No recent discussions yet</div>
                      </div>
                    )}

                    {site?.content_types?.includes('event') && (
                      <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="h-5 w-5 text-emerald-500" />
                          <h3 className="font-medium">Upcoming Events</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">Attend and organize community events</p>
                        <div className="text-sm text-gray-500">No upcoming events</div>
                      </div>
                    )}

                    {site?.content_types?.includes('qa') && (
                      <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                        <div className="flex items-center gap-2 mb-3">
                          <HelpCircle className="h-5 w-5 text-violet-500" />
                          <h3 className="font-medium">Questions & Answers</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">Get help from the community</p>
                        <div className="text-sm text-gray-500">No recent questions</div>
                      </div>
                    )}

                    {site?.content_types?.includes('wishlist') && (
                      <div className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="h-5 w-5 text-amber-500" />
                          <h3 className="font-medium">Ideas & Wishlist</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">Share and vote on ideas</p>
                        <div className="text-sm text-gray-500">No ideas submitted yet</div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {renderFooter()}
    </div>
  );
} 