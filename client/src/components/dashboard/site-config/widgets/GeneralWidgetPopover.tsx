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
  
  // Simple solid color schemes
  const labelBgColor = isSection 
    ? 'bg-violet-500 dark:bg-violet-600' 
    : isCustomWidget 
      ? 'bg-orange-500 dark:bg-orange-600'
      : 'bg-blue-500 dark:bg-blue-600'; // main widgets
      
  const labelTextColor = 'text-white';
  
  // Minimal border colors
  const borderColor = isSection 
    ? 'border-violet-200/50 dark:border-violet-700/50' 
    : isCustomWidget 
      ? 'border-orange-200/50 dark:border-orange-700/50'
      : 'border-blue-200/50 dark:border-blue-700/50';
      
  // Clean action button styling
  const actionTextColor = 'text-gray-600 dark:text-gray-700';
  const actionHoverColor = 'hover:bg-gray-100 dark:hover:bg-gray-200';
      
  // Widget type labels
  const getWidgetTypeLabel = () => {
    if (isSection) return 'General';
    if (isCustomWidget) return 'Custom';
    return 'Main';
  };

  return (
    <div className="relative group">
      {/* Original Content */}
      <div className={`transition-opacity duration-200 ${isHidden ? 'opacity-30' : 'opacity-100'}`}>
        {children}
      </div>
      
      {/* Action Group - Only show in widget mode */}
      {isWidgetMode && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
             style={{ zIndex: 9999 }}>
          <div className={`flex items-stretch bg-white dark:bg-gray-50 rounded-lg shadow-lg border ${borderColor} overflow-hidden`}>
            {/* Widget Name and Type Label - Colored Section */}
            <div className={`px-3 py-2 ${labelBgColor} min-w-0 flex-shrink-0`}>
              <div className={`${labelTextColor} select-none`}>
                <div className="font-medium text-xs leading-tight truncate max-w-24">
                  {widgetName}
                </div>
                <div className="text-xs opacity-80 font-normal">
                  {getWidgetTypeLabel()}
                </div>
              </div>
            </div>
            
            {/* Action Buttons Container */}
            <div className="flex items-stretch bg-white dark:bg-gray-50">
              {/* Settings Button */}
              <button
                onClick={onSettings}
                className={`px-2.5 py-2 ${actionTextColor} transition-colors duration-150 ${actionHoverColor} border-r border-gray-200 dark:border-gray-300`}
                title="Settings"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              
              {/* Hide/Unhide Button */}
              <button
                onClick={onToggleVisibility}
                disabled={isSection || isMain}
                className={`px-2.5 py-2 transition-colors duration-150 border-r border-gray-200 dark:border-gray-300 ${
                  isSection || isMain
                    ? 'cursor-not-allowed opacity-40 text-gray-400' 
                    : `${actionTextColor} hover:bg-amber-50 dark:hover:bg-amber-100 hover:text-amber-600`
                }`}
                title={
                  isSection 
                    ? "Hide/Show (Not available)" 
                    : isMain
                      ? "Hide/Show (Not available)"
                      : (isHidden ? "Show" : "Hide")
                }
              >
                {isSection || isMain ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                ) : isHidden ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                )}
              </button>
              
              {/* Drag Handle */}
              <button
                disabled={isSection}
                className={`px-2.5 py-2 transition-colors duration-150 border-r border-gray-200 dark:border-gray-300 ${
                  isSection 
                    ? 'cursor-not-allowed opacity-40 text-gray-400' 
                    : `${actionTextColor} ${actionHoverColor} cursor-grab active:cursor-grabbing`
                }`}
                title={isSection ? "Drag (Not available)" : "Drag"}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="9" cy="7" r="1.5"/>
                  <circle cx="15" cy="7" r="1.5"/>
                  <circle cx="9" cy="12" r="1.5"/>
                  <circle cx="15" cy="12" r="1.5"/>
                  <circle cx="9" cy="17" r="1.5"/>
                  <circle cx="15" cy="17" r="1.5"/>
                </svg>
              </button>
              
              {/* Delete Button */}
              <button
                onClick={onDelete}
                disabled={isSection || isMain}
                className={`px-2.5 py-2 transition-colors duration-150 rounded-r-lg ${
                  isSection || isMain
                    ? 'cursor-not-allowed opacity-40 text-gray-400' 
                    : `${actionTextColor} hover:bg-red-50 dark:hover:bg-red-100 hover:text-red-600`
                }`}
                title={
                  isSection 
                    ? "Remove (Not available)" 
                    : isMain
                      ? "Remove (Not available)"
                      : "Remove"
                }
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 