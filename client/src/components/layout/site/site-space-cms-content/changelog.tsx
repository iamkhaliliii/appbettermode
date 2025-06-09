import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/primitives';
import { Button } from '@/components/ui/primitives';
import { Clock, Plus, Calendar, RefreshCw, Loader2, Package, Bug, Zap, Shield } from 'lucide-react';
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

interface ChangelogEntry {
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
  tags?: string[];
}

interface ChangelogContentProps {
  siteSD: string;
  space: Space;
  site: any;
}

// Mock data for changelog entries - only used as fallback if API fails
const MOCK_CHANGELOG_ENTRIES = [
  {
    id: 'mock-changelog-1',
    title: 'Version 2.1.0 - Major Updates',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'This major release introduces new features and improvements to enhance your experience.' }]
        }
      ]
    }),
    status: 'published',
    author_id: 'mock-author',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'changelog',
    site_id: '',
    tags: ['major', 'features']
  },
  {
    id: 'mock-changelog-2',
    title: 'Version 2.0.5 - Bug Fixes',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Several bug fixes and performance improvements included in this release.' }]
        }
      ]
    }),
    status: 'published',
    author_id: 'mock-author',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'changelog',
    site_id: '',
    tags: ['bugfix', 'improvements']
  }
];

export function ChangelogContent({ siteSD, space, site }: ChangelogContentProps) {
  const [, setLocation] = useLocation();
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  // Get space info for debugging
  const spaceInfo = getSpaceInfo(space);

  // Fetch changelog entries using the utility function
  const fetchChangelogData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🔍 ChangelogContent: Fetching data for space:`, spaceInfo);
      
      const data = await fetchContentData({
        siteId: site.id,
        spaceId: space?.id,
        cmsType: 'changelog'
      });
      
      if (data.length > 0) {
        setEntries(data);
        setUseMockData(false);
        console.log(`✅ Successfully loaded ${data.length} changelog entries`);
      } else {
        console.log('📭 No changelog entries found, showing empty state');
        setEntries([]);
        setUseMockData(false);
      }
    } catch (err) {
      console.error('💥 Error fetching changelog entries:', err);
      setError('Failed to load changelog entries. Using demo data as a fallback.');
      
      // Fall back to mock data on error
      setEntries(MOCK_CHANGELOG_ENTRIES.map(entry => ({
        ...entry,
        space_id: space.id,
        site_id: site.id
      })));
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch changelog entries when component mounts
  useEffect(() => {
    if (site && space) {
      fetchChangelogData();
    }
  }, [site?.id, space?.id]);

  const handleNewEntry = () => {
    setLocation(`/site/${siteSD}/${space.slug}/create`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get excerpt from JSON content
  const getExcerpt = (content: string, maxLength = 200) => {
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

  // Get icon based on entry type/title
  const getEntryIcon = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('security') || titleLower.includes('fix')) {
      return <Shield className="h-5 w-5 text-green-600" />;
    } else if (titleLower.includes('bug') || titleLower.includes('fix')) {
      return <Bug className="h-5 w-5 text-red-600" />;
    } else if (titleLower.includes('performance') || titleLower.includes('improvement')) {
      return <Zap className="h-5 w-5 text-yellow-600" />;
    } else {
      return <Package className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <div className="changelog-container">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mr-2">
            Changelog
          </h2>
          {useMockData && (
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
              Demo Data
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchChangelogData} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleNewEntry}>
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading changelog...</span>
        </div>
      ) : error ? (
        <Card className="text-center p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={fetchChangelogData}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : entries.length === 0 ? (
        <Card className="text-center p-6">
          <CardContent className="pt-6">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No Changelog Entries Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start documenting your updates and changes.
            </p>
            <Button onClick={handleNewEntry}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Entry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {entries.map((entry, index) => (
            <Card 
              key={entry.id} 
              className="overflow-hidden transition-all hover:shadow-md dark:hover:shadow-gray-800/30"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {getEntryIcon(entry.title)}
                    <div>
                      <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        {entry.title}
                      </CardTitle>
                      <CardDescription className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(entry.published_at || entry.created_at)}
                      </CardDescription>
                    </div>
                  </div>
                  {index === 0 && (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                      Latest
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {getExcerpt(entry.content)}
                </p>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {entry.tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 