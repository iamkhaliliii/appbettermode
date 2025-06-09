import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/primitives';
import { Button } from '@/components/ui/primitives';
import { Calendar, Plus, ArrowRight, Loader2, RefreshCw, MapPin } from 'lucide-react';
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

interface Event {
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
  event_metadata?: {
    date_time: string;
    location: string;
  };
}

interface EventContentProps {
  siteSD: string;
  space: Space;
  site: any;
}

// Mock data for events - only used as fallback if API fails
const MOCK_EVENTS = [
  {
    id: 'mock-event-1',
    title: 'Annual Developer Conference',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Join us for our annual developer conference featuring talks from industry experts, hands-on workshops, and networking opportunities.' }]
        }
      ]
    }),
    status: 'published',
    author_id: 'mock-author',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'event',
    site_id: '',
    cover_image_url: 'https://picsum.photos/seed/mock-event-1/800/600',
    event_metadata: {
      date_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      location: 'San Francisco Convention Center'
    }
  },
  {
    id: 'mock-event-2',
    title: 'Product Launch Webinar',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Be the first to see our new product lineup and features in this exclusive online webinar.' }]
        }
      ]
    }),
    status: 'published',
    author_id: 'mock-author',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'event',
    site_id: '',
    cover_image_url: 'https://picsum.photos/seed/mock-event-2/800/600',
    event_metadata: {
      date_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      location: 'Online (Zoom)'
    }
  }
];

export function EventContent({ siteSD, space, site }: EventContentProps) {
  const [, setLocation] = useLocation();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start with loading state
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false); // Start with assumption we'll get real data

  // Load data function
  const fetchEventData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the API base URL
      const API_BASE = getApiBaseUrl();
      
      // If we don't have site ID or space ID, we can't fetch
      if (!site?.id || !space?.id) {
        throw new Error('Missing site or space information');
      }
      
      console.log(`Fetching events for site ${site.id} and space ${space.id}`);
      
      // Use the site ID and space ID to fetch events
      const response = await fetch(`${API_BASE}/api/v1/posts/site/${site.id}?cmsType=event&spaceId=${space.id}&status=published`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Fetched events:', data);
      
      if (Array.isArray(data) && data.length > 0) {
        setEvents(data);
        setUseMockData(false);
      } else {
        console.log('No events found, using empty array');
        setEvents([]);
        setUseMockData(false);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Using demo data as a fallback.');
      
      // Fall back to mock data on error
      setEvents(MOCK_EVENTS.map(event => ({
        ...event,
        space_id: space.id,
        site_id: site.id
      })));
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch events when component mounts
  useEffect(() => {
    if (site && space) {
      fetchEventData();
    }
  }, [site?.id, space?.id]);

  const handleNewEvent = () => {
    setLocation(`/site/${siteSD}/${space.slug}/create`);
  };

  const handleViewEvent = (eventId: string) => {
    setLocation(`/site/${siteSD}/${space.slug}/event/${eventId}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Sort events by date (upcoming first)
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = a.event_metadata?.date_time ? new Date(a.event_metadata.date_time).getTime() : 0;
    const dateB = b.event_metadata?.date_time ? new Date(b.event_metadata.date_time).getTime() : 0;
    return dateA - dateB;
  });

  return (
    <div className="event-container">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mr-2">
            Events
          </h2>
          {useMockData && (
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
              Demo Data
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchEventData} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleNewEvent}>
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading events...</span>
        </div>
      ) : error ? (
        <Card className="text-center p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={fetchEventData}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : sortedEvents.length === 0 ? (
        <Card className="text-center p-6">
          <CardContent className="pt-6">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No Events Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              There are no upcoming events scheduled.
            </p>
            <Button onClick={handleNewEvent}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedEvents.map(event => (
            <Card 
              key={event.id} 
              className="overflow-hidden transition-all hover:shadow-md dark:hover:shadow-gray-800/30"
            >
              {event.cover_image_url && (
                <div className="w-full h-48 overflow-hidden">
                  <img 
                    src={event.cover_image_url} 
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {event.title}
                </CardTitle>
                <CardDescription className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="h-3 w-3 mr-1" />
                  {event.event_metadata?.date_time ? formatDate(event.event_metadata.date_time) : 'Date to be announced'}
                </CardDescription>
                {event.event_metadata?.location && (
                  <CardDescription className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {event.event_metadata.location}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {typeof event.content === 'string' && event.content.startsWith('{')
                    ? JSON.parse(event.content)?.content?.[0]?.content?.[0]?.text || 'View this event for details'
                    : 'View this event for details'
                  }
                </p>
              </CardContent>
              <CardFooter className="border-t border-gray-100 dark:border-gray-800 pt-3 pb-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 p-0 h-auto"
                  onClick={() => handleViewEvent(event.id)}
                >
                  View Details <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 