import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Filter, 
  MoreHorizontal, 
  ListFilter,
  CircleX,
  Trash,
  MoreVertical
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation, useRoute, useParams, Redirect } from "wouter";
import { useEffect, useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define post data type
interface Post {
  id: string;
  title: string;
  status: "Published" | "Draft" | "Schedule" | "Pending review";
  author: {
    name: string;
    avatar: string;
  };
  space: {
    name: string;
    color: string;
  };
  publishedAt: string;
  cmsModel: string;
  tags: string[];
  locked: boolean;
}

// Column definitions for the table
const columns: ColumnDef<Post>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
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
      const statusConfig: Record<string, { bgClass: string; textClass: string; }> = {
        "Published": { 
          bgClass: "bg-green-50/60 dark:bg-green-900/10", 
          textClass: "text-green-600 dark:text-green-400"
        },
        "Draft": { 
          bgClass: "bg-gray-50/60 dark:bg-gray-800/30", 
          textClass: "text-gray-600 dark:text-gray-400"
        },
        "Schedule": { 
          bgClass: "bg-blue-50/60 dark:bg-blue-900/10", 
          textClass: "text-blue-600 dark:text-blue-400"
        },
        "Pending review": { 
          bgClass: "bg-amber-50/60 dark:bg-amber-900/10", 
          textClass: "text-amber-600 dark:text-amber-400"
        },
      }
      
      const config = statusConfig[status] || statusConfig["Draft"]
      
      return (
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs whitespace-nowrap ${config.bgClass} ${config.textClass}`}>
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
          <div className="flex-shrink-0 h-5 w-5">
            <img className="h-5 w-5 rounded-full" src={author.avatar} alt={author.name} />
          </div>
          <div className="ml-2">{author.name}</div>
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
      return (
        <div className="flex items-center">
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs whitespace-nowrap`} 
               style={{ 
                 backgroundColor: `${space.color}15`, 
                 color: space.color
               }}>
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
          <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Model</span>
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
      const modelConfig: Record<string, { bgClass: string; textClass: string; }> = {
        "Discussion": { 
          bgClass: "bg-purple-50/60 dark:bg-purple-900/10", 
          textClass: "text-purple-600 dark:text-purple-400"
        },
        "Wishlist": { 
          bgClass: "bg-amber-50/60 dark:bg-amber-900/10", 
          textClass: "text-amber-600 dark:text-amber-400"
        },
        "Article": { 
          bgClass: "bg-blue-50/60 dark:bg-blue-900/10", 
          textClass: "text-blue-600 dark:text-blue-400"
        },
        "Page": { 
          bgClass: "bg-emerald-50/60 dark:bg-emerald-900/10", 
          textClass: "text-emerald-600 dark:text-emerald-400"
        },
      }
      
      const config = modelConfig[model] || {
        bgClass: "bg-gray-50/60 dark:bg-gray-800/30", 
        textClass: "text-gray-600 dark:text-gray-400"
      }
      
      return (
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs whitespace-nowrap ${config.bgClass} ${config.textClass}`}>
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
      
      const tagConfig: Record<string, { bgClass: string; textClass: string; }> = {
        "Discussion": { 
          bgClass: "bg-purple-50/60 dark:bg-purple-900/10", 
          textClass: "text-purple-600 dark:text-purple-400"
        },
        "new": { 
          bgClass: "bg-blue-50/60 dark:bg-blue-900/10", 
          textClass: "text-blue-600 dark:text-blue-400"
        },
        "me_too": { 
          bgClass: "bg-emerald-50/60 dark:bg-emerald-900/10", 
          textClass: "text-emerald-600 dark:text-emerald-400"
        },
        "question": { 
          bgClass: "bg-amber-50/60 dark:bg-amber-900/10", 
          textClass: "text-amber-600 dark:text-amber-400"
        },
        "bug": { 
          bgClass: "bg-red-50/60 dark:bg-red-900/10", 
          textClass: "text-red-600 dark:text-red-400"
        },
        "community": { 
          bgClass: "bg-indigo-50/60 dark:bg-indigo-900/10", 
          textClass: "text-indigo-600 dark:text-indigo-400"
        },
        "featured": { 
          bgClass: "bg-fuchsia-50/60 dark:bg-fuchsia-900/10", 
          textClass: "text-fuchsia-600 dark:text-fuchsia-400"
        },
      }
      
      const defaultConfig = {
        bgClass: "bg-gray-50/60 dark:bg-gray-800/30", 
        textClass: "text-gray-600 dark:text-gray-400"
      }
      
      return (
        <div className="flex items-center gap-1 overflow-hidden max-w-xs">
          {tags.slice(0, 2).map((tag, i) => {
            const config = tagConfig[tag] || defaultConfig
            return (
              <span 
                key={i} 
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs whitespace-nowrap
                ${config.bgClass} ${config.textClass}`}
              >
                {tag}
              </span>
            )
          })}
          {tags.length > 2 && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-50/60 dark:bg-gray-800/30 text-gray-600 dark:text-gray-400 whitespace-nowrap">
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
  },
]

