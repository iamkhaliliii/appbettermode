import { useState } from "react";
import { Info } from "lucide-react";
import { IconUploadDialog } from "@/components/shared/icons";
import { IconDisplay } from "@/components/shared/icons";
import { 
  PropertyRowProps, 
  CustomDropdown, 
  DateTimePicker, 
  UserSelector, 
  EventSelector,
  TagInput,
  TimezoneSelector,
  NumberInput,
  RepeatSelector,
  MultiSelect,
  MenuEditor
} from "./property-design-system-components";

export function PropertyRow({ 
  label, 
  value, 
  fieldName, 
  type = 'text',
  options = [],
  onValueChange,
  placeholder = "Empty",
  icon: Icon,
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown,
  description,
  disabled = false,
  isChild = false,
  isIconUpload = false,
  enableDropdownSearch = false,
  onAddNew,
  min,
  max,
  step,
  startDate
}: PropertyRowProps) {
  const [showDescription, setShowDescription] = useState(false);
  const [iconDialogOpen, setIconDialogOpen] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const isEditing = editingField === fieldName;
  const displayValue = value || "Empty";
  const isEmpty = !value;
  const isDescription = fieldName === 'description' || fieldName === 'sectionSubtitle' || fieldName.includes('description');
  const isSlug = fieldName === 'slug';
  const isCardStyle = fieldName === 'cardStyle';

  // Handle icon selection from dialog
  const handleIconSelect = (iconData: { 
    type: 'emoji' | 'lucide' | 'custom'; 
    value: string; 
    name?: string;
    color?: string;
  }) => {
    // Store the icon data as an object
    onValueChange(iconData);
  };

  // Parse icon data if it exists
  const getIconData = () => {
    if (!value) return null;
    
    // If it's already an object with type, return it
    if (typeof value === 'object' && value.type) {
      return value;
    }
    
    // If it's a string that looks like a URL, treat as custom
    if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('blob:'))) {
      return { type: 'custom', value, name: 'Custom icon' };
    }
    
    // If it's a single character, treat as emoji
    if (typeof value === 'string' && value.length <= 4) {
      return { type: 'emoji', value };
    }
    
    return null;
  };

  const iconData = getIconData();

  // Enhanced value change with visual feedback
  const handleValueChange = (newValue: any) => {
    setIsChanging(true);
    onValueChange(newValue);
    
    // Reset animation after transition
    setTimeout(() => {
      setIsChanging(false);
    }, 300);
  };

  return (
    <div className={isChild ? "relative" : ""}>
      {isChild && (
        <div className="absolute left-[1.1rem] top-0 bottom-0 w-px bg-gray-100 dark:bg-gray-600"></div>
      )}
      <div className={`flex rounded-md group transition-all duration-300 ${
        isChild 
          ? 'px-2 pl-9 hover:bg-gray-50 dark:hover:bg-gray-800/50' 
          : 'px-2 hover:bg-gray-50 dark:hover:bg-gray-800/50'
      } ${
        description && showDescription ? '' : 'border-b border-gray-100 dark:border-gray-800'
      } ${
        (isDescription || isSlug) && isEditing ? 'flex-col items-center py-2 space-y-2' : 'items-center justify-between min-h-[2.25rem] py-2'
      } ${
        isChanging && isCardStyle ? 'property-row-active scale-[1.02] bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20' : ''
      }`}>
        <div className={`text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2 ${
          (isDescription || isSlug) && isEditing ? 'w-full' : 'w-1/2 pr-2'
        }`}>
          {Icon && !isChild && (
            <div className="flex items-center justify-center w-5 h-5 rounded-md bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
              <Icon className="h-3 w-3 text-gray-600 dark:text-gray-400" />
            </div>
          )}
          <div className="flex items-center">
            <span className="truncate text-left font-medium">{label}</span>
            {description && (
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="ml-1 p-1 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                type="button"
              >
                <Info className="h-2.5 w-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </div>
        </div>
        <div className={`flex justify-end items-start pl-2 ${
          (isDescription || isSlug) && isEditing ? 'w-full' : 'w-1/2'
        }`}>
          {type === 'text' && (
            <>
              {isEditing ? (
                fieldName === 'slug' ? (
                  <div className="w-full flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md h-8">
                    <span className="text-xs text-gray-400 dark:text-gray-500 px-3 border-r border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 rounded-l-md h-full flex items-center">
                      yourdomain/
                    </span>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => onValueChange(e.target.value)}
                      onBlur={onFieldBlur}
                      onKeyDown={(e) => onKeyDown(e, fieldName)}
                      className="flex-1 h-full bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 text-left px-2"
                      autoFocus
                      placeholder="url-slug"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    onBlur={onFieldBlur}
                    onKeyDown={(e) => onKeyDown(e, fieldName)}
                    className="w-full h-8 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 outline-none text-gray-900 dark:text-gray-100 text-left"
                    autoFocus
                    placeholder="Enter value..."
                  />
                )
              ) : (
                <div
                  onClick={() => onFieldClick(fieldName)}
                  className={`text-sm cursor-pointer h-6 flex items-center justify-end rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors truncate text-right w-full mt-0.5 ${
                    isEmpty ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'
                  }`}
                  title={fieldName === 'slug' ? `yourdomain/${displayValue}` : displayValue}
                >
                  {fieldName === 'slug' && !isEmpty ? (
                    <div className="flex items-center gap-1 truncate">
                      <span className="text-xs text-gray-400 dark:text-gray-500">yourdomain/</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{value}</span>
                    </div>
                  ) : (
                    displayValue
                  )}
                </div>
              )}
            </>
          )}

          {type === 'textarea' && (
            <>
              {isEditing ? (
                <textarea
                  value={value}
                  onChange={(e) => onValueChange(e.target.value)}
                  onBlur={onFieldBlur}
                  onKeyDown={(e) => onKeyDown(e, fieldName)}
                  className={`w-full text-sm bg-transparent border outline-none text-gray-900 dark:text-gray-100 resize-none rounded-md px-3 py-2 ${
                    isDescription 
                      ? 'h-20 min-h-20 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-left' 
                      : 'h-6 overflow-hidden border-none text-right'
                  }`}
                  autoFocus
                  placeholder={fieldName === 'description' ? "Enter description..." : fieldName === 'sectionSubtitle' ? "Enter section subtitle..." : ""}
                />
              ) : (
                <div
                  onClick={() => onFieldClick(fieldName)}
                  className={`text-sm cursor-pointer flex items-start rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full ${
                    isEmpty ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'
                  } ${
                    isDescription ? 'py-1 text-left whitespace-pre-wrap break-words justify-start' : 'h-6 items-center truncate text-right justify-end'
                  }`}
                  title={!isDescription ? displayValue : undefined}
                >
                  {displayValue}
                </div>
              )}
            </>
          )}

          {type === 'select' && (
            <div className="w-full mt-0.5">
              <CustomDropdown
                key={`${fieldName}-${value}`}
                value={value}
                options={options}
                onChange={handleValueChange}
                placeholder="Select option"
                enableSearch={enableDropdownSearch}
                onAddNew={onAddNew}
              />
            </div>
          )}

          {type === 'upload' && (
            <div className="flex items-center gap-2 justify-end h-6 w-full mt-0.5">
              {isIconUpload ? (
                // Icon upload mode
                <>
                  {iconData ? (
                    <div className="flex items-center gap-2 h-6">
                      <IconDisplay iconData={iconData} size="sm" />
                      <button
                        onClick={() => onValueChange(null)}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex-shrink-0"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIconDialogOpen(true)}
                      className="text-sm text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer h-6 flex items-center justify-end rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors truncate w-full text-right"
                    >
                      Empty
                    </button>
                  )}
                </>
              ) : (
                // Regular file upload mode
                <>
                  {value ? (
                    <div className="flex items-center gap-2 h-6">
                      <span className="text-sm text-gray-900 dark:text-gray-100 truncate">Uploaded</span>
                      <img src={value} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />
                      <button
                        onClick={() => onValueChange('')}
                        className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex-shrink-0"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            onValueChange(URL.createObjectURL(file));
                          }
                        };
                        input.click();
                      }}
                      className="text-sm text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer h-6 flex items-center justify-end rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors truncate w-full text-right"
                    >
                      Empty
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {type === 'checkbox' && (
            <div className="flex items-center justify-end h-6 w-full mt-0.5">
              <div 
                onClick={() => !disabled && onValueChange(!value)}
                className={`relative inline-flex h-3.5 w-6 items-center rounded-full transition-colors ${
                  disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                } ${
                  value 
                    ? 'bg-primary-600' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <div 
                  className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-3' : 'translate-x-0.5'
                  }`}
                />
              </div>
            </div>
          )}

          {type === 'datetime' && (
            <div className="w-full mt-0.5">
              <DateTimePicker
                value={value}
                onChange={onValueChange}
                placeholder="Select date & time"
              />
            </div>
          )}

          {type === 'users' && (
            <div className="w-full mt-0.5">
              <UserSelector
                value={value || []}
                onChange={onValueChange}
                placeholder="Select users"
              />
            </div>
          )}

          {type === 'events' && (
            <div className="w-full mt-0.5">
              <EventSelector
                value={value || []}
                onChange={onValueChange}
                placeholder="Select events"
              />
            </div>
          )}

          {type === 'tags' && (
            <div className="w-full mt-0.5">
              <TagInput
                value={value || []}
                onChange={onValueChange}
                placeholder="Add tags"
              />
            </div>
          )}

          {type === 'timezone' && (
            <div className="w-full mt-0.5">
              <TimezoneSelector
                value={value || ''}
                onChange={onValueChange}
                placeholder="Select timezone"
              />
            </div>
          )}

          {type === 'number' && (
            <div className="w-full mt-0.5">
              <NumberInput
                value={value || 0}
                onChange={onValueChange}
                placeholder={placeholder}
                min={min}
                max={max}
                step={step}
              />
            </div>
          )}

          {type === 'repeat' && (
            <div className="w-full mt-0.5">
              <RepeatSelector
                value={value}
                onChange={onValueChange}
                startDate={startDate}
              />
            </div>
          )}

          {type === 'multiselect' && (
            <div className="w-full mt-0.5">
              <MultiSelect
                value={value || []}
                onChange={onValueChange}
                options={options}
                placeholder="Select options"
                enableSearch={enableDropdownSearch}
              />
            </div>
          )}

          {type === 'menu' && (
            <div className="w-full mt-0.5">
              <MenuEditor
                value={value || []}
                onChange={onValueChange}
                placeholder="Manage menu items"
              />
            </div>
          )}
        </div>
      </div>
      {description && showDescription && (
        <div className={`pb-3 pr-20 border-b border-gray-100 dark:border-gray-800 ${
          isChild ? 'px-3 pl-8' : 'px-3'
        }`}>
          <div className="text-[0.75rem] text-gray-400 dark:text-gray-500 leading-4">
            {description}
          </div>
        </div>
      )}

      {/* Icon Upload Dialog */}
      {isIconUpload && (
        <IconUploadDialog
          open={iconDialogOpen}
          onOpenChange={setIconDialogOpen}
          onIconSelect={handleIconSelect}
          currentValue={iconData?.value}
        />
      )}
    </div>
  );
} 