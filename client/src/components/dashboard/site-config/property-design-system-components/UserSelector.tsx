import { useState, useEffect, useRef } from "react";
import { Search, User, Check } from "lucide-react";
import { UserSelectorProps, mockUsers } from "./types";

export function UserSelector({ value, onChange, placeholder = "Select users" }: UserSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter and organize users
  const allSelectedUsers = mockUsers.filter(user => value.includes(user.id));
  const allUnselectedUsers = mockUsers.filter(user => !value.includes(user.id));
  
  const filteredSelectedUsers = searchQuery
    ? allSelectedUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allSelectedUsers;
    
  const filteredUnselectedUsers = searchQuery
    ? allUnselectedUsers.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allUnselectedUsers;

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

  const handleUserToggle = (userId: string) => {
    const newValue = value.includes(userId)
      ? value.filter(id => id !== userId)
      : [...value, userId];
    onChange(newValue);
  };

  const handleSetSelection = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  const selectedUsers = mockUsers.filter(user => value.includes(user.id));
  const isEmpty = selectedUsers.length === 0;
  
  const getDisplayContent = () => {
    if (isEmpty) {
      return (
        <span className="truncate text-sm text-gray-300 dark:text-gray-600">
          Empty
        </span>
      );
    }
    
    if (selectedUsers.length === 1) {
      const user = selectedUsers[0];
      return (
        <div className="flex items-center gap-1.5 truncate">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 p-1 text-gray-500" />
            </div>
          )}
          <span className="truncate text-sm text-gray-900 dark:text-gray-100">
            {user.name}
          </span>
        </div>
      );
    }
    
    const displayAvatars = selectedUsers.slice(0, 3);
    const remainingCount = selectedUsers.length - 3;
    
    return (
      <div className="flex items-center justify-end truncate">
        <div className="flex -space-x-1 flex-shrink-0">
          {displayAvatars.map((user) => (
            user.avatar ? (
              <img key={user.id} src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover border border-white dark:border-gray-800" />
            ) : (
              <div key={user.id} className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center border border-white dark:border-gray-800">
                <User className="w-5 h-5 p-1 text-gray-500" />
              </div>
            )
          ))}
          {remainingCount > 0 && (
            <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-500 flex items-center justify-center border border-white dark:border-gray-800">
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
        <div className="absolute z-200 right-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[99999]">
          <div className="p-1.5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <Search className="absolute left-1.5 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
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
          <div className="py-1 max-h-40 overflow-y-auto">
            {filteredSelectedUsers.length === 0 && filteredUnselectedUsers.length === 0 ? (
              <div className="px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400">
                No users found
              </div>
            ) : (
              <>
                {/* Selected Users Section */}
                {filteredSelectedUsers.length > 0 && (
                  <>
                    <div className="px-2 py-1 text-[9px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-700/50">
                      Selected ({filteredSelectedUsers.length})
                    </div>
                    {filteredSelectedUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleUserToggle(user.id)}
                        className="w-full text-left px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-2 bg-primary-50/50 dark:bg-primary-900/10"
                      >
                        <div className="flex items-center gap-1.5 flex-1">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <User className="w-5 h-5 p-1 text-gray-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                              {user.name}
                            </div>
                            <div className="text-[9px] text-gray-500 dark:text-gray-400 truncate">
                              {user.role}
                            </div>
                          </div>
                        </div>
                        <Check className="w-2.5 h-2.5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                      </button>
                    ))}
                  </>
                )}

                {/* Unselected Users Section */}
                {filteredUnselectedUsers.length > 0 && (
                  <>
                    {filteredSelectedUsers.length > 0 && (
                      <div className="border-t border-gray-100 dark:border-gray-700 my-0.5"></div>
                    )}
                    {filteredSelectedUsers.length > 0 && (
                      <div className="px-2 py-1 text-[9px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-700/50">
                        Available ({filteredUnselectedUsers.length})
                      </div>
                    )}
                    {filteredUnselectedUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleUserToggle(user.id)}
                        className="w-full text-left px-2 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-2"
                      >
                        <div className="flex items-center gap-1.5 flex-1">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <User className="w-5 h-5 p-1 text-gray-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                              {user.name}
                            </div>
                            <div className="text-[9px] text-gray-500 dark:text-gray-400 truncate">
                              {user.role}
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