import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { Site } from "@/lib/api";
import { useSiteData } from "@/lib/SiteDataContext";
import { GeneralSettingsTab } from "./GeneralSettingsTab";
import { PermissionsSettingsTab } from "./PermissionsSettingsTab";
import { SEOSettingsTab } from "./SEOSettingsTab";
import { DisplaySettingsTab } from "./DisplaySettingsTab";
import { CustomizeSettingsTab } from "./CustomizeSettingsTab";

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