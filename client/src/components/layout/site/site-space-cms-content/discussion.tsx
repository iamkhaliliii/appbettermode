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
  BookmarkPlus
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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
  excerpt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isPinned: boolean;
  tags: string[];
}

interface DiscussionContentProps {
  siteSD: string;
  space: Space;
  site: any;
}

export function DiscussionContent({ siteSD, space, site }: DiscussionContentProps) {
  const [, setLocation] = useLocation();
  const [discussions, setDiscussions] = useState<DiscussionPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOption, setFilterOption] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');

  // Simulate fetching discussions
  useEffect(() => {
    const fetchDiscussions = async () => {
      setIsLoading(true);
      
      try {
        // This would be replaced with a real API call
        // const data = await fetch(`/api/v1/sites/${site.id}/spaces/${space.id}/discussions`).then(res => res.json());
        
        // Simulate API response
        setTimeout(() => {
          const mockDiscussions: DiscussionPost[] = [
            {
              id: '1',
              title: 'Getting started with the new platform',
              excerpt: "I've just joined and I'm wondering what the best way to get started is?",
              author: {
                id: 'user1',
                name: 'Sarah Johnson',
                avatar: 'https://i.pravatar.cc/150?img=1'
              },
              createdAt: '2025-05-15T10:30:00Z',
              updatedAt: '2025-05-15T10:30:00Z',
              likes: 24,
              comments: 8,
              isLiked: false,
              isPinned: true,
              tags: ['Welcome', 'Getting Started']
            },
            {
              id: '2',
              title: 'How do I integrate the API with my existing system?',
              excerpt: 'Looking for best practices on integrating the REST API with our Node.js backend.',
              author: {
                id: 'user2',
                name: 'David Chen',
                avatar: 'https://i.pravatar.cc/150?img=2'
              },
              createdAt: '2025-05-14T08:45:00Z',
              updatedAt: '2025-05-15T09:15:00Z',
              likes: 18,
              comments: 12,
              isLiked: true,
              isPinned: false,
              tags: ['API', 'Integration', 'Technical']
            },
            {
              id: '3',
              title: 'Feedback on new dashboard interface',
              excerpt: 'The new dashboard looks great but I have some suggestions for improving the UX...',
              author: {
                id: 'user3',
                name: 'Miguel Sanchez',
                avatar: 'https://i.pravatar.cc/150?img=3'
              },
              createdAt: '2025-05-13T15:20:00Z',
              updatedAt: '2025-05-13T15:20:00Z',
              likes: 42,
              comments: 16,
              isLiked: false,
              isPinned: false,
              tags: ['Feedback', 'UI/UX', 'Dashboard']
            }
          ];
          
          setDiscussions(mockDiscussions);
          setIsLoading(false);
        }, 800);
      } catch (err) {
        console.error('Error fetching discussions:', err);
        setError('Failed to load discussions. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchDiscussions();
  }, [site.id, space.id]);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mb-4 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading discussions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

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
      
      {/* Discussions List */}
      <div className="space-y-4">
        {discussions.length === 0 ? (
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">No discussions yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Be the first to start a conversation in this space.
              </p>
              <Button onClick={handleCreateDiscussion}>
                <Plus className="h-4 w-4 mr-2" />
                Start Discussion
              </Button>
            </CardContent>
          </Card>
        ) : (
          discussions.map((discussion) => (
            <Card key={discussion.id} className={discussion.isPinned ? 'border-primary-200 dark:border-primary-900' : ''}>
              {discussion.isPinned && (
                <div className="bg-primary-50 dark:bg-primary-900/20 px-4 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 flex items-center">
                  <span className="inline-block h-1 w-1 rounded-full bg-primary-600 dark:bg-primary-400 mr-2"></span>
                  Pinned Discussion
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={discussion.author.avatar} />
                    <AvatarFallback>{discussion.author.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        {discussion.author.name}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(discussion.createdAt)}
                      </span>
                    </div>
                    
                    <h3 
                      className="text-xl font-medium mb-2 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer"
                      onClick={() => setLocation(`/site/${siteSD}/${space.slug}/discussion/${discussion.id}`)}
                    >
                      {discussion.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {discussion.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {discussion.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <button 
                        className={`flex items-center ${discussion.isLiked ? 'text-primary-600 dark:text-primary-400' : ''} hover:text-primary-600 dark:hover:text-primary-400`}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {discussion.likes}
                      </button>
                      
                      <button 
                        className="flex items-center hover:text-primary-600 dark:hover:text-primary-400"
                        onClick={() => setLocation(`/site/${siteSD}/${space.slug}/discussion/${discussion.id}`)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {discussion.comments}
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
          ))
        )}
      </div>
      
      {/* Pagination */}
      {discussions.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="text-sm">
            Load More
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
} 