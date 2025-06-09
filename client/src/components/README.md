# Components Directory - Clean Organization Structure

This directory has been organized into a clean, logical structure that makes it easy to find and maintain components.

## 📁 Directory Structure

```
components/
├── 🎨 ui/                          # User Interface Components
│   ├── primitives/                 # Basic UI building blocks
│   │   ├── button.tsx             # Buttons, inputs, forms
│   │   ├── input.tsx              # Text inputs, selects
│   │   ├── dialog.tsx             # Modals, sheets, drawers
│   │   ├── card.tsx               # Cards, badges, avatars
│   │   └── ...                    # Other primitive components
│   ├── forms/                     # Form-related components
│   │   ├── form.tsx               # Form wrappers and controls
│   │   ├── command.tsx            # Command palettes
│   │   ├── dropdown-menu.tsx      # Dropdown and context menus
│   │   └── ...                    # Other form components
│   ├── toast.tsx                  # Notifications and toasts
│   ├── toaster.tsx                # Toast manager
│   ├── notification-drawer.tsx    # Notification drawer
│   └── mini-toggle.tsx            # Mini toggle utility
│
├── 🚀 features/                    # Feature-specific Components
│   ├── content/                   # Content management
│   │   ├── content-card.tsx       # Content cards
│   │   ├── new-post-dialog.tsx    # Post creation
│   │   └── add-content-dialog/    # Content creation workflow
│   ├── search/                    # Search functionality
│   │   └── search-modal.tsx       # Global search
│   ├── polls/                     # Polling system
│   │   ├── poll-block.tsx         # Poll display
│   │   └── poll-config-modal.tsx  # Poll configuration
│   ├── spaces/                    # Space management
│   │   └── edit-space-dialog.tsx  # Space editing
│   ├── people/                    # User management
│   │   └── new-people-dialog.tsx  # User invitations
│   └── navigation/                # Navigation components
│       ├── navigation-menu.tsx    # Main navigation
│       ├── sidebar.tsx            # Sidebar navigation
│       └── ...                    # Other navigation components
│
├── 🔧 shared/                      # Shared Utility Components
│   ├── icons/                     # Icon components
│   │   ├── icon-display.tsx       # Icon display utility
│   │   └── icon-upload-dialog.tsx # Icon upload workflow
│   ├── charts/                    # Chart components
│   │   └── chart.tsx              # Chart utilities
│   ├── loaders/                   # Loading components
│   │   └── multi-step-loader.tsx  # Multi-step loader
│   └── carousel.tsx               # Carousel component
│
├── 📱 layout/                      # Layout Components
│   ├── dashboard/                 # Dashboard layouts
│   │   ├── header.tsx             # Dashboard header
│   │   ├── main-sidebar.tsx       # Main sidebar
│   │   ├── dashboard-layout.tsx   # Layout wrapper
│   │   └── secondary-sidebar/     # Secondary sidebar components
│   ├── site/                      # Site layouts
│   │   ├── site-header.tsx        # Site header
│   │   ├── site-layout.tsx        # Site layout wrapper
│   │   ├── site-sidebar.tsx       # Site sidebar
│   │   └── site-space-cms-content/ # CMS content components
│   └── index.tsx                  # Layout exports
│
├── 📊 dashboard/                   # Dashboard-specific Components
│   ├── CreateSiteDialog.tsx       # Site creation
│   ├── SitePreview.tsx            # Site preview
│   ├── DashboardPageWrapper.tsx   # Page wrapper
│   ├── activity-item.tsx          # Activity components
│   ├── chart-card.tsx             # Dashboard charts
│   └── site-config/               # Site configuration
│       ├── SpaceContent.tsx       # Space configuration
│       ├── SettingsSidebar.tsx    # Settings navigation
│       ├── *SettingsTab.tsx       # Various settings tabs
│       └── content/               # Content management
│           ├── content-table.tsx  # Content tables
│           ├── content-filter.tsx # Content filtering
│           └── ...                # Other content components
│
└── 📋 index.ts                     # Main exports file
```

## 🎯 Design Principles

### 1. **Separation of Concerns**
- **Primitive UI**: Basic, reusable building blocks
- **Feature Components**: Business logic and feature-specific functionality
- **Layout Components**: Page structure and navigation
- **Shared Components**: Cross-cutting utilities

### 2. **Discoverability**
- Clear folder names that indicate purpose
- Logical grouping by functionality
- Comprehensive index files for easy imports

### 3. **Maintainability**
- Related components grouped together
- Clear boundaries between different types of components
- Easy to add new components in the right place

### 4. **Scalability**
- Room to grow within each category
- Easy to add new feature folders
- Consistent export patterns

## 📦 Import Patterns

### From Primitives
```typescript
import { Button, Input, Dialog } from '@/components/ui/primitives'
```

### From Features
```typescript
import { SearchModal } from '@/components/features/search'
import { ContentCard } from '@/components/features/content'
```

### From Shared
```typescript
import { IconDisplay } from '@/components/shared/icons'
import { Chart } from '@/components/shared/charts'
```

### Everything (when needed)
```typescript
import { Button, SearchModal, IconDisplay } from '@/components'
```

## 🚀 Benefits

- **Faster Development**: Easy to find the right component
- **Better Collaboration**: Clear structure for team members
- **Easier Maintenance**: Related code grouped together
- **Reduced Conflicts**: Less chance of merge conflicts
- **Better Testing**: Easier to test related components together

## 📝 Adding New Components

When adding new components, follow this decision tree:

1. **Is it a basic UI element?** → `ui/primitives/`
2. **Is it form-related?** → `ui/forms/`
3. **Is it feature-specific?** → `features/{feature-name}/`
4. **Is it shared across features?** → `shared/{category}/`
5. **Is it layout-related?** → `layout/{context}/`
6. **Is it dashboard-specific?** → `dashboard/`

Remember to update the relevant index.ts files when adding new components! 