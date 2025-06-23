import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Columns3, Grid, ChevronLeft, ChevronRight, Clock, MapPin, Users, Calendar } from 'lucide-react';
import { useLocation } from 'wouter';

export type EventInfo = {
  id: string;
  date: string;
  time: string;
  title: string;
  participants: string[];
  location: string;
  status: 'upcoming' | 'ongoing' | 'past';
  category: string;
  price?: {
    type: 'free' | 'paid';
    amount?: number;
    currency?: string;
  };
};

export type DayType = {
  day: string;
  classNames: string;
  meetingInfo?: EventInfo[];
};

interface DayProps {
  classNames: string;
  day: DayType;
  onHover: (day: string | null) => void;
}

const Day: React.FC<DayProps> = ({ classNames, day, onHover }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      <motion.div
        className={`relative flex items-center justify-center py-1 ${classNames}`}
        style={{ height: '4rem', borderRadius: 16 }}
        onMouseEnter={() => {
          setIsHovered(true);
          onHover(day.day);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          onHover(null);
        }}
        id={`day-${day.day}`}
      >
        <motion.div className="flex flex-col items-center justify-center">
          {!(day.day[0] === '+' || day.day[0] === '-') && (
            <span className="text-sm text-gray-900 dark:text-white font-medium">{day.day}</span>
          )}
        </motion.div>
        {day.meetingInfo && (
          <motion.div
            className="absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full bg-blue-500 dark:bg-gray-700 p-1 text-[10px] font-bold text-white shadow-sm"
            layoutId={`day-${day.day}-meeting-count`}
            style={{
              borderRadius: 999,
            }}
          >
            {day.meetingInfo.length}
          </motion.div>
        )}

        <AnimatePresence>
          {day.meetingInfo && isHovered && (
            <div className="absolute inset-0 flex size-full items-center justify-center">
              <motion.div
                className="flex size-10 items-center justify-center bg-blue-500 dark:bg-gray-700 p-1 text-xs font-bold text-white shadow-lg"
                layoutId={`day-${day.day}-meeting-count`}
                style={{
                  borderRadius: 999,
                }}
              >
                {day.meetingInfo.length}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

const CalendarGrid: React.FC<{ 
  onHover: (day: string | null) => void;
  days: DayType[]
}> = ({ onHover, days }) => {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, index) => (
        <Day
          key={`${day.day}-${index}`}
          classNames={day.classNames}
          day={day}
          onHover={onHover}
        />
      ))}
    </div>
  );
};

interface InteractiveCalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  events?: any[];
  siteSD?: string;
  spaceSlug?: string;
}

const InteractiveCalendar = React.forwardRef<
  HTMLDivElement,
  InteractiveCalendarProps
