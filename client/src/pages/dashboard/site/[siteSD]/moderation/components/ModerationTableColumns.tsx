import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button, Checkbox, Badge } from "@/components/ui/primitives";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  } from "@/components/ui/forms";
import {
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Star,
  FileText,
  File,
  Hash,
  Shield
} from "lucide-react";
import { ModerationItem } from "./ModerationData";

// Helper function to get space icon
const getIconForSpace = (spaceName: string) => {
  switch(spaceName.toLowerCase()) {
    case 'general':
      return <MessageSquare className="h-3 w-3 mr-1" />;
    case 'announcements':
      return <Star className="h-3 w-3 mr-1" />;
    case 'newsletter':
      return <FileText className="h-3 w-3 mr-1" />;
    case 'product updates':
      return <File className="h-3 w-3 mr-1" />;
    case 'events':
      return <Hash className="h-3 w-3 mr-1" />;
    case 'study help':
      return <FileText className="h-3 w-3 mr-1" />;
    case 'help & support':
      return <MessageSquare className="h-3 w-3 mr-1" />;
    case 'security':
      return <Shield className="h-3 w-3 mr-1" />;
    case 'finance':
      return <Hash className="h-3 w-3 mr-1" />;
    default:
      return <Hash className="h-2 w-2 mr-0.5" />;
  }
};

// Helper function to get alert config
const getAlertConfig = (alert: string) => {
  switch (alert) {
    case 'Akismet':
      return { bgClass: "bg-red-50 dark:bg-red-900/30", textClass: "text-red-700 dark:text-red-300" };
    case 'OOPSpam':
      return { bgClass: "bg-orange-50 dark:bg-orange-900/30", textClass: "text-orange-700 dark:text-orange-300" };
    case 'Author Minimum age':
      return { bgClass: "bg-gray-50 dark:bg-gray-800/40", textClass: "text-gray-700 dark:text-gray-300" };
    case 'Content violations':
      return { bgClass: "bg-red-50 dark:bg-red-900/30", textClass: "text-red-700 dark:text-red-300" };
    case 'New user':
      return { bgClass: "bg-blue-50 dark:bg-blue-900/30", textClass: "text-blue-700 dark:text-blue-300" };
    case 'Multiple reports':
      return { bgClass: "bg-red-50 dark:bg-red-900/30", textClass: "text-red-700 dark:text-red-300" };
    case 'Suspicious email':
      return { bgClass: "bg-orange-50 dark:bg-orange-900/30", textClass: "text-orange-700 dark:text-orange-300" };
    default:
      return { bgClass: "bg-blue-50 dark:bg-blue-900/30", textClass: "text-blue-700 dark:text-blue-300" };
  }
};

// Common column components
const SelectColumn: ColumnDef<ModerationItem> = {
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
};

const TitleColumn: ColumnDef<ModerationItem> = {
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
};

const StatusColumn: ColumnDef<ModerationItem> = {
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
      "draft": { 
        bgClass: "bg-slate-100 dark:bg-slate-800/50", 
        textClass: "text-slate-700 dark:text-slate-300",
        dotColor: "text-slate-500 dark:text-slate-400",
        borderClass: "border border-slate-200 dark:border-slate-600/50"
      },
      "scheduled": { 
        bgClass: "bg-purple-50 dark:bg-purple-900/30", 
        textClass: "text-purple-700 dark:text-purple-300",
        dotColor: "text-purple-500 dark:text-purple-400",
        borderClass: "border border-purple-200 dark:border-purple-700/50"
      },
      "pending": { 
        bgClass: "bg-amber-50 dark:bg-amber-900/30", 
        textClass: "text-amber-700 dark:text-amber-300",
        dotColor: "text-amber-500 dark:text-amber-400",
        borderClass: "border border-amber-200 dark:border-amber-700/50"
      },
      "reported": { 
        bgClass: "bg-red-50 dark:bg-red-900/30", 
        textClass: "text-red-700 dark:text-red-300",
        dotColor: "text-red-500 dark:text-red-400",
        borderClass: "border border-red-200 dark:border-red-700/50"
      },
    }
    
    const config = statusConfig[status] || statusConfig["draft"]
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${config.bgClass} ${config.textClass} ${config.borderClass}`}>
        <svg className={`mr-1.5 h-2 w-2 ${config.dotColor}`} fill="currentColor" viewBox="0 0 8 8">
          <circle cx="4" cy="4" r="3" />
        </svg>
        {status}
      </span>
    )
  },
};

const AuthorColumn: ColumnDef<ModerationItem> = {
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
};

const SpaceColumn: ColumnDef<ModerationItem> = {
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
    const space = row.getValue("space") as { name: string; color: string } | undefined
    
    if (!space) return <span className="text-gray-400 text-xs">No space</span>;
    
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
    const spaceA = rowA.getValue("space") as { name: string } | undefined
    const spaceB = rowB.getValue("space") as { name: string } | undefined
    const nameA = spaceA?.name || '';
    const nameB = spaceB?.name || '';
    return nameA.localeCompare(nameB)
  },
};

const CreatedAtColumn: ColumnDef<ModerationItem> = {
  accessorKey: "createdAt",
  header: ({ column }) => {
    return (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center space-x-1 group text-left focus:outline-none"
      >
        <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Created</span>
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
    return <div>{row.getValue("createdAt")}</div>
  }
};

const PublishDateColumn: ColumnDef<ModerationItem> = {
  accessorKey: "publishDate",
  header: ({ column }) => {
    return (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center space-x-1 group text-left focus:outline-none"
      >
        <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Publish Date</span>
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
    const publishDate = "Jan 25, 2025 at 2:00 PM";
    return (
      <div className="text-sm text-gray-700 dark:text-gray-300">
        {publishDate}
      </div>
    )
  }
};

const AlertsColumn: ColumnDef<ModerationItem> = {
  accessorKey: "alerts",
  header: ({ column }) => {
    return (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center space-x-1 group text-left focus:outline-none"
      >
        <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Alerts</span>
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
    const alerts = row.getValue("alerts") as string[]
    if (!alerts || alerts.length === 0) return null
    
    return (
      <div className="flex items-center gap-1 overflow-hidden max-w-xs">
        {alerts.slice(0, 2).map((alert, i) => {
          const config = getAlertConfig(alert)
          return (
            <span 
              key={i} 
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs whitespace-nowrap border
              ${config.bgClass} ${config.textClass} border-gray-200 dark:border-gray-700`}
            >
              {alert}
            </span>
          )
        })}
        {alerts.length > 2 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300 whitespace-nowrap border border-gray-200 dark:border-gray-700">
            +{alerts.length - 2}
          </span>
        )}
      </div>
    )
  },
};

