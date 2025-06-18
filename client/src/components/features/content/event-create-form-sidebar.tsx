import * as React from "react";
import { EventComposer, EventFormData } from "./composer-modal/event";
import { LayoutMode } from "./composer-modal/common";

export interface EventCreateFormSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EventFormData) => void;
  initialData?: Partial<EventFormData>;
}

/**
 * Event Create Form with Sidebar Layout
 * 
 * This variant starts in SIDEBAR mode (main content + sidebar, no preview)
 * and allows users to cycle between all 3 layout modes:
 * 
 * 1. NORMAL: Form fields + Preview (traditional split view)
 * 2. SIDEBAR: Main content + Sidebar (focus on writing, no preview)
 * 3. FULLSCREEN: Main content + Sidebar (full screen for maximum space)
 * 
 * Users can click the layout toggle button to switch between modes.
 */
export function EventCreateFormSidebar({ open, onOpenChange, onSubmit, initialData }: EventCreateFormSidebarProps) {
  return (
    <EventComposer
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      initialData={initialData}
      defaultLayoutMode={LayoutMode.SIDEBAR}
      allowLayoutModeSwitch={true}
    />
  );
} 