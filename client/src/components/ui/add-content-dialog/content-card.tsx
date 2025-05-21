import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ContentCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  preview: React.ReactNode;
  onClick: () => void;
}

export const ContentCard = React.memo(({
  title,
  description,
  icon,
  color,
  preview,
  onClick,
}: ContentCardProps) => {
  // Special styling for different card types
  const getBgGradient = () => {
    switch (color) {
      case "emerald":
        return "bg-gradient-to-br from-emerald-50/60 to-emerald-100/10 dark:from-emerald-900/15 dark:to-emerald-800/5 hover:from-emerald-50/95 hover:to-emerald-100/50 dark:hover:from-emerald-900/40 dark:hover:to-emerald-800/25";
      case "blue":
        return "bg-gradient-to-br from-blue-50/60 to-blue-100/10 dark:from-blue-900/15 dark:to-blue-800/5 hover:from-blue-50/95 hover:to-blue-100/50 dark:hover:from-blue-900/40 dark:hover:to-blue-800/25";
      case "violet":
        return "bg-gradient-to-br from-violet-50/60 to-violet-100/10 dark:from-violet-900/15 dark:to-violet-800/5 hover:from-violet-50/95 hover:to-violet-100/50 dark:hover:from-violet-900/40 dark:hover:to-violet-800/25";
      case "amber":
        return "bg-gradient-to-br from-amber-50/60 to-amber-100/10 dark:from-amber-900/15 dark:to-amber-800/5 hover:from-amber-50/95 hover:to-amber-100/50 dark:hover:from-amber-900/40 dark:hover:to-amber-800/25";
      case "indigo":
        return "bg-gradient-to-br from-indigo-50/60 to-indigo-100/10 dark:from-indigo-900/15 dark:to-indigo-800/5 hover:from-indigo-50/95 hover:to-indigo-100/50 dark:hover:from-indigo-900/40 dark:hover:to-indigo-800/25";
      case "rose":
        return "bg-gradient-to-br from-rose-50/60 to-rose-100/10 dark:from-rose-900/15 dark:to-rose-800/5 hover:from-rose-50/95 hover:to-rose-100/50 dark:hover:from-rose-900/40 dark:hover:to-rose-800/25";
      case "cyan":
        return "bg-gradient-to-br from-cyan-50/60 to-cyan-100/10 dark:from-cyan-900/15 dark:to-cyan-800/5 hover:from-cyan-50/95 hover:to-cyan-100/50 dark:hover:from-cyan-900/40 dark:hover:to-cyan-800/25";
      case "purple":
        return "bg-gradient-to-br from-purple-50/60 to-purple-100/10 dark:from-purple-900/15 dark:to-purple-800/5 hover:from-purple-50/95 hover:to-purple-100/50 dark:hover:from-purple-900/40 dark:hover:to-purple-800/25";
      case "gray":
        return "bg-gradient-to-br from-gray-50/60 to-gray-100/10 dark:from-gray-800/15 dark:to-gray-900/5 hover:from-gray-50/95 hover:to-gray-100/50 dark:hover:from-gray-800/40 dark:hover:to-gray-900/25";
      default:
        return `bg-gradient-to-br from-${color}-50/70 to-${color}-100/20 dark:from-${color}-900/20 dark:to-${color}-800/5 hover:from-${color}-50/95 hover:to-${color}-100/60 dark:hover:from-${color}-900/45 dark:hover:to-${color}-800/30`;
    }
  };

  const getBorder = () => {
    switch (color) {
      case "emerald":
        return "border border-emerald-200/30 dark:border-emerald-800/20";
      case "blue":
        return "border border-blue-200/30 dark:border-blue-800/20";
      case "violet":
        return "border border-violet-200/30 dark:border-violet-800/20";
      case "amber":
        return "border border-amber-200/30 dark:border-amber-800/20";
      case "indigo":
        return "border border-indigo-200/30 dark:border-indigo-800/20";
      case "rose":
        return "border border-rose-200/30 dark:border-rose-800/20";
      case "cyan":
        return "border border-cyan-200/30 dark:border-cyan-800/20";
      case "purple":
        return "border border-purple-200/30 dark:border-purple-800/20";
      case "gray":
        return "border border-gray-200/30 dark:border-gray-700/20";
      default:
        return `border border-${color}-200/40 dark:border-${color}-800/30`;
    }
  };

  const getIconBg = () => {
    switch (color) {
      case "emerald":
        return "bg-emerald-100/60 dark:bg-emerald-800/30";
      case "blue":
        return "bg-blue-100/60 dark:bg-blue-800/30";
      case "violet":
        return "bg-violet-100/60 dark:bg-violet-800/30";
      case "amber":
        return "bg-amber-100/60 dark:bg-amber-800/30";
      case "indigo":
        return "bg-indigo-100/60 dark:bg-indigo-800/30";
      case "rose":
        return "bg-rose-100/60 dark:bg-rose-800/30";
      case "cyan":
        return "bg-cyan-100/60 dark:bg-cyan-800/30";
      case "purple":
        return "bg-purple-100/60 dark:bg-purple-800/30";
      case "gray":
        return "bg-gray-100/60 dark:bg-gray-700/30";
      default:
        return `bg-${color}-200/80 dark:bg-${color}-800/40`;
    }
  };

  const getChevronBg = () => {
    switch (color) {
      case "emerald":
        return "bg-emerald-100/60 dark:bg-emerald-800/30";
      case "blue":
        return "bg-blue-100/60 dark:bg-blue-800/30";
      case "violet":
        return "bg-violet-100/60 dark:bg-violet-800/30";
      case "amber":
        return "bg-amber-100/60 dark:bg-amber-800/30";
      case "indigo":
        return "bg-indigo-100/60 dark:bg-indigo-800/30";
      case "rose":
        return "bg-rose-100/60 dark:bg-rose-800/30";
      case "cyan":
        return "bg-cyan-100/60 dark:bg-cyan-800/30";
      case "purple":
        return "bg-purple-100/60 dark:bg-purple-800/30";
      case "gray":
        return "bg-gray-100/60 dark:bg-gray-700/30";
      default:
        return `bg-${color}-200/80 dark:bg-${color}-800/40`;
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`${getBgGradient()}
                backdrop-blur-sm rounded-xl overflow-hidden
                ${getBorder()}
                 cursor-pointer group h-full flex flex-col transition-all duration-200`}
    >
      <div className="flex-1 flex flex-col min-h-[248px]">
        <div className="flex px-5 pt-5 items-center">
          <h3 className="text-[0.9rem] font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
        <p className="text-[0.75rem] px-5 pb-0 text-gray-600 dark:text-gray-400">{description}</p>
        
        {/* Framed preview area */}
        <div className="absolute bottom-0 right-0 w-52 h-40 rounded-t-lg border border-gray-100/70 dark:border-gray-800/30 bg-white/80 dark:bg-gray-900/80 p-3 overflow-hidden flex-1 flex shadow-[0_4px_20px_-4px_rgba(0,0,0,0.10)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.18)]">
          <div className="w-full">
            {preview}
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className={`p-1.5 rounded-full ${getChevronBg()}`}>
          <ChevronRight className={`h-4 w-4 text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
    </div>
  );
});

ContentCard.displayName = "ContentCard"; 