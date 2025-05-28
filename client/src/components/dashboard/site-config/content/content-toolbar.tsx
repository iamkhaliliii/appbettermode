import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Columns,
  Search,
  FileOutput,
  Plus,
  ChevronDown,
  FileText,
  X
} from "lucide-react";
import { Table, SortingState } from "@tanstack/react-table";
import { Post } from './types';
import { ContentFilter, FilterRule } from './content-filter';
import { ContentSort } from './content-sort';
import { ContentViewManager, CustomView } from './content-view-manager.tsx';

interface ContentToolbarProps {
  table: Table<Post>;
  isLoading: boolean;
  showStatusFilter: boolean;
  selectedCmsType: string | null;
  filters: FilterRule[];
  onFiltersChange: (filters: FilterRule[]) => void;
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  currentView: CustomView | null;
  onSaveView: (view: Omit<CustomView, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateView: (viewId: string, updates: Partial<CustomView>) => void;
  onClearFilters: () => void;
  onDiscardChanges: () => void;
  activeTab: string;
}

export const ContentToolbar: React.FC<ContentToolbarProps> = ({
  table,
  isLoading,
  showStatusFilter,
  selectedCmsType,
  filters,
  onFiltersChange,
  sorting,
  onSortingChange,
  currentView,
  onSaveView,
  onUpdateView,
  onClearFilters,
  onDiscardChanges,
  activeTab
}) => {
  return (
    <div className="mb-0 flex items-center justify-between gap-1.5">
      {/* Left side - Filter, Sort, Column buttons */}
      <div className="flex items-center gap-1.5">
        <ContentFilter 
          filters={filters} 
          onFiltersChange={onFiltersChange}
          showStatusFilter={showStatusFilter}
          selectedCmsType={selectedCmsType}
          activeTab={activeTab}
        />
         
         <ContentSort 
           sorting={sorting}
           onSortingChange={onSortingChange}
         />

                   <ContentViewManager
            filters={filters}
            sorting={sorting}
            showStatusFilter={showStatusFilter}
            selectedCmsType={selectedCmsType}
            currentView={currentView}
            onSaveView={onSaveView}
            onUpdateView={onUpdateView}
            onClearFilters={onClearFilters}
            onDiscardChanges={onDiscardChanges}
            activeTab={activeTab}
          />
        
      </div>
      
      {/* Right side - Action buttons (Search, Export, Add) */}
      <div className="flex items-center gap-1.5">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center justify-center h-7 px-3 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-sm text-xs font-medium gap-1 whitespace-nowrap hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors">
                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[9px] font-semibold mr-1">
                  {table.getFilteredSelectedRowModel().rows.length}
                </span>
                Actions
                <ChevronDown className="ml-1 h-2.5 w-2.5 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[170px] rounded-md p-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg">
              <DropdownMenuLabel className="pt-1.5 pb-2 px-2 text-[11px] font-medium text-gray-700 dark:text-gray-300 tracking-tight">
                Actions for {table.getFilteredSelectedRowModel().rows.length} selected item(s)
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="my-0.5 h-px bg-gray-200 dark:bg-gray-700" />
              
              <DropdownMenuItem className="flex cursor-pointer items-center whitespace-nowrap px-2 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750">
                <svg className="h-1.5 w-1.5 mr-2 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                </svg>
                <span>Move to space</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="flex cursor-pointer items-center whitespace-nowrap px-2 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750">
                <svg className="h-1.5 w-1.5 mr-2 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>Hide</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="flex cursor-pointer items-center whitespace-nowrap px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10">
                <svg className="h-2.5 w-2.5 mr-1.5 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
                <span>Delete</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="my-0.5 h-px bg-gray-200 dark:bg-gray-700" />
              
              <DropdownMenuItem className="flex cursor-pointer items-center whitespace-nowrap px-2 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750">
                <svg className="h-2.5 w-2.5 mr-1.5 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                <span>Add tag</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="flex cursor-pointer items-center whitespace-nowrap px-2 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750">
                <X className="h-2 w-2 mr-1.5 text-gray-400 dark:text-gray-500" />
                <span>Remove tag</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="my-0.5 h-px bg-gray-200 dark:bg-gray-700" />
              
              <DropdownMenuItem className="flex cursor-pointer items-center whitespace-nowrap px-2 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750">
                <svg className="h-2.5 w-2.5 mr-1.5 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Lock</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="flex cursor-pointer items-center whitespace-nowrap px-2 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750">
                <svg className="h-2.5 w-2.5 mr-1.5 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Change publish time</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        <button className="inline-flex items-center justify-center h-7 w-7 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Search className="h-3.5 w-3.5" />
        </button>
        
        <button className="inline-flex items-center justify-center h-7 w-7 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <FileOutput className="h-3.5 w-3.5" />
        </button>
        
        <button className="inline-flex items-center justify-center h-7 px-3.5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 shadow-sm text-xs font-medium gap-1 whitespace-nowrap hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Plus className="h-3.5 w-3.5 mr-1" />
          <span>New Content</span>
        </button>
      </div>
    </div>
  );
}; 