import { useState, useEffect, useRef } from "react";
import { Search, FolderPlus, Folder, Check, X } from "lucide-react";
import { CustomDropdownProps } from "./types";

export function CustomDropdown({ value, options, onChange, placeholder = "Select option", enableSearch = false, onAddNew }: CustomDropdownProps) {
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