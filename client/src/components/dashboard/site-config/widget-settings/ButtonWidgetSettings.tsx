import React from 'react';
import { 
  MousePointer, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Palette,
  Link,
  ExternalLink,
  Square,
  Mail,
  Phone,
  Download,
  ArrowRight,
  Zap,
  Upload
} from 'lucide-react';
import { PropertyRow } from '../PropertyRow';

interface ButtonWidgetSettingsProps {
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

export function ButtonWidgetSettings({
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown
}: ButtonWidgetSettingsProps) {
  return (
    <div className="space-y-2">
      <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
        <PropertyRow
          label="Button Text"
          value="Click Me"
          fieldName="buttonText"
          type="text"
          onValueChange={() => {}}
          placeholder="Enter button text"
          icon={Type}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Text displayed on the button"
        />

        <PropertyRow
          label="Button Action"
          value="link"
          fieldName="buttonAction"
          type="select"
          options={[
            { value: 'link', label: 'Link to URL', icon: Link },
            { value: 'email', label: 'Send Email', icon: Mail },
            { value: 'phone', label: 'Call Phone', icon: Phone },
            { value: 'download', label: 'Download File', icon: Download },
            { value: 'scroll', label: 'Scroll to Section', icon: ArrowRight },
            { value: 'custom', label: 'Custom Script', icon: Zap }
          ]}
          onValueChange={() => {}}
          icon={MousePointer}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="What happens when the button is clicked"
        />

        <PropertyRow
          label="Link URL"
          value=""
          fieldName="buttonUrl"
          type="text"
          onValueChange={() => {}}
          placeholder="https://example.com"
          icon={Link}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="URL to navigate to when clicked"
        />

        <PropertyRow
          label="Open in New Tab"
          value={false}
          fieldName="buttonOpenNewTab"
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

        <PropertyRow
          label="Button Style"
          value="primary"
          fieldName="buttonStyle"
          type="select"
          options={[
            { value: 'primary', label: 'Primary (Filled)', icon: Square },
            { value: 'secondary', label: 'Secondary (Outline)', icon: Square },
            { value: 'ghost', label: 'Ghost (Transparent)', icon: Square },
            { value: 'link', label: 'Link Style', icon: Link }
          ]}
          onValueChange={() => {}}
          icon={Palette}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Visual style of the button"
        />

        <PropertyRow
          label="Button Size"
          value="medium"
          fieldName="buttonSize"
          type="select"
          options={[
            { value: 'small', label: 'Small', icon: Square },
            { value: 'medium', label: 'Medium', icon: Square },
            { value: 'large', label: 'Large', icon: Square },
            { value: 'full', label: 'Full Width', icon: Square }
          ]}
          onValueChange={() => {}}
          icon={Square}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Size of the button"
        />

        <PropertyRow
          label="Alignment"
          value="left"
          fieldName="buttonAlignment"
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
          description="How the button should be positioned"
        />



        <PropertyRow
          label="Add Icon"
          value={false}
          fieldName="buttonShowIcon"
          type="checkbox"
          onValueChange={() => {}}
          icon={Upload}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Add an icon to the button"
        />

        <PropertyRow
          label="Icon"
          value=""
          fieldName="buttonIcon"
          type="text"
          onValueChange={() => {}}
          placeholder="Choose an icon"
          icon={Upload}
          isChild={true}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Icon to display on the button"
          isIconUpload={true}
        />

        <PropertyRow
          label="Icon Position"
          value="left"
          fieldName="buttonIconPosition"
          type="select"
          options={[
            { value: 'left', label: 'Left', icon: AlignLeft },
            { value: 'right', label: 'Right', icon: AlignRight }
          ]}
          onValueChange={() => {}}
          icon={AlignLeft}
          isChild={true}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Where to position the icon relative to text"
        />


      </div>
    </div>
  );
} 