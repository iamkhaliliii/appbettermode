import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, GripVertical, FileText, Newspaper, CreditCard, Layout, Image, Users, MessageSquare, Calendar, BarChart3, Settings, Zap, ChevronDown, Layers, Table, MapPin, Star, Heart, Bookmark, Grid, List, Search, Tag, Filter, Folder, Globe, X } from "lucide-react";

type WidgetSize = 'small' | 'medium' | 'large';

interface Widget {
  id: string;
  type: string;
  content: string;
  position: 'above' | 'below';
  size: WidgetSize;
  categoryColor?: string;
}

interface MainContentAreaProps {
  children: React.ReactNode;
  isWidgetMode: boolean;
  onDragStateChange?: (isDragging: boolean) => void;
  onWidgetSettingsClick?: (widget: Widget) => void;
}

// Grid system helpers
const getGridSpan = (size: WidgetSize): number => {
  switch (size) {
    case 'small': return 1;
    case 'medium': return 2;
    case 'large': return 3;
  }
};

const getSizeLabel = (size: WidgetSize): string => {
  switch (size) {
    case 'small': return '1/3';
    case 'medium': return '2/3';
    case 'large': return '3/3';
  }
};

// Optimized Size Icon Component
const SizeIcon = ({ size, className = "w-3.5 h-3.5" }: { size: WidgetSize; className?: string }) => {
  const fillLevel = useMemo(() => {
    switch (size) {
      case 'small': return 1;
      case 'medium': return 2;
      case 'large': return 3;
    }
  }, [size]);

  return (
    <svg className={className} viewBox="0 0 24 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[1, 2, 3].map((level) => (
        <rect 
          key={level}
          x={1 + (level - 1) * 8} 
          y="1" 
          width="6" 
          height="6" 
          rx="1" 
          fill={fillLevel >= level ? "currentColor" : "none"}
          stroke="currentColor" 
          strokeWidth="1"
          opacity={fillLevel >= level ? 1 : 0.3}
        />
      ))}
    </svg>
  );
};

// Widget type to default size mapping
const getDefaultSize = (widgetType: string): WidgetSize => {
  const type = widgetType.toLowerCase();
  
  if (type.includes('button') || type.includes('icon') || type.includes('badge') ||
      type.includes('tag') || type.includes('rating') || type.includes('likes') ||
      type.includes('bookmark')) {
    return 'small';
  }
  
  if (type.includes('form') || type.includes('card') || type.includes('image') ||
      type.includes('search') || type.includes('filter') || type.includes('calendar') ||
      type.includes('user') || type.includes('comment') || type.includes('accordion')) {
    return 'medium';
  }
  
  return 'large';
};

// Widget type to icon mapping
const getWidgetIcon = (widgetType: string) => {
  const type = widgetType.toLowerCase();
  const iconMap: Record<string, any> = {
    'richtext': FileText,
    'text': FileText,
    'content': FileText,
    'blog': Newspaper,
    'news': Newspaper,
    'article': Newspaper,
    'card': CreditCard,
    'cards': CreditCard,
    'layout': Layout,
    'container': Layout,
    'image': Image,
    'gallery': Image,
    'media': Image,
    'users': Users,
    'people': Users,
    'members': Users,
    'comments': MessageSquare,
    'discussion': MessageSquare,
    'chat': MessageSquare,
    'calendar': Calendar,
    'events': Calendar,
    'schedule': Calendar,
    'chart': BarChart3,
    'analytics': BarChart3,
    'graphs': BarChart3,
    'settings': Settings,
    'config': Settings,
    'accordions': ChevronDown,
    'collapse': ChevronDown,
    'dropdown': ChevronDown,
    'spaces': Layers,
    'layers': Layers,
    'table': Table,
    'grid': Table,
    'data': Table,
    'map': MapPin,
    'location': MapPin,
    'rating': Star,
    'reviews': Star,
    'likes': Heart,
    'favorites': Heart,
    'bookmarks': Bookmark,
    'saved': Bookmark,
    'cms blocks': Grid,
    'blocks': Grid,
    'list': List,
    'listing': List,
    'search': Search,
    'filter': Search,
    'tags': Tag,
    'labels': Tag,
    'categories': Folder,
    'folders': Folder,
    'embed': Globe,
    'iframe': Globe,
    'external': Globe
  };

  return iconMap[type] || Zap;
};

