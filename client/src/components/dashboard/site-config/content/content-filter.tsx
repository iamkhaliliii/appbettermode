import React, { useState } from "react";
import { Button } from "@/components/ui/primitives";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/forms";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives";
import { Input } from "@/components/ui/primitives";
import { Checkbox } from "@/components/ui/primitives";
import { Calendar } from "@/components/ui/primitives";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/primitives";
import {
  Filter,
  X,
  CalendarIcon,
  ChevronDown,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Filter field types
export type FilterFieldType = 'text' | 'date' | 'choice' | 'multi-choice' | 'toggle' | 'number';

// Filter operators for different field types
export const FILTER_OPERATORS = {
  text: [
    { value: 'is', label: 'Is' },
    { value: 'is_not', label: 'Is not' },
    { value: 'contains', label: 'Contains' },
    { value: 'does_not_contain', label: 'Does not contain' },
    { value: 'starts_with', label: 'Starts with' },
    { value: 'ends_with', label: 'Ends with' },
    { value: 'is_empty', label: 'Is empty' },
    { value: 'is_not_empty', label: 'Is not empty' },
  ],
  date: [
    { value: 'is', label: 'Is' },
    { value: 'is_not', label: 'Is not' },
    { value: 'is_before', label: 'Is before' },
    { value: 'is_after', label: 'Is after' },
    { value: 'is_on_or_before', label: 'Is on or before' },
    { value: 'is_on_or_after', label: 'Is on or after' },
    { value: 'is_between', label: 'Is between' },
    { value: 'is_relative_to_today', label: 'Is relative to today' },
    { value: 'is_empty', label: 'Is empty' },
    { value: 'is_not_empty', label: 'Is not empty' },
    { value: 'is_set', label: 'Is set' },
    { value: 'is_not_set', label: 'Is not set' },
  ],
  choice: [
    { value: 'is', label: 'Is' },
    { value: 'is_not', label: 'Is not' },
    { value: 'is_empty', label: 'Is empty' },
    { value: 'is_not_empty', label: 'Is not empty' },
    { value: 'has_any_value', label: 'Has any value' },
    { value: 'is_unknown', label: 'Is unknown' },
  ],
  'multi-choice': [
    { value: 'is', label: 'Is' },
    { value: 'is_not', label: 'Is not' },
    { value: 'contains', label: 'Contains' },
    { value: 'does_not_contain', label: 'Does not contain' },
    { value: 'is_empty', label: 'Is empty' },
    { value: 'is_not_empty', label: 'Is not empty' },
    { value: 'has_any_value', label: 'Has any value' },
    { value: 'is_unknown', label: 'Is unknown' },
  ],
  toggle: [
    { value: 'is_true', label: 'Is true' },
    { value: 'is_false', label: 'Is false' },
  ],
  number: [
    { value: 'is', label: 'Is' },
    { value: 'is_not', label: 'Is not' },
    { value: 'is_greater_than', label: 'Is greater than' },
    { value: 'is_less_than', label: 'Is less than' },
    { value: 'is_greater_than_or_equal', label: 'Is greater than or equal' },
    { value: 'is_less_than_or_equal', label: 'Is less than or equal' },
    { value: 'is_between', label: 'Is between' },
    { value: 'is_empty', label: 'Is empty' },
    { value: 'is_not_empty', label: 'Is not empty' },
  ],
};

// Predefined date options
export const DATE_PRESETS = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'one_week_ago', label: 'One week ago' },
  { value: 'one_week_from_now', label: 'One week from now' },
  { value: 'one_month_ago', label: 'One month ago' },
  { value: 'one_month_from_now', label: 'One month from now' },
  { value: 'last_7_days', label: 'Last 7 days' },
  { value: 'next_7_days', label: 'Next 7 days' },
  { value: 'last_month', label: 'Last month' },
  { value: 'next_month', label: 'Next month' },
  { value: 'this_year', label: 'This year' },
  { value: 'last_year', label: 'Last year' },
  { value: 'next_year', label: 'Next year' },
  { value: 'custom', label: 'Custom date' },
];

// Relative date options
export const RELATIVE_DATE_OPTIONS = [
  { value: 'today_and_earlier', label: 'Today & Earlier' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'later_than_today', label: 'Later than Today' },
  { value: 'last_quarter', label: 'Last quarter' },
  { value: 'next_quarter', label: 'Next quarter' },
];

