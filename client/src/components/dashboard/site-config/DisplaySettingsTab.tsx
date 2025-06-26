import { useState, useCallback, useMemo } from "react";
import {
  LayoutGrid,
  LayoutList,
  Rows3,
  Columns,
  ExternalLink,
  Square,
  Hash,
  MoreHorizontal,
  Image,
  Crop,
  ChevronDown,
  Heading,
  AlignLeft,
  User,
  Calendar,
  Heart,
  MessageSquare,
  RefreshCw,
  Grid2x2Plus
} from "lucide-react";
import { PropertyRow } from "./PropertyRow";
import { NumberPropertyRow } from "./NumberPropertyRow";

export function DisplaySettingsTab() {
  const [activeTab, setActiveTab] = useState('settings');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [layout, setLayout] = useState('grid');
  const [showAuthor, setShowAuthor] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [cardSize, setCardSize] = useState('medium');
  const [openPageIn, setOpenPageIn] = useState('post_page');
  const [cardCover, setCardCover] = useState(true);
  const [fitCover, setFitCover] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showExcerpt, setShowExcerpt] = useState(true);
  const [showReactions, setShowReactions] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [propertiesExpanded, setPropertiesExpanded] = useState(false);

  // Optimized event handlers
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

  const togglePropertiesExpanded = useCallback(() => {
    setPropertiesExpanded(prev => !prev);
  }, []);

  // Memoized options
  const layoutOptions = useMemo(() => [
    { value: 'grid', label: 'Grid', icon: LayoutGrid },
    { value: 'list', label: 'List', icon: LayoutList },
    { value: 'feed', label: 'Feed', icon: Rows3 }
  ], []);

  const cardSizeOptions = useMemo(() => [
    { 
      value: 'small', 
      label: 'Small',
      description: 'Compact cards with minimal content preview',
      icon: Columns
    },
    { 
      value: 'medium', 
      label: 'Medium',
      description: 'Balanced size with good content visibility',
      icon: Columns
    },
    { 
      value: 'large', 
      label: 'Large',
      description: 'Spacious cards with detailed content preview',
      icon: Columns
    },
    { 
      value: 'extra_large', 
      label: 'Extra Large',
      description: 'Maximum size cards with full content display',
      icon: Columns
    }
  ], []);

  const openPageOptions = useMemo(() => [
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
  ], []);

  // Memoized render function for properties section
  const renderPropertiesSection = useCallback(() => (
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
            value={showTitle}
            fieldName="showTitle"
            type="checkbox"
            onValueChange={setShowTitle}
            icon={Heading}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
            disabled={true}
          />

          <PropertyRow
            label="Excerpt"
            value={showExcerpt}
            fieldName="showExcerpt"
            type="checkbox"
            onValueChange={setShowExcerpt}
            icon={AlignLeft}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
            disabled={true}
          />

          <PropertyRow
            label="Author"
            value={showAuthor}
            fieldName="showAuthor"
            type="checkbox"
            onValueChange={setShowAuthor}
            icon={User}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
            disabled={true}
          />

          <PropertyRow
            label="Date"
            value={showDate}
            fieldName="showDate"
            type="checkbox"
            onValueChange={setShowDate}
            icon={Calendar}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
          />

          <PropertyRow
            label="Tags"
            value={showTags}
            fieldName="showTags"
            type="checkbox"
            onValueChange={setShowTags}
            icon={Hash}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
          />

          <PropertyRow
            label="Reactions"
            value={showReactions}
            fieldName="showReactions"
            type="checkbox"
            onValueChange={setShowReactions}
            icon={Heart}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
          />

          <PropertyRow
            label="Comments"
            value={showComments}
            fieldName="showComments"
            type="checkbox"
            onValueChange={setShowComments}
            icon={MessageSquare}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
          />
        </div>
      )}
    </div>
  ), [propertiesExpanded, showTitle, showExcerpt, showAuthor, showDate, showTags, showReactions, showComments, editingField, handleFieldClick, handleFieldBlur, handleKeyDown, togglePropertiesExpanded]);

  // Memoized grid settings
  const gridSettings = useMemo(() => (
    <>
      <PropertyRow
        label="Card size"
        value={cardSize}
        fieldName="cardSize"
        type="select"
        options={cardSizeOptions}
        onValueChange={setCardSize}
        icon={Columns}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="Open page in"
        value={openPageIn}
        fieldName="openPageIn"
        type="select"
        options={openPageOptions}
        onValueChange={setOpenPageIn}
        icon={ExternalLink}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="Card Cover"
        value={cardCover}
        fieldName="cardCover"
        type="checkbox"
        onValueChange={setCardCover}
        icon={Image}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      {cardCover && (
        <PropertyRow
          label="Fit cover"
          value={fitCover}
          fieldName="fitCover"
          type="checkbox"
          onValueChange={setFitCover}
          icon={Crop}
          editingField={editingField}
          onFieldClick={handleFieldClick}
          onFieldBlur={handleFieldBlur}
          onKeyDown={handleKeyDown}
          isChild={true}
        />
      )}

      {renderPropertiesSection()}
    </>
  ), [cardSize, cardSizeOptions, openPageIn, openPageOptions, cardCover, fitCover, editingField, handleFieldClick, handleFieldBlur, handleKeyDown, renderPropertiesSection]);

  // Memoized list/feed settings
  const listFeedSettings = useMemo(() => (
    <>
      <PropertyRow
        label="Open page in"
        value={openPageIn}
        fieldName="openPageIn"
        type="select"
        options={openPageOptions}
        onValueChange={setOpenPageIn}
        icon={ExternalLink}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      {renderPropertiesSection()}
    </>
  ), [openPageIn, openPageOptions, editingField, handleFieldClick, handleFieldBlur, handleKeyDown, renderPropertiesSection]);

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors ${
            activeTab === 'settings'
              ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          General Content
        </button>
        <button
          onClick={() => setActiveTab('single-event')}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-t-md border-b-2 transition-colors ${
            activeTab === 'single-event'
              ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          Single Content
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'settings' && (
        <div className="space-y-4">
          {/* Visual Layout Selector */}
          <div>
            <div className="grid grid-cols-3 gap-2 px-2">
              {layoutOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setLayout(option.value)}
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
            {layout === 'grid' && gridSettings}
            {(layout === 'list' || layout === 'feed') && listFeedSettings}
          </div>
        </div>
      )}

      {/* Single Content Tab Content */}
      {activeTab === 'single-event' && (
        <div className="space-y-4">
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-medium mb-2">Single Content</h3>
            <p className="text-sm">Customize how individual content items are displayed and what information is shown to visitors.</p>
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
      )}
    </div>
  );
} 