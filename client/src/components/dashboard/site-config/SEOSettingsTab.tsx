import { useState } from "react";
import {
  Heading,
  AlignLeft,
  Hash,
  Image,
  Search
} from "lucide-react";
import { PropertyRow } from "./PropertyRow";

export function SEOSettingsTab() {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [indexable, setIndexable] = useState(true);

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
      />

      <PropertyRow
        label="Keywords"
        value={keywords}
        fieldName="keywords"
        type="text"
        onValueChange={setKeywords}
        placeholder="Enter keywords"
        icon={Hash}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
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
      />

      <PropertyRow
        label="Search Indexable"
        value={indexable}
        fieldName="indexable"
        type="checkbox"
        onValueChange={setIndexable}
        icon={Search}
        editingField={editingField}
        onFieldClick={handleFieldClick}
        onFieldBlur={handleFieldBlur}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
} 