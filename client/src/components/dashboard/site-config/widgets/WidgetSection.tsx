import React from 'react';
import { ChevronDown, Settings, Eye, EyeOff, Trash2, Lock, Plus } from 'lucide-react';
import { WidgetSectionProps } from './types';

export function WidgetSection({ 
  title, 
  widgets, 
  expanded, 
  onToggleExpanded, 
  onWidgetClick, 
  onAddWidget,
  isBaseSection = false 
}: WidgetSectionProps) {
  
  const renderAddButton = () => {
    if (title !== 'Custom Widgets' || !onAddWidget) return null;
    
    return (
      <button
        className="group relative bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors duration-200 min-w-0 w-full"
        onClick={onAddWidget}
      >
        <div className="flex items-center justify-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Add New Widget
            </div>
          </div>
        </div>
      </button>
    );
  };

  const renderWidget = (widget: any) => {
    if (isBaseSection) {
      return (
        <div
          key={widget.id}
          className="group relative bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-900/50 border border-gray-300/40 dark:border-gray-800/40 rounded-xl p-3 opacity-60 transition-all duration-200 min-w-0 cursor-not-allowed"
        >
          <div className="flex items-center justify-between gap-3 min-w-0">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <widget.icon className="w-4 h-4 text-gray-400 dark:text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-500 truncate">
                  {widget.name}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-600 truncate">
                  {widget.type === 'system' ? 'System Widget' : 'Content Widget'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center flex-shrink-0">
              <div className="p-1.5 rounded-lg border border-transparent opacity-60 cursor-not-allowed">
                <Lock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Regular widget (main or custom)
    return (
      <div
        key={widget.id}
        className="group relative bg-gradient-to-r from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-800/50 border border-gray-200/60 dark:border-gray-700/60 rounded-xl p-3 hover:shadow-sm hover:border-gray-300/80 dark:hover:border-gray-600/80 hover:from-gray-50 hover:to-gray-100/50 dark:hover:from-gray-750 dark:hover:to-gray-700/50 transition-all duration-200 min-w-0 cursor-pointer"
        onClick={() => onWidgetClick(widget)}
      >
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors duration-200">
              <widget.icon className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {widget.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {widget.type === 'system' ? 'System Widget' : 'Content Widget'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-0 flex-shrink-0">
            {title === 'Main Widget' ? (
              <button 
                className={`p-1 rounded-lg transition-all duration-200 border border-transparent ${
                  widget.type === 'system' 
                    ? 'opacity-40 cursor-not-allowed' 
                    : 'hover:bg-white dark:hover:bg-gray-600 opacity-60 group-hover:opacity-100 hover:shadow-sm hover:border-gray-200 dark:hover:border-gray-600'
                }`}
                title={widget.type === 'system' ? "Only editable on Enterprise plan" : "Widget settings"}
                onClick={(e) => {
                  e.stopPropagation();
                  if (widget.type !== 'system') {
                    // Handle settings for non-system widgets
                  }
                }}
                disabled={widget.type === 'system'}
              >
                <Settings className={`w-3 h-3 ${
                  widget.type === 'system' 
                    ? 'text-gray-400 dark:text-gray-500' 
                    : 'text-gray-600 dark:text-gray-300'
                }`} />
              </button>
            ) : (
              <>
                <button 
                  className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all duration-200 opacity-60 group-hover:opacity-100 hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                  title="Widget settings"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle settings
                  }}
                >
                  <Settings className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                </button>
                
                <button 
                  className="p-1 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all duration-200 opacity-60 group-hover:opacity-100 hover:shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                  title={widget.settings?.visibility ? 'Hide widget' : 'Show widget'}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle visibility toggle
                  }}
                >
                  {widget.settings?.visibility ? (
                    <Eye className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <EyeOff className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                  )}
                </button>
                
                <button 
                  className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 opacity-60 group-hover:opacity-100 hover:shadow-sm border border-transparent hover:border-red-200 dark:hover:border-red-800"
                  title="Delete widget"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle delete
                  }}
                >
                  <Trash2 className="w-3 h-3 text-red-500 dark:text-red-400" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-w-0">
      <button
        onClick={onToggleExpanded}
        className="w-full flex items-center justify-between text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors mb-2"
      >
        <div className="flex items-center gap-1.5">
          <span className="truncate">{title}</span>
        </div>
        <ChevronDown className={`w-3 h-3 transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`} />
      </button>
      
      {expanded && (
        <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
          {widgets.map(renderWidget)}
          {renderAddButton()}
        </div>
      )}
    </div>
  );
} 