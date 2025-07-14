import React, { useState } from 'react';
import { 
  Monitor,
  ExternalLink,
  Maximize,
  Square,
  Minimize,
  Shield,
  ShieldOff,
  Smartphone,
  Tablet,
  AlertTriangle,
  Eye,
  EyeOff
} from 'lucide-react';
import { PropertyRow } from '../PropertyRow';

interface IframeWidgetSettingsProps {
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

export function IframeWidgetSettings({
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown
}: IframeWidgetSettingsProps) {
  const [height, setHeight] = useState('medium');
  const [allowFullscreen, setAllowFullscreen] = useState(false);
  const [sandbox, setSandbox] = useState(true);
  const [responsive, setResponsive] = useState(true);
  const [showBorder, setShowBorder] = useState(false);

  return (
    <div className="space-y-2">
      <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
        <PropertyRow
          label="iFrame URL"
          value=""
          fieldName="iframeUrl"
          type="text"
          onValueChange={() => {}}
          placeholder="https://example.com"
          icon={ExternalLink}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="URL of the website to embed"
        />

        <PropertyRow
          label="Height"
          value={height}
          fieldName="iframeHeight"
          type="select"
          options={[
            { value: 'small', label: 'Small (300px)', icon: Minimize },
            { value: 'medium', label: 'Medium (500px)', icon: Square },
            { value: 'large', label: 'Large (700px)', icon: Maximize },
            { value: 'custom', label: 'Custom', icon: Square }
          ]}
          onValueChange={setHeight}
          icon={Square}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Height of the iframe container"
        />

        {height === 'custom' && (
          <PropertyRow
            label="Custom Height (px)"
            value=""
            fieldName="iframeCustomHeight"
            type="text"
            onValueChange={() => {}}
            placeholder="400"
            icon={Square}
            isChild={true}
            editingField={editingField}
            onFieldClick={onFieldClick}
            onFieldBlur={onFieldBlur}
            onKeyDown={onKeyDown}
          />
        )}

        <PropertyRow
          label="Responsive"
          value={responsive}
          fieldName="iframeResponsive"
          type="checkbox"
          onValueChange={setResponsive}
          icon={responsive ? Smartphone : Tablet}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Automatically adjust to screen size"
        />

        <PropertyRow
          label="Show Border"
          value={showBorder}
          fieldName="iframeBorder"
          type="checkbox"
          onValueChange={setShowBorder}
          icon={showBorder ? Eye : EyeOff}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Display border around iframe"
        />

        <PropertyRow
          label="Allow Fullscreen"
          value={allowFullscreen}
          fieldName="iframeFullscreen"
          type="checkbox"
          onValueChange={setAllowFullscreen}
          icon={Maximize}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Allow embedded content to go fullscreen"
        />

        <PropertyRow
          label="Sandbox Mode"
          value={sandbox}
          fieldName="iframeSandbox"
          type="checkbox"
          onValueChange={setSandbox}
          icon={sandbox ? Shield : ShieldOff}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Enable security restrictions for embedded content"
        />
      </div>

      {/* Security Warning */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <div className="font-medium mb-1">Security Notice</div>
            <div>Only embed trusted websites. Some sites may not allow embedding due to security policies (X-Frame-Options).</div>
          </div>
        </div>
      </div>
    </div>
  );
} 