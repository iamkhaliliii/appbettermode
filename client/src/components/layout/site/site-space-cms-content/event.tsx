import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/primitives';
import { Button } from '@/components/ui/primitives';
import { Badge } from '@/components/ui/primitives';
import { Calendar, Plus, ArrowRight, Loader2, RefreshCw, MapPin, Clock, Users, Grid, List, CalendarDays } from 'lucide-react';
import { useLocation } from 'wouter';
import { fetchContentData, isSimulatedSpace, getSpaceInfo } from './utils';

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
  { value: 'all', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'past', label: 'Past' },
  { value: 'online', label: 'Online' }
];

const VIEW_MODES = [
  { value: 'grid', label: 'Cards', icon: Grid },
  { value: 'list', label: 'List', icon: List },
  { value: 'calendar', label: 'Calendar', icon: CalendarDays }
];

// Sample event images - high quality, professional event photos
const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=300&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=300&fit=crop&crop=center', 
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=300&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=300&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=300&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=300&fit=crop&crop=center'
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
  
  // Calendar state
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Get space info for debugging
  const spaceInfo = getSpaceInfo(space);
  const spaceInfoText = `Space: ${spaceInfo.name} (${spaceInfo.isSimulated ? 'simulated' : 'real'}, ${spaceInfo.cmsType})`;

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
        sample_image: SAMPLE_IMAGES[index % SAMPLE_IMAGES.length]
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

  // Filtered events
  const filteredEvents = useMemo(() => {
    let filtered = events.filter(event => {
      // Status filter
      if (selectedFilter === 'upcoming' && event.event_status !== 'upcoming') return false;
      if (selectedFilter === 'past' && event.event_status !== 'past') return false;
      if (selectedFilter === 'online' && event.event_type !== 'online') return false;
      
      return true;
    });
    
    // Sort by date (upcoming first)
    filtered.sort((a, b) => {
      const dateA = a.event_date ? new Date(a.event_date).getTime() : 0;
      const dateB = b.event_date ? new Date(b.event_date).getTime() : 0;
      return dateA - dateB;
    });
    
    return filtered;
  }, [events, selectedFilter]);

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
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (isTomorrow) {
      return `Tomorrow, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  // Render individual event card - vertical design with improved dark mode
  const renderEventCard = (event: EnhancedEvent) => {
    const isUpcoming = event.event_status === 'upcoming';
    const isOngoing = event.event_status === 'ongoing';
    
    return (
      <Card 
        key={event.id} 
        className="group overflow-hidden hover:shadow-lg dark:hover:shadow-2xl hover:shadow-gray-200 dark:hover:shadow-gray-900/50 transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
      >
        {/* Event Image */}
        <div className="relative overflow-hidden">
          <img 
            src={event.sample_image} 
            alt={event.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="absolute top-3 left-3">
            {isOngoing && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 animate-pulse shadow-lg">
                🔴 Live
              </Badge>
            )}
            {event.is_featured && !isOngoing && (
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 shadow-lg">
                ⭐ Featured
              </Badge>
            )}
          </div>
          <div className="absolute top-3 right-3">
            {event.price?.type === 'paid' ? (
              <Badge className="bg-white/95 dark:bg-gray-900/95 text-gray-900 dark:text-gray-100 text-xs px-2 py-1 font-medium shadow-lg border border-gray-200 dark:border-gray-600">
                ${event.price.amount}
              </Badge>
            ) : (
              <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 shadow-lg">
                Free
              </Badge>
            )}
          </div>
        </div>
        
        <CardContent className="p-4">
          {/* Event Category & Type */}
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50">
              {event.event_category}
            </Badge>
            {event.event_type === 'online' && (
              <Badge variant="outline" className="text-xs text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20">
                Online
              </Badge>
            )}
          </div>
          
          {/* Event Title */}
          <h3 
            className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onClick={() => handleViewEvent(event.id)}
          >
            {event.title}
          </h3>
          
          {/* Event Details */}
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            {event.event_date && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                <span>{formatEventDate(event.event_date)}</span>
              </div>
            )}
            
            {event.event_location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
                <span className="truncate">{event.event_location}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 flex-shrink-0 text-gray-400 dark:text-gray-500" />
              <span>{event.attendees_count} attending</span>
            </div>
          </div>
          
          {/* Event Description */}
          {event.event_description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-2">
              {event.event_description}
            </p>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {isUpcoming && (
              <Button 
                size="sm" 
                onClick={() => handleRSVP(event.id, event)}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-md"
              >
                RSVP
              </Button>
            )}
            
            {isOngoing && (
              <Button 
                size="sm" 
                className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white shadow-md"
                onClick={() => handleViewEvent(event.id)}
              >
                Join Live
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleViewEvent(event.id)}
              className="text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
            >
              View Details
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="p-1 h-auto text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
              <Users className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-1 h-auto text-gray-400 dark:text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  };

  // Render list view item - professional horizontal design with improved dark mode
  const renderEventListItem = (event: EnhancedEvent) => {
    const isUpcoming = event.event_status === 'upcoming';
    const isOngoing = event.event_status === 'ongoing';
    
    // Format date range
    const eventDate = event.event_date ? new Date(event.event_date) : new Date();
    const endDate = new Date(eventDate.getTime() + (3 * 24 * 60 * 60 * 1000)); // 3 days later
    
    const formatDateRange = () => {
      const startFormatted = eventDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
      const endFormatted = endDate.toLocaleDateString('en-US', { 
        day: 'numeric',
        year: 'numeric'
      });
      return `${startFormatted} - ${endFormatted}`;
    };

    // Generate attendee avatars
    const attendeeAvatars = [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1494790108755-2616b612b4c0?w=40&h=40&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    ];
    
    return (
      <Card key={event.id} className="hover:shadow-lg dark:hover:shadow-2xl hover:shadow-gray-200 dark:hover:shadow-gray-900/50 transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="flex justify-between items-start gap-6">
            {/* Left Content */}
            <div className="flex-1 space-y-4">
              {/* Date Range */}
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {formatDateRange()}
              </div>

              {/* Event Title */}
              <h3 
                className="text-xl font-bold text-gray-900 dark:text-gray-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => handleViewEvent(event.id)}
              >
                {event.title}
              </h3>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="text-sm">{event.event_location || 'Location TBA'}</span>
              </div>

              {/* Price Badge */}
              <div>
                {event.price?.type === 'paid' ? (
                  <Badge className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 text-sm px-3 py-1">
                    From ${event.price.amount}
                  </Badge>
                ) : (
                  <Badge className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700 text-sm px-3 py-1">
                    Free Event
                  </Badge>
                )}
              </div>

              {/* Attendees Section */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  {/* Avatar Stack */}
                  <div className="flex -space-x-2">
                    {attendeeAvatars.map((avatar, index) => (
                      <img
                        key={index}
                        src={avatar}
                        alt="Attendee"
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
                      />
                    ))}
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center shadow-sm">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        +{event.attendees_count - 3}
                      </span>
                    </div>
                  </div>

                  {/* Attendees Text */}
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    People attending this event
                  </span>
                </div>

                {/* Action Button */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleViewEvent(event.id)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-1"
                >
                  View event details
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Right Content - Calendar Icon or Image */}
            <div className="flex-shrink-0">
              {Math.random() > 0.5 ? (
                // Calendar Icon
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-2xl flex items-center justify-center shadow-sm">
                  <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              ) : (
                // Event Image
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                  <img 
                    src={event.sample_image} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render calendar view - minimal with enhanced dark mode
  const renderCalendarView = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Group events by date
    const eventsByDate = filteredEvents.reduce((acc, event) => {
      if (event.event_date) {
        const eventDate = new Date(event.event_date);
        if (eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear) {
          const day = eventDate.getDate();
          if (!acc[day]) {
            acc[day] = [];
          }
          acc[day].push(event);
        }
      }
      return acc;
    }, {} as Record<number, EnhancedEvent[]>);

    // Create calendar grid
    const calendarDays = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthName = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Clean Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-light text-gray-900 dark:text-gray-100">
            {monthName}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredEvents.length} events this month
          </p>
        </div>

        {/* Minimal Calendar Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Week Headers */}
          <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            {weekDays.map(day => (
              <div key={day} className="p-4 text-center">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {day}
                </span>
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              if (!day) {
                return (
                  <div 
                    key={index} 
                    className="h-16 border-r border-b border-gray-50 dark:border-gray-700/50"
                  />
                );
              }

              const dayEvents = eventsByDate[day] || [];
              const isToday = day === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear();
              const hasEvents = dayEvents.length > 0;
              const isSelected = selectedDay === day;

              return (
                <div
                  key={day}
                  className={`
                    relative h-16 border-r border-b border-gray-50 dark:border-gray-700/50 cursor-pointer
                    transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/30
                    ${isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''}
                    ${isSelected ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700' : ''}
                  `}
                  onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                >
                  {/* Day Number */}
                  <div className="absolute top-2 left-2">
                    <span className={`
                      text-sm font-medium
                      ${isToday ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-900 dark:text-gray-100'}
                      ${hasEvents ? 'font-semibold' : ''}
                    `}>
                      {day}
                    </span>
                  </div>

                  {/* Today Indicator */}
                  {isToday && (
                    <div className="absolute top-2 right-2">
                      <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full shadow-sm" />
                    </div>
                  )}

                  {/* Event Indicator */}
                  {hasEvents && (
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center justify-between">
                        <div className="flex space-x-1">
                          {dayEvents.slice(0, 3).map((event, eventIndex) => (
                            <div
                              key={event.id}
                              className={`w-1.5 h-1.5 rounded-full shadow-sm ${
                                event.event_status === 'ongoing' 
                                  ? 'bg-red-500 dark:bg-red-400' 
                                  : event.is_featured 
                                    ? 'bg-blue-500 dark:bg-blue-400'
                                    : 'bg-gray-400 dark:bg-gray-500'
                              }`}
                              title={event.title}
                            />
                          ))}
                        </div>
                        {dayEvents.length > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium bg-white dark:bg-gray-800 px-1 rounded shadow-sm">
                            {dayEvents.length}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Events - Clean Design */}
        {selectedDay && eventsByDate[selectedDay] && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Day Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(currentYear, currentMonth, selectedDay).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {eventsByDate[selectedDay].length} events scheduled
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedDay(null)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                ✕
              </Button>
            </div>
            
            {/* Clean Event List */}
            <div className="space-y-3">
              {eventsByDate[selectedDay].map((event) => (
                <div 
                  key={event.id} 
                  className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-md dark:hover:shadow-lg hover:shadow-gray-200 dark:hover:shadow-gray-900/50 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    {/* Time */}
                    <div className="flex-shrink-0 text-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {event.event_date && new Date(event.event_date).toLocaleTimeString('en-US', { 
                          hour: 'numeric', 
                          minute: '2-digit' 
                        })}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {event.event_type}
                      </div>
                    </div>

                    {/* Event Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 
                            className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 cursor-pointer transition-colors"
                            onClick={() => handleViewEvent(event.id)}
                          >
                            {event.title}
                          </h4>
                          
                          {event.event_location && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {event.event_location}
                            </p>
                          )}

                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.attendees_count} attending
                            </span>
                            
                            <Badge variant="outline" className="text-xs bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300">
                              {event.event_category}
                            </Badge>

                            {event.price?.type === 'paid' && (
                              <Badge className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs border border-blue-200 dark:border-blue-700">
                                ${event.price.amount}
                              </Badge>
                            )}

                            {event.event_status === 'ongoing' && (
                              <Badge className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs animate-pulse border border-red-200 dark:border-red-700">
                                Live
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {event.event_status === 'upcoming' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleRSVP(event.id, event)}
                              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-md"
                            >
                              RSVP
                            </Button>
                          )}
                          
                          {event.event_status === 'ongoing' && (
                            <Button 
                              size="sm" 
                              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white shadow-md"
                              onClick={() => handleViewEvent(event.id)}
                            >
                              Join Live
                            </Button>
                          )}
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewEvent(event.id)}
                            className="text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Minimal Events Overview */}
        {Object.keys(eventsByDate).length > 0 && !selectedDay && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Upcoming Events
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(eventsByDate)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .slice(0, 6)
                .map(([day, events]) => (
                  <div 
                    key={day}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-3 hover:shadow-md dark:hover:shadow-lg hover:shadow-gray-200 dark:hover:shadow-gray-900/50 transition-all duration-200 cursor-pointer"
                    onClick={() => setSelectedDay(parseInt(day))}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 text-center">
                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          {day}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(currentYear, currentMonth, parseInt(day)).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {events.length} {events.length === 1 ? 'event' : 'events'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {events[0].title}
                          {events.length > 1 && ` +${events.length - 1} more`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Events
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Discover and join amazing events in your community
              </p>
            </div>
            
            <Button 
              onClick={handleNewEvent}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              New Event
            </Button>
          </div>
        </div>

        {/* Filters & View Controls */}
        {events.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
              {FILTER_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSelectedFilter(option.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    selectedFilter === option.value
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-600'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
              {VIEW_MODES.map(mode => {
                const IconComponent = mode.icon;
                return (
                  <button
                    key={mode.value}
                    onClick={() => setViewMode(mode.value as 'grid' | 'list' | 'calendar')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                      viewMode === mode.value
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200 dark:border-gray-600'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 dark:text-gray-500" />
            <span className="ml-3 text-gray-500 dark:text-gray-400">Loading events...</span>
          </div>
        ) : error ? (
          <Card className="text-center p-8 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
            <CardContent>
              <div className="text-red-500 dark:text-red-400 text-4xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                Unable to load events
              </h3>
              <p className="text-red-700 dark:text-red-300 mb-4">{error}</p>
              <Button onClick={fetchEventData} variant="outline" className="border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : filteredEvents.length === 0 && events.length === 0 ? (
          <Card className="text-center p-12 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent>
              <Calendar className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No events yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                Start building your community by creating your first event
              </p>
              <Button onClick={handleNewEvent} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Event
              </Button>
            </CardContent>
          </Card>
        ) : filteredEvents.length === 0 ? (
          <Card className="text-center p-8 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent>
              <Calendar className="h-8 w-8 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No events found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your filters
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSelectedFilter('all')}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Results count */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
            </div>
            
            {/* Content based on view mode */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => renderEventCard(event))}
              </div>
            )}
            
            {viewMode === 'list' && (
              <div className="space-y-4 max-w-4xl">
                {filteredEvents.map(event => renderEventListItem(event))}
              </div>
            )}
            
            {viewMode === 'calendar' && renderCalendarView()}
          </>
        )}
      </div>
    </div>
  );
} 