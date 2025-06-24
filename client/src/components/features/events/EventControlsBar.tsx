import React from 'react';
import { Button } from '@/components/ui/primitives';
import { EventFiltersDemo } from '@/components/ui/event-filters-demo';
import { Filter } from '@/components/ui/event-filters';
import { EventSortDemo } from '@/components/ui/event-sort-demo';
import { Sort, SortField, SortDirection } from '@/components/ui/event-sort';
import { Plus, Search, X, Grid, List, CalendarDays } from 'lucide-react';

interface EventControlsBarProps {
  advancedSorts: Sort[];
  setAdvancedSorts: React.Dispatch<React.SetStateAction<Sort[]>>;
  advancedFilters: Filter[];
  setAdvancedFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  viewMode: 'grid' | 'list' | 'calendar';
  setViewMode: (mode: 'grid' | 'list' | 'calendar') => void;
  isViewModeOpen: boolean;
  setIsViewModeOpen: (open: boolean) => void;
  onNewEvent: () => void;
}

const VIEW_MODES = [
  { value: 'grid', label: 'Cards', icon: Grid },
  { value: 'list', label: 'List', icon: List },
  { value: 'calendar', label: 'Calendar', icon: CalendarDays },
];

export const EventControlsBar: React.FC<EventControlsBarProps> = ({
  advancedSorts,
  setAdvancedSorts,
  advancedFilters,
  setAdvancedFilters,
  searchQuery,
  setSearchQuery,
  isSearchOpen,
  setIsSearchOpen,
  viewMode,
  setViewMode,
  isViewModeOpen,
  setIsViewModeOpen,
  onNewEvent
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="text-xl font-bold text-gray-600 dark:text-gray-400">
        All events
        <span className="text-xs font-normal ml-2 text-gray-500 dark:text-gray-400">
          Discover all community events
        </span>
      </div>
    
      {/* All Controls */}
      <div className="flex items-center gap-2">
        {/* Sort Button */}
        <EventSortDemo 
          sorts={advancedSorts} 
          setSorts={setAdvancedSorts}
        />
        
        {/* Filter Button */}
        <EventFiltersDemo 
          filters={advancedFilters} 
          setFilters={setAdvancedFilters}
        />

        {/* Search with smooth animation */}
        <div className="relative flex items-center">
          <div 
            className={`
              relative overflow-hidden transition-all duration-300 ease-in-out
              ${isSearchOpen ? 'w-56' : 'w-6'} 
              h-6 rounded-md border border-gray-200 dark:border-gray-700
              ${isSearchOpen ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}
            `}
          >
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                absolute inset-0 w-full h-full pl-8 pr-8 bg-transparent 
                text-gray-900 dark:text-gray-100 placeholder-gray-500 
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 
                text-sm transition-all duration-300
                ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
              `}
              style={{ 
                fontSize: '14px',
                border: 'none',
                outline: 'none'
              }}
              autoFocus={isSearchOpen}
              onBlur={() => {
                if (!searchQuery.trim()) {
                  setIsSearchOpen(false);
                }
              }}
            />
            
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`
                absolute left-0 top-0 w-6 h-6 flex items-center justify-center
                text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                transition-all duration-300 z-10
                ${isSearchOpen ? 'cursor-default' : 'cursor-pointer'}
              `}
            >
              <Search className="w-3.5 h-3.5" />
            </button>
            
            {/* Clear Button */}
            {isSearchOpen && (
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className={`
                  absolute right-2 top-1/2 transform -translate-y-1/2 
                  text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                  transition-all duration-200 z-10
                  ${searchQuery ? 'opacity-100' : 'opacity-70'}
                `}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Custom Layout Dropdown */}
        <div className="relative" data-dropdown="view-mode">
          <button
            onClick={() => setIsViewModeOpen(!isViewModeOpen)}
            className="flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 h-6 w-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
          >
            {viewMode === 'grid' && <Grid className="w-3.5 h-3.5 text-gray-500" />}
            {viewMode === 'list' && <List className="w-3.5 h-3.5 text-gray-500" />}
            {viewMode === 'calendar' && <CalendarDays className="w-3.5 h-3.5 text-gray-500" />}
          </button>

          {/* Dropdown Menu */}
          {isViewModeOpen && (
            <div className="absolute top-full mt-1 right-0 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
              {VIEW_MODES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => {
                    setViewMode(value as 'grid' | 'list' | 'calendar');
                    setIsViewModeOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left
                    transition-colors duration-150
                    ${viewMode === value 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${viewMode === value ? 'text-blue-500' : 'text-gray-500'}`} />
                  <span className="font-medium">{label}</span>
                  {viewMode === value && (
                    <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* New Event Button */}
        <Button 
          onClick={onNewEvent}
          className="bg-blue-600 hover:bg-blue-700 text-white h-6 px-2 text-xs flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          New
        </Button>
      </div>
    </div>
  );
}; 