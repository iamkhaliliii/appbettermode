import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CountdownTimer } from './CountdownTimer';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { ArrowRight, Clock, MapPin, Calendar } from 'lucide-react';

const events = [
  {
    id: 1,
    title: "Global AI & Machine Learning Summit: Transforming Industries with Intelligent Technology",
    subtitle: "Future of AI & Innovation",
    category: "Conference",
    date: "Feb 15, 2025 • 10:00 AM",
    location: "San Francisco, CA",
    attendees: 245,
    host: { name: "Tech Leaders Inc", avatar: "https://i.pravatar.cc/150?img=10" },
    countdown: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=400&fit=crop&crop=center&auto=format&q=80",
    squareImage: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=400&fit=crop&crop=center&auto=format&q=80"
  },
  {
    id: 2,
    title: "Digital Marketing",
    subtitle: "Growth Strategies & Analytics",
    category: "Summit",
    date: "Feb 20, 2025 • 9:00 AM",
    location: "New York, NY",
    attendees: 180,
    host: { name: "Marketing Hub", avatar: "https://i.pravatar.cc/150?img=20" },
    countdown: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=400&fit=crop&crop=center&auto=format&q=80",
    squareImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop&crop=center&auto=format&q=80"
  },
  {
    id: 3,
    title: "Advanced UX/UI Design Masterclass: Creating User-Centered Digital Experiences That Convert",
    subtitle: "UI/UX Best Practices",
    category: "Workshop",
    date: "Feb 25, 2025 • 2:00 PM",
    location: "Los Angeles, CA",
    attendees: 120,
    host: { name: "Design Academy", avatar: "https://i.pravatar.cc/150?img=30" },
    countdown: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=400&fit=crop&crop=center&auto=format&q=80",
    squareImage: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop&crop=center&auto=format&q=80"
  },
  {
    id: 4,
    title: "Startup Pitch Night",
    subtitle: "Innovation & Investment",
    category: "Networking",
    date: "Mar 30, 2025 • 7:00 PM",
    location: "Austin, TX",
    attendees: 300,
    host: { name: "Startup Network", avatar: "https://i.pravatar.cc/150?img=40" },
    countdown: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
    image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=1200&h=400&fit=crop&crop=center&auto=format&q=80",
    squareImage: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=400&h=400&fit=crop&crop=center&auto=format&q=80"
  }
];