// Available filter fields
export const FILTER_FIELDS = [
  { key: 'title', label: 'Title', type: 'text' as FilterFieldType },
  { key: 'status', label: 'Status', type: 'choice' as FilterFieldType, options: ['Published', 'Draft', 'Schedule', 'Pending review'] },
  { key: 'author', label: 'Author', type: 'choice' as FilterFieldType, options: ['John Doe', 'Jane Smith', 'Alice Johnson', 'Mark Wilson'] },
  { key: 'space', label: 'Space', type: 'choice' as FilterFieldType, options: ['Discussions', 'Articles', 'Wishlist', 'Guidelines', 'Marketing'] },
  { key: 'publishedAt', label: 'Published Date', type: 'date' as FilterFieldType },
  { key: 'cmsModel', label: 'CMS Type', type: 'choice' as FilterFieldType, options: ['Discussion', 'Article', 'Wishlist', 'Guide', 'Strategy'] },
  { key: 'tags', label: 'Tags', type: 'multi-choice' as FilterFieldType, options: ['Discussion', 'new', 'me_too', 'community', 'featured', 'moderation'] },
  { key: 'locked', label: 'Locked', type: 'toggle' as FilterFieldType },
];

export interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: any;
  fieldType: FilterFieldType;
}

interface ContentFilterProps {
  filters: FilterRule[];
  onFiltersChange: (filters: FilterRule[]) => void;
  showStatusFilter?: boolean;
  selectedCmsType?: string | null;
  activeTab?: string;
}

