import { useState, useEffect } from "react";
import { Header } from "./header";
import { MainSidebar } from "./main-sidebar";
import { SecondarySidebar } from "./secondary-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, PanelLeft, PanelRightClose } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import * as Tooltip from "@radix-ui/react-tooltip";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                className="pl-10"
                placeholder="Search..."
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="space-y-2">
            <a href="/" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary-700 bg-primary-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Tasks
              <span className="ml-auto bg-primary-50 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">10</span>
            </a>
          </nav>
        </div>
      )}

      {/* Main content area with 3-column layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Main Sidebar - hidden on mobile, always collapsed otherwise */}
        {!isMobile && <div className="w-12 flex-shrink-0">
          <MainSidebar collapsed={true} />
        </div>}
        
        {/* Secondary Sidebar - hidden on mobile, always visible otherwise */}
        {!isMobile && <div className="w-64 flex-shrink-0">
          <SecondarySidebar />
        </div>}
        
        {/* Main Content */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