export const FeaturedEventWidget: React.FC = () => {
  const [activeEventId, setActiveEventId] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeEvent = events.find(event => event.id === activeEventId) || events[0];

  // Auto-advance functionality
  useEffect(() => {
    const startAutoAdvance = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      
      // Progress bar animation
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            // When progress reaches 100%, advance to next slide
            setActiveEventId(current => {
              const currentIndex = events.findIndex(event => event.id === current);
              const nextIndex = (currentIndex + 1) % events.length;
              return events[nextIndex].id;
            });
            return 0;
          }
          return prev + (100 / 50); // 50 steps for 5 seconds (100ms intervals)
        });
      }, 100);
    };

    const stopAutoAdvance = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };

    if (!isPaused) {
      startAutoAdvance();
    } else {
      stopAutoAdvance();
    }

    return () => {
      stopAutoAdvance();
    };
  }, [isPaused]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const handleManualNavigation = (eventId: number) => {
    setActiveEventId(eventId);
    setProgress(0);
    // Ensure auto-advance restarts from 0 when manually navigating
    if (!isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      
      // Restart progress immediately
      progressIntervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setActiveEventId(current => {
              const currentIndex = events.findIndex(event => event.id === current);
              const nextIndex = (currentIndex + 1) % events.length;
              return events[nextIndex].id;
            });
            return 0;
          }
          return prev + (100 / 50);
        });
      }, 100);
    }
  };

  return (
    <div className="w-full">
      {/* Enhanced container with better shadows and transitions */}
      <div 
        className="group relative overflow-hidden bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-500 rounded-xl shadow-sm hover:shadow-xl hover:shadow-gray-200/20 dark:hover:shadow-gray-950/40"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        
        {/* Wide banner with enhanced blurred background */}
        <div className="relative overflow-hidden rounded-xl h-[24rem]">
          
          {/* Enhanced Blurred Background Image with better overlay */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.img 
                key={activeEvent.id}
                src={activeEvent.image}
                alt={activeEvent.title}
                className="w-full h-full object-cover blur-lg scale-110 group-hover:scale-115"
                initial={{ opacity: 0, scale: 1.2 }}
                animate={{ opacity: 1, scale: 1.1 }}
                exit={{ opacity: 0, scale: 1.0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </AnimatePresence>
            {/* Multi-layer gradient overlay for better depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
          
          {/* Content Layout */}
          <div className="relative z-10 h-full flex flex-col">
            
            {/* Main Content Area */}
            <div className="flex-1 flex gap-8 p-[2rem]">
              
              {/* Left Column - Content */}
              <div className="flex-1 flex flex-col">
                
                {/* Top Section - Countdown */}
                <div className="flex-shrink-0 self-start mb-auto">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={`countdown-${activeEvent.id}`}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <CountdownTimer targetDate={activeEvent.countdown} />
                    </motion.div>
                  </AnimatePresence>
                </div>
                
                {/* Bottom Section - Content */}
                <div className="space-y-1 transition-all duration-500 ease-in-out">
                  
                  <div className="flex items-center gap-2"> 

                    {/* Host Information */}
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={`host-${activeEvent.id}`}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: "easeInOut", delay: 0.05 }}
                      >
                        <img 
                          src={activeEvent.host?.avatar || 'https://i.pravatar.cc/150?img=1'}
                          alt="Host"
                          className="w-6 h-6 rounded-full border border-gray-100/20 dark:border-gray-700"
                        />
                        <span className="text-sm text-white/60 dark:text-gray-100">By <span className="font-semibold">{activeEvent.host?.name || 'Event Host'}</span></span>
                      </motion.div>
                    </AnimatePresence>

                  </div>
                    
                  {/* Enhanced Title with better hierarchy */}
                  <div className="space-y-5">
                    <div className="flex items-center gap-2">
                      <AnimatePresence mode="wait">
                        <motion.h3 
                          key={`title-${activeEvent.id}`}
                          className="font-bold text-[1.8rem] text-white leading-tight drop-shadow-lg group-hover:text-white/80 transition-colors duration-300 line-clamp-2"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                          title={activeEvent.title}
                        >
                          {activeEvent.title}
                        </motion.h3>
                      </AnimatePresence>
                    </div>
                    

                    {/* Attendees under title */}
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={`attendees-${activeEvent.id}`}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: "easeInOut", delay: 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          {/* RSVP Button */}
                          <button className="flex items-center gap-2 rounded-full border border-white/20 bg-white/30 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 shadow shadow-black/5 transition-all duration-200 hover:scale-105 group">
                            <span className="text-xs font-medium text-white group-hover:text-white/90">RSVP Now →</span>
                          </button>
                          
                          {/* Attendees */}
                          <motion.div 
                            key={`host-${activeEvent.id}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, ease: "easeInOut", delay: 0.05 }}
                            className="flex items-center"
                          >
                            <div className="flex -space-x-1">
                              {Array.from({ length: Math.min(5, activeEvent.attendees) }).map((_, index) => (
                                <img
                                  key={index}
                                  className="rounded-full ring-1 ring-white/30"
                                  src={`https://i.pravatar.cc/150?img=${(index % 70) + 1}`}
                                  width={20}
                                  height={20}
                                  alt={`Avatar ${index + 1}`}
                                />
                              ))}
                            </div>
                            <p className="px-2 text-xs text-white/90">
                              <strong className="font-medium text-white/60 ">+{activeEvent.attendees}</strong> attending.
                            </p>
                          </motion.div>

                        </div>
                      </motion.div>
                    </AnimatePresence>
 
                  </div>
                  

                </div>
              </div>
              
              {/* Right Column - Clear Square Image */}
              <div className="flex-shrink-0 flex items-center justify-center">
                <div className="relative w-[16rem] h-[16rem] rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 ring-1 ring-black/5">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={`square-${activeEvent.id}`}
                      src={activeEvent.squareImage}
                      alt={activeEvent.title}
                      className="w-full h-full object-cover group-hover:scale-105"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </AnimatePresence>
                  
                  {/* Category Badge - Top Left */}
                  <div className="absolute top-3 left-3 z-[12]">
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={`category-badge-${activeEvent.id}`}
                        className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white border border-white/20 text-xs px-2 py-1 font-medium rounded-lg shadow-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      >
                        <Calendar className="w-3 h-3" />
                        <span>{activeEvent.category}</span>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                  
                  {/* Progressive Blur Effect */}
                  <ProgressiveBlur
                    className="pointer-events-none absolute bottom-0 left-0 h-[35%] w-full rounded-b-xl"
                    blurIntensity={9}
                    direction="bottom"
                  />
                  
                  {/* Meta Information Overlay */}
                  <div className="absolute bottom-0 rounded-b-lg left-0 right-0 bg-gradient-to-t from-gray-900/50 via-gray-900/10 to-transparent p-3">
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={`overlay-meta-${activeEvent.id}`}
                        className="space-y-1.5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
                      >
                        <div className="flex items-center gap-1.5 text-xs text-white/90">
                          <Clock className="w-3 h-3" />
                          <span className="font-semibold">{activeEvent.date}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xs text-white/90">
                          <MapPin className="w-3 h-3" />
                          <span className="font-semibold">{activeEvent.location}</span>
                        </div>
                      </motion.div>

                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Timeline */}
            <div className="relative z-[15] h-[1px] bg-white/10 overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-white/10 via-white/40 via-90%  to-transparent"
                initial={{ width: "0%" }}
                animate={{ 
                  width: `${progress}%`
                }}
                transition={{ 
                  duration: isPaused ? 0 : 0.1,
                  ease: "easeOut"
                }}
              />
              {/* Subtle glow effect */}
              <motion.div 
                className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-sm"
                initial={{ x: "-2rem" }}
                animate={{ 
                  x: `calc(${progress}% - 1rem)`
                }}
                transition={{ 
                  duration: isPaused ? 0 : 0.1,
                  ease: "easeOut"
                }}
              />
            </div>
            
            {/* Navigation Bar */}
            <div className="relative z-[15] h-[6rem] bg-black/20 backdrop-blur-md border-t border-white/10">
              <div className="h-full flex items-center justify-start gap-3 px-6">
                {events.map((event) => (
                  <motion.button
                    key={event.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleManualNavigation(event.id);
                    }}
                    className={`
                      flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer relative z-[16]
                      ${activeEventId === event.id 
                        ? 'border-white shadow-lg' 
                        : 'border-white/30 hover:border-white/60'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ 
                      scale: activeEventId === event.id ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <img 
                      src={event.squareImage}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Subtle shine effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[8] pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </div>
        </div>
      </div>
    </div>
  );
}; 