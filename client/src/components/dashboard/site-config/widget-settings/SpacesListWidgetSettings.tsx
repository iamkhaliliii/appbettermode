import React, { useState } from 'react';
import { 
  Layers,
  Folder,
  Grid3x3,
  LayoutList,
  LayoutGrid,
  Star,
  Clock,
  TrendingUp,
  Users,
  MessageSquare,
  Settings,
  AlignLeft,
  Maximize,
  Square,
  Minimize,
  Image,
  FileText,
  BarChart3,
  Eye,
  EyeOff,
  ChevronRight,
  Type,
  FolderOpen,
  UserPlus,
  Hash,
  Plus,
  MoreHorizontal,
  Infinity,
  Play
} from 'lucide-react';
import { PropertyRow } from '../PropertyRow';

interface SpacesListWidgetSettingsProps {
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

export function SpacesListWidgetSettings({
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown
}: SpacesListWidgetSettingsProps) {
  const [title, setTitle] = useState('Spaces');
  const [description, setDescription] = useState('');
  const [source, setSource] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState('');
  const [selectedSpaces, setSelectedSpaces] = useState<string[]>([]);
  const [layout, setLayout] = useState('card');
  const [sortBy, setSortBy] = useState('alphabetical');
  const [cardSize, setCardSize] = useState('medium');
  const [maxSpaces, setMaxSpaces] = useState('unlimited');
  const [showIcon, setShowIcon] = useState(true);
  const [showSpaceSummary, setShowSpaceSummary] = useState(true);
  const [showMembersCount, setShowMembersCount] = useState(true);
  const [showPostsCount, setShowPostsCount] = useState(true);
  const [showJoinButton, setShowJoinButton] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [showDescription, setShowDescription] = useState(true);
  const [infinitySlide, setInfinitySlide] = useState(false);
  const [autoSlide, setAutoSlide] = useState(false);

  return (
    <div className="space-y-2">
      <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
        <PropertyRow
          label="Title"
          value={title}
          fieldName="spacesTitle"
          type="text"
          onValueChange={setTitle}
          icon={Type}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Display title for the spaces list"
        />

        <PropertyRow
          label="Description"
          value={description}
          fieldName="spacesDescription"
          type="text"
          onValueChange={setDescription}
          icon={FileText}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Optional description for the spaces list"
        />

        <PropertyRow
          label="Source"
          value={source}
          fieldName="spacesSource"
          type="select"
          options={[
            { value: 'all', label: 'All Spaces', icon: Layers },
            { value: 'folder', label: 'Folder Spaces', icon: FolderOpen },
            { value: 'custom', label: 'Custom', icon: Settings }
          ]}
          onValueChange={setSource}
          icon={Layers}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Select the source of spaces to display"
        />

        {source === 'folder' && (
          <PropertyRow
            label="Select Folder"
            value={selectedFolder}
            fieldName="selectedFolder"
            type="select"
            options={[
              { value: 'general', label: 'General', icon: Folder },
              { value: 'support', label: 'Support', icon: Folder },
              { value: 'feedback', label: 'Feedback', icon: Folder }
            ]}
            onValueChange={setSelectedFolder}
            icon={Folder}
            isChild={true}
            editingField={editingField}
            onFieldClick={onFieldClick}
            onFieldBlur={onFieldBlur}
            onKeyDown={onKeyDown}
            description="Choose a folder to display spaces from"
          />
        )}

        {source === 'custom' && (
          <PropertyRow
            label="Select Spaces"
            value={selectedSpaces}
            fieldName="customSpaces"
            type="multiselect"
            onValueChange={setSelectedSpaces}
            icon={Layers}
            isChild={true}
            editingField={editingField}
            onFieldClick={onFieldClick}
            onFieldBlur={onFieldBlur}
            onKeyDown={onKeyDown}
            description="Choose specific spaces to display"
          />
        )}

      </div>

      {/* Visual Layout Selector */}
      <div>
        <div className="grid grid-cols-3 gap-2 px-2">
          {[
            { value: 'card', label: 'Card', icon: LayoutGrid },
            { value: 'list', label: 'List', icon: LayoutList },
            { value: 'carousel', label: 'Carousel', icon: ChevronRight }
          ].map((option) => (
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
        {/* Card-specific settings */}
        {layout === 'card' && (
          <PropertyRow
            label="Card size"
            value={cardSize}
            fieldName="spacesCardSize"
            type="select"
            options={[
              { 
                value: 'small', 
                label: 'Small',
                description: 'Compact cards with minimal space info (4 per row)',
                icon: Minimize
              },
              { 
                value: 'medium', 
                label: 'Medium',
                description: 'Balanced size with good space visibility (3 per row)',
                icon: Square
              },
              { 
                value: 'large', 
                label: 'Large',
                description: 'Spacious cards with detailed space info (2 per row)',
                icon: Maximize
              }
            ]}
            onValueChange={setCardSize}
            icon={
              cardSize === 'small' ? Minimize :
              cardSize === 'medium' ? Square :
              Maximize
            }
            editingField={editingField}
            onFieldClick={onFieldClick}
            onFieldBlur={onFieldBlur}
            onKeyDown={onKeyDown}
          />
        )}

        {/* Carousel-specific settings */}
        {layout === 'carousel' && (
          <>
            <PropertyRow
              label="CardSize"
              value="3"
              fieldName="spacesCardSize"
              type="select"
              options={[
                { 
                  value: '2', 
                  label: '2 Items',
                  description: 'Large space cards with more details',
                  icon: Square
                },
                { 
                  value: '3', 
                  label: '3 Items',
                  description: 'Balanced space cards display',
                  icon: Grid3x3
                },
                { 
                  value: '4', 
                  label: '4 Items',
                  description: 'Compact space cards view',
                  icon: LayoutGrid
                }
              ]}
              onValueChange={() => {}}
              icon={Grid3x3}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
            />

            <PropertyRow
              label="Infinity slide"
              value={infinitySlide}
              fieldName="spacesInfinitySlide"
              type="checkbox"
              onValueChange={setInfinitySlide}
              icon={Infinity}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Enable infinite scrolling through space cards"
            />

            <PropertyRow
              label="Auto Slide"
              value={autoSlide}
              fieldName="spacesAutoSlide"
              type="checkbox"
              onValueChange={setAutoSlide}
              icon={Play}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Automatically advance to next slide"
            />
          </>
        )}

        {/* Common settings for all layouts */}
        <PropertyRow
          label="Sort By"
          value={sortBy}
          fieldName="spacesSortBy"
          type="select"
          options={[
            { value: 'alphabetical', label: 'Alphabetical', icon: AlignLeft },
            { value: 'activity', label: 'Most Active', icon: TrendingUp },
            { value: 'posts', label: 'Most Posts', icon: MessageSquare },
            { value: 'members', label: 'Most Members', icon: Users },
            { value: 'recent', label: 'Recently Created', icon: Clock }
          ]}
          onValueChange={setSortBy}
          icon={AlignLeft}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
        />

        <PropertyRow
          label="Max Spaces"
          value={maxSpaces}
          fieldName="spacesMaxCount"
          type="select"
          options={[
            { value: '6', label: '6 Spaces', icon: Layers },
            { value: '12', label: '12 Spaces', icon: Layers },
            { value: '24', label: '24 Spaces', icon: Layers },
            { value: '50', label: '50 Spaces', icon: Layers },
            { value: 'unlimited', label: 'Unlimited', icon: Layers }
          ]}
          onValueChange={setMaxSpaces}
          icon={Layers}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Maximum number of spaces to display"
        />

        <PropertyRow
          label='Display "Show more"'
          value={showMore}
          fieldName="spacesShowMore"
          type="checkbox"
          onValueChange={setShowMore}
          icon={MoreHorizontal}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show 'Show more' button to load additional spaces"
        />

        <PropertyRow
          label="Icon"
          value={showIcon}
          fieldName="spacesShowIcon"
          type="checkbox"
          onValueChange={setShowIcon}
          icon={Image}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show space icons/images"
        />

        <PropertyRow
          label="Space summary"
          value={showSpaceSummary}
          fieldName="spacesShowSummary"
          type="checkbox"
          onValueChange={setShowSpaceSummary}
          icon={FileText}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show space descriptions and summaries"
        />

        <PropertyRow
          label="Members count"
          value={showMembersCount}
          fieldName="spacesShowMembersCount"
          type="checkbox"
          onValueChange={setShowMembersCount}
          icon={Users}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show number of members in each space"
        />

        <PropertyRow
          label="Posts count"
          value={showPostsCount}
          fieldName="spacesShowPostsCount"
          type="checkbox"
          onValueChange={setShowPostsCount}
          icon={Hash}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show number of posts in each space"
        />

        <PropertyRow
          label="Join button"
          value={showJoinButton}
          fieldName="spacesShowJoinButton"
          type="checkbox"
          onValueChange={setShowJoinButton}
          icon={Plus}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show join button for each space"
        />

        <PropertyRow
          label="Show Statistics"
          value={showStats}
          fieldName="spacesShowStats"
          type="checkbox"
          onValueChange={setShowStats}
          icon={BarChart3}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show post count, member count, and activity stats"
        />

        <PropertyRow
          label="Show Description"
          value={showDescription}
          fieldName="spacesShowDescription"
          type="checkbox"
          onValueChange={setShowDescription}
          icon={FileText}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show space descriptions"
        />
      </div>
    </div>
  );
} 