// Base interfaces for all post types
export interface BaseFormData {
  title: string;
  content: string;
  space: string;
}

export interface BaseComposerModalProps<T extends BaseFormData> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: T) => void;
  initialData?: Partial<T>;
}

export interface BaseFormFieldsProps<T extends BaseFormData> {
  formData: T;
  onUpdateField: <K extends keyof T>(field: K, value: T[K]) => void;
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

export interface BaseSidebarProps<T extends BaseFormData> extends BaseFormFieldsProps<T> {
  // Specific props for sidebar
  className?: string;
}

export interface BaseContentEditorProps {
  content: any[];
  onContentChange: (content: any[]) => void;
}

export interface BaseFooterProps {
  isValid: boolean;
  scheduledDate: Date | null;
  currentStatus: string;
  isSchedulePopoverOpen: boolean;
  isDropdownOpen: boolean;
  onCancel: () => void;
  onPublish: () => void;
  onConfirm: () => void;
  onSaveDraft: () => void;
  onScheduleConfirm: (date: Date) => void;
  onEditSchedule: (date: Date) => void;
  onRemoveSchedule: () => void;
  onSchedulePopoverOpenChange: (open: boolean) => void;
  onDropdownOpenChange: (open: boolean) => void;
}

// Layout modes for composer modal
export enum LayoutMode {
  NORMAL = 'normal',           // Form fields + Preview
  SIDEBAR = 'sidebar',         // Main content + Sidebar (no preview)
  FULLSCREEN = 'fullscreen'    // Main content + Sidebar (full screen)
}

// Props for the main composer modal
export interface ComposerModalProps<T extends BaseFormData> extends BaseComposerModalProps<T> {
  // Component slots for customization by specific post types
  FormFieldsComponent: React.ComponentType<BaseFormFieldsProps<T>>;
  SidebarComponent: React.ComponentType<BaseSidebarProps<T>>;
  PreviewComponent: React.ComponentType<any>;
  
  // Footer customization
  createButtonText?: string;
  scheduleButtonText?: string;
  scheduleMenuText?: string;
  titlePlaceholder?: string;
  
  // Layout mode control
  defaultLayoutMode?: LayoutMode;
  allowLayoutModeSwitch?: boolean;
} 