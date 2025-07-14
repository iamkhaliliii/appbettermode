import React, { useState } from 'react';
import { 
  Code,
  FileText,
  Eye,
  EyeOff,
  Shield,
  ShieldAlert,
  Maximize,
  Square,
  Minimize,
  AlertTriangle
} from 'lucide-react';
import { PropertyRow } from '../PropertyRow';

interface HtmlScriptWidgetSettingsProps {
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

export function HtmlScriptWidgetSettings({
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown
}: HtmlScriptWidgetSettingsProps) {
  const [codeType, setCodeType] = useState('html');
  const [isEnabled, setIsEnabled] = useState(true);
  const [sandbox, setSandbox] = useState(true);
  const [height, setHeight] = useState('auto');

  return (
    <div className="space-y-2">
      <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
        <PropertyRow
          label="Code Type"
          value={codeType}
          fieldName="htmlScriptType"
          type="select"
          options={[
            { value: 'html', label: 'HTML', icon: FileText },
            { value: 'css', label: 'CSS', icon: Code },
            { value: 'javascript', label: 'JavaScript', icon: Code }
          ]}
          onValueChange={setCodeType}
          icon={Code}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Type of code to embed"
        />

        <PropertyRow
          label="Code"
          value=""
          fieldName="htmlScriptCode"
          type="textarea"
          onValueChange={() => {}}
          placeholder={`Enter your ${codeType.toUpperCase()} code here...`}
          icon={Code}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Custom code to execute or embed"
        />

        <PropertyRow
          label="Height"
          value={height}
          fieldName="htmlScriptHeight"
          type="select"
          options={[
            { value: 'auto', label: 'Auto', icon: Minimize },
            { value: 'small', label: 'Small (200px)', icon: Square },
            { value: 'medium', label: 'Medium (400px)', icon: Square },
            { value: 'large', label: 'Large (600px)', icon: Maximize }
          ]}
          onValueChange={setHeight}
          icon={Square}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Container height for the script"
        />

        <PropertyRow
          label="Enabled"
          value={isEnabled}
          fieldName="htmlScriptEnabled"
          type="checkbox"
          onValueChange={setIsEnabled}
          icon={isEnabled ? Eye : EyeOff}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Enable or disable script execution"
        />

        <PropertyRow
          label="Sandbox Mode"
          value={sandbox}
          fieldName="htmlScriptSandbox"
          type="checkbox"
          onValueChange={setSandbox}
          icon={sandbox ? Shield : ShieldAlert}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Run script in isolated environment for security"
        />
      </div>

      {/* Security Warning */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-yellow-800">
            <div className="font-medium mb-1">Security Notice</div>
            <div>Only use trusted HTML/JavaScript code. Malicious scripts can compromise your site's security and user data.</div>
          </div>
        </div>
      </div>
    </div>
  );
} 