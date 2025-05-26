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

// Add a type for site data from API
interface SiteData {
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

// Mock data for people
const MOCK_PEOPLE: Person[] = [
  { 
    id: "1", 
    name: "Olivia Rhye", 
    email: "olivia@untitledui.com", 
    role: "Admin", 
    joinDate: "Jan 12, 2023", 
    lastActive: "2 hours ago",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    postsCount: 45,
    type: "staff"
  },
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
    id: "4", 
    name: "Demi Wilkinson", 
    email: "demi@untitledui.com", 
    role: "Moderator", 
    joinDate: "Dec 13, 2022", 
    lastActive: "5 hours ago",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    postsCount: 67,
    type: "staff"
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
  }
];

/**
 * Site People Dashboard Page
 * 
 * Shows a list of members for a specific site.
 * Currently using mock data for members, but will be updated to use the API.
 * 
 * Future improvements:
 * - Fetch members from API (memberships table)
 * - Implement pagination
 * - Add, edit, and delete functionality
 * - Role management
 */
export default function SitePeoplePage() {
  // Extract siteSD (site identifier) from the route
  const [, params] = useRoute('/dashboard/site/:siteSD/people');
  const siteSD = params?.siteSD || '';
  
  // State for site data
  const [siteData, setSiteData] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for members search
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState(MOCK_MEMBERS);
  
  // Fetch site data
  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteSD) {
        setIsLoading(false);
        setError("No site identifier provided");
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch site data using the new API
        const data = await sitesApi.getSite(siteSD);
        setSiteData(data);
        setIsLoading(false);
      } catch (err: any) {
        console.error("Error fetching site data:", err);
        setError(err.message || "Failed to load site data");
        setIsLoading(false);
      }
    };
    
    fetchSiteData();
  }, [siteSD]);
  
  // Filter members based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredMembers(
        MOCK_MEMBERS.filter(member => 
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredMembers(MOCK_MEMBERS);
    }
  }, [searchTerm]);
  
  if (isLoading) {
    return (
      <DashboardLayout currentSiteIdentifier={siteSD} siteName="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading site data...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (error) {
    return (
      <DashboardLayout currentSiteIdentifier={siteSD} siteName="Error">
        <div className="p-4 text-center">
          <div className="text-red-500 mb-2 text-3xl">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Site</h2>
          <p className="text-gray-500 dark:text-gray-400">{error}</p>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout 
      currentSiteIdentifier={siteSD} 
      siteName={siteData?.name || "Site"}>
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">People</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage members and staff for {siteData?.name || "this site"}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button
              className="flex items-center gap-1.5"
            >
              <PlusIcon className="h-4 w-4" />
              Add Member
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search members..." 
                  className="pl-9 max-w-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-row items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm" 
                  className="flex items-center gap-1.5 border-gray-300"
                >
                  <FilterIcon className="h-3.5 w-3.5" />
                  Filter
                </Button>
                
                <Button
                  variant="secondary"
                  size="sm" 
                  className="flex items-center gap-1.5 border-gray-300"
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  Sort
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="border rounded-md">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 border-b">
                <div className="col-span-5">Name</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Join Date</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1"></div>
              </div>
              
              {/* Table body */}
              <div className="divide-y">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="grid grid-cols-12 gap-4 py-3 px-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="h-9 w-9 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                      </div>
                    </div>
                    <div className="col-span-2 text-gray-700 dark:text-gray-300">
                      {member.role}
                    </div>
                    <div className="col-span-2 text-gray-700 dark:text-gray-300">
                      {member.joinDate}
                    </div>
                    <div className="col-span-2">
                      <span 
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          member.status === 'Active' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {filteredMembers.length === 0 && (
                  <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                    No members found matching your search.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
} 