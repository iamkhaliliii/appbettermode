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
  read: boolean;
  avatar: string;
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
        type: 'post',
        username: 'Sara Ahmed',
        action: 'posted new',
        target: 'UI Framework Documentation',
        space: 'Design System',
        time: '5 min ago',
        read: false,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 'notification-2',
        type: 'comment',
        username: 'Michael Torres',
        action: 'replied to',
        target: 'Getting Started with Components',
        space: 'Documentation',
        time: '2 hours ago',
        read: false,
        avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 'notification-3',
        type: 'reaction',
        username: 'Emily Chen',
        action: 'reacted to',
        target: 'Design Tokens Implementation',
        space: 'Technical',
        time: '5 hours ago',
        read: false,
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 'notification-4',
        type: 'join',
        username: 'Ryan Garcia',
        action: 'joined',
        target: 'Frontend Team',
        space: 'Teams',
        time: '1 day ago',
        read: true,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 'notification-5',
        type: 'mention',
        username: 'Lisa Wong',
        action: 'mentioned you in',
        target: 'Design System Components Discussion',
        space: 'Design',
        time: '2 days ago',
        read: true,
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      {
        id: 'notification-6',
        type: 'system',
        username: 'System',
        action: 'updated',
        target: 'Design System Version 2.0 Released',
        time: '3 days ago',
        read: true,
        avatar: 'https://images.unsplash.com/photo-1563237023-b1e970526dcb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      }
    ]
  };
};
