import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface EventInfoProps {
  title: string;
  description: string;
  eventDescription?: string;
  eventDate?: string;
  eventLocation?: string;
  attendeesCount?: number;
  maxAttendees?: number;
  tags?: string[];
  price?: {
    type: 'free' | 'paid';
    amount?: number;
    currency?: string;
  };
  requirements?: string[];
  whatToBring?: string[];
}

export const EventInfo: React.FC<EventInfoProps> = ({
  title,
  description,
  eventDescription,
  tags = [],
  requirements = [],
  whatToBring = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayDescription = eventDescription || description;
  const shouldShowReadMore = displayDescription.length > 200;
  const truncatedDescription = shouldShowReadMore && !isExpanded 
    ? displayDescription.substring(0, 200) + '...' 
    : displayDescription;

  return (
    <div className="space-y-4">
      {/* Main Info */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
        {/* Header */}
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
          {title}
        </h3>
        
        {/* Description */}
        <div className="mb-4">
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {truncatedDescription}
          </p>
          {shouldShowReadMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
            >
              {isExpanded ? 'Show less' : 'Read more'}
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span 
                key={tag}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Requirements & What to Bring - Always expanded */}
      {(requirements.length > 0 || whatToBring.length > 0) && (
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Event Details
          </span>
          
          <div className="mt-3 space-y-3">
            {requirements.length > 0 && (
              <div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Required
                </div>
                <ul className="space-y-1">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <div className="w-1 h-1 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {whatToBring.length > 0 && (
              <div>
                <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Recommended
                </div>
                <ul className="space-y-1">
                  {whatToBring.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 