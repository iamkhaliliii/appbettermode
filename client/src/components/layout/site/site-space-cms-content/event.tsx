import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/primitives';
import { Button } from '@/components/ui/primitives';
import { Calendar, Plus, Loader2, RefreshCw, Search } from 'lucide-react';
import InteractiveCalendar from '@/components/ui/calendar-layout';
import { fetchContentData, isSimulatedSpace, getSpaceInfo } from './utils';
import { EventFiltersDemo } from '@/components/ui/event-filters-demo';
import { Filter, FilterType, FilterOperator, EventStatus, EventCategory, EventType as FilterEventType, Featured } from '@/components/ui/event-filters';
import { EventSortDemo } from '@/components/ui/event-sort-demo';
import { Sort, SortField, SortDirection } from '@/components/ui/event-sort';
import { nanoid } from 'nanoid';

// Import reusable components
import {
  CategoryCard,
  FeaturedEventWidget,
  EventCard,
  EventListItem,
  EventControlsBar,
  Space,
  EnhancedEvent,
  EventContentProps
} from '@/components/features/events';
import { CATEGORIES, PREMIUM_IMAGES } from '@/components/features/events/constants';
import AppleCardsCarouselDemo from '@/components/ui/apple-cards-carousel-demo';
import CompactProfileCarouselDemo from '@/components/ui/compact-profile-carousel-demo';

