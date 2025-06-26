import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
  FileText as TypeIcon,
  ImageIcon,
  Star,
  Clock,
  TrendingUp,
  Sparkles,
  Globe,
  ExternalLink,
  ArrowLeft,
  Settings,
  Palette,
  Layout,
  Eye
} from "lucide-react";
import { PropertyRow } from "./PropertyRow";

interface Widget {
  id: string;
  name: string;
  icon: any;
  description: string;
  categoryColor?: string;
}

interface WidgetSettings {
  title?: string;
  subtitle?: string;
  showBorder?: boolean;
  backgroundColor?: string;
  textColor?: string;
  alignment?: 'left' | 'center' | 'right';
  visibility?: boolean;
  spacing?: 'tight' | 'normal' | 'loose';
  animation?: 'none' | 'fade' | 'slide';
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
  selectedWidget?: Widget & { settings?: WidgetSettings };
  onWidgetSettingsChange?: (widget: Widget, settings: WidgetSettings) => void;
  onBackToWidgets?: () => void;
}

export function WidgetSettingsTab({ 
  contentType = 'general', 
  onWidgetHover, 
  selectedWidget, 
  onWidgetSettingsChange, 
  onBackToWidgets 
}: Props) {
  const [activeTab, setActiveTab] = useState('general');
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([]);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Widget settings state
  const [editingField, setEditingField] = useState<string | null>(null);
  const [widgetSettings, setWidgetSettings] = useState<WidgetSettings>({
    title: '',
    subtitle: '',
    showBorder: true,
    backgroundColor: '',
    textColor: '',
    alignment: 'center',
    visibility: true,
    spacing: 'normal',
    animation: 'none'
  });

  // Update widget settings when selectedWidget changes
  useEffect(() => {
    if (selectedWidget) {
      setWidgetSettings({
        title: selectedWidget.settings?.title || selectedWidget.name || '',
        subtitle: selectedWidget.settings?.subtitle || '',
        showBorder: selectedWidget.settings?.showBorder ?? true,
        backgroundColor: selectedWidget.settings?.backgroundColor || '',
        textColor: selectedWidget.settings?.textColor || '',
        alignment: selectedWidget.settings?.alignment || 'center',
        visibility: selectedWidget.settings?.visibility ?? true,
        spacing: selectedWidget.settings?.spacing || 'normal',
        animation: selectedWidget.settings?.animation || 'none'
      });
    }
  }, [selectedWidget]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Memoized content widgets
  const getContentWidgets = useMemo(() => {
    const widgetsByType = {
      blog: [
          { id: 'featured-blog-posts', name: 'Featured Blog Posts', icon: Star, description: 'Highlight featured blog posts' },
          { id: 'top-stories', name: 'Top Stories', icon: TrendingUp, description: 'Display trending blog stories' },
          { id: 'recent-posts', name: 'Recent Posts', icon: Clock, description: 'Show latest blog posts' },
          { id: 'blog-categories', name: 'Blog Categories', icon: Grid3x3, description: 'Display blog categories' }
      ],
      event: [
          { id: 'featured-events', name: 'Featured Events', icon: Sparkles, description: 'Highlight featured events' },
          { id: 'event-categories', name: 'Event Categories', icon: Grid3x3, description: 'Show event categories' },
          { id: 'event-calendar', name: 'Event Calendar', icon: Calendar, description: 'Display event calendar view' }
      ],
      general: [
          { id: 'featured-content', name: 'Featured Content', icon: Star, description: 'Highlight featured content' },
          { id: 'recent-activity', name: 'Recent Activity', icon: Clock, description: 'Show recent activity' },
          { id: 'trending-topics', name: 'Trending Topics', icon: TrendingUp, description: 'Display trending topics' }
      ]
    };
    
    return widgetsByType[contentType] || widgetsByType.general;
  }, [contentType]);

  // Memoized widget categories
  const categories: WidgetCategory[] = useMemo(() => [
    {
      id: 'content',
      name: 'Content Widgets',
      color: '#A095C4',
      widgets: getContentWidgets
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
        { id: 'title', name: 'Title', icon: TypeIcon, description: 'Display title text' },
        { id: 'logo', name: 'Logo', icon: ImageIcon, description: 'Display logo image' },
        { id: 'image', name: 'Image', icon: Image, description: 'Display images' },
        { id: 'video', name: 'Video', icon: Video, description: 'Video player' },
        { id: 'accordions', name: 'Accordions', icon: Menu, description: 'Collapsible content sections' },
        { id: 'rich-text', name: 'Rich Text', icon: AlignLeft, description: 'Formatted text content' },
        { id: 'quick-links', name: 'Quick Links', icon: ExternalLink, description: 'Quick navigation links' }
      ]
    }
  ], [getContentWidgets]);

  // Event handlers - optimized
  const handleFieldClick = useCallback((fieldName: string) => {
    setEditingField(fieldName);
  }, []);

  const handleFieldBlur = useCallback(() => {
    setEditingField(null);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, fieldName: string) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setEditingField(null);
    }
  }, []);

  const handleSettingChange = useCallback((key: keyof WidgetSettings, value: any) => {
    const newSettings = { ...widgetSettings, [key]: value };
    setWidgetSettings(newSettings);
    if (selectedWidget && onWidgetSettingsChange) {
      onWidgetSettingsChange(selectedWidget, newSettings);
    }
  }, [widgetSettings, selectedWidget, onWidgetSettingsChange]);

  const toggleWidget = useCallback((widgetId: string) => {
    setSelectedWidgets(prev => 
      prev.includes(widgetId) 
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent, widget: Widget) => {
    e.dataTransfer.setData('application/json', JSON.stringify(widget));
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  // Optimized hover handlers
  const handleMouseEnter = useCallback((widget: Widget, e: React.MouseEvent) => {
    if (selectedWidget || !onWidgetHover) return;
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    
      onWidgetHover(widget, { x: e.clientX, y: e.clientY });
  }, [selectedWidget, onWidgetHover]);

  const handleMouseLeave = useCallback(() => {
    if (selectedWidget || !onWidgetHover) return;
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
      onWidgetHover(null, { x: 0, y: 0 });
  }, [selectedWidget, onWidgetHover]);

  return (
    <div className="space-y-4">
      {/* Widget Settings Panel */}
      {selectedWidget?.name ? (
        <div className="space-y-4">
          {/* Header with back button */}
          <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
        <button
              onClick={onBackToWidgets}
              className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              title="Back to widgets"
            >
              <ArrowLeft className="w-4 h-4" />
        </button>
            <div className="flex items-center gap-2">
              {(() => {
                const IconComponent = selectedWidget.icon || Settings;
                return <IconComponent 
                  className="w-5 h-5" 
                  style={{ color: selectedWidget.categoryColor || '#6B7280' }}
                />;
              })()}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {selectedWidget.name} Settings
              </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Configure appearance and behavior
                </p>
              </div>
            </div>
          </div>
          
          {/* Widget Settings Form */}
          <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
            <PropertyRow
              label="Title"
              value={widgetSettings.title}
              fieldName="title"
              type="text"
              onValueChange={(value) => handleSettingChange('title', value)}
              placeholder="Widget title"
              icon={TypeIcon}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
              description="Custom title for this widget instance"
            />

            <PropertyRow
              label="Subtitle"
              value={widgetSettings.subtitle}
              fieldName="subtitle"
              type="text"
              onValueChange={(value) => handleSettingChange('subtitle', value)}
              placeholder="Optional subtitle"
              icon={AlignLeft}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
              description="Additional descriptive text below the title"
            />

            <PropertyRow
              label="Visibility"
              value={widgetSettings.visibility}
              fieldName="visibility"
              type="checkbox"
              onValueChange={(value) => handleSettingChange('visibility', value)}
              icon={Eye}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
              description="Show or hide this widget"
            />

            <PropertyRow
              label="Show Border"
              value={widgetSettings.showBorder}
              fieldName="showBorder"
              type="checkbox"
              onValueChange={(value) => handleSettingChange('showBorder', value)}
              icon={Layout}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
              description="Display a border around the widget"
            />

            <PropertyRow
              label="Text Alignment"
              value={widgetSettings.alignment}
              fieldName="alignment"
              type="select"
              options={[
                { value: 'left', label: 'Left', description: 'Align content to the left' },
                { value: 'center', label: 'Center', description: 'Center align content' },
                { value: 'right', label: 'Right', description: 'Align content to the right' }
              ]}
              onValueChange={(value) => handleSettingChange('alignment', value)}
              icon={AlignLeft}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
              description="How content is aligned within the widget"
            />

            <PropertyRow
              label="Spacing"
              value={widgetSettings.spacing}
              fieldName="spacing"
              type="select"
              options={[
                { value: 'tight', label: 'Tight', description: 'Minimal spacing between elements' },
                { value: 'normal', label: 'Normal', description: 'Standard spacing' },
                { value: 'loose', label: 'Loose', description: 'Extra spacing for breathing room' }
              ]}
              onValueChange={(value) => handleSettingChange('spacing', value)}
              icon={Layout}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
              description="Amount of internal spacing in the widget"
            />

            <PropertyRow
              label="Animation"
              value={widgetSettings.animation}
              fieldName="animation"
              type="select"
              options={[
                { value: 'none', label: 'None', description: 'No animation effects' },
                { value: 'fade', label: 'Fade In', description: 'Fade in when widget becomes visible' },
                { value: 'slide', label: 'Slide Up', description: 'Slide up from bottom when visible' }
              ]}
              onValueChange={(value) => handleSettingChange('animation', value)}
              icon={Sparkles}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
              description="Animation effect when widget appears"
            />

            <PropertyRow
              label="Background Color"
              value={widgetSettings.backgroundColor}
              fieldName="backgroundColor"
              type="text"
              onValueChange={(value) => handleSettingChange('backgroundColor', value)}
              placeholder="#ffffff or transparent"
              icon={Palette}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
              description="Custom background color for the widget"
            />

            <PropertyRow
              label="Text Color"
              value={widgetSettings.textColor}
              fieldName="textColor"
              type="text"
              onValueChange={(value) => handleSettingChange('textColor', value)}
              placeholder="#000000 or inherit"
              icon={TypeIcon}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
              description="Custom text color for the widget content"
            />
          </div>

          {/* Widget Preview */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h4>
            <div 
              className={`p-4 rounded-lg transition-all ${
                widgetSettings.showBorder ? 'border border-gray-200 dark:border-gray-700' : ''
              }`}
              style={{
                backgroundColor: widgetSettings.backgroundColor || 'white',
                color: widgetSettings.textColor || 'inherit',
                textAlign: widgetSettings.alignment,
                display: widgetSettings.visibility ? 'block' : 'none'
              }}
            >
              {widgetSettings.title && (
                <h3 className="font-semibold mb-1">{widgetSettings.title}</h3>
              )}
              {widgetSettings.subtitle && (
                <p className="text-sm opacity-70 mb-2">{widgetSettings.subtitle}</p>
              )}
              <div className="text-sm opacity-80">
                {selectedWidget.description || 'Widget content will appear here'}
            </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === category.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Widget Grid */}
          <div className="space-y-6">
            {categories
              .filter(category => activeTab === category.id)
              .map(category => (
                <div key={category.id} className="space-y-4">
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    {category.widgets.map((widget) => (
                      <div
                        key={widget.id}
                        className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing group"
                        draggable
                        onDragStart={(e) => handleDragStart(e, widget)}
                        onMouseEnter={(e) => handleMouseEnter(widget, e)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="flex items-start gap-3">
                          <div 
                            className="p-2 rounded-lg flex-shrink-0"
                            style={{ 
                              backgroundColor: `${category.color}20`,
                              color: category.color 
                            }}
                          >
                            <widget.icon className="w-5 h-5" />
           </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1 truncate">
                              {widget.name}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                              {widget.description}
                            </p>
             </div>
           </div>
         </div>
                    ))}
            </div>
          </div>
              ))
            }
          </div>
        </>
      )}
        </div>
  );
}

// Simple widget preview for tooltips
export const getWidgetPreview = (widget: Widget & { categoryColor?: string }) => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <widget.icon className="w-8 h-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
        <div className="text-xs text-gray-500">Widget Preview</div>
      </div>
      </div>
    );
  }; 