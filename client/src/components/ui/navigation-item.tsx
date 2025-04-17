
import React from "react";
import { Image, Box, Settings, MoreHorizontal, Pencil, EyeOff, Edit, Trash2 } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavigationItemProps {
  icon?: React.ReactNode;
  title: string;
  iconColor?: string;
}

export function NavigationItem({ icon = <Image />, title, iconColor = "amber", className }: NavigationItemProps & { className?: string }) {
  const isDisabled = className?.includes('pointer-events-none');
  return (
    <div className={`group relative flex items-center justify-between gap-2 py-1.5 px-2 text-xs hover:bg-gray-50/50 dark:hover:bg-gray-800/50 rounded cursor-pointer 
      ${className || ''} 
      ${isDisabled ? 'after:absolute after:inset-0 after:bg-gray-100/30 dark:after:bg-gray-800/30 after:rounded' : ''}`}>
      <div className="flex items-center gap-1.5">
        <div className={`relative bg-${iconColor}-50/50 dark:bg-${iconColor}-900/20 p-0.5 rounded border border-${iconColor}-200 dark:border-${iconColor}-600`}>
          {icon}
          <div className="absolute -bottom-1 -right-1">
            <Box className={`h-2.5 w-2.5 text-${iconColor}-500 dark:text-${iconColor}-400`} />
          </div>
        </div>
        <span className={`dark:text-${iconColor}-200 text-${iconColor}-600/80`}>
          {title}
        </span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-0.5 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded">
          <Settings className="h-3 w-3 text-gray-400" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-0.5 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 rounded">
              <MoreHorizontal className="h-3 w-3 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-36 py-1 shadow-md border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <DropdownMenuItem className="flex items-center text-[12px] py-1 px-2 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300">
              <Pencil className="h-1 w-1 mr-1.5 text-gray-400 dark:text-gray-500" />
              <span>Rename</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center text-[12px] py-1 px-2 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300">
              <EyeOff className="h-1 w-1 mr-1.5 text-gray-400 dark:text-gray-500" />
              <span>Hide</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center text-[12px] py-1 px-2 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300">
              <Edit className="h-1 w-1 mr-1.5 text-gray-400 dark:text-gray-500" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center text-[12px] py-1 px-2 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 dark:text-red-400">
              <Trash2 className="h-1 w-1 mr-1.5 text-red-400 dark:text-red-400" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
