import React, { useState } from 'react';
import { User, ChevronDown, Moon as MoonIcon, Save, Loader2, Settings, Calendar, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrowserMockupProps {
  children: React.ReactNode;
  userDropdownOpen: boolean;
  setUserDropdownOpen: (open: boolean) => void;
  languageDropdownOpen: boolean;
  setLanguageDropdownOpen: (open: boolean) => void;
  themeDropdownOpen: boolean;
  setThemeDropdownOpen: (open: boolean) => void;
  responsiveDropdownOpen: boolean;
  setResponsiveDropdownOpen: (open: boolean) => void;

  hasChanges?: boolean;
  isLoading?: boolean;
  isWidgetMode?: boolean;
  onSave?: () => void;
  onDiscard?: () => void;
}

export function BrowserMockup({
  children,
  userDropdownOpen,
  setUserDropdownOpen,
  languageDropdownOpen,
  setLanguageDropdownOpen,
  themeDropdownOpen,
  setThemeDropdownOpen,
  responsiveDropdownOpen,
  setResponsiveDropdownOpen,

  hasChanges,
  isLoading,
  isWidgetMode = false,
  onSave,
  onDiscard,
}: BrowserMockupProps) {
  const [activeTab, setActiveTab] = useState<'all-events' | 'single-event'>('all-events');

    return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 w-[calc(100vw-41.5rem)] h-[calc(100vh-100px)] shadow-2xl dark:shadow-gray-900/30 flex flex-col overflow-hidden"
      style={{
        boxShadow: '0px 32px 64px -12px rgba(16, 24, 40, 0.14)',
      }}>

              {/* Browser chrome - Clean layout */}
        <div className={cn(
          "px-4 flex items-center transition-all duration-300 ease-in-out",
          isWidgetMode 
            ? "bg-blue-600" 
            : "bg-gray-100 dark:bg-gray-900"
        )}>
        {/* Left side - Traffic lights */}
        <div className="flex items-center space-x-2 py-2 mr-4">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        </div>

                  {/* Center - Tab Navigation */}
          <div className="flex-1 flex justify-start pt-1">
            <div className="flex items-center space-x-0.5">
                        {/* All Events Tab */}
            <div 
              className={cn(
                "relative px-4 py-2 text-xs font-medium rounded-t-lg border-t border-l border-r transition-all duration-300 ease-in-out cursor-pointer flex items-center space-x-2 min-w-0 max-w-48",
                activeTab === 'all-events'
                  ? (isWidgetMode
                      ? "bg-white/90 border-blue-300 text-gray-900 border-b-white"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white border-b-white dark:border-b-gray-800")
                  : (isWidgetMode
                    ? "bg-blue-500/10 border-blue-400/20 text-blue-200 hover:text-white hover:bg-blue-400/30 border-b-blue-600"
                    : "bg-gray-200/50 dark:bg-gray-700/50 border-gray-300/50 dark:border-gray-600/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/80 border-b-gray-300")
                )}
              onClick={() => setActiveTab('all-events')}
            >
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">All Events</span>
            </div>
            
            {/* Single Event Tab */}
            <div 
              className={cn(
                "relative px-4 py-2 text-xs font-medium rounded-t-lg border-t border-l border-r transition-all duration-300 ease-in-out cursor-pointer flex items-center space-x-2 min-w-0 max-w-48",
                activeTab === 'single-event'
                  ? (isWidgetMode
                    ? "bg-white/90 border-blue-300 text-gray-900 border-b-white"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white border-b-white dark:border-b-gray-800")
                    : (isWidgetMode
                      ? "bg-blue-500/10 border-blue-400/20 text-blue-200 hover:text-white hover:bg-blue-400/30 border-b-blue-600"
                      : "bg-gray-200/50 dark:bg-gray-700/50 border-gray-300/50 dark:border-gray-600/50 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/80 border-b-gray-300")
              )}
              onClick={() => setActiveTab('single-event')}
            >
              <Star className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">Single Event</span>
            </div>
          </div>
        </div>

        {/* Right side - Browser controls */}
        <div className="flex items-center py-1.5 space-x-2 ">
          {/* Undo/Redo buttons */}
          {/* Action Controls */}
          <div className="flex space-x-1">
          {/* Save Controls */}
          {hasChanges && (
              <div className="flex items-center space-x-1">
              <button
                onClick={onDiscard}
                  className={cn(
                    "text-xs px-2 rounded-md transition-all duration-300 ease-in-out",
                    isWidgetMode
                      ? "text-blue-100 hover:text-white hover:bg-blue-500"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                disabled={isLoading}
              >
                Discard
              </button>
              <button
                onClick={onSave}
                disabled={!hasChanges || isLoading}
                className={cn(
                    "flex items-center space-x-1 text-xs px-2  rounded-md transition-all duration-300 ease-in-out",
                  !hasChanges || isLoading 
                      ? (isWidgetMode 
                          ? 'text-blue-300 cursor-not-allowed' 
                          : 'text-gray-400 dark:text-gray-600 cursor-not-allowed')
                      : (isWidgetMode 
                          ? 'text-blue-600 bg-white hover:bg-blue-50'
                          : 'text-white bg-blue-600 hover:bg-blue-700')
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3 h-3" />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          )}

            {/* User View Button */}
            <button
              className={cn(
                "rounded-md px-2 flex items-center text-xs transition-all duration-300 ease-in-out",
                isWidgetMode
                  ? "text-blue-100 hover:text-white hover:bg-blue-500"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <User className="h-3.5 w-3.5 mr-1" />
              <span>User</span>
            </button>

            {/* Language Button */}
            <button
              className={cn(
                "rounded-md px-2 flex items-center text-xs transition-all duration-300 ease-in-out",
                isWidgetMode
                  ? "text-blue-100 hover:text-white hover:bg-blue-500"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
            >
              <span>EN</span>
              <ChevronDown className="h-3 w-3 ml-0.5" />
            </button>

            {/* Theme Button */}
            <button
              className={cn(
                "rounded-md px-2 flex items-center text-xs transition-all duration-300 ease-in-out",
                isWidgetMode
                  ? "text-blue-100 hover:text-white hover:bg-blue-500"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            >
              <MoonIcon className="h-3.5 w-3.5 mr-1" />
              <span>Dark</span>
              <ChevronDown className="h-3 w-3 ml-0.5" />
            </button>

            {/* Responsive View Button */}
            <button
              className={cn(
                "rounded-md px-2 flex items-center text-xs transition-all duration-300 ease-in-out",
                isWidgetMode
                  ? "text-blue-100 hover:text-white hover:bg-blue-500"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
              onClick={() => setResponsiveDropdownOpen(!responsiveDropdownOpen)}
            >
              <span>Desktop</span>
              <ChevronDown className="h-3 w-3 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
      {/* Browser content will be passed as children */}
      <div className="bg-white dark:bg-gray-900 flex-1 overflow-y-auto overflow-x-hidden min-h-0 scrollbar-thin scrollbar-thumb-gray-200/80 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div style={{
          transform: 'scale(0.75)',
          transformOrigin: 'top left',
          width: '135%',
          height: '100%'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
} 