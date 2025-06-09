import React, { useState } from "react";
import { Button } from "@/components/ui/primitives";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/primitives";
import { Input } from "@/components/ui/primitives";
import { Label } from "@/components/ui/primitives";
import { Save, RefreshCw, X, Undo2 } from "lucide-react";
import { SortingState } from "@tanstack/react-table";
import { FilterRule } from './content-filter';

export interface CustomView {
  id: string;
  name: string;
  filters: FilterRule[];
  sorting: SortingState;
  showStatusFilter: boolean;
  selectedCmsType: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ContentViewManagerProps {
  filters: FilterRule[];
  sorting: SortingState;
  showStatusFilter: boolean;
  selectedCmsType: string | null;
  currentView: CustomView | null;
  onSaveView: (view: Omit<CustomView, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateView: (viewId: string, updates: Partial<CustomView>) => void;
  onClearFilters: () => void;
  onDiscardChanges: () => void;
  activeTab: string;
}

export const ContentViewManager: React.FC<ContentViewManagerProps> = ({
  filters,
  sorting,
  showStatusFilter,
  selectedCmsType,
  currentView,
  onSaveView,
  onUpdateView,
  onClearFilters,
  onDiscardChanges,
  activeTab
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewName, setViewName] = useState('');
  const [hideSaveButton, setHideSaveButton] = useState(false);

  // Check if current state has any filters or sorting beyond just CMS type
  const hasActiveState = filters.length > 0 || sorting.length > 0 || showStatusFilter || 
    (selectedCmsType && filters.length > 0); // Only show if CMS type + additional filters

  // Check if we only have a CMS type filter (which is a "hardcoded" view)
  const isOnlyBasicCmsType = selectedCmsType && filters.length === 0 && sorting.length === 0 && !showStatusFilter;

  // Check if we're in a hardcoded tab state (tab selected but no additional filters/sorting)
  const isHardcodedTabState = activeTab !== 'all' && filters.length === 0 && sorting.length === 0 && !currentView;

  // Check if current state is different from saved view
  const hasChanges = currentView && (
    JSON.stringify(filters) !== JSON.stringify(currentView.filters) ||
    JSON.stringify(sorting) !== JSON.stringify(currentView.sorting) ||
    showStatusFilter !== currentView.showStatusFilter ||
    selectedCmsType !== currentView.selectedCmsType
  );

  const handleSaveView = () => {
    if (viewName.trim()) {
      onSaveView({
        name: viewName.trim(),
        filters,
        sorting,
        showStatusFilter,
        selectedCmsType
      });
      setViewName('');
      setIsDialogOpen(false);
      setHideSaveButton(false); // Reset hide state after successful save
    }
  };

  const handleUpdateView = () => {
    if (currentView) {
      onUpdateView(currentView.id, {
        filters,
        sorting,
        showStatusFilter,
        selectedCmsType,
        updatedAt: new Date()
      });
    }
  };

  const handleHideSaveButton = () => {
    setHideSaveButton(true);
  };

  const handleDiscardChanges = () => {
    if (currentView) {
      // Reset to the saved view state using the proper callback
      onDiscardChanges();
    }
  };

  // Reset hide state when filters/sorting change (user is actively working)
  React.useEffect(() => {
    if (hasActiveState && !currentView) {
      setHideSaveButton(false);
    }
  }, [filters, sorting, showStatusFilter, selectedCmsType, hasActiveState, currentView]);

  // Don't show anything if no active state or if it's only a basic CMS type or hardcoded tab state
  if (!hasActiveState || isOnlyBasicCmsType || isHardcodedTabState) {
    return null;
  }

  // Show update and discard buttons if we have a current view with changes
  if (currentView && hasChanges) {
    return (
      <div className="flex items-center gap-1">
        <Button
          onClick={handleUpdateView}
          size="sm"
          variant="outline"
          className="h-7 px-2 text-xs font-medium border-orange-200 dark:border-orange-700 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-600"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Update View
        </Button>
        <Button
          onClick={handleDiscardChanges}
          size="sm"
          variant="outline"
          className="h-7 px-2 text-xs font-medium border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600"
          title="Discard changes and revert to saved view"
        >
          <Undo2 className="h-3 w-3 mr-1" />
          Discard
        </Button>
      </div>
    );
  }

  // Don't show save button if we have a current view (even without changes)
  if (currentView) {
    return null;
  }

  // Show save button only when no current view is active and not hidden
  if (hideSaveButton) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2 text-xs font-medium border-green-200 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-600"
          >
            <Save className="h-3 w-3 mr-1" />
            Save View
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Custom View</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="view-name">View Name</Label>
              <Input
                id="view-name"
                placeholder="Enter view name..."
                value={viewName}
                onChange={(e) => setViewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveView();
                  }
                }}
              />
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium mb-2">This view will save:</p>
              <ul className="space-y-1 text-xs">
                {filters.length > 0 && (
                  <li>• {filters.length} filter{filters.length !== 1 ? 's' : ''}</li>
                )}
                {sorting.length > 0 && (
                  <li>• Sort by {sorting[0].id} ({sorting[0].desc ? 'desc' : 'asc'})</li>
                )}
                {showStatusFilter && (
                  <li>• Status filter: Published</li>
                )}
                {selectedCmsType && (
                  <li>• CMS type: {selectedCmsType}</li>
                )}
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveView}
              disabled={!viewName.trim()}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Save View
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Button
        onClick={handleHideSaveButton}
        size="sm"
        variant="outline"
        className="h-7 w-7 p-0 text-xs font-medium border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600"
        title="Hide save button"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}; 