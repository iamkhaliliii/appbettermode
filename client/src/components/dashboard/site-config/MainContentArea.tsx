import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Maximize2 } from "lucide-react";

type WidgetSize = 'small' | 'medium' | 'large' | 'extra-large';

interface Widget {
  id: string;
  type: string;
  content: string;
  position: 'above' | 'below';
  size: WidgetSize;
}

interface MainContentAreaProps {
  children: React.ReactNode;
  isWidgetMode: boolean;
}

const getWidgetWidth = (size: WidgetSize): string => {
  switch (size) {
    case 'small': return 'w-1/4';
    case 'medium': return 'w-1/2';
    case 'large': return 'w-3/4';
    case 'extra-large': return 'w-full';
  }
};

const getWidgetFlexBasis = (size: WidgetSize): string => {
  switch (size) {
    case 'small': return '25%';
    case 'medium': return '50%';
    case 'large': return '75%';
    case 'extra-large': return '100%';
  }
};

const getSizeLabel = (size: WidgetSize): string => {
  switch (size) {
    case 'small': return '1/4';
    case 'medium': return '1/2';
    case 'large': return '3/4';
    case 'extra-large': return 'Full';
  }
};

const getDefaultSize = (widgetType: string): WidgetSize => {
  const type = widgetType.toLowerCase();
  if (type.includes('button') || type.includes('icon') || type.includes('badge')) {
    return 'small';
  } else if (type.includes('form') || type.includes('card') || type.includes('image')) {
    return 'medium';
  } else if (type.includes('table') || type.includes('chart') || type.includes('gallery')) {
    return 'large';
  } else {
    return 'extra-large'; // For text, blog, etc.
  }
};

