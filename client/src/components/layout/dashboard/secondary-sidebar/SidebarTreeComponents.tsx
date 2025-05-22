import React, { useState } from "react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import Dropdown components
import {
  ChevronDown,
  MoreHorizontal,
  Trash2,
  Pencil,
  Eye,
  Settings2,
  EyeOff,
  Folder,
  Home,
  House,
} from "lucide-react";
import { MinimalItemProps, TreeFolderProps } from "./types";
import { MiniToggle } from "./MiniToggle";

// Moved tempNormalize to module scope and renamed to normalizePath
const normalizePath = (p: string | undefined): string => {
  if (!p) return "";
  return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p;
};

export function MinimalItem({
  name,
  path,
  icon,
  currentPathname: rawCurrentPathname,
  iconColor = "text-gray-500",
  level = 0,
  isHidden = false,
  isFile = true,
  inSpaces = false,
  decorationIcon,
  showToggle,
  toggleOn,
  isPrimary,
  isHomepage,
  onEdit,
}: MinimalItemProps) {
  const [hidden, setHidden] = useState(isHidden);
  
  const currentPath = normalizePath(rawCurrentPathname);
  const itemPath = normalizePath(path);
  const isActive = currentPath === itemPath || (isHomepage && currentPath.startsWith(itemPath));

  const displayName = name.includes(".") ? name.split(".")[0] : name;
  const showHideOption = inSpaces && isFile;

  const toggleHidden = () => {
    setHidden(!hidden);
  };

  if (hidden) {
    return (
      <div className="relative group">
        <div
          className={cn(
            "flex items-center justify-between px-2 py-1 text-xs cursor-pointer my-0.5 transition-colors duration-150 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
          )}
          style={{ paddingLeft: level === 0 ? "12px" : `${level * 10 + 16}px` }}
        >
          <div className="flex items-center">
            <span
              className={cn("flex-shrink-0 mr-1.5 text-gray-400", iconColor)}
            >
              {icon}
            </span>
            <span className="font-medium text-gray-400">{displayName}</span>
            <EyeOff className="h-4 pl-1 w-4 mr-1 text-gray-400" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-3 w-3 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="py-0.5">
                {showHideOption && (
                  <DropdownMenuItem
                    onClick={toggleHidden}
                    className="flex items-center px-2 py-0.5 text-[11px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Eye className="h-3 w-3 mr-1.5 text-gray-500" />
                    <span>Show</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="flex items-center px-2 py-0.5 text-[11px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Pencil className="h-3 w-3 mr-1.5 text-gray-500" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center px-2 py-0.5 text-[11px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Settings2 className="h-3 w-3 mr-1.5 text-gray-500" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center px-2 py-0.5 text-[11px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                  <Trash2 className="h-3 w-3 mr-1.5 text-red-500" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div
        className={cn(
          "flex items-center justify-center px-2 py-1 text-xs cursor-pointer my-0.5 transition-colors duration-150 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
        )}
        style={{ paddingLeft: level === 0 ? "12px" : `${level * 10 + 16}px` }}
      >
        <div className="flex items-center flex-1 gap-1.5">
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <span className={cn("flex-shrink-0", iconColor)}>{icon}</span>
              {decorationIcon && (
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-black" >
                  {React.cloneElement(decorationIcon as React.ReactElement, {
                    className: `h-2.5 w-2.5 text-${iconColor.split("text-")[1]}`,
                  })}
                </div>
              )}
            </div>
          </div>
          <Link href={path}>
            <span className={cn("font-medium flex items-center", iconColor)}>
              
              {displayName}
              {isHomepage && <House className="ml-1 text-violet-500 h-3 w-3 mr-1 opacity-75" />}
            </span>
          </Link>
        </div>
        <div className="flex items-center justify-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button className="opacity-0 items-center justify-center group-hover:opacity-100">
              <MoreHorizontal className="h-4 w-4 p-0.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
            <div className="py-0.5">
              {showHideOption && (
                <DropdownMenuItem
                  onClick={toggleHidden}
                  className="flex items-center px-2 py-0.5 text-[11px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {hidden ? (
                    <>
                      <Eye className="h-3 w-3 mr-1.5 text-gray-500" />
                      <span>Show</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3 mr-1.5 text-gray-500" />
                      <span>Hide</span>
                    </>
                  )}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="flex items-center px-2 py-0.5 text-[11px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <Pencil className="h-3 w-3 mr-1.5 text-gray-500" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center px-2 py-0.5 text-[11px] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => onEdit && onEdit()}
              >
                <Settings2 className="h-3 w-3 mr-1.5 text-gray-500" />
                <span>Edit</span>
              </DropdownMenuItem>
              {/* Conditional Delete Option */}
              {!isPrimary && (
                <DropdownMenuItem className="flex items-center px-2 py-0.5 text-[11px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                  <Trash2 className="h-3 w-3 mr-1.5 text-red-500" />
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Conditionally render MiniToggle */}
        {showToggle && (
          <div className="ml-auto mr-1 flex items-center"> 
            <MiniToggle 
              isActive={toggleOn} // Pass toggleOn to MiniToggle's isActive prop
              onChange={(state) => console.log(`Toggle for ${name} (${path}): ${state}`)} 
            />
          </div>
        )}
        </div>

      </div>
    </div>
  );
}

export function TreeFolder({
  name,
  path,
  level = 0,
  isExpanded = false,
  children,
  currentPathname: rawCurrentPathname,
}: TreeFolderProps) {
  const [expanded, setExpanded] = useState(isExpanded);
  
  const currentPath = normalizePath(rawCurrentPathname);
  const folderPath = normalizePath(path);
  
  let newIsActive = false;
  if (folderPath) {
    if (folderPath === '/') {
      newIsActive = currentPath === '/';
    } else {
      newIsActive = currentPath === folderPath || currentPath.startsWith(folderPath + '/');
    }
  } else if (path === '/' && rawCurrentPathname === '/') { // Handles root path case if normalization results in empty
    newIsActive = true;
  }
  const isActive = newIsActive;

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <div className="folder-tree-item">
      <div className="relative group">
        <div
          className={cn(
            "flex items-center justify-between px-2 py-1 text-xs cursor-pointer my-0.5 transition-colors duration-150 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800",
          )}
          style={{ paddingLeft: level === 0 ? "12px" : `${level * 10 + 16}px` }}
        >
          <div className="flex items-center flex-1">
            <span
              className="w-4 h-4 mr-1 flex-shrink-0 flex items-center justify-center cursor-pointer"
              onClick={handleToggle}
            >
              <ChevronDown
                className={cn(
                  "h-3 w-3 text-gray-500 transition-transform",
                  expanded ? "transform rotate-0" : "transform -rotate-90",
                )}
              />
            </span>
            <div
              className="flex items-center cursor-pointer"
              onClick={handleToggle}
            >
              <Folder className="h-3.5 w-3.5 mr-1 text-gray-400" />
              <span className="font-medium text-gray-500">{name}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <button className="opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-3 w-3 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="py-1">
                <DropdownMenuItem className="flex items-center px-3 py-0.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Pencil className="h-3 w-3 mr-2 text-gray-500" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center px-3 py-0.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Settings2 className="h-3 w-3 mr-2 text-gray-500" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center px-3 py-0.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                  <Trash2 className="h-3 w-3 mr-2 text-red-500" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {expanded && children && <div>{children}</div>}
    </div>
  );
} 