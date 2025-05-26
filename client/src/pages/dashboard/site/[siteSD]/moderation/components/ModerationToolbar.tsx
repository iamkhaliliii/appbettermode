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
  Filter,
  ArrowUpDown,
  Columns,
  Search,
  FileOutput,
  Shield,
  ChevronDown,
  CheckCircle,
  XCircle,
  Eye,
  Trash2
} from "lucide-react";
import { Table } from "@tanstack/react-table";
import { ModerationItem } from "./ModerationData";

interface ModerationToolbarProps {
  table: Table<ModerationItem>;
  isLoading: boolean;
}

export const ModerationToolbar: React.FC<ModerationToolbarProps> = ({
  table,
  isLoading
}) => {
  return (
    <div className="mb-0 flex items-center justify-between gap-1.5">
      {/* Left side - Filter, Sort, Column buttons */}
      <div className="flex items-center gap-1.5">
        <button className="inline-flex items-center justify-center h-7 w-7 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Filter className="h-3.5 w-3.5" />
        </button>
        
        <button className="inline-flex items-center justify-center h-7 w-7 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <ArrowUpDown className="h-3.5 w-3.5" />
        </button>
        
        <button className="inline-flex items-center justify-center h-7 w-7 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Columns className="h-3.5 w-3.5" />
        </button>
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
                <CheckCircle className="h-2.5 w-2.5 mr-1.5 text-gray-400 dark:text-gray-500" />
                <span>Approve</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="flex cursor-pointer items-center whitespace-nowrap px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10">
                <XCircle className="h-2.5 w-2.5 mr-1.5 text-gray-400 dark:text-gray-500" />
                <span>Reject</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="my-0.5 h-px bg-gray-200 dark:bg-gray-700" />
              
              <DropdownMenuItem className="flex cursor-pointer items-center whitespace-nowrap px-2 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750">
                <Eye className="h-2.5 w-2.5 mr-1.5 text-gray-400 dark:text-gray-500" />
                <span>Hide</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="flex cursor-pointer items-center whitespace-nowrap px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10">
                <Trash2 className="h-2 w-2 mr-1.5 text-gray-400 dark:text-gray-500" />
                <span>Delete</span>
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
          <Shield className="h-3.5 w-3.5 mr-1" />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}; 