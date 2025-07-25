import { 
  Type, 
  Users, 
  Calendar, 
  MapPin, 
  Star, 
  Clock, 
  Tag, 
  CalendarDays 
} from 'lucide-react';

// Category data
export const CATEGORIES = [
  {
    icon: Type,
    title: 'Workshop',
    count: 12,
    colorScheme: {
      hover: 'hover:border-blue-300/50 dark:hover:border-blue-600/50',
      bg: 'bg-blue-50/60 dark:bg-blue-900/20 hover:bg-blue-50/80 dark:hover:bg-blue-900/25',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'group-hover:text-blue-600 dark:group-hover:text-blue-400'
    }
  },
  {
    icon: Users,
    title: 'Conference',
    count: 8,
    colorScheme: {
      hover: 'hover:border-purple-300/50 dark:hover:border-purple-600/50',
      bg: 'bg-purple-50/60 dark:bg-purple-900/20 hover:bg-purple-50/80 dark:hover:bg-purple-900/25',
      icon: 'text-purple-600 dark:text-purple-400',
      text: 'group-hover:text-purple-600 dark:group-hover:text-purple-400'
    }
  },
  {
    icon: Calendar,
    title: 'Webinar',
    count: 15,
    colorScheme: {
      hover: 'hover:border-green-300/50 dark:hover:border-green-600/50',
      bg: 'bg-green-50/60 dark:bg-green-900/20 hover:bg-green-50/80 dark:hover:bg-green-900/25',
      icon: 'text-green-600 dark:text-green-400',
      text: 'group-hover:text-green-600 dark:group-hover:text-green-400'
    }
  },
  {
    icon: MapPin,
    title: 'Meetup',
    count: 6,
    colorScheme: {
      hover: 'hover:border-orange-300/50 dark:hover:border-orange-600/50',
      bg: 'bg-orange-50/60 dark:bg-orange-900/20 hover:bg-orange-50/80 dark:hover:bg-orange-900/25',
      icon: 'text-orange-600 dark:text-orange-400',
      text: 'group-hover:text-orange-600 dark:group-hover:text-orange-400'
    }
  },
  {
    icon: Star,
    title: 'Pitch',
    count: 4,
    colorScheme: {
      hover: 'hover:border-red-300/50 dark:hover:border-red-600/50',
      bg: 'bg-red-50/60 dark:bg-red-900/20 hover:bg-red-50/80 dark:hover:bg-red-900/25',
      icon: 'text-red-600 dark:text-red-400',
      text: 'group-hover:text-red-600 dark:group-hover:text-red-400'
    }
  },
  {
    icon: Clock,
    title: 'Online',
    count: 18,
    colorScheme: {
      hover: 'hover:border-teal-300/50 dark:hover:border-teal-600/50',
      bg: 'bg-teal-50/60 dark:bg-teal-900/20 hover:bg-teal-50/80 dark:hover:bg-teal-900/25',
      icon: 'text-teal-600 dark:text-teal-400',
      text: 'group-hover:text-teal-600 dark:group-hover:text-teal-400'
    }
  },
  {
    icon: Tag,
    title: 'Free',
    count: 22,
    colorScheme: {
      hover: 'hover:border-gray-300/50 dark:hover:border-gray-600/50',
      bg: 'bg-gray-50/60 dark:bg-gray-800/20 hover:bg-gray-50/80 dark:hover:bg-gray-800/25',
      icon: 'text-gray-600 dark:text-gray-400',
      text: 'group-hover:text-gray-600 dark:group-hover:text-gray-400'
    }
  },
  {
    icon: CalendarDays,
    title: 'This Week',
    count: 7,
    colorScheme: {
      hover: 'hover:border-indigo-300/50 dark:hover:border-indigo-600/50',
      bg: 'bg-indigo-50/60 dark:bg-indigo-900/20 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/25',
      icon: 'text-indigo-600 dark:text-indigo-400',
      text: 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
    }
  },
  {
    icon: Star,
    title: 'Featured',
    count: 3,
    colorScheme: {
      hover: 'hover:border-yellow-300/50 dark:hover:border-yellow-600/50',
      bg: 'bg-yellow-50/60 dark:bg-yellow-900/20 hover:bg-yellow-50/80 dark:hover:bg-yellow-900/25',
      icon: 'text-yellow-600 dark:text-yellow-400 fill-current',
      text: 'group-hover:text-yellow-600 dark:group-hover:text-yellow-400'
    }
  }
];

// High-quality professional event images
export const PREMIUM_IMAGES = [
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
  'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop&crop=center&auto=format&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop&crop=center&auto=format&q=80'
]; 