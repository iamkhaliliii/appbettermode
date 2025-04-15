import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useLocation } from "wouter";
import { useState } from "react";
import { 
  ArrowLeft,
  Settings,
  FileCode2,
  Layout,
  Layers2,
  ChevronRight,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

// Feed component for spaces
export default function DesignStudioSpacesFeed() {
  const [location, setLocation] = useLocation();
  
  return (
    <DashboardLayout>
      <div className="flex h-full">
        {/* Secondary Sidebar with new content */}
        <div className="w-64 border-r border-gray-200 dark:border-gray-700 overflow-auto h-full bg-gray-50/80 dark:bg-gray-850/80">
          {/* Back and title section */}
          <div className="px-4 py-3 flex items-center">
            <button 
              onClick={() => setLocation('/design-studio')}
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 rounded transition-colors mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Spaces Feed</h2>
            <button className="ml-auto text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 p-1.5 rounded transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>
          
          {/* Breadcrumb */}
          <div className="px-4 py-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
            <span>Design Studio</span>
            <ChevronRight className="h-3 w-3 mx-1" />
            <span>Spaces</span>
            <ChevronRight className="h-3 w-3 mx-1" />
            <span className="text-gray-900 dark:text-white">Feed</span>
          </div>
          
          <Separator className="my-2" />
          
          {/* Actions Accordion */}
          <div className="px-3 py-2">
            <Accordion type="single" collapsible defaultValue="actions" className="space-y-1">
              {/* Actions Accordion */}
              <AccordionItem value="actions" className="border-0">
                <AccordionTrigger className="flex items-center py-1.5 px-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <FileCode2 className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium text-sm">Actions</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-1">
                  <div className="ml-6 space-y-1">
                    <div className="flex items-center px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300">
                      <Plus className="h-3.5 w-3.5 mr-2 text-gray-500" />
                      <span>Create Post</span>
                    </div>
                    <div className="flex items-center px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300">
                      <Plus className="h-3.5 w-3.5 mr-2 text-gray-500" />
                      <span>New Thread</span>
                    </div>
                    <div className="flex items-center px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300">
                      <Plus className="h-3.5 w-3.5 mr-2 text-gray-500" />
                      <span>Import Content</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Layout Templates Accordion */}
              <AccordionItem value="templates" className="border-0">
                <AccordionTrigger className="flex items-center py-1.5 px-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Layout className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium text-sm">Layout Templates</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-1">
                  <div className="ml-6 space-y-1">
                    <div className="flex items-center px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300">
                      <span>Default Layout</span>
                    </div>
                    <div className="flex items-center px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300">
                      <span>Compact View</span>
                    </div>
                    <div className="flex items-center px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300">
                      <span>Grid Layout</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Sections and Blocks Accordion */}
              <AccordionItem value="sections" className="border-0">
                <AccordionTrigger className="flex items-center py-1.5 px-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-700 dark:text-gray-300 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Layers2 className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="font-medium text-sm">Sections and Blocks</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-1">
                  <div className="ml-6 space-y-1">
                    <div className="flex items-center px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300">
                      <span>Header Section</span>
                    </div>
                    <div className="flex items-center px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300">
                      <span>Content Block</span>
                    </div>
                    <div className="flex items-center px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300">
                      <span>Media Gallery</span>
                    </div>
                    <div className="flex items-center px-2 py-1 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300">
                      <span>Comments Section</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        
        {/* Main Content Area - reusing existing feed content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Feed</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Configure and manage your spaces feed layout and content
            </p>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">Feed Configuration</h2>
              </div>
              
              <div className="grid gap-4">
                <div className="flex items-start">
                  <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-md mr-3">
                    <FileCode2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Feed Layout</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Choose how your content is displayed in the feed
                    </p>
                    <div className="flex gap-2">
                      <button className="text-xs bg-purple-600 text-white rounded px-3 py-1 hover:bg-purple-700 transition-colors">
                        Edit Layout
                      </button>
                      <button className="text-xs border border-gray-200 dark:border-gray-700 rounded px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-md mr-3">
                    <Layout className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Content Organization</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Configure sorting, filtering and organization rules
                    </p>
                    <div className="flex gap-2">
                      <button className="text-xs bg-blue-600 text-white rounded px-3 py-1 hover:bg-blue-700 transition-colors">
                        Configure
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-md mr-3">
                    <Layers2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Interactive Elements</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      Manage likes, comments, sharing and other interactive features
                    </p>
                    <div className="flex gap-2">
                      <button className="text-xs bg-green-600 text-white rounded px-3 py-1 hover:bg-green-700 transition-colors">
                        Customize
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}