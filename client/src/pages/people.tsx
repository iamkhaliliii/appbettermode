import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function People() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">People</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage users, staff members, and permissions
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center py-12">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">People Management</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Use the sidebar to navigate to specific sections.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}