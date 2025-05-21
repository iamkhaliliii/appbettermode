import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Plus, 
  Clock, 
  ThumbsUp, 
  MessageCircle,
  User,
  ChevronDown,
  Filter,
  Search,
  BookmarkPlus,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getApiBaseUrl } from '@/lib/utils';

// Interfaces
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

interface DiscussionPost {
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
  discussion_metadata?: {
    allow_replies: boolean;
    pinned: boolean;
  };
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  comments_count?: number;
  likes_count?: number;
  tags?: string[];
}

interface DiscussionContentProps {
  siteSD: string;
  space: Space;
  site: any;
}

// Mock data for discussions - only used as fallback if API fails
const MOCK_DISCUSSIONS: DiscussionPost[] = [
  {
    id: '1',
    title: 'Getting started with the new platform',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: "I've just joined and I'm wondering what the best way to get started is?" }]
        }
      ]
    }),
    status: 'published',
    author_id: 'user1',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'discussion',
    site_id: '',
    discussion_metadata: {
      allow_replies: true,
      pinned: true
    },
    author: {
      id: 'user1',
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    comments_count: 8,
    likes_count: 24,
    tags: ['Welcome', 'Getting Started']
  },
  {
    id: '2',
    title: 'How do I integrate the API with my existing system?',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Looking for best practices on integrating the REST API with our Node.js backend.' }]
        }
      ]
    }),
    status: 'published',
    author_id: 'user2',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'discussion',
    site_id: '',
    discussion_metadata: {
      allow_replies: true,
      pinned: false
    },
    author: {
      id: 'user2',
      name: 'David Chen',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    comments_count: 12,
    likes_count: 18,
    tags: ['API', 'Integration', 'Technical']
  }
];

