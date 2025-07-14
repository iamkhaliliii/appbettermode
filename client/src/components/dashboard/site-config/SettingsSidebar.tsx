import { useState, useEffect, useCallback, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { Site } from "@/lib/api";
import { useSiteData } from "@/lib/SiteDataContext";
import { GeneralSettingsTab } from "./GeneralSettingsTab";
import { SimpleWidgetTab } from "./SimpleWidgetTab";
import { CustomizePlusTab } from "./CustomizePlusTab";
import { SEOSettingsTab } from "./SEOSettingsTab";
import { DisplaySettingsTab } from "./DisplaySettingsTab";
import { DangerZoneSettingsTab } from "./DangerZoneSettingsTab";
import { MemberManagementTab } from "./MemberManagementTab";

interface SettingsSidebarProps {
  siteSD: string;
  spacesSlug: string;
  activeTab: string;
  siteDetails: Site | null;
  onClose?: () => void;
  spaceBanner?: boolean;
  setSpaceBanner?: (value: boolean) => void;
  spaceBannerUrl?: string;
  setSpaceBannerUrl?: (value: string) => void;
  hasChanges?: boolean;
  setHasChanges?: (value: boolean) => void;
  isLoading?: boolean;
  onSave?: () => void;
  onDiscard?: () => void;
  onLayoutChange?: (layout: string) => void;
  onCardSizeChange?: (cardSize: string) => void;
  onCardStyleChange?: (cardStyle: string) => void;
  onAddWidgetModeChange?: (isAddWidgetMode: boolean) => void;
  onWidgetSettingsModeChange?: (isWidgetSettingsMode: boolean) => void;
  selectedWidget?: any;
  isWidgetSettingsMode?: boolean;
  // Current values for widget tab
  currentLayout?: string;
  currentCardSize?: string;
  currentCardStyle?: string;
}

/**
 * Settings sidebar component for space settings
 */
export function SettingsSidebar({ 
  siteSD, 
  spacesSlug, 
  activeTab,
  onClose,
  spaceBanner: externalSpaceBanner,
  setSpaceBanner: externalSetSpaceBanner,
  spaceBannerUrl: externalSpaceBannerUrl,
  setSpaceBannerUrl: externalSetSpaceBannerUrl,
  hasChanges: externalHasChanges,
  setHasChanges: externalSetHasChanges,
  isLoading: externalIsLoading,
  onSave: externalOnSave,
  onDiscard: externalOnDiscard,
  onLayoutChange,
  onCardSizeChange,
  onCardStyleChange,
  onAddWidgetModeChange,
  onWidgetSettingsModeChange,
  selectedWidget,
  isWidgetSettingsMode,
  currentLayout = 'card',
  currentCardSize = 'medium',
  currentCardStyle = 'modern'
}: Omit<SettingsSidebarProps, 'siteDetails'>) {
  // Get site details from context
  const { sites } = useSiteData();
  const siteDetails = sites[siteSD] || null;
  
  // Get capitalized space name for display
  const displaySpaceName = useMemo(() => {
    return spacesSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [spacesSlug]);
  
  // Internal states - simplified
  const [internalState, setInternalState] = useState({
    name: displaySpaceName,
    description: 'Advice and answers from the Tribe Team',
    slug: spacesSlug,
    spaceIconUrl: '',
    spaceBanner: false,
    spaceBannerUrl: '',
    visibility: 'public',
    inviteOnly: false,
    anyoneCanInvite: false,
    enableComments: true,
    enableReactions: true,
    reactionType: 'emoji',
    whoCanReply: 'all',
    whoCanReact: 'all',
    selectedFolder: 'root'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isAddWidgetMode, setIsAddWidgetMode] = useState(false);

  // Use external widget settings mode if provided, otherwise use internal state
  const currentIsWidgetSettingsMode = isWidgetSettingsMode !== undefined ? isWidgetSettingsMode : false;

  // Initial values for change detection
  const initialValues = useMemo(() => ({
    name: displaySpaceName,
    description: 'Advice and answers from the Tribe Team',
    slug: spacesSlug,
    spaceIconUrl: '',
    spaceBanner: externalSpaceBanner !== undefined ? externalSpaceBanner : false,
    spaceBannerUrl: externalSpaceBannerUrl !== undefined ? externalSpaceBannerUrl : '',
    visibility: 'public',
    inviteOnly: false,
    anyoneCanInvite: false,
    enableComments: true,
    enableReactions: true,
    reactionType: 'emoji',
    whoCanReply: 'all',
    whoCanReact: 'all',
    selectedFolder: 'root'
  }), [displaySpaceName, spacesSlug, externalSpaceBanner, externalSpaceBannerUrl]);

  // Use external state if provided, otherwise use internal state
  const currentSpaceBanner = externalSpaceBanner !== undefined ? externalSpaceBanner : internalState.spaceBanner;
  const currentSetSpaceBanner = externalSetSpaceBanner || ((value: boolean) => setInternalState(prev => ({ ...prev, spaceBanner: value })));
  const currentSpaceBannerUrl = externalSpaceBannerUrl !== undefined ? externalSpaceBannerUrl : internalState.spaceBannerUrl;
  const currentSetSpaceBannerUrl = externalSetSpaceBannerUrl || ((value: string) => setInternalState(prev => ({ ...prev, spaceBannerUrl: value })));
  const currentHasChanges = externalHasChanges !== undefined ? externalHasChanges : hasChanges;
  const currentSetHasChanges = externalSetHasChanges || setHasChanges;
  const currentIsLoading = externalIsLoading !== undefined ? externalIsLoading : isLoading;

  // Detect changes - optimized
  useEffect(() => {
    const currentValues = {
      ...internalState,
      spaceBanner: currentSpaceBanner,
      spaceBannerUrl: currentSpaceBannerUrl
    };
    
    const hasChanges = JSON.stringify(currentValues) !== JSON.stringify(initialValues);
    currentSetHasChanges(hasChanges);
  }, [internalState, currentSpaceBanner, currentSpaceBannerUrl, initialValues, currentSetHasChanges]);

  // Notify parent about add widget mode changes
  useEffect(() => {
    if (onAddWidgetModeChange) {
      onAddWidgetModeChange(isAddWidgetMode);
    }
  }, [isAddWidgetMode, onAddWidgetModeChange]);

  // Optimized change handlers
  const updateInternalState = useCallback((field: string, value: any) => {
    setInternalState(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  }, []);

  const handleDiscardChanges = useCallback(() => {
    setInternalState(initialValues);
    currentSetSpaceBanner(initialValues.spaceBanner);
    currentSetSpaceBannerUrl(initialValues.spaceBannerUrl);
  }, [initialValues, currentSetSpaceBanner, currentSetSpaceBannerUrl]);

  // Tab information - memoized
  const tabInfo = useMemo(() => {
    const tabMap = {
      general: { title: 'General settings', description: 'Configure basic space information, visibility and permissions' },
      widget: currentIsWidgetSettingsMode 
        ? { title: 'Widget Settings', description: 'Configure the selected widget properties and behavior' }
        : { title: 'Customize', description: 'Select and configure which elements are interactive in your space preview' },
      'customize-plus': { title: 'Advanced Layout Editor', description: 'Design your space layout with advanced widgets and content blocks using BlockNote editor' },
      seo: { title: 'SEO Settings', description: 'Optimize your space for search engines and social media' },
      display: { title: 'Content Layout', description: 'Customize how content is displayed and organized' },
      danger: { title: 'Danger Zone', description: 'Irreversible actions that affect your entire space' },
      'member-management': { title: 'Member Management', description: 'Manage members and permissions in your space' }
    };
    
    return tabMap[activeTab as keyof typeof tabMap] || { title: 'Settings', description: 'Select a category to configure space settings' };
  }, [activeTab, currentIsWidgetSettingsMode]);

  // Content type detection - memoized
  const contentType = useMemo((): 'blog' | 'event' | 'general' => {
    const lowerSpaceSlug = spacesSlug.toLowerCase();
    if (lowerSpaceSlug.includes('blog') || lowerSpaceSlug.includes('post') || lowerSpaceSlug.includes('article')) {
      return 'blog';
    }
    if (lowerSpaceSlug.includes('event') || lowerSpaceSlug.includes('calendar') || lowerSpaceSlug.includes('meet')) {
      return 'event';
    }
    return 'general';
  }, [spacesSlug]);

  // Render tab content - optimized
  const renderTabContent = useCallback(() => {
    switch(activeTab) {
      case 'general':
        return (
          <GeneralSettingsTab 
            name={internalState.name}
            setName={(value) => updateInternalState('name', value)}
            description={internalState.description}
            setDescription={(value) => updateInternalState('description', value)}
            slug={internalState.slug}
            setSlug={(value) => updateInternalState('slug', value)}
            spaceIconUrl={internalState.spaceIconUrl}
            setSpaceIconUrl={(value) => updateInternalState('spaceIconUrl', value)}
          spaceBanner={currentSpaceBanner}
          setSpaceBanner={currentSetSpaceBanner}
          spaceBannerUrl={currentSpaceBannerUrl}
          setSpaceBannerUrl={currentSetSpaceBannerUrl}
            visibility={internalState.visibility}
            setVisibility={(value) => updateInternalState('visibility', value)}
            inviteOnly={internalState.inviteOnly}
            setInviteOnly={(value) => updateInternalState('inviteOnly', value)}
            anyoneCanInvite={internalState.anyoneCanInvite}
            setAnyoneCanInvite={(value) => updateInternalState('anyoneCanInvite', value)}
            enableComments={internalState.enableComments}
            setEnableComments={(value) => updateInternalState('enableComments', value)}
            enableReactions={internalState.enableReactions}
            setEnableReactions={(value) => updateInternalState('enableReactions', value)}
            reactionType={internalState.reactionType}
            setReactionType={(value) => updateInternalState('reactionType', value)}
            whoCanReply={internalState.whoCanReply}
            setWhoCanReply={(value) => updateInternalState('whoCanReply', value)}
            whoCanReact={internalState.whoCanReact}
            setWhoCanReact={(value) => updateInternalState('whoCanReact', value)}
            selectedFolder={internalState.selectedFolder}
            setSelectedFolder={(value) => updateInternalState('selectedFolder', value)}
          isLoading={currentIsLoading}
          />
        );

      case 'widget':
        return <SimpleWidgetTab 
          onWidgetSettingsModeChange={onWidgetSettingsModeChange}
          onAddWidgetModeChange={setIsAddWidgetMode}
          onLayoutChange={onLayoutChange} 
          onCardSizeChange={onCardSizeChange} 
          onCardStyleChange={onCardStyleChange}
          selectedWidget={selectedWidget}
          isWidgetSettingsMode={currentIsWidgetSettingsMode}
          initialLayout={currentLayout}
          initialCardSize={currentCardSize}
          initialCardStyle={currentCardStyle}
        />;

      case 'customize-plus':
        return <CustomizePlusTab 
          initialContent={[]}
          onContentSave={(content) => {
            console.log('Saving advanced layout content:', content);
            // Here you would typically save to your backend/state management
          }}
          onWidgetAdd={(widget) => {
            console.log('Widget added in advanced mode:', widget);
          }}
          onWidgetEdit={(widgetId, settings) => {
            console.log('Widget edited in advanced mode:', widgetId, settings);
          }}
        />;

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
  }, [
    activeTab, 
    internalState, 
    updateInternalState, 
    currentSpaceBanner, 
    currentSetSpaceBanner, 
    currentSpaceBannerUrl, 
    currentSetSpaceBannerUrl, 
    currentIsLoading, 
    contentType,
    currentIsWidgetSettingsMode,
    displaySpaceName,
    spacesSlug
  ]);

  return (
    <div className="settings-sidebar w-80 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col" data-exclude-widget="true">
      {/* Header with buttons - hide when in add widget mode or customize-plus tab */}
      {!isAddWidgetMode && activeTab !== 'customize-plus' && (
        <div className="p-2 flex flex-col flex-shrink-0">
          <div className="flex items-center justify-end mb-2">
            <div className="flex items-center">
              {currentHasChanges && activeTab !== 'danger' && !currentIsWidgetSettingsMode && (
                <button
                  type="button"
                  onClick={externalOnDiscard || handleDiscardChanges}
                  className="px-1 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Discard
                </button>
              )}
              {activeTab !== 'danger' && !currentIsWidgetSettingsMode && (
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
          
          <div className="border-t border-gray-100 dark:border-gray-700 mb-3"></div>
          
          {/* Title and Description - only show when not in widget settings mode */}
          {!currentIsWidgetSettingsMode && (
          <div>
              <h2 className="px-2 text-lg font-medium text-gray-900 dark:text-white">{tabInfo.title}</h2>
              <p className="px-2 text-xs text-gray-500 dark:text-gray-400 mt-1">{tabInfo.description}</p>
          </div>
          )}
        </div>
      )}

      <div className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent ${!currentIsWidgetSettingsMode && !isAddWidgetMode && activeTab !== 'customize-plus' ? 'mt-4' : ''}`}>
        <div className={`${activeTab === 'customize-plus' ? 'h-full' : 'px-2'}`}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
} 