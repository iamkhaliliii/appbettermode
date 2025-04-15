import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useLocation, useRoute } from "wouter";
import { useEffect } from "react";
import { FolderPlus, Edit, Trash2, Plus, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DesignStudio() {
  const [location, setLocation] = useLocation();
  const [isSpaces] = useRoute('/design-studio/spaces/:path*');
  const [isTemplates] = useRoute('/design-studio/templates/:type');
  const [isCollections] = useRoute('/design-studio/collections/:collection');
  const [isUtility] = useRoute('/design-studio/utility/:page');
  const [isHeader] = useRoute('/design-studio/header');
  const [, params] = useRoute('/design-studio/:section');
  const section = params?.section;

  // Redirect to the spaces tab if we're at the root design-studio route
  useEffect(() => {
    if (location === '/design-studio') {
      setLocation('/design-studio/spaces');
    }
  }, [location, setLocation]);

  // If we're at the root design-studio URL, show a loading state until the redirect happens
  if (location === '/design-studio') {
    return <DashboardLayout><div className="p-8">Loading design studio...</div></DashboardLayout>;
  }

  // Helper to extract meaningful title from the URL
  const getTitle = () => {
    if (isSpaces) {
      const path = location.replace('/design-studio/spaces/', '');
      if (path === '') return 'All Spaces';
      
      const segments = path.split('/');
      // Handle deeper levels by showing breadcrumb-like title
      if (segments.length > 1) {
        const lastSegment = segments[segments.length - 1];
        return lastSegment.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      }
      
      return segments[0].split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
    }
    
    if (isTemplates) {
      const type = location.split('/').pop();
      return type?.charAt(0).toUpperCase() + type?.slice(1) + ' Templates';
    }
    
    if (isCollections) {
      const collection = location.split('/').pop();
      return collection?.charAt(0).toUpperCase() + collection?.slice(1) + ' Collection';
    }
    
    if (isUtility) {
      const page = location.split('/').pop();
      return page?.charAt(0).toUpperCase() + page?.slice(1) + ' Page';
    }
    
    if (isHeader) {
      return 'Header & Sidebar';
    }
    
    // Fallback
    return section ? section.charAt(0).toUpperCase() + section.slice(1) : 'Design Studio';
  };

  // Render different content based on the route
  const renderContent = () => {
    if (isSpaces) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{getTitle()}</h2>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <FolderPlus className="mr-2 h-4 w-4" />
                New Folder
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Page
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3">
                <div className="h-32 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                  <Layout className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Page {item}</h3>
                  <div className="flex space-x-1">
                    <button className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    if (isTemplates || isCollections || isUtility || isHeader) {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">{getTitle()}</h2>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New {isTemplates ? 'Template' : isCollections ? 'Item' : 'Page'}
            </Button>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              This is a placeholder for the {getTitle()} section.
            </p>
          </div>
        </div>
      );
    }
    
    // Fallback content
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Design Studio</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {section && <span>Currently viewing: {section.charAt(0).toUpperCase() + section.slice(1)}</span>}
        </p>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Design Studio</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Customize your design and layout preferences
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          {renderContent()}
        </div>
      </div>
    </DashboardLayout>
  );
}