import { useState, useEffect } from "react";
import { Header } from "./header";
import { MainSidebar } from "./main-sidebar";
import { SecondarySidebar } from "./secondary-sidebar/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { type NavItem } from "./secondary-sidebar/types"; // Updated to point to new location
import { useLocation } from "wouter";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: React.ReactNode;
  siteName?: string;        // Optional: Name of the current site, to be displayed possibly in Header or SecondarySidebar
  currentSiteIdentifier?: string;   // Optional: ID of the current site, can be used for dynamic links or data fetching within layout
  navItems?: NavItem[];     // Optional: Navigation items specific to the current site/context for SecondarySidebar
  onNewContent?: () => void; // Optional: Function to call when the New button is clicked in the secondary sidebar
  secondarySidebar?: React.ReactNode; // Optional: Custom secondary sidebar component
}

export function DashboardLayout({
  children,
  siteName,
  currentSiteIdentifier, // Renamed from currentSiteId
  navItems = [],   // Default to an empty array if no navItems are provided
  onNewContent,
  secondarySidebar,
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950"> {/* Updated background color */}
      <Header
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        siteName={siteName} // Pass siteName to Header if it can display it
        // You might also pass currentSiteIdentifier if Header needs it for some links
      />

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" // Simplified classes
                placeholder="Search..."
              />
            </div>
            <Button
              variant="ghost"
              size="icon" // Changed to icon for a smaller button
              className="ml-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="space-y-1">
            {/* Render dynamic navItems in mobile menu if provided */}
            {navItems.length > 0 ? (
              navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href} // Consider using <Link href={item.href}> from wouter for client-side nav
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {item.icon && <item.icon className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />}
                  {item.name}
                </a>
              ))
            ) : (
              <>
                {/* Fallback or default mobile nav items */}
                <a href="/sites" className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-700/20">
                  Sites Dashboard
                </a>
                {/* Add other general mobile navigation links here if necessary */}
              </>
            )}
          </nav>
        </div>
      )}

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Main Sidebar - always shown on desktop, potentially always collapsed */}
        {!isMobile && (
          <div className="w-12 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <MainSidebar collapsed={true} currentSiteIdentifier={currentSiteIdentifier} />
          </div>
        )}
        
        {/* Secondary Sidebar - shown on desktop, receives site-specific nav items */}
        {!isMobile && (
          <div className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            {secondarySidebar || (
              <SecondarySidebar 
                siteName={siteName} 
                navItems={navItems} 
                currentSiteIdentifier={currentSiteIdentifier} 
                onNewContent={onNewContent}
              />
            )}
          </div>
        )}
        
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 min-h-[calc(100vh-4rem)]"> {/* Changed main content background */}
          <motion.div
            key={location}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="h-full w-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}