import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Share2 } from 'lucide-react';

interface EventHeaderProps {
  title: string;
  onBack: () => void;
  onShare: () => void;
  onFavorite: () => void;
  isFavorited: boolean;
  onRSVP?: () => void;
  isRSVPed?: boolean;
  showRSVPButton?: boolean;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  title,
  onBack,
  onShare,
  onFavorite,
  isFavorited,
  onRSVP,
  isRSVPed = false,
  showRSVPButton = false
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-16 z-40 transition-all duration-200 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800' 
        : 'bg-gray-50 dark:bg-gray-950'
    }`}>
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            <h1 className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm">
              {title}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* RSVP Button - Shows when scrolling with smooth transition */}
            {showRSVPButton && onRSVP && (
              <button
                onClick={onRSVP}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ease-in-out ${
                  isRSVPed
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
                }`}
              >
                {isRSVPed ? 'Attending' : 'RSVP'}
              </button>
            )}
            
            <button
              onClick={onFavorite}
              className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                isFavorited 
                  ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-900'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>
            
            <button
              onClick={onShare}
              className="flex items-center justify-center w-8 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}; 