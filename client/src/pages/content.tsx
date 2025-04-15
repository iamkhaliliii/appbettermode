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

export default function Content() {
  const [location, setLocation] = useLocation();
  const [, params] = useRoute('/content/:section');
  const section = params?.section;
  
  // UI state
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showPublishedOnly, setShowPublishedOnly] = useState<boolean>(false);
  const [showStatusFilter, setShowStatusFilter] = useState<boolean>(false);
  
  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Filter data for published content if needed
  const filteredData = useMemo(() => {
    if (showPublishedOnly) {
      return data.filter(post => post.status === "Published");
    }
    return data;
  }, [data, showPublishedOnly]);
  
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
        <div className="max-w-7xl mx-auto">
          {/* Content container with padding */}
          <div className="px-2 py-3 pb-1.5 sm:px-3 sm:py-4 sm:pb-2">
            <div className="mb-3 flex flex-row items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-medium text-gray-900 dark:text-white">
                  All Posts <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">14 items</span>
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
                  All <span className="ml-1 text-[10px] text-gray-500 dark:text-gray-400">14</span>
                </button>
                <button 
                  className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'published' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
                  onClick={() => {
                    setActiveTab('published');
                    setShowPublishedOnly(true);
                    setShowStatusFilter(true);
                  }}
                >
                  Published <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500">6</span>
                </button>
                <button 
                  className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'scheduled' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
                  onClick={() => {
                    setActiveTab('scheduled');
                    setShowPublishedOnly(false);
                    setShowStatusFilter(false);
                  }}
                >
                  Scheduled <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500">3</span>
                </button>
                <button 
                  className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'drafts' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
                  onClick={() => {
                    setActiveTab('drafts');
                    setShowPublishedOnly(false);
                    setShowStatusFilter(false);
                  }}
                >
                  Drafts <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500">0</span>
                </button>
                <button 
                  className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'pending' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
                  onClick={() => {
                    setActiveTab('pending');
                    setShowPublishedOnly(false);
                    setShowStatusFilter(false);
                  }}
                >
                  Pending <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500">0</span>
                </button>
              </div>
            </div>

            {/* Table toolbar */}
            <div className="mb-0 flex items-center justify-between gap-1.5">
              {/* Left side - Filter, Sort, Column buttons */}
              <div className="flex items-center gap-1.5">
                {showStatusFilter ? (
                  <button 
                    className="inline-flex items-center justify-center h-6 px-2 rounded text-blue-500 dark:text-blue-400 border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors text-xs font-medium"
                  >
                    <Filter className="h-3 w-3 mr-1" />
                    Status: Published
                  </button>
                ) : (
                  <button className="inline-flex items-center justify-center h-6 w-6 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Filter className="h-3 w-3" />
                  </button>
                )}
                
                <button className="inline-flex items-center justify-center h-6 w-6 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <ArrowUpDown className="h-3 w-3" />
                </button>
                
                <button className="inline-flex items-center justify-center h-6 w-6 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Columns className="h-3 w-3" />
                </button>
              </div>
              
              {/* Right side - Action buttons (Search, Export, Add) */}
              <div className="flex items-center gap-1.5">
                {table.getFilteredSelectedRowModel().rows.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="inline-flex items-center justify-center h-6 px-2 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-sm text-xs font-medium gap-1 whitespace-nowrap hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors">
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
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>Change author</span>
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
                
                <button className="inline-flex items-center justify-center h-6 w-6 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <Search className="h-3 w-3" />
                </button>
                
                <button className="inline-flex items-center justify-center h-6 w-6 rounded text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <FileOutput className="h-3 w-3" />
                </button>
                
                <button className="inline-flex items-center justify-center h-6 px-2.5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 shadow-sm text-xs font-medium gap-1 whitespace-nowrap hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Plus className="h-3 w-3 mr-0.5" />
                  <span>New</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main table - Full width with no padding */}
          <div className="bg-background dark:bg-background border-y border-border dark:border-border shadow-sm backdrop-blur-sm overflow-auto mt-[1px] scrollbar-minimal">
            <Table className="w-full">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-transparent border-b border-border/70 dark:border-border/70 h-6">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className="px-4 py-1 h-6 text-left text-xs font-medium text-muted-foreground dark:text-muted-foreground tracking-wide sticky top-0 bg-background dark:bg-background">
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
                        <TableCell key={cell.id} className="px-4 py-1 whitespace-nowrap text-xs border-b border-border/50 dark:border-border/50">
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
                        <span>No results found</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination controls - container with padding */}
          <div className="px-2 py-3 sm:px-3 sm:py-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-xs text-muted-foreground dark:text-muted-foreground">
                  {table.getFilteredSelectedRowModel().rows.length > 0 ? (
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
                    disabled={!table.getCanPreviousPage()}
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
                    disabled={!table.getCanPreviousPage()}
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
                    disabled={!table.getCanNextPage()}
                  >
                    <span className="sr-only">Go to next page</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                  
                  <button
                    className="h-6 w-6 flex items-center justify-center bg-secondary dark:bg-secondary text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-foreground rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
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

  // For other content sections, show the regular content view
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground dark:text-foreground">{getTitle()}</h1>
          <p className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground">
            {section === 'activity' ? 'Track user activities and engagement' : 
             'Manage all your content in one place'}
          </p>
        </div>

        {/* Content Header with Filters */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search content..." 
              className="pl-9 bg-background dark:bg-background border-border dark:border-border w-full" 
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button variant="secondary-gray" size="sm" className="bg-secondary dark:bg-secondary border-border dark:border-border text-foreground dark:text-foreground">
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
        <div className="flex justify-between items-center py-4 border-t border-border dark:border-border">
          <div className="text-sm text-muted-foreground dark:text-muted-foreground">
            Showing <span className="font-medium text-foreground dark:text-foreground">1-6</span> of <span className="font-medium text-foreground dark:text-foreground">24</span> items
          </div>
          <div className="flex gap-2">
            <Button variant="secondary-gray" size="sm" className="bg-secondary dark:bg-secondary border-border dark:border-border">
              Previous
            </Button>
            <Button variant="secondary-gray" size="sm" className="bg-secondary dark:bg-secondary border-border dark:border-border">
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
      <CardHeader className="bg-secondary dark:bg-secondary px-5 py-4 border-b border-border dark:border-border flex flex-row justify-between items-center">
        <CardTitle className="text-base font-medium text-foreground dark:text-foreground">{title}</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-5">
        <div className="text-sm text-muted-foreground dark:text-muted-foreground space-y-3">
          <div className="flex justify-between">
            <span>Type:</span>
            <span className="font-medium text-foreground dark:text-foreground">{type}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Status:</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              status === 'Published' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 
              status === 'Draft' ? 'bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300' :
              status === 'Schedule' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
              'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
            }`}>
              {status === 'Published' && (
                <svg className="mr-1 h-2 w-2 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
              )}
              {status === 'Draft' && (
                <svg className="mr-1 h-2 w-2 text-slate-500 dark:text-slate-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
              )}
              {status === 'Schedule' && (
                <svg className="mr-1 h-2 w-2 text-purple-500 dark:text-purple-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
              )}
              {status === 'Pending review' && (
                <svg className="mr-1 h-2 w-2 text-amber-500 dark:text-amber-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
              )}
              {status}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Last Updated:</span>
            <span className="font-medium text-foreground dark:text-foreground">{date}</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-border dark:border-border">
          <Button variant="link-color" className="p-0 h-auto text-sm">
            Edit Content
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}