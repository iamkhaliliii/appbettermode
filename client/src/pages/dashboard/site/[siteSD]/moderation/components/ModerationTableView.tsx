import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/primitives";
import {
  ColumnDef,
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
import { AlertTriangle, Shield } from "lucide-react";
import { ModerationItem } from "./ModerationData";

interface ModerationTableViewProps {
  data: ModerationItem[];
  columns: ColumnDef<ModerationItem>[];
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
  getPageTitle: () => string;
}

export const ModerationTableView: React.FC<ModerationTableViewProps> = ({
  data,
  columns,
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
  getPageTitle
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

  return (
    <div className="bg-background dark:bg-background border-y border-border/30 dark:border-border/30 overflow-auto mt-[1px] scrollbar-minimal">
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Loading moderation items...</span>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-32">
          <div className="flex flex-col items-center text-center max-w-md px-4">
            <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-300">{error}</p>
            <button 
              onClick={onErrorRetry}
              className="mt-3 px-3 py-1 text-xs bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 rounded-md border border-primary-200 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-transparent border-b border-border/20 dark:border-border/20 h-8">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="px-4 py-2.5 h-9 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground tracking-wide sticky top-0 bg-background dark:bg-background">
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
                    hover:bg-secondary/40 dark:hover:bg-secondary/40
                    ${row.getIsSelected() ? 'bg-primary/5 dark:bg-primary/5' : ''}
                    ${i % 2 === 0 ? 'bg-background dark:bg-background' : 'bg-secondary/30 dark:bg-secondary/30'}
                    transition-colors
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-1 whitespace-nowrap text-xs border-b border-border/15 dark:border-border/15">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground dark:text-muted-foreground">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Shield className="h-8 w-8 text-muted dark:text-muted" />
                    <span>No {getPageTitle().toLowerCase()} found</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}; 