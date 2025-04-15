import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation, useRoute } from "wouter";
import { useEffect } from "react";

export default function Settings() {
  const [location, setLocation] = useLocation();
  const [, params] = useRoute('/settings/:section');
  const section = params?.section;

  // Redirect to the first tab (my-details) if we're at the root settings route
  useEffect(() => {
    if (location === '/settings') {
      setLocation('/settings/my-details');
    }
  }, [location, setLocation]);

  // If we're at the root settings URL, show a loading state until the redirect happens
  if (location === '/settings') {
    return <DashboardLayout><div className="p-8">Loading settings...</div></DashboardLayout>;
  }
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input 
                        id="firstName"
                        placeholder="First name"
                        className="bg-white dark:bg-gray-800"
                        defaultValue="Olivia"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input 
                        id="lastName"
                        placeholder="Last name"
                        className="bg-white dark:bg-gray-800"
                        defaultValue="Rhye"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="Email address"
                      className="bg-white dark:bg-gray-800"
                      defaultValue="olivia@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input 
                      id="role"
                      placeholder="Role"
                      className="bg-white dark:bg-gray-800"
                      defaultValue="Administrator"
                    />
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button variant="default">Save changes</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Password</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current password</Label>
                    <Input 
                      id="currentPassword"
                      type="password"
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New password</Label>
                      <Input 
                        id="newPassword"
                        type="password"
                        className="bg-white dark:bg-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm password</Label>
                      <Input 
                        id="confirmPassword"
                        type="password"
                        className="bg-white dark:bg-gray-800"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button variant="default">Update password</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Account Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Language</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">English (United States)</p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Time Zone</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pacific Standard Time (PST)</p>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Not enabled</p>
                  </div>
                  
                  <div className="pt-4">
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}