export const ContentFilter: React.FC<ContentFilterProps> = ({
  filters,
  onFiltersChange,
  showStatusFilter = false,
  selectedCmsType = null,
  activeTab = 'all'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newFilter, setNewFilter] = useState<Partial<FilterRule>>({});

  // Get status name based on active tab
  const getStatusName = () => {
    switch (activeTab) {
      case 'published':
        return 'Published';
      case 'scheduled':
        return 'Schedule';
      case 'drafts':
        return 'Draft';
      case 'pending':
        return 'Pending review';
      default:
        return 'Published';
    }
  };

  // Create a combined filters array that includes the CMS type filter when active
  const getAllFilters = () => {
    const allFilters = [...filters];
    
    // Add status filter if showStatusFilter is active and not already in filters
    if (showStatusFilter) {
      const hasStatusFilter = filters.some(f => f.field === 'status');
      if (!hasStatusFilter) {
        allFilters.push({
          id: 'status-auto',
          field: 'status',
          operator: 'is',
          value: getStatusName(),
          fieldType: 'choice' as FilterFieldType
        });
      }
    }
    
    // Add CMS type filter if selectedCmsType is active and not already in filters
    if (selectedCmsType) {
      const hasCmsTypeFilter = filters.some(f => f.field === 'cmsModel');
      if (!hasCmsTypeFilter) {
        allFilters.push({
          id: 'cms-type-auto',
          field: 'cmsModel',
          operator: 'is',
          value: selectedCmsType.charAt(0).toUpperCase() + selectedCmsType.slice(1),
          fieldType: 'choice' as FilterFieldType
        });
      }
    }
    
    return allFilters;
  };

  const allFilters = getAllFilters();

  const addFilter = () => {
    if (newFilter.field && newFilter.operator) {
      const filter: FilterRule = {
        id: Date.now().toString(),
        field: newFilter.field,
        operator: newFilter.operator,
        value: newFilter.value || '',
        fieldType: FILTER_FIELDS.find(f => f.key === newFilter.field)?.type || 'text'
      };
      onFiltersChange([...filters, filter]);
      setNewFilter({});
    }
  };

  const removeFilter = (filterId: string) => {
    // Don't allow removing the auto-generated CMS type filter or status filter
    if (filterId === 'cms-type-auto' || filterId === 'status-auto') {
      return;
    }
    onFiltersChange(filters.filter(f => f.id !== filterId));
  };

  const updateFilter = (filterId: string, updates: Partial<FilterRule>) => {
    onFiltersChange(filters.map(f => f.id === filterId ? { ...f, ...updates } : f));
  };

  const selectedField = FILTER_FIELDS.find(f => f.key === newFilter.field);
  const availableOperators = selectedField ? FILTER_OPERATORS[selectedField.type] : [];

  const needsValueInput = (operator: string) => {
    return !['is_empty', 'is_not_empty', 'has_any_value', 'is_unknown', 'is_set', 'is_not_set', 'is_true', 'is_false'].includes(operator);
  };

  const renderValueInput = (filter: FilterRule | Partial<FilterRule>, isNew = false) => {
    const field = FILTER_FIELDS.find(f => f.key === filter.field);
    if (!field || !filter.operator || !needsValueInput(filter.operator)) return null;

    const updateValue = (value: any) => {
      if (isNew) {
        setNewFilter({ ...newFilter, value });
      } else {
        updateFilter(filter.id!, { value });
      }
    };

    switch (field.type) {
      case 'text':
        return (
          <Input
            placeholder="Enter value..."
            value={filter.value || ''}
            onChange={(e) => updateValue(e.target.value)}
            className="h-7 text-xs flex-1 min-w-0 border-blue-200 dark:border-blue-700 focus:border-blue-400 dark:focus:border-blue-500"
          />
        );

      case 'number':
        if (filter.operator === 'is_between') {
          return (
            <div className="flex items-center gap-1.5 flex-1">
              <Input
                type="number"
                placeholder="From"
                value={filter.value?.from || ''}
                onChange={(e) => updateValue({ ...filter.value, from: e.target.value })}
                className="h-7 text-xs flex-1 border-blue-200 dark:border-blue-700 focus:border-blue-400 dark:focus:border-blue-500"
              />
              <span className="text-blue-400 dark:text-blue-500 text-xs shrink-0">to</span>
              <Input
                type="number"
                placeholder="To"
                value={filter.value?.to || ''}
                onChange={(e) => updateValue({ ...filter.value, to: e.target.value })}
                className="h-7 text-xs flex-1 border-blue-200 dark:border-blue-700 focus:border-blue-400 dark:focus:border-blue-500"
              />
            </div>
          );
        }
        return (
          <Input
            type="number"
            placeholder="Enter number..."
            value={filter.value || ''}
            onChange={(e) => updateValue(e.target.value)}
            className="h-7 text-xs flex-1 min-w-0 border-blue-200 dark:border-blue-700 focus:border-blue-400 dark:focus:border-blue-500"
          />
        );

      case 'date':
        if (filter.operator === 'is_relative_to_today') {
          return (
            <Select value={filter.value} onValueChange={updateValue}>
              <SelectTrigger className="h-7 text-xs flex-1 border-blue-200 dark:border-blue-700 focus:border-blue-400 dark:focus:border-blue-500">
                <SelectValue placeholder="Select option..." />
              </SelectTrigger>
              <SelectContent>
                {RELATIVE_DATE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value} className="text-xs">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }

        if (filter.operator === 'is_between') {
          return (
            <div className="flex items-center gap-1.5 flex-1">
              <DatePicker
                value={filter.value?.from}
                onChange={(date) => updateValue({ ...filter.value, from: date })}
                placeholder="From"
              />
              <span className="text-blue-400 dark:text-blue-500 text-xs shrink-0">to</span>
              <DatePicker
                value={filter.value?.to}
                onChange={(date) => updateValue({ ...filter.value, to: date })}
                placeholder="To"
              />
            </div>
          );
        }

        return (
          <div className="flex items-center gap-1.5 flex-1">
            <Select 
              value={filter.value?.preset || 'custom'} 
              onValueChange={(preset) => updateValue({ ...filter.value, preset })}
            >
              <SelectTrigger className="h-7 text-xs flex-1 border-blue-200 dark:border-blue-700 focus:border-blue-400 dark:focus:border-blue-500">
                <SelectValue placeholder="Preset..." />
              </SelectTrigger>
              <SelectContent>
                {DATE_PRESETS.map(preset => (
                  <SelectItem key={preset.value} value={preset.value} className="text-xs">
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(filter.value?.preset === 'custom' || !filter.value?.preset) && (
              <DatePicker
                value={filter.value?.date}
                onChange={(date) => updateValue({ ...filter.value, date })}
                placeholder="Date"
              />
            )}
          </div>
        );

      case 'choice':
        return (
          <Select value={filter.value} onValueChange={updateValue}>
            <SelectTrigger className="h-7 text-xs flex-1 border-blue-200 dark:border-blue-700 focus:border-blue-400 dark:focus:border-blue-500">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option} value={option} className="text-xs">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multi-choice':
        return (
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full h-7 justify-between text-xs border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600">
                  {filter.value?.length > 0 ? `${filter.value.length} selected` : 'Select...'}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2">
                <div className="space-y-1.5">
                  {field.options?.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={filter.value?.includes(option) || false}
                        onCheckedChange={(checked) => {
                          const currentValues = filter.value || [];
                          if (checked) {
                            updateValue([...currentValues, option]);
                          } else {
                            updateValue(currentValues.filter((v: string) => v !== option));
                          }
                        }}
                        className="h-3 w-3"
                      />
                      <label htmlFor={option} className="text-xs">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button 
            className={cn(
              "relative inline-flex items-center justify-center h-7 px-2 rounded-md border border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 gap-1.5",
              (filters.length > 0 || showStatusFilter || selectedCmsType) && "text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/20 border-blue-200/50 dark:border-blue-800/50"
            )}
          >
            <Filter className="h-3.5 w-3.5" />
            
            {(filters.length > 0 || showStatusFilter || selectedCmsType) && (
              <div className="inline-flex items-center text-xs font-medium gap-1">
                {filters.length > 0 && (
                  <span>{filters.length} filter{filters.length !== 1 ? 's' : ''}</span>
                )}
                {(filters.length > 0 && (showStatusFilter || selectedCmsType)) && (
                  <span className="text-blue-400 dark:text-blue-500">•</span>
                )}
                {showStatusFilter && (
                  <span>Status: {getStatusName()}</span>
                )}
                {(showStatusFilter && selectedCmsType) && (
                  <span className="text-blue-400 dark:text-blue-500">•</span>
                )}
                {selectedCmsType && (
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {selectedCmsType.charAt(0).toUpperCase() + selectedCmsType.slice(1)}
                  </span>
                )}
              </div>
            )}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-80 p-0 border-0 shadow-lg">
          <div className="p-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Filters</h3>
              {filters.length > 0 && (
                <button
                  onClick={() => onFiltersChange([])}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
          
          {/* Existing filters */}
          {allFilters.length > 0 && (
            <div className="p-3 space-y-2 border-b border-gray-100 dark:border-gray-800">
              {allFilters.map((filter) => {
                const field = FILTER_FIELDS.find(f => f.key === filter.field);
                const operator = FILTER_OPERATORS[filter.fieldType]?.find(op => op.value === filter.operator);
                
                return (
                  <div key={filter.id} className={cn(
                    "group flex items-center gap-2 p-2 rounded-md border transition-colors",
                    (filter.id === 'cms-type-auto' || filter.id === 'status-auto')
                      ? "bg-gray-50/50 dark:bg-gray-800/20 border-gray-200/50 dark:border-gray-700/50" 
                      : "bg-blue-50/50 dark:bg-blue-900/20 border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600"
                  )}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-medium text-blue-700 dark:text-blue-300 truncate">{field?.label}</span>
                        <span className="text-blue-500 dark:text-blue-400 shrink-0">{operator?.label.toLowerCase()}</span>
                        {needsValueInput(filter.operator) && (
                          <div className="flex-1 min-w-0">
                            {renderValueInput(filter)}
                          </div>
                        )}
                      </div>
                    </div>
                    {(filter.id !== 'cms-type-auto' && filter.id !== 'status-auto') && (
                      <button
                        onClick={() => removeFilter(filter.id)}
                        className="opacity-0 group-hover:opacity-100 h-5 w-5 flex items-center justify-center rounded text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-all"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Add new filter */}
          <div className="p-3 space-y-3">
            {/* Field selection */}
            <Select value={newFilter.field} onValueChange={(field) => setNewFilter({ field, operator: '', value: '' })}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select field..." />
              </SelectTrigger>
              <SelectContent>
                {FILTER_FIELDS.map(field => (
                  <SelectItem key={field.key} value={field.key} className="text-xs">
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Operator selection */}
            {newFilter.field && (
              <Select value={newFilter.operator} onValueChange={(operator) => setNewFilter({ ...newFilter, operator, value: '' })}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select condition..." />
                </SelectTrigger>
                <SelectContent>
                  {availableOperators.map(operator => (
                    <SelectItem key={operator.value} value={operator.value} className="text-xs">
                      {operator.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Value input */}
            {newFilter.field && newFilter.operator && needsValueInput(newFilter.operator) && (
              <div className="space-y-2">
                {renderValueInput(newFilter, true)}
              </div>
            )}

            {/* Add button */}
            {newFilter.field && newFilter.operator && (
              <Button 
                onClick={addFilter} 
                size="sm" 
                className="w-full h-8 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white border-0"
              >
                Add Filter
              </Button>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Date picker component
const DatePicker: React.FC<{
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}> = ({ value, onChange, placeholder = "Pick a date" }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-7 flex-1 justify-start text-left font-normal text-xs border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-1.5 h-3 w-3" />
          {value ? format(value, "MMM d") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}; 