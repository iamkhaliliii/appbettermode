import React, { useState } from 'react';
import { 
  Megaphone,
  Type,
  MousePointer,
  Eye,
  EyeOff,
  X,
  Pin,
  PanelTop,
  PanelBottom,
  ExternalLink,
  AlertCircle,
  Info,
  CheckCircle
} from 'lucide-react';
import { PropertyRow } from '../PropertyRow';

interface AnnouncementBannerWidgetSettingsProps {
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

export function AnnouncementBannerWidgetSettings({
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown
}: AnnouncementBannerWidgetSettingsProps) {
  const [position, setPosition] = useState('top');
  const [bannerType, setBannerType] = useState('info');
  const [isDismissible, setIsDismissible] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  return (
    <div className="space-y-2">
      <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
        <PropertyRow
          label="Message"
          value=""
          fieldName="announcementMessage"
          type="textarea"
          onValueChange={() => {}}
          placeholder="Important announcement message..."
          icon={Type}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="The announcement text to display"
        />

        <PropertyRow
          label="Type"
          value={bannerType}
          fieldName="announcementType"
          type="select"
          options={[
            { value: 'info', label: 'Info', icon: Info },
            { value: 'warning', label: 'Warning', icon: AlertCircle },
            { value: 'success', label: 'Success', icon: CheckCircle }
          ]}
          onValueChange={setBannerType}
          icon={Info}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Visual style of the banner"
        />

        <PropertyRow
          label="Position"
          value={position}
          fieldName="announcementPosition"
          type="select"
          options={[
            { value: 'top', label: 'Top', icon: PanelTop },
            { value: 'bottom', label: 'Bottom', icon: PanelBottom }
          ]}
          onValueChange={setPosition}
          icon={PanelTop}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Where to display the banner"
        />

        <PropertyRow
          label="Sticky"
          value={isSticky}
          fieldName="announcementSticky"
          type="checkbox"
          onValueChange={setIsSticky}
          icon={Pin}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Keep banner visible while scrolling"
        />

        <PropertyRow
          label="Dismissible"
          value={isDismissible}
          fieldName="announcementDismissible"
          type="checkbox"
          onValueChange={setIsDismissible}
          icon={isDismissible ? X : Eye}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Allow users to close the banner"
        />

        <PropertyRow
          label="Show Action Button"
          value={showButton}
          fieldName="announcementShowButton"
          type="checkbox"
          onValueChange={setShowButton}
          icon={MousePointer}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Display action button in banner"
        />

        {showButton && (
          <>
            <PropertyRow
              label="Button Text"
              value=""
              fieldName="announcementButtonText"
              type="text"
              onValueChange={() => {}}
              placeholder="Learn More"
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
              fieldName="announcementButtonUrl"
              type="text"
              onValueChange={() => {}}
              placeholder="/details or https://example.com"
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
              fieldName="announcementButtonNewTab"
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