import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageSquare, 
  FileText, 
  ChevronDown,
  ChevronUp,
  Filter,
  MoreVertical,
  Plus,
  Search,
  FileOutput,
  ArrowUpDown,
  Columns,
  X
} from "lucide-react";
import { useRoute } from "wouter";
import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
import { Button } from "@/components/ui/button";

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

// Data for the table (mock data)
const data: Post[] = [
  {
    id: "p-001",
    title: "Getting Started with the Editor",
    status: "Published",
    author: {
      name: "Olivia Rhye",
      avatar: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    space: {
      name: "Articles",
      color: "#3B82F6",
    },
    publishedAt: "2023-01-15",
    cmsModel: "Blog",
    tags: ["Guide", "Editor"],
    locked: false
  },
  {
    id: "p-002",
    title: "Welcome to the Developer Portal",
    status: "Published",
    author: {
      name: "Phoenix Baker",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    space: {
      name: "Pages",
      color: "#8B5CF6",
    },
    publishedAt: "2023-01-10",
    cmsModel: "Page",
    tags: ["Developer", "Documentation"],
    locked: true
  },
  {
    id: "p-003",
    title: "New Feature Announcement: Content API",
    status: "Schedule",
    author: {
      name: "Lana Steiner",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    space: {
      name: "Announcements",
      color: "#EC4899",
    },
    publishedAt: "2023-02-05",
    cmsModel: "Blog",
    tags: ["API", "News"],
    locked: false
  },
  {
    id: "p-004",
    title: "Community Guidelines",
    status: "Published",
    author: {
      name: "Demi Wilkinson",
      avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    space: {
      name: "Pages",
      color: "#8B5CF6",
    },
    publishedAt: "2023-01-05",
    cmsModel: "Page",
    tags: ["Community", "Guidelines"],
    locked: false
  },
  {
    id: "p-005",
    title: "How to Use Advanced Search Features",
    status: "Published",
    author: {
      name: "Candice Wu",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    space: {
      name: "Articles",
      color: "#3B82F6",
    },
    publishedAt: "2023-01-20",
    cmsModel: "Tutorial",
    tags: ["Search", "Tutorial"],
    locked: false
  },
  {
    id: "p-006",
    title: "Upcoming Maintenance: February 10",
    status: "Schedule",
    author: {
      name: "Olivia Rhye",
      avatar: "https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    space: {
      name: "Announcements",
      color: "#EC4899",
    },
    publishedAt: "2023-02-10",
    cmsModel: "Announcement",
    tags: ["Maintenance", "System"],
    locked: false
  }
];

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
    header: "Title",
    cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
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
    header: "Author",
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
  },
  {
    accessorKey: "publishedAt",
    header: "Published",
    cell: ({ row }) => {
      return <div>{row.getValue("publishedAt")}</div>
    }
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
];

export default function Content() {
  const [matchContent, paramsContent] = useRoute('/content/:section');
  const [matchInbox] = useRoute('/inbox');
  const [matchInboxSection, paramsInboxSection] = useRoute('/inbox/:section');
  
  // Determine section based on routes
  let section;
  
  if (matchInbox || matchInboxSection) {
    section = 'inbox';
  } else {
    section = paramsContent?.section;
  }
  
  // Define all state variables at the top level, regardless of section
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
  
  // Create table instance - we create this regardless of which section is active
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
  
  // For the Inbox section
  if (section === 'inbox') {
    return (
      <DashboardLayout>
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
      <DashboardLayout>
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
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Content container with padding */}
        <div className="px-2 py-3 pb-1.5 sm:px-3 sm:py-4 sm:pb-2">
          <div className="mb-3 flex flex-row items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-medium text-gray-900 dark:text-white">
                All Posts <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">{data.length} items</span>
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
                All <span className="ml-1 text-[10px] text-gray-500 dark:text-gray-400">{data.length}</span>
              </button>
              <button 
                className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'published' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
                onClick={() => {
                  setActiveTab('published');
                  setShowPublishedOnly(true);
                  setShowStatusFilter(true);
                }}
              >
                Published <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500">4</span>
              </button>
              <button 
                className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'scheduled' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
                onClick={() => {
                  setActiveTab('scheduled');
                  setShowPublishedOnly(false);
                  setShowStatusFilter(false);
                }}
              >
                Scheduled <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500">2</span>
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
                      Move to space
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="flex cursor-pointer items-center whitespace-nowrap px-2 py-1 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750">
                      Hide
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem className="flex cursor-pointer items-center whitespace-nowrap px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              <div className="flex relative h-7 items-center flex-grow">
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <Search className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                </div>
                <Input
                  type="search"
                  placeholder="Search posts..."
                  value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("title")?.setFilterValue(event.target.value)
                  }
                  className="h-7 pl-7 pr-2.5 text-xs rounded-md max-w-[220px] bg-white dark:bg-gray-800 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-primary-400 dark:focus-visible:ring-primary-400"
                />
              </div>
              
              <button className="inline-flex h-8 items-center justify-center rounded-md bg-gray-50 dark:bg-gray-800 px-3 text-xs font-medium shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 mr-2 text-gray-700 dark:text-gray-300">
                <FileOutput className="h-3.5 w-3.5 mr-1.5" />
                Export
              </button>
              
              <button className="inline-flex h-8 items-center justify-center rounded-md bg-primary-600 px-3 text-xs font-medium text-white shadow-sm hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add post
              </button>
            </div>
          </div>
        </div>

        {/* Table wrapper */}
        <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700 mb-4 mx-2">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead 
                        key={header.id}
                        className={
                          header.id === 'select' 
                            ? 'w-[40px] px-0' 
                            : header.id === 'actions' 
                              ? 'w-[32px]' 
                              : ''
                        }
                      >
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
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id}
                        className={
                          cell.column.id === 'select' 
                            ? 'w-[40px] px-0' 
                            : cell.column.id === 'actions' 
                              ? 'w-[32px]' 
                              : ''
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}