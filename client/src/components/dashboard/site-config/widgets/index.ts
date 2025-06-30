// Widget System (existing)
export {
  WidgetSystemProvider,
  WidgetWrapper,
  WidgetZone,
  useWidgetSystem,
  type WidgetZone as WidgetZoneType
} from './WidgetSystem';

// Components
export { default as WidgetCard } from './WidgetCard';
export { WidgetGallery } from './WidgetGallery';
export { WidgetSection } from './WidgetSection';
export { WidgetDropZone } from './WidgetDropZone';
export { GeneralWidgetPopover } from './GeneralWidgetPopover';

// Data
export { widgetSections, availableWidgets } from './widgetData';

// Hooks
export { useWidgetManagement } from './useWidgetManagement';

// Types
export type {
  Widget,
  AvailableWidget,
  WidgetSections,
  WidgetSettings,
  WidgetTabProps,
  WidgetCardProps,
  WidgetSectionProps,
  WidgetGalleryProps
} from './types'; 