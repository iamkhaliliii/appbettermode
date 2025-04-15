import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Check, ChevronDown, ChevronsUpDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import type { CheckedState } from "@radix-ui/react-checkbox";

export type Column<T> = {
  id: string;
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
};

export type SortingState = {
  id: string;
  desc: boolean;
} | null;

export type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  showCheckbox?: boolean;
  filterComponent?: React.ReactNode;
};

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  searchPlaceholder = "Search...",
  showCheckbox = true,
  filterComponent,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [sorting, setSorting] = useState<SortingState>(null);

  // Handle sorting
  const sortedData = useMemo(() => {
    if (!sorting) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sorting.id as keyof T];
      const bValue = b[sorting.id as keyof T];
      
      const modifier = sorting.desc ? -1 : 1;
      
      if (aValue === bValue) return 0;
      
      // Handle numbers
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue > bValue ? 1 : -1) * modifier;
      }
      
      // Handle strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * modifier;
      }
      
      // Handle dates
      if (aValue instanceof Date && bValue instanceof Date) {
        return ((aValue as Date).getTime() > (bValue as Date).getTime() ? 1 : -1) * modifier;
      }
      
      return 0;
    });
  }, [data, sorting]);

  // Handle search filtering
  const filteredData = useMemo(() => {
    if (!searchQuery) return sortedData;
    
    return sortedData.filter((item) => {
      return columns.some((column) => {
        const value = item[column.accessorKey];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  }, [sortedData, searchQuery, columns]);

  // Check if all visible rows are selected
  const allRowsSelected = useMemo(() => {
    return filteredData.every(row => {
      const id = row.id?.toString();
      return id && selectedRows.has(id);
    });
  }, [filteredData, selectedRows]);

  // Toggle all rows selection
  const toggleAllRows = () => {
    if (allRowsSelected) {
      setSelectedRows(new Set());
    } else {
      const newSelected = new Set(selectedRows);
      filteredData.forEach(row => {
        if (row.id) newSelected.add(row.id);
      });
      setSelectedRows(newSelected);
    }
  };

  // Toggle single row selection
  const toggleRowSelection = (id: string | number | undefined) => {
    if (!id) return;
    
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder={searchPlaceholder}
            className="pl-9 max-w-xs border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {filterComponent}
      </div>
      
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <TableHeader className="bg-gray-50 dark:bg-gray-900/50">
            <TableRow className="border-b-0">
              {showCheckbox && (
                <TableHead className="w-14 px-4 py-3.5 text-left">
                  <div className="flex items-center">
                    <Checkbox 
                      checked={allRowsSelected && filteredData.length > 0 ? true : false}
                      onCheckedChange={(_checked) => toggleAllRows()}
                      className="border-gray-300 dark:border-gray-600"
                    />
                  </div>
                </TableHead>
              )}
              
              {columns.map((column) => (
                <TableHead 
                  key={column.id}
                  className={cn(
                    "px-4 py-3.5 text-sm font-medium text-gray-600 dark:text-gray-300",
                    column.sortable ? "cursor-pointer select-none" : ""
                  )}
                  onClick={() => {
                    if (!column.sortable) return;
                    setSorting(prev => {
                      if (prev?.id !== column.id) return { id: column.id, desc: false };
                      if (prev.desc) return null;
                      return { id: column.id, desc: true };
                    });
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.header}</span>
                    {column.sortable && (
                      <div className="flex flex-shrink-0 items-center">
                        {sorting?.id === column.id ? (
                          sorting.desc ? (
                            <ChevronDown className="h-4 w-4 opacity-80" />
                          ) : (
                            <ChevronDown className="h-4 w-4 opacity-80 rotate-180" />
                          )
                        ) : (
                          <ChevronsUpDown className="h-4 w-4 opacity-30" />
                        )}
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900/10">
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (showCheckbox ? 1 : 0)} 
                  className="h-52 text-center text-gray-500 dark:text-gray-400"
                >
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((row, rowIndex) => (
                <TableRow 
                  key={row.id?.toString() || rowIndex}
                  className={cn(
                    "hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors",
                    row.id && selectedRows.has(row.id) ? "bg-primary-50 dark:bg-primary-900/20" : ""
                  )}
                >
                  {showCheckbox && (
                    <TableCell className="w-14 px-4 py-4">
                      <div className="flex items-center">
                        <Checkbox 
                          checked={row.id ? selectedRows.has(row.id) : false}
                          onCheckedChange={(_checked) => toggleRowSelection(row.id)}
                          className="border-gray-300 dark:border-gray-600"
                        />
                      </div>
                    </TableCell>
                  )}
                  
                  {columns.map(column => (
                    <TableCell key={column.id} className="px-4 py-4 text-sm text-gray-700 dark:text-gray-300">
                      {column.cell ? column.cell(row) : (row[column.accessorKey] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-between">
        <div>{selectedRows.size > 0 && `${selectedRows.size} item${selectedRows.size > 1 ? 's' : ''} selected`}</div>
        <div>{`Showing ${filteredData.length} of ${data.length} results`}</div>
      </div>
    </div>
  );
}