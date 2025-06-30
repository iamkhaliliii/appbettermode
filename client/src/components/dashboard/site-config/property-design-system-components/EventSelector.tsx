import { useState, useEffect, useRef } from "react";
import { Search, Calendar, Check, Users } from "lucide-react";
import { EventSelectorProps, mockEvents } from "./types";

export function EventSelector({ value, onChange, placeholder = "Select events" }: EventSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter and organize events
  const allSelectedEvents = mockEvents.filter(event => value.includes(event.id));
  const allUnselectedEvents = mockEvents.filter(event => !value.includes(event.id));
  
  const filteredSelectedEvents = searchQuery
    ? allSelectedEvents.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.status.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allSelectedEvents;
    
  const filteredUnselectedEvents = searchQuery
    ? allUnselectedEvents.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.status.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allUnselectedEvents;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleEventToggle = (eventId: string) => {
    const newValue = value.includes(eventId)
      ? value.filter(id => id !== eventId)
      : [...value, eventId];
    onChange(newValue);
  };

  const handleSetSelection = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  const selectedEvents = mockEvents.filter(event => value.includes(event.id));
  const isEmpty = selectedEvents.length === 0;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'featured':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'upcoming':
        return 'text-green-600 dark:text-green-400';
      case 'past':
        return 'text-gray-500 dark:text-gray-400';
      default:
        return 'text-gray-500 dark:text-gray-400';
    }
  };
  
  const getDisplayContent = () => {
    if (isEmpty) {
      return (
        <span className="truncate text-sm text-gray-300 dark:text-gray-600">
          Empty
        </span>
      );
    }
    
    if (selectedEvents.length === 1) {
      const event = selectedEvents[0];
      return (
        <div className="flex items-center gap-1.5 truncate">
          {event.thumbnail ? (
            <img src={event.thumbnail} alt={event.title} className="w-5 h-5 rounded object-cover flex-shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 p-1 text-gray-500" />
            </div>
          )}
          <span className="truncate text-sm text-gray-900 dark:text-gray-100">
            {event.title}
          </span>
        </div>
      );
    }
    
    const displayThumbnails = selectedEvents.slice(0, 3);
    const remainingCount = selectedEvents.length - 3;
    
    return (
      <div className="flex items-center justify-end truncate">
        <div className="flex -space-x-1 flex-shrink-0">
          {displayThumbnails.map((event) => (
            event.thumbnail ? (
              <img key={event.id} src={event.thumbnail} alt={event.title} className="w-5 h-5 rounded object-cover border border-white dark:border-gray-800" />
            ) : (
              <div key={event.id} className="w-5 h-5 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center border border-white dark:border-gray-800">
                <Calendar className="w-5 h-5 p-1 text-gray-500" />
              </div>
            )
          ))}
          {remainingCount > 0 && (
            <div className="w-5 h-5 rounded bg-gray-300 dark:bg-gray-500 flex items-center justify-center border border-white dark:border-gray-800">
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-200">
                +{remainingCount}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-6 text-sm bg-transparent border-none outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-right flex items-center justify-end"
      >
        {getDisplayContent()}
      </button>
      
      {isOpen && (
        <div className="absolute z-200 right-0 top-full mt-1 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[99999]">
          <div className="p-1.5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <Search className="absolute left-1.5 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-6 pl-5 pr-1.5 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded outline-none text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <button
                type="button"
                onClick={handleSetSelection}
                className="flex-shrink-0 h-6 px-2 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded transition-colors"
              >
                Set
              </button>
            </div>
          </div>
          <div className="py-1 max-h-48 overflow-y-auto">
            {filteredSelectedEvents.length === 0 && filteredUnselectedEvents.length === 0 ? (
              <div className="px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400">
                No events found
              </div>
            ) : (
              <>
                {/* Selected Events Section */}
                {filteredSelectedEvents.length > 0 && (
                  <>
                    <div className="px-2 py-1 text-[9px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-700/50">
                      Selected ({filteredSelectedEvents.length})
                    </div>
                    {filteredSelectedEvents.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => handleEventToggle(event.id)}
                        className="w-full text-left px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-2 bg-primary-50/50 dark:bg-primary-900/10"
                      >
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          {event.thumbnail ? (
                            <img src={event.thumbnail} alt={event.title} className="w-6 h-6 rounded object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                              <Calendar className="w-6 h-6 p-1 text-gray-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                              {event.title}
                            </div>
                            <div className="text-[9px] text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                              <span>{formatDate(event.date)}</span>
                              <span className="text-gray-300 dark:text-gray-600">•</span>
                              <span className={getStatusColor(event.status)}>{event.status}</span>
                              {event.attendees && (
                                <>
                                  <span className="text-gray-300 dark:text-gray-600">•</span>
                                  <Users className="w-2 h-2" />
                                  <span>{event.attendees}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <Check className="w-2.5 h-2.5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                      </button>
                    ))}
                  </>
                )}

                {/* Unselected Events Section */}
                {filteredUnselectedEvents.length > 0 && (
                  <>
                    {filteredSelectedEvents.length > 0 && (
                      <div className="border-t border-gray-100 dark:border-gray-700 my-0.5"></div>
                    )}
                    {filteredSelectedEvents.length > 0 && (
                      <div className="px-2 py-1 text-[9px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-700/50">
                        Available ({filteredUnselectedEvents.length})
                      </div>
                    )}
                    {filteredUnselectedEvents.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => handleEventToggle(event.id)}
                        className="w-full text-left px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-2"
                      >
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          {event.thumbnail ? (
                            <img src={event.thumbnail} alt={event.title} className="w-6 h-6 rounded object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                              <Calendar className="w-6 h-6 p-1 text-gray-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                              {event.title}
                            </div>
                            <div className="text-[9px] text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                              <span>{formatDate(event.date)}</span>
                              <span className="text-gray-300 dark:text-gray-600">•</span>
                              <span className={getStatusColor(event.status)}>{event.status}</span>
                              {event.attendees && (
                                <>
                                  <span className="text-gray-300 dark:text-gray-600">•</span>
                                  <Users className="w-2 h-2" />
                                  <span>{event.attendees}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 