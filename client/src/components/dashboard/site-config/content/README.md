# Content Filter System

This directory contains a comprehensive content filtering system for the dashboard content table. The system supports multiple field types with various filter operators.

## Components

### 1. `content-filter.tsx`
The main filter component that provides a dropdown interface for creating and managing filters.

**Features:**
- Dropdown interface triggered by filter icon
- Support for multiple field types
- Dynamic operator selection based on field type
- Contextual value inputs based on operator
- Visual filter count indicator
- Ability to add, edit, and remove filters

### 2. `filter-logic.ts`
Contains the logic for applying filters to data.

**Features:**
- Comprehensive filter application logic
- Support for all field types and operators
- Date handling with presets and custom dates
- Multi-value filtering for arrays
- Boolean and numeric comparisons

## Supported Field Types

### Text Fields
**Operators:**
- Is
- Is not
- Contains
- Does not contain
- Starts with
- Ends with
- Is empty
- Is not empty

**Input:** Text input field

### Date Fields
**Operators:**
- Is
- Is not
- Is before
- Is after
- Is on or before
- Is on or after
- Is between
- Is relative to today
- Is empty
- Is not empty
- Is set
- Is not set

**Input Options:**
- Predefined date ranges (Today, Tomorrow, Yesterday, etc.)
- Custom date picker
- Relative date options (Today & Earlier, Overdue, etc.)
- Date range picker for "between" operator

### Choice Fields (Single Select)
**Operators:**
- Is
- Is not
- Is empty
- Is not empty
- Has any value
- Is unknown

**Input:** Dropdown with available options

### Multi-Choice Fields
**Operators:**
- Is
- Is not
- Contains
- Does not contain
- Is empty
- Is not empty
- Has any value
- Is unknown

**Input:** Multi-select dropdown with checkboxes

### Toggle Fields
**Operators:**
- Is true
- Is false

**Input:** No additional input required

### Number Fields
**Operators:**
- Is
- Is not
- Is greater than
- Is less than
- Is greater than or equal
- Is less than or equal
- Is between
- Is empty
- Is not empty

**Input:** Number input field or range inputs for "between"

## Available Filter Fields

The system currently supports filtering on these content fields:

- **Title** (Text)
- **Status** (Choice: Published, Draft, Schedule, Pending review)
- **Author** (Choice: John Doe, Jane Smith, Alice Johnson, Mark Wilson)
- **Space** (Choice: Discussions, Articles, Wishlist, Guidelines, Marketing)
- **Published Date** (Date)
- **CMS Type** (Choice: Discussion, Article, Wishlist, Guide, Strategy)
- **Tags** (Multi-choice: Discussion, new, me_too, community, featured, moderation)
- **Locked** (Toggle)

## Usage

### Basic Implementation

```tsx
import { ContentFilter, FilterRule } from './content-filter';
import { applyFilters } from './filter-logic';

function MyComponent() {
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [data, setData] = useState<Post[]>([]);
  
  // Apply filters to data
  const filteredData = applyFilters(data, filters);
  
  return (
    <div>
      <ContentFilter 
        filters={filters} 
        onFiltersChange={setFilters} 
      />
      {/* Render filtered data */}
    </div>
  );
}
```

### Integration with Content Table

The filter system is integrated into the content toolbar and automatically applies filters to the table data:

```tsx
<ContentToolbar
  table={table}
  isLoading={isLoading}
  showStatusFilter={showStatusFilter}
  selectedCmsType={selectedCmsType}
  filters={filters}
  onFiltersChange={setFilters}
/>
```

## Filter Logic

Filters use AND logic - all filters must pass for a record to be included in the results. The system:

1. Evaluates each filter rule against each data record
2. Returns only records that match ALL active filters
3. Handles different data types appropriately
4. Provides fallback behavior for edge cases

## Date Handling

The system provides comprehensive date filtering with:

- **Preset Options:** Today, Tomorrow, Yesterday, Last 7 days, etc.
- **Custom Dates:** Manual date selection
- **Relative Dates:** Today & Earlier, Overdue, Later than Today
- **Date Ranges:** Between two specific dates
- **Quarter-based:** Last quarter, Next quarter

## Extensibility

To add new filter fields:

1. Add the field definition to `FILTER_FIELDS` in `content-filter.tsx`
2. Add the field mapping in `applyFilterRule` function in `filter-logic.ts`
3. Ensure the field type has appropriate operators defined in `FILTER_OPERATORS`

## Performance

The filter system is optimized for client-side filtering of moderate datasets. For large datasets, consider:

- Server-side filtering
- Pagination with filters
- Debounced filter application
- Memoization of filter results 