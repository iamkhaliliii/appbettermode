import { useState } from "react";
import {
  FileText,
  MessageSquare,
  Heart,
  Shield,
  ThumbsUp,
  Users,
  UserCheck,
  Crown,
  Ban
} from "lucide-react";
import { PropertyRow } from "./PropertyRow";

export function PermissionsSettingsTab() {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [whoCanPost, setWhoCanPost] = useState('all');
  const [whoCanReply, setWhoCanReply] = useState('all');
  const [whoCanReact, setWhoCanReact] = useState('all');
  const [moderationEnabled, setModerationEnabled] = useState(false);
  const [autoApprove, setAutoApprove] = useState(true);

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
    <div className="space-y-0">
      <PropertyRow
        label="Who Can Post"
        value={whoCanPost}
        fieldName="whoCanPost"
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
        onValueChange={setWhoCanPost}
        icon={FileText}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

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
      />

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
      />

      <PropertyRow
        label="Moderation"
        value={moderationEnabled}
        fieldName="moderation"
        type="checkbox"
        onValueChange={setModerationEnabled}
        icon={Shield}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />

      <PropertyRow
        label="Auto Approve"
        value={autoApprove}
        fieldName="autoApprove"
        type="checkbox"
        onValueChange={setAutoApprove}
        icon={ThumbsUp}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
} 