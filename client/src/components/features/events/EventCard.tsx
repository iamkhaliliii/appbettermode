import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/primitives';
import { Badge } from '@/components/ui/primitives';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { ArrowRight, Pin, Star, MapPin, Users } from 'lucide-react';
import { EnhancedEvent } from './types';

interface EventCardProps {
  event: EnhancedEvent;
  onEventClick: (eventId: string) => void;
  isDashboard?: boolean;
  cardStyle?: string;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onEventClick, isDashboard = false, cardStyle = 'modern' }) => {
  const isUpcoming = event.event_status === 'upcoming';
  const isOngoing = event.event_status === 'ongoing';
  const isPast = event.event_status === 'past';
  
  if (cardStyle === 'simple') {
    // Simple Card Style - Text below image
    return (
      <motion.div
        key={`${event.id}-simple`}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ 
          duration: 0.4, 
          ease: [0.25, 0.46, 0.45, 0.94],
          layout: { duration: 0.3 }
        }}
        layout
      >
        <Card 
          className={`group event-card bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 cursor-pointer shadow-sm hover:shadow-md ${isPast ? 'opacity-70 grayscale' : ''}`}
          onClick={() => onEventClick(event.id)}
        >
        {/* Image Section */}
        <div className="relative overflow-hidden rounded-t-lg aspect-[4/3]">
          <img 
            src={event.sample_image} 
            alt={event.title}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${isPast ? 'grayscale' : ''}`}
          />
          
          {/* Only badges on image, no text overlay */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            {event.id === 'pinned-workshop' && (
              <div className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white rounded-md p-1.5 shadow-sm">
                <Pin className="w-3 h-3" />
              </div>
            )}
            <Badge className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white text-[0.65rem] px-1.5 py-0.5 font-medium shadow-sm border-0 rounded-md">
              {event.event_category}
            </Badge>
            {event.is_featured && !isOngoing && !isPast && (
              <Badge className="bg-blue-600 text-white text-xs px-1.5 py-1 font-medium shadow-lg">
                <Star className="w-3 h-3 fill-current" />
              </Badge>
            )}
            {isOngoing && (
              <Badge className="bg-red-600 text-white text-xs px-2 py-1 font-medium shadow-lg">
                Live
              </Badge>
            )}
          </div>

          {/* Date Badge - Top Right */}
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white rounded-lg px-2 py-1.5 shadow-sm">
              {event.event_date ? (
                <div className="text-center">
                  <div className="text-[0.6rem] font-medium uppercase tracking-wider opacity-70">
                    {event.id === 'pinned-workshop' ? 'Jan' : new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-[0.75rem] font-bold leading-none">
                    {event.id === 'pinned-workshop' ? '22' : new Date(event.event_date).getDate()}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-xs font-medium">TBA</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Text Content Below Image */}
        <div className="p-4 space-y-3">
          {/* Past Badge */}
          {isPast && (
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Past Event
            </span>
          )}

          {/* Title */}
          <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {event.title}
            <ArrowRight className="inline w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300 ml-1" />
          </h3>
          
          {/* Description */}
          {event.event_description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {event.event_description}
            </p>
          )}
          
          {/* Location and Attendees */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              {event.event_location && (
                <>
                  <MapPin className="w-4 h-4" />
                  <span className="truncate max-w-[120px]">{event.event_location}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span className="font-medium">{event.attendees_count}</span>
            </div>
          </div>
        </div>
      </Card>
      </motion.div>
    );
  }

  // Modern Style (default) - Text overlay on image
  return (
    <motion.div
      key={`${event.id}-modern`}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94],
        layout: { duration: 0.3 }
      }}
      layout
    >
    <Card 
        className={`group event-card relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 cursor-pointer shadow-sm hover:shadow-md ${isPast ? 'opacity-70 grayscale' : ''}`}
      onClick={() => onEventClick(event.id)}
    >
      {/* Image with All Content Overlay */}
      <div className="relative overflow-hidden rounded-lg aspect-[1/1]">
        <img 
          src={event.sample_image} 
          alt={event.title}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${isPast ? 'grayscale' : ''}`}
        />
        
        {/* Progressive Blur Effect */}
        {isDashboard ? null : (
        <ProgressiveBlur
          className="pointer-events-none absolute bottom-0 left-0 h-[40%] w-full"
          blurIntensity={8}
          direction="bottom"
        />
        )}
        
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10" />
        
        {/* Category and Status Badges - Top Left */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {/* Pin Badge for pinned event */}
            {event.id === 'pinned-workshop' && (
              <div className="bg-white/10 backdrop-blur-sm text-white rounded-md p-1.5 shadow-sm">
                <Pin className="w-3 h-3" />
              </div>
            )}
            <Badge className="bg-black/50 backdrop-blur-sm text-white text-[0.65rem] px-1.5 py-0.5 font-medium shadow-sm border-0 rounded-md">
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
                  {event.id === 'pinned-workshop' ? 'Jan' : new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}
                </div>
                <div className="text-[0.75rem] font-bold leading-none">
                  {event.id === 'pinned-workshop' ? '22' : new Date(event.event_date).getDate()}
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

            {/* Title */}
            <h3 className="font-bold text-sm text-white line-clamp-2 drop-shadow-lg">
              {event.title} <ArrowRight className="inline w-4 h-4 text-white/80 group-hover:text-white opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300 ml-1" />
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
                <Users className="w-3 h-3" />
                <span className="text-xs font-medium">{event.attendees_count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
    </motion.div>
  );
}; 