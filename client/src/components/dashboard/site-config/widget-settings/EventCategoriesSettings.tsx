import React from 'react';
import { 
  Hash, 
  Square, 
  ChevronDown, 
  Layers, 
  CheckCircle 
} from 'lucide-react';
import { PropertyRow } from '../PropertyRow';

interface EventCategoriesSettingsProps {
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

export function EventCategoriesSettings({
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown
}: EventCategoriesSettingsProps) {
  return (
    <div className="space-y-2">
      <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
        <PropertyRow
          label="Display style"
          value="chips"
          fieldName="categoriesDisplayStyle"
          type="select"
          options={[
            { value: 'chips', label: 'Chips', icon: Hash },
            { value: 'buttons', label: 'Buttons', icon: Square },
            { value: 'dropdown', label: 'Dropdown', icon: ChevronDown }
          ]}
          onValueChange={() => {}}
          icon={Hash}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
        />

        <PropertyRow
          label="Show 'All' option"
          value={true}
          fieldName="categoriesShowAll"
          type="checkbox"
          onValueChange={() => {}}
          icon={Layers}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
        />

        <PropertyRow
          label="Max visible categories"
          value="6"
          fieldName="categoriesMaxVisible"
          type="select"
          options={[
            { value: '3', label: '3 categories', icon: Hash },
            { value: '6', label: '6 categories', icon: Hash },
            { value: '9', label: '9 categories', icon: Hash },
            { value: '12', label: '12 categories', icon: Hash }
          ]}
          onValueChange={() => {}}
          icon={Hash}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
        />

        <PropertyRow
          label="Allow multiple selection"
          value={false}
          fieldName="categoriesAllowMultiple"
          type="checkbox"
          onValueChange={() => {}}
          icon={CheckCircle}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
  );
} 