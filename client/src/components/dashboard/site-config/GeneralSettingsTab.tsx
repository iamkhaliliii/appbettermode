import { useState } from "react";
import {
  Image,
  Heading,
  AlignLeft,
  FileImage,
  Link,
  Globe,
  Lock,
  UserPlus,
  Users
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
  isLoading
}: GeneralSettingsTabProps) {
  const [editingField, setEditingField] = useState<string | null>(null);

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
      />
    </div>
  );
} 