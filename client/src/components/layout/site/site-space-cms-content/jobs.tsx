import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus, Calendar, ArrowRight, Loader2, RefreshCw, MapPin } from 'lucide-react';
import { useLocation } from 'wouter';
import { getApiBaseUrl } from '@/lib/utils';

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

interface JobPost {
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
  job_metadata?: {
    location: string;
    salary_range?: string;
    job_type?: string;  // full-time, part-time, contract, etc.
  };
}

interface JobsContentProps {
  siteSD: string;
  space: Space;
  site: any;
}

// Mock data for job posts - only used as fallback if API fails
const MOCK_JOB_POSTS = [
  {
    id: 'mock-job-1',
    title: 'Senior React Developer',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'We are looking for an experienced React developer to join our growing team. You will be responsible for building and maintaining our frontend applications.' }]
        }
      ]
    }),
    status: 'published',
    author_id: 'mock-author',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'jobs',
    site_id: '',
    job_metadata: {
      location: 'Remote / San Francisco',
      salary_range: '$120,000 - $150,000',
      job_type: 'Full-time'
    }
  },
  {
    id: 'mock-job-2',
    title: 'Product Marketing Manager',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Join our marketing team to help develop and execute marketing strategies for our SaaS products. This role focuses on product positioning, messaging, and go-to-market strategies.' }]
        }
      ]
    }),
    status: 'published',
    author_id: 'mock-author',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'jobs',
    site_id: '',
    job_metadata: {
      location: 'New York, NY',
      salary_range: '$90,000 - $120,000',
      job_type: 'Full-time'
    }
  }
];

export function JobsContent({ siteSD, space, site }: JobsContentProps) {
  const [, setLocation] = useLocation();
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  // Fetch job posts
  const fetchJobsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the API base URL
      const API_BASE = getApiBaseUrl();
      
      // If we don't have site ID or space ID, we can't fetch
      if (!site?.id || !space?.id) {
        throw new Error('Missing site or space information');
      }
      
      console.log(`Fetching job posts for site ${site.id} and space ${space.id}`);
      
      // Use the site ID and space ID to fetch job posts
      const response = await fetch(`${API_BASE}/api/v1/posts/site/${site.id}?cmsType=jobs&spaceId=${space.id}&status=published`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch job posts: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched job posts:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        setJobs(data);
        setUseMockData(false);
      } else {
        console.log('No job posts found, using empty array');
        setJobs([]);
        setUseMockData(false);
      }
    } catch (err) {
      console.error('Error fetching job posts:', err);
      setError('Failed to load job posts. Using demo data as a fallback.');
      
      // Fall back to mock data on error
      setJobs(MOCK_JOB_POSTS.map(job => ({
        ...job,
        space_id: space.id,
        site_id: site.id
      })));
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch job posts when component mounts
  useEffect(() => {
    if (site && space) {
      fetchJobsData();
    }
  }, [site?.id, space?.id]);

  const handleNewJob = () => {
    setLocation(`/site/${siteSD}/${space.slug}/create`);
  };

  const handleViewJob = (jobId: string) => {
    setLocation(`/site/${siteSD}/${space.slug}/job/${jobId}`);
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

  return (
    <div className="jobs-container">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mr-2">
            Job Board
          </h2>
          {useMockData && (
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
              Demo Data
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchJobsData} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleNewJob}>
            <Plus className="h-4 w-4 mr-2" />
            Post Job
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading job listings...</span>
        </div>
      ) : error ? (
        <Card className="text-center p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={fetchJobsData}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : jobs.length === 0 ? (
        <Card className="text-center p-6">
          <CardContent className="pt-6">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No Job Listings Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Post your first job listing to get started.
            </p>
            <Button onClick={handleNewJob}>
              <Plus className="h-4 w-4 mr-2" />
              Post First Job
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <Card 
              key={job.id} 
              className="overflow-hidden transition-all hover:shadow-md dark:hover:shadow-gray-800/30"
            >
              <CardHeader>
                <CardTitle className="text-xl font-medium text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer" onClick={() => handleViewJob(job.id)}>
                  {job.title}
                </CardTitle>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">
                  {job.job_metadata?.location && (
                    <CardDescription className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <MapPin className="h-3 w-3 mr-1" />
                      {job.job_metadata.location}
                    </CardDescription>
                  )}
                  {job.job_metadata?.job_type && (
                    <CardDescription className="text-xs text-gray-500 dark:text-gray-400">
                      {job.job_metadata.job_type}
                    </CardDescription>
                  )}
                  <CardDescription className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    Posted {formatDate(job.published_at || job.created_at)}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  {getExcerpt(job.content)}
                </p>
                {job.job_metadata?.salary_range && (
                  <div className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Salary: {job.job_metadata.salary_range}
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-0 h-auto"
                  onClick={() => handleViewJob(job.id)}
                >
                  View Job <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 