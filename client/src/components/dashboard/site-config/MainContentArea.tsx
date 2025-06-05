import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Maximize2, GripVertical, FileText, Newspaper, CreditCard, Layout, Image, Users, MessageSquare, Calendar, BarChart3, Settings, Zap, ChevronDown, Layers, Table, MapPin, Star, Heart, Bookmark, Grid, List, Search, Tag, Filter, Folder, Globe, X, Square } from "lucide-react";

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
}

// CSS Grid spans for widget sizes
const getGridSpan = (size: WidgetSize): number => {
  switch (size) {
    case 'small': return 1;  // 1/3 width
    case 'medium': return 2; // 2/3 width
    case 'large': return 3;  // full width
  }
};

const getSizeLabel = (size: WidgetSize): string => {
  switch (size) {
    case 'small': return '1/3';
    case 'medium': return '2/3';
    case 'large': return '3/3';
  }
};

// Custom Size Icon Component
const SizeIcon = ({ size, className = "w-3.5 h-3.5" }: { size: WidgetSize; className?: string }) => {
  const getFillLevel = () => {
    switch (size) {
      case 'small': return 1;
      case 'medium': return 2;
      case 'large': return 3;
    }
  };

  const fillLevel = getFillLevel();

  return (
    <motion.svg 
      className={className} 
      viewBox="0 0 24 8" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      animate={{
        scale: [1, 1.1, 1],
        transition: { duration: 0.2 }
      }}
      key={`size-icon-${size}`} // Trigger animation on size change
    >
      {/* Box 1 */}
      <motion.rect 
        x="1" y="1" width="6" height="6" 
        rx="1" 
        fill={fillLevel >= 1 ? "currentColor" : "none"}
        stroke="currentColor" 
        strokeWidth="1"
        initial={{ opacity: 0.3 }}
        animate={{ 
          opacity: fillLevel >= 1 ? 1 : 0.3,
          fill: fillLevel >= 1 ? "currentColor" : "none"
        }}
        transition={{ duration: 0.2 }}
      />
      {/* Box 2 */}
      <motion.rect 
        x="9" y="1" width="6" height="6" 
        rx="1" 
        fill={fillLevel >= 2 ? "currentColor" : "none"}
        stroke="currentColor" 
        strokeWidth="1"
        initial={{ opacity: 0.3 }}
        animate={{ 
          opacity: fillLevel >= 2 ? 1 : 0.3,
          fill: fillLevel >= 2 ? "currentColor" : "none"
        }}
        transition={{ duration: 0.2, delay: 0.05 }}
      />
      {/* Box 3 */}
      <motion.rect 
        x="17" y="1" width="6" height="6" 
        rx="1" 
        fill={fillLevel >= 3 ? "currentColor" : "none"}
        stroke="currentColor" 
        strokeWidth="1"
        initial={{ opacity: 0.3 }}
        animate={{ 
          opacity: fillLevel >= 3 ? 1 : 0.3,
          fill: fillLevel >= 3 ? "currentColor" : "none"
        }}
        transition={{ duration: 0.2, delay: 0.1 }}
      />
    </motion.svg>
  );
};

const getDefaultSize = (widgetType: string): WidgetSize => {
  const type = widgetType.toLowerCase();
  
  // Small widgets (1/3 width)
  if (type.includes('button') || 
      type.includes('icon') || 
      type.includes('badge') ||
      type.includes('tag') ||
      type.includes('rating') ||
      type.includes('likes') ||
      type.includes('bookmark')) {
    return 'small';
  }
  
  // Medium widgets (2/3 width)  
  if (type.includes('form') || 
      type.includes('card') || 
      type.includes('image') ||
      type.includes('search') ||
      type.includes('filter') ||
      type.includes('calendar') ||
      type.includes('user') ||
      type.includes('comment') ||
      type.includes('accordion')) {
    return 'medium';
  }
  
  // Large widgets (full width)
  // text, blog, table, chart, gallery, spaces, cms blocks, etc.
  return 'large';
};