// Sample data for the demonstration
const data: Post[] = [
  {
    id: "dOUwwAq3Lc9vmA",
    title: "Level Up Your Community",
    status: "Schedule",
    author: {
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Discussions",
      color: "#6366f1"
    },
    publishedAt: "Jan 13, 2025",
    cmsModel: "Discussion",
    tags: ["Discussion", "new", "me_too"],
    locked: false
  },
  {
    id: "9fXYxHmWxwvcf15",
    title: "Community Building Strategies",
    status: "Pending review",
    author: {
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Wishlist",
      color: "#eab308"
    },
    publishedAt: "Jan 13, 2025",
    cmsModel: "Wishlist",
    tags: ["Discussion", "new", "me_too"],
    locked: true
  },
  {
    id: "qbJgwG9RtWsJW5d",
    title: "Engaging Your Online Community",
    status: "Pending review",
    author: {
      name: "John Doe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Discussions",
      color: "#6366f1"
    },
    publishedAt: "Jan 13, 2025",
    cmsModel: "Discussion",
    tags: ["Discussion", "new", "me_too"],
    locked: false
  },
  {
    id: "5tRgT7Y9oP4Z1qA",
    title: "Modern Community Examples",
    status: "Published",
    author: {
      name: "Jane Smith",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Articles",
      color: "#2563eb"
    },
    publishedAt: "Jan 14, 2025",
    cmsModel: "Article",
    tags: ["community", "featured"],
    locked: false
  },
];

