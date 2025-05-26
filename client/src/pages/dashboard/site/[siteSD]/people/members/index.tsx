import { DashboardLayout } from "@/components/layout/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Filter, 
  MoreVertical,
  X,
  Eye,
  User,
  Clock,
  FileOutput,
  ArrowUpDown,
  Columns,
  UserIcon,
  Shield,
  Crown,
  Settings
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
import { withSiteContext, WithSiteContextProps } from "@/lib/with-site-context";

// Define Person data type
interface Person {
  id: string;
  name: string;
  email: string;
  role: "Member" | "Moderator" | "Admin" | "Owner";
  status: "Active" | "Inactive" | "Pending" | "Banned";
  avatar: string;
  joinDate: string;
  lastActive: string;
  postsCount: number;
  type: "member" | "staff";
}

// Mock data for members (only regular members)
const MOCK_MEMBERS: Person[] = [
  { 
    id: "2", 
    name: "Phoenix Baker", 
    email: "phoenix@untitledui.com", 
    role: "Member", 
    joinDate: "Jan 10, 2023", 
    lastActive: "1 day ago",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    postsCount: 23,
    type: "member"
  },
  { 
    id: "3", 
    name: "Lana Steiner", 
    email: "lana@untitledui.com", 
    role: "Member", 
    joinDate: "Dec 15, 2022", 
    lastActive: "3 days ago",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    postsCount: 12,
    type: "member"
  },
  { 
    id: "5", 
    name: "Candice Wu", 
    email: "candice@untitledui.com", 
    role: "Member", 
    joinDate: "Dec 5, 2022", 
    lastActive: "2 weeks ago",
    status: "Inactive",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    postsCount: 8,
    type: "member"
  },
  { 
    id: "6", 
    name: "Natali Craig", 
    email: "natali@untitledui.com", 
    role: "Member", 
    joinDate: "Nov 29, 2022", 
    lastActive: "1 week ago",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    postsCount: 34,
    type: "member"
  },
  { 
    id: "7", 
    name: "Drew Cano", 
    email: "drew@untitledui.com", 
    role: "Member", 
    joinDate: "Nov 24, 2022", 
    lastActive: "Yesterday",
    status: "Pending",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    postsCount: 0,
    type: "member"
  },
  { 
    id: "11", 
    name: "Alex Thompson", 
    email: "alex@untitledui.com", 
    role: "Member", 
    joinDate: "Jul 15, 2022", 
    lastActive: "4 hours ago",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    postsCount: 18,
    type: "member"
  },
  { 
    id: "12", 
    name: "Jessica Lee", 
    email: "jessica@untitledui.com", 
    role: "Member", 
    joinDate: "Jun 20, 2022", 
    lastActive: "2 days ago",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    postsCount: 41,
    type: "member"
  }
]; 

// Column definitions for the table
const columns: ColumnDef<Person>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center space-x-1 group text-left focus:outline-none"
        >
          <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Name</span>
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
      const person = row.original
      return (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
            <img 
              className="h-full w-full object-cover" 
              src={person.avatar} 
              alt={person.name}
            />
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900 dark:text-white">{person.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{person.email}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center space-x-1 group text-left focus:outline-none"
        >
          <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Role</span>
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
      const role = row.getValue("role") as string
      const roleConfig: Record<string, { bgClass: string; textClass: string; icon: any }> = {
        "Owner": { 
          bgClass: "bg-purple-50 dark:bg-purple-900/30", 
          textClass: "text-purple-700 dark:text-purple-300",
          icon: Crown
        },
        "Admin": { 
          bgClass: "bg-red-50 dark:bg-red-900/30", 
          textClass: "text-red-700 dark:text-red-300",
          icon: Shield
        },
        "Moderator": { 
          bgClass: "bg-blue-50 dark:bg-blue-900/30", 
          textClass: "text-blue-700 dark:text-blue-300",
          icon: Settings
        },
        "Member": { 
          bgClass: "bg-gray-50 dark:bg-gray-800/50", 
          textClass: "text-gray-700 dark:text-gray-300",
          icon: User
        },
      }
      
      const config = roleConfig[role] || roleConfig["Member"]
      const IconComponent = config.icon
      
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${config.bgClass} ${config.textClass}`}>
          <IconComponent className="mr-1.5 h-3 w-3" />
          {role}
        </span>
      )
    },
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
      const statusConfig: Record<string, { bgClass: string; textClass: string; dotColor: string }> = {
        "Active": { 
          bgClass: "bg-green-50 dark:bg-green-900/30", 
          textClass: "text-green-700 dark:text-green-300",
          dotColor: "text-green-500 dark:text-green-400"
        },
        "Inactive": { 
          bgClass: "bg-gray-100 dark:bg-gray-800/50", 
          textClass: "text-gray-700 dark:text-gray-300",
          dotColor: "text-gray-500 dark:text-gray-400"
        },
        "Pending": { 
          bgClass: "bg-amber-50 dark:bg-amber-900/30", 
          textClass: "text-amber-700 dark:text-amber-300",
          dotColor: "text-amber-500 dark:text-amber-400"
        },
        "Banned": { 
          bgClass: "bg-red-50 dark:bg-red-900/30", 
          textClass: "text-red-700 dark:text-red-300",
          dotColor: "text-red-500 dark:text-red-400"
        },
      }
      
      const config = statusConfig[status] || statusConfig["Active"]
      
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${config.bgClass} ${config.textClass}`}>
          <svg className={`mr-1.5 h-2 w-2 ${config.dotColor}`} fill="currentColor" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" />
          </svg>
          {status}
        </span>
      )
    },
  },
  {
    accessorKey: "joinDate",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center space-x-1 group text-left focus:outline-none"
        >
          <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Joined</span>
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
      return <div className="text-sm">{row.getValue("joinDate")}</div>
    }
  },
  {
    accessorKey: "lastActive",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center space-x-1 group text-left focus:outline-none"
        >
          <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Last Active</span>
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
      return <div className="text-sm text-gray-500 dark:text-gray-400">{row.getValue("lastActive")}</div>
    }
  },
  {
    accessorKey: "postsCount",
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center space-x-1 group text-left focus:outline-none"
        >
          <span className="text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 font-medium transition-colors">Posts</span>
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
      return <div className="text-sm font-medium">{row.getValue("postsCount")}</div>
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
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Edit Role</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Send Message</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]; 

