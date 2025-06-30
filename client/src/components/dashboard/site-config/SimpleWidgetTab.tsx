import React from 'react';
import { Tabs } from "@/components/ui/vercel-tabs";
import { PropertyRow } from "./PropertyRow";
import { 
  WidgetGallery, 
  WidgetSection, 
  widgetSections, 
  availableWidgets, 
  useWidgetManagement,
  type WidgetTabProps 
} from './widgets';
import { 
  MousePointer, 
  CheckCircle, 
  Calendar, 
  User, 
  Layout, 
  Zap, 
  Layers, 
  Settings,
  ArrowLeft,
  ChevronDown,
  Heading,
  AlignLeft,
  Type,
  ExternalLink,
  Hash,
  Tag,
  LayoutGrid,
  LayoutList,
  Grid3x3,
  Grid2X2,
  RectangleHorizontal,
  Sparkles,
  FileText,
  Square,
  Heart,
  MessageSquare,
  Eye,
  Users
} from "lucide-react";

export function SimpleWidgetTab(props: WidgetTabProps) {
  const {
    onWidgetSettingsModeChange,
    onAddWidgetModeChange,
    onLayoutChange,
    onCardSizeChange,
    onCardStyleChange,
  } = props;

  const {
    activeTab,
    selectedInfo,
    editingField,
    selectedWidget,
    isWidgetSettingsMode,
    isAddWidgetMode,
    baseSectionExpanded,
    mainWidgetExpanded,
    customWidgetsExpanded,
    featuredPropertiesExpanded,
    propertiesExpanded,
    layout,
    cardSize,
    cardStyle,
    showGroup,
    groupOptions,
    setActiveTab,
    handleFieldClick,
    handleFieldBlur,
    handleKeyDown,
    toggleBaseSectionExpanded,
    toggleMainWidgetExpanded,
    toggleCustomWidgetsExpanded,
    toggleFeaturedPropertiesExpanded,
    togglePropertiesExpanded,
    handleLayoutChange,
    handleCardSizeChange,
    handleCardStyleChange,
    handleGroupChange,
    handleGroupOptionsChange,
    handleWidgetClick,
    handleBackClick,
    handleAddWidgetClick,
    handleBackFromAddWidget,
    handleAddWidget
  } = useWidgetManagement(
    onWidgetSettingsModeChange, 
    onAddWidgetModeChange,
    onLayoutChange,
    onCardSizeChange, 
    onCardStyleChange
  );

  const tabs = [
    { id: 'active-widgets', label: 'Widgets' },
    { id: 'widget-settings', label: 'Layout Settings' }
  ];

  return (
    <div className="h-full flex flex-col">
      {isWidgetSettingsMode && selectedWidget ? (
        /* Widget Settings Mode */
        <div className="space-y-4 min-w-0">
          {/* Back Button */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={handleBackClick}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Widgets</span>
            </button>
          </div>

          {/* Widget Header */}
          <div className="flex items-center gap-3 mb-4 ml-2 mt-3">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {selectedWidget.name} Settings
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {selectedWidget.description}
              </p>
            </div>
          </div>

          {/* Widget-specific Settings */}
          <div className="space-y-2">
            {/* Featured Events Settings */}
            {selectedWidget.id === 'featured-events' && (
              <>
                <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
                  <PropertyRow
                    label="Header"
                    value={true}
                    fieldName="featuredHeader"
                    type="checkbox"
                    onValueChange={() => {}}
                    icon={Heading}
                    editingField={editingField}
                    onFieldClick={handleFieldClick}
                    onFieldBlur={handleFieldBlur}
                    onKeyDown={handleKeyDown}
                  />

                  <PropertyRow
                    label="Title"
                    value="Featured Events"
                    fieldName="featuredTitle"
                    type="text"
                    onValueChange={() => {}}
                    icon={Type}
                    isChild={true}
                    editingField={editingField}
                    onFieldClick={handleFieldClick}
                    onFieldBlur={handleFieldBlur}
                    onKeyDown={handleKeyDown}
                  />

                  <PropertyRow
                    label="Description"
                    value="Discover our highlighted upcoming events"
                    fieldName="featuredDescription"
                    type="textarea"
                    onValueChange={() => {}}
                    placeholder="Enter description"
                    icon={AlignLeft}
                    isChild={true}
                    editingField={editingField}
                    onFieldClick={handleFieldClick}
                    onFieldBlur={handleFieldBlur}
                    onKeyDown={handleKeyDown}
                  />

                  <PropertyRow
                    label="Events to show"
                    value="all"
                    fieldName="featuredEventsToShow"
                    type="select"
                    options={[
                      { value: 'all', label: 'All Events', icon: Layout },
                      { value: 'upcoming', label: 'Upcoming Events', icon: Calendar },
                      { value: 'featured', label: 'Featured Events', icon: Zap },
                      { value: 'custom', label: 'Custom', icon: Settings }
                    ]}
                    onValueChange={() => {}}
                    icon={Layout}
                    editingField={editingField}
                    onFieldClick={handleFieldClick}
                    onFieldBlur={handleFieldBlur}
                    onKeyDown={handleKeyDown}
                  />

                  <PropertyRow
                    label="RSVP"
                    value={false}
                    fieldName="featuredRsvp"
                    type="checkbox"
                    onValueChange={() => {}}
                    icon={CheckCircle}
                    editingField={editingField}
                    onFieldClick={handleFieldClick}
                    onFieldBlur={handleFieldBlur}
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {/* Property Visibility Accordion */}
                <div className="pt-1 border-t border-gray-50 dark:border-gray-800">
                  <button
                    onClick={toggleFeaturedPropertiesExpanded}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <span>Property Visibility</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${featuredPropertiesExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {featuredPropertiesExpanded && (
                    <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
                    <PropertyRow
                      label="Host"
                      value={true}
                      fieldName="featuredShowHost"
                      type="checkbox"
                      onValueChange={() => {}}
                      icon={User}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                    />

                    <PropertyRow
                      label="Attendees"
                      value={true}
                      fieldName="featuredShowAttendees"
                      type="checkbox"
                      onValueChange={() => {}}
                      icon={Users}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                    />

                    <PropertyRow
                      label="Countdown"
                      value={true}
                      fieldName="featuredShowCountdown"
                      type="checkbox"
                      onValueChange={() => {}}
                      icon={Calendar}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                    />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Event Categories Settings */}
            {selectedWidget.id === 'categories' && (
              <>
                <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
                  <PropertyRow
                    label="Display style"
                    value="chips"
                    fieldName="categoriesDisplayStyle"
                    type="select"
                    options={[
                      { value: 'chips', label: 'Chips', icon: Hash },
                      { value: 'buttons', label: 'Buttons', icon: Square },
                      { value: 'dropdown', label: 'Dropdown', icon: ChevronDown }
                    ]}
                    onValueChange={() => {}}
                    icon={Hash}
                    editingField={editingField}
                    onFieldClick={handleFieldClick}
                    onFieldBlur={handleFieldBlur}
                    onKeyDown={handleKeyDown}
                  />

                  <PropertyRow
                    label="Show 'All' option"
                    value={true}
                    fieldName="categoriesShowAll"
                    type="checkbox"
                    onValueChange={() => {}}
                    icon={Layers}
                    editingField={editingField}
                    onFieldClick={handleFieldClick}
                    onFieldBlur={handleFieldBlur}
                    onKeyDown={handleKeyDown}
                  />

                  <PropertyRow
                    label="Max visible categories"
                    value="6"
                    fieldName="categoriesMaxVisible"
                    type="select"
                    options={[
                      { value: '3', label: '3 categories', icon: Hash },
                      { value: '6', label: '6 categories', icon: Hash },
                      { value: '9', label: '9 categories', icon: Hash },
                      { value: '12', label: '12 categories', icon: Hash }
                    ]}
                    onValueChange={() => {}}
                    icon={Hash}
                    editingField={editingField}
                    onFieldClick={handleFieldClick}
                    onFieldBlur={handleFieldBlur}
                    onKeyDown={handleKeyDown}
                  />

                  <PropertyRow
                    label="Allow multiple selection"
                    value={false}
                    fieldName="categoriesAllowMultiple"
                    type="checkbox"
                    onValueChange={() => {}}
                    icon={CheckCircle}
                    editingField={editingField}
                    onFieldClick={handleFieldClick}
                    onFieldBlur={handleFieldBlur}
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </>
            )}

            {/* Events Content Settings (Main Widget) */}
            {selectedWidget.id === 'events-container' && (
              <>
                <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
                  <PropertyRow
                    label="Section title"
                    value="Events"
                    fieldName="sectionTitle"
                    type="text"
                    onValueChange={() => {}}
                    icon={Heading}
                    editingField={editingField}
                    onFieldClick={handleFieldClick}
                    onFieldBlur={handleFieldBlur}
                    onKeyDown={handleKeyDown}
                  />

                  <PropertyRow
                    label="Section subtitle"
                    value="Discover upcoming events"
                    fieldName="sectionSubtitle"
                    type="textarea"
                    onValueChange={() => {}}
                    placeholder="Enter section subtitle"
                    icon={AlignLeft}
                    editingField={editingField}
                    onFieldClick={handleFieldClick}
                    onFieldBlur={handleFieldBlur}
                    onKeyDown={handleKeyDown}
                  />

                  <PropertyRow
                    label="Group"
                    value={showGroup}
                    fieldName="featuredGroup"
                    type="checkbox"
                    onValueChange={handleGroupChange}
                    icon={Tag}
                    editingField={editingField}
                    onFieldClick={handleFieldClick}
                    onFieldBlur={handleFieldBlur}
                    onKeyDown={handleKeyDown}
                  />

                  {showGroup && (
                    <PropertyRow
                      label="Group Options"
                      value={groupOptions}
                      fieldName="featuredGroupOptions"
                      type="multiselect"
                      options={[
                        { value: 'pinned_posts', label: 'Pinned Posts', icon: Hash },
                        { value: 'upcoming_events', label: 'Upcoming Events', icon: Calendar },
                        { value: 'past_events', label: 'Past Events', icon: Calendar }
                      ]}
                      onValueChange={handleGroupOptionsChange}
                      icon={Layers}
                      isChild={true}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                      description="Select grouping options for events"
                      enableDropdownSearch={true}
                    />
                  )}
                </div>

                {/* Visual Layout Selector */}
                <div>
                  <div className="grid grid-cols-3 gap-2 px-2">
                    {[
                      { value: 'card', label: 'Card', icon: LayoutGrid },
                      { value: 'list', label: 'List', icon: LayoutList },
                      { value: 'calendar', label: 'Calendar', icon: Calendar }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleLayoutChange(option.value)}
                        className={`flex flex-col items-center justify-center aspect-square p-2 rounded-lg border-2 transition-all ${
                          layout === option.value
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <option.icon className={`w-6 h-6 mb-1 ${
                          layout === option.value 
                            ? 'text-primary-600 dark:text-primary-400' 
                            : 'text-gray-400 dark:text-gray-500'
                        }`} />
                        <span className={`text-xs ${
                          layout === option.value 
                            ? 'text-primary-600 dark:text-primary-400 font-medium' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Conditional Settings */}
                <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
                  {/* Card-specific settings */}
                  {layout === 'card' && (
                    <>
                      <PropertyRow
                        label="Card size"
                        value={cardSize}
                        fieldName="cardSize"
                        type="select"
                        options={[
                          { 
                            value: 'small', 
                            label: 'Small',
                            description: 'Compact cards with minimal content preview (4 per row)',
                            icon: LayoutGrid
                          },
                          { 
                            value: 'medium', 
                            label: 'Medium',
                            description: 'Balanced size with good content visibility (3 per row)',
                            icon: Grid3x3
                          },
                          { 
                            value: 'large', 
                            label: 'Large',
                            description: 'Spacious cards with detailed content preview (2 per row)',
                            icon: Grid2X2
                          },
                          { 
                            value: 'extra_large', 
                            label: 'Extra Large',
                            description: 'Maximum size cards with full content display (1 per row)',
                            icon: RectangleHorizontal
                          }
                        ]}
                        onValueChange={handleCardSizeChange}
                        icon={
                          cardSize === 'small' ? LayoutGrid :
                          cardSize === 'medium' ? Grid3x3 :
                          cardSize === 'large' ? Grid2X2 :
                          RectangleHorizontal
                        }
                        editingField={editingField}
                        onFieldClick={handleFieldClick}
                        onFieldBlur={handleFieldBlur}
                        onKeyDown={handleKeyDown}
                      />

                      <PropertyRow
                        label="Card style"
                        value={cardStyle}
                        fieldName="cardStyle"
                        type="select"
                        options={[
                          { 
                            value: 'modern', 
                            label: 'Modern Style',
                            description: 'Text overlay on image with gradient background',
                            icon: Sparkles
                          },
                          { 
                            value: 'simple', 
                            label: 'Simple Card',
                            description: 'Clean layout with text below image',
                            icon: FileText
                          }
                        ]}
                        onValueChange={handleCardStyleChange}
                        icon={cardStyle === 'modern' ? Sparkles : FileText}
                        editingField={editingField}
                        onFieldClick={handleFieldClick}
                        onFieldBlur={handleFieldBlur}
                        onKeyDown={handleKeyDown}
                      />
                    </>
                  )}

                  {/* Common settings for all layouts */}
                  <PropertyRow
                    label="Open page in"
                    value="post_page"
                    fieldName="openPageIn"
                    type="select"
                    options={[
                      { 
                        value: 'modal_content', 
                        label: 'Modal content',
                        description: 'Open posts in an overlay modal window',
                        icon: Square
                      },
                      { 
                        value: 'post_page', 
                        label: 'Post page',
                        description: 'Navigate to a dedicated post page',
                        icon: ExternalLink
                      }
                    ]}
                    onValueChange={() => {}}
                    icon={ExternalLink}
                    editingField={editingField}
                    onFieldClick={handleFieldClick}
                    onFieldBlur={handleFieldBlur}
                    onKeyDown={handleKeyDown}
                  />
                </div>

                {/* Properties Section */}
                <div className="pt-1 border-t border-gray-50 dark:border-gray-800">
                  <button
                    onClick={togglePropertiesExpanded}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <span>Properties</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${propertiesExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {propertiesExpanded && (
                    <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
                    <PropertyRow
                      label="Title"
                      value={true}
                      fieldName="showTitle"
                      type="checkbox"
                      onValueChange={() => {}}
                      icon={Heading}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                      disabled={true}
                    />

                    <PropertyRow
                      label="Excerpt"
                      value={true}
                      fieldName="showExcerpt"
                      type="checkbox"
                      onValueChange={() => {}}
                      icon={AlignLeft}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                      disabled={true}
                    />

                    <PropertyRow
                      label="Author"
                      value={true}
                      fieldName="showAuthor"
                      type="checkbox"
                      onValueChange={() => {}}
                      icon={User}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                      disabled={true}
                    />

                    <PropertyRow
                      label="Date"
                      value={true}
                      fieldName="showDate"
                      type="checkbox"
                      onValueChange={() => {}}
                      icon={Calendar}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                    />

                    <PropertyRow
                      label="Tags"
                      value={true}
                      fieldName="showTags"
                      type="checkbox"
                      onValueChange={() => {}}
                      icon={Hash}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                    />

                    <PropertyRow
                      label="Reactions"
                      value={true}
                      fieldName="showReactions"
                      type="checkbox"
                      onValueChange={() => {}}
                      icon={Heart}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                    />

                    <PropertyRow
                      label="Comments"
                      value={true}
                      fieldName="showComments"
                      type="checkbox"
                      onValueChange={() => {}}
                      icon={MessageSquare}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                    />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      ) : isAddWidgetMode ? (
        <WidgetGallery
          availableWidgets={availableWidgets}
          onAddWidget={handleAddWidget}
          onBack={handleBackFromAddWidget}
        />
      ) : (
        <>
          {/* Tab Navigation */}
          <div className="flex justify-center py-2">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              className="w-full max-w-md"
            />
          </div>

          {/* Active Widgets Tab Content */}
          {activeTab === 'active-widgets' && (
            <div className="space-y-5 min-w-0 px-2">
              <WidgetSection
                title="Base Section"
                widgets={widgetSections.base}
                expanded={baseSectionExpanded}
                onToggleExpanded={toggleBaseSectionExpanded}
                onWidgetClick={handleWidgetClick}
                isBaseSection={true}
              />

              <WidgetSection
                title="Main Widget"
                widgets={widgetSections.main}
                expanded={mainWidgetExpanded}
                onToggleExpanded={toggleMainWidgetExpanded}
                onWidgetClick={handleWidgetClick}
              />

              <WidgetSection
                title="Custom Widgets"
                widgets={widgetSections.custom}
                expanded={customWidgetsExpanded}
                onToggleExpanded={toggleCustomWidgetsExpanded}
                onWidgetClick={handleWidgetClick}
                onAddWidget={handleAddWidgetClick}
              />
            </div>
          )}

          {/* Widget Settings Tab Content */}
          {activeTab === 'widget-settings' && (
            <div className="space-y-4 min-w-0">
              {selectedInfo ? (
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="truncate">{selectedInfo.sectionName} Settings</span>
                  </h4>
                  <div className="p-3 border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 rounded-lg mb-4">
                    <div className="text-sm font-medium text-green-800 dark:text-green-300 mb-1 truncate">
                      {selectedInfo.sectionName}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 leading-relaxed break-words">
                      Element: {selectedInfo.tagName.toLowerCase()}.{selectedInfo.className.split(' ').find((c: string) => c.includes('site-')) || selectedInfo.className.split(' ')[0]}
                    </div>
                  </div>
                  
                  <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
                    <PropertyRow
                      label="Show content details"
                      value={true}
                      fieldName="showContentDetails"
                      type="checkbox"
                      onValueChange={() => {}}
                      icon={Calendar}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                    />
                    
                    <PropertyRow
                      label="Show action button"
                      value={true}
                      fieldName="showActionButton"
                      type="checkbox"
                      onValueChange={() => {}}
                      icon={User}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                    />
                    
                    <PropertyRow
                      label="Show related users"
                      value={true}
                      fieldName="showRelatedUsers"
                      type="checkbox"
                      onValueChange={() => {}}
                      icon={User}
                      editingField={editingField}
                      onFieldClick={handleFieldClick}
                      onFieldBlur={handleFieldBlur}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  <MousePointer className="w-10 h-10 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <h3 className="text-base font-medium mb-2">Select a Widget</h3>
                  <p className="text-sm mb-4 leading-relaxed">Click on any widget from the "Widgets" tab to configure its settings here.</p>
                  
                  <div className="text-left max-w-full mx-auto space-y-2 text-xs">
                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded min-w-0">
                      <Layout className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="truncate">Site Header - Navigation and branding</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded min-w-0">
                      <Zap className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="truncate">Featured Events - Event highlights</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded min-w-0">
                      <Layers className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="truncate">Categories - Interactive filters</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded min-w-0">
                      <Settings className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      <span className="truncate">Events content - Search and listing</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
} 