import { Post } from './types';
import { FilterRule } from './content-filter';

// Helper function to get nested property value
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Helper function to normalize date for comparison
const normalizeDate = (date: string | Date): Date => {
  if (typeof date === 'string') {
    // Handle different date formats
    if (date === 'Not published') return new Date(0); // Very old date for unpublished
    return new Date(date);
  }
  return date;
};

// Helper function to get date from preset
const getDateFromPreset = (preset: string): Date => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (preset) {
    case 'today':
      return today;
    case 'tomorrow':
      return new Date(today.getTime() + 24 * 60 * 60 * 1000);
    case 'yesterday':
      return new Date(today.getTime() - 24 * 60 * 60 * 1000);
    case 'one_week_ago':
      return new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'one_week_from_now':
      return new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    case 'one_month_ago':
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      return lastMonth;
    case 'one_month_from_now':
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      return nextMonth;
    case 'last_7_days':
      return new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'next_7_days':
      return new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    case 'last_month':
      const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      return prevMonth;
    case 'next_month':
      const futureMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      return futureMonth;
    case 'this_year':
      return new Date(today.getFullYear(), 0, 1);
    case 'last_year':
      return new Date(today.getFullYear() - 1, 0, 1);
    case 'next_year':
      return new Date(today.getFullYear() + 1, 0, 1);
    default:
      return today;
  }
};

// Helper function to check relative date conditions
const checkRelativeDate = (date: Date, condition: string): boolean => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (condition) {
    case 'today_and_earlier':
      return date <= today;
    case 'overdue':
      return date < today;
    case 'later_than_today':
      return date > today;
    case 'last_quarter':
      const lastQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 - 3, 1);
      return date >= lastQuarter && date < new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    case 'next_quarter':
      const nextQuarter = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 1);
      return date >= new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 3, 1) && date < new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 + 6, 1);
    default:
      return false;
  }
};

// Main function to apply a single filter rule
const applyFilterRule = (post: Post, rule: FilterRule): boolean => {
  let fieldValue: any;
  
  // Get the field value based on the field key
  switch (rule.field) {
    case 'title':
      fieldValue = post.title;
      break;
    case 'status':
      fieldValue = post.status;
      break;
    case 'author':
      fieldValue = post.author.name;
      break;
    case 'space':
      fieldValue = post.space.name;
      break;
    case 'publishedAt':
      fieldValue = post.publishedAt;
      break;
    case 'cmsModel':
      fieldValue = post.cmsModel;
      break;
    case 'tags':
      fieldValue = post.tags;
      break;
    case 'locked':
      fieldValue = post.locked;
      break;
    default:
      fieldValue = getNestedValue(post, rule.field);
  }

  // Apply the filter based on field type and operator
  switch (rule.fieldType) {
    case 'text':
      return applyTextFilter(fieldValue, rule.operator, rule.value);
    case 'date':
      return applyDateFilter(fieldValue, rule.operator, rule.value);
    case 'choice':
      return applyChoiceFilter(fieldValue, rule.operator, rule.value);
    case 'multi-choice':
      return applyMultiChoiceFilter(fieldValue, rule.operator, rule.value);
    case 'toggle':
      return applyToggleFilter(fieldValue, rule.operator);
    case 'number':
      return applyNumberFilter(fieldValue, rule.operator, rule.value);
    default:
      return true;
  }
};

// Text field filter logic
const applyTextFilter = (fieldValue: string, operator: string, filterValue: string): boolean => {
  const value = fieldValue?.toString().toLowerCase() || '';
  const filter = filterValue?.toString().toLowerCase() || '';

  switch (operator) {
    case 'is':
      return value === filter;
    case 'is_not':
      return value !== filter;
    case 'contains':
      return value.includes(filter);
    case 'does_not_contain':
      return !value.includes(filter);
    case 'starts_with':
      return value.startsWith(filter);
    case 'ends_with':
      return value.endsWith(filter);
    case 'is_empty':
      return !value || value.trim() === '';
    case 'is_not_empty':
      return Boolean(value && value.trim() !== '');
    default:
      return true;
  }
};

