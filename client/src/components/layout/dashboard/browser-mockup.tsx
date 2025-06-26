import React, { useState } from 'react';
import { User, ChevronDown, Moon as MoonIcon, Save, Loader2, Settings } from 'lucide-react';
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
  siteUrl?: string;
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
  siteUrl,
  hasChanges,
  isLoading,
  isWidgetMode = false,
  onSave,
  onDiscard,
}: BrowserMockupProps) {
  // Format URL for display in the address bar
  const displayUrl = siteUrl ? 
    (siteUrl.startsWith('/') ? 
      siteUrl.substring(1) :  // If it's a relative URL, just use the path
      new URL(siteUrl).host + new URL(siteUrl).pathname) : 
    "community.bettermode.io";

    return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 w-[calc(100vw-41.5rem)] h-[calc(100vh-100px)] shadow-2xl dark:shadow-gray-900/30 flex flex-col overflow-hidden"
      style={{
        boxShadow: '0px 32px 64px -12px rgba(16, 24, 40, 0.14)',
      }}>

      {/* Browser chrome - Balanced minimal */}
      <div className={cn(
        "px-4 py-2 border-b flex items-center justify-between transition-all duration-300 ease-in-out",
        isWidgetMode 
          ? "bg-blue-600 border-blue-700" 
          : "bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700"
      )}>
        {/* Left side with traffic lights */}
        <div className="flex space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        </div>

        {/* Centered Address bar */}
        <div className="flex-1 flex justify-center items-center gap-3">
          <div className="w-56">
            <div className={cn(
              "px-3 py-1 rounded-md border flex items-center justify-center text-xs truncate shadow-sm transition-all duration-300 ease-in-out",
              isWidgetMode
                ? "bg-blue-500 border-blue-400 text-white"
                : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400"
            )}>
              <span className="opacity-50 mr-1">https://</span>{displayUrl}
            </div>
          </div>
        </div>

        {/* Browser controls - Right aligned */}
        <div className="flex items-center space-x-3">
          {/* Save Controls */}
          {hasChanges && (
            <div className={cn(
              "flex items-center space-x-2 mr-2 pl-2 border-l transition-colors duration-300 ease-in-out",
              isWidgetMode 
                ? "border-blue-400" 
                : "border-gray-300 dark:border-gray-600"
            )}>
              <button
                onClick={onDiscard}
                className={cn(
                  "text-xs px-2 py-1 rounded-md transition-all duration-300 ease-in-out",
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
                  "flex items-center space-x-1 text-xs px-3 py-1 rounded-md transition-all duration-300 ease-in-out",
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

          {/* Undo/Redo buttons */}
          <div className="flex space-x-1">
            <button className={cn(
              "rounded-md px-1.5 py-0.5 flex items-center transition-all duration-300 ease-in-out",
              isWidgetMode
                ? "text-blue-100 hover:bg-blue-500 bg-blue-500/30"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 bg-gray-50 dark:bg-gray-700"
            )} style={{ width: '22px', height: '22px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5C7.58172 5 4 8.58172 4 13C4 17.4183 7.58172 21 12 21C16.4183 21 20 17.4183 20 13" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M15 5L12 8L9 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button className={cn(
              "rounded-md px-1.5 py-0.5 flex items-center transition-all duration-300 ease-in-out",
              isWidgetMode
                ? "text-blue-100 hover:bg-blue-500 bg-blue-500/30"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 bg-gray-50 dark:bg-gray-700"
            )} style={{ width: '22px', height: '22px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5C16.4183 5 20 8.58172 20 13C20 17.4183 16.4183 21 12 21C7.58172 21 4 17.4183 4 13" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M9 5L12 8L15 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Action Controls */}
          <div className="flex space-x-1.5">
            {/* User View Button */}
            <button
              className={cn(
                "rounded-md px-1.5 py-0.5 flex items-center text-xs transition-all duration-300 ease-in-out",
                isWidgetMode
                  ? "text-blue-100 hover:text-white hover:bg-blue-500"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <User className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">User</span>
            </button>

            {/* Language Button */}
            <button
              className={cn(
                "rounded-md px-1.5 py-0.5 flex items-center text-xs transition-all duration-300 ease-in-out",
                isWidgetMode
                  ? "text-blue-100 hover:text-white hover:bg-blue-500"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
            >
              <span className="text-xs">EN</span>
              <ChevronDown className="h-3 w-3 ml-0.5" />
            </button>

            {/* Theme Button */}
            <button
              className={cn(
                "rounded-md px-1.5 py-0.5 flex items-center text-xs transition-all duration-300 ease-in-out",
                isWidgetMode
                  ? "text-blue-100 hover:text-white hover:bg-blue-500"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            >
              <MoonIcon className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Dark</span>
              <ChevronDown className="h-3 w-3 ml-0.5" />
            </button>

            {/* Responsive View Button */}
            <button
              className={cn(
                "rounded-md px-1.5 py-0.5 flex items-center text-xs transition-all duration-300 ease-in-out",
                isWidgetMode
                  ? "text-blue-100 hover:text-white hover:bg-blue-500"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              )}
              onClick={() => setResponsiveDropdownOpen(!responsiveDropdownOpen)}
            >
              <span className="text-xs">Desktop</span>
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