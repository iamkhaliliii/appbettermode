import React, { useState, useEffect } from "react";
import { getApiBaseUrl } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, AlertTriangle, Users, Layout, Search, FileImage, Trash2, MessageSquare, ThumbsUp, Share, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
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
          <div className="space-y-5">
            <div className="grid gap-5">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  className="col-span-3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="slug" className="text-right font-medium">
                  Slug
                </Label>
                <Input
                  id="slug"
                  className="col-span-3"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                  title="Use lowercase letters, numbers, and hyphens only"
                />
              </div>
            </div>
            
            <div className="border-t pt-4 mt-2">
              <h3 className="font-medium text-sm mb-3">Visibility Settings</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="visibility" className="text-right font-medium">
                    Visibility
                  </Label>
                  <Select
                    value={visibility}
                    onValueChange={setVisibility}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="hidden" className="text-right font-medium">
                    Hidden
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hidden"
                      checked={hidden}
                      onCheckedChange={setHidden}
                    />
                    <Label htmlFor="hidden" className="cursor-pointer">
                      {hidden ? "Yes" : "No"}
                    </Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-2">
              <h3 className="font-medium text-sm mb-3">Space Identity</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="space_icon_url" className="text-right font-medium">
                    Space Icon URL
                  </Label>
                  <Input
                    id="space_icon_url"
                    className="col-span-3"
                    value={spaceIconUrl}
                    onChange={(e) => setSpaceIconUrl(e.target.value)}
                    placeholder="URL for space icon"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="space_banner_url" className="text-right font-medium">
                    Space Banner URL
                  </Label>
                  <Input
                    id="space_banner_url"
                    className="col-span-3"
                    value={spaceBannerUrl}
                    onChange={(e) => setSpaceBannerUrl(e.target.value)}
                    placeholder="URL for space banner"
                  />
                </div>
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-right text-xs text-gray-500 pt-1">
                    Preview
                  </div>
                  <div className="col-span-3 flex gap-3">
                    {spaceIconUrl ? (
                      <div className="p-2 border rounded flex-shrink-0">
                        <img 
                          src={spaceIconUrl} 
                          alt="Icon" 
                          className="h-14 w-14 object-contain" 
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMTZDMTQuMjA5MSAxNiAxNiAxNC4yMDkxIDE2IDEyQzE2IDkuNzkwODYgMTQuMjA5MSA4IDEyIDhDOS43OTA4NiA4IDggOS43OTA4NiA4IDEyQzggMTQuMjA5MSA5Ljc5MDg2IDE2IDEyIDE2WiIgc3Ryb2tlPSIjNjk3MDg2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0zIDEyQzMgMTIgNyAyMSAxMiAyMUMxNyAyMSAyMSAxMiAyMSAxMkMyMSAxMiAxNyAzIDEyIDNDNyAzIDMgMTIgMyAxMloiIHN0cm9rZT0iIzY5NzA4NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="p-2 border rounded flex-shrink-0 h-14 w-14 flex items-center justify-center text-gray-300">
                        <FileImage className="h-8 w-8" />
                      </div>
                    )}
                    
                    {spaceBannerUrl ? (
                      <div className="flex-1 p-2 border rounded">
                        <img 
                          src={spaceBannerUrl} 
                          alt="Banner" 
                          className="w-full h-14 object-cover rounded" 
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkgM0g1QzMuODk1NDMgMyAzIDMuODk1NDMgMyA1VjE5QzMgMjAuMTA0NiAzLjg5NTQzIDIxIDUgMjFIMTlDMjAuMTA0NiAyMSAyMSAyMC4xMDQ2IDIxIDE5VjVDMjEgMy44OTU0MyAyMC4xMDQ2IDMgMTkgM1oiIHN0cm9rZT0iIzY5NzA4NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNOC41IDEwQzkuMzI4NDMgMTAgMTAgOS4zMjg0MyAxMCA4LjVDMTAgNy42NzE1NyA5LjMyODQzIDcgOC41IDdDNy42NzE1NyA3IDcgNy42NzE1NyA3IDguNUM3IDkuMzI4NDMgNy42NzE1NyAxMCA4LjUgMTBaIiBzdHJva2U9IiM2OTcwODYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTIxIDE1TDE2IDEwTDUgMjEiIHN0cm9rZT0iIzY5NzA4NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex-1 border rounded h-14 flex items-center justify-center text-gray-300">
                        <FileImage className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'permissions':
        return (
          <div className="space-y-5">
            <div className="border-b pb-4 mb-2">
              <h3 className="font-medium mb-4">Access Control</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="invite_only" className="font-medium">
                          Invite Only
                        </Label>
                        <Switch
                          id="invite_only"
                          checked={inviteOnly}
                          onCheckedChange={setInviteOnly}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Only invited users can join this space
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="anyone_can_invite" className="font-medium">
                          Anyone Can Invite
                        </Label>
                        <Switch
                          id="anyone_can_invite"
                          checked={anyoneCanInvite}
                          onCheckedChange={setAnyoneCanInvite}
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Allow all members to invite new users
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Permission Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-2">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <h4 className="font-medium">Post</h4>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Who can create new posts
                  </p>
                  <Select
                    value={postPermission}
                    onValueChange={setPostPermission}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select permission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Everyone</SelectItem>
                      <SelectItem value="members">Members Only</SelectItem>
                      <SelectItem value="staff">Staff Only</SelectItem>
                      <SelectItem value="admin">Admin Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-300 mr-2">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <h4 className="font-medium">Reply</h4>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Who can reply to posts
                  </p>
                  <Select
                    value={replyPermission}
                    onValueChange={setReplyPermission}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select permission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Everyone</SelectItem>
                      <SelectItem value="members">Members Only</SelectItem>
                      <SelectItem value="staff">Staff Only</SelectItem>
                      <SelectItem value="admin">Admin Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300 mr-2">
                      <ThumbsUp className="h-4 w-4" />
                    </div>
                    <h4 className="font-medium">React</h4>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Who can react to posts
                  </p>
                  <Select
                    value={reactPermission}
                    onValueChange={setReactPermission}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select permission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Everyone</SelectItem>
                      <SelectItem value="members">Members Only</SelectItem>
                      <SelectItem value="staff">Staff Only</SelectItem>
                      <SelectItem value="admin">Admin Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'seo':
        return (
          <div className="space-y-5">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-5 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-300 mr-3">
                  <Search className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium">Search Engine Optimization</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Optimize how this space appears in search results
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="meta_title" className="text-right font-medium">
                    Meta Title
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Input
                      id="meta_title"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder={name || "SEO title (if different from space name)"}
                      className="border-gray-200 dark:border-gray-700"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {metaTitle.length > 0 ? metaTitle.length : 0}/60 characters recommended
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="meta_description" className="text-right font-medium pt-2">
                    Meta Description
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Textarea
                      id="meta_description"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      rows={3}
                      placeholder="A brief description of this space for search engines"
                      className="border-gray-200 dark:border-gray-700"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {metaDescription.length > 0 ? metaDescription.length : 0}/160 characters recommended
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-5 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 dark:text-pink-300 mr-3">
                  <Share className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium">Social Sharing</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Control how this space appears when shared on social media
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="ogg_url" className="text-right font-medium pt-2">
                  Social Image URL
                </Label>
                <div className="col-span-3">
                  <div className="space-y-3">
                    <Input
                      id="ogg_url"
                      value={oggUrl}
                      onChange={(e) => setOggUrl(e.target.value)}
                      placeholder="URL for social media preview image"
                      className="border-gray-200 dark:border-gray-700"
                    />
                    
                    {oggUrl && (
                      <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <img 
                          src={oggUrl} 
                          alt="Social Media Preview" 
                          className="w-full h-32 object-cover" 
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkgM0g1QzMuODk1NDMgMyAzIDMuODk1NDMgMyA1VjE5QzMgMjAuMTA0NiAzLjg5NTQzIDIxIDUgMjFIMTlDMjAuMTA0NiAyMSAyMSAyMC4xMDQ2IDIxIDE5VjVDMjEgMy44OTU0MyAyMC4xMDQ2IDMgMTkgM1oiIHN0cm9rZT0iIzY5NzA4NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNOC41IDEwQzkuMzI4NDMgMTAgMTAgOS4zMjg0MyAxMCA4LjVDMTAgNy42NzE1NyA5LjMyODQzIDcgOC41IDdDNy42NzE1NyA3IDcgNy42NzE1NyA3IDguNUM3IDkuMzI4NDMgNy42NzE1NyAxMCA4LjUgMTBaIiBzdHJva2U9IiM2OTcwODYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTIxIDE1TDE2IDEwTDUgMjEiIHN0cm9rZT0iIzY5NzA4NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=';
                          }}
                        />
                        <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-sm font-medium truncate">{metaTitle || name || "Space Title"}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{metaDescription || description || "Space description would appear here..."}</div>
                        </div>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Recommended size: 1200x630 pixels with 1.91:1 aspect ratio
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'layout':
        return (
          <div className="space-y-5">
            <div className="border-b pb-5 mb-4">
              <h3 className="font-medium mb-4">Display Mode</h3>
              <div className="grid grid-cols-3 gap-3">
                <div 
                  className={cn(
                    "border rounded-lg p-3 cursor-pointer transition-colors",
                    layoutMode === 'list' 
                      ? "bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-700" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setLayoutMode('list')}
                >
                  <div className="flex justify-center mb-2">
                    <div className="h-16 w-full flex flex-col gap-1">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    </div>
                  </div>
                  <div className="text-center text-sm font-medium">List View</div>
                </div>
                
                <div 
                  className={cn(
                    "border rounded-lg p-3 cursor-pointer transition-colors",
                    layoutMode === 'gallery' 
                      ? "bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-700" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setLayoutMode('gallery')}
                >
                  <div className="flex justify-center mb-2">
                    <div className="h-16 w-full grid grid-cols-2 gap-1">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  <div className="text-center text-sm font-medium">Gallery</div>
                </div>
                
                <div 
                  className={cn(
                    "border rounded-lg p-3 cursor-pointer transition-colors",
                    layoutMode === 'cards' 
                      ? "bg-primary-50 border-primary-200 dark:bg-primary-900/20 dark:border-primary-700" 
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setLayoutMode('cards')}
                >
                  <div className="flex justify-center mb-2">
                    <div className="h-16 w-full grid grid-cols-2 gap-2">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded flex flex-col">
                        <div className="h-2/3 bg-gray-300 dark:bg-gray-600 rounded-t"></div>
                        <div className="h-1/3 flex items-center justify-center">
                          <div className="w-2/3 h-1 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        </div>
                      </div>
                      <div className="bg-gray-200 dark:bg-gray-700 rounded flex flex-col">
                        <div className="h-2/3 bg-gray-300 dark:bg-gray-600 rounded-t"></div>
                        <div className="h-1/3 flex items-center justify-center">
                          <div className="w-2/3 h-1 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-sm font-medium">Cards</div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Layout Presets</h3>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  className={cn(
                    "border rounded-lg p-4 text-left transition-colors",
                    "hover:bg-gray-50 dark:hover:bg-gray-800/70"
                  )}
                  onClick={() => {
                    setLayoutMode('list');
                    setItemsPerPage('20');
                    setSidebarPosition('right');
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
                      <Layout className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">Forum Layout</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">List view optimized for discussions</div>
                    </div>
                  </div>
                </button>
                
                <button 
                  type="button"
                  className={cn(
                    "border rounded-lg p-4 text-left transition-colors",
                    "hover:bg-gray-50 dark:hover:bg-gray-800/70"
                  )}
                  onClick={() => {
                    setLayoutMode('gallery');
                    setItemsPerPage('30');
                    setSidebarPosition('left');
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-300 mr-3">
                      <Layout className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">Gallery Layout</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Grid view for visual content</div>
                    </div>
                  </div>
                </button>
                
                <button 
                  type="button"
                  className={cn(
                    "border rounded-lg p-4 text-left transition-colors",
                    "hover:bg-gray-50 dark:hover:bg-gray-800/70"
                  )}
                  onClick={() => {
                    setLayoutMode('cards');
                    setItemsPerPage('10');
                    setSidebarPosition('none');
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-300 mr-3">
                      <Layout className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">Blog Layout</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Card view for featured articles</div>
                    </div>
                  </div>
                </button>
                
                <button 
                  type="button"
                  className={cn(
                    "border rounded-lg p-4 text-left transition-colors",
                    "hover:bg-gray-50 dark:hover:bg-gray-800/70"
                  )}
                  onClick={() => {
                    setLayoutMode('list');
                    setItemsPerPage('50');
                    setSidebarPosition('right');
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-300 mr-3">
                      <Layout className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium mb-1">Knowledge Base</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Compact view for documentation</div>
                    </div>
                  </div>
                </button>
              </div>
              
              <div className="mt-8 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <div className="w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 mr-2">
                  <span className="text-xs">ℹ</span>
                </div>
                <p>Select a preset to quickly apply optimized layout settings</p>
              </div>
            </div>
          </div>
        );

      case 'customize':
        return (
          <div className="space-y-5">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-5 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-300 mr-3">
                  <FileImage className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium">Content Fields</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Customize which fields are shown in {cmsType} content
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                {Object.keys(fieldVisibility).map(field => (
                  <div key={field} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 rounded-md bg-white dark:bg-gray-900">
                    <div className="flex items-center">
                      <div className="capitalize font-medium">{field}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Label htmlFor={`field-${field}`} className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                        Visible
                      </Label>
                      <Switch
                        id={`field-${field}`}
                        checked={fieldVisibility[field]}
                        onCheckedChange={(checked) => {
                          setFieldVisibility(prev => ({
                            ...prev,
                            [field]: checked
                          }));
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-5 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
                  <Settings className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-medium">Custom Field Labels</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Rename fields to match your content structure
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                {Object.keys(fieldVisibility).filter(field => fieldVisibility[field]).map(field => (
                  <div key={field} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={`label-${field}`} className="text-right capitalize font-medium">
                      {field}
                    </Label>
                    <Input
                      id={`label-${field}`}
                      className="col-span-3"
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
              </div>
            </div>
          </div>
        );

      case 'danger':
        return (
          <div className="space-y-5">
            <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-5 border border-red-200 dark:border-red-800">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-300 mr-4 mt-0.5 flex-shrink-0">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-red-700 dark:text-red-400 text-lg">Danger Zone</h3>
                  <p className="text-sm text-red-600 dark:text-red-300 mt-1 mb-4">
                    These actions cannot be undone. Please be careful.
                  </p>
                  
                  <div className="space-y-5">
                    <div className="p-4 bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">Archive Space</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Hide this space from navigation but keep all content.
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          className="border-red-200 hover:bg-red-50 hover:text-red-600"
                          type="button"
                          onClick={() => {
                            // This would typically archive the space
                            alert("This feature would archive the space.");
                          }}
                        >
                          Archive
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">Delete Space</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Permanently delete this space and all its content.
                          </p>
                        </div>
                        <Button 
                          variant="destructive"
                          type="button"
                          onClick={() => {
                            // This would typically open a confirmation dialog
                            alert("This feature would delete the space permanently.");
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
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
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-6 pb-4 border-b bg-white dark:bg-gray-950">
            <div className="flex items-center">
              {space?.space_icon_URL ? (
                <img 
                  src={space.space_icon_URL} 
                  alt="Space Icon" 
                  className="w-8 h-8 mr-3 rounded" 
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMTZDMTQuMjA5MSAxNiAxNiAxNC4yMDkxIDE2IDEyQzE2IDkuNzkwODYgMTQuMjA5MSA4IDEyIDhDOS43OTA4NiA4IDggOS43OTA4NiA4IDEyQzggMTQuMjA5MSA5Ljc5MDg2IDE2IDEyIDE2WiIgc3Ryb2tlPSIjNjk3MDg2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0zIDEyQzMgMTIgNyAyMSAxMiAyMUMxNyAyMSAyMSAxMiAyMSAxMkMyMSAxMiAxNyAzIDEyIDNDNyAzIDMgMTIgMyAxMloiIHN0cm9rZT0iIzY5NzA4NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=';
                  }}
                />
              ) : (
                <div className="w-8 h-8 mr-3 bg-primary-100 dark:bg-primary-900/30 rounded flex items-center justify-center text-primary-600 dark:text-primary-300">
                  <FileImage className="h-4 w-4" />
                </div>
              )}
              <div>
                <DialogTitle className="text-lg">{name || 'Edit Space'}</DialogTitle>
                <DialogDescription className="text-sm">
                  Customize your space settings and properties
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex h-[520px]">
            {/* Sidebar */}
            <div className="w-52 border-r bg-gray-50 dark:bg-gray-900/70 overflow-y-auto p-3">
              <nav className="space-y-1.5">
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center px-3.5 py-2.5 text-sm rounded-md transition-all text-left",
                    activeTab === 'general'
                      ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white font-medium border border-gray-100 dark:border-gray-700"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/70 hover:shadow-sm"
                  )}
                  onClick={() => setActiveTab('general')}
                >
                  <Layout className="h-4 w-4 mr-2.5 opacity-80" />
                  General
                </button>
                
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center px-3.5 py-2.5 text-sm rounded-md transition-all text-left",
                    activeTab === 'permissions'
                      ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white font-medium border border-gray-100 dark:border-gray-700"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/70 hover:shadow-sm"
                  )}
                  onClick={() => setActiveTab('permissions')}
                >
                  <Users className="h-4 w-4 mr-2.5 opacity-80" />
                  Permissions
                </button>
                
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center px-3.5 py-2.5 text-sm rounded-md transition-all text-left",
                    activeTab === 'seo'
                      ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white font-medium border border-gray-100 dark:border-gray-700"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/70 hover:shadow-sm"
                  )}
                  onClick={() => setActiveTab('seo')}
                >
                  <Search className="h-4 w-4 mr-2.5 opacity-80" />
                  SEO
                </button>
                
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center px-3.5 py-2.5 text-sm rounded-md transition-all text-left",
                    activeTab === 'layout'
                      ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white font-medium border border-gray-100 dark:border-gray-700"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/70 hover:shadow-sm"
                  )}
                  onClick={() => setActiveTab('layout')}
                >
                  <FileImage className="h-4 w-4 mr-2.5 opacity-80" />
                  Display Settings
                </button>
                
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center px-3.5 py-2.5 text-sm rounded-md transition-all text-left",
                    activeTab === 'customize'
                      ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white font-medium border border-gray-100 dark:border-gray-700"
                      : "text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-800/70 hover:shadow-sm"
                  )}
                  onClick={() => setActiveTab('customize')}
                >
                  <FileImage className="h-4 w-4 mr-2.5 opacity-80" />
                  Customize Fields
                </button>
              </nav>
              
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-4"></div>
              
              <button
                type="button"
                className={cn(
                  "w-full flex items-center px-3.5 py-2.5 text-sm rounded-md transition-all text-left",
                  activeTab === 'danger'
                    ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 font-medium border border-red-100 dark:border-red-800/50"
                    : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                )}
                onClick={() => setActiveTab('danger')}
              >
                <AlertTriangle className="h-4 w-4 mr-2.5 opacity-80" />
                Danger Zone
              </button>
            </div>
            
            {/* Main content */}
            <div className="flex-1 bg-white dark:bg-gray-950 overflow-y-auto">
              <div className="py-6 px-7">
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
          
          <DialogFooter className="border-t px-6 py-4 bg-gray-50 dark:bg-gray-900/70">
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
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="min-w-[100px] font-medium">
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