function Members({ siteId, siteDetails, siteLoading }: WithSiteContextProps) {
  const [location, setLocation] = useLocation();
  const [, params] = useRoute(siteId ? `/dashboard/site/${siteId}/people/:section` : '/people/:section');
  const section = params?.section;
  
  // UI state
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Data state
  const [allPeople, setAllPeople] = useState<Person[]>(MOCK_MEMBERS);
  const [data, setData] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Status counts
  const [statusCounts, setStatusCounts] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pending: 0,
    banned: 0,
    members: 0,
    staff: 0
  });

  // Update selected type based on the section parameter
  useEffect(() => {
    if (section && section !== 'all') {
      setSelectedType(section);
    } else {
      setSelectedType(null);
    }
  }, [section]);

  // Filter people client-side based on selected tab and type
  useEffect(() => {
    let filteredPeople = [...allPeople];
    
    // Filter by status (activeTab)
    if (activeTab === 'active') {
      filteredPeople = filteredPeople.filter(person => person.status === 'Active');
    } else if (activeTab === 'inactive') {
      filteredPeople = filteredPeople.filter(person => person.status === 'Inactive');
    } else if (activeTab === 'pending') {
      filteredPeople = filteredPeople.filter(person => person.status === 'Pending');
    } else if (activeTab === 'banned') {
      filteredPeople = filteredPeople.filter(person => person.status === 'Banned');
    }
    
    // Filter by type if selected
    if (selectedType === 'members') {
      filteredPeople = filteredPeople.filter(person => person.type === 'member');
    } else if (selectedType === 'staff') {
      filteredPeople = filteredPeople.filter(person => person.type === 'staff');
    }
    
    // Update the data state with filtered people
    setData(filteredPeople);
    
    // Calculate status counts for the filtered data
    const counts = {
      total: allPeople.length,
      active: allPeople.filter(person => person.status === 'Active').length,
      inactive: allPeople.filter(person => person.status === 'Inactive').length,
      pending: allPeople.filter(person => person.status === 'Pending').length,
      banned: allPeople.filter(person => person.status === 'Banned').length,
      members: allPeople.filter(person => person.type === 'member').length,
      staff: allPeople.filter(person => person.type === 'staff').length,
    };
    setStatusCounts(counts);
    
  }, [allPeople, activeTab, selectedType]);

  // Filter data for display
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

  // Get page title based on the section/type
  const getPageTitle = () => {
    return 'Members';
  };
  
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
                  onClick={() => setActiveTab('all')}
                >
                  All <span className="ml-1 text-[10px] text-gray-500 dark:text-gray-400">{isLoading ? '...' : statusCounts.total}</span>
                </button>
                <button 
                  className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'active' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
                  onClick={() => setActiveTab('active')}
                >
                  Active <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500">{isLoading ? '...' : statusCounts.active}</span>
                </button>
                <button 
                  className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'pending' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
                  onClick={() => setActiveTab('pending')}
                >
                  Pending <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500">{isLoading ? '...' : statusCounts.pending}</span>
                </button>
                <button 
                  className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'inactive' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
                  onClick={() => setActiveTab('inactive')}
                >
                  Inactive <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500">{isLoading ? '...' : statusCounts.inactive}</span>
                </button>
                {statusCounts.banned > 0 && (
                  <button 
                    className={`inline-flex items-center px-2 py-1.5 text-xs font-medium ${activeTab === 'banned' ? 'text-gray-900 dark:text-white border-b border-gray-900 dark:border-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}
                    onClick={() => setActiveTab('banned')}
                  >
                    Banned <span className="ml-1 text-[10px] text-gray-400 dark:text-gray-500">{isLoading ? '...' : statusCounts.banned}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Table toolbar */}
            <div className="mb-0 flex items-center justify-between gap-1.5">
              {/* Left side - Filter, Sort, Column buttons */}
              <div className="flex items-center gap-1.5">
                {selectedType ? (
                  <div className="flex gap-1">
                    <button 
                      className="inline-flex items-center justify-center h-6 px-2 rounded text-purple-500 dark:text-purple-400 border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/20 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors text-xs font-medium"
                    >
                      <User className="h-3 w-3 mr-1" />
                      Type: {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                    </button>
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
                    <DropdownMenuContent align="end" className="w-[170px]">
                      <DropdownMenuLabel className="text-[11px]">
                        Actions for {table.getFilteredSelectedRowModel().rows.length} selected
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Change Role</DropdownMenuItem>
                      <DropdownMenuItem>Send Message</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
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
                  <span>Invite Member</span>
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
                  <span className="text-sm text-gray-500 dark:text-gray-400">Loading members...</span>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-32">
                <div className="flex flex-col items-center text-center max-w-md px-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{error}</p>
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
                          <UserIcon className="h-8 w-8 text-muted dark:text-muted" />
                          <span>No members found</span>
                          {activeTab !== 'all' && (
                            <button 
                              onClick={() => setActiveTab('all')}
                              className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                            >
                              Show all members
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

export default withSiteContext(Members); 