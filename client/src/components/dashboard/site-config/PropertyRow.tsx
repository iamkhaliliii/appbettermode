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
        className="w-full h-6 text-sm bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 text-right flex items-center justify-end gap-1.5"
      >
        <div className="flex items-center gap-1.5 truncate">
          {selectedOption?.icon && (
            <selectedOption.icon className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          )}
          <span className="truncate text-xs">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className={`w-3 h-3 text-gray-400 dark:text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-200 right-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[99999]">
          <div className="py-1.5">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-start gap-2.5 group ${
                  value === option.value 
                    ? 'bg-primary-50/50 dark:bg-primary-900/10' 
                    : ''
                }`}
              >
                {option.icon && (
                  <option.icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 transition-colors ${
                    value === option.value 
                      ? 'text-primary-500 dark:text-primary-400' 
                      : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                  }`} />
                )}
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-medium leading-4 ${
                    value === option.value 
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
                {value === option.value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 flex-shrink-0 mt-1.5" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function PropertyRow({ 
  label, 
  value, 
  fieldName, 
  type = 'text',
  options = [],
  onValueChange,
  placeholder = "Empty",
  icon: Icon,
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown
}: PropertyRowProps) {
  const isEditing = editingField === fieldName;
  const displayValue = value || "Empty";
  const isEmpty = !value;
  const isDescription = fieldName === 'description';
  const isSlug = fieldName === 'slug';

  return (
    <div className={`flex px-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md group transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${
      (isDescription || isSlug) && isEditing ? 'flex-col items-start py-2 space-y-2' : 'items-center justify-between h-9'
    }`}>
      <div className={`text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2 ${
        (isDescription || isSlug) && isEditing ? 'w-full' : 'w-2/5 pr-2'
      }`}>
        {Icon && <Icon className="h-3 w-3 flex-shrink-0" />}
        <span className="truncate text-left">{label}</span>
      </div>
      <div className={`flex justify-end items-center pl-2 ${
        (isDescription || isSlug) && isEditing ? 'w-full' : 'w-3/5 h-full'
      }`}>
        {type === 'text' && (
          <>
            {isEditing ? (
              fieldName === 'slug' ? (
                <div className="w-full flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md h-8">
                  <span className="text-xs text-gray-400 dark:text-gray-500 px-3 border-r border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 rounded-l-md h-full flex items-center">
                    yourdomain/
                  </span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    onBlur={onFieldBlur}
                    onKeyDown={(e) => onKeyDown(e, fieldName)}
                    className="flex-1 h-full text-sm bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 text-left px-2"
                    autoFocus
                    placeholder="url-slug"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onValueChange(e.target.value)}
                  onBlur={onFieldBlur}
                  onKeyDown={(e) => onKeyDown(e, fieldName)}
                  className="w-full h-8 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 outline-none text-gray-900 dark:text-gray-100 text-left"
                  autoFocus
                  placeholder="Enter value..."
                />
              )
            ) : (
              <div
                onClick={() => onFieldClick(fieldName)}
                className={`text-sm cursor-pointer h-6 flex items-center justify-end px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors truncate text-right w-full ${
                  isEmpty ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'
                }`}
                title={fieldName === 'slug' ? `yourdomain/${displayValue}` : displayValue}
              >
                {fieldName === 'slug' && !isEmpty ? (
                  <div className="flex items-center gap-1 truncate">
                    <span className="text-xs text-gray-400 dark:text-gray-500">yourdomain/</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">{value}</span>
                  </div>
                ) : (
                  displayValue
                )}
              </div>
            )}
          </>
        )}

        {type === 'textarea' && (
          <>
            {isEditing ? (
              <textarea
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                onBlur={onFieldBlur}
                onKeyDown={(e) => onKeyDown(e, fieldName)}
                className={`w-full text-sm bg-transparent border outline-none text-gray-900 dark:text-gray-100 resize-none rounded-md px-3 py-2 ${
                  isDescription 
                    ? 'h-20 min-h-20 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-left' 
                    : 'h-6 overflow-hidden border-none text-right'
                }`}
                autoFocus
                placeholder={isDescription ? "Enter description..." : ""}
              />
            ) : (
              <div
                onClick={() => onFieldClick(fieldName)}
                className={`text-sm cursor-pointer h-6 flex items-center justify-end px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors truncate text-right w-full ${
                  isEmpty ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'
                }`}
                title={displayValue}
              >
                {displayValue}
              </div>
            )}
          </>
        )}

        {type === 'select' && (
          <CustomDropdown
            value={value}
            options={options}
            onChange={onValueChange}
            placeholder="Select option"
          />
        )}

        {type === 'upload' && (
          <div className="flex items-center gap-2 justify-end h-6 w-full">
            {value ? (
              <div className="flex items-center gap-2 h-6">
                <span className="text-sm text-gray-900 dark:text-gray-100 truncate">Uploaded</span>
                <img src={value} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />
                <button
                  onClick={() => onValueChange('')}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex-shrink-0"
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      onValueChange(URL.createObjectURL(file));
                    }
                  };
                  input.click();
                }}
                className="text-sm text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer h-6 flex items-center justify-end px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors truncate w-full text-right"
              >
                Empty
              </button>
            )}
          </div>
        )}

        {type === 'checkbox' && (
          <div className="flex items-center justify-end h-6 w-full">
            <div 
              onClick={() => onValueChange(!value)}
              className={`relative inline-flex h-3.5 w-6 items-center rounded-full transition-colors cursor-pointer ${
                value 
                  ? 'bg-primary-600' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <div 
                className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-3' : 'translate-x-0.5'
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 