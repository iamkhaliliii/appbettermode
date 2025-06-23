import React from 'react';
import { Badge } from '@/components/ui/primitives';
import { AvatarGroup } from '@/components/ui/avatar';
import { ArrowRight, Pin, Star, MapPin } from 'lucide-react';
import { EnhancedEvent } from './types';

interface EventListItemProps {
  event: EnhancedEvent;
  index: number;
  filteredEvents: EnhancedEvent[];
  onEventClick: (eventId: string) => void;
}

export const EventListItem: React.FC<EventListItemProps> = ({ 
  event, 
  index, 
  filteredEvents, 
  onEventClick 
}) => {
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
  
  // Check if this is the first event of a new day or if it's a pinned event
  const isPinnedEvent = event.id === 'pinned-workshop';
  const isFirstPinnedEvent = isPinnedEvent && index === 0;
  const isNewDay = !isPinnedEvent && (index === 0 || 
    (filteredEvents[index - 1] && 
     new Date(filteredEvents[index - 1].event_date || '').toDateString() !== eventDate.toDateString()));
  
  // Also check if this is the first regular event after pinned events
  const isFirstRegularEvent = !isPinnedEvent && index > 0 && filteredEvents[index - 1]?.id === 'pinned-workshop';
  
  return (
    <div key={event.id} className="relative">
      {/* Date Header or Pinned Events Header */}
      {(isNewDay || isFirstPinnedEvent || isFirstRegularEvent) && (
        <div className="sticky top-20 z-20 flex justify-start py-2 mb-3">
          <div className="inline-flex items-center gap-2.5 bg-white/50 dark:bg-gray-900/90 backdrop-blur-md rounded-full px-3.5 py-1.5 border border-gray-200/50 dark:border-gray-800/50 shadow-lg -ml-3.5">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              isPinnedEvent ? 'bg-yellow-500' : 
              isPast ? 'bg-gray-300' : 
              'bg-blue-500'
            }`} />
            <h3 className={`font-semibold text-sm ${isPast && !isPinnedEvent ? 'text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
              {isPinnedEvent ? 'Pinned Events' : dateLabel}
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
          className={`group bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 cursor-pointer ${isPast ? 'opacity-80 grayscale' : ''}`}
          onClick={() => onEventClick(event.id)}
        >
          <div className="flex items-start gap-5">
            {/* Event Info */}
            <div className="flex-1 min-w-0">
              {/* Category, Time and Status */}
              <div className="flex items-center gap-3 mb-2">
                {/* Pin Badge for pinned event */}
                {event.id === 'pinned-workshop' && (
                  <div className="bg-gray-200/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-md p-1 shadow-sm">
                    <Pin className="w-3 h-3" />
                  </div>
                )}
                {/* Category Badge */}
                <Badge className="bg-gray-200/50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-[0.75rem] px-1.5 py-0.5 font-medium border-0 rounded-md">
                  {event.event_category}
                </Badge>
                
                {/* Date and Time for pinned events, Time only for others */}
                <span className={`text-[0.7rem] font-medium ${isPast ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  {event.id === 'pinned-workshop' ? `${dateLabel} • ${timeLabel}` : timeLabel}
                </span>
                
                {/* Other Status Badges */}
                <div className="flex items-center gap-2">
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
              <h4 className={`font-semibold text-[1.4rem] mb-4 mt-2 line-clamp-2 ${isPast ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                {event.title} <ArrowRight className="inline w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300 ml-1" />
              </h4>
              
              {/* Attendees, Host and Location Info */}
              <div className="flex items-center gap-2 text-[0.8rem] text-gray-600 dark:text-gray-400">
                {/* Attendees */}
                <div className="flex items-center gap-2">
                  <AvatarGroup
                    members={Array.from({ length: Math.min(event.attendees_count, 10) }).map((_, index) => ({
                      username: `user${index + 1}`,
                      src: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`
                    }))}
                    limit={5}
                    size={26}
                  />
                </div>
                
                <div className="flex items-center gap-1 bg-gray-200/50 dark:bg-gray-800 rounded-full px-2 py-1">
                  <img 
                    src={event.host?.avatar || 'https://i.pravatar.cc/150?img=1'}
                    alt="Host"
                    className="w-5 h-5 rounded-full border border-gray-100 dark:border-gray-700"
                  />
                  <span>By <span className="font-semibold">{event.host?.name || 'Event Host'}</span></span>
                </div>
                
                {event.event_location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-[120px]">{event.event_location}</span>
                  </div>
                )}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 