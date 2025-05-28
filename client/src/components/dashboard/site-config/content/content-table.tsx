import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Post } from './types';
import { columns } from './table-columns';

interface ContentTableProps {
  data: Post[];
  isLoading: boolean;
  error: string | null;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
  rowSelection: {};
  setRowSelection: React.Dispatch<React.SetStateAction<{}>>;
  onErrorRetry: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setShowPublishedOnly: (show: boolean) => void;
  setShowStatusFilter: (show: boolean) => void;
}

export const ContentTable: React.FC<ContentTableProps> = ({
  data,
  isLoading,
  error,
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
  columnVisibility,
  setColumnVisibility,
  rowSelection,
  setRowSelection,
  onErrorRetry,
  activeTab,
  setActiveTab,
  setShowPublishedOnly,
  setShowStatusFilter
}) => {
  // Create table instance
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Loading posts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="flex flex-col items-center text-center max-w-md px-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-gray-600 dark:text-gray-300">{error}</p>
          <button 
            onClick={onErrorRetry}
            className="mt-3 px-3 py-1 text-xs bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 rounded-md border border-primary-200 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <Table className="w-full">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="bg-transparent border-b border-border/20 dark:border-border/20 h-8">
            {headerGroup.headers.map((header) => {
              const isActionsColumn = header.column.id === "actions";
              const isSelectColumn = header.column.id === "select";
              return (
                <TableHead 
                  key={header.id} 
                  className={`px-4 py-2.5 h-9 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground tracking-wide sticky top-0 ${
                    isActionsColumn 
                      ? "sticky right-0 z-20 bg-white dark:bg-gray-900 border-l border-border/30 dark:border-border/30 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)] dark:shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.3)]" 
                      : isSelectColumn
                      ? "sticky left-0 z-20 bg-white dark:bg-gray-900 border-r border-border/30 dark:border-border/30 shadow-[4px_0_8px_-2px_rgba(0,0,0,0.1)] dark:shadow-[4px_0_8px_-2px_rgba(0,0,0,0.3)]"
                      : "bg-white dark:bg-gray-900"
                  }`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row, i) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className={`
                hover:bg-gray-100 dark:hover:bg-gray-700
                ${row.getIsSelected() ? 'bg-blue-50 dark:bg-blue-900' : i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'}
                transition-colors group
              `}
            >
              {row.getVisibleCells().map((cell) => {
                const isActionsColumn = cell.column.id === "actions";
                const isSelectColumn = cell.column.id === "select";
                const rowIndex = i;
                
                // Determine background color based on row state and index
                let bgColor = "";
                if (row.getIsSelected()) {
                  bgColor = "bg-blue-50 dark:bg-blue-900";
                } else if (rowIndex % 2 === 0) {
                  bgColor = "bg-white dark:bg-gray-900";
                } else {
                  bgColor = "bg-gray-50 dark:bg-gray-800";
                }
                
                return (
                  <TableCell 
                    key={cell.id} 
                    className={`px-4 py-1 whitespace-nowrap text-xs border-b border-border/15 dark:border-border/15 ${
                      isActionsColumn 
                        ? `sticky right-0 z-10 ${bgColor} border-l border-border/30 dark:border-border/30 shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.1)] dark:shadow-[-4px_0_8px_-2px_rgba(0,0,0,0.3)] group-hover:bg-gray-100 dark:group-hover:bg-gray-700` 
                        : isSelectColumn
                        ? `sticky left-0 z-10 ${bgColor} border-r border-border/30 dark:border-border/30 shadow-[4px_0_8px_-2px_rgba(0,0,0,0.1)] dark:shadow-[4px_0_8px_-2px_rgba(0,0,0,0.3)] group-hover:bg-gray-100 dark:group-hover:bg-gray-700`
                        : ""
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                )
              })}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground dark:text-muted-foreground">
              <div className="flex flex-col items-center justify-center space-y-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-muted dark:text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>No posts found</span>
                {activeTab !== 'all' && (
                  <button 
                    onClick={() => {
                      setActiveTab('all');
                      setShowPublishedOnly(false);
                      setShowStatusFilter(false);
                    }}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Show all posts
                  </button>
                )}
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}; 