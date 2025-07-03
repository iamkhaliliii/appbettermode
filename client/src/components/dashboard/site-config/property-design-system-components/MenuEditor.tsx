import React, { useState, useEffect, useRef } from 'react';
import { Menu, ChevronDown, GripVertical, Folder, Trash2, Plus, Link, FileText, Search } from 'lucide-react';

export interface MenuItem {
  id: string;
  label: string;
  slug: string;
  type: 'file' | 'link';
}

export interface MenuEditorProps {
  value: MenuItem[];
  onChange: (value: MenuItem[]) => void;
  placeholder?: string;
}

// Available spaces
const AVAILABLE_SPACES = [
  { id: 'job-board', label: 'Job Board', slug: 'job-board' },
  { id: 'events', label: 'Events', slug: 'events' },
  { id: 'qa', label: 'Q&A', slug: 'qa' },
  { id: 'ideas', label: 'Ideas & Wishlist', slug: 'ideas' },
  { id: 'knowledge-base', label: 'Knowledge Base', slug: 'knowledge-base' },
  { id: 'blog', label: 'Blog', slug: 'blog' },
  { id: 'discussions', label: 'Discussions', slug: 'discussions' },
  { id: 'changelog', label: 'Changelog', slug: 'changelog' },
];

// Sample menu items
const SAMPLE_MENU_ITEMS: MenuItem[] = [
  { id: '1', label: 'Job Board', slug: 'job-board', type: 'file' },
  { id: '2', label: 'Events', slug: 'events', type: 'file' },
  { id: '3', label: 'Documentation', slug: 'https://docs.example.com', type: 'link' },
  { id: '4', label: 'Q&A', slug: 'qa', type: 'file' },
  { id: '5', label: 'Blog', slug: 'blog', type: 'file' },
  { id: '6', label: 'Support', slug: 'https://support.example.com', type: 'link' },
];

