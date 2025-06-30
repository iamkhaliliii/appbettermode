import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { WidgetGalleryProps, AvailableWidget } from './types';
import WidgetCard from './WidgetCard';

export function WidgetGallery({ availableWidgets, onAddWidget, onBack }: WidgetGalleryProps) {
  // Group widgets by category
  const widgetsByCategory = availableWidgets.reduce((acc, widget) => {
    if (!acc[widget.category]) acc[widget.category] = [];
    acc[widget.category].push(widget);
    return acc;
  }, {} as Record<string, typeof availableWidgets>);

  return (
    <div className="h-full w-full max-w-full flex flex-col bg-white dark:bg-gray-900">
      {/* Sticky Header with back button */}
      <div className="sticky top-0 z-50 flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-2 py-3">
        <div className="flex items-center gap-3">
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
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-2 py-4">
          <div className="space-y-4">
            {Object.entries(widgetsByCategory).map(([category, widgets]) => (
              <div key={category} className="space-y-3">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide px-1">
                  {category}
                </h4>
                <div className="grid grid-cols-3 gap-3 w-full">
                  {widgets.map((widget) => (
                    <WidgetCard
                      key={widget.id}
                      widget={widget}
                      onAdd={(w) => onAddWidget(w as AvailableWidget)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 