// Date field filter logic
const applyDateFilter = (fieldValue: string | Date, operator: string, filterValue: any): boolean => {
  if (operator === 'is_empty') {
    return !fieldValue || fieldValue === 'Not published';
  }
  if (operator === 'is_not_empty' || operator === 'is_set') {
    return Boolean(fieldValue && fieldValue !== 'Not published');
  }
  if (operator === 'is_not_set') {
    return !fieldValue || fieldValue === 'Not published';
  }

  const date = normalizeDate(fieldValue);
  
  switch (operator) {
    case 'is':
    case 'is_not':
      let compareDate: Date;
      if (filterValue?.preset && filterValue.preset !== 'custom') {
        compareDate = getDateFromPreset(filterValue.preset);
      } else {
        compareDate = filterValue?.date ? new Date(filterValue.date) : new Date();
      }
      const isSameDay = date.toDateString() === compareDate.toDateString();
      return operator === 'is' ? isSameDay : !isSameDay;
      
    case 'is_before':
      const beforeDate = filterValue?.preset && filterValue.preset !== 'custom' 
        ? getDateFromPreset(filterValue.preset)
        : new Date(filterValue?.date || filterValue);
      return date < beforeDate;
      
    case 'is_after':
      const afterDate = filterValue?.preset && filterValue.preset !== 'custom'
        ? getDateFromPreset(filterValue.preset)
        : new Date(filterValue?.date || filterValue);
      return date > afterDate;
      
    case 'is_on_or_before':
      const onOrBeforeDate = filterValue?.preset && filterValue.preset !== 'custom'
        ? getDateFromPreset(filterValue.preset)
        : new Date(filterValue?.date || filterValue);
      return date <= onOrBeforeDate;
      
    case 'is_on_or_after':
      const onOrAfterDate = filterValue?.preset && filterValue.preset !== 'custom'
        ? getDateFromPreset(filterValue.preset)
        : new Date(filterValue?.date || filterValue);
      return date >= onOrAfterDate;
      
    case 'is_between':
      const fromDate = new Date(filterValue?.from);
      const toDate = new Date(filterValue?.to);
      return date >= fromDate && date <= toDate;
      
    case 'is_relative_to_today':
      return checkRelativeDate(date, filterValue);
      
    default:
      return true;
  }
};

// Choice field filter logic
const applyChoiceFilter = (fieldValue: any, operator: string, filterValue: string): boolean => {
  const value = fieldValue?.toString() || '';
  
  switch (operator) {
    case 'is':
      return value === filterValue;
    case 'is_not':
      return value !== filterValue;
    case 'is_empty':
      return !value || value.trim() === '';
    case 'is_not_empty':
    case 'has_any_value':
      return Boolean(value && value.trim() !== '');
    case 'is_unknown':
      return !value || value === 'unknown' || value === 'undefined';
    default:
      return true;
  }
};

// Multi-choice field filter logic
const applyMultiChoiceFilter = (fieldValue: string[], operator: string, filterValue: string[]): boolean => {
  const values = Array.isArray(fieldValue) ? fieldValue : [];
  const filters = Array.isArray(filterValue) ? filterValue : [];
  
  switch (operator) {
    case 'is':
      return values.length === filters.length && filters.every(f => values.includes(f));
    case 'is_not':
      return !(values.length === filters.length && filters.every(f => values.includes(f)));
    case 'contains':
      return filters.some(f => values.includes(f));
    case 'does_not_contain':
      return !filters.some(f => values.includes(f));
    case 'is_empty':
      return values.length === 0;
    case 'is_not_empty':
    case 'has_any_value':
      return values.length > 0;
    case 'is_unknown':
      return !values || values.length === 0;
    default:
      return true;
  }
};

// Toggle field filter logic
const applyToggleFilter = (fieldValue: boolean, operator: string): boolean => {
  switch (operator) {
    case 'is_true':
      return fieldValue === true;
    case 'is_false':
      return fieldValue === false;
    default:
      return true;
  }
};

// Number field filter logic
const applyNumberFilter = (fieldValue: any, operator: string, filterValue: any): boolean => {
  const value = parseFloat(fieldValue?.toString() || '0');
  
  if (operator === 'is_empty') {
    return !fieldValue && fieldValue !== 0;
  }
  if (operator === 'is_not_empty') {
    return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
  }
  
  switch (operator) {
    case 'is':
      return value === parseFloat(filterValue);
    case 'is_not':
      return value !== parseFloat(filterValue);
    case 'is_greater_than':
      return value > parseFloat(filterValue);
    case 'is_less_than':
      return value < parseFloat(filterValue);
    case 'is_greater_than_or_equal':
      return value >= parseFloat(filterValue);
    case 'is_less_than_or_equal':
      return value <= parseFloat(filterValue);
    case 'is_between':
      const from = parseFloat(filterValue?.from || 0);
      const to = parseFloat(filterValue?.to || 0);
      return value >= from && value <= to;
    default:
      return true;
  }
};

// Main function to apply all filters to the data
export const applyFilters = (data: Post[], filters: FilterRule[]): Post[] => {
  if (!filters || filters.length === 0) {
    return data;
  }

  return data.filter(post => {
    // All filters must pass (AND logic)
    return filters.every(filter => applyFilterRule(post, filter));
  });
}; 