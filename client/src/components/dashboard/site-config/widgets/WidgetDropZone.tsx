import React, { useState, useRef } from 'react';
import { Plus, Upload } from 'lucide-react';
import { AvailableWidget } from './types';

interface WidgetDropZoneProps {
  onDrop: (widget: AvailableWidget, position: { x: number; y: number }) => void;
  isAddWidgetMode: boolean;
  children: React.ReactNode;
  className?: string;
}

export function WidgetDropZone({ onDrop, isAddWidgetMode, children, className = '' }: WidgetDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dropIndicator, setDropIndicator] = useState<{ x: number; y: number } | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    if (!isAddWidgetMode) return;
    
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    
    if (dropZoneRef.current) {
      const rect = dropZoneRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setDropIndicator({ x, y });
    }
    
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!isAddWidgetMode) return;
    
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
      setDropIndicator(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isAddWidgetMode) return;
    
    e.preventDefault();
    setIsDragOver(false);
    setDropIndicator(null);

    try {
      const widgetData = e.dataTransfer.getData('application/json');
      const widget = JSON.parse(widgetData) as AvailableWidget;
      
      if (dropZoneRef.current) {
        const rect = dropZoneRef.current.getBoundingClientRect();
        const position = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
        
        onDrop(widget, position);
      }
    } catch (error) {
      console.error('Failed to parse dropped widget data:', error);
    }
  };

  return (
    <div
      ref={dropZoneRef}
      className={`relative widget-drop-zone-container ${className} ${isAddWidgetMode ? 'widget-drop-zone-active' : ''} ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Subtle hint when in add widget mode but not dragging */}
      {isAddWidgetMode && !isDragOver && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-500/10 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium backdrop-blur-sm border border-gray-300/20 dark:border-gray-600/20">
            <Upload className="w-3 h-3" />
            <span>Drag widgets here from the sidebar</span>
          </div>
        </div>
      )}
      
      {children}
      
      {/* Drop Message and Indicator - Only show when dragging over */}
      {isAddWidgetMode && isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Drop widget here</span>
          </div>
          
          {/* Drop Position Indicator */}
          {dropIndicator && (
            <div 
              className="absolute w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: dropIndicator.x, 
                top: dropIndicator.y 
              }}
            />
          )}
        </div>
      )}
    </div>
  );
} 