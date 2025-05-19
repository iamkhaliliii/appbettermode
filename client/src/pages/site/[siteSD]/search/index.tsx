import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { SiteLayout } from '@/components/layout/site/site-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, HelpCircle, Star, Search as SearchIcon, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { sitesApi } from '@/lib/api';

// Mock search results for different content types
const MOCK_SEARCH_RESULTS = {
  all: [],
  discussions: [
    {
      id: 1,
      title: "How do I create a playlist with songs from different artists?",
      content: "I'm trying to create a playlist that combines songs from various artists but I'm having trouble finding an efficient way to do this. Any suggestions?",
      author: {
        name: "JaneDoe",
        avatar: "https://i.pravatar.cc/150?img=1"
      },
      type: "discussion",
      replies: 12,
      views: 340,
      likes: 28,
      tags: ["playlists", "help", "music"],
      createdAt: "2 days ago"
    },
    {
      id: 2,
      title: "Feature request: Add ability to see lyrics automatically",
      content: "It would be amazing if we could automatically see lyrics synced with songs as they play. Would make singing along so much easier!",
      author: {
        name: "MusicLover42",
        avatar: "https://i.pravatar.cc/150?img=2"
      },
      type: "discussion",
      replies: 25,
      views: 512,
      likes: 96,
      tags: ["feature", "lyrics", "suggestion"],
      createdAt: "5 days ago"
    }
  ],
  qa: [
    {
      id: 1,
      title: "How can I share my playlists with friends who don't have accounts?",
      content: "I've created some great playlists and want to share them with friends who don't have accounts. What's the easiest way to do this?",
      author: {
        name: "PlaylistMaker",
        avatar: "https://i.pravatar.cc/150?img=5"
      },
      type: "qa",
      answers: 4,
      views: 256,
      upvotes: 18,
      solved: true,
      tags: ["sharing", "playlists", "help"],
      createdAt: "3 days ago"
    }
  ],
  wishlist: [
    {
      id: 1,
      title: "Add lyrics sync for karaoke mode",
      description: "Would love to see a karaoke mode where lyrics are highlighted in real-time as the song plays. This would make sing-alongs much more fun!",
      author: {
        name: "KaraokeFan",
        avatar: "https://i.pravatar.cc/150?img=11"
      },
      type: "wishlist",
      status: "Under review",
      upvotes: 285,
      comments: 32,
      tags: ["feature", "lyrics", "playback", "popular"],
      createdAt: "2 months ago"
    }
  ],
  events: [
    {
      id: 1,
      title: "New Feature Showcase",
      description: "Join us for a live showcase of our newest features. We'll demo the updated equalizer and answer your questions.",
      type: "event",
      date: "Jun 15, 2025",
      time: "3:00 PM",
      attendees: 87
    }
  ]
};