const PostActionsColumn: ColumnDef<ModerationItem> = {
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
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  },
};

const ScheduledActionsColumn: ColumnDef<ModerationItem> = {
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
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Clock className="h-4 w-4 mr-2" />
              Edit Schedule
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  },
};

const MemberActionsColumn: ColumnDef<ModerationItem> = {
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
            <DropdownMenuItem>
              <Eye className="h-4 w-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <XCircle className="h-4 w-4 mr-2" />
              Reject/Ban
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  },
};

// Member author column with email
const MemberAuthorColumn: ColumnDef<ModerationItem> = {
  accessorKey: "author",
  header: ({ column }) => {
    return (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center space-x-1 group text-left focus:outline-none"
      >
        <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Member</span>
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
    const author = row.getValue("author") as { name: string; avatar: string; email?: string }
    return (
      <div className="flex items-center">
        <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
          <img 
            className="h-full w-full object-cover" 
            src={author.avatar} 
            alt={author.name}
          />
        </div>
        <div className="ml-3">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {author.name}
          </div>
          {author.email && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {author.email}
            </div>
          )}
        </div>
      </div>
    )
  },
  sortingFn: (rowA, rowB) => {
    const authorA = rowA.getValue("author") as { name: string }
    const authorB = rowB.getValue("author") as { name: string }
    return authorA.name.localeCompare(authorB.name)
  },
};

// Member reason column
const MemberReasonColumn: ColumnDef<ModerationItem> = {
  accessorKey: "title",
  header: ({ column }) => {
    return (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center space-x-1 group text-left focus:outline-none"
      >
        <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Reason</span>
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
    const item = row.original as ModerationItem;
    const reason = item.reportReason || item.title;
    return <div className="text-sm text-gray-700 dark:text-gray-300">{reason}</div>
  },
};

// Member flags column
const MemberFlagsColumn: ColumnDef<ModerationItem> = {
  accessorKey: "alerts",
  header: ({ column }) => {
    return (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center space-x-1 group text-left focus:outline-none"
      >
        <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Flags</span>
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
    const alerts = row.getValue("alerts") as string[]
    if (!alerts || alerts.length === 0) return null
    
    return (
      <div className="flex items-center gap-1 overflow-hidden max-w-xs">
        {alerts.slice(0, 2).map((alert, i) => {
          const config = getAlertConfig(alert)
          return (
            <span 
              key={i} 
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs whitespace-nowrap border
              ${config.bgClass} ${config.textClass} border-gray-200 dark:border-gray-700`}
            >
              {alert}
            </span>
          )
        })}
        {alerts.length > 2 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300 whitespace-nowrap border border-gray-200 dark:border-gray-700">
            +{alerts.length - 2}
          </span>
        )}
      </div>
    )
  },
};

// Member date column
const MemberDateColumn: ColumnDef<ModerationItem> = {
  accessorKey: "createdAt",
  header: ({ column }) => {
    return (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="flex items-center space-x-1 group text-left focus:outline-none"
      >
        <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Date</span>
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
    return <div>{row.getValue("createdAt")}</div>
  }
};

// Export column configurations
export const postColumns: ColumnDef<ModerationItem>[] = [
  SelectColumn,
  TitleColumn,
  StatusColumn,
  AuthorColumn,
  SpaceColumn,
  CreatedAtColumn,
  PostActionsColumn,
];

export const scheduledPostColumns: ColumnDef<ModerationItem>[] = [
  SelectColumn,
  TitleColumn,
  StatusColumn,
  AuthorColumn,
  SpaceColumn,
  PublishDateColumn,
  CreatedAtColumn,
  ScheduledActionsColumn,
];

export const alertPostColumns: ColumnDef<ModerationItem>[] = [
  SelectColumn,
  TitleColumn,
  StatusColumn,
  AuthorColumn,
  SpaceColumn,
  AlertsColumn,
  CreatedAtColumn,
  PostActionsColumn,
];

export const memberColumns: ColumnDef<ModerationItem>[] = [
  SelectColumn,
  MemberAuthorColumn,
  StatusColumn,
  MemberReasonColumn,
  MemberFlagsColumn,
  MemberDateColumn,
  MemberActionsColumn,
]; 