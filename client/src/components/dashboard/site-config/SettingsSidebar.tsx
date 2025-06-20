import { useState, useEffect } from "react";
import { ArrowLeftToLine, Loader2, PanelLeftClose } from "lucide-react";
import { Site } from "@/lib/api";
import { useSiteData } from "@/lib/SiteDataContext";
import { GeneralSettingsTab } from "./GeneralSettingsTab";
import { WidgetSettingsTab } from "./WidgetSettingsTab";
import { SEOSettingsTab } from "./SEOSettingsTab";
import { DisplaySettingsTab } from "./DisplaySettingsTab";
import { DangerZoneSettingsTab } from "./DangerZoneSettingsTab";
import { MemberManagementTab } from "./MemberManagementTab";

interface Widget {
  id: string;
  name: string;
  icon: any;
  description: string;
}

interface SettingsSidebarProps {
  siteSD: string;
  spacesSlug: string;
  activeTab: string;
  siteDetails: Site | null;
  onClose?: () => void;
  onWidgetHover?: (widget: Widget | null, position: { x: number; y: number }) => void;
  spaceBanner?: boolean;
  setSpaceBanner?: (value: boolean) => void;
  spaceBannerUrl?: string;
  setSpaceBannerUrl?: (value: string) => void;
  hasChanges?: boolean;
  setHasChanges?: (value: boolean) => void;
  isLoading?: boolean;
  onSave?: () => void;
  onDiscard?: () => void;
}

/**
 * Settings sidebar component for space settings
 */
