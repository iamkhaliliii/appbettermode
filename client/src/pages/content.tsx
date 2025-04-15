import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, ChevronDown, Filter, MoreHorizontal, Calendar, UserCircle, Lock, Tag, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation, useRoute, useParams, Redirect } from "wouter";
import { useState, useMemo } from "react";
import { DataTable, Column } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";

// Define post data type
type Post = {
  id: string;
  title: string;
  status: 'published' | 'scheduled' | 'draft' | 'pending' | 'reported';
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
};

export default function Content() {
  const [location, setLocation] = useLocation();
  const [, params] = useRoute('/content/:section');
  const section = params?.section;
  
  // No automatic redirect from /content to /content/CMS anymore
  
  // Generate sample data for the table
  const postsData = useMemo<Post[]>(() => [
    {
      id: "dOUwwAq3Lc9vmA",
      title: "Level Up Your Community",
      status: "scheduled",
      author: {
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      space: {
        name: "Discussions",
        color: "#6366F1" // Indigo
      },
      publishedAt: "Jan 13, 2025",
      cmsModel: "Discussion",
      tags: ["Discussion", "new", "me_too"],
      locked: false
    },
    {
      id: "9fXYxHmWxwvcf15",
      title: "Community Building Strategies",
      status: "pending",
      author: {
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      space: {
        name: "Wishlist",
        color: "#F59E0B" // Amber
      },
      publishedAt: "Jan 13, 2025",
      cmsModel: "Wishlist",
      tags: ["Discussion", "new", "me_too"],
      locked: true
    },
    {
      id: "qbJgwG9RtWsJW5d",
      title: "Engaging Your Online Community",
      status: "pending",
      author: {
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      space: {
        name: "Discussions",
        color: "#6366F1" // Indigo
      },
      publishedAt: "Jan 13, 2025",
      cmsModel: "Discussion",
      tags: ["Discussion", "new", "me_too"],
      locked: false
    },
    {
      id: "7HaQUSwb3LpT9vZ",
      title: "Community Management Insights",
      status: "reported",
      author: {
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      space: {
        name: "Discussions",
        color: "#6366F1" // Indigo
      },
      publishedAt: "Jan 13, 2025",
      cmsModel: "Discussion",
      tags: ["Discussion", "new", "me_too"],
      locked: false
    },
    {
      id: "GmDrEOHJMQU3Pd",
      title: "Growing Your Member Base",
      status: "published",
      author: {
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      space: {
        name: "Discussions",
        color: "#6366F1" // Indigo
      },
      publishedAt: "Jan 12, 2025",
      cmsModel: "Discussion",
      tags: ["Discussion", "new", "me_too"],
      locked: false
    },
    {
      id: "dOUwwAq3Lc9vmR5",
      title: "Level Up Your Community Part 2",
      status: "published",
      author: {
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      space: {
        name: "Discussions",
        color: "#6366F1" // Indigo
      },
      publishedAt: "Jan 12, 2025",
      cmsModel: "Discussion",
      tags: ["Discussion", "new", "me_too"],
      locked: false
    },
    {
      id: "aZ3Fm7KwQrTg8Hi",
      title: "Best Practices for Community Engagement",
      status: "published",
      author: {
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      space: {
        name: "Discussions",
        color: "#6366F1" // Indigo
      },
      publishedAt: "Jan 12, 2025",
      cmsModel: "Discussion",
      tags: ["Discussion", "new", "me_too"],
      locked: false
    },
    {
      id: "x4PqN8JySm2zVc5",
      title: "Future of Online Communities",
      status: "draft",
      author: {
        name: "John Doe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      },
      space: {
        name: "Discussions",
        color: "#6366F1" // Indigo
      },
      publishedAt: "Jan 12, 2025",
      cmsModel: "Discussion",
      tags: ["Discussion", "new", "me_too"],
      locked: false
    }
  ], []);
  
  // Define table columns
  const columns = useMemo(() => [
    {
      id: "title",
      header: "Title",
      accessorKey: "title" as keyof Post,
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status" as keyof Post,
      sortable: true,
      cell: (post: Post) => {
        const statusConfig = {
          published: {
            label: "Published",
            bg: "bg-green-100 dark:bg-green-900/30",
            text: "text-green-700 dark:text-green-400",
            icon: <Check className="h-3 w-3 mr-1" />
          },
          scheduled: {
            label: "Scheduled",
            bg: "bg-blue-100 dark:bg-blue-900/30",
            text: "text-blue-700 dark:text-blue-400",
            icon: <Calendar className="h-3 w-3 mr-1" />
          },
          draft: {
            label: "Draft",
            bg: "bg-gray-100 dark:bg-gray-800",
            text: "text-gray-700 dark:text-gray-400",
            icon: null
          },
          pending: {
            label: "Pending Review",
            bg: "bg-yellow-100 dark:bg-yellow-900/30",
            text: "text-yellow-700 dark:text-yellow-400",
            icon: <ChevronDown className="h-3 w-3 mr-1" />
          },
          reported: {
            label: "Reported",
            bg: "bg-red-100 dark:bg-red-900/30",
            text: "text-red-700 dark:text-red-400",
            icon: <ChevronDown className="h-3 w-3 mr-1 rotate-180" />
          }
        };
        
        const config = statusConfig[post.status];
        
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            {config.icon}
            {config.label}
          </span>
        );
      }
    },
    {
      id: "author",
      header: "Author",
      accessorKey: "author" as keyof Post,
      cell: (post: Post) => (
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 h-7 w-7">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="rounded-full"
            />
          </div>
          <span>{post.author.name}</span>
        </div>
      )
    },
    {
      id: "space",
      header: "Space",
      accessorKey: "space" as keyof Post,
      cell: (post: Post) => (
        <div className="flex items-center gap-2">
          <div 
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: post.space.color }}
          ></div>
          <span>{post.space.name}</span>
        </div>
      )
    },
    {
      id: "publishedAt",
      header: "Published At",
      accessorKey: "publishedAt" as keyof Post,
      sortable: true
    },
    {
      id: "cmsModel",
      header: "CMS Model",
      accessorKey: "cmsModel" as keyof Post,
      cell: (post: Post) => (
        <span className="px-2 py-1 rounded-full text-xs bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
          {post.cmsModel}
        </span>
      )
    },
    {
      id: "tags",
      header: "Tags",
      accessorKey: "tags" as keyof Post,
      cell: (post: Post) => (
        <div className="flex gap-1 flex-wrap">
          {post.tags.map((tag, i) => {
            const colors = {
              "Discussion": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
              "new": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
              "me_too": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            };
            
            return (
              <span 
                key={i} 
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[tag as keyof typeof colors] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"}`}
              >
                {tag}
              </span>
            );
          })}
        </div>
      )
    },
    {
      id: "locked",
      header: "Locked",
      accessorKey: "locked" as keyof Post,
      cell: (post: Post) => (
        <div className="flex justify-center">
          {post.locked ? (
            <Lock className="h-4 w-4 text-yellow-500" />
          ) : (
            <Lock className="h-4 w-4 text-gray-300 dark:text-gray-600" />
          )}
        </div>
      )
    },
    {
      id: "actions",
      header: "",
      accessorKey: "id" as keyof Post,
      cell: (_post: Post) => (
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ], []);
  
  // Filter tab configuration for section filtering
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  // Filtered data based on active tab
  const filteredPosts = useMemo(() => {
    if (activeFilter === "all") return postsData;
    return postsData.filter(post => post.status === activeFilter);
  }, [postsData, activeFilter]);
  
  // Content page will have its own view
  
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
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Content</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage all your content in one place
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary-gray" size="sm" className="gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
                Export
              </Button>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Create Content
              </Button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap -mb-px gap-1">
              <button 
                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium transition-all ${activeFilter === "all" ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                onClick={() => setActiveFilter("all")}
              >
                All <span className="ml-1.5 rounded-full bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 text-xs">{postsData.length}</span>
              </button>
              <button 
                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium transition-all ${activeFilter === "published" ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                onClick={() => setActiveFilter("published")}
              >
                Published <span className="ml-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 text-xs">{postsData.filter(p => p.status === "published").length}</span>
              </button>
              <button 
                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium transition-all ${activeFilter === "scheduled" ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                onClick={() => setActiveFilter("scheduled")}
              >
                Scheduled <span className="ml-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 text-xs">{postsData.filter(p => p.status === "scheduled").length}</span>
              </button>
              <button 
                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium transition-all ${activeFilter === "draft" ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                onClick={() => setActiveFilter("draft")}
              >
                Drafts <span className="ml-1.5 rounded-full bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-xs">{postsData.filter(p => p.status === "draft").length}</span>
              </button>
              <button 
                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium transition-all ${activeFilter === "pending" ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                onClick={() => setActiveFilter("pending")}
              >
                Pending <span className="ml-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 text-xs">{postsData.filter(p => p.status === "pending").length}</span>
              </button>
              <button 
                className={`inline-flex items-center px-3 py-1.5 text-sm font-medium transition-all ${activeFilter === "reported" ? "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                onClick={() => setActiveFilter("reported")}
              >
                Reported <span className="ml-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-1.5 py-0.5 text-xs">{postsData.filter(p => p.status === "reported").length}</span>
              </button>
            </div>
          </div>

          {/* DataTable component */}
          <DataTable 
            data={filteredPosts}
            columns={columns}
            searchPlaceholder="Search content..."
          />
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