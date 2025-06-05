import { useState } from "react";
import {
  Menu,
  Database,
  Grid3x3,
  Link,
  Layers,
  AlignLeft,
  Image,
  BarChart3,
  MessageSquare,
  Users,
  Calendar,
  MapPin,
  FileText,
  Video,
  Music,
  Search
} from "lucide-react";

interface Widget {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
}

export function WidgetSettingsTab() {
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);

  const widgets: Widget[] = [
    { id: 'accordions', name: 'Accordions', icon: Menu, color: 'purple', description: 'Collapsible content sections' },
    { id: 'blog', name: 'Blog', icon: Database, color: 'red', description: 'Blog posts and articles' },
    { id: 'spaces', name: 'Spaces', icon: Grid3x3, color: 'gray', description: 'Community spaces' },
    { id: 'add-block', name: 'Add block', icon: Link, color: 'yellow', description: 'Custom content block' },
    { id: 'section', name: 'Section', icon: Layers, color: 'blue', description: 'Content sections' },
    { id: 'rich-text', name: 'Rich text', icon: AlignLeft, color: 'green', description: 'Formatted text content' },
    { id: 'space-header', name: 'Space header', icon: Image, color: 'green', description: 'Space header with banner' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, color: 'pink', description: 'Analytics dashboard' },
    { id: 'comments', name: 'Comments', icon: MessageSquare, color: 'blue', description: 'Comment system' },
    { id: 'members', name: 'Members', icon: Users, color: 'purple', description: 'Member directory' },
    { id: 'events', name: 'Events', icon: Calendar, color: 'red', description: 'Event calendar' },
    { id: 'location', name: 'Location', icon: MapPin, color: 'orange', description: 'Location widget' },
    { id: 'documents', name: 'Documents', icon: FileText, color: 'gray', description: 'Document library' },
    { id: 'video', name: 'Video', icon: Video, color: 'red', description: 'Video player' },
    { id: 'audio', name: 'Audio', icon: Music, color: 'purple', description: 'Audio player' },
    { id: 'search', name: 'Search', icon: Search, color: 'blue', description: 'Search functionality' }
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colors = {
      purple: isSelected 
        ? 'border-purple-300 bg-purple-50 dark:bg-purple-900/20' 
        : 'border-purple-200/50 hover:border-purple-300',
      red: isSelected 
        ? 'border-red-300 bg-red-50 dark:bg-red-900/20' 
        : 'border-red-200/50 hover:border-red-300',
      gray: isSelected 
        ? 'border-gray-300 bg-gray-50 dark:bg-gray-900/20' 
        : 'border-gray-200/50 hover:border-gray-300',
      yellow: isSelected 
        ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20' 
        : 'border-yellow-200/50 hover:border-yellow-300',
      blue: isSelected 
        ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' 
        : 'border-blue-200/50 hover:border-blue-300',
      green: isSelected 
        ? 'border-green-300 bg-green-50 dark:bg-green-900/20' 
        : 'border-green-200/50 hover:border-green-300',
      pink: isSelected 
        ? 'border-pink-300 bg-pink-50 dark:bg-pink-900/20' 
        : 'border-pink-200/50 hover:border-pink-300',
      orange: isSelected 
        ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/20' 
        : 'border-orange-200/50 hover:border-orange-300'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const getIconColor = (color: string, isSelected: boolean) => {
    const colors = {
      purple: isSelected ? 'text-purple-600 dark:text-purple-400' : 'text-purple-400 dark:text-purple-500',
      red: isSelected ? 'text-red-600 dark:text-red-400' : 'text-red-400 dark:text-red-500',
      gray: isSelected ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500',
      yellow: isSelected ? 'text-yellow-600 dark:text-yellow-400' : 'text-yellow-400 dark:text-yellow-500',
      blue: isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-blue-400 dark:text-blue-500',
      green: isSelected ? 'text-green-600 dark:text-green-400' : 'text-green-400 dark:text-green-500',
      pink: isSelected ? 'text-pink-600 dark:text-pink-400' : 'text-pink-400 dark:text-pink-500',
      orange: isSelected ? 'text-orange-600 dark:text-orange-400' : 'text-orange-400 dark:text-orange-500'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const getTextColor = (color: string, isSelected: boolean) => {
    const colors = {
      purple: isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-gray-600 dark:text-gray-400',
      red: isSelected ? 'text-red-700 dark:text-red-300' : 'text-gray-600 dark:text-gray-400',
      gray: isSelected ? 'text-gray-700 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400',
      yellow: isSelected ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-600 dark:text-gray-400',
      blue: isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400',
      green: isSelected ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400',
      pink: isSelected ? 'text-pink-700 dark:text-pink-300' : 'text-gray-600 dark:text-gray-400',
      orange: isSelected ? 'text-orange-700 dark:text-orange-300' : 'text-gray-600 dark:text-gray-400'
    };
    return colors[color as keyof typeof colors] || colors.gray;
  };

  const toggleWidget = (widgetId: string) => {
    setSelectedWidgets(prev => 
      prev.includes(widgetId) 
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  return (
    <div className="space-y-4">
      <div className="px-2">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Select widgets to display in your space. Click to enable/disable each widget.
        </p>
        
        <div className="grid grid-cols-3 gap-3">
          {widgets.map((widget) => {
            const isSelected = selectedWidgets.includes(widget.id);
            const IconComponent = widget.icon;
            
            return (
              <button
                key={widget.id}
                onClick={() => toggleWidget(widget.id)}
                className={`group relative flex flex-col items-center justify-center aspect-square p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${
                  getColorClasses(widget.color, isSelected)
                }`}
                style={{
                  borderRadius: '8px',
                  border: `0.3px solid ${isSelected ? 'rgba(59, 130, 246, 0.5)' : 'rgba(217, 156, 156, 0.50)'}`,
                  background: isSelected
                    ? `linear-gradient(to bottom right, rgba(59, 130, 246, 0.15) 0%, rgba(255, 255, 255, 0.08) 25%, rgba(59, 130, 246, 0.00) 50%) bottom right / 50% 50% no-repeat, 
                       linear-gradient(to bottom left, rgba(59, 130, 246, 0.15) 0%, rgba(255, 255, 255, 0.08) 25%, rgba(59, 130, 246, 0.00) 50%) bottom left / 50% 50% no-repeat, 
                       linear-gradient(to top left, rgba(59, 130, 246, 0.15) 0%, rgba(255, 255, 255, 0.08) 25%, rgba(59, 130, 246, 0.00) 50%) top left / 50% 50% no-repeat, 
                       linear-gradient(to top right, rgba(59, 130, 246, 0.15) 0%, rgba(255, 255, 255, 0.08) 25%, rgba(59, 130, 246, 0.00) 50%) top right / 50% 50% no-repeat`
                    : `linear-gradient(to bottom right, rgba(217, 156, 156, 0.15) 0%, rgba(255, 255, 255, 0.08) 25%, rgba(217, 156, 156, 0.00) 50%) bottom right / 50% 50% no-repeat, 
                       linear-gradient(to bottom left, rgba(217, 156, 156, 0.15) 0%, rgba(255, 255, 255, 0.08) 25%, rgba(217, 156, 156, 0.00) 50%) bottom left / 50% 50% no-repeat, 
                       linear-gradient(to top left, rgba(217, 156, 156, 0.15) 0%, rgba(255, 255, 255, 0.08) 25%, rgba(217, 156, 156, 0.00) 50%) top left / 50% 50% no-repeat, 
                       linear-gradient(to top right, rgba(217, 156, 156, 0.15) 0%, rgba(255, 255, 255, 0.08) 25%, rgba(217, 156, 156, 0.00) 50%) top right / 50% 50% no-repeat`,
                  boxShadow: isSelected 
                    ? '30px 30px 30px 30px rgba(59, 130, 246, 0.05) inset'
                    : '30px 30px 30px 30px rgba(217, 156, 156, 0.05) inset'
                }}
                title={widget.description}
              >
                <IconComponent className={`w-5 h-5 mb-2 transition-colors ${
                  getIconColor(widget.color, isSelected)
                }`} />
                <span className={`text-xs font-medium text-center leading-tight transition-colors truncate w-full ${
                  getTextColor(widget.color, isSelected)
                }`}>
                  {widget.name}
                </span>
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>

        {selectedWidgets.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">
              Selected Widgets ({selectedWidgets.length})
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {widgets
                .filter(widget => selectedWidgets.includes(widget.id))
                .map(widget => widget.name)
                .join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 