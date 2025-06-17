# PropertyRow Component Refactoring

This directory contains the refactored PropertyRow components that have been broken down from a large monolithic file (1169 lines) into smaller, more manageable components.

## Structure

### Core Components

- **`PropertyRow.tsx`** - Main component that renders different property types
- **`property-design-system-components/`** - Specialized input components organized as a design system

### Property Design System Components

The extracted components are now organized in a dedicated folder:

- **`types.ts`** - Shared TypeScript interfaces and mock data
- **`CustomDropdown.tsx`** - Searchable dropdown with folder creation support
- **`DateTimePicker.tsx`** - Smart date/time picker with natural language display
- **`UserSelector.tsx`** - Multi-user selection with avatars and search
- **`TagInput.tsx`** - Interactive tag input with visual tag management
- **`index.ts`** - Exports all components for easy importing
- **`README.md`** - Detailed documentation for the design system

### Features

#### CustomDropdown
- Search functionality
- Custom folder creation
- Icon support
- Keyboard navigation

#### DateTimePicker
- Smart display (Today, Tomorrow, or formatted date)
- Separate date and time inputs
- Clear functionality
- Timezone aware

#### UserSelector
- Avatar display for users
- Search through users
- Multi-selection support
- Visual representation (single user name or avatar stack)
- Role-based organization

#### TagInput
- Enter/comma to add tags
- Visual tag pills with remove buttons
- Backspace to remove last tag
- Duplicate prevention

## Benefits of Refactoring

1. **Maintainability** - Each component has a single responsibility
2. **Reusability** - Components can be used independently
3. **Testing** - Easier to test individual components
4. **Code Organization** - Cleaner file structure
5. **Performance** - Smaller bundles when only specific components are needed

## Usage

```tsx
import { PropertyRow } from '@/components/dashboard/site-config';
import { UserSelector, TagInput } from '@/components/dashboard/site-config/property-design-system-components';

// Use the main PropertyRow
<PropertyRow 
  type="users"
  value={selectedUsers}
  onValueChange={setSelectedUsers}
  // ... other props
/>

// Or use specialized components directly
<UserSelector 
  value={selectedUsers}
  onChange={setSelectedUsers}
  placeholder="Select team members"
/>
```

## Migration

The refactoring maintains full backward compatibility. All existing usage of PropertyRow will continue to work exactly as before, but now the codebase is more maintainable and the individual components can be reused elsewhere if needed. 