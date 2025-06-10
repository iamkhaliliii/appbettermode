import { AdaptiveDashboardLayout } from "@/components/layout/dashboard/adaptive-dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/primitives";
import { MessageSquare, FileText } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import React, { useEffect, useState, useRef } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

// Import our new components
import { Post, StatusCounts } from "@/components/dashboard/site-config/content/types";
import { ContentTable } from "@/components/dashboard/site-config/content/content-table";
import { ContentToolbar } from "@/components/dashboard/site-config/content/content-toolbar";
import { ContentTabs } from "@/components/dashboard/site-config/content/content-tabs";
import { ContentPagination } from "@/components/dashboard/site-config/content/content-pagination";
import { useContentData } from "@/components/dashboard/site-config/content/use-content-data";
import { createColumns } from "@/components/dashboard/site-config/content/table-columns";
import { NewPostDialog } from '@/components/features/content';
import { FilterRule } from "@/components/dashboard/site-config/content/content-filter";
import { applyFilters } from "@/components/dashboard/site-config/content/filter-logic";
import { withSiteContext, WithSiteContextProps } from "@/lib/with-site-context";
import { useCustomViews } from "@/components/dashboard/site-config/content/use-custom-views";
import type { CustomView } from "@/components/dashboard/site-config/content/content-view-manager.tsx";

