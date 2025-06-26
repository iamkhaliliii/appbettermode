import { useState, useCallback } from "react";
import {
  FileImage
} from "lucide-react";
import { PropertyRow } from "./PropertyRow";

export function CustomizeSettingsTab() {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [spaceCover, setSpaceCover] = useState(false);
  const [spaceBannerUrl, setSpaceBannerUrl] = useState('');

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