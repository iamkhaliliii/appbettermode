import { DashboardLayout } from "@/components/layout/dashboard/dashboard-layout";
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
  Trash2,
  MoreVertical,
  MessageSquare,
  Star,
  FileText,
  File,
  Hash,
  X,
  Eye,
  Lock,
  User,
  Clock,
  Tag,
  FileOutput,
  ArrowUpDown,
  Columns
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

// Add a type for space data from API
interface SpaceData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  site_id: string;
  visibility?: string;
  cms_type?: string;
  hidden?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Add a utility function to get API base URL
function getApiBaseUrl() {
  // Use environment variable if available, otherwise default to localhost
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
}

// Map database post data to UI post data structure
function mapPostData(postData: any): Post {
  // Handle different status formats
  let status: Post['status'] = 'Draft';
  switch(postData.status) {
    case 'published':
      status = 'Published';
      break;
    case 'scheduled':
      status = 'Schedule';
      break;
    case 'pending_review':
      status = 'Pending review';
      break;
    default:
      status = 'Draft';
  }

  // Generate a more human-friendly author name
  const authorName = postData.author?.full_name || postData.author?.username || 
                    (postData.author_id ? `Author ${postData.author_id.substring(0, 4)}` : 'Anonymous');

  return {
    id: postData.id || '',
    title: postData.title || 'Untitled',
    status,
    author: {
      name: authorName,
      avatar: postData.author?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    space: {
      name: postData.space?.name || 'General',
      color: postData.space?.color || '#6366f1'
    },
    publishedAt: postData.published_at 
      ? new Date(postData.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Not published',
    cmsModel: postData.cms_type || 'Unknown',
    tags: (postData.tags || []).map((tag: any) => tag.name || tag),
    locked: postData.locked || false
  };
}

// Column definitions for the table
const columns: ColumnDef<Post>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="pl-1.5">
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
      <div className="pl-1.5">
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
          <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">CMS</span>
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
      
      // استفاده از رنگ بنفش برای همه‌ی مدل‌ها
      const config = {
        bgClass: "bg-indigo-50 dark:bg-indigo-900/30", 
        textClass: "text-indigo-700 dark:text-indigo-300"
      }
      
      // رنگ خنثی برای مدل
      const neutralConfig = {
        bgClass: "bg-gray-100 dark:bg-gray-800/40", 
        textClass: "text-gray-700 dark:text-gray-300"
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
      
      // استفاده از یک رنگ خنثی برای همه تگ‌ها (مینیمال)
      const neutralConfig = {
        bgClass: "bg-gray-100 dark:bg-gray-800/40", 
        textClass: "text-gray-700 dark:text-gray-300"
      }
      
      // به هر تگ همان کانفیگ خنثی را اختصاص می‌دهیم
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

// Sample data for fallback use when API fails
const MOCK_DATA: Post[] = [
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
  {
    id: "u5TrF8Y3iO2P1aS",
    title: "Building Authentic Relationships",
    status: "Published",
    author: {
      name: "Alice Johnson",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Articles",
      color: "#2563eb"
    },
    publishedAt: "Jan 15, 2025",
    cmsModel: "Article",
    tags: ["community", "featured"],
    locked: false
  },
  {
    id: "v6UgH9Z4jP3Q2bD",
    title: "Content Moderation Best Practices",
    status: "Draft",
    author: {
      name: "Mark Wilson",
      avatar: "https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Guidelines",
      color: "#10b981"
    },
    publishedAt: "Jan 16, 2025",
    cmsModel: "Guide",
    tags: ["moderation", "guidelines"],
    locked: false
  },
  {
    id: "w7ViJ1A5kR4S3cF",
    title: "Growing Your User Base",
    status: "Schedule",
    author: {
      name: "Sarah Thompson",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Marketing",
      color: "#ef4444"
    },
    publishedAt: "Jan 17, 2025",
    cmsModel: "Strategy",
    tags: ["marketing", "engagement"],
    locked: false
  },
  {
    id: "x8WjK2B6lS5T4dG",
    title: "Community Newsletter Guidelines",
    status: "Published",
    author: {
      name: "Emily Davis",
      avatar: "https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Newsletter",
      color: "#9333ea"
    },
    publishedAt: "Jan 18, 2025",
    cmsModel: "Template",
    tags: ["newsletter", "communication"],
    locked: true
  },
  {
    id: "y9XkL3C7mT6U5eH",
    title: "Onboarding New Community Members",
    status: "Published",
    author: {
      name: "Robert Brown",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Members",
      color: "#f59e0b"
    },
    publishedAt: "Jan 19, 2025",
    cmsModel: "Process",
    tags: ["onboarding", "members"],
    locked: false
  },
  {
    id: "z1YlM4D8nU7V6fI",
    title: "Product Feedback Collection Strategy",
    status: "Draft",
    author: {
      name: "Amanda White",
      avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    space: {
      name: "Product",
      color: "#06b6d4"
    },
    publishedAt: "Jan 20, 2025",
    cmsModel: "Strategy",
    tags: ["feedback", "product"],
    locked: false
  },
];

import { withSiteContext, WithSiteContextProps } from "@/lib/with-site-context";

function Content({ siteId, siteDetails, siteLoading }: WithSiteContextProps) {
  const [location, setLocation] = useLocation();
  const [, params] = useRoute(siteId ? `/dashboard/site/${siteId}/content/:section` : '/content/:section');
  const section = params?.section;
  
  // Get query parameters from URL
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const statusParam = urlParams.get('status');
  
  // UI state
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showPublishedOnly, setShowPublishedOnly] = useState<boolean>(false);
  const [showStatusFilter, setShowStatusFilter] = useState<boolean>(false);
  const [selectedCmsType, setSelectedCmsType] = useState<string | null>(null);
  
  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Data fetching state
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [data, setData] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Status counts
  const [statusCounts, setStatusCounts] = useState({
    total: 0,
    published: 0,
    scheduled: 0,
    draft: 0,
    pending: 0
  });

  // Update selected CMS type based on the section parameter
  useEffect(() => {
    if (section && section !== 'all' && section !== 'activity' && section !== 'inbox') {
      setSelectedCmsType(section);
    } else {
      setSelectedCmsType(null);
    }
  }, [section]);

  // Update active tab based on status parameter
  useEffect(() => {
    if (statusParam === 'scheduled') {
      setActiveTab('scheduled');
    } else if (statusParam === 'draft') {
      setActiveTab('drafts');
    } else if (!statusParam && !section) {
      setActiveTab('all');
    }
  }, [statusParam, section]);

  // Utility function to check if a string is a valid UUID
  function isValidUUID(uuid: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  // Fetch posts data from API - only done once when component mounts
  const fetchPosts = async () => {
    // We need to use siteDetails.id (UUID) instead of siteId (subdomain)
    if (!siteDetails?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the API base URL
      const API_BASE = getApiBaseUrl();
      
      // Build API URL to fetch ALL posts for this site
      let url = `${API_BASE}/api/v1/posts/site/${siteDetails.id}?limit=100`;
      
      console.log(`Fetching all posts from: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Failed to fetch posts (${response.status}): ${errorText}`);
      }
      
      let rawData;
      try {
        rawData = await response.json();
        console.log('Fetched posts:', rawData);
      } catch (err: unknown) {
        throw new Error(`Failed to parse response as JSON: ${err instanceof Error ? err.message : String(err)}`);
      }
      
      if (Array.isArray(rawData) && rawData.length > 0) {
        // Fetch spaces for this site
        let spacesMap = new Map<string, SpaceData>();
        try {
          const spacesResponse = await fetch(`${API_BASE}/api/v1/sites/${siteDetails.id}/spaces`);
          
          if (spacesResponse.ok) {
            const spacesData = await spacesResponse.json();
            spacesMap = new Map(spacesData.map((space: SpaceData) => [space.id, space]));
          }
        } catch (err) {
          console.error('Error fetching spaces:', err);
        }

        // Collect all unique author IDs
        const uniqueAuthorIds: string[] = [];
        rawData.forEach(post => {
          if (post.author_id && !uniqueAuthorIds.includes(post.author_id)) {
            uniqueAuthorIds.push(post.author_id);
          }
        });
        
        // Create a map to store author data
        const authorsMap = new Map();
        
        // Fetch author details for each author ID
        await Promise.all(uniqueAuthorIds.map(async (authorId) => {
          try {
            const authorResponse = await fetch(`${API_BASE}/api/v1/users/${authorId}`);
            if (authorResponse.ok) {
              const authorData = await authorResponse.json();
              authorsMap.set(authorId, authorData);
            }
          } catch (err) {
            console.error(`Error fetching author ${authorId}:`, err);
          }
        }));
        
        // Map the API response to our Post interface with author and space data
        const formattedPosts = rawData.map(post => {
          // Get space info from our spaces map
          const spaceInfo = post.space_id ? spacesMap.get(post.space_id) : null;
          
          // Get author info from our authors map
          const authorInfo = post.author_id ? authorsMap.get(post.author_id) : null;
          
          // Use available data directly without fetching additional info
          return mapPostData({
            ...post,
            // Include actual author data when available
            author: authorInfo || {
              id: post.author_id,
              username: `Author ${post.author_id?.substring(0, 4) || 'Unknown'}`,
              full_name: `Author ${post.author_id?.substring(0, 4) || 'Anonymous'}`,
              avatar_url: null
            },
            space: spaceInfo ? {
              id: spaceInfo.id,
              name: spaceInfo.name,
              color: '#6366f1'
            } : {
              id: post.space_id,
              name: `Space ${post.space_id?.substring(0, 6) || 'General'}`,
              color: '#6366f1'
            }
          });
        });
        
        // Store all posts in state
        setAllPosts(formattedPosts);
      } else {
        console.log('No posts found, using empty array');
        setAllPosts([]);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Using demo data as a fallback.');
      
      // Fall back to mock data on error
      setAllPosts(MOCK_DATA);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all posts when component mounts
  useEffect(() => {
    if (siteDetails?.id) {
      fetchPosts();
    }
  }, [siteDetails?.id]);

  // Filter posts client-side based on selected tab and CMS type
  useEffect(() => {
    // Filter posts based on status (activeTab)
    let filteredPosts = [...allPosts];
    
    if (activeTab === 'published') {
      filteredPosts = filteredPosts.filter(post => post.status === 'Published');
    } else if (activeTab === 'scheduled') {
      filteredPosts = filteredPosts.filter(post => post.status === 'Schedule');
    } else if (activeTab === 'drafts') {
      filteredPosts = filteredPosts.filter(post => post.status === 'Draft');
    } else if (activeTab === 'pending') {
      filteredPosts = filteredPosts.filter(post => post.status === 'Pending review');
    }
    
    // Filter by CMS type if selected
    if (selectedCmsType) {
      filteredPosts = filteredPosts.filter(post => 
        post.cmsModel.toLowerCase() === selectedCmsType.toLowerCase()
      );
    }
    
    // Update the data state with filtered posts
    setData(filteredPosts);
    
    // Calculate status counts for the filtered data
    const counts = {
      total: filteredPosts.length,
      published: filteredPosts.filter(post => post.status === 'Published').length,
      scheduled: filteredPosts.filter(post => post.status === 'Schedule').length,
      draft: filteredPosts.filter(post => post.status === 'Draft').length,
      pending: filteredPosts.filter(post => post.status === 'Pending review').length
    };
    setStatusCounts(counts);
    
  }, [allPosts, activeTab, selectedCmsType]);

  // Filter data for published content if needed (this is now redundant with our filtering above)
  const filteredData = useMemo(() => data, [data]);

  // Create table instance
  const table = useReactTable({
    data: filteredData,
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

  // Get page title based on the section/CMS type
  const getPageTitle = () => {
    if (section === 'activity') return 'Activity Hub';
    if (section === 'inbox') return 'Inbox';
    if (statusParam === 'scheduled') return 'All Scheduled Posts';
    if (statusParam === 'draft') return 'All Draft Posts';
    if (selectedCmsType) {
      // Capitalize the first letter of the CMS type
      return selectedCmsType.charAt(0).toUpperCase() + selectedCmsType.slice(1);
    }
    return 'All Posts';
  };
  
  // For the Inbox section
  if (section === 'inbox') {
    return (
      <DashboardLayout currentSiteIdentifier={siteId} siteName={siteDetails?.name}>
        <div className="px-4 md:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Inbox</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your messages and notifications</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card className="border-border dark:border-border">
              <CardHeader className="pb-5">
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Your inbox is empty. Messages will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // For the Activity Hub section
  if (section === 'activity') {
    return (
      <DashboardLayout
        siteName={siteDetails?.name}
        currentSiteIdentifier={siteId}
      >
        <div className="px-4 md:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Activity Hub</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor recent activities and updates</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card className="border-border dark:border-border">
              <CardHeader className="pb-5">
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                      <div className="flex-shrink-0 w-9 h-9 mr-3 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-300">
                        {item % 2 === 0 ? <MessageSquare className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 dark:text-gray-200 font-medium">
                          {item % 2 === 0 ? 'New comment added' : 'Content updated'}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {item % 2 === 0 ? 'A new comment was added to a post' : 'A content page was updated'}
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                          {`${item * 2} minutes ago`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // For the default CMS view (now at root /content path)
  return (
    <DashboardLayout
      siteName={siteDetails?.name}
      currentSiteIdentifier={siteId}
    >
      <div className="mx-auto">
          {/* Content container with padding */}
          <div className="px-2 py-3 pb-1.5 sm:px-3 sm:py-4 sm:pb-2">
            <div className="mb-3 flex flex-row items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-medium text-gray-900 dark:text-white">
                  {getPageTitle()} <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">{isLoading ? 'Loading...' : `${statusCounts.total} item${statusCounts.total !== 1 ? 's' : ''}`}</span>
                </h1>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="mb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex -mb-px">
                <button 
                  className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'all' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
                  onClick={() => {
                    setActiveTab('all');
                    setShowPublishedOnly(false);
                    setShowStatusFilter(false);
                  }}
                >
                  All <span className="ml-1 text-[10px] text-gray-500 dark:text-gray-400">{isLoading ? '...' : statusCounts.total}</span>
                </button>
                <button 
                  className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'published' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
                  onClick={() => {
                    setActiveTab('published');
                    setShowPublishedOnly(true);
                    setShowStatusFilter(true);
                  }}
                >
                  Published <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500">{isLoading ? '...' : statusCounts.published}</span>
                </button>
                <button 
                  className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'scheduled' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
                  onClick={() => {
                    setActiveTab('scheduled');
                    setShowPublishedOnly(false);
                    setShowStatusFilter(false);
                  }}
                >
                  Scheduled <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500">{isLoading ? '...' : statusCounts.scheduled}</span>
                </button>
                <button 
                  className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'drafts' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
                  onClick={() => {
                    setActiveTab('drafts');
                    setShowPublishedOnly(false);
                    setShowStatusFilter(false);
                  }}
                >
                  Drafts <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500">{isLoading ? '...' : statusCounts.draft}</span>
                </button>
                <button 
                  className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'pending' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
                  onClick={() => {
                    setActiveTab('pending');
                    setShowPublishedOnly(false);
                    setShowStatusFilter(false);
                  }}
                >
                  Pending <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500">{isLoading ? '...' : statusCounts.pending}</span>
                </button>
              </div>
            </div>

            {/* Table toolbar */}
            <div className="mb-0 flex items-center justify-between gap-1.5">
              {/* Left side - Filter, Sort, Column buttons */}
              <div className="flex items-center gap-1.5">
                {showStatusFilter || selectedCmsType ? (
                  <div className="flex gap-1">
                    {showStatusFilter && (
                      <button 
                        className="inline-flex items-center justify-center h-6 px-2 rounded text-blue-500 dark:text-blue-400 border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-xs font-medium"
                      >
                        <Filter className="h-3 w-3 mr-1" />
                        Status: Published
                      </button>
                    )}
                    {selectedCmsType && (
                      <button 
                        className="inline-flex items-center justify-center h-6 px-2 rounded text-purple-500 dark:text-purple-400 border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors text-xs font-medium"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Type: {selectedCmsType.charAt(0).toUpperCase() + selectedCmsType.slice(1)}
                      </button>
                    )}
                  </div>
                ) : (
                  <button className="inline-flex items-center justify-center h-7 w-7 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Filter className="h-3.5 w-3.5" />
                  </button>
                )}
                
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
                        <svg className="h-1.5 w-1.5 mr-2 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                        </svg>
                        <span>Move to space</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem className="flex cursor-pointer items-center whitespace-nowrap px-2 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750">
                        <svg className="h-1.5 w-1.5 mr-2 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>Hide</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem className="flex cursor-pointer items-center whitespace-nowrap px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10">
                        <svg className="h-2.5 w-2.5 mr-1.5 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                        <span>Delete</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator className="my-0.5 h-px bg-gray-200 dark:bg-gray-700" />
                      
                      <DropdownMenuItem className="flex cursor-pointer items-center whitespace-nowrap px-2 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750">
                        <svg className="h-2.5 w-2.5 mr-1.5 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                          <line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                        <span>Add tag</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem className="flex cursor-pointer items-center whitespace-nowrap px-2 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750">
                        <X className="h-2 w-2 mr-1.5 text-gray-400 dark:text-gray-500" />
                        <span>Remove tag</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator className="my-0.5 h-px bg-gray-200 dark:bg-gray-700" />
                      
                      <DropdownMenuItem className="flex cursor-pointer items-center whitespace-nowrap px-2 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750">
                        <svg className="h-2.5 w-2.5 mr-1.5 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span>Lock</span>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem className="flex cursor-pointer items-center whitespace-nowrap px-2 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750">
                        <svg className="h-2.5 w-2.5 mr-1.5 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>Change publish time</span>
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
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  <span>New</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main table - Full width with no padding */}
          <div className="bg-background dark:bg-background border-y border-border/30 dark:border-border/30 overflow-auto mt-[1px] scrollbar-minimal">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Loading posts...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-32">
                <div className="flex flex-col items-center text-center max-w-md px-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{error}</p>
                  <button 
                    onClick={() => fetchPosts()}
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
            )}
          </div>
          
          {/* Pagination controls - container with padding */}
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


        </div>
      </DashboardLayout>
    );
  }
export default withSiteContext(Content);

