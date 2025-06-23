import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/primitives';
import { Button } from '@/components/ui/primitives';
import { Badge } from '@/components/ui/primitives';
import { Calendar, Plus, ArrowRight, Loader2, RefreshCw, MapPin, Clock, Users, Grid, List, Search, Star, ArrowUpRight, CalendarDays } from 'lucide-react';
import { useLocation } from 'wouter';
import { fetchContentData, isSimulatedSpace, getSpaceInfo } from './utils';
import InteractiveCalendar from '@/components/ui/calendar-layout';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { AvatarGroup } from '@/components/ui/avatar';

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

interface EnhancedEvent {
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
  
  // Enhanced properties
  event_date?: string;
  event_location?: string;
  event_description?: string;
  event_status: 'upcoming' | 'ongoing' | 'past';
  event_type: 'online' | 'offline' | 'hybrid';
  attendees_count: number;
  max_attendees?: number;
  event_category: string;
  is_featured: boolean;
  registration_url?: string;
  price?: {
    type: 'free' | 'paid';
    amount?: number;
    currency?: string;
  };
  sample_image?: string;
  host?: {
    name: string;
    avatar: string;
  };
}

interface EventContentProps {
  siteSD: string;
  space: Space;
  site: any;
}

const FILTER_OPTIONS = [
  { value: 'all', label: 'All', count: 0 },
  { value: 'upcoming', label: 'Upcoming', count: 0 },
  { value: 'past', label: 'Past', count: 0 },
  { value: 'online', label: 'Online', count: 0 }
];

const VIEW_MODES = [
  { value: 'grid', label: 'Cards', icon: Grid },
  { value: 'list', label: 'List', icon: List },
  { value: 'calendar', label: 'Calendar', icon: CalendarDays },
];

// High-quality professional event images
const PREMIUM_IMAGES = [
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop&crop=center&auto=format&q=80'
];

