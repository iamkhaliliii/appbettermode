import { LucideIcon } from 'lucide-react';

export interface Widget {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  status?: 'active' | 'hidden';
  type?: 'system' | 'content';
  locked?: boolean;
  category?: string;
  settings?: {
    visibility: boolean;
    customizable: boolean;
  };
}

export interface AvailableWidget {
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
  category: string;
  gridSize: string;
  size: string;
  locked: boolean;
}

export interface WidgetSections {
  base: Widget[];
  main: Widget[];
  custom: Widget[];
}

export interface WidgetSettings {
  visibility: boolean;
  layout: string;
  showTitle: boolean;
  showDescription: boolean;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  spacing: string;
  animation: string;
  itemsPerRow: string;
}

export interface WidgetTabProps {
  selectedElement?: HTMLElement | null;
  onWidgetSettingsModeChange?: (isWidgetSettingsMode: boolean) => void;
  onAddWidgetModeChange?: (isAddWidgetMode: boolean) => void;
  onLayoutChange?: (layout: string) => void;
  onCardSizeChange?: (cardSize: string) => void;
  onCardStyleChange?: (cardStyle: string) => void;
  selectedWidget?: any;
  isWidgetSettingsMode?: boolean;
  initialLayout?: string;
  initialCardSize?: string;
  initialCardStyle?: string;
  onSpaceHeaderSettingsChange?: (settings: any) => void;
}

export interface WidgetCardProps {
  widget: AvailableWidget | Widget;
  onAddWidget?: (widget: AvailableWidget | Widget) => void;
  onClick?: (widget: AvailableWidget | Widget) => void;
  isSelected?: boolean;
  showAddButton?: boolean;
  onAdd?: (widget: AvailableWidget | Widget) => void;
  actions?: React.ReactNode;
}

export interface WidgetSectionProps {
  title: string;
  widgets: Widget[];
  expanded: boolean;
  onToggleExpanded: () => void;
  onWidgetClick: (widget: Widget) => void;
  onAddWidget?: () => void;
  isBaseSection?: boolean;
}

export interface WidgetGalleryProps {
  availableWidgets: AvailableWidget[];
  onAddWidget: (widget: AvailableWidget) => void;
  onBack: () => void;
} 