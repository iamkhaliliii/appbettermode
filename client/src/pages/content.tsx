import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, FileText } from "lucide-react";
import { useRoute } from "wouter";

export default function Content() {
  const [matchContent, paramsContent] = useRoute('/content/:section');
  const [matchInbox] = useRoute('/inbox');
  const [matchInboxSection, paramsInboxSection] = useRoute('/inbox/:section');
  
  // Determine section based on routes
  let section;
  
  if (matchInbox || matchInboxSection) {
    section = 'inbox';
  } else {
    section = paramsContent?.section;
  }
  
  // For the Inbox section
  if (section === 'inbox') {
    return (
      <DashboardLayout>
        <div className="px-4 md:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Inbox</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your messages and notifications</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card className="border-border dark:border-border">
              <CardHeader className="pb-5">
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Your inbox is empty. Messages will appear here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // For the Activity Hub section
  if (section === 'activity') {
    return (
      <DashboardLayout>
        <div className="px-4 md:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Activity Hub</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor recent activities and updates</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card className="border-border dark:border-border">
              <CardHeader className="pb-5">
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex items-start pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                      <div className="flex-shrink-0 w-9 h-9 mr-3 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-700 dark:text-primary-300">
                        {item % 2 === 0 ? <MessageSquare className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 dark:text-gray-200 font-medium">
                          {item % 2 === 0 ? 'New comment added' : 'Content updated'}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {item % 2 === 0 ? 'A new comment was added to a post' : 'A content page was updated'}
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                          {`${item * 2} minutes ago`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // For the default CMS view (now at root /content path)
  return (
    <DashboardLayout>
      <div className="px-4 md:px-6 py-4 md:py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">CMS Collections</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your content</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <Card className="border-border dark:border-border">
            <CardHeader className="pb-5">
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                  <h3 className="font-medium mb-2">Blog Posts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage all blog content</p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                  <h3 className="font-medium mb-2">Pages</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage website pages</p>
                </div>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                  <h3 className="font-medium mb-2">Products</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Manage product listings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}