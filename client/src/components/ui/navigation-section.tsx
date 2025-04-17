
import React from "react";
import { ChevronRight } from "lucide-react";
import { MiniToggle } from "./mini-toggle";
import { NavigationItem } from "./navigation-item";

interface NavigationSectionProps {
  title: string;
  icon: React.ReactNode;
  defaultActive?: boolean;
  children?: React.ReactNode;
}

export function NavigationSection({ 
  title, 
  icon, 
  defaultActive = false,
  children 
}: NavigationSectionProps) {
  return (
    <div className="relative group">
      <div className="flex items-center justify-between py-1.5 px-2.5 rounded-md group transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
        onClick={(e) => {
          const content = e.currentTarget.nextElementSibling;
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
        <div>
          <MiniToggle isActive={defaultActive} onChange={() => {}} />
        </div>
      </div>
      <div className="hidden pl-6 pr-2 space-y-0.5">
        {children}
      </div>
    </div>
  );
}
