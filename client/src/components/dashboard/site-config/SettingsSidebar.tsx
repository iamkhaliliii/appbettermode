import { useState } from "react";
import {
  FileText,
  Shield,
  Upload,
  X,
  Loader2
} from "lucide-react";
import { Site } from "@/lib/api";

interface SettingsSidebarProps {
  siteSD: string;
  spacesSlug: string;
  activeTab: string;
  siteDetails: Site | null;
}

/**
 * Settings sidebar component for space settings
 */
export function SettingsSidebar({ 
  siteSD, 
  spacesSlug, 
  activeTab, 
  siteDetails 
}: SettingsSidebarProps) {
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
          setName={setName}
          description={description}
          setDescription={setDescription}
          slug={slug}
          setSlug={setSlug}
          spaceIconUrl={spaceIconUrl}
          setSpaceIconUrl={setSpaceIconUrl}
          spaceBannerUrl={spaceBannerUrl}
          setSpaceBannerUrl={setSpaceBannerUrl}
          visibility={visibility}
          setVisibility={setVisibility}
          inviteOnly={inviteOnly}
          setInviteOnly={setInviteOnly}
          anyoneCanInvite={anyoneCanInvite}
          setAnyoneCanInvite={setAnyoneCanInvite}
          isLoading={isLoading}
        />;
      case 'permissions':
        return <PermissionsSettingsTab />;
      default:
        return (
          <div className="py-6 px-2 text-center text-gray-500 dark:text-gray-400">
            Select settings from the sidebar to configure this space.
          </div>
        );
    }
  };

  return (
    <div className="w-80 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 dark:scrollbar-thumb-gray-700 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 flex flex-col">
      <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center flex-shrink-0">
        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-md flex items-center justify-center text-primary-600 dark:text-primary-300 mr-3">
          <FileText className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-medium text-gray-900 dark:text-white">{getTabTitle()}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Edit space settings</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-100 dark:scrollbar-thumb-gray-700">
        <div className="p-4">
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
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-1 mb-1.5">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Icon</h3>
          <div className="text-gray-400 w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <span className="text-[10px]">?</span>
          </div>
        </div>
        <div className="mt-1">
          {spaceIconUrl ? (
            <div className="inline-flex relative">
              <img 
                src={spaceIconUrl} 
                alt="Icon" 
                className="h-12 w-12 rounded-md object-cover" 
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMTZDMTQuMjA5MSAxNiAxNiAxNC4yMDkxIDE2IDEyQzE2IDkuNzkwODYgMTQuMjA5MSA4IDEyIDhDOS43OTA4NiA4IDggOS43OTA4NiA4IDEyQzggMTQuMjA5MSA5Ljc5MDg2IDE2IDEyIDE2WiIgc3Ryb2tlPSIjNjk3MDg2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0zIDEyQzMgMTIgNyAyMSAxMiAyMUMxNyAyMSAyMSAxMiAyMSAxMkMyMSAxMiAxNyAzIDEyIDNDNyAzIDMgMTIgMyAxMloiIHN0cm9rZT0iIzY5NzA4NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=';
                }}
              />
              <button
                onClick={() => setSpaceIconUrl('')}
                className="absolute -top-1.5 -right-1.5 bg-gray-500/90 text-white rounded-full w-4 h-4 flex items-center justify-center"
                type="button"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    // This would normally upload to server, but for now we'll use a placeholder
                    setSpaceIconUrl(URL.createObjectURL(file));
                  }
                };
                input.click();
              }}
              className="cursor-pointer border border-dashed border-gray-300 dark:border-gray-600 rounded-md h-12 w-12 flex flex-col items-center justify-center"
            >
              <Upload className="h-3.5 w-3.5 text-gray-400 mb-0.5" />
              <div className="text-[10px] text-indigo-500 dark:text-indigo-400">Upload</div>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="mb-1.5">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
        </div>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          required
        />
      </div>
      
      <div>
        <div className="flex items-center gap-1 mb-1.5">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <div className="text-gray-400 w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <span className="text-[10px]">?</span>
          </div>
        </div>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>
      
      <div>
        <div className="mb-1.5">
          <label htmlFor="banner" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Banner
          </label>
        </div>
        
        {spaceBannerUrl ? (
          <div className="relative">
            <img 
              src={spaceBannerUrl} 
              alt="Banner" 
              className="w-full h-24 object-cover rounded-md" 
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkgM0g1QzMuODk1NDMgMyAzIDMuODk1NDMgMyA1VjE5QzMgMjAuMTA0NiAzLjg5NTQzIDIxIDUgMjFIMTlDMjAuMTA0NiAyMSAyMSAyMC4xMDQ2IDIxIDE5VjVDMjEgMy44OTU0MyAyMC4xMDQ2IDMgMTkgM1oiIHN0cm9rZT0iIzY5NzA4NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNOC41IDEwQzkuMzI4NDMgMTAgMTAgOS4zMjg0MyAxMCA4LjVDMTAgNy42NzE1NyA5LjMyODQzIDcgOC41IDdDNy42NzE1NyA3IDcgNy42NzE1NyA3IDguNUM3IDkuMzI4NDMgNy42NzE1NyAxMCA4LjUgMTBaIiBzdHJva2U9IiM2OTcwODYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTIxIDE1TDE2IDEwTDUgMjEiIHN0cm9rZT0iIzY5NzA4NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=';
              }}
            />
            <button
              onClick={() => setSpaceBannerUrl('')}
              className="absolute top-1.5 right-1.5 bg-gray-600/90 text-white rounded-full w-5 h-5 flex items-center justify-center"
              type="button"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  // This would normally upload to server, but for now we'll use a placeholder
                  setSpaceBannerUrl(URL.createObjectURL(file));
                }
              };
              input.click();
            }}
            className="cursor-pointer border border-dashed border-gray-300 dark:border-gray-600 rounded-md h-24 flex flex-col items-center justify-center"
          >
            <Upload className="h-4 w-4 text-gray-400 mb-1" />
            <div className="text-xs text-indigo-500 dark:text-indigo-400">Click to upload</div>
            <div className="text-[10px] text-gray-500 mt-0.5">SVG, PNG, JPG or GIF (max. 800×400px)</div>
          </div>
        )}
      </div>
      
      <div>
        <div className="mb-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Web address
          </label>
        </div>
        <div className="flex rounded-md">
          <span className="flex items-center px-2 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 text-xs">
            bettermode.com/.../
          </span>
          <input 
            value={slug} 
            onChange={(e) => setSlug(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-r-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
      </div>
      
      <div>
        <div className="pt-1 pb-3">
          <div className="flex items-center py-1.5">
            <input
              type="checkbox"
              id="make_private"
              checked={visibility === 'private'}
              onChange={(e) => setVisibility(e.target.checked ? 'private' : 'public')}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="make_private" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Make private
            </label>
          </div>
          
          <div className="flex items-center py-1.5">
            <input
              type="checkbox"
              id="invite_only"
              checked={inviteOnly}
              onChange={(e) => setInviteOnly(e.target.checked)}
              disabled={visibility === 'private'}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="invite_only" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Make invite-only
            </label>
          </div>
          
          <div className="flex items-center py-1.5">
            <input
              type="checkbox"
              id="anyone_can_invite"
              checked={anyoneCanInvite}
              onChange={(e) => setAnyoneCanInvite(e.target.checked)}
              disabled={!inviteOnly || visibility === 'private'}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="anyone_can_invite" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Anyone can invite
            </label>
          </div>
        </div>
      </div>
      
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}

function PermissionsSettingsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-start p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
        <Shield className="h-5 w-5 text-amber-500 dark:text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Permissions Configuration</h3>
          <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
            Define who can access this space and what actions they can perform.
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-1 mb-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Who can post?
          </label>
          <div className="text-gray-400 w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <span className="text-[10px]">?</span>
          </div>
        </div>
        <select
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          defaultValue="all"
        >
          <option value="all">All members</option>
          <option value="members">Members Only</option>
          <option value="staff">Staff Only</option>
          <option value="admin">Admin Only</option>
        </select>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-1 mb-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Who can reply?
          </label>
          <div className="text-gray-400 w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <span className="text-[10px]">?</span>
          </div>
        </div>
        <select
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          defaultValue="all"
        >
          <option value="all">All members</option>
          <option value="members">Members Only</option>
          <option value="staff">Staff Only</option>
          <option value="admin">Admin Only</option>
        </select>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-1 mb-1.5">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Who can react?
          </label>
          <div className="text-gray-400 w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
            <span className="text-[10px]">?</span>
          </div>
        </div>
        <select
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          defaultValue="all"
        >
          <option value="all">All members</option>
          <option value="members">Members Only</option>
          <option value="staff">Staff Only</option>
          <option value="admin">Admin Only</option>
        </select>
      </div>
      
      <div className="pt-4 flex justify-end">
        <button
          type="button"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
} 