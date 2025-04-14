import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Menu, ChevronDown, ExternalLink, Database, BarChart2, Files, ChevronUp } from "lucide-react";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export function Header({ onToggleMobileMenu }: HeaderProps) {
  const [location] = useLocation();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="h-12 flex items-center">
        {/* Logo Section - same width as sidebar */}
        <div className="w-12 h-full flex items-center justify-center border-r border-gray-200 dark:border-gray-700">
          <svg width="24" height="24" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28.9912 0C12.9792 0 0 12.9792 0 28.9912C0 45.0032 12.9792 57.9824 28.9912 57.9824C45.0032 57.9824 57.9824 45.0032 57.9824 28.9912C57.9824 12.9792 45.0032 0 28.9912 0ZM34.4282 38.051H23.5554C18.551 38.051 14.4967 33.9956 14.4967 28.9912C14.4967 23.9868 18.5521 19.9315 23.5554 19.9315H34.4282C39.4326 19.9315 43.4868 23.9868 43.4868 28.9912C43.4868 33.9956 39.4315 38.051 34.4282 38.051Z" fill="currentColor"/>
            <path d="M34.427 36.2389C38.4299 36.2389 41.6748 32.9939 41.6748 28.9911C41.6748 24.9882 38.4299 21.7433 34.427 21.7433C30.4242 21.7433 27.1792 24.9882 27.1792 28.9911C27.1792 32.9939 30.4242 36.2389 34.427 36.2389Z" fill="currentColor"/>
          </svg>
        </div>

        {/* Middle Section - App Navigation */}
        <div className="w-64 flex-shrink-0 h-full border-r border-gray-200 dark:border-gray-700">
          <div className="flex h-full items-center justify-center gap-2 px-2">
            <Tooltip.Provider delayDuration={200}>
              <Tooltip.Root>
                <DropdownMenu.Root>
                  <Tooltip.Trigger asChild>
                    <DropdownMenu.Trigger asChild>
                      <button
                        className="flex items-center gap-1 justify-center p-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Files className="h-3.5 w-3.5" />
                        <ChevronDown className="h-2.5 w-2.5 opacity-40" />
                      </button>
                    </DropdownMenu.Trigger>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-gray-900 text-white px-2 py-1 rounded text-xs"
                      side="bottom"
                      sideOffset={5}
                    >
                      Pages
                      <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                  <DropdownMenu.Content 
                    className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 py-1 w-48 mt-1"
                    sideOffset={5}
                  >
                    <DropdownMenu.Item className="px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300">
                      Home Page
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300">
                      About Us
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300">
                      Services
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Tooltip.Root>
            </Tooltip.Provider>
            
            <Tooltip.Provider delayDuration={200}>
              <Tooltip.Root>
                <DropdownMenu.Root>
                  <Tooltip.Trigger asChild>
                    <DropdownMenu.Trigger asChild>
                      <button
                        className="flex items-center gap-1 justify-center p-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Database className="h-3.5 w-3.5" />
                        <ChevronDown className="h-2.5 w-2.5 opacity-40" />
                      </button>
                    </DropdownMenu.Trigger>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-gray-900 text-white px-2 py-1 rounded text-xs"
                      side="bottom"
                      sideOffset={5}
                    >
                      Database
                      <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                  <DropdownMenu.Content 
                    className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 py-1 w-48 mt-1"
                    sideOffset={5}
                  >
                    <DropdownMenu.Item className="px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300">
                      Users
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300">
                      Products
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300">
                      Categories
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Tooltip.Root>
            </Tooltip.Provider>
            
            <Tooltip.Provider delayDuration={200}>
              <Tooltip.Root>
                <DropdownMenu.Root>
                  <Tooltip.Trigger asChild>
                    <DropdownMenu.Trigger asChild>
                      <button
                        className="flex items-center gap-1 justify-center p-1.5 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <BarChart2 className="h-3.5 w-3.5" />
                        <ChevronDown className="h-2.5 w-2.5 opacity-40" />
                      </button>
                    </DropdownMenu.Trigger>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-gray-900 text-white px-2 py-1 rounded text-xs"
                      side="bottom"
                      sideOffset={5}
                    >
                      Insights
                      <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                  <DropdownMenu.Content 
                    className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 py-1 w-48 mt-1"
                    sideOffset={5}
                  >
                    <DropdownMenu.Item className="px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300">
                      Analytics
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300">
                      Conversions
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer text-gray-700 dark:text-gray-300">
                      Traffic
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </div>

        {/* Right Section - Breadcrumbs and Actions */}
        <div className="flex-1 flex items-center justify-between px-3">
          {/* Breadcrumbs */}
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <span>Dashboard</span>
            
            {/* Handle second level of breadcrumb */}
            {location !== '/' && location !== '/dashboard' && (
              <>
                {/* Separator */}
                <svg className="h-3 w-3 mx-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                
                {/* Path-specific sections */}
                {location.startsWith('/dashboard') && (
                  <span>
                    {/* For single level */}
                    {location.split('/').length <= 3 && 
                      <span className="font-medium text-gray-900 dark:text-white">
                        {location.split('/')[2].charAt(0).toUpperCase() + location.split('/')[2].slice(1)}
                      </span>
                    }
                    {/* For multi level */}
                    {location.split('/').length > 3 &&
                      <span>
                        {location.split('/')[2].charAt(0).toUpperCase() + location.split('/')[2].slice(1)}
                      </span>
                    }
                  </span>
                )}
                
                {location.startsWith('/content') && (
                  <span>
                    {/* Single level */}
                    {location === '/content' && 
                      <span className="font-medium text-gray-900 dark:text-white">Content</span>
                    }
                    
                    {/* Multi level */}
                    {location !== '/content' && (
                      <>
                        <span>Content</span>
                        <svg className="h-3 w-3 mx-1 inline" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {location.split('/')[2].charAt(0).toUpperCase() + location.split('/')[2].slice(1)}
                        </span>
                      </>
                    )}
                  </span>
                )}
                
                {location.startsWith('/people') && (
                  <span>
                    {/* Single level */}
                    {location === '/people' && 
                      <span className="font-medium text-gray-900 dark:text-white">People</span>
                    }
                    
                    {/* Multi level */}
                    {location !== '/people' && (
                      <>
                        <span>People</span>
                        <svg className="h-3 w-3 mx-1 inline" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {location.split('/')[2].charAt(0).toUpperCase() + location.split('/')[2].slice(1)}
                        </span>
                      </>
                    )}
                  </span>
                )}
                
                {location.startsWith('/design-studio') && (
                  <span>
                    {/* Single level */}
                    {location === '/design-studio' && 
                      <span className="font-medium text-gray-900 dark:text-white">Design Studio</span>
                    }
                    
                    {/* Multi level */}
                    {location !== '/design-studio' && (
                      <>
                        <span>Design Studio</span>
                        <svg className="h-3 w-3 mx-1 inline" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {location.split('/')[2].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </>
                    )}
                  </span>
                )}
                
                {location.startsWith('/appearance') && (
                  <span>
                    {/* Single level */}
                    {location === '/appearance' && 
                      <span className="font-medium text-gray-900 dark:text-white">Appearance</span>
                    }
                    
                    {/* Multi level */}
                    {location !== '/appearance' && (
                      <>
                        <span>Appearance</span>
                        <svg className="h-3 w-3 mx-1 inline" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {location.split('/')[2].charAt(0).toUpperCase() + location.split('/')[2].slice(1)}
                        </span>
                      </>
                    )}
                  </span>
                )}

                {location.startsWith('/settings') && (
                  <span>
                    {/* Single level */}
                    {location === '/settings' && 
                      <span className="font-medium text-gray-900 dark:text-white">Settings</span>
                    }
                    
                    {/* Multi level */}
                    {location !== '/settings' && (
                      <>
                        <span>Settings</span>
                        <svg className="h-3 w-3 mx-1 inline" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {location.split('/')[2].split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </>
                    )}
                  </span>
                )}
                
                {location.startsWith('/billing') && (
                  <span>
                    {/* Single level */}
                    {location === '/billing' && 
                      <span className="font-medium text-gray-900 dark:text-white">Billing</span>
                    }
                    
                    {/* Multi level */}
                    {location !== '/billing' && (
                      <>
                        <span>Billing</span>
                        <svg className="h-3 w-3 mx-1 inline" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {location.split('/')[2].charAt(0).toUpperCase() + location.split('/')[2].slice(1)}
                        </span>
                      </>
                    )}
                  </span>
                )}
                
                {location.startsWith('/reports') && (
                  <span>
                    {/* Single level */}
                    {location === '/reports' && 
                      <span className="font-medium text-gray-900 dark:text-white">Reports</span>
                    }
                    
                    {/* Multi level */}
                    {location !== '/reports' && (
                      <>
                        <span>Reports</span>
                        <svg className="h-3 w-3 mx-1 inline" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {location.split('/')[2].charAt(0).toUpperCase() + location.split('/')[2].slice(1)}
                        </span>
                      </>
                    )}
                  </span>
                )}
                
                {location.startsWith('/app-store') && (
                  <span>
                    {/* Single level */}
                    {location === '/app-store' && 
                      <span className="font-medium text-gray-900 dark:text-white">App Store</span>
                    }
                    
                    {/* Multi level */}
                    {location !== '/app-store' && (
                      <>
                        <span>App Store</span>
                        <svg className="h-3 w-3 mx-1 inline" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {location.split('/')[2].charAt(0).toUpperCase() + location.split('/')[2].slice(1)}
                        </span>
                      </>
                    )}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="secondary-gray" size="sm" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
              <ExternalLink className="h-4 w-4 mr-1" />
              View Site
            </Button>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button variant="default" size="sm">
                  Publish
                  <ChevronDown />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content 
                  className="bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 py-1 w-48 mt-1"
                  sideOffset={5}
                  align="end"
                >
                  <DropdownMenu.Item className="px-3 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center text-gray-700 dark:text-gray-300">
                    Publish Now
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="px-3 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center text-gray-700 dark:text-gray-300">
                    Schedule Publish
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                  <DropdownMenu.Item className="px-3 py-1 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center text-red-600 dark:text-red-400">
                    Unpublish
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onToggleMobileMenu}
              >
                <Menu />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


