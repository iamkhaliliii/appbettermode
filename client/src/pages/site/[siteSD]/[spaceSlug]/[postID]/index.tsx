import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { getApiBaseUrl } from '@/lib/utils';

// Import our minimal components
import {
  EventHeader,
  EventHero,
  EventInfo,
  EventSidebar,
  EventAgenda,
  EventAttendees,
  EventLoadingState,
  EventErrorState
} from '@/components/features/events/event-details';

// Minimal UI components
import { Users, Calendar, MapPin, ArrowUp } from 'lucide-react';

// Types
interface EventDetails {
  id: string;
  title: string;
  description: string;
  event_description?: string;
  event_date?: string;
  event_location?: string;
  event_type?: 'online' | 'in-person' | 'hybrid';
  event_category?: string;
  event_status?: 'upcoming' | 'ongoing' | 'completed';
  attendees_count?: number;
  max_attendees?: number;
  is_featured?: boolean;
  price?: {
    type: 'free' | 'paid';
    amount?: number;
    currency?: string;
  };
  organizer?: {
    name: string;
    avatar: string;
    bio: string;
    email: string;
    phone?: string;
  };
  images?: string[];
  tags?: string[];
  agenda?: {
    time: string;
    title: string;
    speaker?: string;
    description?: string;
  }[];
  attendees?: {
    id: string;
    name: string;
    avatar: string;
    role?: string;
  }[];
  hosts?: {
    id: string;
    name: string;
    avatar: string;
    role?: string;
  }[];
  location_details?: {
    address: string;
    map_url?: string;
    parking_info?: string;
    accessibility?: string;
  };
  requirements?: string[];
  what_to_bring?: string[];
  contact_info?: {
    email: string;
    phone?: string;
    website?: string;
  };
}

// Ultra-minimal Loading Component
const MinimalLoadingState = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="space-y-4">
        <div className="h-14 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
        <div className="aspect-[2/1] bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Compact Quick Stat

// Minimal Scroll to Top
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.pageYOffset > 300);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-gray-900 text-white dark:bg-white dark:text-gray-900 rounded-full flex items-center justify-center shadow-lg transition-opacity hover:opacity-80"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
};

