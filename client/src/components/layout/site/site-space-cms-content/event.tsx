import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/primitives';
import { Button } from '@/components/ui/primitives';
import { Badge } from '@/components/ui/primitives';
import { Calendar, Plus, ArrowRight, Loader2, RefreshCw, MapPin, Clock, Users, Grid, List, Search, Star, ArrowUpRight, CalendarDays } from 'lucide-react';
import { useLocation } from 'wouter';
import { fetchContentData, isSimulatedSpace, getSpaceInfo } from './utils';
import InteractiveCalendar from '@/components/ui/visualize-booking';

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
        sample_image: PREMIUM_IMAGES[index % PREMIUM_IMAGES.length]
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
        className="group relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-200"
      >
        {/* Clean Image */}
        <div className="relative h-44 overflow-hidden">
          <img 
            src={event.sample_image} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          
          {/* Minimal Overlay */}
          <div className="absolute inset-0 bg-black/10" />
          
          {/* Status Badges - Top */}
          <div className="absolute top-3 left-3">
            {isOngoing && (
              <Badge className="bg-red-600 text-white text-xs px-2 py-1 font-medium">
                Live
              </Badge>
            )}
            {event.is_featured && !isOngoing && (
              <Badge className="bg-blue-600 text-white text-xs px-2 py-1 font-medium">
                Featured
              </Badge>
            )}
          </div>
          
          {/* Price Badge - Top Right */}
          <div className="absolute top-3 right-3">
            {event.price?.type === 'paid' ? (
              <Badge className="bg-white text-gray-900 text-xs px-2 py-1 font-medium shadow-sm">
                ${event.price.amount}
              </Badge>
            ) : (
              <Badge className="bg-green-600 text-white text-xs px-2 py-1 font-medium">
                Free
              </Badge>
            )}
          </div>
        </div>
        
        <CardContent className="p-4 space-y-3">
          {/* Meta Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium">{event.event_category}</span>
            {event.event_type === 'online' && (
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded font-medium">
                Online
              </span>
            )}
          </div>
          
          {/* Title */}
          <h3 
            className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onClick={() => handleViewEvent(event.id)}
          >
            {event.title}
          </h3>
          
          {/* Date & Time */}
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {event.event_date ? formatEventDate(event.event_date) : 'Date TBA'}
          </div>
          
          {/* Location */}
          {event.event_location && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span className="truncate">{event.event_location}</span>
            </div>
          )}
          
          {/* Attendees */}
          <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 pt-1 border-t border-gray-100 dark:border-gray-800">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            <span>{event.attendees_count} attending</span>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          {isUpcoming && (
            <Button 
              size="sm" 
              onClick={() => handleRSVP(event.id, event)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              RSVP
            </Button>
          )}
          
          {isOngoing && (
            <Button 
              size="sm" 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => handleViewEvent(event.id)}
            >
              Join Live
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleViewEvent(event.id)}
            className="ml-auto"
          >
            Details
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  // Minimal List View - Professional Design
  const renderEventListItem = (event: EnhancedEvent) => {
    const isUpcoming = event.event_status === 'upcoming';
    const isOngoing = event.event_status === 'ongoing';
    
    // Format date for list view
    const eventDate = event.event_date ? new Date(event.event_date) : new Date();
    
    return (
      <Card 
        key={event.id}
        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 border border-gray-200 dark:border-gray-800"
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Date Block */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {String(eventDate.getDate()).padStart(2, '0')}
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                </div>
              </div>
            </div>

            {/* Event Info */}
            <div className="flex-1 min-w-0 space-y-2">
              {/* Title and Status */}
              <div className="flex items-start justify-between gap-4">
                <h3 
                  className="font-semibold text-lg text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1"
                  onClick={() => handleViewEvent(event.id)}
                >
                  {event.title}
                </h3>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isOngoing && (
                    <Badge className="bg-red-600 text-white text-xs px-2 py-1">
                      Live
                    </Badge>
                  )}
                  {event.is_featured && !isOngoing && (
                    <Badge className="bg-blue-600 text-white text-xs px-2 py-1">
                      Featured
                    </Badge>
                  )}
                  {event.price?.type === 'paid' ? (
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      ${event.price.amount}
                    </Badge>
                  ) : (
                    <Badge className="bg-green-600 text-white text-xs px-2 py-1">
                      Free
                    </Badge>
                  )}
                </div>
              </div>

              {/* Meta Info */}
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                <span>{event.event_category}</span>
                {event.event_type === 'online' && (
                  <span className="text-purple-600 dark:text-purple-400">Online</span>
                )}
                <span>{event.event_date ? formatEventDate(event.event_date) : 'Date TBA'}</span>
              </div>

              {/* Location */}
              {event.event_location && (
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{event.event_location}</span>
                </div>
              )}

              {/* Attendees and Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  {/* Attendee Avatars */}
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      {['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face',
                        'https://images.unsplash.com/photo-1494790108755-2616b612b4c0?w=24&h=24&fit=crop&crop=face',
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face'].map((avatar, index) => (
                        <img
                          key={index}
                          src={avatar}
                          alt=""
                          className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900"
                        />
                      ))}
                      {event.attendees_count > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                            +{event.attendees_count - 3}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {event.attendees_count} attending
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {isUpcoming && (
                    <Button 
                      size="sm" 
                      onClick={() => handleRSVP(event.id, event)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      RSVP
                    </Button>
                  )}
                  
                  {isOngoing && (
                    <Button 
                      size="sm" 
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => handleViewEvent(event.id)}
                    >
                      Join Live
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewEvent(event.id)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
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
              <div className="space-y-4">
                {filteredEvents.map(event => renderEventListItem(event))}
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