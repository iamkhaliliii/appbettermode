import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EventHeroProps {
  title: string;
  images: string[];
  eventStatus: 'upcoming' | 'ongoing' | 'completed';
  eventType: 'online' | 'in-person' | 'hybrid';
  isFeatured?: boolean;
}

export const EventHero: React.FC<EventHeroProps> = ({
  title,
  images,
  eventStatus,
  eventType,
  isFeatured
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'ongoing': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'completed': return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="relative">
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900">
        {/* Main Image */}
        {images.length > 0 && (
          <img
            src={images[activeImageIndex]}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Badges - top left */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isFeatured && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs font-medium rounded-md">
              Featured
            </span>
          )}
          
          <span className={`px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(eventStatus)}`}>
            {eventStatus === 'ongoing' ? 'Live' : eventStatus}
          </span>
        </div>

        {/* Navigation arrows - only if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            {/* Image indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    index === activeImageIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}; 