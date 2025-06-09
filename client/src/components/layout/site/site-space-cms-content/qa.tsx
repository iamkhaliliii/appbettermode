import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/primitives';
import { Button } from '@/components/ui/primitives';
import {
  HelpCircle,
  Plus,
  Clock,
  ThumbsUp,
  MessageCircle,
  CheckCircle,
  ChevronDown,
  Filter,
  Search,
  BookmarkPlus,
  ArrowUp,
  Eye,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/primitives';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/primitives';
import { Badge } from '@/components/ui/primitives';
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

interface QAQuestion {
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
  qa_metadata?: {
    solved: boolean;
    votes: number;
    views: number;
  };
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  comments_count?: number;
  tags?: string[];
}

interface QaContentProps {
  siteSD: string;
  space: Space;
  site: any;
}

// Mock data for Q&A questions - only used as fallback if API fails
const MOCK_QUESTIONS: QAQuestion[] = [
  {
    id: 'mock-qa-1',
    title: 'How do I set up two-factor authentication?',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: "I want to secure my account better. What's the process for enabling 2FA?" }]
        }
      ]
    }),
    status: 'published',
    author_id: 'user1',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'qa',
    site_id: '',
    qa_metadata: {
      solved: true,
      votes: 18,
      views: 124
    },
    author: {
      id: 'user1',
      name: 'Alex Morgan',
      avatar: 'https://i.pravatar.cc/150?img=4'
    },
    comments_count: 3,
    tags: ['Security', 'Authentication']
  },
  {
    id: 'mock-qa-2',
    title: 'What are the hardware requirements for the desktop app?',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: "I'm trying to run the desktop app but it's very slow. What specs do I need?" }]
        }
      ]
    }),
    status: 'published',
    author_id: 'user2',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'qa',
    site_id: '',
    qa_metadata: {
      solved: false,
      votes: 12,
      views: 89
    },
    author: {
      id: 'user2',
      name: 'Jamie Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    comments_count: 2,
    tags: ['Desktop App', 'Performance', 'Hardware']
  }
];

export function QaContent({ siteSD, space, site }: QaContentProps) {
  const [, setLocation] = useLocation();
  const [questions, setQuestions] = useState<QAQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOption, setFilterOption] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [useMockData, setUseMockData] = useState(false);

  // Fetch Q&A data
  const fetchQAData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the API base URL
      const API_BASE = getApiBaseUrl();
      
      // If we don't have site ID or space ID, we can't fetch
      if (!site?.id || !space?.id) {
        throw new Error('Missing site or space information');
      }
      
      console.log(`Fetching Q&A questions for site ${site.id} and space ${space.id}`);
      
      // Use the site ID and space ID to fetch Q&A questions
      const response = await fetch(`${API_BASE}/api/v1/posts/site/${site.id}?cmsType=qa&spaceId=${space.id}&status=published`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Q&A questions: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched Q&A questions:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        // Format the data to match our interface
        const formattedQuestions = data.map((post: any) => {
          // Enhanced post with additional metadata and defaults
          return {
            ...post,
            author: post.author || {
              id: post.author_id,
              name: 'Anonymous User',
            },
            comments_count: post.comments_count || 0,
            tags: post.tags || [],
            qa_metadata: post.qa_metadata || {
              solved: false,
              votes: 0,
              views: 0
            }
          };
        });
        setQuestions(formattedQuestions);
        setUseMockData(false);
      } else {
        console.log('No Q&A questions found, using empty array');
        setQuestions([]);
        setUseMockData(false);
      }
    } catch (err) {
      console.error('Error fetching Q&A questions:', err);
      setError('Failed to load questions. Using demo data as a fallback.');
      
      // Fall back to mock data on error
      setQuestions(MOCK_QUESTIONS.map(question => ({
        ...question,
        space_id: space.id,
        site_id: site.id
      })));
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch questions when component mounts
  useEffect(() => {
    if (site && space) {
      fetchQAData();
    }
  }, [site?.id, space?.id]);

  // Handle ask new question
  const handleAskQuestion = () => {
    setLocation(`/site/${siteSD}/${space.slug}/ask`);
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

  return (
    <div className="qa-container">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search questions..."
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
            <Button
              variant={filterOption === 'unsolved' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilterOption('unsolved')}
              className="text-xs"
            >
              Unsolved
            </Button>
          </div>
          
          <Button variant="ghost" size="icon" className="border border-gray-200 dark:border-gray-700">
            <Filter className="h-4 w-4" />
          </Button>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={fetchQAData} disabled={isLoading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleAskQuestion} className="md:w-auto w-full">
              <Plus className="h-4 w-4 mr-2" />
              Ask Question
            </Button>
          </div>
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
            <Button variant="outline" size="sm" onClick={fetchQAData} disabled={isLoading}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Try Again
            </Button>
          </div>
        </div>
      )}
      
      {/* Loading/Error States */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading questions...</p>
          </div>
        </div>
      ) : error ? (
        <Card className="text-center p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <Button 
              variant="outline" 
              onClick={fetchQAData}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : questions.length === 0 ? (
        <Card className="text-center p-6">
          <CardContent className="pt-6">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No questions yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Be the first to ask a question in this space.
            </p>
            <Button onClick={handleAskQuestion}>
              <Plus className="h-4 w-4 mr-2" />
              Ask Question
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Questions List
        <div className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id} className={question.qa_metadata?.solved ? 'border-green-200 dark:border-green-900' : ''}>
              {question.qa_metadata?.solved && (
                <div className="bg-green-50 dark:bg-green-900/20 px-4 py-1 text-xs font-medium text-green-600 dark:text-green-400 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-2" />
                  Solved Question
                </div>
              )}
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center space-y-2 w-14">
                    <button className="flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                      <ArrowUp className="h-5 w-5" />
                      <span className="font-medium mt-1">{question.qa_metadata?.votes || 0}</span>
                    </button>
                    <div className="flex flex-col items-center text-gray-500 dark:text-gray-400 text-xs">
                      <Eye className="h-4 w-4 mb-1" />
                      <span>{question.qa_metadata?.views || 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={question.author?.avatar} />
                        <AvatarFallback>{(question.author?.name || 'User').substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        {question.author?.name || 'Anonymous User'}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(question.published_at || question.created_at)}
                      </span>
                    </div>
                    
                    <h3 
                      className="text-xl font-medium mb-2 text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer"
                      onClick={() => setLocation(`/site/${siteSD}/${space.slug}/question/${question.id}`)}
                    >
                      {question.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {getExcerpt(question.content)}
                    </p>
                    
                    {question.tags && question.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {question.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        <span>
                          {question.comments_count || 0} {(question.comments_count || 0) === 1 ? 'answer' : 'answers'}
                        </span>
                      </div>
                      
                      <button 
                        className="flex items-center hover:text-primary-600 dark:hover:text-primary-400"
                        onClick={() => setLocation(`/site/${siteSD}/${space.slug}/question/${question.id}`)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Answer
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
        </div>
      )}
    </div>
  );
} 