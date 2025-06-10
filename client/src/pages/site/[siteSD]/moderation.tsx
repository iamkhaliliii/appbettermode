import { useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';

export default function ModerationRedirect() {
  const [, params] = useRoute('/site/:siteSD/moderation');
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (params?.siteSD) {
      setLocation(`/site/${params.siteSD}/moderation/pending-posts`);
    }
  }, [params?.siteSD, setLocation]);

  return null;
} 