export function MainContentArea({ children, isWidgetMode }: MainContentAreaProps) {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [dragOverZone, setDragOverZone] = useState<'above' | 'below' | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent, zone: 'above' | 'below') => {
    if (!isWidgetMode) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverZone(zone);
  }, [isWidgetMode]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverZone(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, zone: 'above' | 'below') => {
    if (!isWidgetMode) return;
    e.preventDefault();
    e.stopPropagation();
    
    // Try multiple data formats
    let widgetData = e.dataTransfer.getData('text/plain');
    if (!widgetData) {
      widgetData = e.dataTransfer.getData('text');
    }
    if (!widgetData) {
      widgetData = e.dataTransfer.getData('application/json');
    }
    
    // If still no data, use a default for testing
    if (!widgetData) {
      widgetData = 'Test Widget';
    }
    
    const newWidget: Widget = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: widgetData,
      content: `${widgetData} Widget Content`,
      position: zone,
      size: getDefaultSize(widgetData)
    };
    
    setWidgets(prev => [...prev, newWidget]);
    
    setDragOverZone(null);
  }, [isWidgetMode]);

  const removeWidget = useCallback((id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  }, []);

  const changeWidgetSize = useCallback((id: string, newSize: WidgetSize) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, size: newSize } : w));
  }, []);

  const renderWidget = (widget: Widget) => (
    <motion.div
      key={widget.id}
      layout
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 relative group w-full h-full"
      style={{ minHeight: '100px' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            📦 {widget.type}
          </span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
            {getSizeLabel(widget.size)}
          </span>
        </div>
        <button
          onClick={() => removeWidget(widget.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          ✕
        </button>
      </div>
      
      {/* Size Controls */}
      <div className="flex items-center gap-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Maximize2 className="w-3 h-3 text-gray-400 dark:text-gray-500" />
        <span className="text-xs text-gray-500 dark:text-gray-400">Size:</span>
        <select
          value={widget.size}
          onChange={(e) => changeWidgetSize(widget.id, e.target.value as WidgetSize)}
          className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        >
          <option value="small">Small ({getSizeLabel('small')})</option>
          <option value="medium">Medium ({getSizeLabel('medium')})</option>
          <option value="large">Large ({getSizeLabel('large')})</option>
          <option value="extra-large">Extra Large ({getSizeLabel('extra-large')})</option>
        </select>
      </div>

      <div className="text-gray-600 dark:text-gray-400 text-sm bg-gray-50 dark:bg-gray-700/50 rounded p-2">
        This is a <strong>{widget.type}</strong> widget taking <strong>{getSizeLabel(widget.size)}</strong> of the container width. 
        {widget.size !== 'extra-large' && ' You can place other widgets alongside it.'}
      </div>
      
      <div className="mt-2 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>Width: {getWidgetFlexBasis(widget.size)}</span>
        <span>ID: {widget.id.split('-')[0]}</span>
      </div>
    </motion.div>
  );

  // Function to arrange widgets into rows based on their sizes
  const arrangeWidgetsInRows = (widgets: Widget[]) => {
    const rows: Widget[][] = [];
    let currentRow: Widget[] = [];
    let currentRowWidth = 0;

    const getWidgetWidthPercent = (size: WidgetSize): number => {
      switch (size) {
        case 'small': return 25;
        case 'medium': return 50;
        case 'large': return 75;
        case 'extra-large': return 100;
      }
    };

    widgets.forEach(widget => {
      const widgetWidth = getWidgetWidthPercent(widget.size);
      
      // If adding this widget would exceed 100% width, start a new row
      if (currentRowWidth + widgetWidth > 100) {
        if (currentRow.length > 0) {
          rows.push(currentRow);
          currentRow = [];
          currentRowWidth = 0;
        }
      }
      
      currentRow.push(widget);
      currentRowWidth += widgetWidth;
      
      // If this widget fills the row completely, start a new row
      if (currentRowWidth >= 100) {
        rows.push(currentRow);
        currentRow = [];
        currentRowWidth = 0;
      }
    });

    // Add any remaining widgets in the current row
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  };

  const renderDropZone = (zone: 'above' | 'below') => {
    const isActive = dragOverZone === zone;
    const zoneWidgets = widgets.filter(w => w.position === zone);
    const widgetRows = arrangeWidgetsInRows(zoneWidgets);

    return (
      <div className="space-y-3 w-full">
        {/* Render existing widgets in this zone arranged in rows */}
        <AnimatePresence mode="popLayout">
          {widgetRows.map((row, rowIndex) => (
            <div key={`row-${zone}-${rowIndex}`} className="flex gap-3 items-stretch w-full min-h-[120px]">
              {row.map((widget) => (
                <div key={widget.id} className={`${getWidgetWidth(widget.size)} flex`}>
                  {renderWidget(widget)}
                </div>
              ))}
            </div>
          ))}
        </AnimatePresence>

        {/* Drop Zone */}
        {isWidgetMode && (
          <motion.div
            className={`transition-all duration-200 border-2 border-dashed rounded-lg min-h-16 flex items-center justify-center ${
              isActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
            }`}
            onDragOver={(e) => handleDragOver(e, zone)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, zone)}
            animate={{
              scale: isActive ? 1.02 : 1
            }}
            style={{
              backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 0, 0, 0)'
            }}
          >
            {isActive ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium"
              >
                <Plus className="w-4 h-4" />
                Drop widget {zone} content
              </motion.div>
            ) : zoneWidgets.length === 0 ? (
              <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm">
                <Plus className="w-4 h-4" />
                Drop widgets {zone} content
              </div>
            ) : (
              <div className="flex items-center gap-2 text-gray-300 dark:text-gray-600 text-xs opacity-50">
                <Plus className="w-3 h-3" />
                Add more widgets
              </div>
            )}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 w-full">
      {/* Widgets Above Content */}
      {renderDropZone('above')}

      {/* Main Content */}
      <div className="relative w-full">
        {children}
      </div>

      {/* Widgets Below Content */}
      {renderDropZone('below')}
    </div>
  );
} 