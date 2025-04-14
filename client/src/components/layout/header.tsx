import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Menu, ChevronDown, ExternalLink, Globe, BarChart2, Layers, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export function Header({ onToggleMobileMenu }: HeaderProps) {
  const [activeSection, setActiveSection] = useState("spaces");

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="h-16 flex items-center">
        {/* Logo Section - same width as sidebar */}
        <div className="w-16 h-full flex items-center justify-center border-r border-gray-200">
          <svg className="h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
        </div>

        {/* Middle Section - App Navigation */}
        <div className="flex-shrink-0 h-full border-r border-gray-200">
          <div className="flex h-full">
            <HeaderNavItem 
              label="Spaces" 
              isActive={activeSection === "spaces"} 
              onClick={() => setActiveSection("spaces")} 
              icon={<Layers className="h-4 w-4 mr-1.5" />}
            />
            <HeaderNavItem 
              label="CMS" 
              isActive={activeSection === "cms"} 
              onClick={() => setActiveSection("cms")} 
              icon={<Globe className="h-4 w-4 mr-1.5" />}
            />
            <HeaderNavItem 
              label="Insights" 
              isActive={activeSection === "insights"} 
              onClick={() => setActiveSection("insights")} 
              icon={<BarChart2 className="h-4 w-4 mr-1.5" />}
            />
          </div>
        </div>

        {/* Right Section - Breadcrumbs and Actions */}
        <div className="flex-1 flex items-center justify-between px-4">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-500">
            <span>Settings</span>
            <svg className="h-4 w-4 mx-1" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-medium text-gray-900">Profile</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="h-9">
              <ExternalLink className="h-4 w-4 mr-1.5" />
              View Site
            </Button>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Button className="h-9">
                  Publish
                  <ChevronDown className="h-4 w-4 ml-1.5" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content 
                  className="bg-white rounded-md shadow-lg border border-gray-200 py-1 w-56 mt-1"
                  sideOffset={5}
                  align="end"
                >
                  <DropdownMenu.Item className="px-2 py-1.5 text-sm hover:bg-gray-50 cursor-pointer flex items-center">
                    Publish Now
                  </DropdownMenu.Item>
                  <DropdownMenu.Item className="px-2 py-1.5 text-sm hover:bg-gray-50 cursor-pointer flex items-center">
                    Schedule Publish
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                  <DropdownMenu.Item className="px-2 py-1.5 text-sm hover:bg-gray-50 cursor-pointer flex items-center text-red-600">
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
                className="text-gray-500 hover:text-gray-700"
                onClick={onToggleMobileMenu}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

interface HeaderNavItemProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

function HeaderNavItem({ label, isActive, onClick, icon }: HeaderNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "h-full px-4 flex items-center border-b-2 text-sm font-medium relative",
        isActive 
          ? "text-primary-700 border-primary-700" 
          : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
      )}
    >
      <div className="flex items-center">
        {icon}
        {label}
        <ChevronsUpDown className="h-3.5 w-3.5 ml-1 opacity-50" />
      </div>
    </button>
  );
}
