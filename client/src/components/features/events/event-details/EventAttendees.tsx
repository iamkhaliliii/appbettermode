import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Attendee {
  id: string;
  name: string;
  avatar: string;
  role?: string;
}

interface EventAttendeesProps {
  attendees: Attendee[];
  totalCount: number;
  maxAttendees: number;
}

export const EventAttendees: React.FC<EventAttendeesProps> = ({
  attendees,
  totalCount,
  maxAttendees
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayAttendees = showAll ? attendees : attendees.slice(0, 4);
  const hasMore = attendees.length > 4;

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Attendees ({totalCount})
        </h3>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          {maxAttendees - totalCount} spots left
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {displayAttendees.map((attendee) => (
          <div key={attendee.id} className="flex items-center gap-2">
            <img
              src={attendee.avatar}
              alt={attendee.name}
              className="w-6 h-6 rounded-full object-cover"
            />
            <div className="text-xs text-gray-900 dark:text-gray-100">
              {attendee.name}
            </div>
          </div>
        ))}
      </div>
      
      {hasMore && (
        <div className="mt-3 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            {showAll ? (
              <>
                Show less <ChevronUp className="w-3 h-3" />
              </>
            ) : (
              <>
                Show all {attendees.length} <ChevronDown className="w-3 h-3" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}; 