export function MenuEditor({ value = SAMPLE_MENU_ITEMS, onChange, placeholder = "Manage menu items" }: MenuEditorProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'spaces' | 'custom'>('spaces');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
        setIsAddMode(false); // Reset add mode when closing
        setSearchQuery(''); // Reset search when closing
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Auto-scroll sidebar when popover opens
  useEffect(() => {
    if (isPopoverOpen && dropdownRef.current) {
      const sidebar = document.querySelector('.settings-sidebar .overflow-y-auto') ||
                     document.querySelector('[data-sidebar-content]') ||
                     document.querySelector('.secondary-sidebar .overflow-y-auto') ||
                     document.querySelector('.overflow-y-auto');
      
      if (sidebar && dropdownRef.current) {
        setTimeout(() => {
          if (!dropdownRef.current) return;
          const rect = dropdownRef.current.getBoundingClientRect();
          const sidebarRect = sidebar.getBoundingClientRect();
          
          const popoverHeight = 256; // h-64 = 256px
          const bottomOfPopover = rect.bottom + popoverHeight;
          const bottomOfSidebar = sidebarRect.bottom;
          
          if (bottomOfPopover > bottomOfSidebar) {
            const scrollAmount = bottomOfPopover - bottomOfSidebar + 20;
            sidebar.scrollBy({
              top: scrollAmount,
              behavior: 'smooth'
            });
          }
        }, 50);
      }
    }
  }, [isPopoverOpen]);

  const handleDelete = (itemId: string) => {
    const newValue = value.filter(item => item.id !== itemId);
    onChange(newValue);
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetItemId) return;

    const draggedIndex = value.findIndex(item => item.id === draggedItem);
    const targetIndex = value.findIndex(item => item.id === targetItemId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newValue = [...value];
    const [draggedItem_] = newValue.splice(draggedIndex, 1);
    newValue.splice(targetIndex, 0, draggedItem_);
    onChange(newValue);
    
    setDraggedItem(null);
  };

  const getIcon = (type: 'file' | 'link') => {
    return type === 'file' ? FileText : Link;
  };

  const handleToggleSpace = (space: typeof AVAILABLE_SPACES[0]) => {
    const isAdded = isSpaceAdded(space.slug);
    
    if (isAdded) {
      // Remove the space from menu
      const newValue = value.filter(item => !(item.slug === space.slug && item.type === 'file'));
      onChange(newValue);
    } else {
      // Add the space to menu
      const newItem: MenuItem = {
        id: Date.now().toString(),
        label: space.label,
        slug: space.slug,
        type: 'file'
      };
      onChange([...value, newItem]);
    }
  };

  const isSpaceAdded = (spaceSlug: string) => {
    return value.some(item => item.slug === spaceSlug && item.type === 'file');
  };

  const filteredSpaces = AVAILABLE_SPACES.filter(space =>
    space.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    space.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {/* Header button */}
      <button
        type="button"
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        className="w-full h-6 text-sm bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-right flex items-center justify-end gap-1.5"
      >
        <div className="flex items-center gap-1.5 truncate">
          <Menu className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
          <span className="truncate text-sm">
            {value.length} menu items
          </span>
        </div>
        <ChevronDown 
          className={`w-3 h-3 text-gray-400 transition-transform ${
            isPopoverOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {/* Popover */}
      {isPopoverOpen && (
        <div className="absolute z-200 right-0 top-full mt-1 w-72 h-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[99999] flex flex-col">
          
          {/* Header with Add Button */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Menu className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  {isAddMode ? 'Add Menu Item' : 'Menu Items'}
                </span>
              </div>
              {!isAddMode ? (
                <button
                  onClick={() => setIsAddMode(true)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Add
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAddMode(false);
                    setSearchQuery(''); // Reset search when going back
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Back
                </button>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {isAddMode ? (
              <>
                {/* Tabs */}
                <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <button
                    onClick={() => setActiveTab('spaces')}
                    className={`flex-1 px-3 py-2 text-xs font-medium ${
                      activeTab === 'spaces' 
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    From Spaces
                  </button>
                  <button
                    onClick={() => setActiveTab('custom')}
                    className={`flex-1 px-3 py-2 text-xs font-medium ${
                      activeTab === 'custom' 
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    Custom URL
                  </button>
                </div>

                {/* Tab Content - Add Mode */}
                <div className="flex-1 overflow-y-auto p-3">
                  {activeTab === 'spaces' ? (
                    <div className="space-y-1">
                      {/* Search Input */}
                      <div className="relative mb-2">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search spaces..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-7 pr-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      {/* Spaces List */}
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-2">
                        Select spaces to add to menu
                      </div>
                      
                      {filteredSpaces.map((space) => {
                        const isAdded = isSpaceAdded(space.slug);
                        
                        return (
                          <div
                            key={space.id}
                            className={`flex items-center gap-2 px-2 py-1 rounded transition-colors ${
                              isAdded 
                                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isAdded}
                              onChange={() => handleToggleSpace(space)}
                              className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                            />
                            <FileText className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            <div className="flex-1 flex items-center justify-between min-w-0">
                              <span className="text-[11px] font-medium text-gray-900 dark:text-white truncate">
                                {space.label}
                              </span>
                              <span className="text-[9px] font-mono text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                                /{space.slug}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      
                      {filteredSpaces.length === 0 && (
                        <div className="text-center text-gray-500 dark:text-gray-400 text-xs py-4">
                          No spaces found matching "{searchQuery}"
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 text-xs">
                      Custom URL functionality coming soon...
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Menu Items List */
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <div className="space-y-0 py-1.5">
                  {value.map((item) => {
                    const isDragging = draggedItem === item.id;
                    const IconComponent = getIcon(item.type);
                    
                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, item.id)}
                        className={`px-2 py-1.5 transition-colors group border-b border-gray-100 dark:border-gray-700/50 last:border-none ${
                          isDragging ? 'opacity-50' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {/* Drag Handle */}
                          <div className="cursor-grab active:cursor-grabbing">
                            <GripVertical className="w-3 h-3 text-gray-400" />
                          </div>
                          
                          {/* Icon */}
                          <IconComponent className={`w-3 h-3 ${
                            item.type === 'file' ? 'text-blue-500' : 'text-green-500'
                          }`} />
                          
                          {/* Label and Slug */}
                          <div className="flex-1 flex items-center justify-between min-w-0">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-[11px] font-medium text-gray-900 dark:text-white truncate">
                                {item.label}
                              </span>
                              <span className="text-[9px] font-mono text-gray-500 dark:text-gray-400 flex-shrink-0">
                                {item.type === 'file' ? `/${item.slug}` : item.slug}
                              </span>
                            </div>
                            
                            {/* Delete Button */}
                            <div className="flex-shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(item.id);
                                }}
                                className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 dark:text-red-400"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {value.length === 0 && (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-xs">
                      No menu items yet. Click Add to create your first item.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {value.length > 0 ? `${value.length} menu items` : 'No menu items'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 