import {
  Settings,
  Calendar,
  Users,
  Layout,
  LayoutGrid,
  Eye,
  Heart,
  Grid2X2,
  MessageSquare,
  Zap,
  Layers
} from "lucide-react";
import { WidgetSections, AvailableWidget } from './types';

export const widgetSections: WidgetSections = {
  base: [
    { 
      id: 'site-header', 
      name: 'Site Header', 
      icon: Layout, 
      description: 'Navigation and branding',
      status: 'active',
      type: 'system',
      settings: { visibility: true, customizable: false }
    },
    { 
      id: 'site-sidebar', 
      name: 'Site Sidebar', 
      icon: Eye, 
      description: 'Navigation menu',
      status: 'active',
      type: 'system',
      settings: { visibility: true, customizable: true }
    },
    { 
      id: 'site-footer', 
      name: 'Site Footer', 
      icon: Layout, 
      description: 'Footer information and links',
      status: 'active',
      type: 'system',
      settings: { visibility: true, customizable: false }
    },
  ],
  main: [
    { 
      id: 'events-container', 
      name: 'Events content', 
      icon: Settings, 
      description: 'Event listing with search and filters',
      status: 'active',
      type: 'content',
      settings: { visibility: true, customizable: true }
    },
  ],
  custom: [
    { 
      id: 'featured-events', 
      name: 'Featured Events', 
      icon: Zap, 
      description: 'Event highlights with carousel',
      status: 'active',
      type: 'content',
      settings: { visibility: true, customizable: true }
    },
    { 
      id: 'categories', 
      name: 'Event Categories', 
      icon: Layers, 
      description: 'Interactive category filters',
      status: 'active',
      type: 'content',
      settings: { visibility: true, customizable: true }
    },
  ]
};

export const availableWidgets: AvailableWidget[] = [
  {
    id: 'event-countdown',
    name: 'Event Countdown',
    icon: Calendar,
    description: 'Display countdown timer for upcoming events',
    category: 'Events',
    gridSize: 'col-span-2 row-span-1',
    size: '2×1',
    locked: false,
    color: 'from-blue-400 via-blue-500 to-indigo-500 dark:from-blue-900/40 dark:via-blue-800/30 dark:to-indigo-800/40'
  },
  {
    id: 'event-gallery',
    name: 'Event Gallery',
    icon: LayoutGrid,
    description: 'Photo gallery for event highlights',
    category: 'Events',
    gridSize: 'col-span-2 row-span-1',
    size: '2×1',
    locked: false,
    color: 'from-pink-400 via-rose-500 to-red-500 dark:from-pink-900/40 dark:via-rose-800/30 dark:to-red-800/40'
  },
  {
    id: 'event-speakers',
    name: 'Event Speakers',
    icon: Users,
    description: 'Showcase event speakers and hosts',
    category: 'Events',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: true,
    color: 'from-emerald-400 via-green-500 to-teal-500 dark:from-emerald-900/40 dark:via-green-800/30 dark:to-teal-800/40'
  },
  {
    id: 'recent-activities',
    name: 'Recent Activities',
    icon: Eye,
    description: 'Display latest community activities',
    category: 'Community',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false,
    color: 'from-cyan-400 via-sky-500 to-blue-500 dark:from-cyan-900/40 dark:via-sky-800/30 dark:to-blue-800/40'
  },
  {
    id: 'popular-posts',
    name: 'Popular Posts',
    icon: Heart,
    description: 'Show most liked and commented posts',
    category: 'Content',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false,
    color: 'from-purple-400 via-violet-500 to-purple-500 dark:from-purple-900/40 dark:via-violet-800/30 dark:to-purple-800/40'
  },
  {
    id: 'user-leaderboard',
    name: 'User Leaderboard',
    icon: Users,
    description: 'Top contributors and active members',
    category: 'Community',
    gridSize: 'col-span-4 row-span-1',
    size: '4×1',
    locked: true,
    color: 'from-amber-400 via-yellow-500 to-orange-500 dark:from-amber-900/40 dark:via-yellow-800/30 dark:to-orange-800/40'
  },
  {
    id: 'event-stats',
    name: 'Event Statistics',
    icon: Grid2X2,
    description: 'Analytics and metrics for events',
    category: 'Analytics',
    gridSize: 'col-span-3 row-span-1',
    size: '3×1',
    locked: false,
    color: 'from-slate-400 via-gray-500 to-zinc-500 dark:from-slate-900/40 dark:via-gray-800/30 dark:to-zinc-800/40'
  },
  {
    id: 'newsletter-signup',
    name: 'Newsletter Signup',
    icon: MessageSquare,
    description: 'Email subscription form',
    category: 'Engagement',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false,
    color: 'from-teal-400 via-cyan-500 to-blue-500 dark:from-teal-900/40 dark:via-cyan-800/30 dark:to-blue-800/40'
  }
]; 