export function EventContent({ siteSD, space, site }: EventContentProps) {
  const [, setLocation] = useLocation();
  const [events, setEvents] = useState<EnhancedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  
  // UI State
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Get space info for debugging
  const spaceInfo = getSpaceInfo(space);

  // Enhanced data processing function
  const enhanceEventData = (rawEvents: any[]): EnhancedEvent[] => {
    return rawEvents.map((event, index) => {
      // Extract event data from content
      let eventDate = event.content?.event_date || event.content?.date_time;
      const eventLocation = event.content?.event_location || event.content?.location;
      const eventDescription = event.content?.event_description || event.content?.description;
      
      // Update old event dates to current year for demo purposes
      if (eventDate) {
        const originalDate = new Date(eventDate);
        const currentYear = new Date().getFullYear();
        if (originalDate.getFullYear() < currentYear) {
          originalDate.setFullYear(currentYear);
          eventDate = originalDate.toISOString();
        }
      }
      
      // Calculate event status
      const now = new Date();
      const eventTime = eventDate ? new Date(eventDate) : null;
      let eventStatus: 'upcoming' | 'ongoing' | 'past' = 'upcoming';
      
      if (eventTime) {
        const timeDiff = eventTime.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff < -2) {
          eventStatus = 'past';
        } else if (hoursDiff >= -2 && hoursDiff <= 2) {
          eventStatus = 'ongoing';
        } else {
          eventStatus = 'upcoming';
        }
      }
      
      // Smart categorization based on title/content
      let category = 'Meetup';
      const titleLower = event.title.toLowerCase();
      const descLower = (eventDescription || '').toLowerCase();
      
      if (titleLower.includes('workshop') || descLower.includes('workshop')) {
        category = 'Workshop';
      } else if (titleLower.includes('conference') || descLower.includes('conference')) {
        category = 'Conference';
      } else if (titleLower.includes('webinar') || titleLower.includes('online') || descLower.includes('webinar')) {
        category = 'Webinar';
      } else if (titleLower.includes('pitch') || titleLower.includes('startup')) {
        category = 'Pitch';
      }
      
      // Determine event type
      let eventType: 'online' | 'offline' | 'hybrid' = 'offline';
      if (eventLocation) {
        const locationLower = eventLocation.toLowerCase();
        if (locationLower.includes('zoom') || locationLower.includes('online') || locationLower.includes('virtual')) {
          eventType = 'online';
        } else if (locationLower.includes('hybrid')) {
          eventType = 'hybrid';
        }
      }
      
      // Generate realistic attendee counts
      const baseAttendees = 25 + (index * 8);
      const variation = Math.floor(Math.random() * 15);
      const attendeesCount = baseAttendees + variation;
      
      // Determine max attendees and pricing
      const maxAttendees = category === 'Conference' ? 200 : category === 'Workshop' ? 50 : 80;
      const isFeatured = index === 0;
      
      let price: { type: 'free' | 'paid'; amount?: number; currency?: string } = { type: 'free' };
      if (category === 'Conference') {
        price = { type: 'paid', amount: 99, currency: 'USD' };
      } else if (category === 'Workshop') {
        price = { type: 'paid', amount: 29, currency: 'USD' };
      }

      // Generate host information
      const hostNames = [
        'Sarah Johnson', 'Mike Chen', 'Emily Rodriguez', 'David Kim', 'Lisa Thompson',
        'Alex Wong', 'Maria Garcia', 'James Wilson', 'Anna Taylor', 'Chris Brown'
      ];
      const hostName = hostNames[index % hostNames.length];
      const hostAvatar = `https://i.pravatar.cc/150?img=${(index % 20) + 1}`;

      return {
        ...event,
        event_date: eventDate,
        event_location: eventLocation,
        event_description: eventDescription,
        event_status: eventStatus,
        event_type: eventType,
        attendees_count: attendeesCount,
        max_attendees: maxAttendees,
        event_category: category,
        is_featured: isFeatured,
        registration_url: `https://events.example.com/register/${event.id}`,
        price,
        sample_image: PREMIUM_IMAGES[index % PREMIUM_IMAGES.length],
        host: {
          name: hostName,
          avatar: hostAvatar
        }
      };
    });
  };

  // Fetch events using the utility function
  const fetchEventData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🔍 EventContent: Fetching data for space:`, spaceInfo);
      
      const data = await fetchContentData({
        siteId: site.id,
        spaceId: space?.id,
        cmsType: 'event'
      });
      
      if (data.length > 0) {
        const enhancedEvents = enhanceEventData(data);
        setEvents(enhancedEvents);
        setUseMockData(false);
        console.log(`✅ Successfully loaded and enhanced ${enhancedEvents.length} events`);
      } else {
        console.log('📭 No events found, showing empty state');
        setEvents([]);
        setUseMockData(false);
      }
    } catch (err) {
      console.error('💥 Error fetching events:', err);
      setError('Failed to load events. Please try again.');
      setEvents([]);
      setUseMockData(false);
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

  // Filtered events with search
  const filteredEvents = useMemo(() => {
    let filtered = events.filter(event => {
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          event.title.toLowerCase().includes(query) ||
          event.event_description?.toLowerCase().includes(query) ||
          event.event_location?.toLowerCase().includes(query) ||
          event.event_category.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (selectedFilter === 'upcoming' && event.event_status !== 'upcoming') return false;
      if (selectedFilter === 'past' && event.event_status !== 'past') return false;
      if (selectedFilter === 'online' && event.event_type !== 'online') return false;
      
      return true;
    });
    
    // Sort by date (upcoming first, then past)
    filtered.sort((a, b) => {
      const dateA = a.event_date ? new Date(a.event_date).getTime() : 0;
      const dateB = b.event_date ? new Date(b.event_date).getTime() : 0;
      
      // Sort upcoming events by date ascending, past events by date descending
      if (a.event_status === 'upcoming' && b.event_status === 'upcoming') {
        return dateA - dateB;
      } else if (a.event_status === 'past' && b.event_status === 'past') {
        return dateB - dateA;
      } else if (a.event_status === 'upcoming' && b.event_status === 'past') {
        return -1;
      } else {
        return 1;
      }
    });
    
    return filtered;
  }, [events, selectedFilter, searchQuery]);

  // Update filter counts
  const filterOptionsWithCounts = useMemo(() => {
    return FILTER_OPTIONS.map(option => ({
      ...option,
      count: option.value === 'all' ? events.length :
             option.value === 'upcoming' ? events.filter(e => e.event_status === 'upcoming').length :
             option.value === 'past' ? events.filter(e => e.event_status === 'past').length :
             option.value === 'online' ? events.filter(e => e.event_type === 'online').length : 0
    }));
  }, [events]);

  const handleNewEvent = () => {
    setLocation(`/site/${siteSD}/${space.slug}/create`);
  };

  const handleViewEvent = (eventId: string) => {
    setLocation(`/site/${siteSD}/${space.slug}/${eventId}`);
  };

  const handleRSVP = (eventId: string, event: EnhancedEvent) => {
    // Simulate RSVP
    setEvents(prev => prev.map(e => 
      e.id === eventId 
        ? { ...e, attendees_count: e.attendees_count + 1 }
        : e
    ));
  };

  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
    
    if (isToday) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (isTomorrow) {
      return `Tomorrow at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  // Minimal Card View - Professional Design
  const renderEventCard = (event: EnhancedEvent) => {
    const isUpcoming = event.event_status === 'upcoming';
    const isOngoing = event.event_status === 'ongoing';
    const isPast = event.event_status === 'past';
    
    return (
      <Card 
        key={event.id}
        className={`group relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-200 cursor-pointer ${isPast ? 'opacity-70 grayscale' : ''}`}
        onClick={() => handleViewEvent(event.id)}
      >
        {/* Image with All Content Overlay */}
        <div className="relative overflow-hidden rounded-lg aspect-[1/1]">
          <img 
            src={event.sample_image} 
            alt={event.title}
            className={`w-full h-full object-cover ${isPast ? 'grayscale' : ''}`}
          />
          
          {/* Progressive Blur Effect */}
          <ProgressiveBlur
            className="pointer-events-none absolute bottom-0 left-0 h-[40%] w-full"
            blurIntensity={8}
            direction="bottom"
          />
          
          {/* Overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
          
          {/* Category and Status Badges - Top Left */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 font-medium shadow-lg w-fit">
                {event.event_category}
              </Badge>
              {event.is_featured && !isOngoing && !isPast && (
                <Badge className="bg-blue-600 text-white text-xs px-1.5 py-1 font-medium shadow-lg w-fit">
                  <Star className="w-3 h-3 fill-current" />
                </Badge>
              )}
            </div>
            {isOngoing && (
              <Badge className="bg-red-600 text-white text-xs px-2 py-1 font-medium shadow-lg">
                Live
              </Badge>
            )}
          </div>
          
          {/* Date/Time Badge - Top Right */}
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-black/50 backdrop-blur-sm text-white rounded-lg px-2 py-1.5 ">
              {event.event_date ? (
                <div className="text-center">
                  <div className="text-[0.6rem] font-medium uppercase tracking-wider opacity-90">
                    {new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-[0.75rem] font-bold leading-none">
                    {new Date(event.event_date).getDate()}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-xs font-medium">TBA</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Complete Event Content Overlay - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <div className="space-y-1">
              {/* Past Badge */}
              {isPast && (
                <div className="flex justify-start">
                  <span className="text-sm text-white/80 font-medium drop-shadow-lg">
                    Past Event
                  </span>
                </div>
              )}
              
              {/* Online Badge */}
              {event.event_type === 'online' && (
                <div className="flex justify-end">
                  <Badge className="bg-purple-500/80 backdrop-blur-sm text-white text-xs px-2 py-1 font-medium">
                    Online
                  </Badge>
                </div>
              )}
              
              {/* Title */}
              <h3 className="font-bold text-sm text-white line-clamp-2 drop-shadow-lg">
                {event.title}
              </h3>
              
              {/* Location and Attendees */}
              <div className="flex items-center justify-between text-[0.75rem] text-white/80 mb-3">
                <div className="flex items-center gap-1.5">
                  {event.event_location && (
                    <>
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[120px]">{event.event_location}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <AvatarGroup
                    members={[
                      { username: 'user1', src: 'https://i.pravatar.cc/150?img=3' },
                      { username: 'user2', src: 'https://i.pravatar.cc/150?img=4' },
                      { username: 'user3', src: 'https://i.pravatar.cc/150?img=5' },
                      { username: 'user4', src: 'https://i.pravatar.cc/150?img=6' },
                      { username: 'user5', src: 'https://i.pravatar.cc/150?img=7' },
                      ...Array.from({ length: Math.max(0, event.attendees_count - 5) }).map((_, index) => ({ username: `user${index + 6}`, src: undefined }))
                    ]}
                    limit={5}
                    size={14}
                  />
                </div>
              </div>
              

            </div>
          </div>
        </div>
      </Card>
    );
  };

  // Timeline List View - Compact and Minimal
  const renderEventListItem = (event: EnhancedEvent, index: number) => {
    const isUpcoming = event.event_status === 'upcoming';
    const isOngoing = event.event_status === 'ongoing';
    const isPast = event.event_status === 'past';
    const isLast = index === filteredEvents.length - 1;
    
    // Format date for timeline view
    const eventDate = event.event_date ? new Date(event.event_date) : new Date();
    const today = new Date();
    const isToday = eventDate.toDateString() === today.toDateString();
    const isTomorrow = eventDate.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();
    
    let dateLabel = eventDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      weekday: 'long' 
    });
    
    if (isToday) dateLabel = `Today ${eventDate.toLocaleDateString('en-US', { weekday: 'long' })}`;
    if (isTomorrow) dateLabel = `Tomorrow ${eventDate.toLocaleDateString('en-US', { weekday: 'long' })}`;
    
    const timeLabel = eventDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    // Check if this is the first event of a new day
    const isNewDay = index === 0 || 
      (filteredEvents[index - 1] && 
       new Date(filteredEvents[index - 1].event_date || '').toDateString() !== eventDate.toDateString());
    
    return (
      <div key={event.id} className="relative">
        {/* Date Header */}
        {isNewDay && (
          <div className="sticky top-20 z-20 flex justify-start py-2 mb-3">
            <div className="inline-flex items-center gap-2.5 bg-white/50 dark:bg-gray-900/90 backdrop-blur-md rounded-full px-3.5 py-1.5 border border-gray-200/50 dark:border-gray-800/50 shadow-lg ml-3">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isPast ? 'bg-gray-400' : 'bg-blue-500'}`} />
              <h3 className={`font-semibold text-sm ${isPast ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                {dateLabel}
              </h3>
            </div>
          </div>
        )}
        
        {/* Timeline Connector */}
        {!isLast && (
          <div className={`absolute left-[5px] w-[2px] h-full bg-gray-200 dark:bg-gray-700 ${isNewDay ? 'top-10' : 'top-8'}`} />
        )}
        
        {/* Event Card */}
        <div className="relative ml-8 mb-6">
          <div 
            className={`group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md transition-all duration-300 cursor-pointer ${isPast ? 'opacity-80 grayscale' : ''}`}
            onClick={() => handleViewEvent(event.id)}
          >
                        <div className="flex items-start gap-5">
              {/* Event Info */}
              <div className="flex-1 min-w-0">
                {/* Time and Status */}
                <div className="flex items-center gap-3 mb-1">
                  <span className={`text-[0.7rem] font-medium ${isPast ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {timeLabel}
                  </span>
                  
                                  {/* Status and Category Badges */}
                <div className="flex items-center gap-2">
                  <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs px-2 py-0.5">
                    {event.event_category}
                  </Badge>
                  
                  {event.event_type === 'online' && (
                    <Badge className="bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 text-xs px-2 py-0.5">
                      Online
                    </Badge>
                  )}
                  
                  {isOngoing && (
                    <Badge className="bg-red-600 text-white text-xs px-2 py-0.5">
                      Live
                    </Badge>
                  )}
                  {isPast && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Past Event
                    </span>
                  )}
                  {event.is_featured && !isOngoing && !isPast && (
                    <Badge className="bg-blue-600 text-white text-xs px-1.5 py-0.5">
                      <Star className="w-2.5 h-2.5 fill-current" />
                    </Badge>
                  )}
                </div>
                </div>
                
                {/* Title */}
                <h4 className={`font-semibold text-[1.2rem] mb-1 line-clamp-2 ${isPast ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                  {event.title}
                </h4>
                
                {/* Host and Location Info */}
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <div className="flex items-center gap-2">
                    <img 
                      src={event.host?.avatar || 'https://i.pravatar.cc/150?img=1'}
                      alt="Host"
                      className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-700"
                    />
                    <span>By {event.host?.name || 'Event Host'}</span>
                  </div>
                  
                  {event.event_location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[120px]">{event.event_location}</span>
                    </div>
                  )}
                </div>
                
                {/* Attendees */}
                <div className="flex items-center gap-2">
                  <AvatarGroup
                    members={[
                      { username: 'user1', src: 'https://i.pravatar.cc/150?img=3' },
                      { username: 'user2', src: 'https://i.pravatar.cc/150?img=4' },
                      { username: 'user3', src: 'https://i.pravatar.cc/150?img=5' },
                      { username: 'user4', src: 'https://i.pravatar.cc/150?img=6' },
                      { username: 'user5', src: 'https://i.pravatar.cc/150?img=7' },
                      ...Array.from({ length: Math.max(0, event.attendees_count - 5) }).map((_, index) => ({ username: `user${index + 6}`, src: undefined }))
                    ]}
                    limit={5}
                    size={26}
                  />
                </div>
              </div>
              
              {/* Event Image */}
              <div className="flex-shrink-0 relative">
                <div className="w-24 h-24 rounded-xl overflow-hidden group-hover:shadow-lg transition-shadow duration-300">
                  <img 
                    src={event.sample_image} 
                    alt={event.title}
                    className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${isPast ? 'grayscale' : ''}`}
                  />
                  {/* Hover Arrow */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <ArrowRight className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Events
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Discover and join community events
              </p>
            </div>
            
            {/* Create Button */}
            <Button 
              onClick={handleNewEvent}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>

          {/* Controls */}
          {events.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 max-w-sm">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md p-1">
                  {filterOptionsWithCounts.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedFilter(option.value)}
                      className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                        selectedFilter === option.value
                          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                    >
                      {option.label} ({option.count})
                    </button>
                  ))}
                </div>

                {/* View Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-md p-1">
                  {VIEW_MODES.map(mode => {
                    const IconComponent = mode.icon;
                    return (
                      <button
                        key={mode.value}
                        onClick={() => setViewMode(mode.value as 'grid' | 'list' | 'calendar')}
                        className={`px-3 py-1.5 text-sm font-medium rounded transition-colors flex items-center gap-1.5 ${
                          viewMode === mode.value
                            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                        {mode.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">Loading events...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="text-center p-8">
            <CardContent>
              <div className="text-red-500 text-4xl mb-4">⚠️</div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Unable to load events
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <Button 
                onClick={fetchEventData} 
                variant="outline"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : filteredEvents.length === 0 ? (
          events.length === 0 ? (
            <Card className="text-center p-12">
              <CardContent>
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No events yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Create your first event to get started
                </p>
                <Button 
                  onClick={handleNewEvent}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center p-8">
              <CardContent>
                <Search className="h-8 w-8 mx-auto text-gray-400 mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No events found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search or filters
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedFilter('all');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )
        ) : (
          <div className="space-y-4">
            {/* Results */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredEvents.length} of {events.length} events
            </div>
            
            {/* Events */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.map(event => renderEventCard(event))}
              </div>
            ) : viewMode === 'list' ? (
              <div className="space-y-0 bg-gray-50 dark:bg-gray-950 rounded-lg p-4">
                {filteredEvents.map((event, index) => renderEventListItem(event, index))}
              </div>
            ) : (
              <div className="rounded-lg bg-gray-50 dark:bg-black p-4 border border-gray-200 dark:border-gray-800">
                <InteractiveCalendar 
                  events={filteredEvents} 
                  siteSD={siteSD}
                  spaceSlug={space?.slug}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 