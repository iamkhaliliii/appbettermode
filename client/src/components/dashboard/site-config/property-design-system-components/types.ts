export interface PropertyRowProps {
  label: string;
  value: any;
  fieldName: string;
  type?: 'text' | 'textarea' | 'select' | 'upload' | 'checkbox' | 'datetime' | 'users' | 'tags' | 'timezone' | 'number' | 'repeat';
  options?: { 
    value: string; 
    label: string; 
    description?: string;
    icon?: any;
  }[];
  onValueChange: (value: any) => void;
  placeholder?: string;
  icon?: any;
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
  description?: string;
  disabled?: boolean;
  isChild?: boolean;
  isIconUpload?: boolean;
  enableDropdownSearch?: boolean;
  onAddNew?: (folderName: string) => void;
  min?: number;
  max?: number;
  step?: number;
  startDate?: string; // For repeat component
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface CustomDropdownProps {
  value: string;
  options: { 
    value: string; 
    label: string; 
    description?: string;
    icon?: any;
  }[];
  onChange: (value: string) => void;
  placeholder?: string;
  enableSearch?: boolean;
  onAddNew?: (folderName: string) => void;
}

export interface DateTimePickerProps {
  value: string; 
  onChange: (value: string) => void; 
  placeholder?: string;
}

export interface UserSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export interface TimezoneSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface RepeatConfig {
  type: 'none' | 'daily' | 'weekly' | 'monthly' | 'annually' | 'weekdays' | 'custom';
  weekdays?: string[];
  ordinal?: 'first' | 'second' | 'third' | 'fourth' | 'last';
  weekday?: string;
  customPattern?: string;
  // Custom recurrence fields
  interval?: number;
  intervalUnit?: 'day' | 'week' | 'month' | 'year';
  endsType?: 'never' | 'on' | 'after';
  endsOn?: string; // date
  endsAfter?: number; // occurrences
}

export interface RepeatSelectorProps {
  value: RepeatConfig | null;
  onChange: (value: RepeatConfig | null) => void;
  startDate?: string;
}

// Mock user data
export const mockUsers: User[] = [
  { id: '1', name: 'Alex Chen', email: 'alex@example.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face', role: 'Admin' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b4c0?w=32&h=32&fit=crop&crop=face', role: 'Editor' },
  { id: '3', name: 'Mike Wilson', email: 'mike@example.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face', role: 'Moderator' },
  { id: '4', name: 'Emma Davis', email: 'emma@example.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face', role: 'Author' },
  { id: '5', name: 'David Lee', email: 'david@example.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face', role: 'Contributor' },
]; 