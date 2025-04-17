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
  AtSign, Bell, Circle, CheckCircle, Settings, Search,
  Filter, CheckCircle2, BookOpen, Database, LayoutDashboard,
  Users, Boxes, Calendar, FileText, ClipboardCheck, FormInput,
  Check
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      case 'report':
        return <FileText className="h-3 w-3 text-red-500" />;
      case 'rsvp':
        return <Calendar className="h-3 w-3 text-indigo-500" />;
      case 'form':
        return <FormInput className="h-3 w-3 text-amber-500" />;
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
                
                {notification.cmsType && (
                  <span className="text-[10px] px-1.5 py-0 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full inline-flex items-center">
                    <Database className="h-2 w-2 mr-0.5 text-gray-400" />
                    {notification.cmsType}
                  </span>
                )}
                
                {notification.space && (
                  <span className="text-[10px] px-1.5 py-0 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 rounded-full inline-flex items-center">
                    <Boxes className="h-2 w-2 mr-0.5 text-purple-400" />
                    {notification.space}
                  </span>
                )}
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

type FilterCategory = 'status' | 'type' | 'space' | 'cms' | 'time';

export function NotificationDrawer({ open, onOpenChange }: NotificationDrawerProps) {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
  
  // Filter states
  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [activeTypeFilter, setActiveTypeFilter] = useState<string | null>(null);
  const [activeSpaceFilter, setActiveSpaceFilter] = useState<string | null>(null);
  const [activeCmsFilter, setActiveCmsFilter] = useState<string | null>(null);
  const [activeTimeFilter, setActiveTimeFilter] = useState<string | null>(null);
  
  // UI state
  const [activeFilterCategory, setActiveFilterCategory] = useState<FilterCategory>('status');
  const [showFilters, setShowFilters] = useState(false);
  
  // Handle marking all as read
  const markAllAsRead = () => {
    // This would be a mutation in a real app
    console.log("Marking all as read");
  };
  
  // Apply filters to notifications
  const filteredNotifications = useMemo(() => {
    if (!notifications) return [];
    
    return notifications.filter(notification => {
      // Apply read/unread filter
      if (activeStatusFilter === 'unread' && notification.read) return false;
      if (activeStatusFilter === 'read' && !notification.read) return false;
      
      // Apply type filter
      if (activeTypeFilter && notification.type !== activeTypeFilter) return false;
      
      // Apply space filter
      if (activeSpaceFilter && notification.space !== activeSpaceFilter) return false;
      
      // Apply CMS filter
      if (activeCmsFilter && notification.cmsType !== activeCmsFilter) return false;
      
      // Apply time filter
      if (activeTimeFilter && notification.timeCategory !== activeTimeFilter) return false;
      
      return true;
    });
  }, [notifications, activeStatusFilter, activeTypeFilter, activeSpaceFilter, activeCmsFilter, activeTimeFilter]);

  // Organize notifications into time-based groups
  const groupedByTime = useMemo(() => {
    if (!filteredNotifications.length) return {};
    
    const timeGroups: Record<string, NotificationData[]> = {
      'Today': [],
      'Yesterday': [],
      'This Week': [],
      'Last Week': [],
      'This Month': [],
      'Older': []
    };
    
    filteredNotifications.forEach(notification => {
      switch (notification.timeCategory) {
        case 'today':
          timeGroups['Today'].push(notification);
          break;
        case 'yesterday':
          timeGroups['Yesterday'].push(notification);
          break;
        case 'this_week':
          timeGroups['This Week'].push(notification);
          break;
        case 'last_week':
          timeGroups['Last Week'].push(notification);
          break;
        case 'this_month':
          timeGroups['This Month'].push(notification);
          break;
        case 'older':
          timeGroups['Older'].push(notification);
          break;
      }
    });
    
    // Remove empty groups
    return Object.fromEntries(Object.entries(timeGroups).filter(([_, notifications]) => notifications.length > 0));
  }, [filteredNotifications]);
  
  // Calculate counts
  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  
  // Extract available options for filters
  const availableTypes = useMemo(() => {
    if (!notifications) return [];
    const types = new Set<string>();
    notifications.forEach(n => types.add(n.type));
    return Array.from(types);
  }, [notifications]);
  
  const availableSpaces = useMemo(() => {
    if (!notifications) return [];
    const spaces = new Set<string>();
    notifications.forEach(n => {
      if (n.space) spaces.add(n.space);
    });
    return Array.from(spaces);
  }, [notifications]);
  
  const availableCmsTypes = useMemo(() => {
    if (!notifications) return [];
    const cmsTypes = new Set<string>();
    notifications.forEach(n => {
      if (n.cmsType) cmsTypes.add(n.cmsType);
    });
    return Array.from(cmsTypes);
  }, [notifications]);
  
  const timePeriods: Record<string, string> = {
    'today': 'Today',
    'yesterday': 'Yesterday',
    'this_week': 'This Week',
    'last_week': 'Last Week',
    'this_month': 'This Month',
    'older': 'Older'
  };
  
  // Helper to get filter count
  const getFilterCount = () => {
    let count = 0;
    if (activeStatusFilter !== 'all') count++;
    if (activeTypeFilter) count++;
    if (activeSpaceFilter) count++;
    if (activeCmsFilter) count++;
    if (activeTimeFilter) count++;
    return count;
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setActiveStatusFilter('all');
    setActiveTypeFilter(null);
    setActiveSpaceFilter(null);
    setActiveCmsFilter(null);
    setActiveTimeFilter(null);
  };
  
  // Get type icon
  const getTypeIconComponent = (type: string) => {
    switch (type) {
      case 'post':
        return <Database className="h-3.5 w-3.5 mr-1.5 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="h-3.5 w-3.5 mr-1.5 text-green-500" />;
      case 'reaction':
        return <ThumbsUp className="h-3.5 w-3.5 mr-1.5 text-purple-500" />;
      case 'join':
        return <UserPlus className="h-3.5 w-3.5 mr-1.5 text-emerald-500" />;
      case 'mention':
        return <AtSign className="h-3.5 w-3.5 mr-1.5 text-orange-500" />;
      case 'report':
        return <FileText className="h-3.5 w-3.5 mr-1.5 text-red-500" />;
      case 'rsvp':
        return <Calendar className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />;
      case 'form':
        return <FormInput className="h-3.5 w-3.5 mr-1.5 text-amber-500" />;
      case 'system':
        return <Bell className="h-3.5 w-3.5 mr-1.5 text-gray-500" />;
      default:
        return null;
    }
  };
  
  // Show active filters as a summary
  const renderActiveFilters = () => {
    const filters = [];
    
    if (activeStatusFilter !== 'all') {
      filters.push(
        <Badge 
          key="status" 
          variant="outline" 
          className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
        >
          <span className="flex items-center">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            {activeStatusFilter === 'unread' ? 'Unread' : 'Read'}
          </span>
        </Badge>
      );
    }
    
    if (activeTypeFilter) {
      filters.push(
        <Badge 
          key="type" 
          variant="outline" 
          className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
        >
          <span className="flex items-center">
            {getTypeIconComponent(activeTypeFilter)}
            {activeTypeFilter.charAt(0).toUpperCase() + activeTypeFilter.slice(1)}
          </span>
        </Badge>
      );
    }
    
    if (activeSpaceFilter) {
      filters.push(
        <Badge 
          key="space" 
          variant="outline" 
          className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
        >
          <span className="flex items-center">
            <Boxes className="h-3 w-3 mr-1" />
            {activeSpaceFilter}
          </span>
        </Badge>
      );
    }
    
    if (activeCmsFilter) {
      filters.push(
        <Badge 
          key="cms" 
          variant="outline" 
          className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
        >
          <span className="flex items-center">
            <Database className="h-3 w-3 mr-1" />
            {activeCmsFilter}
          </span>
        </Badge>
      );
    }
    
    if (activeTimeFilter) {
      filters.push(
        <Badge 
          key="time" 
          variant="outline" 
          className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"
        >
          <span className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {timePeriods[activeTimeFilter]}
          </span>
        </Badge>
      );
    }
    
    return filters;
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="right-0 left-auto w-full sm:w-[350px] max-w-full rounded-l-lg border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 h-full">
        <DrawerHeader className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/80 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-1 h-7 w-7"
              onClick={() => onOpenChange(false)}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <DrawerTitle className="text-base font-medium flex items-center">
              <Bell className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
              Inbox
              {unreadCount > 0 && (
                <span className="ml-2 h-5 min-w-5 px-1 flex items-center justify-center text-[10px] font-medium bg-blue-500 text-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </DrawerTitle>
          </div>
          <div className="flex items-center space-x-1">
            <Button 
              variant="secondary-gray"
              size="sm"
              className="h-7 px-2 text-xs rounded-md"
              onClick={markAllAsRead}
              title="Mark all as read"
            >
              <Check className="h-3 w-3 mr-1.5" />
              <span>Read all</span>
            </Button>
            
            <Button
              variant={getFilterCount() > 0 ? "secondary-color" : "ghost"}
              size="icon"
              className="h-7 w-7 relative"
              onClick={() => setShowFilters(!showFilters)}
              title="Filter notifications"
            >
              <Filter className="h-3.5 w-3.5" />
              {getFilterCount() > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-[9px] font-semibold flex items-center justify-center rounded-full">
                  {getFilterCount()}
                </span>
              )}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Settings className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs">Notification Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-xs">
                  <span className="flex items-center">
                    <Bell className="h-3.5 w-3.5 mr-1.5" />
                    Configure notification preferences
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs" onClick={markAllAsRead}>
                  <span className="flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                    Mark all as read
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DrawerHeader>
        
        {/* Active filters display */}
        {getFilterCount() > 0 && (
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-gray-50/70 to-blue-50/20 dark:from-gray-800/40 dark:to-blue-900/10">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Filter className="h-3 w-3 mr-1.5 text-gray-400" />
                Active filters
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-5 text-[10px] px-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                onClick={clearAllFilters}
              >
                Clear all
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {renderActiveFilters()}
            </div>
          </div>
        )}
        
        {/* Filter UI */}
        {showFilters && (
          <div className="border-b border-gray-200 dark:border-gray-700">
            <Tabs 
              defaultValue="status" 
              value={activeFilterCategory}
              onValueChange={(value) => setActiveFilterCategory(value as FilterCategory)}
              className="w-full"
            >
              <div className="px-3 pt-2">
                <TabsList className="w-full h-7 bg-gray-100 dark:bg-gray-700/80 grid grid-cols-5 rounded-[0.4rem] p-0.5">
                  <TabsTrigger value="status" className="text-[10px] h-6 rounded-[0.3rem] px-1 py-0">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Status
                  </TabsTrigger>
                  <TabsTrigger value="type" className="text-[10px] h-6 rounded-[0.3rem] px-1 py-0">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Type
                  </TabsTrigger>
                  <TabsTrigger value="space" className="text-[10px] h-6 rounded-[0.3rem] px-1 py-0">
                    <Boxes className="h-3 w-3 mr-1" />
                    Space
                  </TabsTrigger>
                  <TabsTrigger value="cms" className="text-[10px] h-6 rounded-[0.3rem] px-1 py-0">
                    <Database className="h-3 w-3 mr-1" />
                    CMS
                  </TabsTrigger>
                  <TabsTrigger value="time" className="text-[10px] h-6 rounded-[0.3rem] px-1 py-0">
                    <Calendar className="h-3 w-3 mr-1" />
                    Time
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="p-3">
                {activeFilterCategory === 'status' && (
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant={activeStatusFilter === 'all' ? 'secondary-gray' : 'ghost'}
                      size="sm"
                      className="h-8 text-xs rounded-md flex justify-center items-center"
                      onClick={() => setActiveStatusFilter('all')}
                    >
                      <span className="flex items-center justify-center">
                        <Bell className="h-3.5 w-3.5 mr-2 text-gray-500" />
                        All
                      </span>
                    </Button>
                    <Button
                      variant={activeStatusFilter === 'unread' ? 'secondary-gray' : 'ghost'}
                      size="sm"
                      className="h-8 text-xs rounded-md flex justify-center items-center"
                      onClick={() => setActiveStatusFilter('unread')}
                    >
                      <span className="flex items-center justify-center">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-blue-500" />
                        Unread
                        {unreadCount > 0 && (
                          <span className="ml-1.5 h-4 min-w-4 px-1 flex items-center justify-center text-[10px] font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </span>
                    </Button>
                    <Button
                      variant={activeStatusFilter === 'read' ? 'secondary-gray' : 'ghost'}
                      size="sm"
                      className="h-8 text-xs rounded-md flex justify-center items-center"
                      onClick={() => setActiveStatusFilter('read')}
                    >
                      <span className="flex items-center justify-center">
                        <Check className="h-3.5 w-3.5 mr-2 text-green-500" />
                        Read
                      </span>
                    </Button>
                  </div>
                )}
                
                {activeFilterCategory === 'type' && (
                  <div>
                    <div className="mb-2">
                      <Button
                        variant={activeTypeFilter === null ? 'secondary-gray' : 'ghost'}
                        size="sm"
                        className="h-6 text-xs w-full justify-start"
                        onClick={() => setActiveTypeFilter(null)}
                      >
                        <Bell className="h-3.5 w-3.5 mr-2" />
                        All types
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {availableTypes.map(type => (
                        <Button
                          key={type}
                          variant={activeTypeFilter === type ? 'secondary-gray' : 'ghost'}
                          size="sm"
                          className="h-8 text-xs rounded-md justify-start"
                          onClick={() => setActiveTypeFilter(activeTypeFilter === type ? null : type)}
                        >
                          <span className="flex items-center">
                            {getTypeIconComponent(type)}
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeFilterCategory === 'space' && (
                  <div className="space-y-2">
                    <Button
                      variant={activeSpaceFilter === null ? 'secondary-gray' : 'ghost'}
                      size="sm"
                      className="h-6 text-xs w-full justify-start"
                      onClick={() => setActiveSpaceFilter(null)}
                    >
                      <Boxes className="h-3.5 w-3.5 mr-2" />
                      All spaces
                    </Button>
                    <div className="max-h-40 overflow-y-auto pr-1 space-y-1">
                      {availableSpaces.map(space => (
                        <Button
                          key={space}
                          variant={activeSpaceFilter === space ? 'secondary-gray' : 'ghost'}
                          size="sm"
                          className="h-7 text-xs w-full justify-start"
                          onClick={() => setActiveSpaceFilter(activeSpaceFilter === space ? null : space)}
                        >
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300">
                            <Boxes className="h-3 w-3 mr-1.5 text-purple-400" />
                            {space}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeFilterCategory === 'cms' && (
                  <div className="space-y-2">
                    <Button
                      variant={activeCmsFilter === null ? 'secondary-gray' : 'ghost'}
                      size="sm"
                      className="h-6 text-xs w-full justify-start"
                      onClick={() => setActiveCmsFilter(null)}
                    >
                      <Database className="h-3.5 w-3.5 mr-2" />
                      All CMS types
                    </Button>
                    <div className="max-h-40 overflow-y-auto pr-1 space-y-1">
                      {availableCmsTypes.map(cmsType => (
                        <Button
                          key={cmsType}
                          variant={activeCmsFilter === cmsType ? 'secondary-gray' : 'ghost'}
                          size="sm"
                          className="h-7 text-xs w-full justify-start"
                          onClick={() => setActiveCmsFilter(activeCmsFilter === cmsType ? null : cmsType)}
                        >
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <Database className="h-3 w-3 mr-1.5 text-gray-400" />
                            {cmsType}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeFilterCategory === 'time' && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={activeTimeFilter === null ? 'secondary-gray' : 'ghost'}
                      size="sm"
                      className="h-7 text-xs col-span-2 justify-start"
                      onClick={() => setActiveTimeFilter(null)}
                    >
                      <Calendar className="h-3.5 w-3.5 mr-2" />
                      All time
                    </Button>
                    {Object.entries(timePeriods).map(([value, label]) => (
                      <Button
                        key={value}
                        variant={activeTimeFilter === value ? 'secondary-gray' : 'ghost'}
                        size="sm"
                        className="h-8 text-xs rounded-md justify-start"
                        onClick={() => setActiveTimeFilter(activeTimeFilter === value ? null : value)}
                      >
                        <span className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                          {label}
                        </span>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </Tabs>
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
              {Object.entries(groupedByTime).map(([title, groupNotifications]) => (
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
              {getFilterCount() > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="mt-2 text-xs h-6 px-2"
                  onClick={clearAllFilters}
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