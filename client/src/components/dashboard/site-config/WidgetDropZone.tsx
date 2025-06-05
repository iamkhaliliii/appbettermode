import { useState, useCallback } from "react";
import { Plus, X, Grip } from "lucide-react";

interface DroppedWidget {
  id: string;
  name: string;
  color: string;
  description: string;
  position: { x: number; y: number };
}

interface WidgetDropZoneProps {
  className?: string;
}

export function WidgetDropZone({ className = "" }: WidgetDropZoneProps) {
  const [droppedWidgets, setDroppedWidgets] = useState<DroppedWidget[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    try {
      const widgetData = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newWidget: DroppedWidget = {
        id: `${widgetData.id}-${Date.now()}`,
        name: widgetData.name,
        color: widgetData.color,
        description: widgetData.description,
        position: { x, y }
      };

      setDroppedWidgets(prev => [...prev, newWidget]);
    } catch (error) {
      console.error('Error parsing dropped widget data:', error);
    }
  }, []);

  const removeWidget = useCallback((widgetId: string) => {
    setDroppedWidgets(prev => prev.filter(widget => widget.id !== widgetId));
  }, []);

  const getColorClasses = (color: string) => {
    const colors = {
      purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      red: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
      gray: 'bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
      blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      green: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
      pink: 'bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800',
      orange: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  return (
    <div 
      className={`relative w-full h-full min-h-[400px] transition-all duration-200 ${
        isDragOver 
          ? 'bg-blue-50/50 dark:bg-blue-900/10 border-2 border-dashed border-blue-300 dark:border-blue-600' 
          : 'bg-transparent'
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop indicator */}
      {isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Drop widget here</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {droppedWidgets.length === 0 && !isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400 dark:text-gray-600">
            <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Drag widgets here from the Widget tab</p>
          </div>
        </div>
      )}

      {/* Dropped widgets */}
      {droppedWidgets.map((widget) => (
        <div
          key={widget.id}
          className={`absolute group cursor-move select-none ${getColorClasses(widget.color)}`}
          style={{
            left: `${Math.max(10, Math.min(widget.position.x - 60, window.innerWidth - 200))}px`,
            top: `${Math.max(10, Math.min(widget.position.y - 25, window.innerHeight - 100))}px`,
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg border shadow-lg p-3 min-w-[120px] transition-all duration-200 group-hover:shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Grip className="w-3 h-3 text-gray-400" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {widget.name}
                </span>
              </div>
              <button
                onClick={() => removeWidget(widget.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className={`w-full h-8 rounded border-2 border-dashed ${getColorClasses(widget.color)} flex items-center justify-center`}>
              <span className="text-xs opacity-60">Widget Content</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 