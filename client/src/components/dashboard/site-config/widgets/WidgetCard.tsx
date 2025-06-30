import React from 'react';
import { Plus, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/primitives/tooltip";
import { WidgetCardProps, AvailableWidget, Widget } from './types';
import { FeaturedEventWidget } from '@/components/features/events/FeaturedEventWidget';

// Type guards
const isAvailableWidget = (widget: AvailableWidget | Widget): widget is AvailableWidget => {
  return 'category' in widget;
};

const isLocked = (widget: AvailableWidget | Widget): boolean => {
  return isAvailableWidget(widget) ? widget.locked : false;
};

const getCategory = (widget: AvailableWidget | Widget): string => {
  return isAvailableWidget(widget) ? widget.category : 'Basic Widgets';
};

interface WidgetPreviewTooltipProps {
  widget: AvailableWidget | Widget;
  children: React.ReactNode;
}

// Unified category styles function
const getUnifiedCategoryStyles = (widget: AvailableWidget | Widget) => {
  const category = getCategory(widget);
  
  // Determine original category for Trending widgets
  const getOriginalCategory = (widgetId: string, category: string) => {
    if (category !== 'Trending') return category;
    
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

  const actualCategory = getOriginalCategory(widget.id, category);
  
  switch (actualCategory) {
    case 'Basic Widgets':
      return {
        iconColor: '#A095C4',
        border: '0.3px solid rgba(160, 149, 196, 0.50)',
        background: 'linear-gradient(56deg, rgba(160, 149, 196, 0.15) -176.81%, rgba(255, 255, 255, 0.08) -39.08%, rgba(160, 149, 196, 0.00) 98.65%)',
        boxShadow: '30px 30px 30px 30px rgba(160, 149, 196, 0.05) inset',
        borderRadius: '8px',
        bgGradient: 'linear-gradient(135deg, rgba(160, 149, 196, 0.15) 0%, rgba(160, 149, 196, 0.25) 100%)'
      };
    case 'Advance Widgets':
      return {
        iconColor: '#E3A689',
        border: '0.3px solid rgba(227, 166, 137, 0.50)',
        background: 'linear-gradient(56deg, rgba(227, 166, 137, 0.15) -176.81%, rgba(255, 255, 255, 0.08) -39.08%, rgba(227, 166, 137, 0.00) 98.65%)',
        boxShadow: '30px 30px 30px 30px rgba(227, 166, 137, 0.05) inset',
        borderRadius: '8px',
        bgGradient: 'linear-gradient(135deg, rgba(227, 166, 137, 0.15) 0%, rgba(227, 166, 137, 0.25) 100%)'
      };
    case 'Enterprise Widgets':
      return {
        iconColor: '#9ECBA4',
        border: '0.3px solid rgba(158, 203, 164, 0.50)',
        background: 'linear-gradient(56deg, rgba(158, 203, 164, 0.15) -176.81%, rgba(255, 255, 255, 0.08) -39.08%, rgba(158, 203, 164, 0.00) 98.65%)',
        boxShadow: '30px 30px 30px 30px rgba(158, 203, 164, 0.05) inset',
        borderRadius: '8px',
        bgGradient: 'linear-gradient(135deg, rgba(158, 203, 164, 0.15) 0%, rgba(158, 203, 164, 0.25) 100%)'
      };
    case 'Content Widgets':
      return {
        iconColor: '#D99C9C',
        border: '0.3px solid rgba(217, 156, 156, 0.50)',
        background: 'linear-gradient(56deg, rgba(217, 156, 156, 0.15) -176.81%, rgba(255, 255, 255, 0.08) -39.08%, rgba(217, 156, 156, 0.00) 98.65%)',
        boxShadow: '30px 30px 30px 30px rgba(217, 156, 156, 0.05) inset',
        borderRadius: '8px',
        bgGradient: 'linear-gradient(135deg, rgba(217, 156, 156, 0.15) 0%, rgba(217, 156, 156, 0.25) 100%)'
      };
    default:
      return {
        iconColor: '#6B7280',
        border: '0.3px solid rgba(107, 114, 128, 0.50)',
        background: 'linear-gradient(56deg, rgba(107, 114, 128, 0.15) -176.81%, rgba(255, 255, 255, 0.08) -39.08%, rgba(107, 114, 128, 0.00) 98.65%)',
        boxShadow: '30px 30px 30px 30px rgba(107, 114, 128, 0.05) inset',
        borderRadius: '8px',
        bgGradient: 'linear-gradient(135deg, rgba(107, 114, 128, 0.15) 0%, rgba(107, 114, 128, 0.25) 100%)'
      };
  }
};

const WidgetPreviewTooltip: React.FC<WidgetPreviewTooltipProps> = ({ widget, children }) => {
  const categoryStyles = getUnifiedCategoryStyles(widget);
  const widgetLocked = isLocked(widget);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
                <TooltipContent 
          side="top"
          align="center"
          sideOffset={8}
          alignOffset={0}
          avoidCollisions={true}
          collisionPadding={8}
          
          className="w-60 p-0 border-0 shadow-lg rounded-lg overflow-hidden"
          style={{ 
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(12px)',
            zIndex: 9999,
            position: 'fixed'
          }}
        >
          {/* Enterprise Header for locked widgets */}
          {widgetLocked && (
            <div 
              className="w-full px-3 py-2"
              style={{
                background: `linear-gradient(135deg, ${categoryStyles.iconColor}90, ${categoryStyles.iconColor}B0)`
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-white" />
                  <span className="text-xs font-medium text-white">Enterprise Only</span>
                </div>
                <button className="text-[10px] font-medium text-white/90 hover:text-white bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-md transition-colors">
                  Upgrade Plan
                </button>
              </div>
            </div>
          )}
          
          <div className="flex flex-col items-start gap-3 text-left p-3">
            {/* Widget Banner Preview */}
            <div 
              className="w-full h-20 rounded-md relative overflow-hidden"
              style={{ 
                background: categoryStyles.background,
                border: `1px solid ${categoryStyles.iconColor}30`,
                boxShadow: categoryStyles.boxShadow
              }}
            >
              {/* Real FeaturedEventWidget Preview */}
              {(widget.id.includes('upcoming-events') || 
                widget.name.toLowerCase().includes('upcoming events') ||
                widget.id.includes('featured-events') || 
                widget.name.toLowerCase().includes('featured events')) && (
                <div className="absolute inset-0 overflow-hidden rounded-md">
                  <div 
                    className="pointer-events-none"
                    style={{ 
                      transform: 'scale(0.2)',
                      transformOrigin: 'top left',
                      width: '500%', // 100 / 0.2 = 500%
                      height: '500%'
                    }}
                  >
                    <FeaturedEventWidget isDashboard={true} />
                  </div>
                </div>
              )}
              
              {/* Event Categories Preview */}
              {(widget.id.includes('categories') || widget.name.toLowerCase().includes('categor')) && (
                <div className="absolute inset-0 p-1 overflow-hidden">
                  <div className="w-full h-full bg-gray-50 dark:bg-gray-800 rounded-sm relative overflow-hidden">
                    {/* Mini category chips */}
                    <div className="absolute inset-1 flex flex-wrap gap-0.5">
                      <div className="px-1 py-0.5 bg-blue-500/80 rounded-sm">
                        <div className="w-2 h-0.5 bg-white/80 rounded"></div>
                      </div>
                      <div className="px-1 py-0.5 bg-green-500/80 rounded-sm">
                        <div className="w-2 h-0.5 bg-white/80 rounded"></div>
                      </div>
                      <div className="px-1 py-0.5 bg-purple-500/80 rounded-sm">
                        <div className="w-2 h-0.5 bg-white/80 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Default preview for other widgets */}
              {!(widget.id.includes('upcoming-events') || 
                 widget.name.toLowerCase().includes('upcoming events') ||
                 widget.id.includes('featured-events') || 
                 widget.name.toLowerCase().includes('featured events') ||
                 widget.id.includes('categories') || 
                 widget.name.toLowerCase().includes('categor')) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-md flex items-center justify-center" 
                       style={{ backgroundColor: `${categoryStyles.iconColor}20` }}>
                    <div className="w-4 h-4 rounded-sm" 
                         style={{ backgroundColor: categoryStyles.iconColor }}></div>
                  </div>
                </div>
              )}
              
              {/* Lock indicator on banner */}
              {widgetLocked && (
                <div className="absolute top-1 right-1 w-3 h-3 bg-black/50 rounded-full flex items-center justify-center z-10">
                  <Lock className="w-2 h-2 text-white" />
                </div>
              )}
            </div>
            
            {/* Description */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <widget.icon 
                  className="w-4 h-4" 
                  style={{ color: categoryStyles.iconColor }} 
                />
                <h3 className="font-medium text-[0.8rem] text-white text-left">
                  {widget.name}
                </h3>
              </div>
              <p className="text-[0.7rem] text-gray-300 text-left leading-tight">
                {widget.description}
              </p>
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
  onAddWidget,
  actions
}: WidgetCardProps) {
  const widgetLocked = isLocked(widget);

  const handleClick = () => {
    if (!widgetLocked) {
      if (onClick) onClick(widget);
      else if (onAdd) onAdd(widget);
      else if (onAddWidget) onAddWidget(widget);
    }
  };

  // Drag handlers for Add Widget mode
  const handleDragStart = (e: React.DragEvent) => {
    if (!showAddButton || widgetLocked) {
      e.preventDefault();
      return;
    }
    
    e.dataTransfer.setData('application/json', JSON.stringify(widget));
    e.dataTransfer.effectAllowed = 'copy';
    
    // Set drag image to be the card itself
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = 'rotate(3deg)';
    dragImage.style.opacity = '0.8';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 50, 50);
    
    // Clean up drag image after drag starts
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Reset any drag-related styling
    e.currentTarget.classList.remove('dragging');
  };

  const categoryStyles = getUnifiedCategoryStyles(widget);

  return (
    <WidgetPreviewTooltip widget={widget}>
      <div
        className={`
          relative aspect-square transition-all duration-300 cursor-pointer group
          ${isSelected 
            ? 'ring-4 ring-blue-500/20' 
            : 'hover:scale-105'
          }
          ${widgetLocked ? 'opacity-60' : 'hover:shadow-lg'}
          ${showAddButton && !widgetLocked ? 'cursor-grab active:cursor-grabbing' : ''}
        `}
        style={{ 
          borderRadius: widgetLocked ? '8px' : categoryStyles.borderRadius,
          border: widgetLocked 
            ? '0.3px solid rgba(107, 114, 128, 0.50)'
            : (isSelected ? '2px solid #3b82f6' : categoryStyles.border),
          background: widgetLocked 
            ? 'linear-gradient(56deg, rgba(107, 114, 128, 0.15) -176.81%, rgba(255, 255, 255, 0.08) -39.08%, rgba(107, 114, 128, 0.00) 98.65%)'
            : categoryStyles.background,
          boxShadow: widgetLocked 
            ? '30px 30px 30px 30px rgba(107, 114, 128, 0.05) inset'
            : categoryStyles.boxShadow
        }}
        onClick={handleClick}
        draggable={showAddButton && !widgetLocked}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Drag indicator overlay */}
        {showAddButton && !widgetLocked && (
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
            <div className="bg-blue-500/90 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-300">
              Drag to add
            </div>
          </div>
        )}

        {/* Card Content Layout */}
        <div className="relative w-full h-full flex flex-col items-start justify-center p-3">
          
          {/* Widget Icon - Left Aligned */}
          <div className="relative z-10 mb-3">
            <widget.icon className="w-5 h-5" style={{ color: categoryStyles.iconColor }} />
          </div>
          
          {/* Widget Name Inside Card - Left Aligned, Single Line */}
          <h3 className={`text-[10px] font-medium text-left leading-none truncate w-full ${
            widgetLocked 
              ? 'text-gray-400 dark:text-gray-500' 
              : 'text-gray-700 dark:text-gray-300'
          }`} style={{ color: widgetLocked ? undefined : categoryStyles.iconColor }}>
            {widget.name}
          </h3>
          
          {/* Lock overlay for locked widgets */}
          {widgetLocked && (
            <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-gray-800/90 dark:bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm z-20">
              <Lock className="w-2.5 h-2.5 text-white dark:text-gray-800" />
            </div>
          )}
          
          {/* Add button for unlocked widgets */}
          {!widgetLocked && (
            <div className="absolute top-1 right-1 w-4 h-4 bg-gray-800/80 dark:bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-sm">
              <Plus className="w-2.5 h-2.5 text-white dark:text-gray-800" />
            </div>
          )}
        </div>
      </div>
    </WidgetPreviewTooltip>
  );
}