>(({ className, events = [], siteSD, spaceSlug, ...props }, ref) => {
  const [moreView, setMoreView] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [, setLocation] = useLocation();

  const handleDayHover = (day: string | null) => {
    setHoveredDay(day);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const monthName = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const handleEventClick = (eventId: string) => {
    if (siteSD && spaceSlug) {
      setLocation(`/site/${siteSD}/${spaceSlug}/${eventId}`);
    }
  };

  // Convert events to calendar format
  const calendarDays = React.useMemo(() => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    
    const days: DayType[] = [];
    
    // Add previous month days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(firstDay);
      prevDate.setDate(prevDate.getDate() - (i + 1));
      days.push({
        day: `-${i + 1}`,
        classNames: 'bg-gray-50 dark:bg-gray-700/20 text-gray-400 dark:text-gray-500'
      });
    }
    
    // Add current month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dayDate = new Date(currentYear, currentMonth, day);
      const dayStr = String(day).padStart(2, '0');
      
      // Find events for this day
      const dayEvents = events.filter(event => {
        if (!event.event_date) return false;
        const eventDate = new Date(event.event_date);
        return eventDate.toDateString() === dayDate.toDateString();
      }).map(event => ({
        id: event.id,
        date: new Date(event.event_date).toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        time: new Date(event.event_date).toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit' 
        }),
        title: event.title,
        participants: [`${event.attendees_count} attendees`],
        location: event.event_location || 'Location TBA',
        status: event.event_status,
        category: event.event_category,
        price: event.price
      }));
      
      const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
      days.push({
        day: dayStr,
        classNames: `${isWeekend ? 'bg-gray-100 dark:bg-gray-700/20' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'} ${dayEvents.length > 0 ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`,
        meetingInfo: dayEvents.length > 0 ? dayEvents : undefined
      });
    }
    
    // Add next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: `+${i}`,
        classNames: 'bg-gray-50 dark:bg-gray-700/20 text-gray-400 dark:text-gray-500'
      });
    }
    
    return days;
  }, [events, currentDate]);

  const sortedDays = React.useMemo(() => {
    if (!hoveredDay) return calendarDays;
    return [...calendarDays].sort((a, b) => {
      if (a.day === hoveredDay) return -1;
      if (b.day === hoveredDay) return 1;
      return 0;
    });
  }, [hoveredDay, calendarDays]);

  // Get events for current month
  const currentMonthEvents = React.useMemo(() => {
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    return events.filter(event => {
      if (!event.event_date) return false;
      const eventDate = new Date(event.event_date);
      return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    });
  }, [events, currentDate]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={ref}
        className={`relative mx-auto flex w-full flex-col items-start justify-center gap-8 lg:flex-row ${className || ''}`}
      >
        <motion.div layout className="w-full max-w-lg">
          <motion.div
            key="calendar-view"
            className="flex w-full flex-col gap-4"
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button
                  onClick={goToPreviousMonth}
                  className="p-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronLeft className="w-3 h-3" />
                </motion.button>
                
                <motion.h2 className="text-sm font-medium text-gray-800 dark:text-zinc-300">
                  {monthName}
                </motion.h2>
                
                <motion.button
                  onClick={goToNextMonth}
                  className="p-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronRight className="w-3 h-3" />
                </motion.button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="px-0/5 rounded-xl bg-gray-100 dark:bg-gray-700 py-1 text-center text-xs text-gray-700 dark:text-white font-medium"
                >
                  {day}
                </div>
              ))}
            </div>
            <CalendarGrid onHover={handleDayHover} days={calendarDays} />
          </motion.div>
        </motion.div>
        {moreView && (
          <motion.div
            className="w-full max-w-xs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              key="more-view"
              className="flex w-full flex-col"
            >
              {/* Enhanced Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {monthName}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Upcoming events this month
                </p>
              </div>

              {/* Enhanced Events List */}
              <motion.div
                className="h-[580px] overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/50 shadow-sm scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
                layout
              >
                <AnimatePresence>
                  {currentMonthEvents.length > 0 ? (
                    currentMonthEvents.map((event, eventIndex) => (
                      <motion.div
                        key={event.id}
                        onClick={() => handleEventClick(event.id)}
                        className="group p-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-200 border-b dark:border-gray-700 last:border-b-0 hover:border-blue-200 dark:hover:border-blue-800"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.2,
                          delay: eventIndex * 0.05,
                        }}
                      >
                        <div className="flex gap-3">
                          {/* Enhanced Cover Image */}
                          <div className="flex-shrink-0 relative">
                            <img 
                              src={event.cover_image_url || event.sample_image || 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=300&fit=crop&crop=center&auto=format&q=80'}
                              alt={event.title}
                              className="w-14 h-14 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow"
                            />
                            {/* Status indicator overlay */}
                            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                              event.event_status === 'upcoming' 
                                ? 'bg-blue-500'
                                : event.event_status === 'ongoing'
                                ? 'bg-green-500'
                                : 'bg-gray-400'
                            }`} />
                          </div>
                          
                          {/* Enhanced Content */}
                          <div className="flex-1 min-w-0">
                            {/* Enhanced Title */}
                            <div className="mb-0">
                              <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {event.title}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {event.event_category}
                              </p>
                            </div>
                        
                            {/* Enhanced Meta Info */}
                            <div className="space-y-2">
                              {/* Primary Info - Date & Time */}
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                                  <span>
                                    {new Date(event.event_date).toLocaleDateString('en-US', { 
                                      month: 'short', 
                                      day: 'numeric' 
                                    })} • {new Date(event.event_date).toLocaleTimeString('en-US', { 
                                      hour: 'numeric', 
                                      minute: '2-digit' 
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-gray-400" />
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">No events yet</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Events will appear here when scheduled
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
});
InteractiveCalendar.displayName = 'InteractiveCalendar';

export default InteractiveCalendar;

const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']; 