import { useState, useEffect, useRef } from "react";
import { Search, Check, X, ChevronDown } from "lucide-react";
import { MultiSelectProps } from "./types";

export function MultiSelect({ 
  value = [], 
  onChange, 
  options, 
  placeholder = "Select options", 
  enableSearch = true 
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search query
  const filteredOptions = enableSearch && searchQuery
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

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
    if (isOpen && enableSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen, enableSearch]);

  const handleOptionToggle = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const handleRemoveItem = (itemValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== itemValue));
  };

  const getSelectedOptions = () => {
    return options.filter(option => value.includes(option.value));
  };

  const selectedOptions = getSelectedOptions();

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[24px] text-sm bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-right flex items-center justify-end gap-1.5"
      >
        <div className="flex items-center gap-1 flex-wrap justify-end">
          {selectedOptions.length === 0 ? (
            <span className="text-gray-300 dark:text-gray-600 text-sm">{placeholder}</span>
          ) : (
            selectedOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center gap-1 px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-md text-xs"
              >
                {option.icon && <option.icon className="w-3 h-3" />}
                <span className="truncate max-w-[80px]">{option.label}</span>
                <X 
                  className="w-3 h-3 hover:text-red-500 cursor-pointer" 
                  onClick={(e) => handleRemoveItem(option.value, e)}
                />
              </div>
            ))
          )}
          <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute z-200 right-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[99999]">
          {enableSearch && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-7 pl-7 pr-2 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md outline-none text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
          )}

          <div className="py-1.5 max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = value.includes(option.value);
                
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleOptionToggle(option.value)}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-start gap-2.5 group ${
                      isSelected 
                        ? 'bg-primary-50/50 dark:bg-primary-900/10' 
                        : ''
                    }`}
                  >
                    <div className={`w-4 h-4 mt-0.5 flex-shrink-0 border rounded flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'bg-primary-500 border-primary-500 text-white' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                    
                    {option.icon && (
                      <option.icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 transition-colors ${
                        isSelected 
                          ? 'text-primary-500 dark:text-primary-400' 
                          : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                      }`} />
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-medium leading-4 ${
                        isSelected 
                          ? 'text-primary-600 dark:text-primary-400' 
                          : 'text-gray-900 dark:text-gray-100'
                      }`}>
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-3 opacity-75">
                          {option.description}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
} 