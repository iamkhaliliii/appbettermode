import React, { useState } from 'react';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Maximize,
  Minimize,
  Link,
  ExternalLink,
  Square,
  Settings,
  Upload,
  Sun,
  Moon,
  Image
} from 'lucide-react';
import { PropertyRow } from '../PropertyRow';

interface LogoWidgetSettingsProps {
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

export function LogoWidgetSettings({
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown
}: LogoWidgetSettingsProps) {
  const [useDefaultLogo, setUseDefaultLogo] = useState(true);
  const [logoType, setLogoType] = useState('full');
  const [logoLightMode, setLogoLightMode] = useState('');
  const [logoDarkMode, setLogoDarkMode] = useState('');

  return (
    <div className="space-y-2">
      <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
        <PropertyRow
          label="Use default logo"
          value={useDefaultLogo}
          fieldName="useDefaultLogo"
          type="checkbox"
          onValueChange={setUseDefaultLogo}
          icon={Settings}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Use the default site logo"
        />

        {useDefaultLogo && (
          <PropertyRow
            label="Logo Type"
            value={logoType}
            fieldName="logoType"
            type="select"
            options={[
              { value: 'full', label: 'Full', icon: Image },
              { value: 'square', label: 'Square', icon: Square }
            ]}
            onValueChange={setLogoType}
            icon={Image}
            isChild={true}
            editingField={editingField}
            onFieldClick={onFieldClick}
            onFieldBlur={onFieldBlur}
            onKeyDown={onKeyDown}
            description="Type of default logo to display"
          />
        )}

        {!useDefaultLogo && (
          <>
            <PropertyRow
              label="Logo in lightmode"
              value={logoLightMode}
              fieldName="logoLightMode"
              type="upload"
              onValueChange={setLogoLightMode}
              placeholder="Upload logo for light mode"
              icon={Sun}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Logo to display in light mode"
            />

            <PropertyRow
              label="Logo in darkmode"
              value={logoDarkMode}
              fieldName="logoDarkMode"
              type="upload"
              onValueChange={setLogoDarkMode}
              placeholder="Upload logo for dark mode"
              icon={Moon}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Logo to display in dark mode"
            />
          </>
        )}

        <PropertyRow
          label="Size"
          value="medium"
          fieldName="logoSize"
          type="select"
          options={[
            { value: 'small', label: 'Small', icon: Minimize },
            { value: 'medium', label: 'Medium', icon: Square },
            { value: 'large', label: 'Large', icon: Maximize }
          ]}
          onValueChange={() => {}}
          icon={Square}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Logo size preset"
        />

        <PropertyRow
          label="Alignment"
          value="left"
          fieldName="logoAlignment"
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
          description="How the logo should be positioned"
        />

        <PropertyRow
          label="Link URL"
          value=""
          fieldName="logoLinkUrl"
          type="text"
          onValueChange={() => {}}
          placeholder="https://example.com"
          icon={Link}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Optional link when logo is clicked"
        />

        <PropertyRow
          label="Open in New Tab"
          value={false}
          fieldName="logoOpenNewTab"
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