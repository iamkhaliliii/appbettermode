import { useState, useEffect } from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerFooter 
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { NotificationData } from "@/lib/dashboard-data";
import { getNotifications } from "@/lib/dashboard-data";
import { 
  ChevronRight, MessageSquare, ThumbsUp, UserPlus, 
  AtSign, Bell, Circle, ChevronLeft, MoreVertical, Search
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NotificationGroupProps {
  title: string;
  notifications: NotificationData[];
}

const NotificationItem = ({ notification }: { notification: NotificationData }) => {
  // Based on the screenshot layout
  return (
    <div className={`py-3 px-4 border-b border-gray-100 dark:border-gray-700 ${!notification.read ? 'bg-gray-50/50 dark:bg-gray-800/30' : ''}`}>
      {/* User avatar on the left */}
      <div className="flex items-start mb-1.5">
        <div className="flex-shrink-0 mr-3">
          <img
            src={notification.avatar}
            alt={notification.username}
            className="h-6 w-6 rounded-full"
          />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-900 dark:text-gray-100 leading-tight">
            <span className="font-medium">{notification.username}</span> {notification.action}
          </p>
          <div className="flex items-center mt-1">
            <Circle className="h-2 w-2 mr-1.5 text-gray-400" fill="currentColor" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {notification.target}
            </span>
          </div>
          
          {/* Owner section if needed */}
          {notification.space && (
            <div className="mt-2 pl-0.5">
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <svg className="h-3.5 w-3.5 mr-1 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12.75C8.83 12.75 6.25 10.17 6.25 7C6.25 3.83 8.83 1.25 12 1.25C15.17 1.25 17.75 3.83 17.75 7C17.75 10.17 15.17 12.75 12 12.75ZM12 2.75C9.66 2.75 7.75 4.66 7.75 7C7.75 9.34 9.66 11.25 12 11.25C14.34 11.25 16.25 9.34 16.25 7C16.25 4.66 14.34 2.75 12 2.75Z" fill="currentColor"/>
                  <path d="M20.5901 22.75C20.1801 22.75 19.8401 22.41 19.8401 22C19.8401 18.55 16.3601 15.75 12.0001 15.75C7.64012 15.75 4.16012 18.55 4.16012 22C4.16012 22.41 3.82012 22.75 3.41012 22.75C3.00012 22.75 2.66012 22.41 2.66012 22C2.66012 17.73 6.85012 14.25 12.0001 14.25C17.1501 14.25 21.3401 17.73 21.3401 22C21.3401 22.41 21.0001 22.75 20.5901 22.75Z" fill="currentColor"/>
                </svg>
                Owner
              </div>
              <div className="flex items-center mt-1">
                <img
                  src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Owner"
                  className="h-5 w-5 rounded-full mr-1"
                />
                <span className="text-sm text-gray-800 dark:text-gray-200">
                  Amir Khalili
                </span>
              </div>
            </div>
          )}
          
          {/* Comment content if present */}
          {notification.type === 'comment' && notification.commentContent && (
            <div className="mt-2 pl-0 border-l-2 border-yellow-400 dark:border-yellow-600 pl-2">
              {notification.mentionedUser && (
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">@{notification.mentionedUser}</span>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {notification.commentContent}
              </p>
              <div className="flex items-center mt-1.5 space-x-2">
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5">
                  <ThumbsUp className="h-3 w-3 mr-1 text-blue-500" />
                  <span className="text-xs text-gray-600 dark:text-gray-300">1</span>
                </div>
                <div className="flex items-center">
                  <Search className="h-3 w-3 text-gray-400" />
                </div>
              </div>
              <Button variant="ghost" className="h-7 px-3 py-1 mt-1 text-xs">Reply</Button>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 ml-2 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {notification.date || notification.time}
        </div>
      </div>
    </div>
  );
};

const NotificationGroup = ({ title, notifications }: NotificationGroupProps) => {
  return (
    <div>
      <div className="px-4 py-2 bg-gray-50/80 dark:bg-gray-800/50 border-y border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      </div>
      <div>
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
};

const NotificationSkeleton = () => (
  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
    <div className="flex items-start gap-3">
      <Skeleton className="h-6 w-6 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-3 w-full mb-2" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
  </div>
);

export function NotificationDrawer({ open, onOpenChange }: NotificationDrawerProps) {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  // Group notifications by time period
  const groupedNotifications = () => {
    if (!notifications) return {};
    
    const groups: Record<string, NotificationData[]> = {
      'Bettermode Swags': [],
      'Last week': [],
      'Older': []
    };
    
    notifications.forEach(notification => {
      if (notification.id === 'notification-1') {
        groups['Bettermode Swags'].push(notification);
      } else if (['notification-2', 'notification-3', 'notification-4'].includes(notification.id)) {
        groups['Last week'].push(notification);
      } else {
        groups['Older'].push(notification);
      }
    });
    
    return groups;
  };
  
  const groups = groupedNotifications();

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="left">
      <DrawerContent className="left-0 right-auto w-full sm:w-[420px] max-w-full rounded-r-lg border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-full">
        <DrawerHeader className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-1 h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <DrawerTitle className="text-lg font-medium">Inbox</DrawerTitle>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </DrawerHeader>
        
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
          {isLoading ? (
            <>
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </>
          ) : notifications?.length ? (
            <>
              {Object.entries(groups).map(([title, groupNotifications]) => (
                groupNotifications.length > 0 && (
                  <NotificationGroup 
                    key={title} 
                    title={title} 
                    notifications={groupNotifications} 
                  />
                )
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Bell className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" strokeWidth={1.5} />
              <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}