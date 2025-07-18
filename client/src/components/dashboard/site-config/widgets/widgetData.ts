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
  Layers,
  TrendingUp,
  Navigation,
  FileText,
  Image,
  Video,
  MousePointer,
  ChevronDown,
  Menu,
  Megaphone,
  Code,
  Monitor,
  Type,
  Edit3,
  Crown,
  Trophy,
  PanelLeft,
  Database,
  Dock,
  PanelTop,
  PanelLeftDashed,
  CalendarHeart,
  CalendarDays,
  DatabaseZap,
  LayoutTemplate,
  PanelBottom,
  LayoutDashboard
} from "lucide-react";
import { WidgetSections, AvailableWidget } from './types';

export const widgetSections: WidgetSections = {
  base: [
    { 
      id: 'site-header', 
      name: 'Site Header', 
      icon: PanelTop, 
      description: 'Navigation and branding',
      status: 'active',
      type: 'system',
      locked: true,
      category: 'Enterprise Widgets',
      settings: { visibility: true, customizable: false }
    },
    { 
      id: 'site-sidebar', 
      name: 'Site Sidebar', 
      icon: PanelLeftDashed, 
      description: 'Navigation menu',
      status: 'active',
      type: 'system',
      locked: false,
      category: 'Basic Widgets',
      settings: { visibility: true, customizable: true }
    },
    { 
      id: 'site-footer', 
      name: 'Site Footer', 
      icon: Dock, 
      description: 'Footer information and links',
      status: 'active',
      type: 'system',
      locked: true,
      category: 'Enterprise Widgets',
      settings: { visibility: true, customizable: false }
    },
  ],
  main: [
    { 
      id: 'space-header', 
      name: 'Space Header', 
      icon: PanelTop, 
      description: 'Header section with space title and description',
      status: 'active',
      type: 'content',
      locked: false,
      category: 'Content Widgets',
      settings: { visibility: true, customizable: true }
    },
    { 
      id: 'events-container', 
      name: 'Events content', 
      icon: Database, 
      description: 'Event listing with search and filters',
      status: 'active',
      type: 'content',
      locked: false,
      category: 'Content Widgets',
      settings: { visibility: true, customizable: true }
    },
  ],
  custom: [
    { 
      id: 'featured-events', 
      name: 'Upcoming Events', 
      icon: CalendarHeart, 
      description: 'Event highlights with carousel',
      status: 'active',
      type: 'content',
      locked: false,
      category: 'Content Widgets',
      settings: { visibility: true, customizable: true }
    },
    { 
      id: 'categories', 
      name: 'Event Calendar', 
      icon: CalendarDays, 
      description: 'Interactive category filters',
      status: 'active',
      type: 'content',
      locked: false,
      category: 'Content Widgets',
      settings: { visibility: true, customizable: true }
    },
  ]
};

