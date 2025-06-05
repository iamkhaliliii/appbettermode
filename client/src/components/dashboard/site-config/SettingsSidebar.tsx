import { useState, useEffect } from "react";
import { ArrowLeftToLine, Loader2, PanelLeftClose } from "lucide-react";
import { Site } from "@/lib/api";
import { useSiteData } from "@/lib/SiteDataContext";
import { GeneralSettingsTab } from "./GeneralSettingsTab";
import { SEOSettingsTab } from "./SEOSettingsTab";
import { DisplaySettingsTab } from "./DisplaySettingsTab";
import { CustomizeSettingsTab } from "./CustomizeSettingsTab";
import { DangerZoneSettingsTab } from "./DangerZoneSettingsTab";

interface SettingsSidebarProps {
  siteSD: string;
  spacesSlug: string;
  activeTab: string;
  siteDetails: Site | null;
  onClose?: () => void;
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
  const [enableComments, setEnableComments] = useState(true);
  const [enableReactions, setEnableReactions] = useState(true);
  const [reactionType, setReactionType] = useState('emoji');
  const [whoCanReply, setWhoCanReply] = useState('all');
  const [whoCanReact, setWhoCanReact] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Track initial values to detect changes
  const initialValues = {
    name: getDisplaySpaceName(),
    description: `Advice and answers from the Tribe Team`,
    slug: spacesSlug,
    spaceIconUrl: "",
    spaceBannerUrl: "",
    visibility: "public",
    inviteOnly: false,
    anyoneCanInvite: false,
    enableComments: true,
    enableReactions: true,
    reactionType: 'emoji',
    whoCanReply: 'all',
    whoCanReact: 'all'
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
      anyoneCanInvite,
      enableComments,
      enableReactions,
      reactionType,
      whoCanReply,
      whoCanReact
    };
    
    const changed = JSON.stringify(currentValues) !== JSON.stringify(initialValues);
    setHasChanges(changed);
  };

  // Use effect to check for changes whenever state updates
  useEffect(() => {
    checkForChanges();
  }, [name, description, slug, spaceIconUrl, spaceBannerUrl, visibility, inviteOnly, anyoneCanInvite, enableComments, enableReactions, reactionType, whoCanReply, whoCanReact]);

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
    setSpaceBannerUrl(initialValues.spaceBannerUrl);
    setVisibility(initialValues.visibility);
    setInviteOnly(initialValues.inviteOnly);
    setAnyoneCanInvite(initialValues.anyoneCanInvite);
    setEnableComments(initialValues.enableComments);
    setEnableReactions(initialValues.enableReactions);
    setReactionType(initialValues.reactionType);
    setWhoCanReply(initialValues.whoCanReply);
    setWhoCanReact(initialValues.whoCanReact);
  };

  // Get the title for the current tab
  const getTabTitle = () => {
    switch(activeTab) {
      case 'general': return 'General settings';
      case 'seo': return 'SEO Settings';
      case 'display': return 'Display Settings';
      case 'customize': return 'Customize Settings';
      case 'danger': return 'Danger Zone';
      default: return 'Settings';
    }
  };

  // Get the description for the current tab
  const getTabDescription = () => {
    switch(activeTab) {
      case 'general': return 'Configure basic space information, visibility and permissions';
      case 'seo': return 'Optimize your space for search engines and social media';
      case 'display': return 'Customize how content is displayed and organized';
      case 'customize': return 'Configure interactive features and space appearance';
      case 'danger': return 'Irreversible actions that affect your entire space';
      default: return 'Select a category to configure space settings';
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
          isLoading={isLoading}
        />;
      case 'seo':
        return <SEOSettingsTab />;
      case 'display':
        return <DisplaySettingsTab />;
      case 'customize':
        return <CustomizeSettingsTab />;
      case 'danger':
        return <DangerZoneSettingsTab />;
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
            {hasChanges && activeTab !== 'danger' && (
              <button
                type="button"
                onClick={handleDiscardChanges}
                className="px-1 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Discard
              </button>
            )}
            {activeTab !== 'danger' && (
              <button
                type="button"
                className={`px-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  !hasChanges || isLoading 
                    ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' 
                    : 'text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                } ${hasChanges ? 'ml-2' : ''}`}
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
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-100 dark:border-gray-700 mb-3  "></div>
        
        <div>
          <h2 className="px-2  text-lg font-medium text-gray-900 dark:text-white">{getTabTitle()}</h2>
          <p className="px-2 text-xs text-gray-500 dark:text-gray-400 mt-1">{getTabDescription()}</p>
        </div>

      </div>

      
      <div className="flex-1 mt-4 overflow-y-auto scrollbar-thin ">
        <div className="px-2">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
} 