const getWidgetIcon = (widgetType: string) => {
  const type = widgetType.toLowerCase();
  switch (type) {
    case 'richtext':
    case 'text':
    case 'content':
      return FileText;
    case 'blog':
    case 'news':
    case 'article':
      return Newspaper;
    case 'card':
    case 'cards':
      return CreditCard;
    case 'layout':
    case 'container':
      return Layout;
    case 'image':
    case 'gallery':
    case 'media':
      return Image;
    case 'users':
    case 'people':
    case 'members':
      return Users;
    case 'comments':
    case 'discussion':
    case 'chat':
      return MessageSquare;
    case 'calendar':
    case 'events':
    case 'schedule':
      return Calendar;
    case 'chart':
    case 'analytics':
    case 'graphs':
      return BarChart3;
    case 'settings':
    case 'config':
      return Settings;
    case 'accordions':
    case 'collapse':
    case 'dropdown':
      return ChevronDown;
    case 'spaces':
    case 'layers':
      return Layers;
    case 'table':
    case 'grid':
    case 'data':
      return Table;
    case 'map':
    case 'location':
      return MapPin;
    case 'rating':
    case 'reviews':
      return Star;
    case 'likes':
    case 'favorites':
      return Heart;
    case 'bookmarks':
    case 'saved':
      return Bookmark;
    case 'cms blocks':
    case 'blocks':
      return Grid;
    case 'list':
    case 'listing':
      return List;
    case 'search':
    case 'filter':
      return Search;
    case 'tags':
    case 'labels':
      return Tag;
    case 'categories':
    case 'folders':
      return Folder;
    case 'embed':
    case 'iframe':
    case 'external':
      return Globe;
    default:
      return Zap;
  }
};

