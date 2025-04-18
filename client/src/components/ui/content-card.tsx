
import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "./avatar";
import { Database, MessageSquare, Star, Calendar, Plus } from "lucide-react";

interface ContentCardProps {
  variant: "content-type" | "page";
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor?: string;
  badges?: Array<{
    icon: React.ReactNode;
    label: string;
    color?: string;
  }>;
  onClick?: () => void;
}

export function ContentCard({
  variant,
  title,
  description,
  icon,
  iconColor = "purple",
  badges,
  onClick
}: ContentCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className={cn(
        "flex items-center justify-between px-5 py-4 rounded-xl border border-white/10 dark:border-gray-800/10",
        "bg-white/5 dark:bg-gray-900/5 backdrop-blur-xl",
        "hover:bg-white/10 dark:hover:bg-gray-800/10",
        "shadow-none hover:shadow-md dark:shadow-gray-950/5",
        "transition-all duration-500 cursor-pointer group"
      )}
    >
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center",
            "ring-1 transition-all duration-500",
            `bg-gradient-to-br from-${iconColor}-50/40 to-${iconColor}-100/30`,
            `dark:from-${iconColor}-900/40 dark:to-${iconColor}-800/30`,
            `ring-${iconColor}-200/50 dark:ring-${iconColor}-700/50`,
            `group-hover:ring-${iconColor}-300 dark:group-hover:ring-${iconColor}-600`
          )}>
            {icon}
          </div>
          <h3 className="font-semibold text-base text-gray-800 dark:text-white/95">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-300 pl-14">
          {description}
        </p>

        {/* Badges */}
        {badges && badges.length > 0 && (
          <div className={cn(
            "flex gap-2 pl-14",
            variant === "content-type" ? "flex-wrap" : "overflow-x-auto scrollbar-hide"
          )}>
            {badges.map((badge, index) => (
              <span
                key={index}
                className={cn(
                  "shrink-0 px-2.5 py-1.5 text-xs font-medium rounded-lg",
                  "flex items-center gap-2 shadow-sm transition-colors",
                  badge.color ? 
                    `bg-${badge.color}-500/10 text-${badge.color}-600 dark:text-${badge.color}-300 hover:bg-${badge.color}-500/20` :
                    "bg-gray-500/10 text-gray-600 dark:text-gray-300"
                )}
              >
                {badge.icon}
                {badge.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