export default function SearchPage() {
  const params = useParams();
  const siteSD = params?.siteSD || '';
  const [location] = useLocation();
  const [site, setSite] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Extract query parameter from URL
  const urlParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  );
  const queryParam = urlParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState('all');
  const [searchResults, setSearchResults] = useState<any>(MOCK_SEARCH_RESULTS);

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

  useEffect(() => {
    // In a real implementation, this would be an API call to search for results
    const performSearch = () => {
      if (!searchQuery.trim()) {
        setSearchResults({
          all: [],
          discussions: [],
          qa: [],
          wishlist: [],
          events: []
        });
        return;
      }
      
      // For the mock implementation, we'll just use the prepared results
      // and prepopulate the "all" tab with all results combined
      const allResults = [
        ...MOCK_SEARCH_RESULTS.discussions,
        ...MOCK_SEARCH_RESULTS.qa,
        ...MOCK_SEARCH_RESULTS.wishlist,
        ...MOCK_SEARCH_RESULTS.events
      ];
      
      setSearchResults({
        ...MOCK_SEARCH_RESULTS,
        all: allResults
      });
    };
    
    performSearch();
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL query parameter
    const newUrl = `${window.location.pathname}?q=${encodeURIComponent(searchQuery)}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const getResultCount = (type: string) => {
    return searchResults[type]?.length || 0;
  };

  const getTotalResultCount = () => {
    return Object.keys(searchResults)
      .filter(key => key !== 'all')
      .reduce((total, key) => total + getResultCount(key), 0);
  };

  // If no siteSD is provided, show an error
  if (!siteSD) {
    return <div>Site identifier is missing</div>;
  }

  return (
    <SiteLayout siteSD={siteSD}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">Search</h1>
          
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search discussions, questions, ideas, and more..."
                className="pl-10 py-6 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                Search
              </Button>
            </div>
          </form>
        </div>

        {searchQuery && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-medium text-gray-900 dark:text-white">
                {getTotalResultCount()} results for "{searchQuery}"
              </h2>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
              <TabsList className="w-full justify-start border-b">
                <TabsTrigger value="all" className="px-4">
                  All ({getResultCount('all')})
                </TabsTrigger>
                <TabsTrigger value="discussions" className="px-4">
                  Discussions ({getResultCount('discussions')})
                </TabsTrigger>
                <TabsTrigger value="qa" className="px-4">
                  Q&A ({getResultCount('qa')})
                </TabsTrigger>
                <TabsTrigger value="wishlist" className="px-4">
                  Wishlist ({getResultCount('wishlist')})
                </TabsTrigger>
                <TabsTrigger value="events" className="px-4">
                  Events ({getResultCount('events')})
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="all" className="space-y-4">
                  {searchResults.all.map((result: any, index: number) => (
                    <SearchResultCard key={`${result.type}-${result.id}`} result={result} siteSD={siteSD} />
                  ))}
                  {searchResults.all.length === 0 && (
                    <EmptyResults />
                  )}
                </TabsContent>

                <TabsContent value="discussions" className="space-y-4">
                  {searchResults.discussions.map((result: any) => (
                    <SearchResultCard key={`discussion-${result.id}`} result={result} siteSD={siteSD} />
                  ))}
                  {searchResults.discussions.length === 0 && (
                    <EmptyResults />
                  )}
                </TabsContent>

                <TabsContent value="qa" className="space-y-4">
                  {searchResults.qa.map((result: any) => (
                    <SearchResultCard key={`qa-${result.id}`} result={result} siteSD={siteSD} />
                  ))}
                  {searchResults.qa.length === 0 && (
                    <EmptyResults />
                  )}
                </TabsContent>

                <TabsContent value="wishlist" className="space-y-4">
                  {searchResults.wishlist.map((result: any) => (
                    <SearchResultCard key={`wishlist-${result.id}`} result={result} siteSD={siteSD} />
                  ))}
                  {searchResults.wishlist.length === 0 && (
                    <EmptyResults />
                  )}
                </TabsContent>

                <TabsContent value="events" className="space-y-4">
                  {searchResults.events.map((result: any) => (
                    <SearchResultCard key={`event-${result.id}`} result={result} siteSD={siteSD} />
                  ))}
                  {searchResults.events.length === 0 && (
                    <EmptyResults />
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </>
        )}
      </div>
    </SiteLayout>
  );
}

interface SearchResultCardProps {
  result: any;
  siteSD: string;
}

function SearchResultCard({ result, siteSD }: SearchResultCardProps) {
  const getTypeIcon = () => {
    switch(result.type) {
      case 'discussion':
        return <MessageSquare className="h-5 w-5 text-indigo-500" />;
      case 'qa':
        return <HelpCircle className="h-5 w-5 text-blue-500" />;
      case 'wishlist':
        return <Star className="h-5 w-5 text-amber-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-green-500" />;
      default:
        return <SearchIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getResultLink = () => {
    switch(result.type) {
      case 'discussion':
        return `/site/${siteSD}/discussion/${result.id}`;
      case 'qa':
        return `/site/${siteSD}/qa/${result.id}`;
      case 'wishlist':
        return `/site/${siteSD}/wishlist/${result.id}`;
      case 'event':
        return `/site/${siteSD}/events/${result.id}`;
      default:
        return '#';
    }
  };

  const getTypeLabel = () => {
    switch(result.type) {
      case 'discussion':
        return 'Discussion';
      case 'qa':
        return 'Q&A';
      case 'wishlist':
        return 'Feature Request';
      case 'event':
        return 'Event';
      default:
        return 'Result';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          {getTypeIcon()}
          <Badge variant="outline">{getTypeLabel()}</Badge>
          {result.solved && (
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800/50">
              Solved
            </Badge>
          )}
          {result.status && (
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800/50">
              {result.status}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl">
          <a 
            href={getResultLink()} 
            className="hover:text-primary-600 dark:hover:text-primary-500 transition-colors"
          >
            {result.title}
          </a>
        </CardTitle>
        {result.type === 'event' && (
          <CardDescription>
            {result.date} • {result.time} • {result.attendees} Attendees
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 mb-3">
          {result.content || result.description}
        </p>
        
        {result.tags && result.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {result.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {result.author && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={result.author.avatar} alt={result.author.name} />
              <AvatarFallback>{result.author.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span>{result.author.name}</span>
            <span className="mx-2">•</span>
            <span>{result.createdAt}</span>
            
            {result.type === 'discussion' && (
              <>
                <span className="mx-2">•</span>
                <span>{result.replies} replies</span>
              </>
            )}
            
            {result.type === 'qa' && (
              <>
                <span className="mx-2">•</span>
                <span>{result.answers} answers</span>
              </>
            )}
            
            {result.type === 'wishlist' && (
              <>
                <span className="mx-2">•</span>
                <span>{result.upvotes} votes</span>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyResults() {
  return (
    <div className="text-center py-12">
      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
      <p className="text-gray-600 dark:text-gray-400">
        Try adjusting your search or filters to find what you're looking for.
      </p>
    </div>
  );
} 