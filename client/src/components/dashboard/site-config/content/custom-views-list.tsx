import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Eye, 
  MoreHorizontal, 
  Trash2, 
  Calendar,
  Filter,
  ArrowUpDown
} from "lucide-react";
import { CustomView } from './content-view-manager';
import { cn } from "@/lib/utils";

interface CustomViewsListProps {
  views: CustomView[];
  currentView: CustomView | null;
  onLoadView: (view: CustomView) => void;
  onDeleteView: (viewId: string) => void;
}

export const CustomViewsList: React.FC<CustomViewsListProps> = ({
  views,
  currentView,
  onLoadView,
  onDeleteView
}) => {
  const [deletingViewId, setDeletingViewId] = useState<string | null>(null);

  const handleDeleteView = (viewId: string, viewName: string) => {
    if (window.confirm(`Are you sure you want to delete the view "${viewName}"?`)) {
      onDeleteView(viewId);
      setDeletingViewId(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getViewSummary = (view: CustomView) => {
    const parts = [];
    
    if (view.filters.length > 0) {
      parts.push(`${view.filters.length} filter${view.filters.length !== 1 ? 's' : ''}`);
    }
    
    if (view.sorting.length > 0) {
      parts.push('sorted');
    }
    
    if (view.showStatusFilter) {
      parts.push('status');
    }
    
    if (view.selectedCmsType) {
      parts.push('cms type');
    }

    return parts.length > 0 ? parts.join(', ') : 'no filters';
  };

  if (views.length === 0) {
    return (
      <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
        No custom views yet. Create filters or sorting, then save as a view.
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {views.map((view) => (
        <div
          key={view.id}
          className={cn(
            "group flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer",
            currentView?.id === view.id && "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500"
          )}
          onClick={() => onLoadView(view)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {view.name}
              </span>
            </div>
            
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(view.updatedAt)}</span>
              </div>
              
              <span>•</span>
              
              <div className="flex items-center gap-1">
                {view.filters.length > 0 && (
                  <Filter className="h-3 w-3" />
                )}
                {view.sorting.length > 0 && (
                  <ArrowUpDown className="h-3 w-3" />
                )}
                <span className="truncate">{getViewSummary(view)}</span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteView(view.id, view.name);
                }}
                className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Delete View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}; 