export function DiscussionContent({ siteSD, space, site }: DiscussionContentProps) {
  const [, setLocation] = useLocation();
  const [discussions, setDiscussions] = useState<DiscussionPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOption, setFilterOption] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [useMockData, setUseMockData] = useState(false);
  const [attemptedCmsType, setAttemptedCmsType] = useState<string | null>(null);

  // Fetch discussions data
  const fetchDiscussionData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the API base URL
      const API_BASE = getApiBaseUrl();
      
      // If we don't have site ID or space ID, we can't fetch
      if (!site?.id || !space?.id) {
        throw new Error('Missing site or space information');
      }
      
      // Log detailed space information
      console.log('Discussion fetch - Space details:', {
        spaceName: space.name,
        spaceSlug: space.slug,
        spaceCmsType: space.cms_type,
        spaceId: space.id
      });
      
      // Try both forms of cmsType - first try what's in the space.cms_type
      const originalCmsType = space.cms_type || 'discussion';
      setAttemptedCmsType(originalCmsType);
      
      // Build the API URL
      const API_URL = `${API_BASE}/api/v1/posts/site/${site.id}?cmsType=${originalCmsType}&spaceId=${space.id}&status=published`;
      console.log('Discussion fetch - API URL:', API_URL);
      
      // Fetch discussions from the API
      const response = await fetch(API_URL);
      
      console.log('Discussion fetch - Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch discussions: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`Fetched discussions with cmsType=${originalCmsType}:`, data);
      
      // If we got data, use it
      if (Array.isArray(data) && data.length > 0) {
        console.log(`Found ${data.length} discussions with cmsType=${originalCmsType}`);
        
        // Format the data to match our interface
        const formattedDiscussions = data.map((post: any) => {
          console.log('Post details:', {
            id: post.id,
            title: post.title,
            cms_type: post.cms_type,
            space_id: post.space_id
          });
          
          // Enhanced post with additional metadata and defaults
          return {
            ...post,
            author: post.author || {
              id: post.author_id,
              name: 'Anonymous User',
            },
            comments_count: post.comments_count || 0,
            likes_count: post.likes_count || 0,
            tags: post.tags || [],
            discussion_metadata: post.discussion_metadata || {
              allow_replies: true,
              pinned: false
            }
          };
        });
        setDiscussions(formattedDiscussions);
        setUseMockData(false);
      } else {
        // No data found with the original cmsType, try the alternative
        console.log(`No discussions found with cmsType=${originalCmsType}, trying alternative`);
        
        // Try alternative format (if singular, try plural; if plural, try singular)
        const alternativeCmsType = originalCmsType === 'discussion' ? 'discussions' : 'discussion';
        setAttemptedCmsType(alternativeCmsType);
        
        const ALT_API_URL = `${API_BASE}/api/v1/posts/site/${site.id}?cmsType=${alternativeCmsType}&spaceId=${space.id}&status=published`;
        console.log(`Discussion fetch - Trying alternative API URL with cmsType=${alternativeCmsType}:`, ALT_API_URL);
        
        const altResponse = await fetch(ALT_API_URL);
        
        if (!altResponse.ok) {
          throw new Error(`Failed to fetch discussions with alternative cmsType: ${altResponse.statusText}`);
        }
        
        const altData = await altResponse.json();
        console.log(`Fetched discussions with alternative cmsType=${alternativeCmsType}:`, altData);
        
        if (Array.isArray(altData) && altData.length > 0) {
          console.log(`Found ${altData.length} discussions with alternative cmsType=${alternativeCmsType}`);
          
          // Format the data to match our interface
          const formattedDiscussions = altData.map((post: any) => {
            console.log('Post details from alternative cmsType:', {
              id: post.id,
              title: post.title,
              cms_type: post.cms_type,
              space_id: post.space_id
            });
            
            // Enhanced post with additional metadata and defaults
            return {
              ...post,
              author: post.author || {
                id: post.author_id,
                name: 'Anonymous User',
              },
              comments_count: post.comments_count || 0,
              likes_count: post.likes_count || 0,
              tags: post.tags || [],
              discussion_metadata: post.discussion_metadata || {
                allow_replies: true,
                pinned: false
              }
            };
          });
          setDiscussions(formattedDiscussions);
          setUseMockData(false);
        } else {
          console.log('No discussions found with either cmsType, using empty array');
          setDiscussions([]);
          setUseMockData(false);
        }
      }
    } catch (err) {
      console.error('Error fetching discussions:', err);
      setError('Failed to load discussions. Using demo data as a fallback.');
      
      // Fall back to mock data on error
      setDiscussions(MOCK_DISCUSSIONS.map(discussion => ({
        ...discussion,
        space_id: space.id,
        site_id: site.id
      })));
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch discussions when component mounts
  useEffect(() => {
    if (site && space) {
      fetchDiscussionData();
    }
  }, [site?.id, space?.id]);

  // Handle create new discussion
  const handleCreateDiscussion = () => {
    setLocation(`/site/${siteSD}/${space.slug}/create`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Extract content excerpt from JSON content
  const getExcerpt = (content: string, maxLength = 120) => {
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

  return (
    <div className="discussions-container">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search discussions..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-1 flex-1 md:flex-none">
            <Button
              variant={filterOption === 'latest' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilterOption('latest')}
              className="text-xs"
            >
              Latest
            </Button>
            <Button
              variant={filterOption === 'popular' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilterOption('popular')}
              className="text-xs"
            >
              Popular
            </Button>
          </div>
          
          <Button variant="ghost" size="icon" className="border border-gray-200 dark:border-gray-700">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button onClick={handleCreateDiscussion} className="md:w-auto w-full">
            <Plus className="h-4 w-4 mr-2" />
            New Discussion
          </Button>
        </div>
      </div>
      
      {/* Status indicator for mock data */}
      {useMockData && (
        <div className="mb-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-2 text-amber-800 dark:text-amber-400 text-sm flex items-center justify-between">
            <div className="flex items-center">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
              <span>Demo Data</span>
            </div>
            <Button variant="outline" size="sm" onClick={fetchDiscussionData} disabled={isLoading}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          </div>
        </div>
      )}
      
      {/* Debug info for developers */}
      {attemptedCmsType && discussions.length === 0 && !isLoading && !error && (
        <div className="mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-2 text-blue-800 dark:text-blue-400 text-xs flex flex-col">
            <div className="flex items-center">
              <span className="font-mono mr-2">Debug:</span>
              <span>Last attempted cmsType: <strong className="font-mono">{attemptedCmsType}</strong></span>
            </div>
            <div className="mt-1">
              <span className="font-mono mr-2">Space:</span> 
              <span>{space.name} (ID: <span className="font-mono">{space.id}</span>)</span>
            </div>
            <div className="mt-1">
              <span className="font-mono mr-2">Space.cms_type:</span> 
              <span className="font-mono">{space.cms_type || 'undefined'}</span>
            </div>
            <div className="mt-2 p-1 bg-amber-100 dark:bg-amber-900/30 rounded border border-amber-200 dark:border-amber-800">
              <p className="text-amber-800 dark:text-amber-400 text-xs">
                <strong>Note:</strong> If you have discussions in the database but they're not showing up here, 
                check that they have the correct space_id matching this space.
              </p>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-2 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-7"
                  onClick={async () => {
                    try {
                      const API_BASE = getApiBaseUrl();
                      const response = await fetch(`${API_BASE}/api/v1/posts/debug/discussions`);
                      if (!response.ok) throw new Error('Failed to fetch discussions');
                      const data = await response.json();
                      console.table(data);
                      
                      // Get the first discussion post, if any
                      if (data && data.length > 0) {
                        const post = data[0];
                        const message = `Found ${data.length} discussion posts.

The first post is "${post.title}" (ID: ${post.id})
Current space: ${post.space_name} (ID: ${post.space_id})
Target space: ${space.name} (ID: ${space.id})

Would you like to move this post to the current space?`;

                        if (window.confirm(message)) {
                          // Move the post to the current space
                          const updateResponse = await fetch(`${API_BASE}/api/v1/posts/${post.id}`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              space_id: space.id
                            }),
                          });
                          
                          if (updateResponse.ok) {
                            alert('Post moved successfully! Refreshing data...');
                            fetchDiscussionData();
                          } else {
                            alert('Failed to move post. See console for details.');
                            console.error('Failed to move post:', await updateResponse.json());
                          }
                        }
                      } else {
                        alert('No discussion posts found in the database.');
                      }
                    } catch (err) {
                      console.error('Error fetching all discussions:', err);
                      alert('Failed to fetch discussions. See console for details.');
                    }
                  }}
                >
                  View All Discussions
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Loading/Error States */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading discussions...</p>
          </div>
        </div>
      ) : error ? (
        <Card className="text-center p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button 
              variant="outline" 
              onClick={fetchDiscussionData}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : discussions.length === 0 ? (
        <Card className="text-center p-6">
          <CardContent className="pt-6">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No discussions yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Be the first to start a conversation in this space.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={handleCreateDiscussion}>
                <Plus className="h-4 w-4 mr-2" />
                Start Discussion
              </Button>
              {process.env.NODE_ENV === 'development' && (
                <Button variant="outline" onClick={async () => {
                  try {
                    // Get the API base URL
                    const API_BASE = getApiBaseUrl();
                    
                    // Create a test discussion
                    const testPost = {
                      title: "Test Discussion Post",
                      content: JSON.stringify({
                        type: 'doc',
                        content: [
                          {
                            type: 'paragraph',
                            content: [{ type: 'text', text: "This is a test discussion post created for debugging." }]
                          }
                        ]
                      }),
                      status: "published",
                      author_id: site.owner_id, // Use the site owner as the author
                      space_id: space.id,
                      published_at: new Date().toISOString(),
                      cms_type: "discussion", // Hardcode to "discussion" since that's what the database uses
                      site_id: site.id
                    };
                    
                    console.log('Creating test discussion post:', testPost);
                    
                    const response = await fetch(`${API_BASE}/api/v1/posts`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(testPost),
                    });
                    
                    if (!response.ok) {
                      const errorData = await response.json();
                      console.error('Failed to create test discussion:', errorData);
                      throw new Error(`Failed to create test discussion: ${response.statusText}`);
                    }
                    
                    const data = await response.json();
                    console.log('Test discussion created:', data);
                    
                    // Reload discussions
                    fetchDiscussionData();
                  } catch (err) {
                    console.error('Error creating test discussion:', err);
                    alert('Failed to create test discussion. See console for details.');
                  }
                }}>
                  <span className="text-xs">Create Test Post</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        // Discussions List
        <div className="space-y-4">
          {discussions.map((discussion) => (
            <Card 
              key={discussion.id} 
              className={discussion.discussion_metadata?.pinned ? 'border-primary-200 dark:border-primary-900' : ''}
            >
              {discussion.discussion_metadata?.pinned && (
                <div className="bg-primary-50 dark:bg-primary-900/20 px-4 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 flex items-center">
                  <span className="inline-block h-1 w-1 rounded-full bg-primary-600 dark:bg-primary-400 mr-2"></span>
                  Pinned Discussion
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={discussion.author?.avatar} />
                    <AvatarFallback>{(discussion.author?.name || 'User').substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        {discussion.author?.name || 'Anonymous User'}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(discussion.published_at || discussion.created_at)}
                      </span>
                    </div>
                    
                    <h3 
                      className="text-xl font-medium mb-2 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer"
                      onClick={() => setLocation(`/site/${siteSD}/${space.slug}/discussion/${discussion.id}`)}
                    >
                      {discussion.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {getExcerpt(discussion.content)}
                    </p>
                    
                    {discussion.tags && discussion.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {discussion.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <button className="flex items-center hover:text-primary-600 dark:hover:text-primary-400">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {discussion.likes_count || 0}
                      </button>
                      
                      <button 
                        className="flex items-center hover:text-primary-600 dark:hover:text-primary-400"
                        onClick={() => setLocation(`/site/${siteSD}/${space.slug}/discussion/${discussion.id}`)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {discussion.comments_count || 0}
                      </button>
                      
                      <button className="flex items-center hover:text-primary-600 dark:hover:text-primary-400">
                        <BookmarkPlus className="h-4 w-4 mr-1" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Pagination */}
          {discussions.length > 5 && (
            <div className="flex justify-center mt-8">
              <Button variant="outline" className="text-sm">
                Load More
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 