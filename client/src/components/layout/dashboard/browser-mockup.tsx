import React, { useState } from 'react';
import { User, ChevronDown, Moon as MoonIcon } from 'lucide-react';
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
}: BrowserMockupProps) {
  // Format URL for display in the address bar
  const displayUrl = siteUrl ? 
    (siteUrl.startsWith('/') ? 
      siteUrl.substring(1) :  // If it's a relative URL, just use the path
      new URL(siteUrl).host + new URL(siteUrl).pathname) : 
    "community.bettermode.io";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 w-full h-[calc(100vh-100px)] shadow-2xl dark:shadow-gray-900/30"
      style={{
        boxShadow: '0px 32px 64px -12px rgba(16, 24, 40, 0.14)',
      }}>

      {/* Browser chrome - Balanced minimal */}
      <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {/* Left side with traffic lights */}
        <div className="flex space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        </div>

        {/* Centered Address bar */}
        <div className="flex-1 flex justify-center">
          <div className="w-56">
            <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-md border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 truncate shadow-sm">
              <span className="opacity-50 mr-1">https://</span>{displayUrl}
            </div>
          </div>
        </div>

        {/* Browser controls - Right aligned */}
        <div className="flex items-center space-x-3">
          {/* Undo/Redo buttons */}
          <div className="flex space-x-1">
            <button className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md px-1.5 py-0.5 flex items-center bg-gray-50 dark:bg-gray-700 transition-colors" style={{ width: '22px', height: '22px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5C7.58172 5 4 8.58172 4 13C4 17.4183 7.58172 21 12 21C16.4183 21 20 17.4183 20 13" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M15 5L12 8L9 5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md px-1.5 py-0.5 flex items-center bg-gray-50 dark:bg-gray-700 transition-colors" style={{ width: '22px', height: '22px' }}>
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
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md px-1.5 py-0.5 flex items-center text-xs transition-colors"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            >
              <User className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">User</span>
            </button>

            {/* Language Button */}
            <button
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md px-1.5 py-0.5 flex items-center text-xs transition-colors"
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
            >
              <span className="text-xs">EN</span>
              <ChevronDown className="h-3 w-3 ml-0.5" />
            </button>

            {/* Theme Button */}
            <button
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md px-1.5 py-0.5 flex items-center text-xs transition-colors"
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            >
              <MoonIcon className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Dark</span>
              <ChevronDown className="h-3 w-3 ml-0.5" />
            </button>

            {/* Responsive View Button */}
            <button
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md px-1.5 py-0.5 flex items-center text-xs transition-colors"
              onClick={() => setResponsiveDropdownOpen(!responsiveDropdownOpen)}
            >
              <span className="text-xs">Desktop</span>
              <ChevronDown className="h-3 w-3 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
      {/* Browser content will be passed as children */}
      <div className="bg-white dark:bg-gray-900 flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
} 