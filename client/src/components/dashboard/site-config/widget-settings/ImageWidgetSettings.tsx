import React, { useState } from 'react';
import { 
  Image, 
  Upload, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Maximize,
  Minimize,
  Ratio,
  Link,
  ExternalLink,
  Eye,
  Type,
  Grid,
  Images,
  Square,
  CreditCard,
  Package
} from 'lucide-react';
import { PropertyRow } from '../PropertyRow';

interface ImageWidgetSettingsProps {
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

export function ImageWidgetSettings({
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown
}: ImageWidgetSettingsProps) {
  const [size, setSize] = useState('full');

  return (
    <div className="space-y-2">
      <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
        <PropertyRow
          label="Display Mode"
          value="single"
          fieldName="imageDisplayMode"
          type="select"
          options={[
            { value: 'single', label: 'Single Image', icon: Image },
            { value: 'gallery', label: 'Image Gallery', icon: Grid },
            { value: 'slideshow', label: 'Slideshow', icon: Images }
          ]}
          onValueChange={() => {}}
          icon={Image}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="How to display the image(s)"
        />

        <PropertyRow
          label="Image file"
          value=""
          fieldName="imageFile"
          type="upload"
          onValueChange={() => {}}
          placeholder="Upload image file"
          icon={Upload}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Select or upload your image"
        />

        <PropertyRow
          label="Alt Text"
          value=""
          fieldName="imageAltText"
          type="text"
          onValueChange={() => {}}
          placeholder="Image description for accessibility"
          icon={Eye}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Alternative text for screen readers and SEO"
        />

        <PropertyRow
          label="Caption"
          value=""
          fieldName="imageCaption"
          type="text"
          onValueChange={() => {}}
          placeholder="Optional image caption"
          icon={Type}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Caption text displayed below the image"
        />

        <PropertyRow
          label="Size"
          value={size}
          fieldName="imageSize"
          type="select"
          options={[
            { value: 'full', label: 'Full', icon: Maximize },
            { value: 'fit', label: 'Fit', icon: Square },
            { value: 'half', label: 'Half', icon: Minimize },
            { value: 'tile', label: 'Tile', icon: Grid }
          ]}
          onValueChange={setSize}
          icon={Maximize}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Size of the image display"
        />

        {size !== 'full' && (
          <PropertyRow
            label="Alignment"
            value="center"
            fieldName="imageAlignment"
            type="select"
            options={[
              { value: 'left', label: 'Left', icon: AlignLeft },
              { value: 'center', label: 'Center', icon: AlignCenter },
              { value: 'right', label: 'Right', icon: AlignRight }
            ]}
            onValueChange={() => {}}
            icon={AlignCenter}
            isChild={true}
            editingField={editingField}
            onFieldClick={onFieldClick}
            onFieldBlur={onFieldBlur}
            onKeyDown={onKeyDown}
            description="How the image should be positioned"
          />
        )}

        <PropertyRow
          label="Wrapper"
          value="none"
          fieldName="imageWrapper"
          type="select"
          options={[
            { value: 'none', label: 'None', icon: Package },
            { value: 'card', label: 'Card', icon: CreditCard }
          ]}
          onValueChange={() => {}}
          icon={Package}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Wrapper style for the image"
        />

        <PropertyRow
          label="Aspect Ratio"
          value="auto"
          fieldName="imageAspectRatio"
          type="select"
          options={[
            { value: 'auto', label: 'Auto (Original)', icon: Ratio },
            { value: '16:9', label: '16:9 (Widescreen)', icon: Ratio },
            { value: '4:3', label: '4:3 (Standard)', icon: Ratio },
            { value: '1:1', label: '1:1 (Square)', icon: Square },
            { value: '3:2', label: '3:2 (Photo)', icon: Ratio }
          ]}
          onValueChange={() => {}}
          icon={Ratio}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Force specific aspect ratio"
        />

        <PropertyRow
          label="Link URL"
          value=""
          fieldName="imageLinkUrl"
          type="text"
          onValueChange={() => {}}
          placeholder="https://example.com"
          icon={Link}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Optional link when image is clicked"
        />

        <PropertyRow
          label="Open in New Tab"
          value={false}
          fieldName="imageOpenNewTab"
          type="checkbox"
          onValueChange={() => {}}
          icon={ExternalLink}
          isChild={true}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Open link in a new browser tab"
        />
      </div>
    </div>
  );
} 