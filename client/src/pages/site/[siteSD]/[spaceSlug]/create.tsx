import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { sitesApi } from '@/lib/api';
import { SiteHeader } from '@/components/layout/site/site-header';
import { SiteSidebar } from '@/components/layout/site/site-sidebar';
import { Header } from '@/components/layout/dashboard/header';
import { getApiBaseUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types
interface Space {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cms_type: string;
  hidden: boolean;
  visibility: 'public' | 'private' | 'paid';
  site_id: string;
}

interface OtherProperties {
  [key: string]: any;
}

interface CmsTypeField {
  key: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: Array<{
    value: string;
    label: string;
  }>;
}

interface CmsType {
  id: string;
  name: string;
  fields: CmsTypeField[];
}

interface ContentFormProps {
  siteSD: string;
  site: any;
  space: Space;
  contentType?: CmsType | null;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

// Main Component
export default function CreatePostPage() {
  const { siteSD, spaceSlug } = useParams();
  const [, setLocation] = useLocation();
  const [site, setSite] = useState<any>(null);
  const [space, setSpace] = useState<Space | null>(null);
  const [contentType, setContentType] = useState<CmsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch site data
  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteSD) {
        setError('Invalid site identifier');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch site data
        const siteData = await sitesApi.getSite(siteSD);
        console.log("Site data fetched:", siteData.name, siteData.id);
        setSite(siteData);
        
        // Fetch associated space
        await fetchSpaceData(siteData);
      } catch (err) {
        console.error("Error fetching site data:", err);
        setError('Failed to load site data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchSiteData();
  }, [siteSD, spaceSlug]);

  // Fetch space data
  const fetchSpaceData = async (siteData: any) => {
    if (!spaceSlug) {
      setError('Invalid space slug');
      setIsLoading(false);
      return;
    }

    try {
      const API_BASE = getApiBaseUrl();
      
      // Try to fetch the space directly first
      const response = await fetch(`${API_BASE}/api/v1/sites/${siteData.id}/spaces?slug=${spaceSlug}`);
      const spacesData = await response.json();
      
      if (Array.isArray(spacesData) && spacesData.length > 0) {
        // Space found
        const spaceData = spacesData[0];
        setSpace(spaceData);
        
        // After setting space, fetch the content type definition
        if (spaceData.cms_type) {
          await fetchContentType(spaceData.cms_type);
        }
      } else {
        // If no direct space match, check if this might be a content type
        if (siteData.content_types && Array.isArray(siteData.content_types)) {
          // Normalize content type matching
          let normalizedSlug = spaceSlug.toLowerCase();
          if (normalizedSlug === 'qa' || normalizedSlug === 'q-a') {
            normalizedSlug = 'qa';
          }
          
          // Check if the spaceSlug matches a content type
          const matchedType = siteData.content_types.find((type: string) => 
            type.toLowerCase() === normalizedSlug || 
            type.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedSlug.replace(/[^a-z0-9]/g, '')
          );
          
          if (matchedType) {
            // Create a simulated space based on the content type
            const simulatedSpace = {
              id: `simulated-${matchedType}`,
              name: matchedType.charAt(0).toUpperCase() + matchedType.slice(1),
              slug: spaceSlug,
              description: `${matchedType} content`,
              cms_type: matchedType,
              hidden: false,
              visibility: 'public' as 'public' | 'private' | 'paid',
              site_id: siteData.id
            };
            
            setSpace(simulatedSpace);
            
            // Fetch content type definition
            await fetchContentType(matchedType);
          } else {
            setError(`Space "${spaceSlug}" not found for this site`);
          }
        } else {
          setError(`Space "${spaceSlug}" not found for this site`);
        }
      }
    } catch (err) {
      console.error("Error fetching space data:", err);
      setError('Failed to load space data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch content type definition from API
  const fetchContentType = async (typeName: string) => {
    try {
      const API_BASE = getApiBaseUrl();
      const response = await fetch(`${API_BASE}/api/v1/cms-types/name/${typeName}`);
      
      if (response.ok) {
        const typeData = await response.json();
        setContentType(typeData);
        console.log(`Content type data loaded for ${typeName}:`, typeData);
      } else {
        console.warn(`Content type ${typeName} not found in database, using default fields`);
        // Will fallback to default fields in the form
      }
    } catch (err) {
      console.error(`Error fetching content type ${typeName}:`, err);
      // Continue without content type data, form will use defaults
    }
  };

  // Toggle mobile menu
  const handleToggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/site/${siteSD}/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Handle form submission
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const API_BASE = getApiBaseUrl();
      
      // Create post
      const response = await fetch(`${API_BASE}/api/v1/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create post');
      }
      
      const createdPost = await response.json();
      
      toast({
        title: "Post Created",
        description: "Your post has been created successfully.",
      });
      
      // Redirect back to space page
      setLocation(`/site/${siteSD}/${spaceSlug}`);
    } catch (err: any) {
      console.error("Error creating post:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to create post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render appropriate content form based on space type
  const renderContentForm = () => {
    if (!space || !site) return null;
    
    return (
      <ContentForm
        siteSD={siteSD || ''}
        site={site}
        space={space}
        contentType={contentType}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    );
  };

  // Navigate back to space
  const handleBack = () => {
    setLocation(`/site/${siteSD}/${spaceSlug}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header
        onToggleMobileMenu={handleToggleMobileMenu}
        variant="site"
        siteName={site?.name}
        siteIdentifier={siteSD}
      />
      
      {/* Site Header */}
      <SiteHeader 
        siteSD={siteSD || ''} 
        site={site} 
        isMenuOpen={isMenuOpen} 
        setIsMenuOpen={setIsMenuOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
      />

      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto px-4 flex-grow">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <SiteSidebar siteSD={siteSD || ''} activePage={spaceSlug} />

            {/* Main content area */}
            <div className="flex-1 p-4 md:p-6">
              {isLoading ? (
                <div className="w-full flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="w-full rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error</h2>
                  <p className="text-gray-600 dark:text-gray-400">{error}</p>
                  <Button onClick={handleBack} className="mt-4">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Space
                  </Button>
                </div>
              ) : (
                <div className="w-full rounded-lg bg-white dark:bg-gray-800 p-6 shadow-sm">
                  <div className="flex items-center mb-6">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleBack}
                      className="mr-4"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Create {getContentTypeLabel(space?.cms_type)}
                    </h1>
                  </div>
                  
                  {renderContentForm()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Content Form Component
function ContentForm({ siteSD, site, space, contentType, onSubmit, isSubmitting }: ContentFormProps) {
  // Common state for all content types
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  
  // Generic other_properties for CMS-specific fields
  const [otherProperties, setOtherProperties] = useState<OtherProperties>({});

  // Get default fields for content type
  useEffect(() => {
    if (!space) return;

    // Set default properties based on content type
    const defaultProperties = getDefaultPropertiesForType(space.cms_type);
    setOtherProperties(defaultProperties);
  }, [space?.cms_type]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      return; // Don't submit if title is empty
    }

    // Prepare the content in the proper format
    const contentJson = JSON.stringify({
      type: 'doc',
      content: [{
        type: 'paragraph',
        content: [{ type: 'text', text: content }]
      }]
    });
    
    // Create post data
    const postData = {
      title,
      content: contentJson,
      status,
      space_id: space.id,
      site_id: site.id,
      cms_type: space.cms_type,
      other_properties: otherProperties, // Add CMS-specific properties here
    };
    
    await onSubmit(postData);
  };

  // Handle change in other properties
  const handleOtherPropertyChange = (key: string, value: any) => {
    setOtherProperties(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Render form fields based on content type
  const renderTypeSpecificFields = () => {
    // Use fields from the API if available, otherwise fall back to defaults
    const fields = contentType?.fields || getFieldsForType(space.cms_type);
    
    return fields.map(field => (
      <div key={field.key} className="mb-4">
        <Label htmlFor={field.key} className="block mb-2 text-sm font-medium">
          {field.label}
        </Label>
        
        {field.type === 'text' && (
          <Input
            id={field.key}
            value={otherProperties[field.key] || ''}
            onChange={(e) => handleOtherPropertyChange(field.key, e.target.value)}
            placeholder={field.placeholder || ''}
          />
        )}
        
        {field.type === 'textarea' && (
          <Textarea
            id={field.key}
            value={otherProperties[field.key] || ''}
            onChange={(e) => handleOtherPropertyChange(field.key, e.target.value)}
            placeholder={field.placeholder || ''}
            rows={4}
          />
        )}
        
        {field.type === 'select' && (
          <Select
            value={otherProperties[field.key] || ''}
            onValueChange={(value) => handleOtherPropertyChange(field.key, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {field.type === 'date' && (
          <Input
            id={field.key}
            type="date"
            value={otherProperties[field.key] || ''}
            onChange={(e) => handleOtherPropertyChange(field.key, e.target.value)}
          />
        )}
      </div>
    ));
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Create New {getContentTypeLabel(space.cms_type)}</CardTitle>
          <CardDescription>
            Fill in the details below to create a new {space.cms_type} post.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Common fields for all content types */}
          <div className="mb-4">
            <Label htmlFor="title" className="block mb-2 text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title"
              required
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="content" className="block mb-2 text-sm font-medium">
              Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter content"
              rows={6}
              required
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="status" className="block mb-2 text-sm font-medium">
              Status
            </Label>
            <Select
              value={status}
              onValueChange={setStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Type-specific fields */}
          {renderTypeSpecificFields()}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create'
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

// Helper function to get a user-friendly label for content type
function getContentTypeLabel(type?: string): string {
  if (!type) return 'Content';
  
  switch (type.toLowerCase()) {
    case 'discussion': return 'Discussion';
    case 'qa': return 'Q&A';
    case 'qa_question': return 'Question';
    case 'wishlist': return 'Idea';
    case 'blog': return 'Blog Post';
    case 'event': return 'Event';
    case 'knowledge': return 'Knowledge Base Article';
    case 'kb_article': return 'Article';
    case 'landing': return 'Landing Page';
    case 'jobs': return 'Job Posting';
    case 'poll': return 'Poll';
    case 'article': return 'Article';
    case 'roadmap': return 'Roadmap Item';
    case 'changelog': return 'Changelog Entry';
    case 'announcement': return 'Announcement';
    default: return type.charAt(0).toUpperCase() + type.slice(1);
  }
}

// Helper to get default properties for a content type
function getDefaultPropertiesForType(type: string): OtherProperties {
  switch (type.toLowerCase()) {
    case 'discussion':
      return {
        allow_replies: true,
        pinned: false
      };
    case 'event':
      return {
        date_time: new Date().toISOString().split('T')[0],
        location: '',
        rsvp_limit: 0
      };
    case 'kb_article':
    case 'knowledge':
      return {
        last_updated: new Date().toISOString()
      };
    case 'wishlist':
    case 'idea':
      return {
        status: 'Under Review',
        votes: 0
      };
    case 'changelog':
      return {
        date: new Date().toISOString().split('T')[0],
        version: '1.0.0'
      };
    case 'roadmap':
      return {
        status: 'Planned',
        timeline: 'Q4 2023',
        priority: 'Medium'
      };
    case 'announcement':
      return {
        audience: 'All Users',
        date: new Date().toISOString().split('T')[0]
      };
    case 'poll':
      return {
        options: [],
        allow_multiple: false,
        anonymous: false
      };
    case 'article':
      return {
        estimated_reading_time: 5
      };
    case 'job':
    case 'jobs':
      return {
        location: 'Remote',
        department: '',
        type: 'Full-time',
        salary: ''
      };
    default:
      return {};
  }
}

// Helper to get fields for different content types - fallback if not in CMS database
function getFieldsForType(type: string) {
  switch (type.toLowerCase()) {
    case 'discussion':
      return [
        { key: 'allow_replies', label: 'Allow Replies', type: 'select', options: [
          { value: 'true', label: 'Yes' },
          { value: 'false', label: 'No' }
        ] },
        { key: 'pinned', label: 'Pinned', type: 'select', options: [
          { value: 'true', label: 'Yes' },
          { value: 'false', label: 'No' }
        ] }
      ];
    case 'event':
      return [
        { key: 'date_time', label: 'Event Date', type: 'date' },
        { key: 'location', label: 'Location', type: 'text', placeholder: 'Event location' },
        { key: 'rsvp_limit', label: 'RSVP Limit', type: 'text', placeholder: 'Maximum number of attendees' }
      ];
    case 'kb_article':
    case 'knowledge':
      return [
        { key: 'last_updated', label: 'Last Updated', type: 'date' }
      ];
    case 'wishlist':
    case 'idea':
      return [
        { key: 'status', label: 'Status', type: 'select', options: [
          { value: 'Under Review', label: 'Under Review' },
          { value: 'Planned', label: 'Planned' },
          { value: 'In Progress', label: 'In Progress' },
          { value: 'Completed', label: 'Completed' },
          { value: 'Closed', label: 'Closed' }
        ] }
      ];
    case 'changelog':
      return [
        { key: 'date', label: 'Release Date', type: 'date' },
        { key: 'version', label: 'Version', type: 'text', placeholder: '1.0.0' },
        { key: 'feature_area', label: 'Feature Area', type: 'text', placeholder: 'UI, Backend, etc.' }
      ];
    case 'roadmap':
      return [
        { key: 'status', label: 'Status', type: 'select', options: [
          { value: 'Planned', label: 'Planned' },
          { value: 'In Progress', label: 'In Progress' },
          { value: 'Completed', label: 'Completed' }
        ] },
        { key: 'timeline', label: 'Timeline', type: 'text', placeholder: 'Q4 2023' },
        { key: 'priority', label: 'Priority', type: 'select', options: [
          { value: 'Low', label: 'Low' },
          { value: 'Medium', label: 'Medium' },
          { value: 'High', label: 'High' }
        ] }
      ];
    case 'announcement':
      return [
        { key: 'date', label: 'Announcement Date', type: 'date' },
        { key: 'audience', label: 'Audience', type: 'text', placeholder: 'All Users, Admins, etc.' },
        { key: 'call_to_action', label: 'Call To Action', type: 'text', placeholder: 'Action URL or instruction' }
      ];
    case 'job':
    case 'jobs':
      return [
        { key: 'location', label: 'Location', type: 'text', placeholder: 'Remote, New York, etc.' },
        { key: 'department', label: 'Department', type: 'text', placeholder: 'Engineering, Sales, etc.' },
        { key: 'type', label: 'Job Type', type: 'select', options: [
          { value: 'Full-time', label: 'Full-time' },
          { value: 'Part-time', label: 'Part-time' },
          { value: 'Contract', label: 'Contract' },
          { value: 'Internship', label: 'Internship' }
        ] },
        { key: 'salary', label: 'Salary Range', type: 'text', placeholder: '$80,000 - $120,000' },
        { key: 'apply_link', label: 'Application Link', type: 'text', placeholder: 'https://...' }
      ];
    case 'article':
      return [
        { key: 'estimated_reading_time', label: 'Estimated Reading Time (minutes)', type: 'text', placeholder: '5' }
      ];
    case 'poll':
      return [
        { key: 'options', label: 'Poll Options (comma separated)', type: 'textarea', placeholder: 'Option 1, Option 2, Option 3' },
        { key: 'allow_multiple', label: 'Allow Multiple Selections', type: 'select', options: [
          { value: 'true', label: 'Yes' },
          { value: 'false', label: 'No' }
        ] },
        { key: 'anonymous', label: 'Anonymous Voting', type: 'select', options: [
          { value: 'true', label: 'Yes' },
          { value: 'false', label: 'No' }
        ] },
        { key: 'deadline', label: 'Voting Deadline', type: 'date' }
      ];
    default:
      return [];
  }
} 