export const availableWidgets: AvailableWidget[] = [
  // Trending Widgets
  {
    id: 'advance-content-block-trending',
    name: 'Advance Content Block',
    icon: Layers,
    description: 'Advanced content management and display',
    category: 'Trending',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: true
  },
  {
    id: 'upcoming-events-trending',
    name: 'Upcoming Events',
    icon: CalendarHeart,
    description: 'Display upcoming events and schedules',
    category: 'Trending',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false
  },
  {
    id: 'hero-banner-trending',
    name: 'Hero Banner',
    icon: Image,
    description: 'Large promotional banner with call-to-action',
    category: 'Trending',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false
  },
  {
    id: 'advance-top-navigation-trending',
    name: 'Advance Top Navigation',
    icon: Navigation,
    description: 'Advanced navigation with dropdown menus',
    category: 'Trending',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: true
  },

  // Content Widgets
  {
    id: 'space-header',
    name: 'Space Header',
    icon: PanelTop,
    description: 'Header section with space title and description',
    category: 'Content Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false
  },
  {
    id: 'upcoming-events-content',
    name: 'Upcoming Events',
    icon: CalendarHeart,
    description: 'Display upcoming events and schedules',
    category: 'Content Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false
  },
  {
    id: 'calendar',
    name: 'Calendar',
    icon: CalendarDays,
    description: 'Interactive calendar view for events',
    category: 'Content Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false
  },
  {
    id: 'members-list',
    name: 'Members List',
    icon: Users,
    description: 'Display community members and user profiles',
    category: 'Content Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false
  },
  {
    id: 'spaces-list',
    name: 'Spaces List',
    icon: Layers,
    description: 'Show available spaces and categories',
    category: 'Content Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false
  },

  // Basic Widgets
  {
    id: 'title',
    name: 'Title',
    icon: Type,
    description: 'Simple text title or heading',
    category: 'Basic Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false
  },
  {
    id: 'logo',
    name: 'Logo',
    icon: Crown,
    description: 'Brand logo or image display',
    category: 'Basic Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false
  },
  {
    id: 'image',
    name: 'Image',
    icon: Image,
    description: 'Single image display widget',
    category: 'Basic Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false
  },
  {
    id: 'video',
    name: 'Video',
    icon: Video,
    description: 'Embedded video player',
    category: 'Basic Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false
  },
  {
    id: 'button',
    name: 'Button',
    icon: MousePointer,
    description: 'Interactive button with custom action',
    category: 'Basic Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false
  },
  {
    id: 'accordions',
    name: 'Accordions',
    icon: ChevronDown,
    description: 'Collapsible content sections',
    category: 'Basic Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false
  },

  // Advance Widgets
  {
    id: 'menu',
    name: 'Menu',
    icon: Menu,
    description: 'Custom navigation menu',
    category: 'Advance Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false
  },
  {
    id: 'hero-banner-advance',
    name: 'Hero Banner',
    icon: Image,
    description: 'Large promotional banner with call-to-action',
    category: 'Advance Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false
  },
  {
    id: 'announcement-banner',
    name: 'Announcement Banner',
    icon: Megaphone,
    description: 'Site-wide announcement or notification banner',
    category: 'Advance Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false
  },
  {
    id: 'html-script',
    name: 'HTML Script',
    icon: Code,
    description: 'Custom HTML and JavaScript code',
    category: 'Advance Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false
  },
  {
    id: 'iframe',
    name: 'iFrame',
    icon: Monitor,
    description: 'Embed external content via iframe',
    category: 'Advance Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false
  },
  {
    id: 'canvas',
    name: 'Canvas',
    icon: Edit3,
    description: 'Rich content editor with advanced formatting',
    category: 'Advance Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: false
  },

  // Enterprise Widgets (all locked)
  {
    id: 'advance-content-block-enterprise',
    name: 'Advance Content Block',
    icon: DatabaseZap,
    description: 'Advanced content management and display',
    category: 'Enterprise Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: true
  },
  {
    id: 'advance-space-header',
    name: 'Advance Space Header',
    icon: LayoutTemplate,
    description: 'Advanced header with multiple features',
    category: 'Enterprise Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: true
  },
  {
    id: 'advance-leaderboard',
    name: 'Advance Leaderboard',
    icon: Trophy,
    description: 'Advanced ranking and gamification',
    category: 'Enterprise Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: true
  },
  {
    id: 'advance-footer',
    name: 'Advance Footer',
    icon: PanelBottom,
    description: 'Feature-rich footer with multiple sections',
    category: 'Enterprise Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: true
  },
  {
    id: 'advance-top-navigation-enterprise',
    name: 'Advance Top Navigation',
    icon: PanelTop,
    description: 'Advanced navigation with dropdown menus',
    category: 'Enterprise Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: true
  },
  {
    id: 'advance-sidebar',
    name: 'Advance Sidebar',
    icon: PanelLeft,
    description: 'Advanced sidebar with multiple widgets',
    category: 'Enterprise Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: true
  },
  {
    id: 'advance-layout-section',
    name: 'Advance Layout Section',
    icon: LayoutDashboard,
    description: 'Complex layout with multiple content areas',
    category: 'Enterprise Widgets',
    gridSize: 'col-span-1 row-span-1',
    size: '1×1',
    locked: true
  }
]; 