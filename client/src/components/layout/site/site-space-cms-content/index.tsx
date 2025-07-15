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
import { ChangelogContent } from './changelog.tsx';

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
  eventsLayout?: string;
  cardSize?: string;
  cardStyle?: string;
}

export function SpaceCmsContent({ siteSD, space, site, eventsLayout, cardSize, cardStyle }: SpaceCmsContentProps) {
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



    // Start with the space's cms_type
    let cmsType = space.cms_type;
    
    console.log("🔍 SpaceCmsContent: Original cms_type from space:", cmsType);
    console.log("🔍 SpaceCmsContent: Site content_types:", site?.content_types);
    
    // If cms_type looks like a UUID, try to find the actual type name
    if (cmsType.includes('-') && cmsType.length > 20) {
      console.log("🔍 SpaceCmsContent: cms_type appears to be a UUID, looking up name...");
      
      // Look for the content type in site data
      if (site?.content_types && Array.isArray(site.content_types)) {
        const matchedContentType = site.content_types.find((ct: any) => 
          ct.id === cmsType || ct.uuid === cmsType
        );
        
        if (matchedContentType) {
          cmsType = matchedContentType.name;
          console.log("✅ SpaceCmsContent: Found content type name:", cmsType);
        } else {
          console.log("❌ SpaceCmsContent: Could not find content type for UUID:", cmsType);
        }
      }
    }
    
    // Normalize CMS type to handle potential casing or format issues
    cmsType = cmsType.toLowerCase();
    
    // Special handling for various name formats
    if (cmsType === 'q&a' || cmsType === 'qa') {
      cmsType = 'qa';
    }
    if (cmsType === 'job-board' || cmsType === 'jobboard') {
      cmsType = 'jobs';
    }
    if (cmsType === 'ideas-wishlist' || cmsType === 'wishlist') {
      cmsType = 'wishlist';
    }
    if (cmsType === 'knowledge-base' || cmsType === 'knowledge') {
      cmsType = 'knowledge';
    }
    
    // Remove any special characters and normalize
    cmsType = cmsType.replace(/[^a-z0-9]/g, '');
    
    console.log("🎯 SpaceCmsContent: Final normalized cms_type for rendering:", cmsType);
    
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
        return <EventContent siteSD={siteSD} space={space} site={site} eventsLayout={eventsLayout} cardSize={cardSize} cardStyle={cardStyle} hideSpaceHeader={true} />;
      case 'knowledge':
        return <KnowledgeContent siteSD={siteSD} space={space} site={site} />;
      case 'landing':
        return <LandingContent siteSD={siteSD} space={space} site={site} />;
      case 'jobs':
        return <JobsContent siteSD={siteSD} space={space} site={site} />;
      case 'changelog':
        return <ChangelogContent siteSD={siteSD} space={space} site={site} />;
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
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p>Original cms_type: {space.cms_type}</p>
              <p>Normalized: {cmsType}</p>
            </div>
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