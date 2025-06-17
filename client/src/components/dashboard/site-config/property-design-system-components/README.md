# Property Design System Components

This folder contains reusable property input components that form a design system for building dynamic property editors and forms.

## Components

### Core Types
- **`types.ts`** - TypeScript interfaces and mock data for all components

### Input Components

#### CustomDropdown
**Purpose**: Searchable dropdown with folder creation capabilities
**Features**:
- Search filtering
- Custom folder creation
- Icon support
- Keyboard navigation
- Flexible option structure

```tsx
<CustomDropdown
  value={selectedValue}
  options={options}
  onChange={setValue}
  enableSearch={true}
  onAddNew={handleCreateFolder}
/>
```

#### DateTimePicker
**Purpose**: Smart date and time selection with natural language display
**Features**:
- Smart display (Today, Tomorrow, formatted date)
- Separate date and time inputs
- Clear functionality
- Timezone aware
- Compact popover design

```tsx
<DateTimePicker
  value={dateTime}
  onChange={setDateTime}
  placeholder="Select date & time"
/>
```

#### UserSelector
**Purpose**: Multi-user selection with avatar display
**Features**:
- Avatar display for visual identification
- Search functionality
- Multi-selection support
- Role-based organization
- Compact visual representation (single name or avatar stack)

```tsx
<UserSelector
  value={selectedUserIds}
  onChange={setSelectedUserIds}
  placeholder="Select team members"
/>
```

#### TagInput
**Purpose**: Interactive tag creation and management
**Features**:
- Enter/comma to add tags
- Visual tag pills with remove buttons
- Backspace to remove last tag
- Duplicate prevention
- Clean input interface

```tsx
<TagInput
  value={tags}
  onChange={setTags}
  placeholder="Add tags"
/>
```

#### TimezoneSelector
**Purpose**: Comprehensive timezone selection with search functionality
**Features**:
- Complete list of world timezones
- Search by timezone name, description, or offset
- Visual offset display for each timezone
- Grouped by geographic regions
- Proper IANA timezone database identifiers

```tsx
<TimezoneSelector
  value={timezone}
  onChange={setTimezone}
  placeholder="Select timezone"
/>
```

#### NumberInput
**Purpose**: Interactive number input with increment/decrement buttons
**Features**:
- Click to reveal + and - buttons for easy adjustment
- Type directly in the input field
- Automatic value validation and clamping
- Smart display (shows "Unlimited" for 0, formatted numbers with units)
- Configurable min, max, and step values

```tsx
<NumberInput
  value={capacity}
  onChange={setCapacity}
  min={0}
  max={10000}
  step={1}
  placeholder="0"
/>
```

## Design Principles

1. **Consistency** - All components follow the same design patterns
2. **Accessibility** - Keyboard navigation and screen reader support
3. **Responsiveness** - Works across different screen sizes
4. **Performance** - Optimized for smooth interactions
5. **Reusability** - Can be used independently or together

## Usage Patterns

### Standalone Usage
Components can be used independently in any form or interface:

```tsx
import { UserSelector, TagInput, TimezoneSelector, NumberInput } from './property-design-system-components';

function MyForm() {
  return (
    <div>
      <UserSelector value={users} onChange={setUsers} />
      <TagInput value={tags} onChange={setTags} />
      <TimezoneSelector value={timezone} onChange={setTimezone} />
      <NumberInput value={capacity} onChange={setCapacity} min={0} max={1000} />
    </div>
  );
}
```

### PropertyRow Integration
Components are automatically used when PropertyRow type matches:

```tsx
import { PropertyRow } from '../PropertyRow';

<PropertyRow 
  type="number"
  value={capacity}
  onValueChange={setCapacity}
  min={0}
  max={10000}
  step={1}
  // ... other props
/>
```

## Styling

All components use Tailwind CSS classes and follow the design system's color palette:
- Primary colors: `primary-*` variants
- Gray scale: `gray-*` variants
- Dark mode: `dark:*` variants

Components are designed to work seamlessly in both light and dark themes.

## Future Enhancements

- **ColorPicker** - For color selection
- **FileUpload** - Enhanced file upload with preview
- **RichTextEditor** - Inline rich text editing
- **NumberInput** - Specialized number input with validation
- **LocationPicker** - Geographic location selection

## Contributing

When adding new components:
1. Follow the existing patterns and interfaces
2. Add TypeScript definitions to `types.ts`
3. Include comprehensive examples
4. Ensure accessibility compliance
5. Test in both light and dark modes 