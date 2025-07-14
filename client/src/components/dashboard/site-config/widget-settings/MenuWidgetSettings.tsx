import React, { useState } from 'react';
import { 
  Menu,
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Plus,
  Trash2,
  ArrowUpDown,
  MoreHorizontal,
  ExternalLink,
  Type,
  Navigation
} from 'lucide-react';
import { PropertyRow } from '../PropertyRow';
import { Button } from '../../../ui/primitives/button';

interface MenuWidgetSettingsProps {
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

interface MenuItem {
  id: string;
  title: string;
  url: string;
  openInNewTab: boolean;
}

export function MenuWidgetSettings({
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown
}: MenuWidgetSettingsProps) {
  const [menuType, setMenuType] = useState('horizontal');
  const [alignment, setAlignment] = useState('left');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: '1', title: 'Home', url: '/', openInNewTab: false },
    { id: '2', title: 'About', url: '/about', openInNewTab: false }
  ]);

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      title: 'New Item',
      url: '/',
      openInNewTab: false
    };
    setMenuItems([...menuItems, newItem]);
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const updateMenuItem = (id: string, field: keyof MenuItem, value: any) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="space-y-2">
      <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
        <PropertyRow
          label="Menu Type"
          value={menuType}
          fieldName="menuType"
          type="select"
          options={[
            { value: 'horizontal', label: 'Horizontal', icon: MoreHorizontal },
            { value: 'vertical', label: 'Vertical', icon: Menu }
          ]}
          onValueChange={setMenuType}
          icon={Navigation}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Layout orientation of the menu"
        />

        <PropertyRow
          label="Alignment"
          value={alignment}
          fieldName="menuAlignment"
          type="select"
          options={[
            { value: 'left', label: 'Left', icon: AlignLeft },
            { value: 'center', label: 'Center', icon: AlignCenter },
            { value: 'right', label: 'Right', icon: AlignRight }
          ]}
          onValueChange={setAlignment}
          icon={AlignLeft}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="How the menu should be aligned"
        />
      </div>

      {/* Menu Items Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Menu className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Menu Items</span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
              {menuItems.length}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addMenuItem}
            className="h-7 px-2 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Item
          </Button>
        </div>

        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium text-gray-700">Menu Item</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMenuItem(item.id)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
                <PropertyRow
                  label="Title"
                  value={item.title}
                  fieldName={`menuItem-${item.id}-title`}
                  type="text"
                  onValueChange={(value) => updateMenuItem(item.id, 'title', value)}
                  placeholder="Menu item title"
                  icon={Type}
                  editingField={editingField}
                  onFieldClick={onFieldClick}
                  onFieldBlur={onFieldBlur}
                  onKeyDown={onKeyDown}
                />

                <PropertyRow
                  label="URL"
                  value={item.url}
                  fieldName={`menuItem-${item.id}-url`}
                  type="text"
                  onValueChange={(value) => updateMenuItem(item.id, 'url', value)}
                  placeholder="/page or https://example.com"
                  icon={ExternalLink}
                  editingField={editingField}
                  onFieldClick={onFieldClick}
                  onFieldBlur={onFieldBlur}
                  onKeyDown={onKeyDown}
                />

                <PropertyRow
                  label="Open in new tab"
                  value={item.openInNewTab}
                  fieldName={`menuItem-${item.id}-newTab`}
                  type="checkbox"
                  onValueChange={(value) => updateMenuItem(item.id, 'openInNewTab', value)}
                  icon={ExternalLink}
                  editingField={editingField}
                  onFieldClick={onFieldClick}
                  onFieldBlur={onFieldBlur}
                  onKeyDown={onKeyDown}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 