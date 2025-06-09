import React from 'react';
import { Image } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface IconDisplayProps {
  iconData?: {
    type: 'emoji' | 'lucide' | 'custom';
    value: string;
    name?: string;
    color?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
}

export function IconDisplay({ iconData, size = 'md', className = '', showLabel = false }: IconDisplayProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const labelTextSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  // Helper function to get display label
  const getDisplayLabel = () => {
    if (!iconData) return 'No Icon';
    
    if (iconData.type === 'emoji') {
      return iconData.name || 'Emoji';
    }
    
    if (iconData.type === 'lucide') {
      return iconData.name || iconData.value;
    }
    
    if (iconData.type === 'custom') {
      return iconData.name || 'Custom Icon';
    }
    
    return 'Icon';
  };

  // Wrapper for icon + label layout
  const renderWithLabel = (iconElement: React.ReactNode) => {
    if (!showLabel) return iconElement;
    
    const label = getDisplayLabel();
    
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {iconElement}
        <span className={`${labelTextSizes[size]} text-gray-700 dark:text-gray-300 font-medium`}>
          {label}
        </span>
      </div>
    );
  };

  if (!iconData) {
    const defaultIcon = (
      <div className={`${sizeClasses[size]} flex items-center justify-center text-gray-400`}>
        <Image className={sizeClasses[size]} />
      </div>
    );
    return renderWithLabel(defaultIcon);
  }

  // Render emoji
  if (iconData.type === 'emoji') {
    const emojiElement = (
      <span className={`${textSizes[size]} flex items-center justify-center`}>
        {iconData.value}
      </span>
    );
    return renderWithLabel(emojiElement);
  }

  // Render Lucide icon with color support
  if (iconData.type === 'lucide') {
    const IconComponent = (LucideIcons as any)[iconData.value];
    if (IconComponent) {
      const lucideElement = (
        <IconComponent 
          className={sizeClasses[size]} 
          style={{ color: iconData.color || '#6B7280' }}
        />
      );
      return renderWithLabel(lucideElement);
    }
    // Fallback if icon not found
    const fallbackElement = (
      <div className={`${sizeClasses[size]} flex items-center justify-center text-gray-400`}>
        <Image className={sizeClasses[size]} />
      </div>
    );
    return renderWithLabel(fallbackElement);
  }

  // Render custom image
  if (iconData.type === 'custom') {
    const customElement = (
      <img 
        src={iconData.value} 
        alt={iconData.name || 'Custom icon'} 
        className={`${sizeClasses[size]} object-cover rounded`}
      />
    );
    return renderWithLabel(customElement);
  }

  return null;
} 