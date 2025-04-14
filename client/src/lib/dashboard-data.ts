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

// These could be populated from API calls in a real application
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
    ]
  };
};
