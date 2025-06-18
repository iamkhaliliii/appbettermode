# Composer Modal Architecture

A modular and extensible system for creating different types of posts (events, discussions, announcements, etc.) with shared UI components and customizable behaviors.

## Architecture Overview

```
composer-modal/
├── common/                    # Shared components across all post types
│   ├── ComposerModal.tsx     # Main modal layout with component slots
│   ├── ContentEditor.tsx     # Rich text editor with poll support
│   ├── ComposerFooter.tsx    # Footer with scheduling and action buttons
│   ├── schedule-popover.tsx  # Schedule selection popover
│   ├── schedule-post-dialog.tsx # Schedule configuration dialog
│   ├── types.ts              # Base TypeScript interfaces
│   └── index.ts              # Exports
└── event/                     # Event-specific components
    ├── EventComposer.tsx     # Event wrapper for generic modal
    ├── EventFormFields.tsx   # Event form fields (normal mode)
    ├── EventSidebar.tsx      # Event sidebar fields (sidebar/fullscreen modes)
    ├── EventPreview.tsx      # Event preview component
    ├── types.ts              # Event-specific types
    └── index.ts              # Exports
```

## Layout Modes

The composer modal supports 3 different layout modes:

### 1. **NORMAL Mode** (2:1 ratio)
- **Left (2/3)**: Form fields + Content editor + Title
- **Right (1/3)**: Live preview
- Best for: Traditional content creation with immediate preview

### 2. **SIDEBAR Mode** (60:40 ratio)
- **Left (60%)**: Main content editor + Title
- **Right (40%)**: Property sidebar with settings
- Best for: Distraction-free writing with easy access to settings

### 3. **FULLSCREEN Mode** (3:1 ratio)
- **Left (3/4)**: Main content editor + Title
- **Right (1/4)**: Property sidebar with settings
- Best for: Maximum writing space for long-form content

Users can cycle between modes using the layout toggle button in the top-right corner.

## Core Components

### ComposerModal (Generic)

The main modal component that provides:
- Layout management (Normal/Sidebar/Fullscreen modes)
- Component slots for customization
- Title input handling
- Content editor integration
- Footer actions (save, schedule, publish)

**Key Props:**
```typescript
interface ComposerModalProps<T extends BaseFormData> {
  // Component slots - provided by specific post type wrappers
  FormFieldsComponent: React.ComponentType<BaseFormFieldsProps<T>>;
  SidebarComponent: React.ComponentType<BaseSidebarProps<T>>;
  PreviewComponent: React.ComponentType<any>;
  
  // Layout control
  defaultLayoutMode?: LayoutMode;
  allowLayoutModeSwitch?: boolean;
  
  // Customization
  createButtonText?: string;
  scheduleButtonText?: string;
  titlePlaceholder?: string;
}
```

### ContentEditor

Rich text editor with:
- Poll block integration
- Markdown support
- Responsive design
- Consistent styling across all post types

### ComposerFooter

Reusable footer with:
- Primary action button (Create/Update)
- Schedule functionality
- Save draft option
- Responsive layout

## Creating New Post Types

To add a new post type (e.g., Discussion), follow this pattern:

### 1. Create Post Type Folder
```
composer-modal/discussion/
├── DiscussionComposer.tsx
├── DiscussionFormFields.tsx
├── DiscussionSidebar.tsx
├── DiscussionPreview.tsx
├── types.ts
└── index.ts
```

### 2. Define Types
```typescript
// discussion/types.ts
import { BaseFormData, BaseComposerModalProps } from '../common/types';

export interface DiscussionFormData extends BaseFormData {
  category: string;
  tags: string[];
  isPoll: boolean;
  // ... other discussion-specific fields
}

export interface DiscussionComposerProps extends BaseComposerModalProps<DiscussionFormData> {
  // Discussion-specific props
}
```

### 3. Create Components

**DiscussionComposer.tsx:**
```typescript
import { ComposerModal, LayoutMode } from '../common';
import { DiscussionFormFields } from './DiscussionFormFields';
import { DiscussionSidebar } from './DiscussionSidebar';
import { DiscussionPreview } from './DiscussionPreview';

export function DiscussionComposer(props: DiscussionComposerProps) {
  return (
    <ComposerModal
      {...props}
      FormFieldsComponent={DiscussionFormFields}
      SidebarComponent={DiscussionSidebar}
      PreviewComponent={DiscussionPreview}
      createButtonText="Create Discussion"
      titlePlaceholder="Discussion title"
      defaultLayoutMode={LayoutMode.NORMAL}
    />
  );
}
```

### 4. Implement Field Components

Each post type needs:
- **FormFields**: Fields shown in NORMAL mode (below title, above content)
- **Sidebar**: Fields shown in SIDEBAR/FULLSCREEN modes (right panel)
- **Preview**: Live preview component for NORMAL mode

## Example Usage

### Basic Event Creation
```typescript
import { EventComposer } from './composer-modal/event';

<EventComposer
  open={isOpen}
  onOpenChange={setIsOpen}
  onSubmit={handleSubmit}
  initialData={eventData}
/>
```

### Event Creation with Sidebar Mode
```typescript
import { EventCreateFormSidebar } from './event-create-form-sidebar';

<EventCreateFormSidebar
  open={isOpen}
  onOpenChange={setIsOpen}
  onSubmit={handleSubmit}
  initialData={eventData}
/>
```

### Custom Layout Mode
```typescript
import { EventComposer, LayoutMode } from './composer-modal/event';

<EventComposer
  open={isOpen}
  onOpenChange={setIsOpen}
  onSubmit={handleSubmit}
  defaultLayoutMode={LayoutMode.FULLSCREEN}
  allowLayoutModeSwitch={false} // Lock to fullscreen
/>
```

## Benefits

### Code Reuse
- **35KB+** of duplicate code eliminated
- Shared components: Modal layout, Content editor, Footer, Scheduling
- Consistent UX across all post types

### Maintainability
- Single source of truth for common functionality
- Clear separation between shared and post-specific logic
- Type-safe interfaces

### Extensibility
- Easy to add new post types
- Flexible component slot system
- Customizable layout modes and behaviors

### User Experience
- Consistent interface across all content types
- Multiple layout options for different use cases
- Smooth transitions between modes

## Technical Notes

### TypeScript Integration
- Full type safety with generics
- Base interfaces that extend for specific post types
- Proper prop inheritance and validation

### Styling Approach
- Tailwind CSS with responsive design
- Consistent spacing and color schemes
- Dark mode support throughout

### State Management
- Local state for UI interactions
- Props-based data flow for form data
- Proper event handling and validation

This architecture provides a solid foundation for creating diverse content types while maintaining consistency and reducing code duplication. 