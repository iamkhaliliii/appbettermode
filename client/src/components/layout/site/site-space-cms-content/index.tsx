import React from 'react';
import { Loader2 } from 'lucide-react';

// Import specific CMS content components
import { DiscussionContent } from './discussion.tsx';
import { QaContent } from './qa.tsx';
import { WishlistContent } from './wishlist.tsx';
import { BlogContent } from './blog.tsx';
import { EventContent } from './event.tsx';
import { KnowledgeContent } from './knowledge.tsx';
import { LandingContent } from './landing.tsx';
import { JobsContent } from './jobs.tsx';

// Types
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

interface SpaceCmsContentProps {
  siteSD: string;
  space: Space;
  site: any;
  isWidgetMode?: boolean;
}

export function SpaceCmsContent({ siteSD, space, site, isWidgetMode = false }: SpaceCmsContentProps) {
  // Function to determine which component to render based on CMS type
  const renderContentComponent = () => {
    // Check if space exists and has a CMS type
    if (!space || !space.cms_type) {
      return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-400 text-center">
            No content type specified for this space.
          </p>
        </div>
      );
    }

    // Normalize CMS type to handle potential casing or format issues
    let cmsType = space.cms_type.toLowerCase();
    
    // Special handling for "q&a" format
    if (cmsType === 'q&a') {
      cmsType = 'qa';
    }
    
    // Remove any special characters and normalize
    cmsType = cmsType.replace(/[^a-z0-9]/g, '');
    
    console.log("Original cms_type:", space.cms_type);
    console.log("Normalized cms_type for rendering:", cmsType);
    
    // Render component based on CMS type
    switch (cmsType) {
      case 'discussion':
        return <DiscussionContent siteSD={siteSD} space={space} site={site} />;
      case 'qa':
        return <QaContent siteSD={siteSD} space={space} site={site} />;
      case 'wishlist':
        return <WishlistContent siteSD={siteSD} space={space} site={site} />;
      case 'blog':
        return <BlogContent siteSD={siteSD} space={space} site={site} />;
      case 'event':
        return <EventContent siteSD={siteSD} space={space} site={site} />;
      case 'knowledge':
        return <KnowledgeContent siteSD={siteSD} space={space} site={site} />;
      case 'landing':
        return <LandingContent siteSD={siteSD} space={space} site={site} />;
      case 'jobs':
        return <JobsContent siteSD={siteSD} space={space} site={site} />;
      default:
        // Fallback for unsupported CMS types
        return (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-4">
              {space.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Content type "{space.cms_type}" is not supported yet.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-content-container">
      {renderContentComponent()}
    </div>
  );
} 