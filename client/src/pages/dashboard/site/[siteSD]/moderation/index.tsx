import React, { useState, useMemo } from "react";
import { useRoute } from "wouter";
import { DashboardLayout } from "@/components/layout/dashboard/dashboard-layout";
import { withSiteContext, WithSiteContextProps } from "@/lib/with-site-context";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
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
import { Grid3X3, List } from "lucide-react";

// Import our new components
import { MOCK_MODERATION_DATA, ModerationItem } from "./components/ModerationData";
import { ModerationFeedView } from "./components/ModerationFeedView";
import { ModerationTableView } from "./components/ModerationTableView";
import { ModerationToolbar } from "./components/ModerationToolbar";
import { ModerationPagination } from "./components/ModerationPagination";
import {
  alertPostColumns,
  memberColumns
} from "./components/ModerationTableColumns";

// Helper functions for styling
const getAlertBadgeColor = (alert: string) => {
  switch (alert) {
    case 'Akismet':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'OOPSpam':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Author Minimum age':
      return 'bg-gray-50 text-gray-700 border-gray-200';
    case 'Multiple reports':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'Suspicious email':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Content violations':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'New user':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    default:
      return 'bg-blue-50 text-blue-700 border-blue-200';
  }
};

const getStatusBadge = (status: string) => {
  const configs = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    reported: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
  };
  const config = configs[status as keyof typeof configs] || configs.pending;
  return `${config.bg} ${config.text} ${config.border}`;
};

function ModerationDashboard({ siteId, siteDetails, siteLoading }: WithSiteContextProps) {
  const [, params] = useRoute("/dashboard/site/:siteSD/moderation/:section?");
  const section = params?.section || "pending-posts";
  const siteIdentifier = params?.siteSD || "";
  
  // UI state
  const [viewMode, setViewMode] = useState<'table' | 'feed'>('table');
  
  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Data state
  const [allData, setAllData] = useState<ModerationItem[]>(MOCK_MODERATION_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter data based on current section
  const filteredData = useMemo(() => {
    switch (section) {
      case 'pending-posts':
        return allData.filter(item => item.type === 'post' && item.status === 'pending');
      case 'reported-posts':
        return allData.filter(item => item.type === 'post' && item.status === 'reported');
      case 'pending-members':
        return allData.filter(item => item.type === 'member' && item.status === 'pending');
      case 'reported-members':
        return allData.filter(item => item.type === 'member' && item.status === 'reported');
      default:
        return allData.filter(item => item.type === 'post' && item.status === 'pending');
    }
  }, [allData, section]);

  // Get the appropriate columns based on section
  const getColumns = () => {
    switch (section) {
      case 'pending-posts':
      case 'reported-posts':
        return alertPostColumns;
      case 'pending-members':
      case 'reported-members':
        return memberColumns;
      default:
        return alertPostColumns;
    }
  };

  // Create table instance
  const table = useReactTable({
    data: filteredData,
    columns: getColumns(),
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

  // Get page title based on the section
  const getPageTitle = () => {
    switch (section) {
      case 'pending-posts':
        return 'Pending Posts';
      case 'reported-posts':
        return 'Reported Posts';
      case 'pending-members':
        return 'Pending Members';
      case 'reported-members':
        return 'Reported Members';
      default:
        return 'Pending Posts';
    }
  };

  // Handle loading state AFTER all hooks
  if (siteLoading || !siteDetails) {
    return <DashboardSkeleton siteSD={siteIdentifier} withSidebar={true} />;
  }

  const siteName = siteDetails.name;
  const siteSD = siteId || siteIdentifier;

  return (
    <DashboardLayout
      siteName={siteName}
      currentSiteIdentifier={siteSD}
    >
      <div className="mx-auto">
        {/* Content container with padding */}
        <div className="px-2 py-3 pb-1.5 sm:px-3 sm:py-4 sm:pb-2">
          <div className="mb-3 flex flex-row items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-medium text-gray-900 dark:text-white">
                {getPageTitle()} <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">{isLoading ? 'Loading...' : `${filteredData.length} item${filteredData.length !== 1 ? 's' : ''}`}</span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                <Button
                  variant={viewMode === 'feed' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('feed')}
                  className="h-7 px-3"
                >
                  <Grid3X3 className="h-4 w-4 mr-1" />
                  Feed
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-7 px-3"
                >
                  <List className="h-4 w-4 mr-1" />
                  Table
                </Button>
              </div>
            </div>
          </div>

          {/* Table toolbar - only show for table view */}
          {viewMode === 'table' && (
            <ModerationToolbar table={table} isLoading={isLoading} />
          )}
        </div>

        {/* Main content area */}
        {viewMode === 'feed' ? (
          <div className="px-2 py-3 sm:px-3 sm:py-4">
            <ModerationFeedView 
              data={filteredData}
              getAlertBadgeColor={getAlertBadgeColor}
              getStatusBadge={getStatusBadge}
            />
          </div>
        ) : (
          /* Table view - Full width with no padding */
          <ModerationTableView
            data={filteredData}
            columns={getColumns()}
            isLoading={isLoading}
            error={error}
            sorting={sorting}
            setSorting={setSorting}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onErrorRetry={() => setError(null)}
            getPageTitle={getPageTitle}
          />
        )}
        
        {/* Pagination controls - container with padding - only for table view */}
        {viewMode === 'table' && (
          <ModerationPagination table={table} isLoading={isLoading} />
        )}
      </div>
    </DashboardLayout>
  );
}

export default withSiteContext(ModerationDashboard); 