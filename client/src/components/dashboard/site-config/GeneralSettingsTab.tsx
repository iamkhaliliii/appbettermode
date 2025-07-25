import { useState, useCallback, useMemo } from "react";
import {
  Image,
  Heading,
  AlignLeft,
  Link,
  Globe,
  Lock,
  UserPlus,
  Users,
  FileText,
  UserCheck,
  Crown,
  Ban,
  MessageSquare,
  Heart,
  Smile,
  ArrowUpDown,
  ImageIcon,
  Folder,
  Plus,
  Search,
  EyeOff
} from "lucide-react";
import { PropertyRow } from "./PropertyRow";

interface GeneralSettingsTabProps {
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  slug: string;
  setSlug: (value: string) => void;
  spaceIconUrl: string;
  setSpaceIconUrl: (value: string) => void;
  visibility: string;
  setVisibility: (value: string) => void;
  inviteOnly: boolean;
  setInviteOnly: (value: boolean) => void;
  anyoneCanInvite: boolean;
  setAnyoneCanInvite: (value: boolean) => void;
  enableComments: boolean;
  setEnableComments: (value: boolean) => void;
  enableReactions: boolean;
  setEnableReactions: (value: boolean) => void;
  reactionType: string;
  setReactionType: (value: string) => void;
  whoCanReply: string;
  setWhoCanReply: (value: string) => void;
  whoCanReact: string;
  setWhoCanReact: (value: string) => void;
  selectedFolder: string;
  setSelectedFolder: (value: string) => void;
  isLoading: boolean;
}

export function GeneralSettingsTab({
  name,
  setName,
  description,
  setDescription,
  slug,
  setSlug,
  spaceIconUrl,
  setSpaceIconUrl,
  visibility,
  setVisibility,
  inviteOnly,
  setInviteOnly,
  anyoneCanInvite,
  setAnyoneCanInvite,
  enableComments,
  setEnableComments,
  enableReactions,
  setEnableReactions,
  reactionType,
  setReactionType,
  whoCanReply,
  setWhoCanReply,
  whoCanReact,
  setWhoCanReact,
  selectedFolder,
  setSelectedFolder,
  isLoading
}: GeneralSettingsTabProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newContentPermission, setNewContentPermission] = useState('all');

  // Memoized folders - in real app this would come from API
  const folders = useMemo(() => [
    { id: 'root', name: 'Root', path: '/' },
    { id: 'general', name: 'General', path: '/general' },
    { id: 'support', name: 'Support', path: '/support' },
    { id: 'community', name: 'Community', path: '/community' },
    { id: 'announcements', name: 'Announcements', path: '/announcements' },
    { id: 'feedback', name: 'Feedback', path: '/feedback' }
  ], []);

  // Optimized event handlers
  const handleFieldClick = useCallback((fieldName: string) => {
    setEditingField(fieldName);
  }, []);

  const handleFieldBlur = useCallback(() => {
    setEditingField(null);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, fieldName: string) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setEditingField(null);
    }
  }, []);

  // Memoized options
  const visibilityOptions = useMemo(() => [
    { 
      value: 'public', 
      label: 'Public',
      description: 'Anyone can discover and view this space',
      icon: Globe
    },
    { 
      value: 'private', 
      label: 'Private',
      description: 'Only invited members can access this space',
      icon: Lock
    },
    { 
      value: 'hidden', 
      label: 'Private and hidden',
      description: 'Completely hidden from discovery, invitation only',
      icon: EyeOff
    }
  ], []);

  const contentPermissionOptions = useMemo(() => [
    { 
      value: 'all', 
      label: 'All members',
      description: 'Any member of the community can create posts',
      icon: Users
    },
    { 
      value: 'space_members', 
      label: 'Space members, space admins, and staff',
      description: 'Only space members and above can create posts',
      icon: UserCheck
    },
    { 
      value: 'space_admins', 
      label: 'Space admins and staff',
      description: 'Only space administrators and staff can create posts',
      icon: Crown
    },
    { 
      value: 'nobody', 
      label: 'Nobody',
      description: 'No one can create new posts in this space',
      icon: Ban
    }
  ], []);

  const replyOptions = useMemo(() => [
    { 
      value: 'all', 
      label: 'All members',
      description: 'Any member can reply to posts and comments',
      icon: Users
    },
    { 
      value: 'space_members', 
      label: 'Space members, space admins, and staff',
      description: 'Only space members and above can reply',
      icon: UserCheck
    },
    { 
      value: 'space_admins', 
      label: 'Space admins and staff',
      description: 'Only space administrators and staff can reply',
      icon: Crown
    },
    { 
      value: 'nobody', 
      label: 'Nobody',
      description: 'No one can reply to posts in this space',
      icon: Ban
    }
  ], []);

  const reactionOptions = useMemo(() => [
    { 
      value: 'emoji', 
      label: 'Emoji',
      description: 'Allow users to react with various emoji expressions',
      icon: Smile
    },
    { 
      value: 'upvote_downvote', 
      label: 'Up vote down vote',
      description: 'Simple upvote and downvote system like Reddit',
      icon: ArrowUpDown
    },
    { 
      value: 'simple_like', 
      label: 'Simple like',
      description: 'Basic like button similar to social media',
      icon: Heart
    }
  ], []);

  const folderOptions = useMemo(() => folders.map(folder => ({
    value: folder.id,
    label: folder.name,
    description: `Place this space in ${folder.path}`,
    icon: Folder
  })), [folders]);

  return (
    <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
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
        isIconUpload={true}
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
        label="Folder"
        value={selectedFolder}
        fieldName="folder"
        type="select"
        options={folderOptions}
        onValueChange={setSelectedFolder}
        icon={Folder}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
        description="Choose which folder this space belongs to"
      />

      <PropertyRow
        label="Visibility"
        value={visibility}
        fieldName="visibility"
        type="select"
        options={visibilityOptions}
        onValueChange={setVisibility}
        icon={visibility === 'public' ? Globe : visibility === 'private' ? Lock : EyeOff}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
        description="Controls who can discover and access this space"
      />

      <PropertyRow
        label="Who can post"
        value={newContentPermission}
        fieldName="newContentPermission"
        type="select"
        options={contentPermissionOptions}
        onValueChange={setNewContentPermission}
        icon={FileText}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
        description="Control who has permission to create new content in this space"
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
        description="When enabled, only invited users can join this space"
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
        description="Allow any member to invite others to this space"
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

      {enableComments && (
        <PropertyRow
          label="Who Can Reply"
          value={whoCanReply}
          fieldName="whoCanReply"
          type="select"
          options={replyOptions}
          onValueChange={setWhoCanReply}
          icon={MessageSquare}
          editingField={editingField}
          onFieldClick={handleFieldClick}
          onFieldBlur={handleFieldBlur}
          onKeyDown={handleKeyDown}
          isChild={true}
        />
      )}

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
        <>
          <PropertyRow
            label="Who Can React"
            value={whoCanReact}
            fieldName="whoCanReact"
            type="select"
            options={replyOptions}
            onValueChange={setWhoCanReact}
            icon={Heart}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
            isChild={true}
          />

          <PropertyRow
            label="Reaction type"
            value={reactionType}
            fieldName="reactionType"
            type="select"
            options={reactionOptions}
            onValueChange={setReactionType}
            icon={reactionType === 'emoji' ? Smile : reactionType === 'upvote_downvote' ? ArrowUpDown : Heart}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
            isChild={true}
            description="Choose how users can react to content"
          />
        </>
      )}
    </div>
  );
} 