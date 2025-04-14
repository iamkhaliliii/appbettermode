import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  ChevronDown,
  Users,
  Eye,
  MousePointerClick,
  Clock
} from "lucide-react";

export default function Analytics() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Monitor performance and track engagement metrics
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="secondary-gray" size="sm" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <Calendar className="h-4 w-4 mr-1" />
              Last 30 days
              <ChevronDown className="h-3 w-3 ml-1 opacity-60" />
            </Button>
            
            <Button variant="secondary-gray" size="sm" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <ChevronDown className="h-3 w-3 opacity-60" />
              Export
            </Button>
          </div>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <MetricCard 
            title="Total Visitors"
            value="35,897"
            change="+12.5%"
            changeType="positive"
            icon={<Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />}
          />
          
          <MetricCard 
            title="Page Views"
            value="458,290"
            change="+18.2%"
            changeType="positive"
            icon={<Eye className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
          />
          
          <MetricCard 
            title="Conversion Rate"
            value="3.24%"
            change="-0.5%"
            changeType="negative"
            icon={<MousePointerClick className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
          />
          
          <MetricCard 
            title="Avg. Session"
            value="2m 56s"
            change="+7.3%"
            changeType="positive"
            icon={<Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-medium">Traffic Overview</CardTitle>
              <div className="flex gap-2">
                <Button variant="secondary-gray" size="sm" className="text-xs font-medium bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  Weekly
                </Button>
                <Button variant="secondary-color" size="sm" className="text-xs font-medium">
                  Monthly
                </Button>
                <Button variant="secondary-gray" size="sm" className="text-xs font-medium bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  Yearly
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full flex items-center justify-center bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="text-center">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Traffic visualization
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-medium">Conversion Trends</CardTitle>
              <div className="flex gap-2">
                <Button variant="secondary-gray" size="sm" className="text-xs font-medium bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  Weekly
                </Button>
                <Button variant="secondary-color" size="sm" className="text-xs font-medium">
                  Monthly
                </Button>
                <Button variant="secondary-gray" size="sm" className="text-xs font-medium bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  Yearly
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full flex items-center justify-center bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Conversion visualization
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Traffic sources */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg font-medium">Traffic Sources</CardTitle>
            <Button variant="secondary-gray" size="sm" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left font-medium p-3 text-gray-500 dark:text-gray-400">Source</th>
                    <th className="text-right font-medium p-3 text-gray-500 dark:text-gray-400">Visitors</th>
                    <th className="text-right font-medium p-3 text-gray-500 dark:text-gray-400">Page Views</th>
                    <th className="text-right font-medium p-3 text-gray-500 dark:text-gray-400">Bounce Rate</th>
                    <th className="text-right font-medium p-3 text-gray-500 dark:text-gray-400">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-900 dark:text-white">Google</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">15,742</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">135,246</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">32.5%</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">4.8%</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-900 dark:text-white">Direct</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">8,541</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">76,142</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">22.7%</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">6.2%</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-900 dark:text-white">Social</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">6,875</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">65,489</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">45.1%</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">2.3%</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-3 text-gray-900 dark:text-white">Email</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">3,259</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">28,764</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">18.3%</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">7.5%</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-gray-900 dark:text-white">Referral</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">1,485</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">12,547</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">27.9%</td>
                    <td className="p-3 text-right text-gray-700 dark:text-gray-300">3.9%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
}

function MetricCard({ title, value, change, changeType, icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{value}</p>
          </div>
          <div className="bg-primary-50 dark:bg-primary-900/20 p-2 rounded-md">
            {icon}
          </div>
        </div>
        <div className="mt-3">
          <span className={`text-xs font-medium ${
            changeType === 'positive' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {change}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">vs last period</span>
        </div>
      </CardContent>
    </Card>
  );
}