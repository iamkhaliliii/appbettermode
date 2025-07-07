import { useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import ModerationIndexPage from './moderation/index';

export default function ModerationPage() {
  const [, params] = useRoute('/site/:siteSD/moderation/:section?');
  const [, setLocation] = useLocation();
  
  // If no section provided, redirect to pending-posts
  useEffect(() => {
    if (params?.siteSD && !params?.section) {
      setLocation(`/site/${params.siteSD}/moderation/pending-posts`);
    }
  }, [params?.siteSD, params?.section, setLocation]);

  // If section is provided, render the moderation index page
  if (params?.section) {
    return <ModerationIndexPage />;
  }

  return null;
} 