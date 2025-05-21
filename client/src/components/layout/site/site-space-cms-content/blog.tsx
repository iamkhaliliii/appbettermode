import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus, Calendar, ArrowRight, Clock, ChevronDown, Filter, Tag, LayoutGrid, Database } from 'lucide-react';
import { useLocation } from 'wouter';
import { getApiBaseUrl } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel 
} from '@/components/ui/dropdown-menu';
import { 
  BlogPostForDisplay, 
  BlogLayoutType, 
  BLOG_LAYOUTS,
  DefaultGridLayout,
  ModernThreeColumnLayout,
  SingleColumnLayout,
  CardLayout 
} from './blog-layouts';

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

interface BlogPost {
  id: string;
  title: string;
  content: any;
  status: string;
  author_id: string;
  author?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  space_id: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  cms_type: string;
  site_id: string;
  cover_image_url?: string;
  tags?: string[];
  view_count?: number;
  pinned?: boolean;
  // Any other fields from the API will still be available in the raw data
}

interface BlogContentProps {
  siteSD: string;
  space: Space;
  site: any;
}

// Database Field Display Component
const DatabaseFieldsPanel: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="mt-8 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
      <div className="p-4 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-t-lg">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <Database className="w-4 h-4 mr-2" /> Database Fields
        </h3>
      </div>
      <div className="p-4 overflow-auto max-h-[500px]">
        <pre className="text-xs text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export function BlogContent({ siteSD, space, site }: BlogContentProps) {
  const [, setLocation] = useLocation();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [layoutType, setLayoutType] = useState<BlogLayoutType>('default');
  const [showDatabaseFields, setShowDatabaseFields] = useState(false);
  const [rawApiData, setRawApiData] = useState<any>(null);

  // Fetch blog posts
  const fetchBlogData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the API base URL
      const API_BASE = getApiBaseUrl();
      
      // If we don't have site ID or space ID, we can't fetch
      if (!site?.id || !space?.id) {
        throw new Error('Missing site or space information');
      }
      
      console.log(`Fetching blog posts for site ${site.id} and space ${space.id}`);
      
      // Use the site ID and space ID to fetch blog posts
      // Include the pinned field in the request
      const response = await fetch(`${API_BASE}/api/v1/posts/site/${site.id}?cmsType=blog&spaceId=${space.id}&status=published&includeFields=pinned`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Store raw API data for the database fields view
      setRawApiData(data);
      
      if (Array.isArray(data) && data.length > 0) {
        // Ensure pinned is properly handled as boolean
        const postsWithPinned = data.map(post => ({
          ...post,
          pinned: post.pinned === true || post.pinned === 'true'
        }));
        
        setPosts(postsWithPinned);
        console.log('Blog posts loaded with pinned status:', postsWithPinned);
      } else {
        console.log('No blog posts found, using empty array');
        setPosts([]);
      }
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts.');
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch blog posts when component mounts
  useEffect(() => {
    if (site && space) {
      fetchBlogData();
    }
  }, [site?.id, space?.id]);

  const handleNewPost = () => {
    setLocation(`/site/${siteSD}/${space.slug}/create`);
  };

  const handleViewPost = (postId: string) => {
    setLocation(`/site/${siteSD}/${space.slug}/post/${postId}`);
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

  // Get author's initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').map(word => word[0]?.toUpperCase() || '').join('').substring(0, 2);
  };

  // Estimate read time based on content length (very approximate)
  const getReadTime = (content: string) => {
    try {
      if (!content) return 1;
      const parsedContent = JSON.parse(content);
      const textContent = JSON.stringify(parsedContent);
      const words = textContent.split(/\s+/).length;
      const minutes = Math.max(1, Math.round(words / 200)); // Assuming 200 words per minute reading speed
      return minutes;
    } catch (err) {
      return 1; // Default to 1 minute
    }
  };

  // Get all unique tags from posts
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [posts]);

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let result = [...posts];
    
    // Apply tag filter
    if (activeTag) {
      result = result.filter(post => post.tags?.includes(activeTag));
    }
    
    // Apply sorting
    result.sort((a, b) => {
      // First prioritize pinned posts
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      // Then sort by date
      const dateA = new Date(a.published_at || a.created_at).getTime();
      const dateB = new Date(b.published_at || b.created_at).getTime();
      
      if (sortOrder === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
    
    return result;
  }, [posts, activeTag, sortOrder]);

  // Transform blog posts to display format
  const displayPosts: BlogPostForDisplay[] = useMemo(() => {
    return filteredAndSortedPosts.map(post => ({
      ...post,
      excerpt: getExcerpt(post.content, 180),
      readTime: getReadTime(post.content)
    }));
  }, [filteredAndSortedPosts]);

  // Layout component selection based on current layout type
  const SelectedLayout = useMemo(() => {
    const layoutConfig = BLOG_LAYOUTS.find(layout => layout.id === layoutType);
    return layoutConfig?.component || DefaultGridLayout;
  }, [layoutType]);

  return (
    <div className="blog-container space-y-6">
      {/* Header with controls */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Blog
          </h2>
          <div className="flex items-center gap-2">
            {/* Database Fields Toggle */}
            <Button 
              variant="outline" 
              size="sm" 
              className={`flex items-center gap-1 ${showDatabaseFields ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400 border-primary-300 dark:border-primary-700' : ''}`}
              onClick={() => setShowDatabaseFields(!showDatabaseFields)}
            >
              <Database className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">DB Fields</span>
            </Button>

            {/* Layout Selector Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Layout</span>
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Select Layout</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {BLOG_LAYOUTS.map(layout => (
                  <DropdownMenuItem 
                    key={layout.id}
                    className={layoutType === layout.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
                    onClick={() => setLayoutType(layout.id as BlogLayoutType)}
                  >
                    {layout.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Order Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
                  <ChevronDown className="h-3.5 w-3.5 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className={sortOrder === 'newest' ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
                  onClick={() => setSortOrder('newest')}
                >
                  Newest
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className={sortOrder === 'oldest' ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
                  onClick={() => setSortOrder('oldest')}
                >
                  Oldest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              onClick={handleNewPost}
              className="bg-primary-600 hover:bg-primary-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" /> New Post
            </Button>
          </div>
        </div>

        {/* Simple tag filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center">
            {activeTag && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={() => setActiveTag(null)}
              >
                Clear
              </Button>
            )}
            {allTags.slice(0, 8).map(tag => (
              <Badge 
                key={tag}
                variant="outline"
                className={`cursor-pointer text-xs ${
                  activeTag === tag 
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300 border-primary-300 dark:border-primary-700' 
                    : 'bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
            {allTags.length > 8 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Badge variant="outline" className="cursor-pointer text-xs">
                    +{allTags.length - 8} more
                  </Badge>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {allTags.slice(8).map(tag => (
                    <DropdownMenuItem 
                      key={tag} 
                      onClick={() => setActiveTag(tag)}
                    >
                      {tag}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>
      
      {/* Database Fields Debug Panel */}
      {showDatabaseFields && rawApiData && (
        <DatabaseFieldsPanel data={rawApiData} />
      )}
      
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="w-full h-48" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="text-center p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
          </CardContent>
        </Card>
      ) : filteredAndSortedPosts.length === 0 ? (
        <Card className="text-center p-6 border border-dashed">
          <CardContent className="pt-6">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No Blog Posts</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
              {activeTag ? `No posts found with tag "${activeTag}".` : "Share news, updates, and articles with your audience by creating your first blog post."}
            </p>
            {activeTag ? (
              <Button 
                onClick={() => setActiveTag(null)}
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                Clear Filter
              </Button>
            ) : (
              <Button 
                onClick={handleNewPost}
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Post
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <SelectedLayout 
          posts={displayPosts} 
          handleViewPost={handleViewPost} 
          onTagClick={setActiveTag}
          activeTag={activeTag}
          formatDate={formatDate}
          getInitials={getInitials}
        />
      )}
    </div>
  );
} 