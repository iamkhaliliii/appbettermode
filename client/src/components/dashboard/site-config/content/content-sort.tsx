import React, { useState } from "react";
import { Button } from "@/components/ui/primitives";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SortingState } from "@tanstack/react-table";

// Available sort fields
export const SORT_FIELDS = [
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
  { key: 'author', label: 'Author' },
  { key: 'space', label: 'Space' },
  { key: 'publishedAt', label: 'Published Date' },
  { key: 'cmsModel', label: 'CMS Type' },
  { key: 'locked', label: 'Locked' },
];

export interface SortRule {
  id: string;
  field: string;
  direction: 'asc' | 'desc';
}

interface ContentSortProps {
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
}

export const ContentSort: React.FC<ContentSortProps> = ({
  sorting,
  onSortingChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newSort, setNewSort] = useState<Partial<SortRule>>({});

  // Convert SortingState to SortRule array for easier handling
  const sortRules: SortRule[] = sorting.map((sort, index) => ({
    id: `${sort.id}-${index}`,
    field: sort.id,
    direction: sort.desc ? 'desc' : 'asc'
  }));

  const addSort = () => {
    if (newSort.field && newSort.direction) {
      // Replace existing sort with new one (single sort only)
      const newSorting = [
        {
          id: newSort.field,
          desc: newSort.direction === 'desc'
        }
      ];
      onSortingChange(newSorting);
      setNewSort({});
    }
  };

  const removeSort = () => {
    // Clear all sorting (since we only have one sort)
    onSortingChange([]);
  };

  const updateSort = (direction: 'asc' | 'desc') => {
    // Update the single sort direction
    if (sorting.length > 0) {
      const newSorting = [
        {
          id: sorting[0].id,
          desc: direction === 'desc'
        }
      ];
      onSortingChange(newSorting);
    }
  };

  const clearAllSorts = () => {
    onSortingChange([]);
  };

  const getSortIcon = (direction: 'asc' | 'desc') => {
    return direction === 'asc' ? 
      <ArrowUp className="h-3 w-3" /> : 
      <ArrowDown className="h-3 w-3" />;
  };

  const getSortLabel = (direction: 'asc' | 'desc') => {
    return direction === 'asc' ? 'Ascending' : 'Descending';
  };

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button 
            className={cn(
              "relative inline-flex items-center justify-center h-7 px-2 rounded-md border border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 gap-1.5",
              sortRules.length > 0 && "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/20 border-blue-200/50 dark:border-blue-800/50"
            )}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            
            {sortRules.length > 0 && (
              <div className="inline-flex items-center text-xs font-medium gap-1">
                {(() => {
                  const sort = sortRules[0]; // Only show the single sort
                  const field = SORT_FIELDS.find(f => f.key === sort.field);
                  return (
                    <>
                      <span className="text-blue-400 dark:text-blue-500">•</span>
                      <span className="flex items-center gap-0.5">
                        {getSortIcon(sort.direction)}
                        {field?.label}
                      </span>
                    </>
                  );
                })()}
              </div>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-80 p-0 border-0 shadow-lg">
          <div className="p-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Sort</h3>
              {sortRules.length > 0 && (
                <button
                  onClick={clearAllSorts}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
          
          {/* Existing sort */}
          {sortRules.length > 0 && (
            <div className="p-3 space-y-2 border-b border-gray-100 dark:border-gray-800">
              {(() => {
                const sort = sortRules[0]; // Only show the single sort
                const field = SORT_FIELDS.find(f => f.key === sort.field);
                
                return (
                  <div key={sort.id} className="group flex items-center gap-2 p-2 bg-blue-50/50 dark:bg-blue-900/20 rounded-md border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-medium text-blue-700 dark:text-blue-300 truncate">{field?.label}</span>
                        <span className="text-blue-500 dark:text-blue-400 shrink-0 flex items-center gap-1">
                          {getSortIcon(sort.direction)}
                          {getSortLabel(sort.direction)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Select 
                        value={sort.direction} 
                        onValueChange={(direction: 'asc' | 'desc') => updateSort(direction)}
                      >
                        <SelectTrigger className="h-6 text-xs w-20 border-blue-200 dark:border-blue-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="asc" className="text-xs">
                            <div className="flex items-center gap-1">
                              <ArrowUp className="h-3 w-3" />
                              Asc
                            </div>
                          </SelectItem>
                          <SelectItem value="desc" className="text-xs">
                            <div className="flex items-center gap-1">
                              <ArrowDown className="h-3 w-3" />
                              Desc
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <button
                        onClick={() => removeSort()}
                        className="opacity-0 group-hover:opacity-100 h-5 w-5 flex items-center justify-center rounded text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-all"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Add new sort */}
          <div className="p-3 space-y-3">
            {/* Field selection */}
            <Select value={newSort.field} onValueChange={(field) => setNewSort({ field, direction: 'asc' })}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select field to sort..." />
              </SelectTrigger>
              <SelectContent>
                {SORT_FIELDS.map(field => (
                  <SelectItem key={field.key} value={field.key} className="text-xs">
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Direction selection */}
            {newSort.field && (
              <Select value={newSort.direction} onValueChange={(direction: 'asc' | 'desc') => setNewSort({ ...newSort, direction })}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select direction..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc" className="text-xs">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-3 w-3" />
                      Ascending (A-Z, 1-9)
                    </div>
                  </SelectItem>
                  <SelectItem value="desc" className="text-xs">
                    <div className="flex items-center gap-2">
                      <ArrowDown className="h-3 w-3" />
                      Descending (Z-A, 9-1)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Add button */}
            {newSort.field && newSort.direction && (
              <Button 
                onClick={addSort} 
                size="sm" 
                className="w-full h-8 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white border-0"
              >
                Add Sort
              </Button>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}; 