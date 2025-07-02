export interface Space {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cms_type: string;
  hidden: boolean;
  visibility: string;
  site_id: string;
}

export interface EnhancedEvent {
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

export interface EventContentProps {
  siteSD: string;
  space: Space;
  site: any;
  eventsLayout?: string;
  cardSize?: string;
  cardStyle?: string;
  isWidgetMode?: boolean;
} 