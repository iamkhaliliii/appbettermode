import React, { useState } from 'react';
import { 
  Plus,
  Trash2,
  Type,
  AlignLeft,
  FileText,
  Check,
  ChevronDown,
  ChevronRight,
  Edit3
} from 'lucide-react';
import { PropertyRow } from '../PropertyRow';
import { Button } from '../../../ui/primitives/button';

interface AccordionItem {
  id: string;
  title: string;
  description: string;
  isDefault: boolean;
}

interface AccordionsWidgetSettingsProps {
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

export function AccordionsWidgetSettings({
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown
}: AccordionsWidgetSettingsProps) {
  const [sectionTitle, setSectionTitle] = useState('Accordion Section');
  const [sectionDescription, setSectionDescription] = useState('Section description');
  const [items, setItems] = useState<AccordionItem[]>([
    {
      id: '1',
      title: 'First Accordion Item',
      description: 'Description for the first accordion item',
      isDefault: true
    },
    {
      id: '2',
      title: 'Second Accordion Item', 
      description: 'Description for the second accordion item',
      isDefault: false
    }
  ]);

  const addAccordionItem = () => {
    const newItem: AccordionItem = {
      id: Date.now().toString(),
      title: 'New Accordion Item',
      description: 'Description for new accordion item',
      isDefault: false
    };
    setItems([...items, newItem]);
  };

  const removeAccordionItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItemTitle = (id: string, title: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, title } : item
    ));
  };

  const updateItemDescription = (id: string, description: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, description } : item
    ));
  };

  const toggleDefault = (id: string) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, isDefault: !item.isDefault }
        : { ...item, isDefault: false } // Only one can be default
    ));
  };

  return (
    <div className="space-y-4">
      {/* Section Settings */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Section Settings
        </h4>
        
        <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
          <PropertyRow
            label="Section Title"
            value={sectionTitle}
            fieldName="sectionTitle"
            type="text"
            onValueChange={setSectionTitle}
            placeholder="Enter section title"
            icon={Type}
            editingField={editingField}
            onFieldClick={onFieldClick}
            onFieldBlur={onFieldBlur}
            onKeyDown={onKeyDown}
            description="Title for the entire accordion section"
          />

          <PropertyRow
            label="Section description"
            value={sectionDescription}
            fieldName="sectionDescription"
            type="textarea"
            onValueChange={setSectionDescription}
            placeholder="Enter description"
            icon={AlignLeft}
            editingField={editingField}
            onFieldClick={onFieldClick}
            onFieldBlur={onFieldBlur}
            onKeyDown={onKeyDown}
            description="Description for the entire accordion section"
          />
        </div>
      </div>

      {/* Accordion Items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <ChevronDown className="w-4 h-4" />
            Accordion Items ({items.length})
          </h4>
          <Button
            onClick={addAccordionItem}
            size="sm"
            className="h-7 px-2 py-1 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id}>
              {index > 0 && <div className="border-t border-gray-200" />}
              
              <div className="space-y-2 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    Item {index + 1}
                  </span>
                  
                  {items.length > 1 && (
                    <button
                      onClick={() => removeAccordionItem(item.id)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
                  <PropertyRow
                    label="Title"
                    value={item.title}
                    fieldName={`accordionItem${item.id}Title`}
                    type="text"
                    onValueChange={(value) => updateItemTitle(item.id, value)}
                    placeholder="Enter accordion title"
                    icon={Type}
                    editingField={editingField}
                    onFieldClick={onFieldClick}
                    onFieldBlur={onFieldBlur}
                    onKeyDown={onKeyDown}
                    description={`Title for accordion item ${index + 1}`}
                  />
                  
                  <PropertyRow
                    label="Description"
                    value={item.description}
                    fieldName={`accordionItem${item.id}description`}
                    type="textarea"
                    onValueChange={(value) => updateItemDescription(item.id, value)}
                    placeholder="Enter description"
                    icon={AlignLeft}
                    editingField={editingField}
                    onFieldClick={onFieldClick}
                    onFieldBlur={onFieldBlur}
                    onKeyDown={onKeyDown}
                    description={`Description for accordion item ${index + 1}`}
                  />

                  <PropertyRow
                    label="Default"
                    value={item.isDefault}
                    fieldName={`accordionItem${item.id}default`}
                    type="checkbox"
                    onValueChange={(value) => toggleDefault(item.id)}
                    icon={Check}
                    editingField={editingField}
                    onFieldClick={onFieldClick}
                    onFieldBlur={onFieldBlur}
                    onKeyDown={onKeyDown}
                    description={`Set this item to open by default`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <ChevronRight className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No accordion items</p>
            <p className="text-xs text-gray-400">Click "Add Item" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
} 