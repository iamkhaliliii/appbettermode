import { Skeleton } from "@/components/ui/primitives";
import { DashboardLayout } from "@/components/layout/dashboard/dashboard-layout";

interface DashboardSkeletonProps {
  siteSD: string;
  withSidebar?: boolean;
}

export function DashboardSkeleton({ siteSD, withSidebar = false }: DashboardSkeletonProps) {
  return (
    <DashboardLayout currentSiteIdentifier={siteSD} siteName="Loading...">
      <div className="w-full h-full p-4">
        <div className="flex flex-col space-y-4">
          {/* Header skeleton */}
          <div className="flex justify-between">
            <div className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-md mr-4" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <div className="flex space-x-2">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
          
          {/* Content area skeleton */}
          <div className="flex h-full mt-4">
            {/* Secondary sidebar if needed */}
            {withSidebar && (
              <div className="w-64 flex-shrink-0 mr-8">
                <Skeleton className="h-12 w-full rounded-md mb-4" />
                <div className="space-y-2">
                  {Array(8).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full rounded-md" />
                  ))}
                </div>
              </div>
            )}
            
            {/* Main content area */}
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <Skeleton className="h-6 w-6 rounded-full mr-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-24 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 