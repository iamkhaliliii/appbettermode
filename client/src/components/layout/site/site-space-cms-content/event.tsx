import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/primitives';
import { Button } from '@/components/ui/primitives';
import { Calendar, Plus, Loader2, RefreshCw, MapPin, Clock, Users, Grid, List, CalendarDays } from 'lucide-react';
import { fetchContentData, getSpaceInfo } from './utils';

// Import the existing event components
import { FeaturedEventWidget } from '@/components/features/events/FeaturedEventWidget';
import { EventCard } from '@/components/features/events/EventCard';
import { EventListItem } from '@/components/features/events/EventListItem';
import { EventControlsBar } from '@/components/features/events/EventControlsBar';
import { CategoryCard } from '@/components/features/events/CategoryCard';
import { CATEGORIES, PREMIUM_IMAGES } from '@/components/features/events/constants';
import { EnhancedEvent, EventContentProps } from '@/components/features/events/types';
import { Filter } from '@/components/ui/event-filters';
import { Sort, SortField } from '@/components/ui/event-sort';
import InteractiveCalendar from '@/components/ui/calendar-layout';
import { GeneralWidgetPopover } from '../../../dashboard/site-config/widgets/GeneralWidgetPopover';

// Mock enhanced events data - optimized and comprehensive
const MOCK_ENHANCED_EVENTS: EnhancedEvent[] = [
  {
    id: 'workshop-react-advanced',
    title: 'Advanced React Patterns & Performance Optimization',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Deep dive into advanced React patterns including render props, higher-order components, custom hooks, and performance optimization techniques.' }]
        }
      ]
    }),
    status: 'published',
    author_id: 'instructor-1',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'event',
    site_id: '',
    event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    event_location: 'San Francisco, CA',
    event_description: 'Master advanced React concepts and build high-performance applications',
    event_status: 'upcoming',
    event_type: 'offline',
    attendees_count: 45,
    max_attendees: 50,
    event_category: 'Workshop',
    is_featured: true,
    registration_url: 'https://example.com/register',
    price: { type: 'paid', amount: 299, currency: 'USD' },
    sample_image: PREMIUM_IMAGES[0],
    host: { name: 'React Masters', avatar: 'https://i.pravatar.cc/150?img=1' }
  },
  {
    id: 'tech-conference-2024',
    title: 'Tech Innovation Conference 2024',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Join industry leaders and innovators for a day of insights into the future of technology, AI, and digital transformation.' }]
        }
      ]
    }),
    status: 'published',
    author_id: 'organizer-1',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'event',
    site_id: '',
    event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    event_location: 'Online',
    event_description: 'Discover the latest trends in technology and innovation',
    event_status: 'upcoming',
    event_type: 'online',
    attendees_count: 320,
    max_attendees: 500,
    event_category: 'Conference',
    is_featured: true,
    registration_url: 'https://example.com/register',
    price: { type: 'free' },
    sample_image: PREMIUM_IMAGES[1],
    host: { name: 'Tech Leaders Inc', avatar: 'https://i.pravatar.cc/150?img=2' }
  },
  {
    id: 'ux-design-masterclass',
    title: 'UX Design Masterclass: Creating User-Centered Experiences',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Learn the principles of user experience design and create compelling digital experiences that convert and delight users.' }]
        }
      ]
    }),
    status: 'published',
    author_id: 'designer-1',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'event',
    site_id: '',
    event_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
    event_location: 'New York, NY',
    event_description: 'Master the art of user experience design',
    event_status: 'upcoming',
    event_type: 'hybrid',
    attendees_count: 85,
    max_attendees: 100,
    event_category: 'Webinar',
    is_featured: false,
    registration_url: 'https://example.com/register',
    price: { type: 'paid', amount: 199, currency: 'USD' },
    sample_image: PREMIUM_IMAGES[2],
    host: { name: 'Design Academy', avatar: 'https://i.pravatar.cc/150?img=3' }
  },
  {
    id: 'startup-pitch-night',
    title: 'Startup Pitch Night: Innovation Showcase',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Watch promising startups pitch their innovative ideas to investors and industry experts. Network with entrepreneurs and discover the next big thing.' }]
        }
      ]
    }),
    status: 'published',
    author_id: 'organizer-2',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'event',
    site_id: '',
    event_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    event_location: 'Austin, TX',
    event_description: 'Discover innovative startups and network with entrepreneurs',
    event_status: 'upcoming',
    event_type: 'offline',
    attendees_count: 150,
    max_attendees: 200,
    event_category: 'Pitch',
    is_featured: false,
    registration_url: 'https://example.com/register',
    price: { type: 'free' },
    sample_image: PREMIUM_IMAGES[3],
    host: { name: 'Startup Network', avatar: 'https://i.pravatar.cc/150?img=4' }
  },
  {
    id: 'networking-meetup',
    title: 'Monthly Tech Networking Meetup',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Connect with fellow tech professionals, share experiences, and build valuable relationships in the tech community.' }]
        }
      ]
    }),
    status: 'published',
    author_id: 'organizer-3',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'event',
    site_id: '',
    event_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    event_location: 'Los Angeles, CA',
    event_description: 'Network with tech professionals and expand your connections',
    event_status: 'upcoming',
    event_type: 'offline',
    attendees_count: 75,
    max_attendees: 80,
    event_category: 'Meetup',
    is_featured: false,
    registration_url: 'https://example.com/register',
    price: { type: 'free' },
    sample_image: PREMIUM_IMAGES[4],
    host: { name: 'Tech Community LA', avatar: 'https://i.pravatar.cc/150?img=5' }
  },
  {
    id: 'webinar-ai-future',
    title: 'The Future of AI: Trends and Implications',
    content: JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Explore the latest developments in artificial intelligence and their impact on business, society, and the future of work.' }]
        }
      ]
    }),
    status: 'published',
    author_id: 'expert-1',
    space_id: '',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    cms_type: 'event',
    site_id: '',
    event_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    event_location: 'Online',
    event_description: 'Insights into the future of artificial intelligence',
    event_status: 'upcoming',
    event_type: 'online',
    attendees_count: 180,
    max_attendees: 300,
    event_category: 'Webinar',
    is_featured: true,
    registration_url: 'https://example.com/register',
    price: { type: 'free' },
    sample_image: PREMIUM_IMAGES[5],
    host: { name: 'AI Research Institute', avatar: 'https://i.pravatar.cc/150?img=6' }
  }
];

