import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Shield,
  Upload,
  X,
  Loader2,
  Image,
  Type,
  FileImage,
  Link,
  Eye,
  UserPlus,
  Users,
  ChevronDown,
  LayoutList,
  LayoutGrid,
  Rows3,
  Pin,
  MessageSquare,
  Heart,
  ThumbsUp,
  Hash,
  Calendar,
  User,
  Search,
  Settings,
  Globe,
  Lock,
  Columns,
  ExternalLink,
  MoreHorizontal,
  Crop,
  Heading,
  AlignLeft,
  Smile
} from "lucide-react";
import { Site } from "@/lib/api";
import { useSiteData } from "@/lib/SiteDataContext";

interface SettingsSidebarProps {
  siteSD: string;
  spacesSlug: string;
  activeTab: string;
  siteDetails: Site | null;
  onClose?: () => void;
}

interface PropertyRowProps {
  label: string;
  value: any;
  fieldName: string;
  type?: 'text' | 'textarea' | 'select' | 'upload' | 'checkbox';
  options?: { value: string; label: string }[];
  onValueChange: (value: any) => void;
  placeholder?: string;
  icon?: any;
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

interface CustomDropdownProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
}

function CustomDropdown({ value, options, onChange, placeholder = "Select option" }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-6 text-sm bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 text-right flex items-center justify-end gap-1"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-3 h-3 text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-200 right-0 top-full mt-1 w-48ghesma bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-[99999]">
          <div className="">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                  value === option.value 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                    : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable PropertyRow Component
function PropertyRow({ 
  label, 
  value, 
  fieldName, 
  type = 'text',
  options = [],
  onValueChange,
  placeholder = "Empty",
  icon: Icon,
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown
}: PropertyRowProps) {
  const isEditing = editingField === fieldName;
  const displayValue = value || "Empty";
  const isEmpty = !value;
  const isDescription = fieldName === 'description';
  const isSlug = fieldName === 'slug';

  return (
    <div className={`flex px-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md group transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0 ${
      (isDescription || isSlug) && isEditing ? 'flex-col items-start py-2 space-y-2' : 'items-center justify-between h-9'
    }`}>
      <div className={`text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2 ${
        (isDescription || isSlug) && isEditing ? 'w-full' : 'w-2/5 pr-2'
      }`}>
        {Icon && <Icon className="h-3 w-3 flex-shrink-0" />}
        <span className="truncate text-left">{label}</span>
      </div>
      <div className={`flex justify-end items-center pl-2 ${
        (isDescription || isSlug) && isEditing ? 'w-full' : 'w-3/5 h-full'
      }`}>
        {type === 'text' && (
          <>
            {isEditing ? (
              fieldName === 'slug' ? (
                <div className="w-full flex items-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md h-8">
                  <span className="text-xs text-gray-400 dark:text-gray-500 px-3 border-r border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 rounded-l-md h-full flex items-center">
                    yourdomain/
                  </span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onValueChange(e.target.value)}
                    onBlur={onFieldBlur}
                    onKeyDown={(e) => onKeyDown(e, fieldName)}
                    className="flex-1 h-full text-sm bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 text-left px-2"
                    autoFocus
                    placeholder="url-slug"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onValueChange(e.target.value)}
                  onBlur={onFieldBlur}
                  onKeyDown={(e) => onKeyDown(e, fieldName)}
                  className="w-full h-8 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 outline-none text-gray-900 dark:text-gray-100 text-left"
                  autoFocus
                  placeholder="Enter value..."
                />
              )
            ) : (
              <div
                onClick={() => onFieldClick(fieldName)}
                className={`text-sm cursor-pointer h-6 flex items-center justify-end px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors truncate text-right w-full ${
                  isEmpty ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'
                }`}
                title={fieldName === 'slug' ? `yourdomain/${displayValue}` : displayValue}
              >
                {fieldName === 'slug' && !isEmpty ? (
                  <div className="flex items-center gap-1 truncate">
                    <span className="text-xs text-gray-400 dark:text-gray-500">yourdomain/</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 font-medium">{value}</span>
                  </div>
                ) : (
                  displayValue
                )}
              </div>
            )}
          </>
        )}

        {type === 'textarea' && (
          <>
            {isEditing ? (
              <textarea
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                onBlur={onFieldBlur}
                onKeyDown={(e) => onKeyDown(e, fieldName)}
                className={`w-full text-sm bg-transparent border outline-none text-gray-900 dark:text-gray-100 resize-none rounded-md px-3 py-2 ${
                  isDescription 
                    ? 'h-20 min-h-20 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-left' 
                    : 'h-6 overflow-hidden border-none text-right'
                }`}
                autoFocus
                placeholder={isDescription ? "Enter description..." : ""}
              />
            ) : (
              <div
                onClick={() => onFieldClick(fieldName)}
                className={`text-sm cursor-pointer h-6 flex items-center justify-end px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors truncate text-right w-full ${
                  isEmpty ? 'text-gray-300 dark:text-gray-600' : 'text-gray-900 dark:text-gray-100'
                }`}
                title={displayValue}
              >
                {displayValue}
              </div>
            )}
          </>
        )}

        {type === 'select' && (
          <CustomDropdown
            value={value}
            options={options}
            onChange={onValueChange}
            placeholder="Select option"
          />
        )}

        {type === 'upload' && (
          <div className="flex items-center gap-2 justify-end h-6 w-full">
            {value ? (
              <div className="flex items-center gap-2 h-6">
                <span className="text-sm text-gray-900 dark:text-gray-100 truncate">Uploaded</span>
                <img src={value} alt="" className="w-5 h-5 rounded object-cover flex-shrink-0" />
                <button
                  onClick={() => onValueChange('')}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex-shrink-0"
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      onValueChange(URL.createObjectURL(file));
                    }
                  };
                  input.click();
                }}
                className="text-sm text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer h-6 flex items-center justify-end px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors truncate w-full text-right"
              >
                Empty
              </button>
            )}
          </div>
        )}

        {type === 'checkbox' && (
          <div className="flex items-center justify-end h-6 w-full">
            <div 
              onClick={() => onValueChange(!value)}
              className={`relative inline-flex h-3.5 w-6 items-center rounded-full transition-colors cursor-pointer ${
                value 
                  ? 'bg-primary-600' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <div 
                className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-3' : 'translate-x-0.5'
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface NumberPropertyRowProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  icon?: any;
}

function NumberPropertyRow({ 
  label, 
  value, 
  onValueChange,
  min = 1,
  max = 100,
  icon: Icon
}: NumberPropertyRowProps) {
  const handleIncrement = () => {
    if (value < max) {
      onValueChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onValueChange(value - 1);
    }
  };

  return (
    <div className="flex items-center justify-between h-9 px-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-md group transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      <div className="w-2/5 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2 pr-2">
        {Icon && <Icon className="h-3 w-3 flex-shrink-0" />}
        <span className="truncate text-left">{label}</span>
      </div>
      <div className="w-3/5 flex justify-end items-center h-full pl-2">
        <div className="flex items-center gap-1">
          <button
            onClick={handleDecrement}
            disabled={value <= min}
            className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
          >
            -
          </button>
          <span className="w-8 text-center text-sm text-gray-900 dark:text-gray-100">
            {value}
          </span>
          <button
            onClick={handleIncrement}
            disabled={value >= max}
            className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Settings sidebar component for space settings
 */
export function SettingsSidebar({ 
  siteSD, 
  spacesSlug, 
  activeTab,
  onClose
}: Omit<SettingsSidebarProps, 'siteDetails'>) {
  // Get site details from context
  const { sites } = useSiteData();
  const siteDetails = sites[siteSD] || null;
  
  // Get capitalized space name for display
  const getDisplaySpaceName = () => {
    // Convert from slug to display name (capitalize first letter and replace hyphens with spaces)
    return spacesSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const [name, setName] = useState(getDisplaySpaceName());
  const [description, setDescription] = useState(`Advice and answers from the Tribe Team`);
  const [slug, setSlug] = useState(spacesSlug);
  const [spaceIconUrl, setSpaceIconUrl] = useState("");
  const [spaceBannerUrl, setSpaceBannerUrl] = useState("");
  const [visibility, setVisibility] = useState<string>("public");
  const [inviteOnly, setInviteOnly] = useState(false);
  const [anyoneCanInvite, setAnyoneCanInvite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [layout, setLayout] = useState('grid');

  // Track initial values to detect changes
  const initialValues = {
    name: getDisplaySpaceName(),
    description: `Advice and answers from the Tribe Team`,
    slug: spacesSlug,
    spaceIconUrl: "",
    spaceBannerUrl: "",
    visibility: "public",
    inviteOnly: false,
    anyoneCanInvite: false
  };

  // Check if there are any changes
  const checkForChanges = () => {
    const currentValues = {
      name,
      description,
      slug,
      spaceIconUrl,
      spaceBannerUrl,
      visibility,
      inviteOnly,
      anyoneCanInvite
    };
    
    const changed = JSON.stringify(currentValues) !== JSON.stringify(initialValues);
    setHasChanges(changed);
  };

  // Use effect to check for changes whenever state updates
  useEffect(() => {
    checkForChanges();
  }, [name, description, slug, spaceIconUrl, spaceBannerUrl, visibility, inviteOnly, anyoneCanInvite]);

  // Wrapper functions to trigger change detection
  const handleNameChange = (value: string) => {
    setName(value);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
  };

  const handleSlugChange = (value: string) => {
    setSlug(value);
  };

  const handleSpaceIconUrlChange = (value: string) => {
    setSpaceIconUrl(value);
  };

  const handleSpaceBannerUrlChange = (value: string) => {
    setSpaceBannerUrl(value);
  };

  const handleVisibilityChange = (value: string) => {
    setVisibility(value);
  };

  const handleInviteOnlyChange = (value: boolean) => {
    setInviteOnly(value);
  };

  const handleAnyoneCanInviteChange = (value: boolean) => {
    setAnyoneCanInvite(value);
  };

  // Get the title for the current tab
  const getTabTitle = () => {
    switch(activeTab) {
      case 'general': return 'General settings';
      case 'permissions': return 'Permissions Settings';
      case 'seo': return 'SEO Settings';
      case 'display': return 'Display Settings';
      case 'customize': return 'Customize Settings';
      case 'danger': return 'Danger Zone';
      default: return 'Settings';
    }
  };

  // Render form content based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'general':
        return <GeneralSettingsTab 
          name={name}
          setName={handleNameChange}
          description={description}
          setDescription={handleDescriptionChange}
          slug={slug}
          setSlug={handleSlugChange}
          spaceIconUrl={spaceIconUrl}
          setSpaceIconUrl={handleSpaceIconUrlChange}
          spaceBannerUrl={spaceBannerUrl}
          setSpaceBannerUrl={handleSpaceBannerUrlChange}
          visibility={visibility}
          setVisibility={handleVisibilityChange}
          inviteOnly={inviteOnly}
          setInviteOnly={handleInviteOnlyChange}
          anyoneCanInvite={anyoneCanInvite}
          setAnyoneCanInvite={handleAnyoneCanInviteChange}
          isLoading={isLoading}
        />;
      case 'permissions':
        return <PermissionsSettingsTab />;
      case 'seo':
        return <SEOSettingsTab />;
      case 'display':
        return <DisplaySettingsTab />;
      case 'customize':
        return <CustomizeSettingsTab />;
      default:
        return (
          <div className="py-6 px-2 text-center text-gray-500 dark:text-gray-400">
            Select settings from the sidebar to configure this space.
          </div>
        );
    }
  };

  return (
    <div className="w-80 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 dark:scrollbar-thumb-gray-700 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 flex flex-col">
      <div className="p-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-sm font-medium text-gray-900 dark:text-white">{getTabTitle()}</h2>
        </div>
        <div className="flex items-center">

          <button
            type="button"
            className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
              !hasChanges || isLoading 
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                : 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
            }`}
            disabled={!hasChanges || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin inline" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="h-3 w-3" />
          </button> 
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin ">
        <div className="p-2">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

interface GeneralSettingsTabProps {
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  slug: string;
  setSlug: (value: string) => void;
  spaceIconUrl: string;
  setSpaceIconUrl: (value: string) => void;
  spaceBannerUrl: string;
  setSpaceBannerUrl: (value: string) => void;
  visibility: string;
  setVisibility: (value: string) => void;
  inviteOnly: boolean;
  setInviteOnly: (value: boolean) => void;
  anyoneCanInvite: boolean;
  setAnyoneCanInvite: (value: boolean) => void;
  isLoading: boolean;
}

function GeneralSettingsTab({
  name,
  setName,
  description,
  setDescription,
  slug,
  setSlug,
  spaceIconUrl,
  setSpaceIconUrl,
  spaceBannerUrl,
  setSpaceBannerUrl,
  visibility,
  setVisibility,
  inviteOnly,
  setInviteOnly,
  anyoneCanInvite,
  setAnyoneCanInvite,
  isLoading
}: GeneralSettingsTabProps) {
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleFieldClick = (fieldName: string) => {
    setEditingField(fieldName);
  };

  const handleFieldBlur = () => {
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, fieldName: string) => {
    if (e.key === 'Enter') {
      setEditingField(null);
    }
    if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  return (
    <div className="space-y-0">
      <PropertyRow
        label="Icon"
        value={spaceIconUrl}
        fieldName="icon"
        type="upload"
        onValueChange={setSpaceIconUrl}
        placeholder="Upload icon"
        icon={Image}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="Name"
        value={name}
        fieldName="name"
        type="text"
        onValueChange={setName}
        placeholder="Enter name"
        icon={Heading}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="Description"
        value={description}
        fieldName="description"
        type="textarea"
        onValueChange={setDescription}
        placeholder="Enter description"
        icon={AlignLeft}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="Banner"
        value={spaceBannerUrl}
        fieldName="banner"
        type="upload"
        onValueChange={setSpaceBannerUrl}
        placeholder="Upload banner"
        icon={FileImage}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="URL Slug"
        value={slug}
        fieldName="slug"
        type="text"
        onValueChange={setSlug}
        placeholder="Enter slug"
        icon={Link}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="Visibility"
        value={visibility}
        fieldName="visibility"
        type="select"
        options={[
          { value: 'public', label: 'Public' },
          { value: 'private', label: 'Private' }
        ]}
        onValueChange={setVisibility}
        icon={visibility === 'public' ? Globe : Lock}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="Invite Only"
        value={inviteOnly}
        fieldName="inviteOnly"
        type="checkbox"
        onValueChange={setInviteOnly}
        icon={UserPlus}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="Anyone Invite"
        value={anyoneCanInvite}
        fieldName="anyoneCanInvite"
        type="checkbox"
        onValueChange={setAnyoneCanInvite}
        icon={Users}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

function PermissionsSettingsTab() {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [whoCanPost, setWhoCanPost] = useState('all');
  const [whoCanReply, setWhoCanReply] = useState('all');
  const [whoCanReact, setWhoCanReact] = useState('all');
  const [moderationEnabled, setModerationEnabled] = useState(false);
  const [autoApprove, setAutoApprove] = useState(true);

  const handleFieldClick = (fieldName: string) => {
    setEditingField(fieldName);
  };

  const handleFieldBlur = () => {
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, fieldName: string) => {
    if (e.key === 'Enter') {
      setEditingField(null);
    }
    if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  return (
    <div className="space-y-0">
      <PropertyRow
        label="Who Can Post"
        value={whoCanPost}
        fieldName="whoCanPost"
        type="select"
        options={[
          { value: 'all', label: 'All members' },
          { value: 'space_members', label: 'Space members, space admins, and staff' },
          { value: 'space_admins', label: 'Space admins and staff' },
          { value: 'nobody', label: 'Nobody' }
        ]}
        onValueChange={setWhoCanPost}
        icon={FileText}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="Who Can Reply"
        value={whoCanReply}
        fieldName="whoCanReply"
        type="select"
        options={[
          { value: 'all', label: 'All members' },
          { value: 'space_members', label: 'Space members, space admins, and staff' },
          { value: 'space_admins', label: 'Space admins and staff' },
          { value: 'nobody', label: 'Nobody' }
        ]}
        onValueChange={setWhoCanReply}
        icon={MessageSquare}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="Who Can React"
        value={whoCanReact}
        fieldName="whoCanReact"
        type="select"
        options={[
          { value: 'all', label: 'All members' },
          { value: 'space_members', label: 'Space members, space admins, and staff' },
          { value: 'space_admins', label: 'Space admins and staff' },
          { value: 'nobody', label: 'Nobody' }
        ]}
        onValueChange={setWhoCanReact}
        icon={Heart}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="Moderation"
        value={moderationEnabled}
        fieldName="moderation"
        type="checkbox"
        onValueChange={setModerationEnabled}
        icon={Shield}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="Auto Approve"
        value={autoApprove}
        fieldName="autoApprove"
        type="checkbox"
        onValueChange={setAutoApprove}
        icon={ThumbsUp}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

function SEOSettingsTab() {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [indexable, setIndexable] = useState(true);

  const handleFieldClick = (fieldName: string) => {
    setEditingField(fieldName);
  };

  const handleFieldBlur = () => {
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, fieldName: string) => {
    if (e.key === 'Enter') {
      setEditingField(null);
    }
    if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  return (
    <div className="space-y-0">
      <PropertyRow
        label="Meta Title"
        value={metaTitle}
        fieldName="metaTitle"
        type="text"
        onValueChange={setMetaTitle}
        placeholder="Enter meta title"
        icon={Heading}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="Meta Description"
        value={metaDescription}
        fieldName="metaDescription"
        type="textarea"
        onValueChange={setMetaDescription}
        placeholder="Enter meta description"
        icon={AlignLeft}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="Keywords"
        value={keywords}
        fieldName="keywords"
        type="text"
        onValueChange={setKeywords}
        placeholder="Enter keywords"
        icon={Hash}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="OG Image"
        value={ogImage}
        fieldName="ogImage"
        type="upload"
        onValueChange={setOgImage}
        placeholder="Upload OG image"
        icon={Image}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="Search Indexable"
        value={indexable}
        fieldName="indexable"
        type="checkbox"
        onValueChange={setIndexable}
        icon={Search}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

function DisplaySettingsTab() {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [layout, setLayout] = useState('grid');
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [showAuthor, setShowAuthor] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showTags, setShowTags] = useState(true);
  const [cardSize, setCardSize] = useState('medium');
  const [openPageIn, setOpenPageIn] = useState('post_page');
  const [showMore, setShowMore] = useState(true);
  const [cardCover, setCardCover] = useState(true);
  const [fitCover, setFitCover] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [showExcerpt, setShowExcerpt] = useState(true);
  const [showReactions, setShowReactions] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [propertiesExpanded, setPropertiesExpanded] = useState(false);

  const handleFieldClick = (fieldName: string) => {
    setEditingField(fieldName);
  };

  const handleFieldBlur = () => {
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, fieldName: string) => {
    if (e.key === 'Enter') {
      setEditingField(null);
    }
    if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  const layoutOptions = [
    { value: 'grid', label: 'Grid', icon: LayoutGrid },
    { value: 'list', label: 'List', icon: LayoutList },
    { value: 'feed', label: 'Feed', icon: Rows3 }
  ];

  const renderPropertiesSection = () => (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
      <button
        onClick={() => setPropertiesExpanded(!propertiesExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        <span>Properties</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${propertiesExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {propertiesExpanded && (
        <div className="space-y-0">
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
  );

  return (
    <div className="space-y-4">
      {/* Visual Layout Selector */}
      <div>
        <div className="grid grid-cols-3 gap-2 px-3">
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
      <div className="space-y-0">
        {/* Grid specific settings */}
        {layout === 'grid' && (
          <>
            <PropertyRow
              label="Card size"
              value={cardSize}
              fieldName="cardSize"
              type="select"
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
                { value: 'extra_large', label: 'Extra Large' }
              ]}
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
              options={[
                { value: 'modal_content', label: 'Modal content' },
                { value: 'post_page', label: 'Post page' }
              ]}
              onValueChange={setOpenPageIn}
              icon={ExternalLink}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
            />

            <NumberPropertyRow
              label="Number of posts per page"
              value={postsPerPage}
              onValueChange={setPostsPerPage}
              min={1}
              max={100}
              icon={Hash}
            />

            <PropertyRow
              label='Display "Show more"'
              value={showMore}
              fieldName="showMore"
              type="checkbox"
              onValueChange={setShowMore}
              icon={MoreHorizontal}
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
              />
            )}

            {/* Properties Section for Grid */}
            {renderPropertiesSection()}
          </>
        )}

        {/* List specific settings */}
        {layout === 'list' && (
          <>
            <PropertyRow
              label="Open page in"
              value={openPageIn}
              fieldName="openPageIn"
              type="select"
              options={[
                { value: 'modal_content', label: 'Modal content' },
                { value: 'post_page', label: 'Post page' }
              ]}
              onValueChange={setOpenPageIn}
              icon={ExternalLink}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
            />

            <NumberPropertyRow
              label="Number of posts per page"
              value={postsPerPage}
              onValueChange={setPostsPerPage}
              min={1}
              max={100}
              icon={Hash}
            />

            <PropertyRow
              label='Display "Show more"'
              value={showMore}
              fieldName="showMore"
              type="checkbox"
              onValueChange={setShowMore}
              icon={MoreHorizontal}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
            />

            {/* Properties Section for List */}
            {renderPropertiesSection()}
          </>
        )}

        {/* Feed specific settings */}
        {layout === 'feed' && (
          <>
            <PropertyRow
              label="Open page in"
              value={openPageIn}
              fieldName="openPageIn"
              type="select"
              options={[
                { value: 'modal_content', label: 'Modal content' },
                { value: 'post_page', label: 'Post page' }
              ]}
              onValueChange={setOpenPageIn}
              icon={ExternalLink}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
            />

            <NumberPropertyRow
              label="Number of posts per page"
              value={postsPerPage}
              onValueChange={setPostsPerPage}
              min={1}
              max={100}
              icon={Hash}
            />

            <PropertyRow
              label='Display "Show more"'
              value={showMore}
              fieldName="showMore"
              type="checkbox"
              onValueChange={setShowMore}
              icon={MoreHorizontal}
              editingField={editingField}
              onFieldClick={handleFieldClick}
              onFieldBlur={handleFieldBlur}
              onKeyDown={handleKeyDown}
            />

            {/* Properties Section for Feed */}
            {renderPropertiesSection()}
          </>
        )}
      </div>
    </div>
  );
}

function CustomizeSettingsTab() {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [pinPost, setPinPost] = useState(false);
  const [enableComments, setEnableComments] = useState(true);
  const [enableReactions, setEnableReactions] = useState(true);
  const [reactionType, setReactionType] = useState('emoji');

  const handleFieldClick = (fieldName: string) => {
    setEditingField(fieldName);
  };

  const handleFieldBlur = () => {
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, fieldName: string) => {
    if (e.key === 'Enter') {
      setEditingField(null);
    }
    if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  return (
    <div className="space-y-0">
      <PropertyRow
        label="Pin post"
        value={pinPost}
        fieldName="pinPost"
        type="checkbox"
        onValueChange={setPinPost}
        icon={Pin}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="Comment"
        value={enableComments}
        fieldName="enableComments"
        type="checkbox"
        onValueChange={setEnableComments}
        icon={MessageSquare}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="Reaction"
        value={enableReactions}
        fieldName="enableReactions"
        type="checkbox"
        onValueChange={setEnableReactions}
        icon={Heart}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      {enableReactions && (
        <PropertyRow
          label="Reaction type"
          value={reactionType}
          fieldName="reactionType"
          type="select"
          options={[
            { value: 'emoji', label: 'Emoji' },
            { value: 'upvote_downvote', label: 'Up vote down vote' },
            { value: 'simple_like', label: 'Simple like' }
          ]}
          onValueChange={setReactionType}
          icon={Smile}
          editingField={editingField}
          onFieldClick={handleFieldClick}
          onFieldBlur={handleFieldBlur}
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
} 