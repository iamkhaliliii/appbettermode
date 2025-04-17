import { useState, useEffect } from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription,
  DrawerFooter 
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { NotificationData } from "@/lib/dashboard-data";
import { getNotifications } from "@/lib/dashboard-data";
import { ChevronRight, MessageSquare, ThumbsUp, UserPlus, AtSign, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationItem = ({ notification }: { notification: NotificationData }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'post':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'reaction':
        return <ThumbsUp className="h-4 w-4 text-purple-500" />;
      case 'join':
        return <UserPlus className="h-4 w-4 text-emerald-500" />;
      case 'mention':
        return <AtSign className="h-4 w-4 text-orange-500" />;
      case 'system':
        return <Bell className="h-4 w-4 text-gray-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className={`p-3 border-b border-gray-100 dark:border-gray-700 ${!notification.read ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <img
            src={notification.avatar}
            alt={notification.username}
            className="h-8 w-8 rounded-full"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
              {notification.username}
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
              {notification.time}
            </span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
            <span className="flex items-center gap-1">
              <span className="inline-block mr-1">{getIcon()}</span>
              <span>
                <span className="font-normal">{notification.action} </span>
                <span className="font-medium">{notification.target}</span>
                {notification.space && (
                  <span className="text-gray-500 dark:text-gray-400"> in <span className="font-medium text-gray-700 dark:text-gray-300">{notification.space}</span></span>
                )}
              </span>
            </span>
          </p>
        </div>
        <div className="flex-shrink-0">
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

const NotificationSkeleton = () => (
  <div className="p-3 border-b border-gray-100 dark:border-gray-700">
    <div className="flex items-start gap-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-3 w-full" />
      </div>
      <Skeleton className="h-4 w-4" />
    </div>
  </div>
);

export function NotificationDrawer({ open, onOpenChange }: NotificationDrawerProps) {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="left">
      <DrawerContent className="left-0 right-auto w-96 max-w-full rounded-r-lg border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <DrawerHeader>
          <DrawerTitle className="text-lg font-medium">Notifications</DrawerTitle>
          <DrawerDescription className="text-sm text-gray-500 dark:text-gray-400">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notifications.` 
              : "No new notifications."}
          </DrawerDescription>
        </DrawerHeader>
        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-0">
          {isLoading ? (
            <>
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </>
          ) : notifications?.length ? (
            notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Bell className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" strokeWidth={1.5} />
              <p className="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
            </div>
          )}
        </div>
        <DrawerFooter className="border-t border-gray-100 dark:border-gray-700">
          <Button variant="secondary-gray" className="w-full" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}