export default function Content() {
  const [location, setLocation] = useLocation();
  const [, params] = useRoute('/content/:section');
  const section = params?.section;
  
  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Show appropriate content based on section
  const getTitle = () => {
    switch(section) {
      case 'CMS':
        return 'CMS Collections';
      case 'activity':
        return 'Activity Hub';
      default:
        return 'Content Management';
    }
  };
  
  // For the CMS section, we want to show a detailed table view
  if (section === 'CMS') {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-6 sm:p-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white flex items-center">
                All Posts
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-200 dark:border-primary-800/30">
                  14 items
                </span>
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Manage all your content from a single, powerful interface
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary-gray" size="sm" className="h-9 px-3 py-2 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
                Export
              </Button>
              <Button size="sm" className="h-9 px-3 py-2 bg-primary-600/90 hover:bg-primary-600 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Content
              </Button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap -mb-px">
              <button className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400 relative">
                All <span className="ml-2 rounded-full bg-primary-50 border border-primary-200 dark:border-primary-800/40 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 text-xs">14</span>
                <span className="absolute -bottom-px left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full"></span>
              </button>
              <button className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                Published <span className="ml-2 rounded-full bg-green-50 border border-green-200 dark:border-green-800/40 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-0.5 text-xs">6</span>
              </button>
              <button className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                Scheduled <span className="ml-2 rounded-full bg-blue-50 border border-blue-200 dark:border-blue-800/40 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 text-xs">3</span>
              </button>
              <button className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                Drafts <span className="ml-2 rounded-full bg-gray-50 border border-gray-200 dark:border-gray-700 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 px-2 py-0.5 text-xs">0</span>
              </button>
              <button className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                Pending <span className="ml-2 rounded-full bg-yellow-50 border border-yellow-200 dark:border-yellow-800/40 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 text-xs">0</span>
              </button>
              <button className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                Reported <span className="ml-2 rounded-full bg-red-50 border border-red-200 dark:border-red-800/40 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 text-xs">0</span>
              </button>
            </div>
          </div>

          {/* Table toolbar */}
          <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                <button className="p-1.5 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  </svg>
                </button>
                <button className="p-1.5 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>
              
              <div className="h-6 border-r border-gray-300 dark:border-gray-600 mx-1"></div>
              
              <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
              </button>
              
              <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Sort
              </button>
              
              <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Columns
              </button>
            </div>
            
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search content..."
                  className="w-full py-1.5 pl-9 pr-3 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Main table */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 rounded-xl overflow-hidden shadow-sm backdrop-blur-sm">
            <Table className="w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-transparent border-b border-gray-200/70 dark:border-gray-700/70">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="px-2 py-1 text-left text-xs font-medium text-gray-400 dark:text-gray-500 tracking-wide">
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
                        hover:bg-gray-50/40 dark:hover:bg-gray-750/40
                        ${row.getIsSelected() ? 'bg-primary-50/20 dark:bg-primary-900/5' : ''}
                        ${i % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/30 dark:bg-gray-800/30'}
                        transition-colors
                      `}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-2 py-1 whitespace-nowrap text-xs border-b border-gray-100/50 dark:border-gray-800/50">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-32 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span>No results found</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination controls */}
          <div className="flex items-center justify-between gap-4 pt-6 pb-2 mt-2">
            <div className="flex items-center gap-2.5">
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {table.getFilteredSelectedRowModel().rows.length > 0 ? (
                  <span className="flex items-center">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 text-xs font-semibold mr-1.5">
                      {table.getFilteredSelectedRowModel().rows.length}
                    </span>
                    {table.getFilteredSelectedRowModel().rows.length === 1 ? 'item' : 'items'} selected
                  </span>
                ) : (
                  <span>No items selected</span>
                )}
              </div>
              
              {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <Button
                  variant="secondary-gray"
                  size="sm"
                  className="h-8 py-0 px-2.5 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 text-xs border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                    <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                  </svg>
                  Export selected
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-6 lg:gap-8">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Rows</span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value))
                  }}
                  className="h-8 w-16 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm"
                >
                  {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-1.5">
                <Button
                  variant="secondary-gray"
                  className="hidden h-8 w-8 p-0 lg:flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="11 17 6 12 11 7"></polyline>
                    <polyline points="18 17 13 12 18 7"></polyline>
                  </svg>
                </Button>
                
                <Button
                  variant="secondary-gray"
                  className="h-8 w-8 p-0 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </Button>
                
                <div className="flex items-center justify-center min-w-[80px] px-1.5 h-8 text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{table.getState().pagination.pageIndex + 1}</span>
                  <span className="mx-1 text-gray-400 dark:text-gray-600">/</span>
                  <span>{table.getPageCount() || 1}</span>
                </div>
                
                <Button
                  variant="secondary-gray"
                  className="h-8 w-8 p-0 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </Button>
                
                <Button
                  variant="secondary-gray"
                  className="hidden h-8 w-8 p-0 lg:flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="13 17 18 12 13 7"></polyline>
                    <polyline points="6 17 11 12 6 7"></polyline>
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {/* Action menu - Floating action button */}
          <div className="fixed bottom-6 right-6 z-20">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-primary-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <button className="relative bg-primary-600 hover:bg-primary-500 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                <Plus className="h-6 w-6" />
              </button>
              
              {/* Action menu dropdown */}
              <div className="absolute right-0 bottom-full mb-3 w-56 overflow-hidden rounded-lg bg-white/95 dark:bg-gray-800/95 shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm origin-bottom-right scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200">
                <div className="py-1.5">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Create New
                  </div>
                  <button className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors">
                    <span className="flex-shrink-0 mr-3 h-7 w-7 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </span>
                    <div>
                      <div className="font-medium">Create Post</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Add new content to your site</div>
                    </div>
                  </button>
                  <button className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors">
                    <span className="flex-shrink-0 mr-3 h-7 w-7 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                    <div>
                      <div className="font-medium">New Collection</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Create content structure</div>
                    </div>
                  </button>
                  <button className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors">
                    <span className="flex-shrink-0 mr-3 h-7 w-7 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      </svg>
                    </span>
                    <div>
                      <div className="font-medium">Import Content</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Bulk import from external source</div>
                    </div>
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/70 transition-colors">
                    <span className="flex-shrink-0 mr-3 h-7 w-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    <div>
                      <div className="font-medium">Content Settings</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manage CMS configuration</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // For other content sections, show the regular content view
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{getTitle()}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {section === 'activity' ? 'Track user activities and engagement' : 
             'Manage all your content in one place'}
          </p>
        </div>

        {/* Content Header with Filters */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search content..." 
              className="pl-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 w-full" 
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="secondary-gray" size="sm" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
              <Filter className="h-4 w-4 mr-1" />
              Filter
              <ChevronDown className="h-3 w-3 ml-1 opacity-60" />
            </Button>
            
            <Button variant="default" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add New
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <ContentCard 
              key={item}
              title={`Content Item ${item}`}
              type={item % 2 === 0 ? 'Article' : 'Page'}
              status={item % 3 === 0 ? 'Draft' : 'Published'}
              date={`April ${item + 8}, 2025`}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium text-gray-700 dark:text-gray-300">1-6</span> of <span className="font-medium text-gray-700 dark:text-gray-300">24</span> items
          </div>
          <div className="flex gap-2">
            <Button variant="secondary-gray" size="sm" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              Previous
            </Button>
            <Button variant="secondary-gray" size="sm" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              Next
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface ContentCardProps {
  title: string;
  type: string;
  status: string;
  date: string;
}

function ContentCard({ title, type, status, date }: ContentCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 px-5 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-row justify-between items-center">
        <CardTitle className="text-base font-medium text-gray-900 dark:text-white">{title}</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-5">
        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-3">
          <div className="flex justify-between">
            <span>Type:</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{type}</span>
          </div>
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={`font-medium ${status === 'Published' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {status}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Last Updated:</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{date}</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <Button variant="link-color" className="p-0 h-auto text-sm">
            Edit Content
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}