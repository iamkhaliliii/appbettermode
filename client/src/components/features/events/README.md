# Event Components

This folder contains modular, reusable components for the event management system. The original large monolithic `event.tsx` file has been refactored into smaller, focused components.

## Component Structure

### Core Components

- **`CountdownTimer.tsx`** - A countdown timer widget for event countdowns
- **`CategoryCard.tsx`** - Reusable category card for event filtering  
- **`FeaturedEventWidget.tsx`** - Hero widget for featured events
- **`EventCard.tsx`** - Card view for displaying events in grid mode
- **`EventListItem.tsx`** - List item view for displaying events in timeline mode
- **`EventControlsBar.tsx`** - Controls for search, filter, sort, and view mode

### Supporting Files

- **`types.ts`** - TypeScript interfaces and types
- **`constants.ts`** - Category configurations and premium images
- **`index.ts`** - Barrel exports for easy importing

## Usage

```tsx
import {
  EventCard,
  EventListItem,
  EventControlsBar,
  FeaturedEventWidget,
  CategoryCard,
  CountdownTimer,
  EnhancedEvent,
  Space,
  CATEGORIES,
  PREMIUM_IMAGES
} from '@/components/features/events';

// Use components individually
<EventCard event={event} onEventClick={handleClick} />
<EventListItem event={event} index={0} filteredEvents={events} onEventClick={handleClick} />
<EventControlsBar {...controlsProps} />
```

## Benefits of Refactoring

1. **Modularity** - Each component has a single responsibility
2. **Reusability** - Components can be used across different parts of the app
3. **Maintainability** - Easier to test and modify individual components
4. **Performance** - Smaller bundle sizes and better tree shaking
5. **Developer Experience** - Better IDE support and cleaner imports

## Component Props

### EventCard
- `event: EnhancedEvent` - The event data
- `onEventClick: (eventId: string) => void` - Click handler

### EventListItem  
- `event: EnhancedEvent` - The event data
- `index: number` - Index in the list
- `filteredEvents: EnhancedEvent[]` - All filtered events
- `onEventClick: (eventId: string) => void` - Click handler

### EventControlsBar
- Various props for search, filter, sort, and view mode controls

### CategoryCard
- `icon: React.ComponentType` - Icon component
- `title: string` - Category title
- `count: number` - Number of events in category
- `colorScheme: object` - Color configuration
- `onClick?: () => void` - Optional click handler

### CountdownTimer
- `targetDate: string` - ISO date string for countdown target

## File Organization

```
events/
├── CountdownTimer.tsx      # ⏱️ Timer widget
├── CategoryCard.tsx        # 🏷️ Category filter cards
├── FeaturedEventWidget.tsx # ⭐ Hero event widget
├── EventCard.tsx          # 📱 Grid view cards
├── EventListItem.tsx      # 📋 List view items
├── EventControlsBar.tsx   # 🎛️ Search/filter controls
├── types.ts              # 📝 Type definitions
├── constants.ts          # 🎨 Categories & images
├── index.ts             # 📦 Barrel exports
└── README.md           # 📚 This documentation
```

This modular approach makes the codebase more maintainable and allows for better code reuse across the application. 