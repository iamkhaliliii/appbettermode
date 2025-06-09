import React, { useState, useEffect } from "react";
import { getApiBaseUrl } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/primitives";
import { Button } from "@/components/ui/primitives";
import { Input } from "@/components/ui/primitives";
import { Label } from "@/components/ui/primitives";
import { Textarea } from "@/components/ui/primitives";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives";
import { Loader2, AlertTriangle, Users, Layout, Search, FileImage, Trash2, MessageSquare, ThumbsUp, Share, Settings, X, Upload } from "lucide-react";
import { Switch } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

// Space interface
interface Space {
  id: string;
  name: string;
  slug: string;
  description?: string;
  cms_type?: string;
  cms_type_name?: string;
  hidden?: boolean;
  visibility?: string;
  site_id: string;
  invite_only?: boolean;
  anyone_can_invite?: boolean;
  post_permission?: string;
  reply_permission?: string;
  react_permission?: string;
  meta_title?: string;
  meta_description?: string;
  ogg_url?: string;
  space_icon_URL?: string;
  space_banner_URL?: string;
}

interface EditSpaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  space: Space | null;
  siteId: string;
  onSpaceUpdated?: () => void;
}

type TabType = 'general' | 'permissions' | 'seo' | 'layout' | 'customize' | 'danger';

