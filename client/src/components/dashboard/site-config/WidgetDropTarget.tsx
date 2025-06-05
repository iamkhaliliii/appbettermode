import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface WidgetDropTargetProps {
  children: React.ReactNode;
  widgetType: string;
  isWidgetMode: boolean;
}

export function WidgetDropTarget({ children, widgetType, isWidgetMode }: WidgetDropTargetProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    const handleDragStart = () => setIsDragActive(true);
    const handleDragEnd = () => {
      setIsDragActive(false);
      setIsDragOver(false);
    };

    if (isWidgetMode) {
      document.addEventListener('dragstart', handleDragStart);
      document.addEventListener('dragend', handleDragEnd);
    }

    return () => {
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('dragend', handleDragEnd);
    };
  }, [isWidgetMode]);

  const handleDragOver = (e: React.DragEvent) => {
    if (!isWidgetMode || !isDragActive) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!isWidgetMode || !isDragActive) return;
    e.preventDefault();
    e.stopPropagation();
    
    // Only set drag over to false if we're leaving the element entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isWidgetMode || !isDragActive) return;
    e.preventDefault();
    e.stopPropagation();
    
    const widgetData = e.dataTransfer.getData('text/plain');
    
    // Simulate widget interaction with existing element
    setIsDragOver(false);
    
    // Show feedback animation
    const element = e.currentTarget as HTMLElement;
    element.style.transform = 'scale(0.95)';
    element.style.transition = 'transform 0.15s ease';
    
    setTimeout(() => {
      element.style.transform = 'scale(1.05)';
      setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.transition = '';
      }, 150);
    }, 150);
  };

  if (!isWidgetMode) {
    return <div data-widget-element="true" data-widget-type={widgetType}>{children}</div>;
  }

  return (
    <motion.div
      data-widget-element="true" 
      data-widget-type={widgetType}
      className="relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      animate={{
        scale: isDragOver ? 1.02 : 1,
        transition: { duration: 0.2 }
      }}
      style={{
        border: isDragOver 
          ? '2px solid rgba(34, 197, 94, 0.6)' 
          : isWidgetMode && isDragActive 
            ? '2px dashed rgba(59, 130, 246, 0.3)' 
            : undefined,
        borderRadius: '8px',
        position: 'relative',
        backgroundColor: isDragOver ? 'rgba(34, 197, 94, 0.05)' : undefined,
        transition: 'all 0.3s ease'
      }}
    >
      {/* Drag Over Indicator */}
      {isDragOver && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-green-500/10 backdrop-blur-sm rounded-lg z-10 pointer-events-none"
        >
          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
            Replace {widgetType}
          </div>
        </motion.div>
      )}

      {/* Shake Animation on Drag Active */}
      {isWidgetMode && isDragActive && !isDragOver && (
        <motion.div
          animate={{
            x: [0, -1, 1, -1, 1, 0],
            transition: { 
              duration: 0.5, 
              repeat: Infinity, 
              repeatDelay: 2 
            }
          }}
          className="absolute inset-0 pointer-events-none"
        />
      )}

      {children}
    </motion.div>
  );
} 