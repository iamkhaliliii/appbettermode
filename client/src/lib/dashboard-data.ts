// This file can be used to store and manage dashboard data
// It can be expanded as needed when connecting to backend APIs

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
  type: 'post' | 'comment' | 'reaction' | 'join' | 'mention' | 'system';
  username: string;
  action: string;
  target: string;
  space?: string;
  time: string;
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
      {
        id: 'notification-1',
        type: 'post' as const,
        username: 'Support People',
        action: 'posted in',
        target: 'Bettermode Swags',
        space: 'Support',
        time: '2 hours ago',
        read: false,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 'notification-2',
        type: 'mention' as const,
        username: 'Mo Malayeri',
        action: 'mentioned you in',
        target: 'Create New View - Inbox',
        date: 'Apr 8',
        time: 'Apr 8',
        read: false,
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 'notification-3',
        type: 'mention' as const,
        username: 'Mo Malayeri',
        action: 'mentioned you in',
        target: 'Knowledge / Source Tab',
        date: 'Apr 8',
        time: 'Apr 8',
        read: false,
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 'notification-4',
        type: 'comment' as const,
        username: 'Mo Malayeri',
        action: 'commented in',
        target: 'Integrations (Bettermode)',
        date: 'Apr 8',
        time: 'Apr 8',
        read: false,
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        commentContent: 'What we didn\'t address is the mapping of the Sorena users with Bettermode staff. We need to find a way to address that',
        mentionedUser: 'Amir Khalili'
      },
      {
        id: 'notification-5',
        type: 'mention' as const,
        username: 'Mo Malayeri',
        action: 'mentioned you in',
        target: 'Dashboard & Analytics Tab',
        date: 'Apr 8',
        time: 'Apr 8',
        read: true,
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 'notification-6',
        type: 'mention' as const,
        username: 'Mo Malayeri',
        action: 'mentioned you in',
        target: 'People Tab',
        date: 'Apr 8',
        time: 'Apr 8',
        read: true,
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
    ]
  };
};
