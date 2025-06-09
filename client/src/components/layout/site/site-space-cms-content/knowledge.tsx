import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/primitives';
import { Button } from '@/components/ui/primitives';
import { BookOpen, Plus, Calendar, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { useLocation } from 'wouter';
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

interface Article {
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
  cover_image_url?: string;
}

interface KnowledgeContentProps {
  siteSD: string;
  space: Space;
  site: any;
}

// Mock data for knowledge base articles - only used as fallback if API fails
const MOCK_ARTICLES = [
  {
    id: 'mock-article-1',
    title: 'Getting Started with Our Platform',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Welcome to our platform! This guide will help you get started with the basic features.' }]
        }
      ]
    }),
    status: 'published',
    author_id: 'mock-author',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'knowledge',
    site_id: '',
    cover_image_url: 'https://picsum.photos/seed/mock-article-1/800/600'
  },
  {
    id: 'mock-article-2',
    title: 'Advanced Features Tutorial',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Once you\'re familiar with the basics, explore these advanced features to get the most out of our platform.' }]
        }
      ]
    }),
    status: 'published',
    author_id: 'mock-author',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'knowledge',
    site_id: '',
    cover_image_url: 'https://picsum.photos/seed/mock-article-2/800/600'
  },
  {
    id: 'mock-article-3',
    title: 'Troubleshooting Common Issues',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Encountering issues? Here are solutions to the most common problems users face.' }]
        }
      ]
    }),
    status: 'published',
    author_id: 'mock-author',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'knowledge',
    site_id: '',
    cover_image_url: 'https://picsum.photos/seed/mock-article-3/800/600'
  }
];

export function KnowledgeContent({ siteSD, space, site }: KnowledgeContentProps) {
  const [, setLocation] = useLocation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  // Get space info for debugging
  const spaceInfo = getSpaceInfo(space);

  // Load data function using the utility
  const fetchArticleData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🔍 KnowledgeContent: Fetching data for space:`, spaceInfo);
      
      const data = await fetchContentData({
        siteId: site.id,
        spaceId: space?.id,
        cmsType: 'knowledge'
      });
      
      if (data.length > 0) {
        setArticles(data);
        setUseMockData(false);
        console.log(`✅ Successfully loaded ${data.length} knowledge articles`);
      } else {
        console.log('📭 No knowledge articles found, showing empty state');
        setArticles([]);
        setUseMockData(false);
      }
    } catch (err) {
      console.error('💥 Error fetching knowledge articles:', err);
      setError('Failed to load articles. Using demo data as a fallback.');
      
      // Fall back to mock data on error
      setArticles(MOCK_ARTICLES.map(article => ({
        ...article,
        space_id: space.id,
        site_id: site.id
      })));
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch articles when component mounts
  useEffect(() => {
    if (site && space) {
      fetchArticleData();
    }
  }, [site?.id, space?.id]);

  const handleNewArticle = () => {
    setLocation(`/site/${siteSD}/${space.slug}/create`);
  };

  const handleViewArticle = (articleId: string) => {
    setLocation(`/site/${siteSD}/${space.slug}/article/${articleId}`);
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

  return (
    <div className="knowledge-container">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mr-2">
            Knowledge Base
          </h2>
          {useMockData && (
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
              Demo Data
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchArticleData} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleNewArticle}>
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading articles...</span>
        </div>
      ) : error ? (
        <Card className="text-center p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={fetchArticleData}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : articles.length === 0 ? (
        <Card className="text-center p-6">
          <CardContent className="pt-6">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No Articles Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This knowledge base doesn't have any articles yet.
            </p>
            <Button onClick={handleNewArticle}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Article
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {articles.map(article => (
            <Card 
              key={article.id} 
              className="overflow-hidden transition-all hover:shadow-md dark:hover:shadow-gray-800/30"
            >
              {article.cover_image_url && (
                <div className="w-full h-36 overflow-hidden">
                  <img 
                    src={article.cover_image_url} 
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {article.title}
                </CardTitle>
                <CardDescription className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(article.published_at || article.created_at)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {/* Display a preview of the content - handle different content formats */}
                  {typeof article.content === 'string' && article.content.startsWith('{')
                    ? JSON.parse(article.content)?.content?.[0]?.content?.[0]?.text || 'View this article for details'
                    : 'View this article for details'
                  }
                </p>
              </CardContent>
              <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-3 pb-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-0 h-auto"
                  onClick={() => handleViewArticle(article.id)}
                >
                  Read More <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 