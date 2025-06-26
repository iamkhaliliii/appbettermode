import { useState, useCallback } from "react";
import {
  Heading,
  AlignLeft,
  Image,
  Search
} from "lucide-react";
import { PropertyRow } from "./PropertyRow";

export function SEOSettingsTab() {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [indexable, setIndexable] = useState(true);

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
        label="Meta Title"
        value={metaTitle}
        fieldName="metaTitle"
        type="text"
        onValueChange={setMetaTitle}
        placeholder="Enter meta title"
        icon={Heading}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
        description="Keep under 60 characters for better search visibility"
      />

      <PropertyRow
        label="Meta Description"
        value={metaDescription}
        fieldName="metaDescription"
        type="textarea"
        onValueChange={setMetaDescription}
        placeholder="Enter meta description"
        icon={AlignLeft}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
        description="155-160 characters summary for search results"
      />

      <PropertyRow
        label="OG Image"
        value={ogImage}
        fieldName="ogImage"
        type="upload"
        onValueChange={setOgImage}
        placeholder="Upload OG image"
        icon={Image}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
        description="Social media preview image (1200x630px recommended)"
      />

      <PropertyRow
        label="No index"
        value={indexable}
        fieldName="indexable"
        type="checkbox"
        onValueChange={setIndexable}
        icon={Search}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
        description="Hide this space from search engines and sitemaps"
      />
    </div>
  );
} 