import React from 'react';
import { 
  Heading, 
  AlignLeft, 
  Tag, 
  Layers, 
  Hash, 
  Calendar, 
  LayoutGrid, 
  LayoutList,
  Grid3x3,
  Grid2X2,
  RectangleHorizontal,
  Sparkles,
  FileText,
  ExternalLink,
  Square,
  User,
  ChevronDown
} from 'lucide-react';
import { PropertyRow } from '../PropertyRow';

interface EventsContainerSettingsProps {
  editingField: string | null;
  showGroup: boolean;
  groupOptions: string[];
  layout: string;
  cardSize: string;
  cardStyle: string;
  propertiesExpanded: boolean;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
  onGroupChange: (value: boolean) => void;
  onGroupOptionsChange: (options: string[]) => void;
  onLayoutChange: (layout: string) => void;
  onCardSizeChange: (size: string) => void;
  onCardStyleChange: (style: string) => void;
  onTogglePropertiesExpanded: () => void;
}

export function EventsContainerSettings({
  editingField,
  showGroup,
  groupOptions,
  layout,
  cardSize,
  cardStyle,
  propertiesExpanded,
  onFieldClick,
  onFieldBlur,
  onKeyDown,
  onGroupChange,
  onGroupOptionsChange,
  onLayoutChange,
  onCardSizeChange,
  onCardStyleChange,
  onTogglePropertiesExpanded
}: EventsContainerSettingsProps) {
  return (
    <div className="space-y-2">
      <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
        <PropertyRow
          label="Section title"
          value="Events"
          fieldName="sectionTitle"
          type="text"
          onValueChange={() => {}}
          icon={Heading}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
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
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
        />

        <PropertyRow
          label="Group"
          value={showGroup}
          fieldName="featuredGroup"
          type="checkbox"
          onValueChange={onGroupChange}
          icon={Tag}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
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
            onValueChange={onGroupOptionsChange}
            icon={Layers}
            isChild={true}
            editingField={editingField}
            onFieldClick={onFieldClick}
            onFieldBlur={onFieldBlur}
            onKeyDown={onKeyDown}
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
              onClick={() => onLayoutChange(option.value)}
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
              onValueChange={onCardSizeChange}
              icon={
                cardSize === 'small' ? LayoutGrid :
                cardSize === 'medium' ? Grid3x3 :
                cardSize === 'large' ? Grid2X2 :
                RectangleHorizontal
              }
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
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
              onValueChange={onCardStyleChange}
              icon={cardStyle === 'modern' ? Sparkles : FileText}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
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
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
        />
      </div>

      {/* Properties Section */}
      <div className="pt-1 border-t border-gray-50 dark:border-gray-800">
        <button
          onClick={onTogglePropertiesExpanded}
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
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
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
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
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
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
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
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
            />

            <PropertyRow
              label="Tags"
              value={true}
              fieldName="showTags"
              type="checkbox"
              onValueChange={() => {}}
              icon={Hash}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
            />

            <PropertyRow
              label="Reactions"
              value={true}
              fieldName="showReactions"
              type="checkbox"
              onValueChange={() => {}}
              icon={Hash}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
            />
          </div>
        )}
      </div>
    </div>
  );
} 