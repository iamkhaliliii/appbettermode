import { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  Globe,
  Lock
} from "lucide-react";

interface PropertyRowProps {
  label: string;
  value: any;
  fieldName: string;
  type?: 'text' | 'textarea' | 'select' | 'upload' | 'checkbox';
  options?: { 
    value: string; 
    label: string; 
    description?: string;
    icon?: any;
  }[];
  onValueChange: (value: any) => void;
  placeholder?: string;
  icon?: any;
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

interface CustomDropdownProps {
  value: string;
  options: { 
    value: string; 
    label: string; 
    description?: string;
    icon?: any;
  }[];
  onChange: (value: string) => void;
  placeholder?: string;
}

function CustomDropdown({ value, options, onChange, placeholder = "Select option" }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-6 text-sm bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 text-right flex items-center justify-end gap-1"
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon && (
            <selectedOption.icon className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-3 h-3 text-gray-400 dark:text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-200 right-0 top-full mt-1 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-[99999]">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-start gap-3 ${
                  value === option.value 
                    ? 'bg-primary-50 dark:bg-primary-900/20' 
                    : ''
                }`}
              >
                {option.icon && (
                  <option.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    value === option.value 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-400 dark:text-gray-500'
                  }`} />
                )}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${
                    value === option.value 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {option.label}
                  </div>
                  {option.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      {option.description}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 