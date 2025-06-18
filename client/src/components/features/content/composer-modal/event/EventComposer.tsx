import * as React from "react";
import { ComposerModal, LayoutMode } from "../common";
import { EventFormData, EventComposerModalProps } from "./types";
import { EventFormFields } from "./EventFormFields";
import { EventSidebar } from "./EventSidebar";
import { EventPreview } from "./EventPreview";

export function EventComposer({
  defaultLayoutMode,
  allowLayoutModeSwitch,
  ...props
}: EventComposerModalProps) {
  return (
    <ComposerModal<EventFormData>
      {...props}
      FormFieldsComponent={EventFormFields}
      SidebarComponent={EventSidebar}
      PreviewComponent={EventPreview}
      createButtonText="Create Event"
      scheduleButtonText="Schedule Event"
      scheduleMenuText="Schedule event"
      titlePlaceholder="Event title"
      defaultLayoutMode={defaultLayoutMode}
      allowLayoutModeSwitch={allowLayoutModeSwitch}
    />
  );
} 