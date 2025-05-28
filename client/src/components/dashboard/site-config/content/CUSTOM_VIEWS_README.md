# Custom Views Feature

## Overview
The Custom Views feature allows users to save their current filter and sort configurations as named views, making it easy to quickly switch between different content perspectives.

## Components

### 1. ContentViewManager (`content-view-manager.tsx`)
- **Purpose**: Manages saving and updating custom views
- **Features**:
  - Shows "Save View" button when filters/sorting are active
  - Shows "Update View" button when current view has changes
  - Dialog for naming new views
  - Preview of what will be saved

### 2. CustomViewsList (`custom-views-list.tsx`)
- **Purpose**: Displays saved views in the secondary sidebar
- **Features**:
  - Lists all saved views with metadata
  - Shows view summary (filters, sorting, etc.)
  - Click to load view
  - Delete view option
  - Visual indicator for active view

### 3. useCustomViews (`use-custom-views.ts`)
- **Purpose**: Custom hook for managing views state
- **Features**:
  - localStorage persistence
  - CRUD operations for views
  - Current view tracking

## Data Structure

```typescript
interface CustomView {
  id: string;
  name: string;
  filters: FilterRule[];
  sorting: SortingState;
  showStatusFilter: boolean;
  selectedCmsType: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## User Flow

1. **Creating a View**:
   - User applies filters and/or sorting
   - "Save View" button appears next to filter/sort controls
   - Click button → dialog opens asking for view name
   - Enter name and save → view appears in sidebar

2. **Using a View**:
   - Click on any view in the sidebar
   - All filters, sorting, and settings are applied
   - View becomes "active" (highlighted in sidebar)

3. **Updating a View**:
   - Load a view, then make changes to filters/sorting
   - "Update View" button appears (replaces "Save View")
   - Click to update the existing view with current state

4. **Managing Views**:
   - Views are listed in the secondary sidebar under "Custom Views"
   - Each view shows: name, last updated date, summary of filters/sorting
   - Hover to see delete option

## Integration Points

### Main Content Component (`index.tsx`)
- Imports all view-related components and hooks
- Manages view state and loading
- Renders views list in sidebar via DOM manipulation

### ContentToolbar (`content-toolbar.tsx`)
- Includes ContentViewManager component
- Passes current state to view manager
- Handles save/update callbacks

### Secondary Sidebar (`ContentSidebar.tsx`)
- Contains placeholder container for custom views
- Views are rendered dynamically by main component

## Storage
- Views are stored in localStorage with key: `content-custom-views`
- Automatic persistence on any changes
- Views are loaded on app startup

## Features
- ✅ Save current filter/sort state as named view
- ✅ Load saved views instantly
- ✅ Update existing views
- ✅ Delete views
- ✅ Visual indicators for active view
- ✅ Persistent storage
- ✅ View metadata (created/updated dates)
- ✅ Smart button states (Save vs Update)
- ✅ Integration with existing filter/sort system

## Future Enhancements
- Share views between users
- Export/import views
- View categories/folders
- Default views
- View permissions 