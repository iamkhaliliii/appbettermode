
import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { MiniToggle } from "./mini-toggle";
import { NavigationItem } from "./navigation-item";
import * as Tooltip from "@radix-ui/react-tooltip";

interface NavigationSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultActive?: boolean;
  children?: React.ReactNode;
  onToggleChange?: (isActive: boolean) => void;
}

export function NavigationSection({ 
  title, 
  icon, 
  defaultActive = false,
  children 
}: NavigationSectionProps) {
  const [isActive, setIsActive] = useState(defaultActive);

  const wrappedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        className: `${child.props.className || ''} ${!isActive ? 'opacity-40 pointer-events-none grayscale cursor-not-allowed bg-gray-100/50 dark:bg-gray-800/50' : ''}`
      });
    }
    return child;
  });

  return (
    <div className="relative group">
      <div 
        className="flex items-center justify-between py-1.5 px-2.5 rounded-md group transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <div 
          className="flex items-center gap-2 flex-1 cursor-pointer"
          onClick={(e) => {
            const content = e.currentTarget.closest(".relative.group")?.querySelector(".content-section");
            const chevron = e.currentTarget.querySelector(".chevron-icon");
            if (content && chevron) {
              content.classList.toggle("hidden");
              chevron.style.transform = content.classList.contains("hidden")
                ? "rotate(0deg)"
                : "rotate(90deg)";
            }
          }}
        >
        <div className="flex items-center gap-2">
          <ChevronRight className="chevron-icon h-3.5 w-3.5 text-gray-400 transition-transform duration-200" />
          {React.cloneElement(icon as React.ReactElement, {
            className: "h-3.5 w-3.5 text-gray-500"
          })}
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {title}
          </span>
        </div>
        </div>
        <div onClick={e => e.stopPropagation()} className="flex items-center gap-2">
          {isActive && (
            <Tooltip.Provider delayDuration={200}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <button className="flex items-center justify-center w-4 h-4 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                    <span className="text-gray-400 dark:text-gray-500 text-xs font-medium leading-none">+</span>
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-gray-900 text-white px-2 py-1 rounded text-xs"
                    side="top"
                  >
                    Add block
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          )}
          <MiniToggle isActive={isActive} onChange={setIsActive} />
        </div>
      </div>
      <div className="hidden pl-6 pr-2 space-y-0.5 content-section">
        {wrappedChildren}
      </div>
    </div>
  );
}
