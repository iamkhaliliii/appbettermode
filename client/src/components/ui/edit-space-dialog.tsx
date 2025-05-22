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
import { Loader2, AlertTriangle, Users, Layout, Search, FileImage, Trash2 } from "lucide-react";
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

type TabType = 'general' | 'permissions' | 'seo' | 'layout' | 'danger';

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
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
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
              <Label htmlFor="description" className="text-right">
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
              <Label htmlFor="slug" className="text-right">
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="visibility" className="text-right">
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
              <Label htmlFor="hidden" className="text-right">
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
        );

      case 'permissions':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="invite_only" className="text-right">
                Invite Only
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="invite_only"
                  checked={inviteOnly}
                  onCheckedChange={setInviteOnly}
                />
                <Label htmlFor="invite_only" className="cursor-pointer">
                  {inviteOnly ? "Yes" : "No"}
                </Label>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="anyone_can_invite" className="text-right">
                Anyone Can Invite
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="anyone_can_invite"
                  checked={anyoneCanInvite}
                  onCheckedChange={setAnyoneCanInvite}
                />
                <Label htmlFor="anyone_can_invite" className="cursor-pointer">
                  {anyoneCanInvite ? "Yes" : "No"}
                </Label>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="post_permission" className="text-right">
                Post Permission
              </Label>
              <Select
                value={postPermission}
                onValueChange={setPostPermission}
              >
                <SelectTrigger className="col-span-3">
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reply_permission" className="text-right">
                Reply Permission
              </Label>
              <Select
                value={replyPermission}
                onValueChange={setReplyPermission}
              >
                <SelectTrigger className="col-span-3">
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
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="react_permission" className="text-right">
                React Permission
              </Label>
              <Select
                value={reactPermission}
                onValueChange={setReactPermission}
              >
                <SelectTrigger className="col-span-3">
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
        );

      case 'seo':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meta_title" className="text-right">
                Meta Title
              </Label>
              <Input
                id="meta_title"
                className="col-span-3"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="SEO title (if different from space name)"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meta_description" className="text-right">
                Meta Description
              </Label>
              <Textarea
                id="meta_description"
                className="col-span-3"
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                rows={3}
                placeholder="SEO description"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ogg_url" className="text-right">
                OG Image URL
              </Label>
              <Input
                id="ogg_url"
                className="col-span-3"
                value={oggUrl}
                onChange={(e) => setOggUrl(e.target.value)}
                placeholder="URL for social media sharing image"
              />
            </div>
          </div>
        );

      case 'layout':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="space_icon_url" className="text-right">
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
              <Label htmlFor="space_banner_url" className="text-right">
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
            
            {spaceIconUrl && (
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="text-right text-xs text-gray-500">
                  Icon Preview
                </div>
                <div className="col-span-3 p-2 border rounded">
                  <img 
                    src={spaceIconUrl} 
                    alt="Space Icon Preview" 
                    className="h-16 w-16 object-contain" 
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMTZDMTQuMjA5MSAxNiAxNiAxNC4yMDkxIDE2IDEyQzE2IDkuNzkwODYgMTQuMjA5MSA4IDEyIDhDOS43OTA4NiA4IDggOS43OTA4NiA4IDEyQzggMTQuMjA5MSA5Ljc5MDg2IDE2IDEyIDE2WiIgc3Ryb2tlPSIjNjk3MDg2IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0zIDEyQzMgMTIgNyAyMSAxMiAyMUMxNyAyMSAyMSAxMiAyMSAxMkMyMSAxMiAxNyAzIDEyIDNDNyAzIDMgMTIgMyAxMloiIHN0cm9rZT0iIzY5NzA4NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=';
                    }}
                  />
                </div>
              </div>
            )}

            {spaceBannerUrl && (
              <div className="grid grid-cols-4 items-start gap-4">
                <div className="text-right text-xs text-gray-500">
                  Banner Preview
                </div>
                <div className="col-span-3 p-2 border rounded">
                  <img 
                    src={spaceBannerUrl} 
                    alt="Space Banner Preview" 
                    className="w-full h-32 object-cover rounded" 
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTkgM0g1QzMuODk1NDMgMyAzIDMuODk1NDMgMyA1VjE5QzMgMjAuMTA0NiAzLjg5NTQzIDIxIDUgMjFIMTlDMjAuMTA0NiAyMSAyMSAyMC4xMDQ2IDIxIDE5VjVDMjEgMy44OTU0MyAyMC4xMDQ2IDMgMTkgM1oiIHN0cm9rZT0iIzY5NzA4NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNOC41IDEwQzkuMzI4NDMgMTAgMTAgOS4zMjg0MyAxMCA4LjVDMTAgNy42NzE1NyA5LjMyODQzIDcgOC41IDdDNy42NzE1NyA3IDcgNy42NzE1NyA3IDguNUM3IDkuMzI4NDMgNy42NzE1NyAxMCA4LjUgMTBaIiBzdHJva2U9IiM2OTcwODYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTIxIDE1TDE2IDEwTDUgMjEiIHN0cm9rZT0iIzY5NzA4NiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 'danger':
        return (
          <div className="space-y-4">
            <div className="p-4 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/10 dark:border-red-800">
              <h3 className="font-semibold text-red-800 dark:text-red-400 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Danger Zone
              </h3>
              <p className="text-sm text-red-600 dark:text-red-300 mt-2">
                These actions cannot be undone. Please be careful.
              </p>
              
              <div className="mt-4">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  type="button"
                  onClick={() => {
                    // This would typically open a confirmation dialog
                    alert("This feature is not implemented yet. It would delete the space.");
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Space
                </Button>
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
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle>Edit Space</DialogTitle>
            <DialogDescription>
              Customize your space settings and properties.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex h-[500px]">
            {/* Sidebar */}
            <div className="w-48 border-r bg-gray-50 dark:bg-gray-900 overflow-y-auto">
              <nav className="p-2 space-y-1">
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center px-4 py-2 text-sm rounded-md text-left",
                    activeTab === 'general'
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setActiveTab('general')}
                >
                  <Layout className="h-4 w-4 mr-2 opacity-70" />
                  General
                </button>
                
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center px-4 py-2 text-sm rounded-md text-left",
                    activeTab === 'permissions'
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setActiveTab('permissions')}
                >
                  <Users className="h-4 w-4 mr-2 opacity-70" />
                  Permissions
                </button>
                
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center px-4 py-2 text-sm rounded-md text-left",
                    activeTab === 'seo'
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setActiveTab('seo')}
                >
                  <Search className="h-4 w-4 mr-2 opacity-70" />
                  SEO
                </button>
                
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center px-4 py-2 text-sm rounded-md text-left",
                    activeTab === 'layout'
                      ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setActiveTab('layout')}
                >
                  <FileImage className="h-4 w-4 mr-2 opacity-70" />
                  Layout
                </button>
                
                <button
                  type="button"
                  className={cn(
                    "w-full flex items-center px-4 py-2 text-sm rounded-md text-left mt-auto",
                    activeTab === 'danger'
                      ? "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 font-medium"
                      : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                  )}
                  onClick={() => setActiveTab('danger')}
                >
                  <AlertTriangle className="h-4 w-4 mr-2 opacity-70" />
                  Danger Zone
                </button>
              </nav>
            </div>
            
            {/* Main content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {renderTabContent()}
              
              {/* Error and success messages */}
              {error && (
                <div className="text-sm text-red-500 mt-4 p-2 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="text-sm text-green-500 mt-4 p-2 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded">
                  {success}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="border-t px-6 py-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 