import { useState, useEffect, useRef } from "react";
import { Hash, X, Plus } from "lucide-react";
import { TagInputProps } from "./types";

// Popular/suggested tags - in real app this could come from API
const SUGGESTED_TAGS = [
  'urgent', 'feature', 'bug', 'enhancement', 'documentation', 'design', 
  'backend', 'frontend', 'mobile', 'api', 'security', 'performance',
  'ui', 'ux', 'testing', 'deployment', 'maintenance', 'review'
];

export function TagInput({ value, onChange, placeholder = "Add tags" }: TagInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setInputValue(''); // Clear input on close
        setSelectedIndex(-1); // Reset selection
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  // Get filtered suggestions based on input
  const getFilteredSuggestions = () => {
    if (!inputValue.trim()) {
      // Show recent/popular tags when no input
      return SUGGESTED_TAGS
        .filter(tag => !value.includes(tag))
        .slice(0, 6); // Show top 6 suggestions
    }
    
    // Filter by input text
    const filtered = SUGGESTED_TAGS
      .filter(tag => 
        tag.toLowerCase().includes(inputValue.toLowerCase()) && 
        !value.includes(tag)
      );
    
    return filtered.slice(0, 4); // Show top 4 matches
  };

  const filteredSuggestions = getFilteredSuggestions();
  const hasExactMatch = filteredSuggestions.some(tag => 
    tag.toLowerCase() === inputValue.toLowerCase()
  );
  const canAddNew = inputValue.trim() && !hasExactMatch && !value.includes(inputValue.trim());
  
  // Create all selectable options (new tag + suggestions)
  const allOptions = [
    ...(canAddNew ? [inputValue.trim()] : []),
    ...filteredSuggestions
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < allOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev > 0 ? prev - 1 : allOptions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && allOptions[selectedIndex]) {
        addTag(allOptions[selectedIndex]);
        setSelectedIndex(-1);
      } else if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setInputValue('');
      setSelectedIndex(-1);
    }
  };

  // Reset selected index when input changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [inputValue]);

  const isEmpty = value.length === 0;
  const displayText = isEmpty ? 'Empty' : `${value.length} tag${value.length === 1 ? '' : 's'}`;

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setSelectedIndex(-1);
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }}
        className="w-full h-6 text-sm bg-transparent border-none outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-right flex items-center justify-end gap-1.5"
      >
        <div className="flex items-center gap-1.5">
          <Hash className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          <span className={`text-sm ${isEmpty ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'}`}>
            {displayText}
          </span>
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[99999]">
          <div className="p-3">
            <input
              ref={inputRef}
              type="text"
              placeholder="Add tag..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-7 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md px-3 outline-none text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500"
            />
          </div>
            
          {/* Suggestions */}
          {(filteredSuggestions.length > 0 || canAddNew) && (
            <div className="px-3 pb-3 border-t border-gray-100 dark:border-gray-700">
              {!inputValue.trim() && (
                <div className="text-[10px] text-gray-400 dark:text-gray-500 mb-2 pt-3">
                  Popular tags • Use ↑↓ to navigate
                </div>
              )}
              
              <div className={`flex flex-wrap gap-1 ${!inputValue.trim() ? '' : 'pt-3'}`}>
                {/* Show "Add new" option first if applicable */}
                {canAddNew && (
                  <button
                    type="button"
                    onClick={() => {
                      addTag(inputValue);
                      setSelectedIndex(-1);
                    }}
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs transition-colors border ${
                      selectedIndex === 0
                        ? 'bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-600'
                        : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                    }`}
                  >
                    <Plus className="w-2.5 h-2.5" />
                    Add "{inputValue}"
                  </button>
                )}
                
                {/* Show filtered suggestions */}
                {filteredSuggestions.map((tag, index) => {
                  const optionIndex = canAddNew ? index + 1 : index;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        addTag(tag);
                        setSelectedIndex(-1);
                      }}
                      className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                        selectedIndex === optionIndex
                          ? 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100'
                          : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Current tags */}
          {value.length > 0 && (
            <div className="px-3 pb-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex flex-wrap gap-1 pt-3">
                {value.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-150 dark:hover:bg-gray-600 transition-colors"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTag(tag);
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-0.5"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 