import { useState, useEffect, useRef } from "react";
import { Search, Globe } from "lucide-react";

interface TimezoneSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Comprehensive timezone list with proper formatting
const timezones = [
  // UTC
  { value: 'UTC', label: 'UTC', offset: '+00:00', description: 'Coordinated Universal Time' },
  
  // North America
  { value: 'America/New_York', label: 'Eastern Time', offset: '-05:00', description: 'US & Canada Eastern' },
  { value: 'America/Chicago', label: 'Central Time', offset: '-06:00', description: 'US & Canada Central' },
  { value: 'America/Denver', label: 'Mountain Time', offset: '-07:00', description: 'US & Canada Mountain' },
  { value: 'America/Los_Angeles', label: 'Pacific Time', offset: '-08:00', description: 'US & Canada Pacific' },
  { value: 'America/Anchorage', label: 'Alaska Time', offset: '-09:00', description: 'Alaska' },
  { value: 'Pacific/Honolulu', label: 'Hawaii Time', offset: '-10:00', description: 'Hawaii' },
  { value: 'America/Toronto', label: 'Toronto', offset: '-05:00', description: 'Eastern Time - Toronto' },
  { value: 'America/Vancouver', label: 'Vancouver', offset: '-08:00', description: 'Pacific Time - Vancouver' },
  { value: 'America/Mexico_City', label: 'Mexico City', offset: '-06:00', description: 'Central Time - Mexico' },
  
  // Europe
  { value: 'Europe/London', label: 'London (GMT)', offset: '+00:00', description: 'Greenwich Mean Time' },
  { value: 'Europe/Dublin', label: 'Dublin', offset: '+00:00', description: 'Ireland Standard Time' },
  { value: 'Europe/Paris', label: 'Paris (CET)', offset: '+01:00', description: 'Central European Time' },
  { value: 'Europe/Berlin', label: 'Berlin', offset: '+01:00', description: 'Central European Time' },
  { value: 'Europe/Rome', label: 'Rome', offset: '+01:00', description: 'Central European Time' },
  { value: 'Europe/Madrid', label: 'Madrid', offset: '+01:00', description: 'Central European Time' },
  { value: 'Europe/Amsterdam', label: 'Amsterdam', offset: '+01:00', description: 'Central European Time' },
  { value: 'Europe/Brussels', label: 'Brussels', offset: '+01:00', description: 'Central European Time' },
  { value: 'Europe/Vienna', label: 'Vienna', offset: '+01:00', description: 'Central European Time' },
  { value: 'Europe/Zurich', label: 'Zurich', offset: '+01:00', description: 'Central European Time' },
  { value: 'Europe/Stockholm', label: 'Stockholm', offset: '+01:00', description: 'Central European Time' },
  { value: 'Europe/Copenhagen', label: 'Copenhagen', offset: '+01:00', description: 'Central European Time' },
  { value: 'Europe/Oslo', label: 'Oslo', offset: '+01:00', description: 'Central European Time' },
  { value: 'Europe/Helsinki', label: 'Helsinki', offset: '+02:00', description: 'Eastern European Time' },
  { value: 'Europe/Athens', label: 'Athens', offset: '+02:00', description: 'Eastern European Time' },
  { value: 'Europe/Istanbul', label: 'Istanbul', offset: '+03:00', description: 'Turkey Time' },
  { value: 'Europe/Moscow', label: 'Moscow', offset: '+03:00', description: 'Moscow Standard Time' },
  
  // Asia
  { value: 'Asia/Dubai', label: 'Dubai (GST)', offset: '+04:00', description: 'Gulf Standard Time' },
  { value: 'Asia/Karachi', label: 'Karachi', offset: '+05:00', description: 'Pakistan Standard Time' },
  { value: 'Asia/Kolkata', label: 'Mumbai/Delhi (IST)', offset: '+05:30', description: 'India Standard Time' },
  { value: 'Asia/Dhaka', label: 'Dhaka', offset: '+06:00', description: 'Bangladesh Standard Time' },
  { value: 'Asia/Bangkok', label: 'Bangkok', offset: '+07:00', description: 'Indochina Time' },
  { value: 'Asia/Singapore', label: 'Singapore', offset: '+08:00', description: 'Singapore Standard Time' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong', offset: '+08:00', description: 'Hong Kong Time' },
  { value: 'Asia/Manila', label: 'Manila', offset: '+08:00', description: 'Philippines Time' },
  { value: 'Asia/Shanghai', label: 'Beijing/Shanghai', offset: '+08:00', description: 'China Standard Time' },
  { value: 'Asia/Taipei', label: 'Taipei', offset: '+08:00', description: 'Taiwan Time' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: '+09:00', description: 'Japan Standard Time' },
  { value: 'Asia/Seoul', label: 'Seoul', offset: '+09:00', description: 'Korean Standard Time' },
  { value: 'Asia/Pyongyang', label: 'Pyongyang', offset: '+09:00', description: 'Korean Standard Time' },
  
  // Australia & Pacific
  { value: 'Australia/Perth', label: 'Perth (AWST)', offset: '+08:00', description: 'Australian Western Standard Time' },
  { value: 'Australia/Adelaide', label: 'Adelaide (ACST)', offset: '+09:30', description: 'Australian Central Standard Time' },
  { value: 'Australia/Darwin', label: 'Darwin (ACST)', offset: '+09:30', description: 'Australian Central Standard Time' },
  { value: 'Australia/Brisbane', label: 'Brisbane (AEST)', offset: '+10:00', description: 'Australian Eastern Standard Time' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)', offset: '+10:00', description: 'Australian Eastern Standard Time' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST)', offset: '+10:00', description: 'Australian Eastern Standard Time' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST)', offset: '+12:00', description: 'New Zealand Standard Time' },
  { value: 'Pacific/Fiji', label: 'Fiji', offset: '+12:00', description: 'Fiji Time' },
  
  // South America
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)', offset: '-03:00', description: 'Brazil Time' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires', offset: '-03:00', description: 'Argentina Time' },
  { value: 'America/Santiago', label: 'Santiago', offset: '-03:00', description: 'Chile Time' },
  { value: 'America/Lima', label: 'Lima', offset: '-05:00', description: 'Peru Time' },
  { value: 'America/Bogota', label: 'Bogotá', offset: '-05:00', description: 'Colombia Time' },
  
  // Africa
  { value: 'Africa/Lagos', label: 'Lagos (WAT)', offset: '+01:00', description: 'West Africa Time' },
  { value: 'Africa/Cairo', label: 'Cairo (EET)', offset: '+02:00', description: 'Eastern European Time' },
  { value: 'Africa/Johannesburg', label: 'Johannesburg (SAST)', offset: '+02:00', description: 'South Africa Standard Time' },
  { value: 'Africa/Nairobi', label: 'Nairobi (EAT)', offset: '+03:00', description: 'East Africa Time' },
  
  // Middle East
  { value: 'Asia/Riyadh', label: 'Riyadh', offset: '+03:00', description: 'Arabia Standard Time' },
  { value: 'Asia/Tehran', label: 'Tehran', offset: '+03:30', description: 'Iran Standard Time' },
  { value: 'Asia/Jerusalem', label: 'Jerusalem', offset: '+02:00', description: 'Israel Standard Time' },
  
  // Additional major cities
  { value: 'America/Caracas', label: 'Caracas', offset: '-04:00', description: 'Venezuela Time' },
  { value: 'America/La_Paz', label: 'La Paz', offset: '-04:00', description: 'Bolivia Time' },
  { value: 'Atlantic/Reykjavik', label: 'Reykjavik', offset: '+00:00', description: 'Greenwich Mean Time' },
];