export function EventContent({ siteSD, space, site }: EventContentProps) {
  const [, setLocation] = useLocation();
  const [events, setEvents] = useState<EnhancedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  
  // UI State
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isViewModeOpen, setIsViewModeOpen] = useState(false);
  
  // Advanced Filters & Sorts
  const [advancedFilters, setAdvancedFilters] = useState<Filter[]>([]);
  const [advancedSorts, setAdvancedSorts] = useState<Sort[]>([
    {
      id: 'default-date',
      field: SortField.DATE,
      direction: SortDirection.DESC
    }
  ]);

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isViewModeOpen && !target.closest('[data-dropdown="view-mode"]')) {
        setIsViewModeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isViewModeOpen]);

  // Function to apply advanced filters
  const applyAdvancedFilters = (events: EnhancedEvent[], filters: Filter[]): EnhancedEvent[] => {
    return events.filter(event => {
      for (const filter of filters) {
        if (filter.value.length === 0) continue;

        let matches = false;
        
        switch (filter.type) {
          case FilterType.STATUS:
            const statusMap = {
              [EventStatus.UPCOMING]: 'upcoming',
              [EventStatus.ONGOING]: 'ongoing', 
              [EventStatus.PAST]: 'past'
            };
            const eventStatus = Object.keys(statusMap).find(key => 
              statusMap[key as keyof typeof statusMap] === event.event_status
            );
            
            if (filter.operator === FilterOperator.IS) {
              matches = filter.value.includes(eventStatus || '');
            } else if (filter.operator === FilterOperator.IS_NOT) {
              matches = !filter.value.includes(eventStatus || '');
            } else if (filter.operator === FilterOperator.IS_ANY_OF) {
              matches = filter.value.includes(eventStatus || '');
            }
            break;

          case FilterType.CATEGORY:
            if (filter.operator === FilterOperator.INCLUDE || filter.operator === FilterOperator.INCLUDE_ANY_OF) {
              matches = filter.value.includes(event.event_category);
            } else if (filter.operator === FilterOperator.DO_NOT_INCLUDE || filter.operator === FilterOperator.EXCLUDE_ALL_OF) {
              matches = !filter.value.includes(event.event_category);
            }
            break;

          case FilterType.EVENT_TYPE:
            const typeMap = {
              [FilterEventType.ONLINE]: 'online',
              [FilterEventType.OFFLINE]: 'offline',
              [FilterEventType.HYBRID]: 'hybrid'
            };
            const eventType = Object.keys(typeMap).find(key => 
              typeMap[key as keyof typeof typeMap] === event.event_type
            );
            
            if (filter.operator === FilterOperator.IS) {
              matches = filter.value.includes(eventType || '');
            } else if (filter.operator === FilterOperator.IS_NOT) {
              matches = !filter.value.includes(eventType || '');
            }
            break;

          case FilterType.FEATURED:
            const isFeatured = event.is_featured ? Featured.FEATURED : Featured.NOT_FEATURED;
            if (filter.operator === FilterOperator.IS) {
              matches = filter.value.includes(isFeatured);
            } else if (filter.operator === FilterOperator.IS_NOT) {
              matches = !filter.value.includes(isFeatured);
            }
            break;

          case FilterType.DATE:
            if (event.event_date) {
              const eventDate = new Date(event.event_date);
              const now = new Date();
              
              for (const dateFilter of filter.value) {
                let dateMatches = false;
                const today = new Date();
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                
                switch (dateFilter) {
                  case 'Today':
                    dateMatches = eventDate.toDateString() === today.toDateString();
                    break;
                  case 'Tomorrow':
                    dateMatches = eventDate.toDateString() === tomorrow.toDateString();
                    break;
                  case 'This week':
                    const weekStart = new Date(today);
                    weekStart.setDate(today.getDate() - today.getDay());
                    const weekEnd = new Date(weekStart);
                    weekEnd.setDate(weekStart.getDate() + 6);
                    dateMatches = eventDate >= weekStart && eventDate <= weekEnd;
                    break;
                  case 'Next week':
                    const nextWeekStart = new Date(today);
                    nextWeekStart.setDate(today.getDate() + (7 - today.getDay()));
                    const nextWeekEnd = new Date(nextWeekStart);
                    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
                    dateMatches = eventDate >= nextWeekStart && eventDate <= nextWeekEnd;
                    break;
                  case 'This month':
                    dateMatches = eventDate.getMonth() === today.getMonth() && 
                                 eventDate.getFullYear() === today.getFullYear();
                    break;
                  case 'Next month':
                    const nextMonth = new Date(today);
                    nextMonth.setMonth(today.getMonth() + 1);
                    dateMatches = eventDate.getMonth() === nextMonth.getMonth() && 
                                 eventDate.getFullYear() === nextMonth.getFullYear();
                    break;
                }
                
                if (dateMatches) {
                  matches = true;
                  break;
                }
              }
            }
            break;
        }
        
        if (!matches) return false;
      }
      return true;
    });
  };

  // Apply advanced sorting to events
  const sortedEvents = useMemo(() => {
    if (advancedSorts.length === 0) return events;
    
    const sorted = [...events].sort((a, b) => {
      for (const sort of advancedSorts) {
        let comparison = 0;
        
        switch (sort.field) {
          case SortField.DATE:
            const dateA = a.event_date ? new Date(a.event_date).getTime() : 0;
            const dateB = b.event_date ? new Date(b.event_date).getTime() : 0;
            comparison = dateA - dateB;
            break;
          case SortField.TITLE:
            comparison = a.title.localeCompare(b.title);
            break;
          case SortField.CATEGORY:
            comparison = a.event_category.localeCompare(b.event_category);
            break;
          case SortField.ATTENDEES:
            comparison = a.attendees_count - b.attendees_count;
            break;
          case SortField.CREATED:
            const createdA = new Date(a.created_at).getTime();
            const createdB = new Date(b.created_at).getTime();
            comparison = createdA - createdB;
            break;
          case SortField.UPDATED:
            const updatedA = new Date(a.updated_at).getTime();
            const updatedB = new Date(b.updated_at).getTime();
            comparison = updatedA - updatedB;
            break;
        }
        
        const result = sort.direction === SortDirection.ASC ? comparison : -comparison;
        if (result !== 0) return result;
      }
      return 0;
    });
    
    return sorted;
  }, [events, advancedSorts]);

  // Create pinned event
  const pinnedEvent: EnhancedEvent = {
    id: 'pinned-workshop',
    title: 'React Development Workshop',
    content: {
      event_date: '2024-01-22T14:00:00',
      event_location: 'Online',
      event_description: 'Learn React development with hands-on projects'
    },
    status: 'published',
    author_id: 'author-1',
    space_id: space?.id || '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'event',
    site_id: site?.id || '',
    event_date: '2024-01-22T14:00:00',
    event_location: 'Online',
    event_description: 'Learn React development with hands-on projects',
    event_status: 'upcoming' as const,
    event_type: 'online' as const,
    attendees_count: 42,
    max_attendees: 50,
    event_category: 'Workshop',
    is_featured: false,
    registration_url: 'https://events.example.com/register/workshop',
    price: { type: 'paid', amount: 29, currency: 'USD' },
    sample_image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
    host: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/150?img=1'
    }
  };

  // Filtered events with search and advanced filters
  const filteredEvents = useMemo(() => {
    let filtered = sortedEvents.filter(event => {
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
      
      return true;
    });

    // Apply advanced filters
    if (advancedFilters.length > 0) {
      filtered = applyAdvancedFilters(filtered, advancedFilters);
    }
    
    // Add pinned event at the beginning
    return [pinnedEvent, ...filtered];
  }, [sortedEvents, searchQuery, advancedFilters, pinnedEvent]);

  const handleNewEvent = () => {
    setLocation(`/site/${siteSD}/${space.slug}/create`);
  };

  const handleViewEvent = (eventId: string) => {
    setLocation(`/site/${siteSD}/${space.slug}/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Events
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {events.length > 0 ? `Discover and join community events (${events.length} events)` : 'Discover and join community events'}
              </p>
            </div>
            
            {/* Create Button - Show when no events */}
            {events.length === 0 && (
              <Button 
                onClick={handleNewEvent}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            )}
          </div>
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
                    setSearchQuery('');
                    setAdvancedFilters([]);
                    setAdvancedSorts([{
                      id: 'default-date',
                      field: SortField.DATE,
                      direction: SortDirection.DESC
                    }]);
                  }}
                >
                  Clear All
                </Button>
              </CardContent>
            </Card>
          )
        ) : (
          <div className="space-y-16">
            {/* Widgets Section */}
            <div>
              <div className="grid grid-cols-1 gap-4">
                <FeaturedEventWidget />
              </div>
            </div>

            {/* Event Categories Widget */}
            <div className="w-full">
              <div className="grid grid-cols-3 gap-4 mb-12">
                {CATEGORIES.map((category, index) => (
                  <CategoryCard
                    key={index}
                    icon={category.icon}
                    title={category.title}
                    count={category.count}
                    colorScheme={category.colorScheme}
                    onClick={() => {/* Handle category filter */}}
                  />
                ))}
              </div>
            </div>

            {/* Apple Cards Carousel Widget */}
            {/* <div className="w-full overflow-hidden">
              <AppleCardsCarouselDemo />
            </div> */}

            {/* Compact Profile Cards Carousel Widget */}
            {/* <div className="w-full">
              <CompactProfileCarouselDemo />
            </div> */}



            {/* All Events Section */}
            <div>
              <EventControlsBar
                advancedSorts={advancedSorts}
                setAdvancedSorts={setAdvancedSorts}
                advancedFilters={advancedFilters}
                setAdvancedFilters={setAdvancedFilters}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isSearchOpen={isSearchOpen}
                setIsSearchOpen={setIsSearchOpen}
                viewMode={viewMode}
                setViewMode={setViewMode}
                isViewModeOpen={isViewModeOpen}
                setIsViewModeOpen={setIsViewModeOpen}
                onNewEvent={handleNewEvent}
              />
            </div>
            
            {/* Events */}
            {viewMode === 'grid' ? (
              <div className="space-y-6">
                {/* Pinned Event */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEvents.filter(event => event.id === 'pinned-workshop').map(event => 
                    <EventCard 
                      key={event.id}
                      event={event} 
                      onEventClick={handleViewEvent} 
                    />
                  )}
                </div>
                
                {/* Regular Events */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEvents.filter(event => event.id !== 'pinned-workshop').map(event => 
                    <EventCard 
                      key={event.id}
                      event={event} 
                      onEventClick={handleViewEvent} 
                    />
                  )}
                </div>
              </div>
            ) : viewMode === 'list' ? (
              <div className="space-y-0 bg-gray-50 dark:bg-gray-950 rounded-lg p-4">
                {filteredEvents.map((event, index) => 
                  <EventListItem 
                    key={event.id}
                    event={event}
                    index={index}
                    filteredEvents={filteredEvents}
                    onEventClick={handleViewEvent}
                  />
                )}
              </div>
            ) : (
              <div className="rounded-lg bg-gray-50 dark:bg-gray-950 p-4 border border-gray-200 dark:border-gray-800">
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