export function EditSpaceDialog({
  open,
  onOpenChange,
  space,
  siteId,
  onSpaceUpdated
}: EditSpaceDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('general');
  
  // Form state - General
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [cmsType, setCmsType] = useState("");
  const [hidden, setHidden] = useState(false);
  const [visibility, setVisibility] = useState<string>("public");
  
  // Form state - Permissions
  const [inviteOnly, setInviteOnly] = useState(false);
  const [anyoneCanInvite, setAnyoneCanInvite] = useState(false);
  const [postPermission, setPostPermission] = useState<string>("all");
  const [replyPermission, setReplyPermission] = useState<string>("all");
  const [reactPermission, setReactPermission] = useState<string>("all");
  
  // Form state - SEO
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [oggUrl, setOggUrl] = useState("");
  
  // Form state - Layout
  const [spaceIconUrl, setSpaceIconUrl] = useState("");
  const [spaceBannerUrl, setSpaceBannerUrl] = useState("");
  
  // Form state - Layout settings
  const [layoutMode, setLayoutMode] = useState<string>("list");
  const [sidebarPosition, setSidebarPosition] = useState<string>("right");
  const [itemsPerPage, setItemsPerPage] = useState<string>("20");
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);

  // Customize state
  const [customFields, setCustomFields] = useState<{[key: string]: string}>({});
  const [fieldVisibility, setFieldVisibility] = useState<{[key: string]: boolean}>({
    title: true,
    description: true,
    author: true,
    date: true,
    category: true,
    tags: true,
  });

  // Reset form when space changes
  useEffect(() => {
    if (space) {
      // General
      setName(space.name || "");
      setSlug(space.slug || "");
      setDescription(space.description || "");
      setCmsType(space.cms_type || "");
      setHidden(space.hidden || false);
      setVisibility(space.visibility || "public");
      
      // Permissions
      setInviteOnly(space.invite_only || false);
      setAnyoneCanInvite(space.anyone_can_invite || false);
      setPostPermission(space.post_permission || "all");
      setReplyPermission(space.reply_permission || "all");
      setReactPermission(space.react_permission || "all");
      
      // SEO
      setMetaTitle(space.meta_title || "");
      setMetaDescription(space.meta_description || "");
      setOggUrl(space.ogg_url || "");
      
      // Layout
      setSpaceIconUrl(space.space_icon_URL || "");
      setSpaceBannerUrl(space.space_banner_URL || "");
    }
  }, [space]);

  // Reset selected space when space changes
  useEffect(() => {
    setSelectedSpace(space);
  }, [space]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!space || !siteId) {
      setError("Missing space data");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const API_BASE = getApiBaseUrl();
      const response = await fetch(`${API_BASE}/api/v1/sites/${siteId}/spaces/${space.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // General
          name,
          slug,
          description,
          cms_type: cmsType,
          hidden,
          visibility,
          
          // Permissions
          invite_only: inviteOnly,
          anyone_can_invite: anyoneCanInvite,
          post_permission: postPermission,
          reply_permission: replyPermission,
          react_permission: reactPermission,
          
          // SEO
          meta_title: metaTitle,
          meta_description: metaDescription,
          ogg_url: oggUrl,
          
          // Layout
          space_icon_URL: spaceIconUrl,
          space_banner_URL: spaceBannerUrl,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update space");
      }
      
      setSuccess("Space updated successfully");
      
      // Wait a brief moment to show success message
      setTimeout(() => {
        onOpenChange(false);
        if (onSpaceUpdated) {
          onSpaceUpdated();
        }
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
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
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-9 text-sm"
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
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[80px] text-sm"
                rows={3}
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
                <Input 
                  value={slug} 
                  onChange={(e) => setSlug(e.target.value)} 
                  className="rounded-l-none h-9 text-sm" 
                  required
                  pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                  title="Use lowercase letters, numbers, and hyphens only"
                />
              </div>
            </div>
            
            <div>
              <div className="pt-1 pb-3">
                <div className="flex items-center py-1.5">
                  <Switch
                    id="make_private"
                    checked={visibility === 'private'}
                    onCheckedChange={(checked) => setVisibility(checked ? 'private' : 'public')}
                    className="scale-90"
                  />
                  <label htmlFor="make_private" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Make private
                  </label>
                </div>
                
                <div className="flex items-center py-1.5">
                  <Switch
                    id="invite_only"
                    checked={inviteOnly}
                    onCheckedChange={setInviteOnly}
                    disabled={visibility === 'private'}
                    className="scale-90"
                  />
                  <label htmlFor="invite_only" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Make invite-only
                  </label>
                </div>
                
                <div className="flex items-center py-1.5">
                  <Switch
                    id="anyone_can_invite"
                    checked={anyoneCanInvite}
                    onCheckedChange={setAnyoneCanInvite}
                    disabled={!inviteOnly || visibility === 'private'}
                    className="scale-90"
                  />
                  <label htmlFor="anyone_can_invite" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Anyone can invite
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'permissions':
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Who can post?
                </label>
                <div className="text-gray-400 w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <span className="text-[10px]">?</span>
                </div>
              </div>
              <Select
                value={postPermission}
                onValueChange={setPostPermission}
              >
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder="Select who can post" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All members</SelectItem>
                  <SelectItem value="members">Members Only</SelectItem>
                  <SelectItem value="staff">Staff Only</SelectItem>
                  <SelectItem value="admin">Admin Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Who can reply?
                </label>
                <div className="text-gray-400 w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <span className="text-[10px]">?</span>
                </div>
              </div>
              <Select
                value={replyPermission}
                onValueChange={setReplyPermission}
              >
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder="Select who can reply" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All members</SelectItem>
                  <SelectItem value="members">Members Only</SelectItem>
                  <SelectItem value="staff">Staff Only</SelectItem>
                  <SelectItem value="admin">Admin Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Who can react?
                </label>
                <div className="text-gray-400 w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <span className="text-[10px]">?</span>
                </div>
              </div>
              <Select
                value={reactPermission}
                onValueChange={setReactPermission}
              >
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder="Select who can react" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All members</SelectItem>
                  <SelectItem value="members">Members Only</SelectItem>
                  <SelectItem value="staff">Staff Only</SelectItem>
                  <SelectItem value="admin">Admin Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'seo':
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Search Engine Optimization</h3>
                <div className="text-gray-400 w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <span className="text-[10px]">?</span>
                </div>
              </div>
              <div className="space-y-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border border-gray-100 dark:border-gray-800">
                <div className="grid grid-cols-4 items-center gap-3">
                  <label htmlFor="meta_title" className="text-right text-xs font-medium text-gray-600 dark:text-gray-400">
                    Meta Title
                  </label>
                  <div className="col-span-3 space-y-1">
                    <Input
                      id="meta_title"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder={name || "SEO title"}
                      className="h-8 text-sm"
                    />
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      {metaTitle.length}/60 characters recommended
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-start gap-3">
                  <label htmlFor="meta_description" className="text-right text-xs font-medium text-gray-600 dark:text-gray-400 pt-1.5">
                    Meta Description
                  </label>
                  <div className="col-span-3 space-y-1">
                    <Textarea
                      id="meta_description"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      rows={2}
                      placeholder="Brief description for search engines"
                      className="text-sm min-h-[60px]"
                    />
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      {metaDescription.length}/160 characters recommended
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Social Sharing</h3>
                <div className="text-gray-400 w-3.5 h-3.5 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center">
                  <span className="text-[10px]">?</span>
                </div>
              </div>
              <div className="space-y-3 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border border-gray-100 dark:border-gray-800">
                <div className="grid grid-cols-4 items-start gap-3">
                  <label htmlFor="ogg_url" className="text-right text-xs font-medium text-gray-600 dark:text-gray-400 pt-1.5">
                    Social Image URL
                  </label>
                  <div className="col-span-3 space-y-2">
                    <Input
                      id="ogg_url"
                      value={oggUrl}
                      onChange={(e) => setOggUrl(e.target.value)}
                      placeholder="URL for social media preview image"
                      className="h-8 text-sm"
                    />
                    
                    {oggUrl && (
                      <div className="rounded-md border overflow-hidden">
                        <img 
                          src={oggUrl} 
                          alt="Social Preview" 
                          className="w-full h-20 object-cover" 
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkgM0g1QzMuODk1NDMgMyAzIDMuODk1NDMgMyA1VjE5QzMgMjAuMTA0NiAzLjg5NTQzIDIxIDUgMjFIMTlDMjAuMTA0NiAyMSAyMSAyMC4xMDQ2IDIxIDE5VjVDMjEgMy44OTU0MyAyMC4xMDQ2IDMgMTkgM1oiIHN0cm9rZT0iIzY5NzA4NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNOC41IDEwQzkuMzI4NDMgMTAgMTAgOS4zMjg0MyAxMCA4LjVDMTAgNy42NzE1NyA5LjMyODQzIDcgOC41IDdDNy42NzE1NyA3IDcgNy42NzE1NyA3IDguNUM3IDkuMzI4NDMgNy42NzE1NyAxMCA4LjUgMTBaIiBzdHJva2U9IiM2OTcwODYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTIxIDE1TDE2IDEwTDUgMjEiIHN0cm9rZT0iIzY5NzA4NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=';
                          }}
                        />
                      </div>
                    )}
                    
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      Recommended: 1200×630 pixels, 1.91:1 ratio
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'layout':
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Content Display Mode</h3>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border border-gray-100 dark:border-gray-800">
                <div className="grid grid-cols-3 gap-2">
                  <div 
                    className={cn(
                      "border rounded-md p-2 cursor-pointer transition-colors",
                      layoutMode === 'list' 
                        ? "bg-white dark:bg-gray-800 border-primary-300 dark:border-primary-700 shadow-sm" 
                        : "bg-white/60 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800"
                    )}
                    onClick={() => setLayoutMode('list')}
                  >
                    <div className="mb-1.5 h-12 flex flex-col gap-1 items-center justify-center">
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                      <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                    </div>
                    <div className="text-center text-[10px] font-medium">List View</div>
                  </div>
                  
                  <div 
                    className={cn(
                      "border rounded-md p-2 cursor-pointer transition-colors",
                      layoutMode === 'gallery' 
                        ? "bg-white dark:bg-gray-800 border-primary-300 dark:border-primary-700 shadow-sm" 
                        : "bg-white/60 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800"
                    )}
                    onClick={() => setLayoutMode('gallery')}
                  >
                    <div className="mb-1.5 h-12 grid grid-cols-2 gap-1 items-center justify-center">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded aspect-square"></div>
                      <div className="bg-gray-200 dark:bg-gray-700 rounded aspect-square"></div>
                      <div className="bg-gray-200 dark:bg-gray-700 rounded aspect-square"></div>
                      <div className="bg-gray-200 dark:bg-gray-700 rounded aspect-square"></div>
                    </div>
                    <div className="text-center text-[10px] font-medium">Gallery</div>
                  </div>
                  
                  <div 
                    className={cn(
                      "border rounded-md p-2 cursor-pointer transition-colors",
                      layoutMode === 'cards' 
                        ? "bg-white dark:bg-gray-800 border-primary-300 dark:border-primary-700 shadow-sm" 
                        : "bg-white/60 dark:bg-gray-800/40 hover:bg-white dark:hover:bg-gray-800"
                    )}
                    onClick={() => setLayoutMode('cards')}
                  >
                    <div className="mb-1.5 h-12 flex items-center justify-center">
                      <div className="h-full w-4/5 bg-gray-200 dark:bg-gray-700 rounded flex flex-col overflow-hidden">
                        <div className="h-3/5 bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex-1 flex items-center justify-center">
                          <div className="w-3/5 h-0.5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-[10px] font-medium">Card View</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="mb-1.5">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Layout Presets</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  type="button"
                  className="flex items-center p-2 border rounded-md bg-white/60 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-900/60"
                  onClick={() => {
                    setLayoutMode('list');
                    setItemsPerPage('20');
                    setSidebarPosition('right');
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-2 flex-shrink-0">
                    <Layout className="h-3 w-3" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-medium mb-0.5">Forum Layout</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">List view with sidebar</div>
                  </div>
                </button>
                
                <button 
                  type="button"
                  className="flex items-center p-2 border rounded-md bg-white/60 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-900/60"
                  onClick={() => {
                    setLayoutMode('gallery');
                    setItemsPerPage('30');
                    setSidebarPosition('left');
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300 mr-2 flex-shrink-0">
                    <Layout className="h-3 w-3" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-medium mb-0.5">Gallery Layout</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">Grid view for visuals</div>
                  </div>
                </button>
                
                <button 
                  type="button"
                  className="flex items-center p-2 border rounded-md bg-white/60 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-900/60"
                  onClick={() => {
                    setLayoutMode('cards');
                    setItemsPerPage('10');
                    setSidebarPosition('none');
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-300 mr-2 flex-shrink-0">
                    <Layout className="h-3 w-3" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-medium mb-0.5">Blog Layout</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">Featured cards view</div>
                  </div>
                </button>
                
                <button 
                  type="button"
                  className="flex items-center p-2 border rounded-md bg-white/60 dark:bg-gray-900/40 hover:bg-white dark:hover:bg-gray-900/60"
                  onClick={() => {
                    setLayoutMode('list');
                    setItemsPerPage('50');
                    setSidebarPosition('right');
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-300 mr-2 flex-shrink-0">
                    <Layout className="h-3 w-3" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-medium mb-0.5">Knowledge Base</div>
                    <div className="text-[10px] text-gray-500 dark:text-gray-400">Compact documentation</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );

      case 'customize':
        return (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Content Field Visibility</h3>
              </div>
              <div className="space-y-1.5 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border border-gray-100 dark:border-gray-800">
                {Object.keys(fieldVisibility).map(field => (
                  <div key={field} className="flex items-center justify-between py-1.5 px-2 border border-gray-100 dark:border-gray-800 rounded bg-white dark:bg-gray-900">
                    <div className="text-xs capitalize">{field}</div>
                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 mr-1">
                        Visible
                      </span>
                      <Switch
                        id={`field-${field}`}
                        checked={fieldVisibility[field]}
                        onCheckedChange={(checked) => {
                          setFieldVisibility(prev => ({
                            ...prev,
                            [field]: checked
                          }));
                        }}
                        className="scale-75"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom Field Labels</h3>
              </div>
              <div className="space-y-2 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border border-gray-100 dark:border-gray-800">
                {Object.keys(fieldVisibility).filter(field => fieldVisibility[field]).map(field => (
                  <div key={field} className="grid grid-cols-4 items-center gap-2">
                    <label htmlFor={`label-${field}`} className="text-right text-xs capitalize text-gray-600 dark:text-gray-400">
                      {field}
                    </label>
                    <Input
                      id={`label-${field}`}
                      className="col-span-3 h-7 text-xs"
                      value={customFields[field] || ""}
                      onChange={(e) => {
                        setCustomFields(prev => ({
                          ...prev,
                          [field]: e.target.value
                        }));
                      }}
                      placeholder={`Custom label for ${field}`}
                    />
                  </div>
                ))}
                <div className="pt-1 text-[10px] text-gray-500 dark:text-gray-400">
                  Customize field labels to match your content structure
                </div>
              </div>
            </div>
          </div>
        );

      case 'danger':
        return (
          <div className="space-y-6">
            <div className="bg-red-50/50 dark:bg-red-900/10 p-3 rounded-md border border-red-200 dark:border-red-900/30">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 mr-2 flex-shrink-0">
                  <AlertTriangle className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-red-700 dark:text-red-400">Danger Zone</h3>
                  <p className="text-[10px] text-red-600/80 dark:text-red-400/80 mt-0.5">
                    These actions cannot be undone
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="p-2 bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/30 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-medium">Archive Space</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                        Hide this space from navigation
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="h-6 text-[10px] border-gray-200 px-2"
                      type="button"
                      onClick={() => {
                        // This would typically archive the space
                        alert("This would archive the space.");
                      }}
                    >
                      Archive
                    </Button>
                  </div>
                </div>
                
                <div className="p-2 bg-white dark:bg-gray-900 border border-red-200 dark:border-red-900/30 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-medium">Delete Space</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                        Permanently remove this space
                      </p>
                    </div>
                    <Button 
                      variant="destructive"
                      size="sm"
                      className="h-6 text-[10px] px-2"
                      type="button"
                      onClick={() => {
                        // This would typically open a confirmation dialog
                        alert("This would delete the space permanently.");
                      }}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[860px] p-0 overflow-hidden rounded-lg shadow-xl border-0">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="px-6 pt-5 pb-4 border-b bg-white dark:bg-gray-950 flex-shrink-0">
            <div className="flex items-start">
              {space?.space_icon_URL ? (
                <img 
                  src={space.space_icon_URL} 
                  alt="Space Icon" 
                  className="w-9 h-9 mr-3 rounded-md object-cover" 
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMTZDMTQuMjA5MSAxNiAxNiAxNC4yMDkxIDE2IDEyQzE2IDkuNzkwODYgMTQuMjA5MSA4IDEyIDhDOS43OTA4NiA4IDggOS43OTA4NiA4IDEyQzggMTQuMjA5MSA5Ljc5MDg2IDE2IDEyIDE2WiIgc3Ryb2tlPSIjNjk3MDg2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0zIDEyQzMgMTIgNyAyMSAxMiAyMUMxNyAyMSAyMSAxMiAyMSAxMkMyMSAxMiAxNyAzIDEyIDNDNyAzIDMgMTIgMyAxMloiIHN0cm9rZT0iIzY5NzA4NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=';
                  }}
                />
              ) : (
                <div className="w-9 h-9 mr-3 bg-primary-100 dark:bg-primary-900/30 rounded-md flex items-center justify-center text-primary-600 dark:text-primary-300">
                  <FileImage className="h-4 w-4" />
                </div>
              )}
              <div>
                <DialogTitle className="text-lg font-medium tracking-tight text-gray-900 dark:text-white">
                  {name ? `Edit ${name}` : 'Edit Space'}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                  Manage space settings and appearance
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex h-[520px] overflow-hidden">
            {/* Sidebar */}
            <div className="w-48 bg-gray-50 dark:bg-gray-900/70 overflow-y-auto flex-shrink-0">
              <nav className="p-2 space-y-0.5">
                {[
                  { id: 'general', label: 'General', icon: Layout },
                  { id: 'permissions', label: 'Permissions', icon: Users },
                  { id: 'seo', label: 'SEO', icon: Search },
                  { id: 'layout', label: 'Display', icon: Layout },
                  { id: 'customize', label: 'Customize', icon: Settings }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    className={cn(
                      "w-full flex items-center px-3 py-2 text-sm rounded-md transition-all text-left",
                      activeTab === tab.id
                        ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white font-medium border border-gray-100 dark:border-gray-700"
                        : "text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/70 hover:shadow-sm"
                    )}
                    onClick={() => setActiveTab(tab.id as TabType)}
                  >
                    <tab.icon className="h-4 w-4 mr-2.5 opacity-80" />
                    {tab.label}
                  </button>
                ))}
                
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-1.5"></div>
                
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm rounded-md transition-all text-left",
                    activeTab === 'danger'
                      ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 font-medium border border-red-100 dark:border-red-800/50"
                      : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                  )}
                  onClick={() => setActiveTab('danger')}
                >
                  <AlertTriangle className="h-4 w-4 mr-2.5 opacity-80" />
                  Danger Zone
                </button>
              </nav>
            </div>
            
            {/* Main content */}
            <div className="flex-1 bg-white dark:bg-gray-950 overflow-y-auto">
              <div className="py-5 px-6">
                {renderTabContent()}
                
                {/* Error and success messages */}
                {error && (
                  <div className="text-sm text-red-500 mt-5 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-md flex items-start">
                    <AlertTriangle className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                    <div>{error}</div>
                  </div>
                )}
                
                {success && (
                  <div className="text-sm text-green-500 mt-5 p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-md">
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-green-500 dark:bg-green-400 rounded-full mr-2"></div>
                      {success}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="border-t px-6 py-4 bg-gray-50 dark:bg-gray-900/70 flex-shrink-0">
            <div className="flex items-center justify-between w-full">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Last updated: {new Date().toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                  className="h-9 px-4"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="h-9 px-4 min-w-[100px] font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 