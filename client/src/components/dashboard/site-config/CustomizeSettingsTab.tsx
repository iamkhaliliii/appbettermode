import { useState } from "react";
import {
  Pin,
  MessageSquare,
  Heart,
  Smile,
  ArrowUpDown,
  FileImage
} from "lucide-react";
import { PropertyRow } from "./PropertyRow";

export function CustomizeSettingsTab() {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [pinPost, setPinPost] = useState(false);
  const [enableComments, setEnableComments] = useState(true);
  const [enableReactions, setEnableReactions] = useState(true);
  const [reactionType, setReactionType] = useState('emoji');
  const [spaceCover, setSpaceCover] = useState(false);
  const [spaceBannerUrl, setSpaceBannerUrl] = useState('');

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
        label="Space Cover"
        value={spaceCover}
        fieldName="spaceCover"
        type="checkbox"
        onValueChange={setSpaceCover}
        icon={FileImage}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
        description="Enable banner image display at the top of the space"
      />

      {spaceCover && (
        <PropertyRow
          label="Banner"
          value={spaceBannerUrl}
          fieldName="banner"
          type="upload"
          onValueChange={setSpaceBannerUrl}
          placeholder="Upload banner"
          icon={FileImage}
          editingField={editingField}
          onFieldClick={handleFieldClick}
          onFieldBlur={handleFieldBlur}
          onKeyDown={handleKeyDown}
        />
      )}

      <PropertyRow
        label="Pin post"
        value={pinPost}
        fieldName="pinPost"
        type="checkbox"
        onValueChange={setPinPost}
        icon={Pin}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
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
        />
      )}
    </div>
  );
} 