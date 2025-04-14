import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Menu, ChevronDown, ExternalLink, Database, BarChart2, FileText, ChevronUp } from "lucide-react";
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
          <svg className="h-6 w-6 text-primary-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>

        {/* Middle Section - App Navigation */}
        <div className="w-64 flex-shrink-0 h-full border-r border-gray-200">
          <div className="flex h-full items-center justify-center gap-3 px-2">
            <Tooltip.Provider delayDuration={200}>
              <Tooltip.Root>
                <DropdownMenu.Root>
                  <Tooltip.Trigger asChild>
                    <DropdownMenu.Trigger asChild>
                      <button
                        className="h-7 w-9 flex items-center gap-0.5 justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                      >
                        <FileText className="h-4 w-4" />
                        <ChevronDown className="h-2.5 w-2.5 opacity-40 ml-0.5" />
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
                        className="h-7 w-9 flex items-center gap-0.5 justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                      >
                        <Database className="h-4 w-4" />
                        <ChevronDown className="h-2.5 w-2.5 opacity-40 ml-0.5" />
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
                        className="h-7 w-9 flex items-center gap-0.5 justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                      >
                        <BarChart2 className="h-4 w-4" />
                        <ChevronDown className="h-2.5 w-2.5 opacity-40 ml-0.5" />
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
            <Button variant="outline" size="sm" className="h-7 rounded-md text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              View
            </Button>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button className="h-7 rounded-md text-xs">
                  Publish
                  <ChevronDown className="h-3 w-3 ml-1" />
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
                size="sm" 
                className="h-7 w-7 flex items-center justify-center p-0 text-gray-500 hover:text-gray-700"
                onClick={onToggleMobileMenu}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}


