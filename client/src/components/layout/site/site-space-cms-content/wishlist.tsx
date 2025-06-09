import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/primitives';
import { Button } from '@/components/ui/primitives';
import { Star, Plus, Calendar, ArrowRight, Loader2, RefreshCw, ThumbsUp, MessageCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { getApiBaseUrl } from '@/lib/utils';
import { Badge } from '@/components/ui/primitives';
import { fetchContentData, isSimulatedSpace, getSpaceInfo } from './utils';

interface Space {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cms_type: string;
  hidden: boolean;
  visibility: string;
  site_id: string;
}

interface WishlistItem {
  id: string;
  title: string;
  content: any;
  status: string;
  author_id: string;
  space_id: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  cms_type: string;
  site_id: string;
  wishlist_metadata?: {
    votes: number;
    status: 'submitted' | 'in-progress' | 'completed' | 'planned' | 'rejected';
    priority: 'low' | 'medium' | 'high';
    category?: string;
  };
  comments_count?: number;
  likes_count?: number;
  tags?: string[];
}

interface WishlistContentProps {
  siteSD: string;
  space: Space;
  site: any;
}

// Mock data for wishlist items - only used as fallback if API fails
const MOCK_WISHLIST_ITEMS = [
  {
    id: 'mock-idea-1',
    title: 'Add dark mode support across the platform',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'It would be great to have a dark mode option for better viewing at night and to reduce eye strain.' }]
        }
      ]
    }),
    status: 'published',
    author_id: 'mock-author',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'wishlist',
    site_id: '',
    wishlist_metadata: {
      votes: 42,
      status: 'in-progress' as const,
      priority: 'medium' as const,
      category: 'UI/UX'
    },
    comments_count: 8,
    likes_count: 15
  },
  {
    id: 'mock-idea-2',
    title: 'Implement single sign-on with Google and Microsoft',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Would love to be able to sign in with my Google or Microsoft account instead of creating another username/password.' }]
        }
      ]
    }),
    status: 'published',
    author_id: 'mock-author',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'wishlist',
    site_id: '',
    wishlist_metadata: {
      votes: 78,
      status: 'planned' as const,
      priority: 'high' as const,
      category: 'Authentication'
    },
    comments_count: 12,
    likes_count: 23
  }
];

export function WishlistContent({ siteSD, space, site }: WishlistContentProps) {
  const [, setLocation] = useLocation();
  const [ideas, setIdeas] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  // Get space info for debugging
  const spaceInfo = getSpaceInfo(space);

  // Fetch wishlist/ideas data using the utility function
  const fetchIdeasData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🔍 WishlistContent: Fetching data for space:`, spaceInfo);
      
      const data = await fetchContentData({
        siteId: site.id,
        spaceId: space?.id,
        cmsType: 'wishlist'
      });
      
      if (data.length > 0) {
        setIdeas(data);
        setUseMockData(false);
        console.log(`✅ Successfully loaded ${data.length} wishlist items`);
      } else {
        console.log('📭 No wishlist items found, showing empty state');
        setIdeas([]);
        setUseMockData(false);
      }
    } catch (err) {
      console.error('💥 Error fetching wishlist items:', err);
      setError('Failed to load ideas. Using demo data as a fallback.');
      
      // Fall back to mock data on error
      setIdeas(MOCK_WISHLIST_ITEMS.map(idea => ({
        ...idea,
        space_id: space.id,
        site_id: site.id
      })));
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch ideas when component mounts
  useEffect(() => {
    if (site && space) {
      fetchIdeasData();
    }
  }, [site?.id, space?.id]);

  const handleNewIdea = () => {
    setLocation(`/site/${siteSD}/${space.slug}/create`);
  };

  const handleViewIdea = (ideaId: string) => {
    setLocation(`/site/${siteSD}/${space.slug}/idea/${ideaId}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get excerpt from JSON content
  const getExcerpt = (content: string, maxLength = 150) => {
    try {
      if (!content) return '';
      if (typeof content === 'string' && content.startsWith('{')) {
        const parsedContent = JSON.parse(content);
        const textContent = parsedContent?.content?.[0]?.content?.[0]?.text || '';
        if (textContent.length <= maxLength) return textContent;
        return textContent.substring(0, maxLength) + '...';
      }
      return '';
    } catch (err) {
      return '';
    }
  };

  // Get color for status badge
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'under-review':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="wishlist-container">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mr-2">
            Ideas & Wishlist
          </h2>
          {useMockData && (
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
              Demo Data
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchIdeasData} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleNewIdea}>
            <Plus className="h-4 w-4 mr-2" />
            New Idea
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading ideas...</span>
        </div>
      ) : error ? (
        <Card className="text-center p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={fetchIdeasData}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : ideas.length === 0 ? (
        <Card className="text-center p-6">
          <CardContent className="pt-6">
            <Star className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No Ideas Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Share your ideas and suggestions to help improve our products and services.
            </p>
            <Button onClick={handleNewIdea}>
              <Plus className="h-4 w-4 mr-2" />
              Submit First Idea
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {ideas.map(idea => (
            <Card 
              key={idea.id} 
              className="overflow-hidden transition-all hover:shadow-md dark:hover:shadow-gray-800/30"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer mr-4" onClick={() => handleViewIdea(idea.id)}>
                    {idea.title}
                  </CardTitle>
                  <div className="flex-shrink-0">
                    {idea.wishlist_metadata?.status && (
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(idea.wishlist_metadata.status)}`}>
                        {idea.wishlist_metadata.status.charAt(0).toUpperCase() + idea.wishlist_metadata.status.slice(1).replace('-', ' ')}
                      </span>
                    )}
                  </div>
                </div>
                <CardDescription className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(idea.published_at || idea.created_at)}
                  
                  {idea.wishlist_metadata?.category && (
                    <span className="ml-3 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                      {idea.wishlist_metadata.category}
                    </span>
                  )}
                  
                  {idea.wishlist_metadata?.priority && (
                    <span className="ml-3 text-xs">
                      Priority: {idea.wishlist_metadata.priority.charAt(0).toUpperCase() + idea.wishlist_metadata.priority.slice(1)}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  {getExcerpt(idea.content)}
                </p>
              </CardContent>
              <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    <span>{idea.wishlist_metadata?.votes || idea.likes_count || 0}</span>
                  </div>
                  
                  {idea.comments_count !== undefined && (
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span>{idea.comments_count}</span>
                    </div>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-0 h-auto"
                  onClick={() => handleViewIdea(idea.id)}
                >
                  View Idea <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 