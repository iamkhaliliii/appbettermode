import { useState, useEffect } from 'react';
import { Post, SpaceData, StatusCounts } from './types';
import { getApiBaseUrl, mapPostData } from './utils';
import { MOCK_DATA } from './mock-data';

export function useContentData(siteDetails: any) {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts data from API
  const fetchPosts = async () => {
    // We need to use siteDetails.id (UUID) instead of siteId (subdomain)
    if (!siteDetails?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the API base URL
      const API_BASE = getApiBaseUrl();
      
      // Build API URL to fetch ALL posts for this site
      let url = `${API_BASE}/api/v1/posts/site/${siteDetails.id}?limit=100`;
      
      console.log(`Fetching all posts from: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Failed to fetch posts (${response.status}): ${errorText}`);
      }
      
      let rawData;
      try {
        rawData = await response.json();
        console.log('Fetched posts:', rawData);
      } catch (err: unknown) {
        throw new Error(`Failed to parse response as JSON: ${err instanceof Error ? err.message : String(err)}`);
      }
      
      if (Array.isArray(rawData) && rawData.length > 0) {
        // Fetch spaces for this site
        let spacesMap = new Map<string, SpaceData>();
        try {
          const spacesResponse = await fetch(`${API_BASE}/api/v1/sites/${siteDetails.id}/spaces`);
          
          if (spacesResponse.ok) {
            const spacesData = await spacesResponse.json();
            spacesMap = new Map(spacesData.map((space: SpaceData) => [space.id, space]));
          }
        } catch (err) {
          console.error('Error fetching spaces:', err);
        }

        // Collect all unique author IDs
        const uniqueAuthorIds: string[] = [];
        rawData.forEach(post => {
          if (post.author_id && !uniqueAuthorIds.includes(post.author_id)) {
            uniqueAuthorIds.push(post.author_id);
          }
        });
        
        // Create a map to store author data
        const authorsMap = new Map();
        
        // Fetch author details for each author ID
        await Promise.all(uniqueAuthorIds.map(async (authorId) => {
          try {
            const authorResponse = await fetch(`${API_BASE}/api/v1/users/${authorId}`);
            if (authorResponse.ok) {
              const authorData = await authorResponse.json();
              authorsMap.set(authorId, authorData);
            }
          } catch (err) {
            console.error(`Error fetching author ${authorId}:`, err);
          }
        }));
        
        // Map the API response to our Post interface with author and space data
        const formattedPosts = rawData.map(post => {
          // Get space info from our spaces map
          const spaceInfo = post.space_id ? spacesMap.get(post.space_id) : null;
          
          // Get author info from our authors map
          const authorInfo = post.author_id ? authorsMap.get(post.author_id) : null;
          
          // Use available data directly without fetching additional info
          return mapPostData({
            ...post,
            // Include actual author data when available
            author: authorInfo || {
              id: post.author_id,
              username: `Author ${post.author_id?.substring(0, 4) || 'Unknown'}`,
              full_name: `Author ${post.author_id?.substring(0, 4) || 'Anonymous'}`,
              avatar_url: null
            },
            space: spaceInfo ? {
              id: spaceInfo.id,
              name: spaceInfo.name,
              color: '#6366f1'
            } : {
              id: post.space_id,
              name: `Space ${post.space_id?.substring(0, 6) || 'General'}`,
              color: '#6366f1'
            }
          });
        });
        
        // Store all posts in state
        setAllPosts(formattedPosts);
      } else {
        console.log('No posts found, using empty array');
        setAllPosts([]);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Using demo data as a fallback.');
      
      // Fall back to mock data on error
      setAllPosts(MOCK_DATA);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all posts when component mounts
  useEffect(() => {
    if (siteDetails?.id) {
      fetchPosts();
    }
  }, [siteDetails?.id]);

  return {
    allPosts,
    isLoading,
    error,
    refetch: fetchPosts
  };
} 