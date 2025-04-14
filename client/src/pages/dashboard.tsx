import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { OverviewCard } from "@/components/dashboard/overview-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { ActivityItem } from "@/components/dashboard/activity-item";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Download,
  BarChart4,
  DollarSign,
  Users,
  FileText
} from "lucide-react";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Keep track of your business performance and analytics
          </p>
        </div>

        {/* Overview Cards */}
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <OverviewCard
              title="Total Revenue"
              value="$45,231.89"
              icon={<DollarSign className="h-6 w-6 text-primary" />}
              bgColor="bg-primary-50"
            />
            <OverviewCard
              title="New Customers"
              value="1,257"
              icon={<Users className="h-6 w-6 text-emerald-500" />}
              bgColor="bg-emerald-50"
            />
            <OverviewCard
              title="Active Orders"
              value="329"
              icon={<FileText className="h-6 w-6 text-red-500" />}
              bgColor="bg-red-50"
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <ChartCard title="Revenue Growth" type="bar" />
            <ChartCard title="Customer Acquisition" type="line" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
                <div>
                  <Button variant="secondary-gray" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              <ActivityItem
                icon={<Users className="h-5 w-5 text-primary-600" />}
                title="New customer registered"
                description="Jane Cooper (jane@example.com)"
                time="5 min ago"
                iconBgColor="bg-primary-100"
              />
              <ActivityItem
                icon={<svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>}
                title="New order completed"
                description="Order #12354 for $96.72"
                time="1 hour ago"
                iconBgColor="bg-emerald-100"
              />
              <ActivityItem
                icon={<svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>}
                title="Payment failed"
                description="Invoice #INV-1234 for $350.00"
                time="3 hours ago"
                iconBgColor="bg-red-100"
              />
            </ul>
            <div className="bg-gray-50 dark:bg-gray-800 px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
              <div className="flex-1 flex justify-between">
                <Button variant="secondary-gray" size="sm">
                  Previous
                </Button>
                <Button variant="secondary-gray" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
