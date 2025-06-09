import { ColumnDef } from "@tanstack/react-table";
import { 
  ChevronDown, 
  ChevronUp,
  MoreVertical,
  MessageSquare,
  Star,
  FileText,
  File,
  Hash,
} from "lucide-react";
import { Checkbox } from "@/components/ui/primitives";
import { Button } from "@/components/ui/primitives";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/forms";
import { Post } from './types';

// Column definitions for the table
export const columns: ColumnDef<Post>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="px-2">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="opacity-70 hover:opacity-100 transition-opacity"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="opacity-70 hover:opacity-100 transition-opacity"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      sticky: "left"
    }
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center space-x-1 group text-left focus:outline-none"
        >
          <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Title</span>
          {column.getIsSorted() ? (
            <div className={`transition-colors ${column.getIsSorted() === "asc" ? "text-primary-500" : "text-primary-500"}`}>
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </div>
          ) : (
            <ChevronDown className="h-3.5 w-3.5 opacity-0 group-hover:opacity-70 text-gray-400 transition-opacity" />
          )}
        </button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center space-x-1 group text-left focus:outline-none"
        >
          <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Status</span>
          {column.getIsSorted() ? (
            <div className={`transition-colors ${column.getIsSorted() === "asc" ? "text-primary-500" : "text-primary-500"}`}>
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </div>
          ) : (
            <ChevronDown className="h-3.5 w-3.5 opacity-0 group-hover:opacity-70 text-gray-400 transition-opacity" />
          )}
        </button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const statusConfig: Record<string, { bgClass: string; textClass: string; dotColor: string; borderClass: string }> = {
        "Published": { 
          bgClass: "bg-blue-50 dark:bg-blue-900/30", 
          textClass: "text-blue-700 dark:text-blue-300",
          dotColor: "text-blue-500 dark:text-blue-400",
          borderClass: "border border-blue-200 dark:border-blue-700/50"
        },
        "Draft": { 
          bgClass: "bg-slate-100 dark:bg-slate-800/50", 
          textClass: "text-slate-700 dark:text-slate-300",
          dotColor: "text-slate-500 dark:text-slate-400",
          borderClass: "border border-slate-200 dark:border-slate-600/50"
        },
        "Schedule": { 
          bgClass: "bg-purple-50 dark:bg-purple-900/30", 
          textClass: "text-purple-700 dark:text-purple-300",
          dotColor: "text-purple-500 dark:text-purple-400",
          borderClass: "border border-purple-200 dark:border-purple-700/50"
        },
        "Pending review": { 
          bgClass: "bg-amber-50 dark:bg-amber-900/30", 
          textClass: "text-amber-700 dark:text-amber-300",
          dotColor: "text-amber-500 dark:text-amber-400",
          borderClass: "border border-amber-200 dark:border-amber-700/50"
        },
      }
      
      const config = statusConfig[status] || statusConfig["Draft"]
      
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${config.bgClass} ${config.textClass} ${config.borderClass}`}>
          <svg className={`mr-1.5 h-2 w-2 ${config.dotColor}`} fill="currentColor" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" />
          </svg>
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: "author",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center space-x-1 group text-left focus:outline-none"
        >
          <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Author</span>
          {column.getIsSorted() ? (
            <div className={`transition-colors ${column.getIsSorted() === "asc" ? "text-primary-500" : "text-primary-500"}`}>
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </div>
          ) : (
            <ChevronDown className="h-3.5 w-3.5 opacity-0 group-hover:opacity-70 text-gray-400 transition-opacity" />
          )}
        </button>
      )
    },
    cell: ({ row }) => {
      const author = row.getValue("author") as { name: string; avatar: string }
      return (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-5 w-5 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
            <img 
              className="h-full w-full object-cover" 
              src={author.avatar} 
              alt={author.name}
            />
          </div>
          <div className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            {author.name}
          </div>
        </div>
      )
    },
    sortingFn: (rowA, rowB) => {
      const authorA = rowA.getValue("author") as { name: string }
      const authorB = rowB.getValue("author") as { name: string }
      return authorA.name.localeCompare(authorB.name)
    },
  },
  {
    accessorKey: "space",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center space-x-1 group text-left focus:outline-none"
        >
          <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Space</span>
          {column.getIsSorted() ? (
            <div className={`transition-colors ${column.getIsSorted() === "asc" ? "text-primary-500" : "text-primary-500"}`}>
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </div>
          ) : (
            <ChevronDown className="h-3.5 w-3.5 opacity-0 group-hover:opacity-70 text-gray-400 transition-opacity" />
          )}
        </button>
      )
    },
    cell: ({ row }) => {
      const space = row.getValue("space") as { name: string; color: string }
      
      const getIconForSpace = (spaceName: string) => {
        switch(spaceName.toLowerCase()) {
          case 'discussions':
            return <MessageSquare className="h-3 w-3 mr-1" />;
          case 'wishlist':
            return <Star className="h-3 w-3 mr-1" />;
          case 'articles':
            return <FileText className="h-3 w-3 mr-1" />;
          case 'pages':
            return <File className="h-3 w-3 mr-1" />;
          default:
            return <Hash className="h-2 w-2 mr-0.5" />;
        }
      };
      
      return (
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300">
            {getIconForSpace(space.name)}
            {space.name}
          </span>
        </div>
      )
    },
    sortingFn: (rowA, rowB) => {
      const spaceA = rowA.getValue("space") as { name: string }
      const spaceB = rowB.getValue("space") as { name: string }
      return spaceA.name.localeCompare(spaceB.name)
    },
  },
  {
    accessorKey: "publishedAt",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center space-x-1 group text-left focus:outline-none"
        >
          <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Published</span>
          {column.getIsSorted() ? (
            <div className={`transition-colors ${column.getIsSorted() === "asc" ? "text-primary-500" : "text-primary-500"}`}>
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </div>
          ) : (
            <ChevronDown className="h-3.5 w-3.5 opacity-0 group-hover:opacity-70 text-gray-400 transition-opacity" />
          )}
        </button>
      )
    },
    cell: ({ row }) => {
      return <div>{row.getValue("publishedAt")}</div>
    }
  },
  {
    accessorKey: "cmsModel",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center space-x-1 group text-left focus:outline-none"
        >
          <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Type</span>
          {column.getIsSorted() ? (
            <div className={`transition-colors ${column.getIsSorted() === "asc" ? "text-primary-500" : "text-primary-500"}`}>
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </div>
          ) : (
            <ChevronDown className="h-3.5 w-3.5 opacity-0 group-hover:opacity-70 text-gray-400 transition-opacity" />
          )}
        </button>
      )
    },
    cell: ({ row }) => {
      const model = row.getValue("cmsModel") as string
      
      const config = {
        bgClass: "bg-indigo-50 dark:bg-indigo-900/30", 
        textClass: "text-indigo-700 dark:text-indigo-300"
      }
      
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${config.bgClass} ${config.textClass}`}>
          <svg className="mr-1 h-2 w-2 text-indigo-500 dark:text-indigo-400" fill="currentColor" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" />
          </svg>
          {model}
        </span>
      )
    },
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center space-x-1 group text-left focus:outline-none"
        >
          <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">ID</span>
          {column.getIsSorted() ? (
            <div className={`transition-colors ${column.getIsSorted() === "asc" ? "text-primary-500" : "text-primary-500"}`}>
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </div>
          ) : (
            <ChevronDown className="h-3.5 w-3.5 opacity-0 group-hover:opacity-70 text-gray-400 transition-opacity" />
          )}
        </button>
      )
    },
    cell: ({ row }) => {
      const id = row.getValue("id") as string
      return <span className="text-gray-500 dark:text-gray-400">{id}</span>
    },
  },
  {
    accessorKey: "tags",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center space-x-1 group text-left focus:outline-none"
        >
          <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Tags</span>
          {column.getIsSorted() ? (
            <div className={`transition-colors ${column.getIsSorted() === "asc" ? "text-primary-500" : "text-primary-500"}`}>
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </div>
          ) : (
            <ChevronDown className="h-3.5 w-3.5 opacity-0 group-hover:opacity-70 text-gray-400 transition-opacity" />
          )}
        </button>
      )
    },
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[]
      if (!tags || tags.length === 0) return null
      
      const neutralConfig = {
        bgClass: "bg-gray-100 dark:bg-gray-800/40", 
        textClass: "text-gray-700 dark:text-gray-300"
      }
      
      const tagConfig: Record<string, typeof neutralConfig> = {
        "Discussion": neutralConfig,
        "new": neutralConfig,
        "me_too": neutralConfig,
        "question": neutralConfig,
        "bug": neutralConfig,
        "community": neutralConfig,
        "featured": neutralConfig,
      }
      
      const defaultConfig = neutralConfig
      
      return (
        <div className="flex items-center gap-1 overflow-hidden max-w-xs">
          {tags.slice(0, 2).map((tag, i) => {
            const config = tagConfig[tag] || defaultConfig
            return (
              <span 
                key={i} 
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs whitespace-nowrap border
                ${config.bgClass} ${config.textClass} border-gray-200 dark:border-gray-700`}
              >
                {tag}
              </span>
            )
          })}
          {tags.length > 2 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300 whitespace-nowrap border border-gray-200 dark:border-gray-700">
              +{tags.length - 2}
            </span>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: "locked",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center justify-center space-x-1 group text-center focus:outline-none"
        >
          <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Locked</span>
          {column.getIsSorted() ? (
            <div className={`transition-colors ${column.getIsSorted() === "asc" ? "text-primary-500" : "text-primary-500"}`}>
              {column.getIsSorted() === "asc" ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </div>
          ) : (
            <ChevronDown className="h-3.5 w-3.5 opacity-0 group-hover:opacity-70 text-gray-400 transition-opacity" />
          )}
        </button>
      )
    },
    cell: ({ row }) => {
      const locked = row.getValue("locked") as boolean
      return (
        <div className="text-center">
          {locked ? (
            <span className="text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
          ) : (
            <span className="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Archive</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    meta: {
      sticky: "right"
    }
  },
]; 