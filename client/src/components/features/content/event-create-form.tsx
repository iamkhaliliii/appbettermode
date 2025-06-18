import * as React from "react";
import { EventComposer, EventFormData } from "./composer-modal/event";

export interface EventCreateFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EventFormData) => void;
  initialData?: Partial<EventFormData>;
}

export function EventCreateForm({ open, onOpenChange, onSubmit, initialData }: EventCreateFormProps) {
  return (
    <EventComposer
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      initialData={initialData}
    />
  );
} 