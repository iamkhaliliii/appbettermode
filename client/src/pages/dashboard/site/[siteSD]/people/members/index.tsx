import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useRoute } from "wouter";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sitesApi, Site, Member } from "@/lib/api";
import { 
  UserIcon, 
  PlusIcon, 
  SearchIcon,
  MoreHorizontalIcon,
  FilterIcon,
  ArrowUpDown,
  UserPlusIcon,
  UploadIcon,
  DownloadIcon
} from "lucide-react";

// Using the Member interface imported from @/lib/api

// Members are now fetched from the API using sitesApi.getMembers

/**
 * Site Members Dashboard Page
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
export default function SiteMembersPage() {
  // Extract siteSD (site identifier) from the route
  const [, params] = useRoute('/dashboard/site/:siteSD/people/members');
  const siteSD = params?.siteSD || '';
  
  // State for site data
  const [siteData, setSiteData] = useState<Site | null>(null);
  const [isLoadingSite, setIsLoadingSite] = useState(true);
  const [siteError, setSiteError] = useState<string | null>(null);
  
  // State for members data
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [membersError, setMembersError] = useState<string | null>(null);
  
  // State for members search
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [currentTab, setCurrentTab] = useState('all');
  
  // Fetch site data
  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteSD) {
        setIsLoadingSite(false);
        setSiteError("No site identifier provided");
        return;
      }
      
      setIsLoadingSite(true);
      setSiteError(null);
      
      try {
        // Fetch site data using the API
        const data = await sitesApi.getSite(siteSD);
        setSiteData(data);
        setIsLoadingSite(false);
      } catch (err: any) {
        console.error("Error fetching site data:", err);
        setSiteError(err.message || "Failed to load site data");
        setIsLoadingSite(false);
      }
    };
    
    fetchSiteData();
  }, [siteSD]);
  
  // Fetch members data
  useEffect(() => {
    const fetchMembers = async () => {
      if (!siteSD) return;
      
      setIsLoadingMembers(true);
      setMembersError(null);
      
      try {
        // Fetch members using the API
        const data = await sitesApi.getMembers(siteSD);
        setMembers(data);
        setIsLoadingMembers(false);
      } catch (err: any) {
        console.error("Error fetching members:", err);
        setMembersError(err.message || "Failed to load members data");
        setIsLoadingMembers(false);
      }
    };
    
    fetchMembers();
  }, [siteSD]);
  
  // Filter members based on search term and current tab
  useEffect(() => {
    if (!members.length) {
      setFilteredMembers([]);
      return;
    }
    
    let filtered = [...members];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(member => 
        member.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply tab filter
    if (currentTab === 'active') {
      filtered = filtered.filter(member => member.status === 'Active');
    } else if (currentTab === 'inactive') {
      filtered = filtered.filter(member => member.status === 'Inactive');
    }
    
    setFilteredMembers(filtered);
  }, [members, searchTerm, currentTab]);
  
  const isLoading = isLoadingSite || isLoadingMembers;
  const error = siteError || membersError;
  
  if (isLoading) {
    return (
      <DashboardLayout currentSiteIdentifier={siteSD} siteName="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">
              {isLoadingSite ? "Loading site data..." : "Loading members..."}
            </p>
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error</h2>
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
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Members</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage community members for {siteData?.name || "this site"}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
            <Button variant="secondary" className="flex items-center gap-1.5">
              <DownloadIcon className="h-4 w-4" />
              Export
            </Button>
            <Button variant="secondary" className="flex items-center gap-1.5">
              <UploadIcon className="h-4 w-4" />
              Import
            </Button>
            <Button className="flex items-center gap-1.5">
              <UserPlusIcon className="h-4 w-4" />
              Invite
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-0">
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
            
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
              <TabsList className="border-b w-full flex justify-start rounded-none bg-transparent p-0 h-auto">
                <TabsTrigger 
                  value="all" 
                  className="border-b-2 border-transparent data-[state=active]:border-primary-600 rounded-none bg-transparent py-2 px-4 font-medium text-gray-500 data-[state=active]:text-primary-600 hover:text-gray-700"
                >
                  All Members
                </TabsTrigger>
                <TabsTrigger 
                  value="active" 
                  className="border-b-2 border-transparent data-[state=active]:border-primary-600 rounded-none bg-transparent py-2 px-4 font-medium text-gray-500 data-[state=active]:text-primary-600 hover:text-gray-700"
                >
                  Active
                </TabsTrigger>
                <TabsTrigger 
                  value="inactive" 
                  className="border-b-2 border-transparent data-[state=active]:border-primary-600 rounded-none bg-transparent py-2 px-4 font-medium text-gray-500 data-[state=active]:text-primary-600 hover:text-gray-700"
                >
                  Inactive
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <div className="border rounded-md mt-4">
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
                  <div key={member.userId} className="grid grid-cols-12 gap-4 py-3 px-4 items-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="h-9 w-9 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{member.fullName || 'Anonymous User'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.email || 'No email provided'}</p>
                      </div>
                    </div>
                    <div className="col-span-2 text-gray-700 dark:text-gray-300">
                      {member.role}
                    </div>
                    <div className="col-span-2 text-gray-700 dark:text-gray-300">
                      {new Date(member.joinedAt).toLocaleDateString()}
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
                  <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                    No members found matching your criteria.
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