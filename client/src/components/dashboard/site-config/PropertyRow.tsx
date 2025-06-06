import { useState, useEffect, useRef } from "react";
import {
  Globe,
  Lock,
  Info,
  Search,
  Plus,
  Folder,
  Check,
  X,
  FolderPlus
} from "lucide-react";
import { IconUploadDialog } from "@/components/ui/icon-upload-dialog";
import { IconDisplay } from "@/components/ui/icon-display";

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
  description?: string;
  disabled?: boolean;
  isChild?: boolean;
  isIconUpload?: boolean;
  enableDropdownSearch?: boolean;
  onAddNew?: (folderName: string) => void;
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
  enableSearch?: boolean;
  onAddNew?: (folderName: string) => void;
}

function CustomDropdown({ value, options, onChange, placeholder = "Select option", enableSearch = false, onAddNew }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

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
        setShowAddInput(false);
        setNewFolderName('');
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

  // Focus add input when it's shown
  useEffect(() => {
    if (showAddInput && addInputRef.current) {
      setTimeout(() => addInputRef.current?.focus(), 100);
    }
  }, [showAddInput]);

  const selectedOption = options.find(option => option.value === value);

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
    setShowAddInput(false);
    setNewFolderName('');
  };

  const handleShowAddInput = () => {
    setShowAddInput(true);
    setSearchQuery('');
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim() && onAddNew) {
      // Pass the folder name to the parent component
      const folderName = newFolderName.trim();
      onAddNew(folderName);
      setIsOpen(false);
      setSearchQuery('');
      setShowAddInput(false);
      setNewFolderName('');
    }
  };

  const handleAddInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateFolder();
    }
    if (e.key === 'Escape') {
      setShowAddInput(false);
      setNewFolderName('');
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-6 text-sm bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-right flex items-center justify-end gap-1.5"
      >
        <div className="flex items-center gap-1.5 truncate">
          {selectedOption?.icon && (
            <selectedOption.icon className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          )}
          <span className="truncate text-sm">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute z-200 right-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[99999]">
          {enableSearch && !showAddInput && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search folders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-7 pl-7 pr-2 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md outline-none text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                {onAddNew && (
                  <button
                    type="button"
                    onClick={handleShowAddInput}
                    className="flex-shrink-0 h-7 w-7 flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors"
                    title="Add new folder"
                  >
                    <FolderPlus className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {showAddInput && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Folder className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                  <input
                    ref={addInputRef}
                    type="text"
                    placeholder="Enter folder name..."
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={handleAddInputKeyDown}
                    className="w-full h-7 pl-7 pr-2 text-xs bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md outline-none text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="flex-shrink-0 h-7 w-7 flex items-center justify-center bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md transition-colors"
                  title="Create folder"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddInput(false);
                    setNewFolderName('');
                  }}
                  className="flex-shrink-0 h-7 w-7 flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
                  title="Cancel"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          <div className="py-1.5 max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                No folders found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionSelect(option.value)}
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
              ))
            )}
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
  onKeyDown,
  description,
  disabled = false,
  isChild = false,
  isIconUpload = false,
  enableDropdownSearch = false,
  onAddNew
}: PropertyRowProps) {
  const [showDescription, setShowDescription] = useState(false);
  const [iconDialogOpen, setIconDialogOpen] = useState(false);
  const isEditing = editingField === fieldName;
  const displayValue = value || "Empty";
  const isEmpty = !value;
  const isDescription = fieldName === 'description';
  const isSlug = fieldName === 'slug';

  // Handle icon selection from dialog
  const handleIconSelect = (iconData: { 
    type: 'emoji' | 'lucide' | 'custom'; 
    value: string; 
    name?: string;
    color?: string;
  }) => {
    // Store the icon data as an object
    onValueChange(iconData);
  };

  // Parse icon data if it exists
  const getIconData = () => {
    if (!value) return null;
    
    // If it's already an object with type, return it
    if (typeof value === 'object' && value.type) {
      return value;
    }
    
    // If it's a string that looks like a URL, treat as custom
    if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('blob:'))) {
      return { type: 'custom', value, name: 'Custom icon' };
    }
    
    // If it's a single character, treat as emoji
    if (typeof value === 'string' && value.length <= 4) {
      return { type: 'emoji', value };
    }
    
    return null;
  };

  const iconData = getIconData();

  // Get display text for icon type
  const getIconDisplayText = (iconData: any) => {
    if (!iconData) return 'Empty';
    
    switch (iconData.type) {
      case 'emoji':
        return 'Emoji';
      case 'lucide':
        return iconData.color ? `${iconData.name} (Colored)` : iconData.name;
      case 'custom':
        return 'Custom';
      default:
        return 'Icon';
    }
  };

  return (
    <div className={isChild ? "relative" : ""}>
      {isChild && (
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"></div>
      )}
      <div className={`flex rounded-md group transition-colors ${
        isChild 
          ? 'px-2 pl-8 hover:bg-gray-50 dark:hover:bg-gray-800/50' 
          : 'px-2 hover:bg-gray-50 dark:hover:bg-gray-800/50'
      } ${
        description && showDescription ? '' : 'border-b border-gray-100 dark:border-gray-800'
      } ${
        (isDescription || isSlug) && isEditing ? 'flex-col items-start py-2 space-y-2' : 'items-start justify-between min-h-[2.25rem] py-2'
      }`}>
        <div className={`text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2 ${
          (isDescription || isSlug) && isEditing ? 'w-full' : 'w-1/2 pr-2'
        }`}>
          {Icon && !isChild && (
            <div className="flex items-center justify-center w-5 h-5 rounded-md bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
              <Icon className="h-3 w-3 text-gray-600 dark:text-gray-400" />
            </div>
          )}
          <div className="flex items-center">
            <span className="truncate text-left font-medium">{label}</span>
            {description && (
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="ml-1 p-1 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                type="button"
              >
                <Info className="h-2.5 w-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </div>
        </div>
        <div className={`flex justify-end items-start pl-2 ${
          (isDescription || isSlug) && isEditing ? 'w-full' : 'w-1/2'
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
                      className="flex-1 h-full bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 text-left px-2"
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
                  className={`text-sm cursor-pointer h-6 flex items-center justify-end rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors truncate text-right w-full mt-0.5 ${
                    isEmpty ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'
                  }`}
                  title={fieldName === 'slug' ? `yourdomain/${displayValue}` : displayValue}
                >
                  {fieldName === 'slug' && !isEmpty ? (
                    <div className="flex items-center gap-1 truncate">
                      <span className="text-xs text-gray-400 dark:text-gray-500">yourdomain/</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{value}</span>
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
                  className={`text-sm cursor-pointer flex items-start justify-end rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full ${
                    isEmpty ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'
                  } ${
                    isDescription ? 'py-1 text-right whitespace-pre-wrap break-words' : 'h-6 items-center truncate text-right'
                  }`}
                  title={!isDescription ? displayValue : undefined}
                >
                  {displayValue}
                </div>
              )}
            </>
          )}

          {type === 'select' && (
            <div className="w-full mt-0.5">
              <CustomDropdown
                value={value}
                options={options}
                onChange={onValueChange}
                placeholder="Select option"
                enableSearch={enableDropdownSearch}
                onAddNew={onAddNew}
              />
            </div>
          )}

          {type === 'upload' && (
            <div className="flex items-center gap-2 justify-end h-6 w-full mt-0.5">
              {isIconUpload ? (
                // Icon upload mode
                <>
                  {iconData ? (
                    <div className="flex items-center gap-2 h-6">
                      <IconDisplay iconData={iconData} size="sm" />
                      <button
                        onClick={() => onValueChange(null)}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex-shrink-0"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIconDialogOpen(true)}
                      className="text-sm text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer h-6 flex items-center justify-end rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors truncate w-full text-right"
                    >
                      Empty
                    </button>
                  )}
                </>
              ) : (
                // Regular file upload mode
                <>
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
                      className="text-sm text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer h-6 flex items-center justify-end rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors truncate w-full text-right"
                    >
                      Empty
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {type === 'checkbox' && (
            <div className="flex items-center justify-end h-6 w-full mt-0.5">
              <div 
                onClick={() => !disabled && onValueChange(!value)}
                className={`relative inline-flex h-3.5 w-6 items-center rounded-full transition-colors ${
                  disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                } ${
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
      {description && showDescription && (
        <div className={`pb-3 pr-20 border-b border-gray-100 dark:border-gray-800 ${
          isChild ? 'px-3 pl-8' : 'px-3'
        }`}>
          <div className="text-[0.75rem] text-gray-400 dark:text-gray-500 leading-4">
            {description}
          </div>
        </div>
      )}

      {/* Icon Upload Dialog */}
      {isIconUpload && (
        <IconUploadDialog
          open={iconDialogOpen}
          onOpenChange={setIconDialogOpen}
          onIconSelect={handleIconSelect}
          currentValue={iconData?.value}
        />
      )}
    </div>
  );
} 