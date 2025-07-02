import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GeneralWidgetPopoverProps {
  children: React.ReactNode;
  widgetName: string;
  isSelected?: boolean;
  position?: 'top' | 'bottom';
  onSettings?: () => void;
  onToggleVisibility?: () => void;
  onDelete?: () => void;
  isHidden?: boolean;
  widgetType?: 'section' | 'widget' | 'main';
  isWidgetMode?: boolean;
}

export function GeneralWidgetPopover({ 
  children, 
  widgetName, 
  isSelected = false, 
  position = 'top',
  onSettings,
  onToggleVisibility,
  onDelete,
  isHidden = false,
  widgetType = 'section',
  isWidgetMode = false
}: GeneralWidgetPopoverProps) {

  const isSection = widgetType === 'section';
  const isMain = widgetType === 'main';
  const isCustomWidget = widgetType === 'widget';
  
  // Color schemes
  const labelBgColor = isSection ? 'bg-purple-50 dark:bg-purple-900/30' : 'bg-blue-50 dark:bg-blue-900/30';
  const labelTextColor = isSection ? 'text-purple-700 dark:text-purple-300' : 'text-blue-700 dark:text-blue-300';
  const settingsHoverColor = isSection ? 'hover:text-purple-600 dark:hover:text-purple-400' : 'hover:text-blue-600 dark:hover:text-blue-400';

  return (
    <div className="relative group">
      {/* Original Content */}
      <div className={`transition-opacity ${isHidden ? 'opacity-30' : 'opacity-100'}`}>
        {children}
      </div>
      
      {/* Action Group - Only show in widget mode */}
      {isWidgetMode && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <div className="flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden">
            {/* Widget Name Label */}
            <div className={`px-3 py-2 ${labelBgColor} border-r border-gray-200 dark:border-gray-600`}>
              <span className={`text-xs font-medium ${labelTextColor}`}>
                {widgetName}
              </span>
            </div>
            
            {/* Settings Button */}
            <button
              onClick={onSettings}
              className={`p-2 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 ${settingsHoverColor} transition-colors border-r border-gray-200 dark:border-gray-600`}
              title="Widget Settings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            
            {/* Hide/Unhide Button */}
            <button
              onClick={onToggleVisibility}
              disabled={isSection || isMain}
              className={`p-2 transition-colors border-r border-gray-200 dark:border-gray-600 ${
                isSection || isMain
                  ? 'cursor-not-allowed opacity-50 text-gray-400 dark:text-gray-500' 
                  : isHidden 
                    ? 'hover:bg-gray-50 dark:hover:bg-gray-700 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400'
              }`}
              title={
                isSection 
                  ? "Hide/Show (Not available for sections)" 
                  : isMain
                    ? "Hide/Show (Not available for main widgets)"
                    : (isHidden ? "Show Widget" : "Hide Widget")
              }
            >
              {isSection || isMain ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : isHidden ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              )}
            </button>
            
            {/* Drag Handle */}
            <button
              disabled={isSection}
              className={`p-2 transition-colors border-r border-gray-200 dark:border-gray-600 ${
                isSection 
                  ? 'cursor-not-allowed opacity-50 text-gray-400 dark:text-gray-500' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-grab active:cursor-grabbing'
              }`}
              title={isSection ? "Drag (Not available for sections)" : "Drag to Reorder"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </button>
            
            {/* Delete Button */}
            <button
              onClick={onDelete}
              disabled={isSection || isMain}
              className={`p-2 transition-colors ${
                isSection || isMain
                  ? 'cursor-not-allowed opacity-50 text-gray-400 dark:text-gray-500' 
                  : 'hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
              }`}
              title={
                isSection 
                  ? "Remove (Not available for sections)" 
                  : isMain
                    ? "Remove (Not available for main widgets)"
                    : "Remove Widget"
              }
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 