export function TimezoneSelector({ value, onChange, placeholder = "Select timezone" }: TimezoneSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter timezones based on search query
  const filteredTimezones = searchQuery
    ? timezones.filter(timezone => 
        timezone.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        timezone.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        timezone.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        timezone.offset.includes(searchQuery)
      )
    : timezones;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const selectedTimezone = timezones.find(timezone => timezone.value === value);

  const handleTimezoneSelect = (timezoneValue: string) => {
    onChange(timezoneValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  const getDisplayContent = () => {
    if (!selectedTimezone) {
      return (
        <span className="truncate text-sm text-gray-300 dark:text-gray-600">
          Empty
        </span>
      );
    }
    
    return (
      <div className="flex items-center gap-2 truncate">
        <span className="truncate text-sm text-gray-900 dark:text-gray-100">
          {selectedTimezone.label}
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex-shrink-0">
          {selectedTimezone.offset}
        </span>
      </div>
    );
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-6 text-sm bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-right flex items-center justify-end gap-1.5"
      >
        <div className="flex items-center gap-1.5 truncate">
          <Globe className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          {getDisplayContent()}
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute z-200 right-0 top-full mt-1 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[99999]">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search timezones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-7 pl-7 pr-2 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md outline-none text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="py-1.5 max-h-64 overflow-y-auto">
            {filteredTimezones.length === 0 ? (
              <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                No timezones found
              </div>
            ) : (
              filteredTimezones.map((timezone) => (
                <button
                  key={timezone.value}
                  type="button"
                  onClick={() => handleTimezoneSelect(timezone.value)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-start gap-2.5 group ${
                    value === timezone.value 
                      ? 'bg-primary-50/50 dark:bg-primary-900/10' 
                      : ''
                  }`}
                >
                  <Globe className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 transition-colors ${
                    value === timezone.value 
                      ? 'text-primary-500 dark:text-primary-400' 
                      : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-medium leading-4 flex items-center gap-2 ${
                      value === timezone.value 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      <span className="truncate">{timezone.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        value === timezone.value
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {timezone.offset}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-3 opacity-75 truncate">
                      {timezone.description}
                    </div>
                  </div>
                  {value === timezone.value && (
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 flex-shrink-0 mt-1.5" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
} 