export function EventContent({ siteSD, space, site, eventsLayout, cardSize, cardStyle, isWidgetMode = false }: EventContentProps) {
  const [, setLocation] = useLocation();
  const [events, setEvents] = useState<EnhancedEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  
  // Widget visibility state
  const [widgetVisibility, setWidgetVisibility] = useState<Record<string, boolean>>({
    featuredEvents: true,
    eventsContainer: true,
    categories: true
  });
  
  // Controls state
  const [advancedSorts, setAdvancedSorts] = useState<Sort[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<Filter[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // Map eventsLayout to viewMode
  const getViewModeFromLayout = useCallback((layout: string) => {
    switch (layout) {
      case 'card': return 'grid';
      case 'list': return 'list';
      case 'calendar': return 'calendar';
      default: return 'grid';
    }
  }, []);

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'calendar'>(() => 
    getViewModeFromLayout(eventsLayout || 'card')
  );
  const [isViewModeOpen, setIsViewModeOpen] = useState(false);

  // Get space info for debugging
  const spaceInfo = useMemo(() => getSpaceInfo(space), [space]);
  
  // Fetch events data - optimized
  const fetchEventsData = useCallback(async () => {
    if (!site?.id || !space?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await fetchContentData({
        siteId: site.id,
        spaceId: space.id,
        cmsType: 'event'
      });
      
      if (data.length > 0) {
        // Transform basic data to enhanced events
        const enhancedEvents = data.map((event, index) => ({
          ...event,
          event_date: event.event_metadata?.event_date || new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
          event_location: event.event_metadata?.event_location || 'Online',
          event_description: event.event_metadata?.event_description || 'Join us for this amazing event',
          event_status: 'upcoming' as const,
          event_type: 'online' as const,
          attendees_count: event.event_metadata?.attendees_count || Math.floor(Math.random() * 100) + 20,
          max_attendees: event.event_metadata?.max_attendees || 100,
          event_category: 'Conference',
          is_featured: index < 2,
          sample_image: PREMIUM_IMAGES[index % PREMIUM_IMAGES.length],
          host: { name: 'Event Host', avatar: `https://i.pravatar.cc/150?img=${index + 1}` }
        }));
        
        setEvents(enhancedEvents);
        setUseMockData(false);
      } else {
        // Use mock data when no real data
        setEvents(MOCK_ENHANCED_EVENTS.map(event => ({
          ...event,
          space_id: space.id,
          site_id: site.id
        })));
        setUseMockData(true);
      }
    } catch (err) {
      setError('Failed to load events. Using demo data as a fallback.');
      
      // Fall back to mock data on error
      setEvents(MOCK_ENHANCED_EVENTS.map(event => ({
        ...event,
        space_id: space.id,
        site_id: site.id
      })));
      setUseMockData(true);
    } finally {
      setIsLoading(false);
    }
  }, [site?.id, space?.id]);

  // Fetch events when component mounts
  useEffect(() => {
    fetchEventsData();
  }, [fetchEventsData]);

  // Sync viewMode with eventsLayout prop
  useEffect(() => {
    if (eventsLayout) {
      const newViewMode = getViewModeFromLayout(eventsLayout);
      setViewMode(newViewMode);
      console.log('ViewMode synced with eventsLayout:', eventsLayout, '->', newViewMode);
    }
  }, [eventsLayout, getViewModeFromLayout]);

  // Grid classes based on card size
  const gridClasses = useMemo(() => {
    const classes = (() => {
      switch (cardSize) {
        case 'small': 
          return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'; // 4 cards per row
        case 'medium': 
          return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'; // 3 cards per row
        case 'large': 
          return 'grid grid-cols-1 lg:grid-cols-2 gap-8'; // 2 cards per row
        case 'extra_large': 
          return 'grid grid-cols-1 gap-10'; // 1 card per row
        default: 
          return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'; // default medium
      }
    })();
    
    console.log('Grid classes updated for cardSize:', cardSize, '->', classes);
    return classes;
  }, [cardSize]);

  // Optimized event handlers
  const handleNewEvent = useCallback(() => {
    setLocation(`/site/${siteSD}/${space.slug}/create`);
  }, [setLocation, siteSD, space?.slug]);

  const handleViewEvent = useCallback((eventId: string) => {
    setLocation(`/site/${siteSD}/${space.slug}/${eventId}`);
  }, [setLocation, siteSD, space?.slug]);

  const handleCategoryClick = useCallback((categoryTitle: string) => {
    // Add filter for the selected category
    const newFilter: Filter = {
      id: `category-${Date.now()}`,
      type: 'Category' as any,
      operator: 'is' as any,
      value: [categoryTitle]
    };
    setAdvancedFilters(prev => [...prev, newFilter]);
  }, []);

  // Widget action handlers
  const handleWidgetSettings = useCallback((widgetName: string) => {
    console.log(`Opening settings for ${widgetName} widget`);
    // TODO: Open widget settings modal/panel
  }, []);

  const toggleWidgetVisibility = useCallback((widgetName: string) => {
    setWidgetVisibility(prev => ({
      ...prev,
      [widgetName]: !prev[widgetName]
    }));
  }, []);

  const handleWidgetDelete = useCallback((widgetName: string) => {
    console.log(`Removing ${widgetName} widget`);
    setWidgetVisibility(prev => ({
      ...prev,
      [widgetName]: false
    }));
  }, []);

  // Filter and sort events - optimized with useMemo
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = [...events];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.event_description?.toLowerCase().includes(query) ||
        event.event_location?.toLowerCase().includes(query) ||
        event.event_category.toLowerCase().includes(query)
      );
    }
    
    // Apply advanced filters
    advancedFilters.forEach(filter => {
      if (filter.value.length === 0) return;
      
      switch (filter.type) {
        case 'Status':
          filtered = filtered.filter(event => filter.value.includes(event.event_status));
                    break;
        case 'Category':
          filtered = filtered.filter(event => filter.value.includes(event.event_category));
                    break;
        case 'Event Type':
          filtered = filtered.filter(event => filter.value.includes(event.event_type));
                    break;
        case 'Filter Featured':
          filtered = filtered.filter(event => 
            filter.value.includes('Featured') ? event.is_featured : !event.is_featured
          );
            break;
      }
    });
    
    // Apply sorting
    advancedSorts.forEach(sort => {
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        switch (sort.field) {
          case SortField.DATE:
            aValue = new Date(a.event_date || 0).getTime();
            bValue = new Date(b.event_date || 0).getTime();
            break;
          case SortField.TITLE:
            aValue = a.title.toLowerCase();
            bValue = b.title.toLowerCase();
            break;
          case SortField.ATTENDEES:
            aValue = a.attendees_count;
            bValue = b.attendees_count;
            break;
          default:
            return 0;
        }
        
        if (sort.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    });
    
    return filtered;
  }, [events, searchQuery, advancedFilters, advancedSorts]);

  // Get featured events for the widget
  const featuredEvents = useMemo(() => 
    events.filter(event => event.is_featured).slice(0, 4), 
    [events]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600 dark:text-primary-400" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading events...</span>
      </div>
    );
  }

  if (error && !useMockData) {
    return (
      <Card className="text-center p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <CardContent className="pt-6">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={fetchEventsData}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="events-content space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mr-2">
            Events
          </h1>
          {useMockData && (
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
              Demo Data
            </span>
          )}
        </div>
        <Button variant="outline" onClick={fetchEventsData} disabled={isLoading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Featured Events Section */}
      {featuredEvents.length > 0 && (
        <GeneralWidgetPopover
          widgetName="Featured Events"
          widgetType="widget"
          isHidden={!widgetVisibility.featuredEvents}
          onSettings={() => handleWidgetSettings('featuredEvents')}
          onToggleVisibility={() => toggleWidgetVisibility('featuredEvents')}
          onDelete={() => handleWidgetDelete('featuredEvents')}
          isWidgetMode={isWidgetMode}
        >
          <section className="featured-events" data-section-name="Featured Events">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Featured Events
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Don't miss these highlighted events from our community
              </p>
            </div>
            <FeaturedEventWidget isDashboard={isWidgetMode} />
          </section>
        </GeneralWidgetPopover>
      )}

      {/* Events Controls & Display */}
      <GeneralWidgetPopover
        widgetName="Events Container"
        widgetType="main"
        isHidden={!widgetVisibility.eventsContainer}
        onSettings={() => handleWidgetSettings('eventsContainer')}
        onToggleVisibility={() => toggleWidgetVisibility('eventsContainer')}
        onDelete={() => handleWidgetDelete('eventsContainer')}
        isWidgetMode={isWidgetMode}
      >
        <section className="events-container" data-section-name="Events content">
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
          
          {/* Events Display */}
          {filteredAndSortedEvents.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent className="pt-6">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No Events Found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchQuery || advancedFilters.length > 0 
                    ? "Try adjusting your search or filters" 
                    : "Create your first event to get started"}
                </p>
                <Button onClick={handleNewEvent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="events-display mt-6">
              {viewMode === 'calendar' ? (
                <InteractiveCalendar events={filteredAndSortedEvents} siteSD={siteSD} spaceSlug={space.slug} />
              ) : viewMode === 'list' ? (
                <div className="relative">
                  {filteredAndSortedEvents.map((event, index) => (
                    <EventListItem 
                      key={event.id}
                      event={event}
                      index={index}
                      filteredEvents={filteredAndSortedEvents}
                      onEventClick={handleViewEvent}
                    />
                  ))}
                </div>
              ) : (
                <LayoutGroup>
                  <motion.div 
                    key={cardSize} // Force re-render on cardSize change
                    className={gridClasses}
                    layout
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    transition={{ 
                      layout: { duration: 0.4, ease: "easeInOut" },
                      opacity: { duration: 0.3 }
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {filteredAndSortedEvents.map(event => (
                        <motion.div
                          key={`${event.id}-${cardStyle}`}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{
                            layout: { duration: 0.4, ease: "easeInOut" },
                            opacity: { duration: 0.3, delay: 0.1 },
                            y: { duration: 0.3, delay: 0.1 }
                          }}
                        >
                          <EventCard
                            event={event}
                            onEventClick={handleViewEvent}
                            isDashboard={isWidgetMode}
                            cardStyle={cardStyle}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </LayoutGroup>
              )}
            </div>
          )}
        </section>
      </GeneralWidgetPopover>

      {/* Categories Section */}
      <GeneralWidgetPopover
        widgetName="Event Categories"
        widgetType="widget"
        isHidden={!widgetVisibility.categories}
        onSettings={() => handleWidgetSettings('categories')}
        onToggleVisibility={() => toggleWidgetVisibility('categories')}
        onDelete={() => handleWidgetDelete('categories')}
        isWidgetMode={isWidgetMode}
      >
        <section className="categories" data-section-name="Event Categories">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Browse by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Find events that match your interests
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CATEGORIES.map((category, index) => (
              <CategoryCard
                key={index}
                icon={category.icon}
                title={category.title}
                count={category.count}
                colorScheme={category.colorScheme}
                onClick={() => handleCategoryClick(category.title)}
              />
            ))}
          </div>
        </section>
      </GeneralWidgetPopover>
    </div>
  );
}