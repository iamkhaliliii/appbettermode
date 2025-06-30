import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { WidgetGalleryProps } from './types';
import { WidgetCard } from './WidgetCard';

export function WidgetGallery({ availableWidgets, onAddWidget, onBack }: WidgetGalleryProps) {
  // Group widgets by category
  const widgetsByCategory = availableWidgets.reduce((acc, widget) => {
    if (!acc[widget.category]) acc[widget.category] = [];
    acc[widget.category].push(widget);
    return acc;
  }, {} as Record<string, typeof availableWidgets>);

  return (
    <div className="space-y-4 w-full max-w-full overflow-hidden px-2">
      {/* Header with back button */}
      <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={onBack}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">Add Widget</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Choose from available widgets</p>
        </div>
      </div>

      {/* Available Widgets Grouped by Category */}
      <div className="space-y-4">
        {Object.entries(widgetsByCategory).map(([category, widgets]) => (
          <div key={category} className="space-y-3">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1">
              {category}
            </h4>
            <div className="grid grid-cols-4 gap-2 w-full">
              {widgets.map((widget) => (
                <WidgetCard
                  key={widget.id}
                  widget={widget}
                  onAddWidget={onAddWidget}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 