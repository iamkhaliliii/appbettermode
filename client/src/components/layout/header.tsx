import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Menu, ChevronDown, ExternalLink, Database, BarChart2, Files, ChevronUp } from "lucide-react";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export function Header({ onToggleMobileMenu }: HeaderProps) {
  // Set all sections inactive initially
  const [activeSection, setActiveSection] = useState("");

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="h-12 flex items-center">
        {/* Logo Section - same width as sidebar */}
        <div className="w-12 h-full flex items-center justify-center border-r border-gray-200">
          <svg width="24" height="24" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28.9912 0C12.9792 0 0 12.9792 0 28.9912C0 45.0032 12.9792 57.9824 28.9912 57.9824C45.0032 57.9824 57.9824 45.0032 57.9824 28.9912C57.9824 12.9792 45.0032 0 28.9912 0ZM34.4282 38.051H23.5554C18.551 38.051 14.4967 33.9956 14.4967 28.9912C14.4967 23.9868 18.5521 19.9315 23.5554 19.9315H34.4282C39.4326 19.9315 43.4868 23.9868 43.4868 28.9912C43.4868 33.9956 39.4315 38.051 34.4282 38.051Z" fill="currentColor"/>
            <path d="M34.427 36.2389C38.4299 36.2389 41.6748 32.9939 41.6748 28.9911C41.6748 24.9882 38.4299 21.7433 34.427 21.7433C30.4242 21.7433 27.1792 24.9882 27.1792 28.9911C27.1792 32.9939 30.4242 36.2389 34.427 36.2389Z" fill="currentColor"/>
          </svg>
        </div>

        {/* Middle Section - App Navigation */}
        <div className="w-64 flex-shrink-0 h-full border-r border-gray-200">
          <div className="flex h-full items-center justify-center gap-2 px-2">
            <Tooltip.Provider delayDuration={200}>
              <Tooltip.Root>
                <DropdownMenu.Root>
                  <Tooltip.Trigger asChild>
                    <DropdownMenu.Trigger asChild>
                      <button
                        className="flex items-center gap-1 justify-center p-1.5 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
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
                    className="bg-white rounded-md shadow-sm border border-gray-200 py-1 w-48 mt-1"
                    sideOffset={5}
                  >
                    <DropdownMenu.Item className="px-3 py-1.5 text-xs hover:bg-gray-50 cursor-pointer">
                      Home Page
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="px-3 py-1.5 text-xs hover:bg-gray-50 cursor-pointer">
                      About Us
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="px-3 py-1.5 text-xs hover:bg-gray-50 cursor-pointer">
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
                        className="flex items-center gap-1 justify-center p-1.5 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
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
                    className="bg-white rounded-md shadow-sm border border-gray-200 py-1 w-48 mt-1"
                    sideOffset={5}
                  >
                    <DropdownMenu.Item className="px-3 py-1.5 text-xs hover:bg-gray-50 cursor-pointer">
                      Users
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="px-3 py-1.5 text-xs hover:bg-gray-50 cursor-pointer">
                      Products
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="px-3 py-1.5 text-xs hover:bg-gray-50 cursor-pointer">
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
                        className="flex items-center gap-1 justify-center p-1.5 rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
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
                    className="bg-white rounded-md shadow-sm border border-gray-200 py-1 w-48 mt-1"
                    sideOffset={5}
                  >
                    <DropdownMenu.Item className="px-3 py-1.5 text-xs hover:bg-gray-50 cursor-pointer">
                      Analytics
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="px-3 py-1.5 text-xs hover:bg-gray-50 cursor-pointer">
                      Conversions
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="px-3 py-1.5 text-xs hover:bg-gray-50 cursor-pointer">
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
          <div className="flex items-center text-xs text-gray-500">
            <span>Settings</span>
            <svg className="h-3 w-3 mx-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium text-gray-900">Profile</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="secondary-gray" size="sm">
              <ExternalLink />
              View
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
                  className="bg-white rounded-md shadow-sm border border-gray-200 py-1 w-48 mt-1"
                  sideOffset={5}
                  align="end"
                >
                  <DropdownMenu.Item className="px-3 py-1 text-xs hover:bg-gray-50 cursor-pointer flex items-center">
                    Publish Now
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="px-3 py-1 text-xs hover:bg-gray-50 cursor-pointer flex items-center">
                    Schedule Publish
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                  <DropdownMenu.Item className="px-3 py-1 text-xs hover:bg-gray-50 cursor-pointer flex items-center text-red-600">
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


