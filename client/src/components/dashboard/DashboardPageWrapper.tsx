import { ReactNode, useEffect, useState, Suspense } from "react";
import { AlertTriangle } from "lucide-react";
import { DashboardLayout } from "@/components/layout/dashboard/dashboard-layout";
import { useSiteData } from "../../lib/SiteDataContext";
import { Site } from "@/lib/api";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { motion, AnimatePresence } from "framer-motion";

interface DashboardPageWrapperProps {
  children: ReactNode;
  siteSD: string;
  requireSite?: boolean;
  secondarySidebar?: ReactNode;
  onNewContent?: () => void;
}

export function DashboardPageWrapper({ 
  children, 
  siteSD,
  requireSite = true,
  secondarySidebar,
  onNewContent
}: DashboardPageWrapperProps) {
  const { loadSite, sites, isLoading: contextIsLoading } = useSiteData();
  const [siteDetails, setSiteDetails] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Fetch site data when needed
  useEffect(() => {
    const fetchSiteData = async () => {
      if (!siteSD) {
        if (requireSite) {
          setSiteDetails(null);
          setError("No site identifier provided.");
        }
        setIsLoading(false);
        setIsFirstLoad(false);
        return;
      }

      if (!requireSite) {
        setIsLoading(false);
        setIsFirstLoad(false);
        return;
      }

      // Only show loading state on first load or when siteSD changes
      // This prevents full page reloads during navigation
      if (isFirstLoad || !sites[siteSD]) {
        setIsLoading(true);
      }
      
      setError(null);

      try {
        // Check if site is already in context
        if (sites[siteSD]) {
          setSiteDetails(sites[siteSD]);
          setIsLoading(false);
          setIsFirstLoad(false);
          return;
        }
        
        // Load site data (will be cached in context)
        const data = await loadSite(siteSD);
        if (data) {
          setSiteDetails(data);
        } else {
          setError("Could not load site data.");
        }
      } catch (err: any) {
        const errorMessage = err instanceof Error ? err.message : 
          "An unexpected error occurred while fetching site data.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        setIsFirstLoad(false);
      }
    };

    fetchSiteData();
  }, [siteSD, sites, loadSite, requireSite, isFirstLoad]);

  const pageIsLoading = isLoading || contextIsLoading;

  // Show skeleton loader on first load
  if (pageIsLoading && isFirstLoad) {
    return (
      <DashboardSkeleton 
        siteSD={siteSD} 
        withSidebar={!!secondarySidebar}
      />
    );
  }

  if (error && requireSite) {
    return (
      <DashboardLayout currentSiteIdentifier={siteSD} siteName="Error">
        <div className="max-w-2xl mx-auto p-4 my-8 text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-red-700 dark:text-red-400">Error Loading Site</h1>
          <p className="mt-2 text-md text-gray-600 dark:text-gray-400">{error}</p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">Identifier: {siteSD}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!siteDetails && requireSite) {
    return (
      <DashboardLayout currentSiteIdentifier={siteSD} siteName="Site Not Found">
        <div className="max-w-2xl mx-auto p-4 my-8 text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-yellow-700 dark:text-yellow-400">Site Not Available</h1>
          <p className="mt-2 text-md text-gray-600 dark:text-gray-400">
            Could not load details for the specified site. It may not exist or there was an issue retrieving its data.
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">Identifier: {siteSD}</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      currentSiteIdentifier={siteDetails?.id || siteSD} 
      siteName={siteDetails?.name || "Dashboard"}
      secondarySidebar={secondarySidebar}
      onNewContent={onNewContent}
    >
      <Suspense fallback={
        <div className="p-4 animate-pulse">
          <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      }>
        <AnimatePresence mode="wait">
          <motion.div
            key={siteSD}
            initial={{ opacity: pageIsLoading ? 0 : 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </Suspense>
    </DashboardLayout>
  );
} 