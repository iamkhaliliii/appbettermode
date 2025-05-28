import { Post } from './types';

// Add a utility function to get API base URL
export function getApiBaseUrl() {
  // Use environment variable if available, otherwise default to localhost
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
}

// Map database post data to UI post data structure
export function mapPostData(postData: any): Post {
  // Handle different status formats
  let status: Post['status'] = 'Draft';
  switch(postData.status) {
    case 'published':
      status = 'Published';
      break;
    case 'scheduled':
      status = 'Schedule';
      break;
    case 'pending_review':
      status = 'Pending review';
      break;
    default:
      status = 'Draft';
  }

  // Generate a more human-friendly author name
  const authorName = postData.author?.full_name || postData.author?.username || 
                    (postData.author_id ? `Author ${postData.author_id.substring(0, 4)}` : 'Anonymous');

  return {
    id: postData.id || '',
    title: postData.title || 'Untitled',
    status,
    author: {
      name: authorName,
      avatar: postData.author?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    space: {
      name: postData.space?.name || 'General',
      color: postData.space?.color || '#6366f1'
    },
    publishedAt: postData.published_at 
      ? new Date(postData.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Not published',
    cmsModel: postData.cms_type || 'Unknown',
    tags: (postData.tags || []).map((tag: any) => tag.name || tag),
    locked: postData.locked || false
  };
}

// Utility function to check if a string is a valid UUID
export function isValidUUID(uuid: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
} 