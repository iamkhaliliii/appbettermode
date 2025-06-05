import { useState, useRef, useEffect } from "react";
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
  Search,
  Megaphone,
  Code,
  Monitor,
  Type,
  ImageIcon,
  Star,
  Clock,
  TrendingUp,
  Sparkles,
  Globe,
  ExternalLink
} from "lucide-react";

interface Widget {
  id: string;
  name: string;
  icon: any;
  description: string;
}

interface WidgetCategory {
  id: string;
  name: string;
  color: string;
  widgets: Widget[];
}

interface Props {
  contentType?: 'blog' | 'event' | 'general';
  onWidgetHover?: (widget: Widget | null, position: { x: number; y: number }) => void;
}

export function WidgetSettingsTab({ contentType = 'general', onWidgetHover }: Props) {
  const [activeTab, setActiveTab] = useState('general');
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const [currentHoveredWidget, setCurrentHoveredWidget] = useState<Widget | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const getContentWidgets = (type: string): Widget[] => {
    switch (type) {
      case 'blog':
        return [
          { id: 'featured-blog-posts', name: 'Featured Blog Posts', icon: Star, description: 'Highlight featured blog posts' },
          { id: 'top-stories', name: 'Top Stories', icon: TrendingUp, description: 'Display trending blog stories' },
          { id: 'recent-posts', name: 'Recent Posts', icon: Clock, description: 'Show latest blog posts' },
          { id: 'blog-categories', name: 'Blog Categories', icon: Grid3x3, description: 'Display blog categories' }
        ];
      case 'event':
        return [
          { id: 'upcoming-events', name: 'Upcoming Events', icon: Calendar, description: 'Show upcoming events' },
          { id: 'featured-events', name: 'Featured Events', icon: Sparkles, description: 'Highlight featured events' },
          { id: 'event-calendar', name: 'Event Calendar', icon: Calendar, description: 'Display event calendar' },
          { id: 'event-categories', name: 'Event Categories', icon: Grid3x3, description: 'Show event categories' }
        ];
      default:
        return [
          { id: 'featured-content', name: 'Featured Content', icon: Star, description: 'Highlight featured content' },
          { id: 'recent-activity', name: 'Recent Activity', icon: Clock, description: 'Show recent activity' },
          { id: 'trending-topics', name: 'Trending Topics', icon: TrendingUp, description: 'Display trending topics' }
        ];
    }
  };

  const categories: WidgetCategory[] = [
    {
      id: 'content',
      name: 'Content Widgets',
      color: '#A095C4',
      widgets: getContentWidgets(contentType)
    },
    {
      id: 'general',
      name: 'General Widgets',
      color: '#B5BBAE',
      widgets: [
        { id: 'announcement-banner', name: 'Announcement Banner', icon: Megaphone, description: 'Display announcements' },
        { id: 'hero-banner', name: 'Hero Banner', icon: Image, description: 'Hero section with banner' },
        { id: 'space-header', name: 'Space Header', icon: Layers, description: 'Space header with banner' },
        { id: 'html-script', name: 'HTML Script', icon: Code, description: 'Custom HTML/JavaScript code' },
        { id: 'iframe', name: 'iFrame', icon: Monitor, description: 'Embed external content' }
      ]
    },
    {
      id: 'basic',
      name: 'Basic Widgets',
      color: '#7AA0B0',
      widgets: [
        { id: 'title', name: 'Title', icon: Type, description: 'Display title text' },
        { id: 'logo', name: 'Logo', icon: ImageIcon, description: 'Display logo image' },
        { id: 'image', name: 'Image', icon: Image, description: 'Display images' },
        { id: 'video', name: 'Video', icon: Video, description: 'Video player' },
        { id: 'accordions', name: 'Accordions', icon: Menu, description: 'Collapsible content sections' },
        { id: 'rich-text', name: 'Rich Text', icon: AlignLeft, description: 'Formatted text content' },
        { id: 'quick-links', name: 'Quick Links', icon: ExternalLink, description: 'Quick navigation links' }
      ]
    }
  ];



  const toggleWidget = (widgetId: string) => {
    setSelectedWidgets(prev => 
      prev.includes(widgetId) 
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const handleDragStart = (e: React.DragEvent, widget: Widget) => {
    e.dataTransfer.setData('application/json', JSON.stringify(widget));
    e.dataTransfer.effectAllowed = 'copy';
    
    // Create a custom drag image
    const dragImage = document.createElement('div');
    dragImage.className = 'bg-white dark:bg-gray-800 p-3 rounded-lg border shadow-lg flex items-center gap-2';
    dragImage.innerHTML = `
      <div class="w-5 h-5 text-gray-500"></div>
      <span class="text-sm font-medium">${widget.name}</span>
    `;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Clean up after drag
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  const handleMouseEnter = (widget: Widget, e: React.MouseEvent) => {
    // Clear any existing timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
    // Immediate update - no delay
    setCurrentHoveredWidget(widget);
    if (onWidgetHover) {
      onWidgetHover(widget, { x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Throttle mouse move updates to avoid excessive calls
    if (onWidgetHover && currentHoveredWidget) {
      if (!hoverTimeoutRef.current) {
        hoverTimeoutRef.current = setTimeout(() => {
          if (onWidgetHover && currentHoveredWidget) {
            onWidgetHover(currentHoveredWidget, { x: e.clientX, y: e.clientY });
          }
          hoverTimeoutRef.current = null;
        }, 16); // ~60fps
      }
    }
  };

  const handleMouseLeave = () => {
    // Clear timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    // Immediate cleanup
    setCurrentHoveredWidget(null);
    if (onWidgetHover) {
      onWidgetHover(null, { x: 0, y: 0 });
    }
  };

  // This function is used inside the component
  const getWidgetPreview = (widget: Widget) => {
    const IconComponent = widget.icon;
    
         // Sample preview content based on widget type
     const previewContent = {
       'featured-blog-posts': (
         <div className="space-y-2">
           <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
             <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
               <Star className="w-4 h-4 text-blue-600" />
             </div>
             <div className="flex-1 min-w-0">
               <h3 className="font-medium text-xs truncate">How to Build Better Apps</h3>
               <p className="text-xs text-gray-500">Featured • 2d ago</p>
             </div>
           </div>
           <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
             <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
               <TrendingUp className="w-4 h-4 text-green-600" />
             </div>
             <div className="flex-1 min-w-0">
               <h3 className="font-medium text-xs truncate">Design System Guide</h3>
               <p className="text-xs text-gray-500">Featured • 5d ago</p>
             </div>
           </div>
         </div>
       ),
       'top-stories': (
         <div className="space-y-2">
           <div className="flex items-center gap-2 text-xs">
             <TrendingUp className="w-3 h-3 text-orange-500" />
             <span className="font-medium text-orange-600">Trending Now</span>
           </div>
           <div className="space-y-1">
             <div className="text-xs font-medium">The Future of Web Development</div>
             <div className="text-xs font-medium">React vs Vue in 2024</div>
             <div className="text-xs font-medium">AI Tools for Developers</div>
           </div>
         </div>
       ),
       'upcoming-events': (
         <div className="space-y-2">
           <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
             <Calendar className="w-4 h-4 text-purple-600" />
             <div className="flex-1 min-w-0">
               <h3 className="font-medium text-xs truncate">Design Workshop</h3>
               <p className="text-xs text-gray-500">Tomorrow, 2:00 PM</p>
             </div>
           </div>
           <div className="flex items-center gap-2 p-2 bg-indigo-50 rounded-lg">
             <Calendar className="w-4 h-4 text-indigo-600" />
             <div className="flex-1 min-w-0">
               <h3 className="font-medium text-xs truncate">Tech Meetup</h3>
               <p className="text-xs text-gray-500">Friday, 6:00 PM</p>
             </div>
           </div>
         </div>
       ),
       'featured-events': (
         <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-3 rounded-lg">
           <div className="flex items-center gap-2 mb-2">
             <Sparkles className="w-4 h-4 text-purple-600" />
             <span className="text-xs font-medium text-purple-800">Featured Event</span>
           </div>
           <h3 className="text-sm font-bold text-purple-900 mb-1">Annual Conference 2024</h3>
           <p className="text-xs text-purple-700">Join us for the biggest tech event</p>
         </div>
       ),
             'announcement-banner': (
         <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
           <div className="flex items-center gap-2">
             <Megaphone className="w-4 h-4 text-blue-600" />
             <div className="flex-1">
               <h3 className="font-medium text-xs text-blue-800">Important Update</h3>
               <p className="text-xs text-blue-600">New features available</p>
             </div>
           </div>
         </div>
       ),
             'hero-banner': (
         <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg p-4 text-white">
           <h2 className="text-sm font-bold mb-1">Welcome to Our Community</h2>
           <p className="text-xs opacity-90 mb-2">Connect, share, and grow</p>
           <button className="bg-white text-purple-600 px-2 py-1 rounded text-xs font-medium">
             Get Started
           </button>
         </div>
       ),
       'logo': (
         <div className="flex items-center justify-center p-4">
           <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
             <span className="text-white font-bold text-xs">LOGO</span>
           </div>
         </div>
       ),
       'image': (
         <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
           <ImageIcon className="w-8 h-8 text-gray-400" />
         </div>
       ),
       'html-script': (
         <div className="bg-gray-900 rounded-lg p-3 text-green-400 font-mono text-xs">
           <div>&lt;script&gt;</div>
           <div className="ml-2">console.log('Hello!');</div>
           <div>&lt;/script&gt;</div>
         </div>
       ),
       'iframe': (
         <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
           <Monitor className="w-6 h-6 mx-auto mb-1 text-gray-400" />
           <p className="text-xs text-gray-500">Embedded Content</p>
         </div>
       ),
       'quick-links': (
         <div className="space-y-1">
           <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
             <ExternalLink className="w-3 h-3 text-blue-500" />
             <span className="text-xs">Documentation</span>
           </div>
           <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
             <ExternalLink className="w-3 h-3 text-green-500" />
             <span className="text-xs">Support</span>
           </div>
           <div className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
             <ExternalLink className="w-3 h-3 text-purple-500" />
             <span className="text-xs">Community</span>
           </div>
         </div>
       ),
             'title': (
         <div className="text-center py-2">
           <h1 className="text-sm font-bold text-gray-800">Section Title</h1>
         </div>
       ),
       'rich-text': (
         <div className="text-xs text-gray-600 leading-relaxed">
           This is rich text with <strong>bold</strong>, 
           <em>italic</em>, and <span className="text-blue-600">links</span>.
         </div>
       ),
       'video': (
         <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
           <div className="text-center text-white">
             <Video className="w-6 h-6 mx-auto mb-1 opacity-60" />
             <p className="text-xs opacity-80">Video Player</p>
           </div>
         </div>
       ),
       'accordions': (
         <div className="space-y-1">
           <div className="border border-gray-200 rounded">
             <div className="flex items-center justify-between p-2 bg-gray-50">
               <span className="text-xs font-medium">Section 1</span>
               <Menu className="w-3 h-3" />
             </div>
             <div className="p-2 text-xs text-gray-600">
               Content goes here...
             </div>
           </div>
           <div className="border border-gray-200 rounded">
             <div className="flex items-center justify-between p-2 bg-gray-50">
               <span className="text-xs font-medium">Section 2</span>
               <Menu className="w-3 h-3" />
             </div>
           </div>
         </div>
       )
    };

    return previewContent[widget.id as keyof typeof previewContent] || (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
        <IconComponent className="w-8 h-8 mb-2" />
        <p className="text-sm">Widget Preview</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors ${
            activeTab === 'general'
              ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          General Page
        </button>
        <button
          onClick={() => setActiveTab('single')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors ${
            activeTab === 'single'
              ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          Single Page
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <div className="space-y-6 relative">
          {categories.map((category) => (
            <div key={category.id} className="space-y-3">
              <h3 
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: category.color }}
              >
                {category.name}
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                {category.widgets.map((widget) => {
                  const isSelected = selectedWidgets.includes(widget.id);
                  const IconComponent = widget.icon;
                  
                  return (
                    <button
                      key={widget.id}
                      onClick={() => toggleWidget(widget.id)}
                      draggable={true}
                      onDragStart={(e) => handleDragStart(e, widget)}
                      onMouseEnter={(e) => handleMouseEnter(widget, e)}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      className="group relative flex flex-col items-center justify-center aspect-square p-3 transition-all duration-300 cursor-grab active:cursor-grabbing rounded-lg border"
                      style={{
                        '--category-color': category.color,
                        '--category-rgb': category.color.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ') || '0, 0, 0',
                        background: isSelected 
                          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.2) 100%)'
                          : `linear-gradient(135deg, rgba(${category.color.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ') || '0, 0, 0'}, 0.03) 0%, rgba(${category.color.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ') || '0, 0, 0'}, 0.08) 100%)`,
                        borderColor: isSelected 
                          ? 'rgba(59, 130, 246, 0.3)'
                          : `rgba(${category.color.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ') || '0, 0, 0'}, 0.2)`
                      } as React.CSSProperties}
                      onMouseOver={(e) => {
                        if (!isSelected) {
                          const target = e.currentTarget;
                          const rgb = category.color.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ') || '0, 0, 0';
                          target.style.background = `linear-gradient(135deg, rgba(${rgb}, 0.06) 0%, rgba(${rgb}, 0.12) 100%)`;
                          target.style.borderColor = `rgba(${rgb}, 0.3)`;
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) {
                          const target = e.currentTarget;
                          const rgb = category.color.replace('#', '').match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ') || '0, 0, 0';
                          target.style.background = `linear-gradient(135deg, rgba(${rgb}, 0.03) 0%, rgba(${rgb}, 0.08) 100%)`;
                          target.style.borderColor = `rgba(${rgb}, 0.2)`;
                        }
                      }}
                    >
                      <IconComponent 
                        className="w-5 h-5 mb-2 transition-all duration-300"
                        style={{ 
                          color: isSelected ? '#3b82f6' : category.color 
                        }}
                      />
                      <span 
                        className="text-xs font-medium text-center leading-tight transition-all duration-300 truncate w-full"
                        style={{ 
                          color: isSelected ? '#3b82f6' : category.color 
                        }}
                      >
                        {widget.name}
                      </span>
                      
                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800 shadow-md flex items-center justify-center animate-pulse">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {selectedWidgets.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">
                Selected Widgets ({selectedWidgets.length})
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {categories
                  .flatMap(cat => cat.widgets)
                  .filter(widget => selectedWidgets.includes(widget.id))
                  .map(widget => widget.name)
                  .join(', ')}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Single Page Tab Content */}
      {activeTab === 'single' && (
        <div className="space-y-4">
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <Grid3x3 className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium mb-2">Single Page Widgets</h3>
            <p className="text-sm">Configure widgets that appear on individual content pages.</p>
          </div>
          
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Single page widget configuration coming soon...
            </p>
          </div>
        </div>
      )}
    </div>
  );
  }

  // Export the widget preview function for use in parent components  
  export const getWidgetPreview = (widget: Widget & { categoryColor?: string }) => {
    const IconComponent = widget.icon;
    
    // Get category info for the widget
    const getWidgetCategory = (widgetId: string) => {
      const categories = [
        {
          id: 'content',
          name: 'Content Widgets',
          color: '#A095C4',
          widgets: ['featured-content', 'recent-activity', 'trending-topics', 'featured-blog-posts', 'top-stories', 'recent-posts', 'blog-categories', 'upcoming-events', 'featured-events', 'event-calendar', 'event-categories']
        },
        {
          id: 'general',
          name: 'General Widgets', 
          color: '#B5BBAE',
          widgets: ['announcement-banner', 'hero-banner', 'space-header', 'html-script', 'iframe']
        },
        {
          id: 'basic',
          name: 'Basic Widgets',
          color: '#7AA0B0', 
          widgets: ['title', 'logo', 'image', 'video', 'accordions', 'rich-text', 'quick-links']
        }
      ];
      
      for (const category of categories) {
        if (category.widgets.includes(widgetId)) {
          return category;
        }
      }
      return categories[0]; // Default to content
    };
    
    const category = getWidgetCategory(widget.id);
    const categoryColor = widget.categoryColor || category.color;
    
    // Sample preview content based on widget type
    const previewContent = {
      'featured-blog-posts': (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-md flex items-center justify-center">
              <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-xs truncate text-gray-900 dark:text-gray-100">How to Build Better Apps</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Featured • 2d ago</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-md flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-xs truncate text-gray-900 dark:text-gray-100">Design System Guide</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Featured • 5d ago</p>
            </div>
          </div>
        </div>
      ),
      'top-stories': (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <TrendingUp className="w-3 h-3 text-orange-500 dark:text-orange-400" />
            <span className="font-medium text-orange-600 dark:text-orange-400">Trending Now</span>
          </div>
          <div className="space-y-1">
            <div className="text-xs font-medium text-gray-900 dark:text-gray-100">The Future of Web Development</div>
            <div className="text-xs font-medium text-gray-900 dark:text-gray-100">React vs Vue in 2024</div>
            <div className="text-xs font-medium text-gray-900 dark:text-gray-100">AI Tools for Developers</div>
          </div>
        </div>
      ),
      'upcoming-events': (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
            <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-xs truncate text-gray-900 dark:text-gray-100">Design Workshop</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tomorrow, 2:00 PM</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-xs truncate text-gray-900 dark:text-gray-100">Tech Meetup</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Friday, 6:00 PM</p>
            </div>
          </div>
        </div>
      ),
      'featured-events': (
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 dark:bg-gray-800 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-800 dark:text-purple-300">Featured Event</span>
          </div>
          <h3 className="text-sm font-bold text-purple-900 dark:text-gray-100 mb-1">Annual Conference 2024</h3>
          <p className="text-xs text-purple-700 dark:text-gray-300">Join us for the biggest tech event</p>
        </div>
      ),
      'announcement-banner': (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <div className="flex-1">
              <h3 className="font-medium text-xs text-blue-800 dark:text-blue-300">Important Update</h3>
              <p className="text-xs text-blue-600 dark:text-blue-400">New features available</p>
            </div>
          </div>
        </div>
      ),
      'hero-banner': (
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 dark:bg-gray-800 rounded-lg p-4 text-white dark:text-gray-100">
          <h2 className="text-sm font-bold mb-1">Welcome to Our Community</h2>
          <p className="text-xs opacity-90 mb-2">Connect, share, and grow</p>
          <button className="bg-white text-purple-600 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded text-xs font-medium">
            Get Started
          </button>
        </div>
      ),
      'logo': (
        <div className="flex items-center justify-center p-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-white dark:text-gray-200 font-bold text-xs">LOGO</span>
          </div>
        </div>
      ),
      'image': (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg aspect-video flex items-center justify-center">
          <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
      ),
      'html-script': (
        <div className="bg-gray-900 rounded-lg p-3 text-green-400 font-mono text-xs">
          <div>&lt;script&gt;</div>
          <div className="ml-2">console.log('Hello!');</div>
          <div>&lt;/script&gt;</div>
        </div>
      ),
      'iframe': (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
          <Monitor className="w-6 h-6 mx-auto mb-1 text-gray-400 dark:text-gray-500" />
          <p className="text-xs text-gray-500 dark:text-gray-400">Embedded Content</p>
        </div>
      ),
      'quick-links': (
        <div className="space-y-1">
          <div className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <ExternalLink className="w-3 h-3 text-blue-500 dark:text-blue-400" />
            <span className="text-xs text-gray-900 dark:text-gray-100">Documentation</span>
          </div>
          <div className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <ExternalLink className="w-3 h-3 text-green-500 dark:text-green-400" />
            <span className="text-xs text-gray-900 dark:text-gray-100">Support</span>
          </div>
          <div className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
            <ExternalLink className="w-3 h-3 text-purple-500 dark:text-purple-400" />
            <span className="text-xs text-gray-900 dark:text-gray-100">Community</span>
          </div>
        </div>
      ),
      'title': (
        <div className="text-center py-2">
          <h1 className="text-sm font-bold text-gray-800 dark:text-gray-200">Section Title</h1>
        </div>
      ),
      'rich-text': (
        <div className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          This is rich text with <strong>bold</strong>, 
          <em>italic</em>, and <span className="text-blue-600 dark:text-blue-400">links</span>.
        </div>
      ),
      'video': (
        <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
          <div className="text-center text-white">
            <Video className="w-6 h-6 mx-auto mb-1 opacity-60" />
            <p className="text-xs opacity-80">Video Player</p>
          </div>
        </div>
      ),
      'accordions': (
        <div className="space-y-1">
          <div className="border border-gray-200 dark:border-gray-600 rounded">
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700">
              <span className="text-xs font-medium text-gray-900 dark:text-gray-100">Section 1</span>
              <Menu className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="p-2 text-xs text-gray-600 dark:text-gray-300">
              Content goes here...
            </div>
          </div>
          <div className="border border-gray-200 dark:border-gray-600 rounded">
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700">
              <span className="text-xs font-medium text-gray-900 dark:text-gray-100">Section 2</span>
              <Menu className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>
      )
    };

    return previewContent[widget.id as keyof typeof previewContent] || (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
        <IconComponent className="w-8 h-8 mb-2" />
        <p className="text-sm">Widget Preview</p>
      </div>
    );
  }; 