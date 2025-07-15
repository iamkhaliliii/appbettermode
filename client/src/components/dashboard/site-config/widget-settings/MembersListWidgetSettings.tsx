import React, { useState } from 'react';
import { 
  Users,
  User,
  Grid3x3,
  LayoutList,
  LayoutGrid,
  Star,
  Clock,
  UserPlus,
  TrendingUp,
  AlignLeft,
  Maximize,
  Square,
  Minimize,
  Eye,
  EyeOff,
  ChevronRight,
  Settings,
  MessageSquare,
  UserCircle,
  Info,
  Award,
  MoreHorizontal,
  Shield,
  Infinity,
  Play,
  Type,
  FileText
} from 'lucide-react';
import { PropertyRow } from '../PropertyRow';

interface MembersListWidgetSettingsProps {
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

export function MembersListWidgetSettings({
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown
}: MembersListWidgetSettingsProps) {
  const [displayType, setDisplayType] = useState('all');
  const [title, setTitle] = useState('Members');
  const [description, setDescription] = useState('');
  const [layout, setLayout] = useState('card');
  const [sortBy, setSortBy] = useState('recent');
  const [maxMembers, setMaxMembers] = useState('20');
  const [cardSize, setCardSize] = useState('medium');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showMessageButton, setShowMessageButton] = useState(false);
  const [showMemberAvatar, setShowMemberAvatar] = useState(true);
  const [showMemberInfo, setShowMemberInfo] = useState(true);
  const [showMemberBadge, setShowMemberBadge] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [showAdminsStaff, setShowAdminsStaff] = useState(true);
  const [infinitySlide, setInfinitySlide] = useState(false);
  const [autoSlide, setAutoSlide] = useState(false);

  return (
    <div className="space-y-2">
      <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
        <PropertyRow
          label="Title"
          value={title}
          fieldName="membersTitle"
          type="text"
          onValueChange={setTitle}
          icon={Type}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Display title for the members list"
        />

        <PropertyRow
          label="Description"
          value={description}
          fieldName="membersDescription"
          type="text"
          onValueChange={setDescription}
          icon={FileText}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Optional description for the members list"
        />

        <PropertyRow
          label="List Source"
          value={displayType}
          fieldName="membersListSource"
          type="select"
          options={[
            { value: 'all', label: 'All Site members', icon: Users },
            { value: 'current', label: 'Current Space Members', icon: User },
            { value: 'customize', label: 'Customize', icon: Settings }
          ]}
          onValueChange={setDisplayType}
          icon={Users}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Select the source of members to display"
        />

        <PropertyRow
          label="Show Admins and Staff"
          value={showAdminsStaff}
          fieldName="membersShowAdminsStaff"
          type="checkbox"
          onValueChange={setShowAdminsStaff}
          icon={Shield}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Display admin and staff members prominently"
        />

        {displayType === 'customize' && (
          <PropertyRow
            label="Select Members"
            value={selectedMembers}
            fieldName="customMembers"
            type="users"
            onValueChange={setSelectedMembers}
            icon={UserPlus}
            isChild={true}
            editingField={editingField}
            onFieldClick={onFieldClick}
            onFieldBlur={onFieldBlur}
            onKeyDown={onKeyDown}
            description="Choose specific members to display"
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
            fieldName="membersCardSize"
            type="select"
            options={[
              { 
                value: 'small', 
                label: 'Small',
                description: 'Compact cards with minimal member info (4 per row)',
                icon: Minimize
              },
              { 
                value: 'medium', 
                label: 'Medium',
                description: 'Balanced size with good member visibility (3 per row)',
                icon: Square
              },
              { 
                value: 'large', 
                label: 'Large',
                description: 'Spacious cards with detailed member info (2 per row)',
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
              fieldName="membersCarouselCardSize"
              type="select"
              options={[
                { 
                  value: '2', 
                  label: '2 Items',
                  description: 'Large member cards with more details',
                  icon: Square
                },
                { 
                  value: '3', 
                  label: '3 Items',
                  description: 'Balanced member cards display',
                  icon: Grid3x3
                },
                { 
                  value: '4', 
                  label: '4 Items',
                  description: 'Compact member cards view',
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
              fieldName="membersInfinitySlide"
              type="checkbox"
              onValueChange={setInfinitySlide}
              icon={Infinity}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Enable infinite scrolling through member cards"
            />

            <PropertyRow
              label="Auto Slide"
              value={autoSlide}
              fieldName="membersAutoSlide"
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
          fieldName="membersSortBy"
          type="select"
          options={[
            { value: 'recent', label: 'Recently Joined', icon: Clock },
            { value: 'alphabetical', label: 'Alphabetical', icon: AlignLeft },
            { value: 'activity', label: 'Most Active', icon: TrendingUp },
            { value: 'contributions', label: 'Top Contributors', icon: Star }
          ]}
          onValueChange={setSortBy}
          icon={Clock}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
        />

        <PropertyRow
          label="Max Members"
          value={maxMembers}
          fieldName="membersMaxCount"
          type="select"
          options={[
            { value: '10', label: '10 Members', icon: Users },
            { value: '20', label: '20 Members', icon: Users },
            { value: '50', label: '50 Members', icon: Users },
            { value: '100', label: '100 Members', icon: Users },
            { value: 'unlimited', label: 'Unlimited', icon: Users }
          ]}
          onValueChange={setMaxMembers}
          icon={Users}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Maximum number of members to display"
        />

        <PropertyRow
          label='Display "Show more"'
          value={showMore}
          fieldName="membersShowMore"
          type="checkbox"
          onValueChange={setShowMore}
          icon={MoreHorizontal}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show 'Show more' button to load additional members"
        />

        <PropertyRow
          label="Message button"
          value={showMessageButton}
          fieldName="membersShowMessageButton"
          type="checkbox"
          onValueChange={setShowMessageButton}
          icon={MessageSquare}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show message button for contacting members"
        />

        <PropertyRow
          label="Member avatar"
          value={showMemberAvatar}
          fieldName="membersShowAvatar"
          type="checkbox"
          onValueChange={setShowMemberAvatar}
          icon={UserCircle}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show member profile pictures"
        />

        <PropertyRow
          label="Member info"
          value={showMemberInfo}
          fieldName="membersShowInfo"
          type="checkbox"
          onValueChange={setShowMemberInfo}
          icon={Info}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show member name and additional information"
        />

        <PropertyRow
          label="Member Badge"
          value={showMemberBadge}
          fieldName="membersShowBadge"
          type="checkbox"
          onValueChange={setShowMemberBadge}
          icon={Award}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show member achievement badges and status"
        />
      </div>
    </div>
  );
} 