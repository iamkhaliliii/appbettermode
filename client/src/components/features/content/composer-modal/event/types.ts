import { 
  BaseFormData, 
  BaseComposerModalProps, 
  BaseFormFieldsProps, 
  BaseSidebarProps,
  LayoutMode
} from '../common/types';

export interface EventFormData extends BaseFormData {
  hosts: string[]; // Array of user IDs
  dateFrom: string;
  dateTo: string;
  timezone: string;
  repeat: any; // RepeatConfig type
  locationType: 'address' | 'virtual' | 'tbd';
  address: string;
  virtualUrl: string;
  virtualProvider: 'url' | 'youtube' | 'streamyard' | 'zoom' | 'meet';
  registrationProvider: 'bettermode' | 'luma' | 'eventbrite' | 'bevy' | 'other';
  registrationUrl: string;
  coverImage: string;
  tags: string[];
  slug: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImage: string;
  hideFromSearch: boolean;
  hideAddress: boolean;
  hideAttendees: boolean;
  capacity: number;
  sendInAppConfirmation: boolean;
  sendEmailConfirmation: boolean;
  sendInAppReminder: boolean;
  sendEmailReminder: boolean;
}

export interface EventComposerModalProps extends BaseComposerModalProps<EventFormData> {
  // Event-specific modal props can be added here if needed
  defaultLayoutMode?: LayoutMode;
  allowLayoutModeSwitch?: boolean;
}

export interface EventFormFieldsProps extends BaseFormFieldsProps<EventFormData> {
  // Event-specific form field props can be added here if needed
}

export interface EventSidebarProps extends BaseSidebarProps<EventFormData> {
  // Event-specific sidebar props can be added here if needed
} 