export function MainContentArea({ children, isWidgetMode, onDragStateChange, onWidgetSettingsClick }: MainContentAreaProps) {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [dragOverZone, setDragOverZone] = useState<'above' | 'below' | null>(null);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{widgetId: string, position: 'left' | 'right'} | null>(null);

  // Drag and drop handlers - simplified
  const handleDragOver = useCallback((e: React.DragEvent, zone: 'above' | 'below') => {
    if (!isWidgetMode || draggedWidget) return;
    
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverZone(zone);
  }, [isWidgetMode, draggedWidget]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (draggedWidget) return;
    
    e.preventDefault();
    e.stopPropagation();
    setDragOverZone(null);
  }, [draggedWidget]);

  const handleDrop = useCallback((e: React.DragEvent, zone: 'above' | 'below') => {
    if (!isWidgetMode || draggedWidget) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    let widgetData = e.dataTransfer.getData('text/plain') || 
                     e.dataTransfer.getData('text') || 
                     e.dataTransfer.getData('application/json');
    
    // Check if this is a widget reorder
    const existingWidget = widgets.find(w => w.id === widgetData);
    if (existingWidget) return;
    
    // Parse widget data
    let widgetName = 'New Widget';
    let widgetType = 'New Widget';
    
    try {
      const parsedData = JSON.parse(widgetData);
      if (parsedData?.name) {
        widgetName = parsedData.name;
        widgetType = parsedData.name;
      }
    } catch {
      if (widgetData?.trim()) {
        widgetName = widgetData;
        widgetType = widgetData;
      }
    }
    
    // Widget categories for color consistency
    const getWidgetCategory = (widgetId: string) => {
      const categories = [
        {
          id: 'content',
          color: '#A095C4',
          widgets: ['featured-content', 'recent-activity', 'trending-topics', 'featured-blog-posts', 'top-stories', 'recent-posts', 'blog-categories', 'upcoming-events', 'featured-events', 'event-calendar', 'event-categories']
        },
        {
          id: 'general',
          color: '#B5BBAE',
          widgets: ['announcement-banner', 'hero-banner', 'space-header', 'html-script', 'iframe']
        },
        {
          id: 'basic',
          color: '#7AA0B0',
          widgets: ['title', 'logo', 'image', 'video', 'accordions', 'rich-text', 'quick-links']
        }
      ];
      
      for (const category of categories) {
        if (category.widgets.includes(widgetId.toLowerCase())) {
          return category;
        }
      }
      return categories[0];
    };

    const category = getWidgetCategory(widgetType);

    const newWidget: Widget = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: widgetType,
      content: `${widgetName} Widget Content`,
      position: zone,
      size: getDefaultSize(widgetType),
      categoryColor: category.color
    };
    
    setWidgets(prev => [...prev, newWidget]);
    setDragOverZone(null);
  }, [isWidgetMode, widgets]);

  // Widget management handlers
  const removeWidget = useCallback((id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  }, []);

  const changeWidgetSize = useCallback((id: string, newSize: WidgetSize) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, size: newSize } : w));
  }, []);

  // Widget reordering handlers - simplified
  const handleWidgetDragStart = useCallback((e: React.DragEvent, widgetId: string) => {
    setDraggedWidget(widgetId);
    onDragStateChange?.(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', widgetId);
  }, [onDragStateChange]);

  const handleWidgetDragEnd = useCallback(() => {
    setDraggedWidget(null);
    setDropIndicator(null);
    onDragStateChange?.(false);
  }, [onDragStateChange]);

  const handleWidgetDrop = useCallback((e: React.DragEvent, targetWidget: Widget, dropPosition: 'left' | 'right') => {
    e.preventDefault();
    e.stopPropagation();
    
    const draggedId = e.dataTransfer.getData('text/plain');
    
    if (!draggedId || draggedId === targetWidget.id) {
      handleWidgetDragEnd();
      return;
    }
    
    const draggedWidgetData = widgets.find(w => w.id === draggedId);
    if (!draggedWidgetData) {
      handleWidgetDragEnd();
      return;
    }
    
    setWidgets(prev => {
      const filtered = prev.filter(w => w.id !== draggedId);
      const targetIndex = filtered.findIndex(w => w.id === targetWidget.id);
      
      if (targetIndex === -1) return prev;
      
      const insertIndex = dropPosition === 'left' ? targetIndex : targetIndex + 1;
      const newWidgets = [...filtered];
      newWidgets.splice(insertIndex, 0, { ...draggedWidgetData, position: targetWidget.position });
      
      return newWidgets;
    });
    
    handleWidgetDragEnd();
  }, [widgets, handleWidgetDragEnd]);

  // Render single widget
  const renderWidget = useCallback((widget: Widget) => {
    const IconComponent = getWidgetIcon(widget.type);
    const isDragged = draggedWidget === widget.id;
    
    return (
      <div
        onDragOver={(e) => {
          if (draggedWidget && draggedWidget !== widget.id) {
            e.preventDefault();
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const dropPosition = e.clientX < rect.left + rect.width / 2 ? 'left' : 'right';
            setDropIndicator({ widgetId: widget.id, position: dropPosition });
          }
        }}
        onDragLeave={() => setDropIndicator(null)}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDropIndicator(null);
          const rect = e.currentTarget.getBoundingClientRect();
          const dropPosition = e.clientX < rect.left + rect.width / 2 ? 'left' : 'right';
          handleWidgetDrop(e, widget, dropPosition);
        }}
        className="relative w-full h-full flex"
      >
        {/* Drop Indicator */}
        {dropIndicator?.widgetId === widget.id && (
          <div className={`absolute top-0 bottom-0 w-2 bg-green-500 z-20 rounded-full shadow-lg ${
            dropIndicator.position === 'left' ? '-left-2' : '-right-2'
          }`} />
        )}
        
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: isDragged ? 0.5 : 1, 
            scale: isDragged ? 0.95 : 1
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 relative group w-full flex-1 transition-all duration-200 hover:shadow-md ${
            isDragged ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
          } ${dropIndicator?.widgetId === widget.id ? 'ring-2 ring-green-500 ring-opacity-60' : ''}`}
          style={{ '--category-color': widget.categoryColor || '#6B7280' } as React.CSSProperties}
        >
          {/* Action Buttons */}
          {isWidgetMode && (
            <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-600/50 shadow-lg p-1">
              {/* Settings */}
              <button
                onClick={() => onWidgetSettingsClick?.(widget)}
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                title="Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              
              {/* Size Toggle */}
              <button
                onClick={() => {
                  const sizes: WidgetSize[] = ['small', 'medium', 'large'];
                  const currentIndex = sizes.indexOf(widget.size);
                  const nextSize = sizes[(currentIndex + 1) % sizes.length];
                  changeWidgetSize(widget.id, nextSize);
                }}
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded transition-colors"
                title={`Resize (${getSizeLabel(widget.size)})`}
              >
                <SizeIcon size={widget.size} />
              </button>
              
              {/* Drag Handle */}
              <div
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-grab active:cursor-grabbing rounded"
                title="Drag to reorder"
                draggable
                onDragStart={(e) => handleWidgetDragStart(e, widget.id)}
                onDragEnd={handleWidgetDragEnd}
              >
                <GripVertical className="w-3.5 h-3.5" />
              </div>
              
              {/* Remove */}
              <button
                onClick={() => removeWidget(widget.id)}
                className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                title="Remove widget"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Widget Content */}
          <div className="flex flex-col items-center justify-center flex-1 text-center p-4">
            <div className="flex flex-col items-center gap-3">
              <IconComponent 
                className="w-8 h-8 transition-colors duration-200" 
                style={{ color: widget.categoryColor || '#6B7280' }}
              />
              <div>
                <h3 
                  className="text-lg font-semibold transition-colors duration-200"
                  style={{ color: widget.categoryColor || '#374151' }}
                >
                  {widget.type}
                </h3>
                <span 
                  className="px-2 py-1 text-xs rounded-full font-medium"
                  style={{
                    backgroundColor: `${widget.categoryColor || '#6B7280'}20`,
                    color: widget.categoryColor || '#6B7280'
                  }}
                >
                  {getSizeLabel(widget.size)}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }, [draggedWidget, dropIndicator, isWidgetMode, onWidgetSettingsClick, changeWidgetSize, handleWidgetDragStart, handleWidgetDragEnd, removeWidget]);

  // Arrange widgets into rows - simplified
  const arrangeWidgetsInRows = useCallback((widgets: Widget[]) => {
    const rows: Widget[][] = [];
    let currentRow: Widget[] = [];
    let currentRowSpan = 0;

    widgets.forEach(widget => {
      const widgetSpan = getGridSpan(widget.size);
      
      if (currentRowSpan + widgetSpan > 3 || widget.size === 'large') {
        if (currentRow.length > 0) {
          rows.push(currentRow);
          currentRow = [];
          currentRowSpan = 0;
        }
      }
      
      currentRow.push(widget);
      currentRowSpan += widgetSpan;
      
      if (currentRowSpan >= 3) {
        rows.push(currentRow);
        currentRow = [];
        currentRowSpan = 0;
      }
    });

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  }, []);

  // Render drop zone - simplified
  const renderDropZone = useCallback((zone: 'above' | 'below') => {
    const isActive = dragOverZone === zone;
    const zoneWidgets = widgets.filter(w => w.position === zone);
    const widgetRows = arrangeWidgetsInRows(zoneWidgets);

    return (
      <div className="space-y-3 w-full">
        {isWidgetMode && (
          <motion.div
            className={`relative overflow-hidden transition-all duration-300 border-2 border-dashed rounded-xl min-h-20 p-4 ${
              isActive 
                ? 'border-blue-400 bg-blue-50/80 dark:bg-blue-900/30 shadow-lg' 
                : zoneWidgets.length === 0
                  ? 'border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-600'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30'
            }`}
            onDragOver={(e) => handleDragOver(e, zone)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, zone)}
          >
            {(zoneWidgets.length === 0 || isActive) && (
              <div className="flex flex-col items-center gap-3 mb-4">
                {isActive ? (
                  <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-medium">
                    <Plus className="w-5 h-5" />
                    <span className="text-base">Drop widget {zone} content</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2 mb-1">
                      <Plus className="w-4 h-4" />
                      <span className="text-sm font-medium">Drop widgets {zone} content</span>
                    </div>
                    <p className="text-xs text-center opacity-70">
                      Drag widgets from the <span className="font-medium text-blue-600 dark:text-blue-400">Widget tab</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Render existing widgets */}
            <AnimatePresence mode="popLayout">
              {widgetRows.map((row, rowIndex) => (
                <motion.div 
                  key={`row-${zone}-${rowIndex}`} 
                  className="grid gap-3 w-full mb-3"
                  layout
                  style={{
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gridAutoRows: '200px'
                  }}
                >
                  {row.map((widget) => (
                    <motion.div 
                      key={widget.id} 
                      className="w-full h-full"
                      layout
                      style={{ gridColumn: `span ${getGridSpan(widget.size)}` }}
                    >
                      {renderWidget(widget)}
                    </motion.div>
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    );
  }, [isWidgetMode, dragOverZone, widgets, arrangeWidgetsInRows, handleDragOver, handleDragLeave, handleDrop, renderWidget]);

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