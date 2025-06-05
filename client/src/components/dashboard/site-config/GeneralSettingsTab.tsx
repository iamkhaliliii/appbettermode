import { useState } from "react";
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
  ArrowUpDown
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
  spaceBannerUrl: string;
  setSpaceBannerUrl: (value: string) => void;
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
  spaceBannerUrl,
  setSpaceBannerUrl,
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
  isLoading
}: GeneralSettingsTabProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newContentPermission, setNewContentPermission] = useState('all');

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
        label="Visibility"
        value={visibility}
        fieldName="visibility"
        type="select"
        options={[
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
          }
        ]}
        onValueChange={setVisibility}
        icon={visibility === 'public' ? Globe : Lock}
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
        options={[
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
        ]}
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
          options={[
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
          ]}
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
            options={[
              { 
                value: 'all', 
                label: 'All members',
                description: 'Any member can react to posts and comments',
                icon: Users
              },
              { 
                value: 'space_members', 
                label: 'Space members, space admins, and staff',
                description: 'Only space members and above can react',
                icon: UserCheck
              },
              { 
                value: 'space_admins', 
                label: 'Space admins and staff',
                description: 'Only space administrators and staff can react',
                icon: Crown
              },
              { 
                value: 'nobody', 
                label: 'Nobody',
                description: 'No one can react to content in this space',
                icon: Ban
              }
            ]}
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
            options={[
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
            ]}
            onValueChange={setReactionType}
            icon={Smile}
            editingField={editingField}
            onFieldClick={handleFieldClick}
            onFieldBlur={handleFieldBlur}
            onKeyDown={handleKeyDown}
            isChild={true}
          />
        </>
      )}
    </div>
  );
} 