export default function EventDetailsPage() {
  const { siteSD, spaceSlug, postID } = useParams();
  const [, setLocation] = useLocation();
  
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRSVPed, setIsRSVPed] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Navigation handlers
  const handleBack = () => setLocation(`/site/${siteSD}/${spaceSlug}`);
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };
  const handleFavorite = () => setIsFavorited(!isFavorited);
  const handleRSVP = () => setIsRSVPed(!isRSVPed);
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    fetchEventDetails();
  };

  // Fetch event details
  const fetchEventDetails = async () => {
    if (!postID || !siteSD || !spaceSlug) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const API_BASE = getApiBaseUrl();
      
      // Get site information
      const siteResponse = await fetch(`${API_BASE}/api/v1/sites/${siteSD}`);
      if (!siteResponse.ok) throw new Error('Site not found');
      const siteData = await siteResponse.json();
      
      // Get site spaces
      const spacesResponse = await fetch(`${API_BASE}/api/v1/sites/${siteData.id}/spaces`);
      if (!spacesResponse.ok) throw new Error('Could not load spaces');
      const spaces = await spacesResponse.json();
      
      // Find the space by slug
      const space = spaces.find((s: any) => s.slug === spaceSlug);
      if (!space) throw new Error('Space not found');
      
      // Get all events for this space
      const eventsResponse = await fetch(
        `${API_BASE}/api/v1/posts/site/${siteData.id}?cmsType=event&status=published&limit=50&spaceId=${space.id}`
      );
      
      if (!eventsResponse.ok) throw new Error('Could not load events');
      const events = await eventsResponse.json();
      
      // Find the specific event by ID
      const eventPost = Array.isArray(events) ? events.find((e: any) => e.id === postID) : null;
      if (!eventPost) throw new Error('Event not found');
      
      // Transform API data
      const eventData: EventDetails = {
        id: eventPost.id || postID,
        title: eventPost.title || 'Event Title',
        description: eventPost.content?.event_description || eventPost.description || '',
        event_description: eventPost.content?.event_description,
        event_date: eventPost.content?.event_date,
        event_location: eventPost.content?.event_location || 'Location TBA',
        event_type: eventPost.content?.event_type || 'in-person',
        event_category: eventPost.content?.event_category || 'General',
        event_status: eventPost.content?.event_status || 'upcoming',
        attendees_count: eventPost.content?.attendees_count || Math.floor(Math.random() * 100) + 10,
        max_attendees: eventPost.content?.max_attendees || 200,
        is_featured: eventPost.content?.is_featured || false,
        price: eventPost.content?.price || { type: 'free' },
        
        // Enhanced details
        organizer: {
          name: 'Sarah Johnson',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4c0?w=100&h=100&fit=crop&crop=face',
          bio: 'Community Manager & Event Organizer',
          email: 'sarah@company.com',
          phone: '+1 (555) 123-4567'
        },
        images: [
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop',
          'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop'
        ],
        tags: ['networking', 'tech', 'community', 'workshop'],
        agenda: [
          { time: '9:00 AM', title: 'Registration & Coffee', description: 'Welcome reception with networking' },
          { time: '9:30 AM', title: 'Opening Keynote', speaker: 'John Smith', description: 'Future of Technology' },
          { time: '11:00 AM', title: 'Workshop Session 1', speaker: 'Multiple Speakers', description: 'Hands-on technical workshops' },
          { time: '12:30 PM', title: 'Lunch Break', description: 'Networking lunch with refreshments' },
          { time: '2:00 PM', title: 'Panel Discussion', speaker: 'Industry Experts', description: 'Q&A with industry leaders' },
          { time: '3:30 PM', title: 'Closing & Awards', description: 'Wrap up and recognition ceremony' }
        ],
        attendees: [
          { id: '1', name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'Developer' },
          { id: '2', name: 'Maria Garcia', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4c0?w=40&h=40&fit=crop&crop=face', role: 'Designer' },
          { id: '3', name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'Manager' },
          { id: '4', name: 'Lisa Wang', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face', role: 'Engineer' },
          { id: '5', name: 'James Wilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', role: 'Analyst' }
        ],
        hosts: [
          { id: '1', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', role: 'Host' },
          { id: '2', name: 'Jane Smith', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4c0?w=40&h=40&fit=crop&crop=face', role: 'Host' },
          { id: '3', name: 'Michael Brown', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', role: 'Host' },
          { id: '4', name: 'Emily Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face', role: 'Host' },
          { id: '5', name: 'Robert Wilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', role: 'Host' }
        ],
        location_details: {
          address: '123 Tech Hub Street, Innovation District, San Francisco, CA 94105',
          map_url: 'https://maps.google.com/?q=123+Tech+Hub+Street+San+Francisco',
          parking_info: 'Free parking available in the building garage. Street parking also available.',
          accessibility: 'Wheelchair accessible. ASL interpreter available upon request.'
        },
        requirements: ['Laptop with development environment', 'Valid ID for building access', 'Business cards for networking'],
        what_to_bring: ['Notebook and pen', 'Laptop charger', 'Water bottle', 'Comfortable walking shoes'],
        contact_info: {
          email: 'events@company.com',
          phone: '+1 (555) 987-6543',
          website: 'https://company.com/events'
        }
      };
      
      setEvent(eventData);
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError(err instanceof Error ? err.message : 'Failed to load event details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [postID, siteSD, spaceSlug]);

  if (isLoading) return <MinimalLoadingState />;
  if (error || !event) {
    return (
      <EventErrorState
        error={error || 'Event not found'}
        onBack={handleBack}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Minimal Header */}
      <EventHeader
        title={event.title}
        onBack={handleBack}
        onShare={handleShare}
        onFavorite={handleFavorite}
        isFavorited={isFavorited}
      />

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Hero Section */}


          {/* Content Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="grid md:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="md:col-span-2 space-y-6">
              <EventHero
              title={event.title}
              images={event.images || []}
              eventStatus={event.event_status || 'upcoming'}
              eventType={event.event_type || 'in-person'}
              isFeatured={event.is_featured}
            />
                <EventInfo
                  title={event.title}
                  description={event.description}
                  eventDescription={event.event_description}
                  eventDate={event.event_date}
                  eventLocation={event.event_location}
                  attendeesCount={event.attendees_count}
                  maxAttendees={event.max_attendees}
                  tags={event.tags}
                  price={event.price}
                  requirements={event.requirements}
                  whatToBring={event.what_to_bring}
                />

                {event.agenda && event.agenda.length > 0 && (
                  <EventAgenda agenda={event.agenda} />
                )}

                {event.attendees && event.attendees.length > 0 && (
                  <EventAttendees
                    attendees={event.attendees}
                    totalCount={event.attendees_count || 0}
                    maxAttendees={event.max_attendees || 0}
                  />
                )}
              </div>

              {/* Sidebar */}
              <div className="md:col-span-1">
                <div className="sticky top-20">
                  <EventSidebar
                    eventDate={event.event_date}
                    eventLocation={event.event_location}
                    attendeesCount={event.attendees_count}
                    maxAttendees={event.max_attendees}
                    isRSVPed={isRSVPed}
                    onRSVP={handleRSVP}
                    eventType={event.event_type}
                    price={event.price}
                    contactInfo={event.contact_info}
                    locationDetails={event.location_details}
                    hosts={event.hosts}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
} 