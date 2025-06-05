import { useState } from "react";
import {
  FileImage
} from "lucide-react";
import { PropertyRow } from "./PropertyRow";

export function CustomizeSettingsTab() {
  const [editingField, setEditingField] = useState<string | null>(null);
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
    <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
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
          isChild={true}
        />
      )}
    </div>
  );
} 