import React, { useState, useEffect } from 'react';
import { 
  Palette,
  Square,
  Image,
  Video,
  Grid3x3,
  Type,
  FileText,
  BarChart3,
  Users,
  Settings,
  MousePointer,
  Plus,
  UserPlus,
  Bell,
  Search,
  Share,
  MoreHorizontal,
  Zap
} from 'lucide-react';
import { PropertyRow } from '../PropertyRow';

interface SpaceHeaderSettingsProps {
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
  onSettingsChange?: (settings: SpaceHeaderSettings) => void;
}

interface SpaceHeaderSettings {
  selectedStyle: string;
  backgroundFile: string;
  showIcon: boolean;
  showTitle: boolean;
  showDescription: boolean;
  showStats: boolean;
  showMembers: boolean;
  showActions: boolean;
  showAddPost: boolean;
  showJoin: boolean;
  showNotifications: boolean;
  showSearch: boolean;
  showShare: boolean;
  showOptions: boolean;
}

export function SpaceHeaderSettings({
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown,
  onSettingsChange
}: SpaceHeaderSettingsProps) {
  const [selectedStyle, setSelectedStyle] = useState('simple');
  const [backgroundFile, setBackgroundFile] = useState('');
  const [showActions, setShowActions] = useState(true);
  const [showAddPost, setShowAddPost] = useState(true);
  const [showJoin, setShowJoin] = useState(true);
  const [showNotifications, setShowNotifications] = useState(true);
  const [showSearch, setShowSearch] = useState(true);
  const [showShare, setShowShare] = useState(true);
  const [showOptions, setShowOptions] = useState(true);
  const [showIcon, setShowIcon] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showDescription, setShowDescription] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [showMembers, setShowMembers] = useState(true);

  // Set sample data for different styles
  useEffect(() => {
    let sampleData = '';
    
    switch (selectedStyle) {
      case 'imagestyle':
        sampleData = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop';
        break;
      case 'videostyle':
        sampleData = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
        break;
      case 'patternstyle':
        sampleData = 'pattern-dots';
        break;
      case 'gradientstyle':
        sampleData = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        break;
      default:
        sampleData = '';
    }
    
    setBackgroundFile(sampleData);
  }, [selectedStyle]);

  // Notify parent component about settings changes
  useEffect(() => {
    if (onSettingsChange) {
      const settings = {
        selectedStyle,
        backgroundFile,
        showIcon,
        showTitle,
        showDescription,
        showStats,
        showMembers,
        showActions,
        showAddPost,
        showJoin,
        showNotifications,
        showSearch,
        showShare,
        showOptions
      };
      onSettingsChange(settings);
    }
  }, [
    selectedStyle,
    backgroundFile,
    showIcon,
    showTitle,
    showDescription,
    showStats,
    showMembers,
    showActions,
    showAddPost,
    showJoin,
    showNotifications,
    showSearch,
    showShare,
    showOptions,
    onSettingsChange
  ]);

  return (
    <div className="space-y-2">
      <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
        {/* Style Selector - 6 options in a 4x2 grid */}
        <div className="mb-4">
          <div className="grid grid-cols-4 gap-2 px-2">
            {[
              { value: 'simple', label: 'Simple', icon: Square },
              { value: 'colorstyle', label: 'Color', icon: Palette },
              { value: 'imagestyle', label: 'Image', icon: Image },
              { value: 'videostyle', label: 'Video', icon: Video },
              { value: 'patternstyle', label: 'Pattern', icon: Grid3x3 },
              { value: 'gradientstyle', label: 'Gradient', icon: Zap }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStyle(option.value)}
                className={`flex flex-col items-center justify-center aspect-square p-1 rounded-lg border-2 transition-all ${
                  selectedStyle === option.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <option.icon className={`w-4 h-4 mb-1 ${
                  selectedStyle === option.value 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-400 dark:text-gray-500'
                }`} />
                <span className={`text-xs text-center ${
                  selectedStyle === option.value 
                    ? 'text-primary-600 dark:text-primary-400 font-medium' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Background Upload for Image/Video styles */}
        {(selectedStyle === 'imagestyle' || selectedStyle === 'videostyle') && (
          <PropertyRow
            label="Background"
            value={backgroundFile}
            fieldName="spaceHeaderBackground"
            type="upload"
            onValueChange={setBackgroundFile}
            icon={selectedStyle === 'imagestyle' ? Image : Video}
            editingField={editingField}
            onFieldClick={onFieldClick}
            onFieldBlur={onFieldBlur}
            onKeyDown={onKeyDown}
            description={`Upload ${selectedStyle === 'imagestyle' ? 'image' : 'video'} for background`}
          />
        )}

        

        <PropertyRow
          label="Icon"
          value={showIcon}
          fieldName="spaceHeaderShowIcon"
          type="checkbox"
          onValueChange={setShowIcon}
          icon={Settings}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show space icon in header"
        />

        <PropertyRow
          label="Title"
          value={showTitle}
          fieldName="spaceHeaderShowTitle"
          type="checkbox"
          onValueChange={setShowTitle}
          icon={Type}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show space title in header"
        />

        <PropertyRow
          label="Description"
          value={showDescription}
          fieldName="spaceHeaderShowDescription"
          type="checkbox"
          onValueChange={setShowDescription}
          icon={FileText}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show space description in header"
        />

        <PropertyRow
          label="Stats"
          value={showStats}
          fieldName="spaceHeaderShowStats"
          type="checkbox"
          onValueChange={setShowStats}
          icon={BarChart3}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show space statistics in header"
        />

        <PropertyRow
          label="Members"
          value={showMembers}
          fieldName="spaceHeaderShowMembers"
          type="checkbox"
          onValueChange={setShowMembers}
          icon={Users}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show member count in header"
        />

        <PropertyRow
          label="Actions"
          value={showActions}
          fieldName="spaceHeaderShowActions"
          type="checkbox"
          onValueChange={setShowActions}
          icon={MousePointer}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show action buttons in header"
        />

        {showActions && (
          <>
            <PropertyRow
              label="Add post"
              value={showAddPost}
              fieldName="spaceHeaderShowAddPost"
              type="checkbox"
              onValueChange={setShowAddPost}
              icon={Plus}
              isChild={true}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Show add post button"
            />

            <PropertyRow
              label="Join"
              value={showJoin}
              fieldName="spaceHeaderShowJoin"
              type="checkbox"
              onValueChange={setShowJoin}
              icon={UserPlus}
              isChild={true}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Show join button"
            />

            <PropertyRow
              label="Notifications"
              value={showNotifications}
              fieldName="spaceHeaderShowNotifications"
              type="checkbox"
              onValueChange={setShowNotifications}
              icon={Bell}
              isChild={true}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Show notifications button"
            />

            <PropertyRow
              label="Search"
              value={showSearch}
              fieldName="spaceHeaderShowSearch"
              type="checkbox"
              onValueChange={setShowSearch}
              icon={Search}
              isChild={true}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Show search button"
            />

            <PropertyRow
              label="Share"
              value={showShare}
              fieldName="spaceHeaderShowShare"
              type="checkbox"
              onValueChange={setShowShare}
              icon={Share}
              isChild={true}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Show share button"
            />

            <PropertyRow
              label="Options"
              value={showOptions}
              fieldName="spaceHeaderShowOptions"
              type="checkbox"
              onValueChange={setShowOptions}
              icon={MoreHorizontal}
              isChild={true}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Show options menu"
            />
          </>
        )}
      </div>
    </div>
  );
} 