import React from 'react';
import { Plus, Lock } from 'lucide-react';
import { WidgetCardProps } from './types';

export function WidgetCard({ widget, onAddWidget }: WidgetCardProps) {
  const handleClick = () => {
    if (!widget.locked) {
      onAddWidget(widget);
    }
  };

  return (
    <div className={`flex flex-col ${widget.gridSize}`}>
      <button
        onClick={handleClick}
        disabled={widget.locked}
        className={`group relative w-full border border-transparent rounded-lg overflow-hidden transition-all duration-200 ${
          widget.gridSize === 'col-span-1 row-span-1' ? 'aspect-square' : 'h-16'
        } ${
          widget.locked 
            ? 'cursor-not-allowed opacity-50' 
            : 'hover:shadow-md hover:scale-[1.02] cursor-pointer'
        }`}
      >
        {/* Minimal UI Design */}
        <div className={`relative w-full h-full bg-gradient-to-br ${widget.color} flex items-center justify-center backdrop-blur-sm ${
          widget.locked ? 'opacity-30' : ''
        }`}>
          {/* Background pattern */}
          <div className="absolute inset-0 bg-white/5 dark:bg-black/10">
            <div className="w-full h-full bg-gradient-to-r from-white/10 via-transparent to-white/5 dark:from-white/5 dark:via-transparent dark:to-black/5"></div>
          </div>
          
          {/* Widget Icon */}
          <div className="relative z-10 w-8 h-8 rounded-md bg-white/30 dark:bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-sm">
            <widget.icon className="w-5 h-5 text-white drop-shadow-sm" />
          </div>
          
          {/* Lock overlay for locked widgets */}
          {widget.locked && (
            <div className="absolute top-1 right-1 w-5 h-5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg z-20">
              <Lock className="w-3 h-3 text-gray-700 dark:text-gray-300" />
            </div>
          )}
          
          {/* Size indicator on hover */}
          <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md text-[8px] bg-black/60 dark:bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm">
            <span className="font-medium text-white">{widget.size}</span>
          </div>
          
          {/* Add button for unlocked widgets */}
          {!widget.locked && (
            <div className="absolute top-1 right-1 w-4 h-4 bg-white/40 dark:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm">
              <Plus className="w-2.5 h-2.5 text-white drop-shadow-sm" />
            </div>
          )}
        </div>
      </button>
      
      {/* Widget Name Below Card */}
      <div className="pt-1">
        <h3 className={`text-[9px] font-medium text-left leading-tight break-words ${
          widget.locked 
            ? 'text-gray-500 dark:text-gray-500' 
            : 'text-gray-900 dark:text-white'
        }`}>
          {widget.name}
        </h3>
      </div>
    </div>
  );
} 