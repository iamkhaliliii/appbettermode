import React from 'react';
import { ArrowRight } from 'lucide-react';

export interface CategoryCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count: number;
  colorScheme: {
    hover: string;
    bg: string;
    icon: string;
    text: string;
  };
  onClick?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ 
  icon: Icon, 
  title, 
  count, 
  colorScheme, 
  onClick 
}) => {
  return (
    <div 
      className={`group relative cursor-pointer border border-gray-200/50 dark:border-gray-700/50 rounded-lg p-6 transition-all duration-200 ${colorScheme.hover}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${colorScheme.bg}`}>
          <Icon className={`w-4 h-4 ${colorScheme.icon}`} />
        </div>
        <div className="flex-1">
          <h4 className={`font-semibold text-sm text-gray-900 dark:text-gray-100 transition-colors ${colorScheme.text}`}>
            {title}
            <ArrowRight className="inline w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-300" />
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">{count} events</p>
        </div>
      </div>
    </div>
  );
}; 