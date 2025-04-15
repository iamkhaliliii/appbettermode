import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, ChevronDown, Filter, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLocation, useRoute, useParams, Redirect } from "wouter";
import { useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export default function Content() {
  const [location, setLocation] = useLocation();
  const [, params] = useRoute('/content/:section');
  const section = params?.section;

  // No automatic redirect from /content to /content/CMS anymore
  
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
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
                All Posts
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300">
                  14 items
                </span>
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage all your content from a single, powerful interface
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 inline-flex items-center text-sm font-medium rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
                Export
              </button>
              <button className="px-3 py-2 inline-flex items-center text-sm font-medium rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Content
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap -mb-px">
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400">
                All <span className="ml-2 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-300 px-2 py-0.5 text-xs">14</span>
              </button>
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                Published <span className="ml-2 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-2 py-0.5 text-xs">6</span>
              </button>
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                Scheduled <span className="ml-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 px-2 py-0.5 text-xs">3</span>
              </button>
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                Drafts <span className="ml-2 rounded-full bg-gray-100 dark:bg-gray-700 px-2 py-0.5 text-xs">0</span>
              </button>
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                Pending <span className="ml-2 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 px-2 py-0.5 text-xs">0</span>
              </button>
              <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-b-2 hover:border-gray-300 dark:hover:border-gray-600 transition-all">
                Reported <span className="ml-2 rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 px-2 py-0.5 text-xs">0</span>
              </button>
            </div>
          </div>

          {/* Table toolbar */}
          <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center">
                <button className="p-1.5 rounded border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-750 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  </svg>
                </button>
                <button className="p-1.5 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750 text-primary-600 dark:text-primary-400 ml-1 shadow-sm">
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
              
              <button className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
              </button>
              
              <button className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
                Sort
              </button>
              
              <button className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-750 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Columns
              </button>
            </div>
            
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search content..."
                  className="w-full py-1.5 pl-9 pr-3 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-750 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Main table */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-800/80">
                <TableRow>
                  <TableHead className="w-10 relative">
                    <div className="absolute inset-y-0 left-2 flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500 focus:ring-offset-1"
                      />
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase">
                    <div className="flex items-center hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors group">
                      <span>Title</span>
                      <svg className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase">
                    <div className="flex items-center hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors group">
                      <span>Status</span>
                      <svg className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase">
                    <div className="flex items-center hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors group">
                      <span>Author</span>
                      <svg className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase">
                    <div className="flex items-center hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors group">
                      <span>Space</span>
                      <svg className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase">
                    <div className="flex items-center hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors group">
                      <span>Published at</span>
                      <svg className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase">
                    <div className="flex items-center hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors group">
                      <span>CMS model</span>
                      <svg className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase">
                    <div className="flex items-center hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors group">
                      <span>ID</span>
                      <svg className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase">
                    <div className="flex items-center hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors group">
                      <span>Tags</span>
                      <svg className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </TableHead>
                  <TableHead className="font-medium text-xs uppercase">
                    <div className="flex items-center justify-center hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors group">
                      <span>Locked</span>
                      <svg className="ml-1 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <TableCell className="w-10">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-500"
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    Level Up Your Community
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      Schedule
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-6 w-6">
                        <img className="h-6 w-6 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                      </div>
                      <div className="ml-2">John Doe</div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-4 w-4 bg-indigo-500 rounded-full mr-2"></div>
                      <div>Discussions</div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    Jan 13, 2025
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                      Discussion
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-gray-500 dark:text-gray-400">
                    dOUwwAq3Lc9vmA
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex gap-1">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                        Discussion
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        new
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        me_too
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-center">
                    <span className="text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    <button className="text-gray-400 hover:text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </button>
                  </TableCell>
                </TableRow>

                <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <TableCell className="w-10">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-500"
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    Community Building Strategies
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      Pending review
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-6 w-6">
                        <img className="h-6 w-6 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                      </div>
                      <div className="ml-2">John Doe</div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-4 w-4 bg-yellow-500 rounded-full mr-2"></div>
                      <div>Wishlist</div>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    Jan 13, 2025
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                      Wishlist
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-gray-500 dark:text-gray-400">
                    9fXYxHmWxwvcf15
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex gap-1">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                        Discussion
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        new
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        me_too
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-center">
                    <span className="text-yellow-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    <button className="text-gray-400 hover:text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </button>
                  </TableCell>
                </TableRow>

                <tr className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-500"
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Engaging Your Online Community
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      Pending review
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-6 w-6">
                        <img className="h-6 w-6 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                      </div>
                      <div className="ml-2">John Doe</div>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-4 w-4 bg-indigo-500 rounded-full mr-2"></div>
                      <div>Discussions</div>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    Jan 13, 2025
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                      Discussion
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    qbJgwG9RtWsJW5d
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex gap-1">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                        Discussion
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        new
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        me_too
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-500"
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Community Management Insights
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                      Reported
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-6 w-6">
                        <img className="h-6 w-6 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                      </div>
                      <div className="ml-2">John Doe</div>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-4 w-4 bg-indigo-500 rounded-full mr-2"></div>
                      <div>Discussions</div>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    Jan 13, 2025
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                      Discussion
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    dOUwwAq3Lc9vmA
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex gap-1">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                        Discussion
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        new
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        me_too
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </button>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary-500"
                    />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    Growing Your Member Base
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      Published
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-6 w-6">
                        <img className="h-6 w-6 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                      </div>
                      <div className="ml-2">John Doe</div>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-4 w-4 bg-indigo-500 rounded-full mr-2"></div>
                      <div>Discussions</div>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    Jan 12, 2025
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <span className="px-2 py-0.5 rounded-full text-xs bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                      Discussion
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    GmDrEOHJMQU3Pd
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex gap-1">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300">
                        Discussion
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        new
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        me_too
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6 px-2">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span className="text-gray-600 dark:text-gray-300 font-medium">Items per page:</span>
              <div className="relative ml-2">
                <select className="appearance-none bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-md pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <span className="ml-6 text-gray-600 dark:text-gray-300 font-medium">Showing</span>
              <span className="mx-1 font-semibold text-gray-800 dark:text-gray-200">1-5</span>
              <span className="text-gray-600 dark:text-gray-300 font-medium">of</span>
              <span className="mx-1 font-semibold text-gray-800 dark:text-gray-200">14</span>
              <span className="text-gray-600 dark:text-gray-300 font-medium">results</span>
            </div>
            
            <div className="inline-flex items-center border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
              <button className="flex items-center justify-center h-9 w-9 bg-white dark:bg-gray-750 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button className="h-9 w-9 bg-primary-50 dark:bg-primary-900/20 border-x border-gray-200 dark:border-gray-700 text-primary-600 dark:text-primary-400 font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">1</button>
              <button className="h-9 w-9 bg-white dark:bg-gray-750 border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">2</button>
              <button className="h-9 w-9 bg-white dark:bg-gray-750 border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">3</button>
              
              <button className="flex items-center justify-center h-9 w-9 bg-white dark:bg-gray-750 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Action menu - Floating action button */}
          <div className="fixed bottom-6 right-6 z-20">
            <div className="relative group">
              <button className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                <Plus className="h-6 w-6" />
              </button>
              
              {/* Action menu dropdown */}
              <div className="absolute right-0 bottom-full mb-3 w-48 overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 origin-bottom-right scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200">
                <div className="py-1">
                  <button className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Create Post
                  </button>
                  <button className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    New CMS Collection
                  </button>
                  <button className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                    </svg>
                    Import Content
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  <button className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Content Settings
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