export function SettingsSidebar({ 
  siteSD, 
  spacesSlug, 
  activeTab,
  onClose,
  onWidgetHover,
  spaceBanner: externalSpaceBanner,
  setSpaceBanner: externalSetSpaceBanner,
  spaceBannerUrl: externalSpaceBannerUrl,
  setSpaceBannerUrl: externalSetSpaceBannerUrl,
  hasChanges: externalHasChanges,
  setHasChanges: externalSetHasChanges,
  isLoading: externalIsLoading,
  onSave: externalOnSave,
  onDiscard: externalOnDiscard
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
  const [spaceBanner, setSpaceBanner] = useState(false);
  const [spaceBannerUrl, setSpaceBannerUrl] = useState("");
  const [visibility, setVisibility] = useState<string>("public");
  const [inviteOnly, setInviteOnly] = useState(false);
  const [anyoneCanInvite, setAnyoneCanInvite] = useState(false);
  const [enableComments, setEnableComments] = useState(true);
  const [enableReactions, setEnableReactions] = useState(true);
  const [reactionType, setReactionType] = useState('emoji');
  const [whoCanReply, setWhoCanReply] = useState('all');
  const [whoCanReact, setWhoCanReact] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState('root');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Track initial values to detect changes
  const initialValues = {
    name: getDisplaySpaceName(),
    description: `Advice and answers from the Tribe Team`,
    slug: spacesSlug,
    spaceIconUrl: "",
    spaceBanner: externalSpaceBanner !== undefined ? externalSpaceBanner : false,
    spaceBannerUrl: externalSpaceBannerUrl !== undefined ? externalSpaceBannerUrl : "",
    visibility: "public",
    inviteOnly: false,
    anyoneCanInvite: false,
    enableComments: true,
    enableReactions: true,
    reactionType: 'emoji',
    whoCanReply: 'all',
    whoCanReact: 'all',
    selectedFolder: 'root'
  };

  // Use external state if provided, otherwise use internal state
  const currentSpaceBanner = externalSpaceBanner !== undefined ? externalSpaceBanner : spaceBanner;
  const currentSetSpaceBanner = externalSetSpaceBanner || setSpaceBanner;
  const currentSpaceBannerUrl = externalSpaceBannerUrl !== undefined ? externalSpaceBannerUrl : spaceBannerUrl;
  const currentSetSpaceBannerUrl = externalSetSpaceBannerUrl || setSpaceBannerUrl;
  const currentHasChanges = externalHasChanges !== undefined ? externalHasChanges : hasChanges;
  const currentSetHasChanges = externalSetHasChanges || setHasChanges;
  const currentIsLoading = externalIsLoading !== undefined ? externalIsLoading : isLoading;

  // Detect changes to enable/disable save button
  useEffect(() => {
    const currentValues = {
      name,
      description,
      slug,
      spaceIconUrl,
      spaceBanner: currentSpaceBanner,
      spaceBannerUrl: currentSpaceBannerUrl,
      visibility,
      inviteOnly,
      anyoneCanInvite,
      enableComments,
      enableReactions,
      reactionType,
      whoCanReply,
      whoCanReact,
      selectedFolder
    };
    
    const hasChanges = JSON.stringify(currentValues) !== JSON.stringify(initialValues);
    currentSetHasChanges(hasChanges);
  }, [name, description, slug, spaceIconUrl, currentSpaceBanner, currentSpaceBannerUrl, visibility, inviteOnly, anyoneCanInvite, enableComments, enableReactions, reactionType, whoCanReply, whoCanReact, selectedFolder, initialValues, currentSetHasChanges]);

  // Handler functions for state changes
  const handleNameChange = (value: string) => {
    setName(value);
    setHasChanges(true);
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    setHasChanges(true);
  };

  const handleSlugChange = (value: string) => {
    setSlug(value);
    setHasChanges(true);
  };

  const handleSpaceIconUrlChange = (value: string) => {
    setSpaceIconUrl(value);
    setHasChanges(true);
  };

  const handleSpaceBannerChange = (value: boolean) => {
    setSpaceBanner(value);
    setHasChanges(true);
  };

  const handleSpaceBannerUrlChange = (value: string) => {
    setSpaceBannerUrl(value);
    setHasChanges(true);
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

  const handleEnableCommentsChange = (value: boolean) => {
    setEnableComments(value);
  };

  const handleEnableReactionsChange = (value: boolean) => {
    setEnableReactions(value);
  };

  const handleReactionTypeChange = (value: string) => {
    setReactionType(value);
  };

  const handleWhoCanReplyChange = (value: string) => {
    setWhoCanReply(value);
  };

  const handleWhoCanReactChange = (value: string) => {
    setWhoCanReact(value);
  };

  // Reset all changes to initial values
  const handleDiscardChanges = () => {
    setName(initialValues.name);
    setDescription(initialValues.description);
    setSlug(initialValues.slug);
    setSpaceIconUrl(initialValues.spaceIconUrl);
    currentSetSpaceBanner(initialValues.spaceBanner);
    currentSetSpaceBannerUrl(initialValues.spaceBannerUrl);
    setVisibility(initialValues.visibility);
    setInviteOnly(initialValues.inviteOnly);
    setAnyoneCanInvite(initialValues.anyoneCanInvite);
    setEnableComments(initialValues.enableComments);
    setEnableReactions(initialValues.enableReactions);
    setReactionType(initialValues.reactionType);
    setWhoCanReply(initialValues.whoCanReply);
    setWhoCanReact(initialValues.whoCanReact);
    setSelectedFolder(initialValues.selectedFolder);
  };

  // Get the title for the current tab
  const getTabTitle = () => {
    switch(activeTab) {
      case 'general': return 'General settings';
      case 'widget': return 'Customize Widgets';
      case 'seo': return 'SEO Settings';
      case 'display': return 'Content Layout';
      case 'danger': return 'Danger Zone';
      case 'member-management': return 'Member Management';
      default: return 'Settings';
    }
  };

  // Get the description for the current tab
  const getTabDescription = () => {
    switch(activeTab) {
      case 'general': return 'Configure basic space information, visibility and permissions';
      case 'widget': return 'Select and configure widgets to display in your space';
      case 'seo': return 'Optimize your space for search engines and social media';
      case 'display': return 'Customize how content is displayed and organized';
      case 'danger': return 'Irreversible actions that affect your entire space';
      case 'member-management': return 'Manage members and permissions in your space';
      default: return 'Select a category to configure space settings';
    }
  };

  // Determine content type based on space slug
  const getContentType = (): 'blog' | 'event' | 'general' => {
    const lowerSpaceSlug = spacesSlug.toLowerCase();
    if (lowerSpaceSlug.includes('blog') || lowerSpaceSlug.includes('post') || lowerSpaceSlug.includes('article')) {
      return 'blog';
    }
    if (lowerSpaceSlug.includes('event') || lowerSpaceSlug.includes('calendar') || lowerSpaceSlug.includes('meet')) {
      return 'event';
    }
    return 'general';
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
          spaceBanner={currentSpaceBanner}
          setSpaceBanner={currentSetSpaceBanner}
          spaceBannerUrl={currentSpaceBannerUrl}
          setSpaceBannerUrl={currentSetSpaceBannerUrl}
          visibility={visibility}
          setVisibility={handleVisibilityChange}
          inviteOnly={inviteOnly}
          setInviteOnly={handleInviteOnlyChange}
          anyoneCanInvite={anyoneCanInvite}
          setAnyoneCanInvite={handleAnyoneCanInviteChange}
          enableComments={enableComments}
          setEnableComments={handleEnableCommentsChange}
          enableReactions={enableReactions}
          setEnableReactions={handleEnableReactionsChange}
          reactionType={reactionType}
          setReactionType={handleReactionTypeChange}
          whoCanReply={whoCanReply}
          setWhoCanReply={handleWhoCanReplyChange}
          whoCanReact={whoCanReact}
          setWhoCanReact={handleWhoCanReactChange}
          selectedFolder={selectedFolder}
          setSelectedFolder={setSelectedFolder}
          isLoading={currentIsLoading}
        />;
      case 'widget':
        return <WidgetSettingsTab contentType={getContentType()} onWidgetHover={onWidgetHover} />;
      case 'seo':
        return <SEOSettingsTab />;
      case 'display':
        return <DisplaySettingsTab />;
      case 'danger':
        return <DangerZoneSettingsTab />;
      case 'member-management':
        return <MemberManagementTab />;
      default:
        return (
          <div className="py-6 px-2 text-center text-gray-500 dark:text-gray-400">
            Select settings from the sidebar to configure this space.
          </div>
        );
    }
  };

  return (
    <div className="w-80 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col">
      <div className="p-2 flex flex-col flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeftToLine className="h-3.5 w-3.5" />
          </button>
          
          <div className="flex items-center">
            {currentHasChanges && activeTab !== 'danger' && (
              <button
                type="button"
                onClick={externalOnDiscard || handleDiscardChanges}
                className="px-1 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Discard
              </button>
            )}
            {activeTab !== 'danger' && (
              <button
                type="button"
                onClick={externalOnSave || (() => {})}
                className={`px-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  !currentHasChanges || currentIsLoading 
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                    : 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                } ${currentHasChanges ? 'ml-2' : ''}`}
                disabled={!currentHasChanges || currentIsLoading}
              >
                {currentIsLoading ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin inline" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-100 dark:border-gray-700 mb-3  "></div>
        
        <div>
          <h2 className="px-2  text-lg font-medium text-gray-900 dark:text-white">{getTabTitle()}</h2>
          <p className="px-2 text-xs text-gray-500 dark:text-gray-400 mt-1">{getTabDescription()}</p>
        </div>

      </div>

      
      <div className="flex-1 mt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="px-2">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
} 