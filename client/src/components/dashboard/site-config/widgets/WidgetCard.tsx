import React from 'react';
import { Plus, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/primitives/tooltip";
import { WidgetCardProps } from './types';

interface WidgetPreviewTooltipProps {
  widget: WidgetCardProps['widget'];
  children: React.ReactNode;
}

const WidgetPreviewTooltip: React.FC<WidgetPreviewTooltipProps> = ({ widget, children }) => {
  const getCategoryStyles = (widget: WidgetCardProps['widget']) => {
    if ('category' in widget) {
      // This is an AvailableWidget
      const category = widget.category;
      switch (category) {
        case 'Basic Widgets':
          return { 
            iconColor: '#A095C4',
            bgGradient: 'linear-gradient(135deg, rgba(160, 149, 196, 0.15) 0%, rgba(160, 149, 196, 0.25) 100%)'
          };
        case 'Advance Widgets':
          return { 
            iconColor: '#E3A689',
            bgGradient: 'linear-gradient(135deg, rgba(227, 166, 137, 0.15) 0%, rgba(227, 166, 137, 0.25) 100%)'
          };
        case 'Enterprise Widgets':
          return { 
            iconColor: '#9ECBA4',
            bgGradient: 'linear-gradient(135deg, rgba(158, 203, 164, 0.15) 0%, rgba(158, 203, 164, 0.25) 100%)'
          };
        case 'Content Widgets':
          return { 
            iconColor: '#D99C9C',
            bgGradient: 'linear-gradient(135deg, rgba(217, 156, 156, 0.15) 0%, rgba(217, 156, 156, 0.25) 100%)'
          };
        case 'Trending':
          // For trending widgets, use the color based on the original widget type
          if (widget.id.includes('advance-content-block') || widget.id.includes('advance-top-navigation')) {
            return { 
              iconColor: '#9ECBA4',
              bgGradient: 'linear-gradient(135deg, rgba(158, 203, 164, 0.15) 0%, rgba(158, 203, 164, 0.25) 100%)'
            };
          } else if (widget.id.includes('upcoming-events')) {
            return { 
              iconColor: '#D99C9C',
              bgGradient: 'linear-gradient(135deg, rgba(217, 156, 156, 0.15) 0%, rgba(217, 156, 156, 0.25) 100%)'
            };
          } else if (widget.id.includes('hero-banner')) {
            return { 
              iconColor: '#E3A689',
              bgGradient: 'linear-gradient(135deg, rgba(227, 166, 137, 0.15) 0%, rgba(227, 166, 137, 0.25) 100%)'
            };
          }
          break;
        default:
          return { 
            iconColor: '#6B7280',
            bgGradient: 'linear-gradient(135deg, rgba(107, 114, 128, 0.15) 0%, rgba(107, 114, 128, 0.25) 100%)'
          };
      }
    }
    
    // This is a regular Widget (from sections)
    return { 
      iconColor: '#6B7280',
      bgGradient: 'linear-gradient(135deg, rgba(107, 114, 128, 0.15) 0%, rgba(107, 114, 128, 0.25) 100%)'
    };
  };

  const categoryStyles = getCategoryStyles(widget);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs p-4 border-0 shadow-xl"
          style={{ 
            background: categoryStyles.bgGradient,
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="flex items-start gap-3">
            {/* Widget Icon - Large */}
            <div className="flex-shrink-0">
              <widget.icon 
                className="w-8 h-8" 
                style={{ color: categoryStyles.iconColor }} 
              />
            </div>
            
            {/* Widget Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                {widget.name}
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {widget.description}
              </p>
              
              {/* Category badge for available widgets */}
              {'category' in widget && (
                <div className="mt-2">
                  <span 
                    className="text-[10px] px-2 py-1 rounded-full font-medium"
                    style={{ 
                      color: categoryStyles.iconColor,
                      backgroundColor: `${categoryStyles.iconColor}20`
                    }}
                  >
                    {widget.category}
                  </span>
                </div>
              )}
              
              {/* Lock indicator */}
              {widget.locked && (
                <div className="flex items-center gap-1 mt-2">
                  <Lock className="w-3 h-3 text-gray-400" />
                  <span className="text-[10px] text-gray-500">Enterprise only</span>
                </div>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default function WidgetCard({
  widget,
  onClick,
  isSelected = false,
  showAddButton = false,
  onAdd,
  actions
}: WidgetCardProps) {
  const handleClick = () => {
    const isLocked = 'locked' in widget ? widget.locked : false;
    if (!isLocked) {
      if (onClick) onClick(widget);
      else if (onAdd) onAdd(widget);
    }
  };

  // Determine original category for Trending widgets
  const getOriginalCategory = (widgetId: string, category: string) => {
    if (category !== 'Trending') return category;
    
    // For Trending widgets, determine their original category based on widget ID
    switch (widgetId) {
      case 'advance-content-block-trending':
      case 'advance-top-navigation-trending':
        return 'Enterprise Widgets';
      case 'upcoming-events-trending':
        return 'Content Widgets';
      case 'hero-banner-trending':
        return 'Advance Widgets';
      default:
        return 'Basic Widgets';
    }
  };

  // Category-based styles with different colors
  const getCategoryStyles = (category: string) => {
    const actualCategory = getOriginalCategory(widget.id, category);
    
    switch (actualCategory) {
      case 'Basic Widgets':
        return {
          border: '0.3px solid rgba(160, 149, 196, 0.50)',
          background: 'linear-gradient(56deg, rgba(160, 149, 196, 0.15) -176.81%, rgba(255, 255, 255, 0.08) -39.08%, rgba(160, 149, 196, 0.00) 98.65%)',
          boxShadow: '30px 30px 30px 30px rgba(160, 149, 196, 0.05) inset',
          iconColor: '#A095C4'
        };
      case 'Advance Widgets':
        return {
          border: '0.3px solid rgba(227, 166, 137, 0.50)',
          background: 'linear-gradient(56deg, rgba(227, 166, 137, 0.15) -176.81%, rgba(255, 255, 255, 0.08) -39.08%, rgba(227, 166, 137, 0.00) 98.65%)',
          boxShadow: '30px 30px 30px 30px rgba(227, 166, 137, 0.05) inset',
          iconColor: '#E3A689'
        };
      case 'Enterprise Widgets':
        return {
          border: '0.3px solid rgba(158, 203, 164, 0.50)',
          background: 'linear-gradient(56deg, rgba(158, 203, 164, 0.15) -176.81%, rgba(255, 255, 255, 0.08) -39.08%, rgba(158, 203, 164, 0.00) 98.65%)',
          boxShadow: '30px 30px 30px 30px rgba(158, 203, 164, 0.05) inset',
          iconColor: '#9ECBA4'
        };
      case 'Content Widgets':
        return {
          border: '0.3px solid rgba(217, 156, 156, 0.50)',
          background: 'linear-gradient(56deg, rgba(217, 156, 156, 0.15) -176.81%, rgba(255, 255, 255, 0.08) -39.08%, rgba(217, 156, 156, 0.00) 98.65%)',
          boxShadow: '30px 30px 30px 30px rgba(217, 156, 156, 0.05) inset',
          iconColor: '#D99C9C'
        };
      default:
        return {
          border: '0.3px solid rgba(160, 149, 196, 0.50)',
          background: 'linear-gradient(56deg, rgba(160, 149, 196, 0.15) -176.81%, rgba(255, 255, 255, 0.08) -39.08%, rgba(160, 149, 196, 0.00) 98.65%)',
          boxShadow: '30px 30px 30px 30px rgba(160, 149, 196, 0.05) inset',
          iconColor: '#A095C4'
        };
    }
  };

  const categoryStyles = getCategoryStyles(widget.category);

  return (
    <WidgetPreviewTooltip widget={widget}>
      <div
        className={`
          relative aspect-square rounded-xl border-2 transition-all duration-300 cursor-pointer group
          ${isSelected 
            ? 'border-blue-500 ring-4 ring-blue-500/20' 
            : 'border-transparent hover:scale-105'
          }
          ${widget.locked ? 'opacity-60' : 'hover:shadow-lg'}
        `}
        style={{ 
          background: widget.locked 
            ? 'linear-gradient(135deg, rgba(107, 114, 128, 0.15) 0%, rgba(107, 114, 128, 0.25) 100%)'
            : categoryStyles.background,
          backdropFilter: 'blur(10px)'
        }}
        onClick={() => !widget.locked && (onClick ? onClick(widget) : onAdd?.(widget))}
      >
        {/* Card Content Layout */}
        <div className="relative w-full h-full flex flex-col items-start justify-center p-3">
          
          {/* Widget Icon - Left Aligned */}
          <div className="relative z-10 mb-3">
            <widget.icon className="w-5 h-5" style={{ color: categoryStyles.iconColor }} />
          </div>
          
          {/* Widget Name Inside Card - Left Aligned, Single Line */}
          <h3 className={`text-[10px] font-medium text-left leading-none truncate w-full ${
            widget.locked 
              ? 'text-gray-400 dark:text-gray-500' 
              : 'text-gray-700 dark:text-gray-300'
          }`} style={{ color: widget.locked ? undefined : categoryStyles.iconColor }}>
            {widget.name}
          </h3>
          
          {/* Lock overlay for locked widgets */}
          {widget.locked && (
            <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-gray-800/90 dark:bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm z-20">
              <Lock className="w-2.5 h-2.5 text-white dark:text-gray-800" />
            </div>
          )}
          
          {/* Add button for unlocked widgets */}
          {!widget.locked && (
            <div className="absolute top-1 right-1 w-4 h-4 bg-gray-800/80 dark:bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm">
              <Plus className="w-2.5 h-2.5 text-white dark:text-gray-800" />
            </div>
          )}
        </div>
      </div>
    </WidgetPreviewTooltip>
  );
} 