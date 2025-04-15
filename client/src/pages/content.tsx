import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, ChevronDown, Filter, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation, useRoute, Link } from "wouter";
import { useEffect, useState } from "react";

// Post type interface
interface PostType {
  name: string;
  count: number;
  route: string;
}

// CMS Collection view component
function CMSCollectionView() {
  const postTypes: PostType[] = [
    { name: "All Post types", count: 10, route: "/content/posts/all" },
    { name: "Discussions", count: 14, route: "/content/posts/discussions" },
    { name: "Wishlist", count: 5, route: "/content/posts/wishlist" },
    { name: "Jobs", count: 324, route: "/content/posts/jobs" },
  ];

  return (
    <div className="max-w-2xl">
      <div className="space-y-4">
        {postTypes.map((type, index) => (
          <Link key={index} href={type.route}>
            <div className={`flex justify-between items-center p-4 rounded-lg cursor-pointer ${index === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700`}>
              <span className="text-gray-800 dark:text-gray-200 text-lg font-medium">{type.name}</span>
              <div className="bg-white dark:bg-gray-700 rounded-full px-3 py-1 text-gray-600 dark:text-gray-300 font-medium">
                {type.count}
              </div>
            </div>
          </Link>
        ))}
        
        <div className="mt-8">
          <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium">
            <Plus className="h-4 w-4 mr-2" />
            Add custom view
          </button>
        </div>
      </div>
    </div>
  );
}

// Activity Hub view
function ActivityHubView() {
  return (
    <div className="max-w-7xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Activity Hub</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track user engagement and content activities
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6">
        <p className="text-gray-500 dark:text-gray-400">
          Content for Activity Hub will display here.
        </p>
      </div>
    </div>
  );
}

export default function Content() {
  const [location, setLocation] = useLocation();
  const [, params] = useRoute('/content/:section');
  const [, postTypeParams] = useRoute('/content/posts/:postType');
  const section = params?.section;
  const postType = postTypeParams?.postType;

  // Redirect to the first tab (posts) if we're at the root content route
  useEffect(() => {
    if (location === '/content') {
      setLocation('/content/posts');
    }
  }, [location, setLocation]);

  // If we're at the root content URL, show a loading state until the redirect happens
  if (location === '/content') {
    return <DashboardLayout><div className="p-8">Loading content...</div></DashboardLayout>;
  }
  
  // Determine which view to render based on the URL
  const renderView = () => {
    if (section === "posts") {
      return <CMSCollectionView />;
    } else if (section === "comments") {
      return <ActivityHubView />;
    } else {
      // Default content view with grid of content items
      return (
        <>
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
        </>
      );
    }
  };

  // Generate a breadcrumb title based on the current section
  const getBreadcrumbTitle = () => {
    if (section === "posts") {
      return "CMS Collections";
    } else if (section === "comments") {
      return "Activity Hub";
    } else {
      return "Content Management";
    }
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{getBreadcrumbTitle()}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {section === "posts" ? "Manage your content collections" : 
             section === "comments" ? "Track engagement and interactions" : 
             "Manage all your content in one place"}
          </p>
        </div>

        {renderView()}
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