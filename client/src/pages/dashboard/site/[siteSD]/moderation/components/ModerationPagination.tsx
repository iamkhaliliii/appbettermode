import React from "react";
import { Table } from "@tanstack/react-table";
import { ModerationItem } from "./ModerationData";

interface ModerationPaginationProps {
  table: Table<ModerationItem>;
  isLoading: boolean;
}

export const ModerationPagination: React.FC<ModerationPaginationProps> = ({
  table,
  isLoading
}) => {
  return (
    <div className="px-2 py-3 sm:px-3 sm:py-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="text-xs text-muted-foreground dark:text-muted-foreground">
            {!isLoading && table.getFilteredSelectedRowModel().rows.length > 0 ? (
              <span className="flex items-center">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary text-xs font-semibold mr-1">
                  {table.getFilteredSelectedRowModel().rows.length}
                </span>
                selected
              </span>
            ) : (
              <span className="text-[10px]">No items selected</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4 lg:gap-5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground dark:text-muted-foreground">Rows</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              className="h-6 w-14 rounded-md border-none bg-secondary dark:bg-secondary text-foreground dark:text-foreground text-xs"
              disabled={isLoading}
            >
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              className="h-6 w-6 flex items-center justify-center bg-secondary dark:bg-secondary text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              <span className="sr-only">Go to first page</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="11 17 6 12 11 7"></polyline>
                <polyline points="18 17 13 12 18 7"></polyline>
              </svg>
            </button>
            
            <button
              className="h-6 w-6 flex items-center justify-center bg-secondary dark:bg-secondary text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              <span className="sr-only">Go to previous page</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            <div className="flex items-center justify-center min-w-[50px] px-1 h-6 text-xs text-muted-foreground dark:text-muted-foreground">
              <span className="font-medium text-foreground dark:text-foreground">{table.getState().pagination.pageIndex + 1}</span>
              <span className="mx-0.5 text-muted-foreground/60 dark:text-muted-foreground/60">/</span>
              <span>{table.getPageCount() || 1}</span>
            </div>
            
            <button
              className="h-6 w-6 flex items-center justify-center bg-secondary dark:bg-secondary text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
            >
              <span className="sr-only">Go to next page</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
            
            <button
              className="h-6 w-6 flex items-center justify-center bg-secondary dark:bg-secondary text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage() || isLoading}
            >
              <span className="sr-only">Go to last page</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="13 17 18 12 13 7"></polyline>
                <polyline points="6 17 11 12 6 7"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 