function Content({ siteId, siteDetails, siteLoading }: WithSiteContextProps) {
  const [location, setLocation] = useLocation();
  const [, params] = useRoute(siteId ? `/dashboard/site/${siteId}/content/:section` : '/content/:section');
  const section = params?.section;
  
  // Get query parameters from URL
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const statusParam = urlParams.get('status');
  
  // UI state
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showPublishedOnly, setShowPublishedOnly] = useState<boolean>(false);
  const [showStatusFilter, setShowStatusFilter] = useState<boolean>(false);
  const [selectedCmsType, setSelectedCmsType] = useState<string | null>(null);
  
  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  
  // Filter state
  const [filters, setFilters] = useState<FilterRule[]>([]);

  // Edit functionality state
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Custom views state
  const {
    views,
    currentView,
    saveView,
    updateView,
    deleteView,
    loadView,
    clearCurrentView
  } = useCustomViews();

  // Data fetching using our custom hook
  const { allPosts, isLoading, error, refetch } = useContentData(siteDetails);
  
  // Filtered data and status counts
  const [data, setData] = useState<Post[]>([]);
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({
    total: 0,
    published: 0,
    scheduled: 0,
    draft: 0,
    pending: 0
  });

  // Update selected CMS type based on the section parameter
  useEffect(() => {
    if (section && section !== 'all' && section !== 'activity' && section !== 'inbox' && section !== 'scheduled' && section !== 'draft') {
      setSelectedCmsType(section);
    } else {
      setSelectedCmsType(null);
    }
  }, [section]);

  // Update active tab based on status parameter and section
  useEffect(() => {
    if (section === 'scheduled') {
      setActiveTab('scheduled');
      setShowStatusFilter(true);
    } else if (section === 'draft') {
      setActiveTab('drafts');
      setShowStatusFilter(true);
    } else if (statusParam === 'scheduled') {
      setActiveTab('scheduled');
      setShowStatusFilter(true);
    } else if (statusParam === 'draft') {
      setActiveTab('drafts');
      setShowStatusFilter(true);
    } else if (!statusParam && !section) {
      setActiveTab('all');
      setShowStatusFilter(false);
    }
  }, [statusParam, section]);

  // Filter posts client-side based on selected tab, CMS type, and custom filters
  useEffect(() => {
    let filteredPosts = [...allPosts];
    
    // Only apply tab-based filtering if no custom view is active
    if (!currentView) {
      // Handle section-based status filtering first
      if (section === 'scheduled') {
        filteredPosts = filteredPosts.filter(post => post.status === 'Schedule');
      } else if (section === 'draft') {
        filteredPosts = filteredPosts.filter(post => post.status === 'Draft');
      } else if (activeTab === 'published') {
        filteredPosts = filteredPosts.filter(post => post.status === 'Published');
      } else if (activeTab === 'scheduled') {
        filteredPosts = filteredPosts.filter(post => post.status === 'Schedule');
      } else if (activeTab === 'drafts') {
        filteredPosts = filteredPosts.filter(post => post.status === 'Draft');
      } else if (activeTab === 'pending') {
        filteredPosts = filteredPosts.filter(post => post.status === 'Pending review');
      }
      
      // Filter by CMS type if selected (only when no custom view)
      if (selectedCmsType) {
        filteredPosts = filteredPosts.filter(post => 
          post.cmsModel.toLowerCase() === selectedCmsType.toLowerCase()
        );
      }
    }
    
    // Always apply custom filters (these come from the view or manual filters)
    filteredPosts = applyFilters(filteredPosts, filters);
    
    // Update the data state with filtered posts
    setData(filteredPosts);
    
    // Calculate status counts for the filtered data
    const counts = {
      total: filteredPosts.length,
      published: filteredPosts.filter(post => post.status === 'Published').length,
      scheduled: filteredPosts.filter(post => post.status === 'Schedule').length,
      draft: filteredPosts.filter(post => post.status === 'Draft').length,
      pending: filteredPosts.filter(post => post.status === 'Pending review').length
    };
    setStatusCounts(counts);
    
  }, [allPosts, activeTab, selectedCmsType, filters, currentView, section]);

  // Handle edit post
  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setIsEditDialogOpen(true);
  };

  // Handle close edit dialog
  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingPost(null);
  };

  // Post management handlers
  const handleUnpublish = (post: Post) => {
    // TODO: Implement unpublish API call
    console.log('Unpublishing post:', post.title);
    alert(`Unpublish "${post.title}" - This will be implemented with API call`);
  };

  const handleReschedule = (post: Post) => {
    // TODO: Implement reschedule functionality 
    console.log('Rescheduling post:', post.title);
    alert(`Reschedule "${post.title}" - This will open a date picker`);
  };

  const handlePublish = (post: Post) => {
    // TODO: Implement publish API call
    console.log('Publishing post:', post.title);
    alert(`Publishing "${post.title}" - This will be implemented with API call`);
  };

  const handleArchive = (post: Post) => {
    // TODO: Implement archive API call
    console.log('Archiving post:', post.title);
    if (confirm(`Are you sure you want to archive "${post.title}"?`)) {
      alert(`Archive "${post.title}" - This will be implemented with API call`);
    }
  };

  const handleDuplicate = (post: Post) => {
    // TODO: Implement duplicate functionality
    console.log('Duplicating post:', post.title);
    alert(`Duplicate "${post.title}" - This will create a copy as draft`);
  };

  const handleDelete = (post: Post) => {
    // TODO: Implement delete API call
    console.log('Deleting post:', post.title);
    if (confirm(`Are you sure you want to permanently delete "${post.title}"? This action cannot be undone.`)) {
      alert(`Delete "${post.title}" - This will be implemented with API call`);
    }
  };

  // Create table instance with columns that support edit and post management functionality
  const columns = React.useMemo(() => createColumns({ 
    onEdit: handleEditPost,
    onUnpublish: handleUnpublish,
    onReschedule: handleReschedule,
    onPublish: handlePublish,
    onArchive: handleArchive,
    onDuplicate: handleDuplicate,
    onDelete: handleDelete,
  }), []);
  
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 20,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Get page title based on the section/CMS type or custom view
  const getPageTitle = () => {
    // If custom view is active, show the view name
    if (currentView) {
      return currentView.name;
    }
    
    if (section === 'activity') return 'Activity Hub';
    if (section === 'inbox') return 'Inbox';
    if (section === 'scheduled') return 'All Scheduled Content';
    if (section === 'draft') return 'All Draft Content';
    if (statusParam === 'scheduled') return 'All Scheduled Content';
    if (statusParam === 'draft') return 'All Draft Content';
    if (selectedCmsType) {
      // Capitalize the first letter of the CMS type
      return selectedCmsType.charAt(0).toUpperCase() + selectedCmsType.slice(1);
    }
    
    // Show title based on active tab
    if (activeTab === 'published') return 'All Published Content';
    if (activeTab === 'scheduled') return 'All Scheduled Content';
    if (activeTab === 'drafts') return 'All Draft Content';
    if (activeTab === 'pending') return 'All Pending Content';
    
    return 'All Content';
  };

  // Handle tab changes
  const handleTabChange = (tab: string, showPublishedOnly: boolean, showStatusFilter: boolean) => {
    setActiveTab(tab);
    setShowPublishedOnly(showPublishedOnly);
    setShowStatusFilter(showStatusFilter);
    
    // Clear current view when user manually changes tabs
    if (currentView) {
      clearCurrentView();
    }
  };

  // Handle loading a custom view
  const handleLoadView = (view: CustomView) => {
    // Apply the view's state
    setFilters(view.filters);
    setSorting(view.sorting);
    setShowStatusFilter(view.showStatusFilter);
    setSelectedCmsType(view.selectedCmsType);
    
    // Update the current view
    loadView(view);
    
    // Reset tab to 'all' and clear all tab-based filtering when loading a custom view
    setActiveTab('all');
    setShowPublishedOnly(false);
    setShowStatusFilter(false);
  };

  // Handle manual filter changes (clear current view)
  const handleFiltersChange = (newFilters: FilterRule[]) => {
    setFilters(newFilters);
    // Don't clear current view when filters change - let the view manager handle update button
  };

  // Handle manual sorting changes (clear current view)
  const handleSortingChange = (newSorting: SortingState | ((prev: SortingState) => SortingState)) => {
    setSorting(newSorting);
    // Don't clear current view when sorting changes - let the view manager handle update button
  };

  // Handle clearing all filters and sorting
  const handleClearFilters = () => {
    setFilters([]);
    setSorting([]);
    setShowStatusFilter(false);
    clearCurrentView();
    setActiveTab('all');
    setShowPublishedOnly(false);
  };

  // Handle discarding changes and reverting to saved view
  const handleDiscardChanges = () => {
    if (currentView) {
      // Revert to the saved view state
      setFilters(currentView.filters);
      setSorting(currentView.sorting);
      setShowStatusFilter(currentView.showStatusFilter);
      setSelectedCmsType(currentView.selectedCmsType);
      
      // Reset tab to 'all' and clear all tab-based filtering when reverting to view
      setActiveTab('all');
      setShowPublishedOnly(false);
    }
  };

  // Handle clearing current view when filters/sorting change
  useEffect(() => {
    if (currentView) {
      const hasChanges = (
        JSON.stringify(filters) !== JSON.stringify(currentView.filters) ||
        JSON.stringify(sorting) !== JSON.stringify(currentView.sorting) ||
        showStatusFilter !== currentView.showStatusFilter ||
        selectedCmsType !== currentView.selectedCmsType
      );
      
      // Don't clear the view immediately, let the view manager handle the update button
      // clearCurrentView will only be called when user manually changes tabs or resets
    }
  }, [filters, sorting, showStatusFilter, selectedCmsType, currentView]);

  // Render custom views in the sidebar using a portal-like approach
  useEffect(() => {
    const container = document.getElementById('custom-views-container');
    if (container) {
      // Create a simple HTML representation of the views
      const viewsHtml = views.map(view => {
        const isActive = currentView?.id === view.id;
        
        // Create detailed tooltip content
        const tooltipDetails = [
          view.filters.length > 0 && `${view.filters.length} filter${view.filters.length !== 1 ? 's' : ''}`,
          view.sorting.length > 0 && `Sort by ${view.sorting[0].id} (${view.sorting[0].desc ? 'desc' : 'asc'})`,
          view.showStatusFilter && 'Status filter: Published',
          view.selectedCmsType && `CMS type: ${view.selectedCmsType}`
        ].filter(Boolean);
        
        const tooltipText = tooltipDetails.length > 0 
          ? `${view.name}\\n\\n${tooltipDetails.join('\\n')}`
          : `${view.name}\\n\\nNo filters or sorting applied`;
        
        return `
          <div class="group flex items-center justify-between py-1.5 px-2.5 rounded transition-colors cursor-pointer ${isActive ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}" 
               data-view-id="${view.id}"
               title="${tooltipText}">
            <div class="flex-1 min-w-0 flex items-center gap-2" data-view-click="${view.id}">
              <svg class="h-3 w-3 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'} shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span class="text-sm font-normal ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'} truncate">${view.name}</span>
              ${view.filters.length > 0 || view.sorting.length > 0 ? `
                <div class="flex items-center gap-1 shrink-0">
                  ${view.filters.length > 0 ? `
                    <div class="flex items-center gap-0.5">
                      <svg class="h-2.5 w-2.5 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"></path>
                      </svg>
                      <span class="text-xs ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}">${view.filters.length}</span>
                    </div>
                  ` : ''}
                  ${view.sorting.length > 0 ? `
                    <svg class="h-2.5 w-2.5 ${isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                    </svg>
                  ` : ''}
                </div>
              ` : ''}
            </div>
            <div class="opacity-0 group-hover:opacity-100 transition-opacity ml-1">
              <button 
                class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                data-more-actions="${view.id}"
                title="More actions"
              >
                <svg class="h-3 w-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z"></path>
                </svg>
              </button>
            </div>
          </div>
        `;
      }).join('');
      
      container.innerHTML = views.length === 0 
        ? '<div class="px-2.5 py-2 text-xs text-gray-500 dark:text-gray-400">No custom views yet. Create filters or sorting, then save as a view.</div>'
        : viewsHtml;
      
      // Add click handlers for view loading
      const viewClickElements = container.querySelectorAll('[data-view-click]');
      viewClickElements.forEach(element => {
        element.addEventListener('click', (e) => {
          const viewId = (e.currentTarget as HTMLElement).getAttribute('data-view-click');
          const view = views.find(v => v.id === viewId);
          if (view) {
            handleLoadView(view);
          }
        });
      });

      // Add click handlers for more actions
      const moreActionElements = container.querySelectorAll('[data-more-actions]');
      moreActionElements.forEach(element => {
        element.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent view loading
          const viewId = (e.currentTarget as HTMLElement).getAttribute('data-more-actions');
          const view = views.find(v => v.id === viewId);
          if (view) {
            showMoreActionsMenu(e.currentTarget as HTMLElement, view);
          }
        });
      });
    }
  }, [views, currentView, handleLoadView]);

  // Function to show more actions menu
  const showMoreActionsMenu = (buttonElement: HTMLElement, view: CustomView) => {
    // Remove any existing menu
    const existingMenu = document.querySelector('.custom-view-actions-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    // Create menu
    const menu = document.createElement('div');
    menu.className = 'custom-view-actions-menu absolute z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 min-w-[120px]';
    
    menu.innerHTML = `
      <button class="w-full px-3 py-1.5 text-left text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2" data-action="rename">
        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
        Rename
      </button>
      <button class="w-full px-3 py-1.5 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2" data-action="delete">
        <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
        Delete
      </button>
    `;

    // Position menu
    const rect = buttonElement.getBoundingClientRect();
    menu.style.position = 'fixed';
    menu.style.top = `${rect.bottom + 4}px`;
    menu.style.left = `${rect.left - 80}px`; // Offset to the left

    document.body.appendChild(menu);

    // Add action handlers
    const renameBtn = menu.querySelector('[data-action="rename"]');
    const deleteBtn = menu.querySelector('[data-action="delete"]');

    renameBtn?.addEventListener('click', () => {
      menu.remove();
      handleRenameView(view);
    });

    deleteBtn?.addEventListener('click', () => {
      menu.remove();
      handleDeleteView(view);
    });

    // Close menu when clicking outside
    const closeMenu = (e: Event) => {
      if (!menu.contains(e.target as Node)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    };
    
    setTimeout(() => {
      document.addEventListener('click', closeMenu);
    }, 0);
  };

  // Handle rename view
  const handleRenameView = (view: CustomView) => {
    const newName = prompt('Enter new name for the view:', view.name);
    if (newName && newName.trim() && newName.trim() !== view.name) {
      updateView(view.id, { name: newName.trim() });
    }
  };

  // Handle delete view
  const handleDeleteView = (view: CustomView) => {
    if (confirm(`Are you sure you want to delete the view "${view.name}"?`)) {
      deleteView(view.id);
    }
  };

  // Handle status change from dialog
  const handleStatusChangeFromDialog = (post: Post, newStatus: string) => {
    console.log(`Changing status of "${post.title}" from ${post.status} to ${newStatus}`);
    
    // Update the local data to reflect the status change
    setData(prevData => 
      prevData.map(p => 
        p.id === post.id 
          ? { ...p, status: newStatus as any }
          : p
      )
    );
    
    // TODO: Make API call to update status on backend
    alert(`Status changed from ${post.status} to ${newStatus}. This will be connected to API.`);
    
    // Update the editing post state to reflect the change
    if (editingPost && editingPost.id === post.id) {
      setEditingPost({ ...editingPost, status: newStatus as any });
    }
  };
  
  // For the Inbox section
  if (section === 'inbox') {
    return (
      <AdaptiveDashboardLayout currentSiteIdentifier={siteId} siteName={siteDetails?.name}>
        <div className="px-4 md:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Inbox</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your messages and notifications</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card className="border-border dark:border-border">
              <CardHeader className="pb-5">
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Your inbox is empty. Messages will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdaptiveDashboardLayout>
    );
  }
  
  // For the Activity Hub section
  if (section === 'activity') {
    return (
      <AdaptiveDashboardLayout
        siteName={siteDetails?.name}
        currentSiteIdentifier={siteId}
      >
        <div className="px-4 md:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Activity Hub</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor recent activities and updates</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card className="border-border dark:border-border">
              <CardHeader className="pb-5">
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                      <div className="flex-shrink-0 w-9 h-9 mr-3 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-300">
                        {item % 2 === 0 ? <MessageSquare className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 dark:text-gray-200 font-medium">
                          {item % 2 === 0 ? 'New comment added' : 'Content updated'}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {item % 2 === 0 ? 'A new comment was added to content' : 'A content page was updated'}
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                          {`${item * 2} minutes ago`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdaptiveDashboardLayout>
    );
  }
  
  // For the default CMS view (now at root /content path)
  return (
    <AdaptiveDashboardLayout
      siteName={siteDetails?.name}
      currentSiteIdentifier={siteId}
    >
      <div className="mx-auto">
        {/* Content container with padding */}
        <div className="px-2 py-3 pb-1.5 sm:px-3 sm:py-4 sm:pb-2">
          <div className="mb-3 flex flex-row items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-medium text-gray-900 dark:text-white">
                {getPageTitle()} <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">{isLoading ? 'Loading...' : `${statusCounts.total} item${statusCounts.total !== 1 ? 's' : ''}`}</span>
              </h1>
            </div>
          </div>

          {/* Filter tabs - Hide when custom view is active or status-based section filtering */}
          {!currentView && section !== 'scheduled' && section !== 'draft' && (
            <ContentTabs
              activeTab={activeTab}
              statusCounts={statusCounts}
              isLoading={isLoading}
              onTabChange={handleTabChange}
            />
          )}

          {/* Table toolbar */}
          <ContentToolbar
            table={table}
            isLoading={isLoading}
            showStatusFilter={showStatusFilter}
            selectedCmsType={selectedCmsType}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            sorting={sorting}
            onSortingChange={handleSortingChange}
            currentView={currentView}
            onSaveView={saveView}
            onUpdateView={updateView}
            onClearFilters={handleClearFilters}
            onDiscardChanges={handleDiscardChanges}
            activeTab={activeTab}
            onStatusChange={handleStatusChangeFromDialog}
          />
        </div>

        {/* Main table - Full width with no padding */}
        <div className="bg-background dark:bg-background border-y border-border/30 dark:border-border/30 overflow-auto mt-[1px] scrollbar-minimal">
          <ContentTable
            data={data}
            isLoading={isLoading}
            error={error}
            sorting={sorting}
            setSorting={handleSortingChange}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onErrorRetry={refetch}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setShowPublishedOnly={setShowPublishedOnly}
            setShowStatusFilter={setShowStatusFilter}
            onEdit={handleEditPost}
          />
        </div>
        
        {/* Pagination controls - container with padding */}
        <ContentPagination table={table} isLoading={isLoading} />
        
        {/* Edit Post Dialog */}
        <NewPostDialog 
          open={isEditDialogOpen} 
          onOpenChange={handleCloseEditDialog}
          editingPost={editingPost}
          onStatusChange={handleStatusChangeFromDialog}
        />
      </div>
    </AdaptiveDashboardLayout>
  );
}

export default withSiteContext(Content);

