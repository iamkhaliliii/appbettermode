import React, { useState } from 'react';
import { 
  Image,
  Type,
  MousePointer,
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Eye,
  EyeOff,
  Upload,
  Video,
  ExternalLink
} from 'lucide-react';
import { PropertyRow } from '../PropertyRow';

interface HeroBannerWidgetSettingsProps {
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

export function HeroBannerWidgetSettings({
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown
}: HeroBannerWidgetSettingsProps) {
  const [backgroundType, setBackgroundType] = useState('image');
  const [textAlignment, setTextAlignment] = useState('center');
  const [showOverlay, setShowOverlay] = useState(true);
  const [showButton, setShowButton] = useState(true);

  return (
    <div className="space-y-2">
      <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
        <PropertyRow
          label="Background Type"
          value={backgroundType}
          fieldName="heroBgType"
          type="select"
          options={[
            { value: 'image', label: 'Image', icon: Image },
            { value: 'video', label: 'Video', icon: Video }
          ]}
          onValueChange={setBackgroundType}
          icon={Image}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Type of background media"
        />

        {backgroundType === 'image' ? (
          <PropertyRow
            label="Background Image"
            value=""
            fieldName="heroBgImage"
            type="upload"
            onValueChange={() => {}}
            placeholder="Upload hero background image"
            icon={Upload}
            isChild={true}
            editingField={editingField}
            onFieldClick={onFieldClick}
            onFieldBlur={onFieldBlur}
            onKeyDown={onKeyDown}
          />
        ) : (
          <PropertyRow
            label="Background Video"
            value=""
            fieldName="heroBgVideo"
            type="upload"
            onValueChange={() => {}}
            placeholder="Upload hero background video"
            icon={Upload}
            isChild={true}
            editingField={editingField}
            onFieldClick={onFieldClick}
            onFieldBlur={onFieldBlur}
            onKeyDown={onKeyDown}
          />
        )}

        <PropertyRow
          label="Show Overlay"
          value={showOverlay}
          fieldName="heroOverlay"
          type="checkbox"
          onValueChange={setShowOverlay}
          icon={showOverlay ? Eye : EyeOff}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Dark overlay to improve text readability"
        />

        <PropertyRow
          label="Main Title"
          value=""
          fieldName="heroTitle"
          type="text"
          onValueChange={() => {}}
          placeholder="Hero banner main title"
          icon={Type}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
        />

        <PropertyRow
          label="Subtitle"
          value=""
          fieldName="heroSubtitle"
          type="textarea"
          onValueChange={() => {}}
          placeholder="Hero banner subtitle or description"
          icon={Type}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
        />

        <PropertyRow
          label="Text Alignment"
          value={textAlignment}
          fieldName="heroTextAlign"
          type="select"
          options={[
            { value: 'left', label: 'Left', icon: AlignLeft },
            { value: 'center', label: 'Center', icon: AlignCenter },
            { value: 'right', label: 'Right', icon: AlignRight }
          ]}
          onValueChange={setTextAlignment}
          icon={AlignCenter}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Text alignment within the hero banner"
        />

        <PropertyRow
          label="Show Call-to-Action"
          value={showButton}
          fieldName="heroShowButton"
          type="checkbox"
          onValueChange={setShowButton}
          icon={MousePointer}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Display action button in hero banner"
        />

        {showButton && (
          <>
            <PropertyRow
              label="Button Text"
              value=""
              fieldName="heroButtonText"
              type="text"
              onValueChange={() => {}}
              placeholder="Get Started"
              icon={Type}
              isChild={true}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
            />

            <PropertyRow
              label="Button URL"
              value=""
              fieldName="heroButtonUrl"
              type="text"
              onValueChange={() => {}}
              placeholder="/signup or https://example.com"
              icon={ExternalLink}
              isChild={true}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
            />

            <PropertyRow
              label="Open in New Tab"
              value={false}
              fieldName="heroButtonNewTab"
              type="checkbox"
              onValueChange={() => {}}
              icon={ExternalLink}
              isChild={true}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
            />
          </>
        )}
      </div>
    </div>
  );
} 