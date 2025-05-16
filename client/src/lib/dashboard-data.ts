export interface OverviewCardData {
  id: string;
  title: string;
  value: string;
  icon: string;
  bgColor: string;
}

export interface ChartData {
  id: string;
  title: string;
  type: 'bar' | 'line';
  data: any; // This would be replaced with appropriate chart data format
}

export interface ActivityData {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconBgColor: string;
  time: string;
}

export interface NotificationData {
  id: string;
  type: 'post' | 'comment' | 'reaction' | 'join' | 'mention' | 'report' | 'rsvp' | 'form' | 'system';
  username: string;
  action: string;
  target: string;
  space?: string;
  cmsType?: string;
  time: string;
  timeCategory: 'today' | 'yesterday' | 'this_week' | 'last_week' | 'this_month' | 'older';
  date?: string; // For showing Apr 8, etc.
  read: boolean;
  avatar: string;
  commentContent?: string;
  mentionedUser?: string;
}

// These could be populated from API calls in a real application
export const getNotifications = async (): Promise<NotificationData[]> => {
  const data = await getDashboardData();
  return data.notifications;
};

export const getDashboardData = async () => {
  return {
    overviewCards: [
      {
        id: 'revenue',
        title: 'Total Revenue',
        value: '$45,231.89',
        icon: 'dollar',
        bgColor: 'bg-primary-100'
      },
      {
        id: 'customers',
        title: 'New Customers',
        value: '1,257',
        icon: 'users',
        bgColor: 'bg-emerald-100'
      },
      {
        id: 'orders',
        title: 'Active Orders',
        value: '329',
        icon: 'fileText',
        bgColor: 'bg-red-100'
      }
    ],
    charts: [
      {
        id: 'revenue-growth',
        title: 'Revenue Growth',
        type: 'bar' as const,
        data: {}
      },
      {
        id: 'customer-acquisition',
        title: 'Customer Acquisition',
        type: 'line' as const,
        data: {}
      }
    ],
    activities: [
      {
        id: 'new-customer',
        title: 'New customer registered',
        description: 'Jane Cooper (jane@example.com)',
        icon: 'user',
        iconBgColor: 'bg-primary-100',
        time: '5 min ago'
      },
      {
        id: 'new-order',
        title: 'New order completed',
        description: 'Order #12354 for $96.72',
        icon: 'check',
        iconBgColor: 'bg-emerald-100',
        time: '1 hour ago'
      },
      {
        id: 'payment-failed',
        title: 'Payment failed',
        description: 'Invoice #INV-1234 for $350.00',
        icon: 'alert',
        iconBgColor: 'bg-red-100',
        time: '3 hours ago'
      }
    ],
    notifications: [
      // Today
      {
        id: 'notification-1',
        type: 'post' as const,
        username: 'Sarah Chen',
        action: 'posted new article in',
        target: 'UI Design 101',
        space: 'Design',
        cmsType: 'Article',
        time: '2 hours ago',
        timeCategory: 'today' as const,
        read: false,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 'notification-2',
        type: 'comment' as const,
        username: 'Alex Rodriguez',
        action: 'replied to your post in',
        target: 'Weekly Team Updates',
        space: 'Product',
        cmsType: 'Post',
        time: '4 hours ago',
        timeCategory: 'today' as const,
        read: false,
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        commentContent: 'Great progress on the dashboard project! I think we should review the analytics section again before the final release.'
      },
      {
        id: 'notification-3',
        type: 'reaction' as const,
        username: 'Emma Wilson',
        action: 'reacted to your comment in',
        target: 'Q2 Marketing Strategy',
        space: 'Marketing',
        cmsType: 'Document',
        time: '5 hours ago',
        timeCategory: 'today' as const,
        read: false,
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      
      // Yesterday
      {
        id: 'notification-4',
        type: 'mention' as const,
        username: 'Mo Malayeri',
        action: 'mentioned you in',
        target: 'Create New View - Inbox',
        space: 'Engineering',
        cmsType: 'Task',
        date: 'Yesterday',
        time: 'Yesterday at 3:45 PM',
        timeCategory: 'yesterday' as const,
        read: false,
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 'notification-5',
        type: 'report' as const,
        username: 'System',
        action: 'generated monthly report for',
        target: 'Community Engagement',
        space: 'Analytics',
        cmsType: 'Report',
        date: 'Yesterday',
        time: 'Yesterday at 11:30 AM',
        timeCategory: 'yesterday' as const,
        read: true,
        avatar: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      
      // This Week
      {
        id: 'notification-6',
        type: 'rsvp' as const,
        username: 'Michael Brown',
        action: 'confirmed attendance for',
        target: 'Design Workshop',
        space: 'Events',
        cmsType: 'Event',
        date: 'Mon',
        time: 'Monday at 9:15 AM',
        timeCategory: 'this_week' as const,
        read: true,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 'notification-7',
        type: 'form' as const,
        username: 'Jessica Lee',
        action: 'submitted form response in',
        target: 'Customer Feedback',
        space: 'Research',
        cmsType: 'Form',
        date: 'Mon',
        time: 'Monday at 8:20 AM',
        timeCategory: 'this_week' as const,
        read: true,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      
      // Last Week
      {
        id: 'notification-8',
        type: 'comment' as const,
        username: 'Mo Malayeri',
        action: 'commented on',
        target: 'Integrations (Bettermode)',
        space: 'Platform',
        cmsType: 'Feature',
        date: 'Apr 8',
        time: 'Apr 8',
        timeCategory: 'last_week' as const,
        read: true,
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        commentContent: 'What we didn\'t address is the mapping of the Sorena users with Bettermode staff. We need to find a way to address that',
        mentionedUser: 'Amir Khalili'
      },
      {
        id: 'notification-9',
        type: 'join' as const,
        username: 'Daniel Kim',
        action: 'joined',
        target: 'Design Team',
        space: 'People',
        cmsType: 'Group',
        date: 'Apr 7',
        time: 'Apr 7',
        timeCategory: 'last_week' as const,
        read: true,
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      
      // Older
      {
        id: 'notification-10',
        type: 'mention' as const,
        username: 'Mo Malayeri',
        action: 'mentioned you in',
        target: 'Dashboard & Analytics Tab',
        space: 'Admin',
        cmsType: 'Discussion',
        date: 'Mar 28',
        time: 'Mar 28',
        timeCategory: 'older' as const,
        read: true,
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 'notification-11',
        type: 'system' as const,
        username: 'System',
        action: 'performed security update on',
        target: 'User Permissions',
        space: 'Security',
        cmsType: 'System',
        date: 'Mar 25',
        time: 'Mar 25',
        timeCategory: 'older' as const,
        read: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
    ]
  };
};
