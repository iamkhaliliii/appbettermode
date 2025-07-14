import React from 'react';
import { 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Palette,
  Settings,
  Eye,
  Move,
  ChevronDown
} from 'lucide-react';
import { PropertyRow } from '../PropertyRow';

interface TitleWidgetSettingsProps {
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

export function TitleWidgetSettings({
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown
}: TitleWidgetSettingsProps) {
  return (
    <div className="space-y-2">
      <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
        <PropertyRow
          label="Title Text"
          value="Your Title Here"
          fieldName="titleText"
          type="text"
          onValueChange={() => {}}
          placeholder="Enter your title"
          icon={Type}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="The main text content for your title"
        />

        <PropertyRow
          label="Subtitle"
          value=""
          fieldName="titleSubtitle"
          type="text"
          onValueChange={() => {}}
          placeholder="Optional subtitle"
          icon={AlignLeft}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Optional subtitle text below the main title"
        />

        <PropertyRow
          label="Size"
          value="h2"
          fieldName="headingLevel"
          type="select"
          options={[
            { value: 'h1', label: 'H1 - Large Title - 36px', icon: Heading1 },
            { value: 'h2', label: 'H2 - Section Title - 30px', icon: Heading2 },
            { value: 'h3', label: 'H3 - Normal - 24px', icon: Heading3 },
            { value: 'h4', label: 'H4 - Small Header - 20px', icon: Type },
            { value: 'h5', label: 'H5 - Mini Header - 18px', icon: Type },
            { value: 'h6', label: 'H6 - Tiny Header - 16px', icon: Type }
          ]}
          onValueChange={() => {}}
          icon={Heading2}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Text size and HTML heading level for SEO and accessibility"
        />

        <PropertyRow
          label="Text Alignment"
          value="left"
          fieldName="textAlignment"
          type="select"
          options={[
            { value: 'left', label: 'Left', icon: AlignLeft },
            { value: 'center', label: 'Center', icon: AlignCenter },
            { value: 'right', label: 'Right', icon: AlignRight }
          ]}
          onValueChange={() => {}}
          icon={AlignLeft}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="How the title text should be aligned"
        />


      </div>
    </div>
  );
} 