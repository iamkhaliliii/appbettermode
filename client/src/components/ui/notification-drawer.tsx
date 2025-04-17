import React, { useState, useEffect, useMemo } from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerFooter, 
  DrawerDescription
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { NotificationData } from "@/lib/dashboard-data";
import { getNotifications } from "@/lib/dashboard-data";
import { 
  ChevronRight, MessageSquare, ThumbsUp, UserPlus, 
  AtSign, Bell, Circle, ChevronLeft, MoreVertical, Search,
  Filter, CheckCircle2, BookOpen, Database, LayoutDashboard,
  Users, Boxes
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface NotificationGroupProps {
  title: string;
  notifications: NotificationData[];
}

const NotificationItem = ({ notification }: { notification: NotificationData }) => {
  // Get icon based on notification type
  const getTypeIcon = () => {
    switch (notification.type) {
      case 'post':
        return <Database className="h-3 w-3 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="h-3 w-3 text-green-500" />;
      case 'reaction':
        return <ThumbsUp className="h-3 w-3 text-purple-500" />;
      case 'join':
        return <UserPlus className="h-3 w-3 text-emerald-500" />;
      case 'mention':
        return <AtSign className="h-3 w-3 text-orange-500" />;
      case 'system':
        return <Bell className="h-3 w-3 text-gray-500" />;
      default:
        return <MessageSquare className="h-3 w-3 text-gray-500" />;
    }
  };
  
  return (
    <div 
      className={cn(
        "py-2 px-3 border-b border-gray-100 dark:border-gray-700",
        !notification.read ? 'bg-blue-50/30 dark:bg-blue-900/5' : '',
        "relative"
      )}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-blue-500"></div>
      )}
      
      {/* User avatar and content */}
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-2">
          <img
            src={notification.avatar}
            alt={notification.username}
            className="h-5 w-5 rounded-full"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Main notification text - more minimal */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-900 dark:text-gray-100 leading-tight">
                <span className="font-medium">{notification.username}</span>
                {' '}
                <span className="text-gray-500 dark:text-gray-400">{notification.action}</span>
              </p>
              
              {/* Target with type and space info */}
              <div className="flex items-center mt-0.5 flex-wrap gap-1">
                <span className="text-xs text-gray-700 dark:text-gray-300">
                  {notification.target}
                </span>
                
                <div className="flex items-center gap-1 flex-wrap">
                  {notification.space && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 inline-flex items-center">
                      <span className="text-[10px] mr-0.5">in</span>
                      <Boxes className="h-2 w-2 mr-0.5 text-gray-400" />
                      {notification.space}
                    </span>
                  )}
                  
                  <span className="text-xs text-gray-400 dark:text-gray-500 inline-flex items-center">
                    {getTypeIcon()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 ml-2 text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {notification.date || notification.time}
              {!notification.read && <span className="ml-1 h-1.5 w-1.5 rounded-full bg-blue-500 inline-block"></span>}
            </div>
          </div>
          
          {/* Comment content if present */}
          {notification.type === 'comment' && notification.commentContent && (
            <div className="mt-1 border-l border-gray-200 dark:border-gray-700 pl-2">
              {notification.mentionedUser && (
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">@{notification.mentionedUser}</span>
              )}
              <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                {notification.commentContent}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const NotificationGroup = ({ title, notifications }: NotificationGroupProps) => {
  return (
    <div>
      <div className="px-3 py-1.5 bg-gray-50/60 dark:bg-gray-800/30 border-y border-gray-100 dark:border-gray-700">
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">{title}</h3>
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
  <div className="py-2 px-3 border-b border-gray-100 dark:border-gray-700">
    <div className="flex items-start gap-2">
      <Skeleton className="h-5 w-5 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-2 w-8" />
        </div>
        <Skeleton className="h-2.5 w-full mb-1" />
        <Skeleton className="h-2.5 w-2/3" />
      </div>
    </div>
  </div>
);

export function NotificationDrawer({ open, onOpenChange }: NotificationDrawerProps) {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
  
  // Filter state
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  
  // Apply filters to notifications
  const filteredNotifications = useMemo(() => {
    if (!notifications) return [];
    
    return notifications.filter(notification => {
      // Apply read/unread filter
      if (activeFilter === 'unread' && notification.read) return false;
      if (activeFilter === 'read' && !notification.read) return false;
      
      // Apply type filter
      if (typeFilter && notification.type !== typeFilter) return false;
      
      return true;
    });
  }, [notifications, activeFilter, typeFilter]);

  // Group notifications by time period
  const groupedNotifications = () => {
    if (!filteredNotifications.length) return {};
    
    const groups: Record<string, NotificationData[]> = {
      'Bettermode Swags': [],
      'Last week': [],
      'Older': []
    };
    
    filteredNotifications.forEach(notification => {
      if (notification.id === 'notification-1') {
        groups['Bettermode Swags'].push(notification);
      } else if (['notification-2', 'notification-3', 'notification-4'].includes(notification.id)) {
        groups['Last week'].push(notification);
      } else {
        groups['Older'].push(notification);
      }
    });
    
    // Remove empty groups
    return Object.fromEntries(Object.entries(groups).filter(([_, notifications]) => notifications.length > 0));
  };
  
  const groups = groupedNotifications();
  
  // Calculate counts for filter badges
  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  const readCount = notifications?.filter(n => n.read).length || 0;
  
  // Determine available notification types for filter
  const availableTypes = useMemo(() => {
    if (!notifications) return [];
    const types = new Set<string>();
    notifications.forEach(n => types.add(n.type));
    return Array.from(types);
  }, [notifications]);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="right-0 left-auto w-full sm:w-[350px] max-w-full rounded-l-lg border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-full">
        <DrawerHeader className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-1 h-7 w-7"
              onClick={() => onOpenChange(false)}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <DrawerTitle className="text-base font-medium">Inbox</DrawerTitle>
          </div>
          <div className="flex items-center space-x-1">
            <Button 
              variant={activeFilter === 'unread' ? "secondary-gray" : "ghost"} 
              size="sm" 
              className="h-7 px-2 text-xs"
              onClick={() => setActiveFilter(activeFilter === 'unread' ? 'all' : 'unread')}
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="ml-1 text-[10px] font-normal bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full px-1">
                  {unreadCount}
                </span>
              )}
            </Button>
            
            <Button
              variant={showFilterMenu ? "ghost" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter className="h-3.5 w-3.5" />
            </Button>
          </div>
        </DrawerHeader>
        
        {/* Filter menu - more minimal */}
        {showFilterMenu && (
          <div className="px-3 py-1.5 bg-gray-50/60 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-700 flex items-center flex-wrap gap-2">
            {availableTypes.map(type => (
              <Button
                key={type}
                variant={typeFilter === type ? 'secondary-gray' : 'ghost'}
                size="sm"
                className="h-6 text-xs px-2 py-0"
                onClick={() => setTypeFilter(type === typeFilter ? null : type)}
              >
                <span className="flex items-center">
                  {type === 'post' && <Database className="h-3 w-3 mr-1 text-blue-500" />}
                  {type === 'comment' && <MessageSquare className="h-3 w-3 mr-1 text-green-500" />}
                  {type === 'mention' && <AtSign className="h-3 w-3 mr-1 text-orange-500" />}
                  {type === 'reaction' && <ThumbsUp className="h-3 w-3 mr-1 text-purple-500" />}
                  {type === 'join' && <UserPlus className="h-3 w-3 mr-1 text-emerald-500" />}
                  {type === 'system' && <Bell className="h-3 w-3 mr-1 text-gray-500" />}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              </Button>
            ))}
            
            {typeFilter && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs px-2 py-0"
                onClick={() => setTypeFilter(null)}
              >
                Clear
              </Button>
            )}
          </div>
        )}
        
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">
          {isLoading ? (
            <>
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </>
          ) : filteredNotifications.length > 0 ? (
            <>
              {Object.entries(groups).map(([title, groupNotifications]) => (
                <NotificationGroup 
                  key={title} 
                  title={title} 
                  notifications={groupNotifications} 
                />
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <Bell className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-2" strokeWidth={1.5} />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(notifications?.length ?? 0) > 0 ? 'No notifications match your filters' : 'No notifications yet'}
              </p>
              {(notifications?.length ?? 0) > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="mt-2 text-xs h-6 px-2"
                  onClick={() => {
                    setActiveFilter('all');
                    setTypeFilter(null);
                  }}
                >
                  Reset filters
                </Button>
              )}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}