export function MainContentArea({ children, isWidgetMode, onDragStateChange }: MainContentAreaProps) {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [dragOverZone, setDragOverZone] = useState<'above' | 'below' | null>(null);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{widgetId: string, position: 'left' | 'right'} | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent, zone: 'above' | 'below') => {
    if (!isWidgetMode) return;
    
    // If it's a widget being reordered, don't handle it here
    if (draggedWidget) return;
    
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverZone(zone);
  }, [isWidgetMode, draggedWidget]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // If it's a widget being reordered, don't handle it here
    if (draggedWidget) return;
    
    e.preventDefault();
    e.stopPropagation();
    setDragOverZone(null);
  }, [draggedWidget]);

  const handleDrop = useCallback((e: React.DragEvent, zone: 'above' | 'below') => {
    if (!isWidgetMode) return;
    
    // If it's a widget being reordered, don't handle it here
    if (draggedWidget) return;
    
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
    
    // Check if this is a widget reorder (existing widget being moved)
    const existingWidget = widgets.find(w => w.id === widgetData);
    if (existingWidget) {
      // This is a reorder operation, don't create new widget
      return;
    }
    
    // Parse widget data if it's JSON from sidebar
    let widgetName = 'Test Widget';
    let widgetType = 'Test Widget';
    
    try {
      // Try to parse as JSON (from sidebar widgets)
      const parsedData = JSON.parse(widgetData);
      if (parsedData && parsedData.name) {
        widgetName = parsedData.name;
        widgetType = parsedData.name;
      }
    } catch (e) {
      // If not JSON, use as string (from our buttons or reorder)
      if (widgetData && widgetData.trim()) {
        widgetName = widgetData;
        widgetType = widgetData;
      }
    }
    
    // Get category info for widget color consistency
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
      return categories[0]; // Default to content
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

  const removeWidget = useCallback((id: string) => {
    setWidgets(prev => prev.filter(w => w.id !== id));
  }, []);

  const changeWidgetSize = useCallback((id: string, newSize: WidgetSize) => {
    setWidgets(prev => prev.map(w => w.id === id ? { ...w, size: newSize } : w));
  }, []);

  // Widget reordering functions
  const handleWidgetDragStart = useCallback((e: React.DragEvent, widgetId: string) => {
    console.log('Starting widget drag:', widgetId);
    setDraggedWidget(widgetId);
    onDragStateChange?.(true);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', widgetId);
    
    // Create a custom drag image
    const dragElement = e.currentTarget as HTMLElement;
    const rect = dragElement.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#3b82f6';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Moving Widget...', canvas.width / 2, canvas.height / 2);
    }
    e.dataTransfer.setDragImage(canvas, canvas.width / 2, canvas.height / 2);
  }, [onDragStateChange]);

  const handleWidgetDragEnd = useCallback((e: React.DragEvent) => {
    console.log('Ending widget drag');
    setDraggedWidget(null);
    setDropIndicator(null);
    onDragStateChange?.(false);
  }, [onDragStateChange]);



  const handleWidgetDrop = useCallback((e: React.DragEvent, targetWidget: Widget, dropPosition: 'left' | 'right') => {
    e.preventDefault();
    e.stopPropagation();
    
    const draggedId = e.dataTransfer.getData('text/plain');
    console.log('Widget drop - draggedId:', draggedId, 'targetWidget:', targetWidget.id, 'dropPosition:', dropPosition);
    
    if (!draggedId || draggedId === targetWidget.id) {
      // Clear dragged state even if drop is invalid
      setDraggedWidget(null);
      setDropIndicator(null);
      onDragStateChange?.(false);
      return;
    }
    
    const draggedWidgetData = widgets.find(w => w.id === draggedId);
    if (!draggedWidgetData) {
      // Clear dragged state if widget not found
      setDraggedWidget(null);
      setDropIndicator(null);
      onDragStateChange?.(false);
      return;
    }
    
    console.log('Reordering widgets - before:', widgets.map(w => w.id));
    
    setWidgets(prev => {
      const filtered = prev.filter(w => w.id !== draggedId);
      const targetIndex = filtered.findIndex(w => w.id === targetWidget.id);
      
      if (targetIndex === -1) return prev;
      
      const insertIndex = dropPosition === 'left' ? targetIndex : targetIndex + 1;
      const newWidgets = [...filtered];
      newWidgets.splice(insertIndex, 0, { ...draggedWidgetData, position: targetWidget.position });
      
      console.log('Reordering widgets - after:', newWidgets.map(w => w.id));
      return newWidgets;
    });
    
    // Clear dragged state after successful reorder
    setDraggedWidget(null);
    setDropIndicator(null);
    onDragStateChange?.(false);
  }, [widgets, onDragStateChange]);

  const renderWidget = (widget: Widget, index: number, zone: 'above' | 'below') => (
    <div
      onDragOver={(e) => {
        if (draggedWidget && draggedWidget !== widget.id) {
          console.log('Dragging over widget:', widget.id, 'dragged:', draggedWidget);
          e.preventDefault();
          e.stopPropagation(); // Prevent drop zone from interfering
          const rect = e.currentTarget.getBoundingClientRect();
          const dropPosition = e.clientX < rect.left + rect.width / 2 ? 'left' : 'right';
          setDropIndicator({ widgetId: widget.id, position: dropPosition });
        }
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        setDropIndicator(null);
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent drop zone from handling this
        setDropIndicator(null);
        const rect = e.currentTarget.getBoundingClientRect();
        const dropPosition = e.clientX < rect.left + rect.width / 2 ? 'left' : 'right';
        handleWidgetDrop(e, widget, dropPosition);
      }}
      className={`relative w-full h-full flex ${
        draggedWidget === widget.id ? 'opacity-50 scale-95' : ''
      }`}
    >
      {/* Drop Indicator */}
      {dropIndicator?.widgetId === widget.id && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`absolute top-0 bottom-0 w-2 bg-green-500 z-20 rounded-full shadow-lg ${
            dropIndicator.position === 'left' ? '-left-2' : '-right-2'
          }`}
        />
      )}
      
      <motion.div
        key={widget.id}
        layout
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ 
          opacity: draggedWidget === widget.id ? 0.5 : 1, 
          scale: draggedWidget === widget.id ? 0.95 : 1, 
          y: 0 
        }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 25,
          duration: 0.5,
          layout: {
            type: "spring",
            stiffness: 400,
            damping: 30,
            duration: 0.6
          }
        }}
        className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 relative group w-full flex-1 transition-all duration-200 hover:shadow-md ${
          draggedWidget === widget.id ? 'ring-4 ring-blue-500 ring-opacity-50 scale-105 shadow-xl' : ''
        } ${dropIndicator?.widgetId === widget.id ? 'ring-4 ring-green-500 ring-opacity-60 scale-102' : ''}`}
        style={{
          '--category-color': widget.categoryColor || '#6B7280'
        } as React.CSSProperties}
        onMouseEnter={(e) => {
          const target = e.currentTarget;
          const color = widget.categoryColor || '#6B7280';
          target.style.borderColor = `${color}50`; // 50% opacity
          target.style.background = `linear-gradient(135deg, ${color}08 0%, ${color}15 100%)`;
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget;
          target.style.borderColor = '';
          target.style.background = '';
        }}
      >
        {/* Hover Action Overlay - Minimal Icons Top Right */}
        {isWidgetMode && (
          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-600/50 shadow-lg p-1">
            {/* Settings */}
            <button
              onClick={() => {/* Settings action */}}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            
            {/* Size Toggle */}
            <motion.button
              onClick={() => {
                const sizes: WidgetSize[] = ['small', 'medium', 'large'];
                const currentIndex = sizes.indexOf(widget.size);
                const nextSize = sizes[(currentIndex + 1) % sizes.length];
                changeWidgetSize(widget.id, nextSize);
              }}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded transition-colors"
              title={`Resize (${getSizeLabel(widget.size)})`}
              whileTap={{ 
                scale: 0.9,
                transition: { duration: 0.1 }
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              <SizeIcon size={widget.size} className="w-4 h-3" />
            </motion.button>
            
            {/* Drag Handle */}
            <div
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-grab active:cursor-grabbing rounded select-none"
              title="Drag to reorder"
              draggable={true}
              onDragStart={(e) => {
                e.stopPropagation();
                handleWidgetDragStart(e, widget.id);
              }}
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

        {/* Widget Content - Clean & Simple */}
        <div className="flex flex-col items-center justify-center flex-1 text-center p-4">
          {/* Widget Icon & Name */}
          <div className="flex flex-col items-center gap-3">
            <motion.div
              layout
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 30
              }}
              animate={{
                scale: [1, 1.05, 1],
                transition: { duration: 0.4 }
              }}
              key={`${widget.id}-icon-${widget.size}`} // Trigger animation on size change
            >
              {(() => {
                const IconComponent = getWidgetIcon(widget.type);
                return <IconComponent 
                  className="w-8 h-8 transition-colors duration-200" 
                  style={{ 
                    color: widget.categoryColor || '#6B7280' // Use category color or default gray
                  }} 
                />;
              })()}
            </motion.div>
            <div>
              <motion.h3 
                className="text-lg font-semibold transition-colors duration-200"
                layout
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 30
                }}
                animate={{
                  scale: [1, 1.02, 1],
                  transition: { duration: 0.3 }
                }}
                key={`${widget.id}-title-${widget.size}`} // Trigger animation on size change
                style={{ 
                  color: widget.categoryColor || '#374151' // Use category color or default gray
                }}
              >
                {widget.type}
              </motion.h3>
              <motion.span 
                className="px-2 py-1 text-xs rounded-full font-medium"
                layout
                transition={{ 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 30
                }}
                style={{
                  backgroundColor: `${widget.categoryColor || '#6B7280'}20`, // 20% opacity
                  color: widget.categoryColor || '#6B7280'
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  transition: { duration: 0.3 }
                }}
                key={`${widget.id}-${widget.size}`} // Key change triggers animation
              >
                {getSizeLabel(widget.size)}
              </motion.span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );

  // Function to arrange widgets into rows based on grid spans (simplified for CSS Grid)
  const arrangeWidgetsInRows = (widgets: Widget[]) => {
    const rows: Widget[][] = [];
    let currentRow: Widget[] = [];
    let currentRowSpan = 0;

    widgets.forEach(widget => {
      const widgetSpan = getGridSpan(widget.size);
      
      // If adding this widget would exceed 3 columns or widget is large, start a new row
      if (currentRowSpan + widgetSpan > 3 || widget.size === 'large') {
        if (currentRow.length > 0) {
          rows.push(currentRow);
          currentRow = [];
          currentRowSpan = 0;
        }
      }
      
      currentRow.push(widget);
      currentRowSpan += widgetSpan;
      
      // If this widget fills the row completely (3 columns), start a new row
      if (currentRowSpan >= 3) {
        rows.push(currentRow);
        currentRow = [];
        currentRowSpan = 0;
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
        {/* Drop Zone Container - Always visible in widget mode */}
        {isWidgetMode && (
          <motion.div
            className={`relative overflow-hidden transition-all duration-300 border-2 border-dashed rounded-xl min-h-20 p-4 backdrop-blur-sm ${
              isActive 
                ? 'border-blue-400 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-lg' 
                : zoneWidgets.length === 0
                  ? 'border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/30 dark:hover:bg-blue-900/10'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/30 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onDragOver={(e) => handleDragOver(e, zone)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, zone)}
            animate={{
              scale: isActive ? 1.01 : 1,
              borderRadius: isActive ? "20px" : "12px"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {/* Animated background pattern */}
            {isActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-indigo-600/10"
                style={{
                  backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)'
                }}
              />
            )}

            {/* Drop Zone Header - Always show when no widgets or when dragging */}
            {(zoneWidgets.length === 0 || isActive) && (
              <motion.div
                layout
                className="relative z-10 flex flex-col items-center gap-3 mb-4"
              >
                {isActive ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-medium"
                  >
                    <motion.div
                      animate={{ rotate: 180 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      <Plus className="w-5 h-5" />
                    </motion.div>
                    <span className="text-base">Drop widget {zone} content</span>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          transition: { duration: 2, repeat: Infinity, repeatDelay: 3 }
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </motion.div>
                      <span className="text-sm font-medium">Drop widgets {zone} content</span>
                    </div>
                    <p className="text-xs text-center opacity-70 max-w-sm">
                      Drag widgets from the <span className="font-medium text-blue-600 dark:text-blue-400">Widget tab</span> to add them here
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Render existing widgets in this zone arranged in rows */}
            <AnimatePresence mode="popLayout">
              {widgetRows.map((row, rowIndex) => (
                <motion.div 
                  key={`row-${zone}-${rowIndex}`} 
                  className="grid gap-3 w-full overflow-hidden mb-3"
                  layout
                  transition={{ 
                    type: "spring", 
                    stiffness: 350, 
                    damping: 30,
                    duration: 0.7
                  }}
                  style={{
                    gridTemplateColumns: `repeat(3, 1fr)`,
                    gridAutoRows: '200px',
                    maxWidth: '100%'
                  }}
                >
                  {row.map((widget, widgetIndex) => {
                    const gridSpan = getGridSpan(widget.size);
                    return (
                      <motion.div 
                        key={widget.id} 
                        className="w-full h-full"
                        layout
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 30,
                          duration: 0.6
                        }}
                        style={{
                          gridColumn: `span ${gridSpan}`
                        }}
                      >
                        {renderWidget(widget, widgetIndex, zone)}
                      </motion.div>
                    );
                  })}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add more widgets hint - only show when widgets exist and not dragging */}
            {zoneWidgets.length > 0 && !isActive && (
              <motion.div
                layout
                className="relative z-10 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500 pt-2 border-t border-dashed border-gray-300 dark:border-gray-600"
              >
                <div className="flex items-center gap-2">
                  <Plus className="w-3 h-3 opacity-50" />
                  <span className="text-xs opacity-70">Add more widgets</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Fallback for non-widget mode */}
        {!isWidgetMode && zoneWidgets.length > 0 && (
          <AnimatePresence mode="popLayout">
            {widgetRows.map((row, rowIndex) => (
              <motion.div 
                key={`row-${zone}-${rowIndex}`} 
                className="grid gap-3 w-full overflow-hidden"
                layout
                transition={{ 
                  type: "spring", 
                  stiffness: 350, 
                  damping: 30,
                  duration: 0.7
                }}
                style={{
                  gridTemplateColumns: `repeat(3, 1fr)`,
                  gridAutoRows: '200px',
                  maxWidth: '100%'
                }}
              >
                {row.map((widget, widgetIndex) => {
                  const gridSpan = getGridSpan(widget.size);
                  return (
                    <motion.div 
                      key={widget.id} 
                      className="w-full h-full"
                      layout
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 30,
                        duration: 0.6
                      }}
                      style={{
                        gridColumn: `span ${gridSpan}`
                      }}
                    >
                      {renderWidget(widget, widgetIndex, zone)}
                    </motion.div>
                  );
                })}
              </motion.div>
            ))}
          </AnimatePresence>
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