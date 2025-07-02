import React from 'react';
import { 
  Eye, 
  Layout, 
  AlignLeft, 
  Palette, 
  TypeIcon as Type,
  Heading,
  Settings,
  ArrowUpRight
} from 'lucide-react';
import { PropertyRow } from '../PropertyRow';

interface SiteSectionSettingsProps {
  sectionName: string; // 'Site Header', 'Site Sidebar', or 'Site Footer'
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

export function SiteSectionSettings({
  sectionName,
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown
}: SiteSectionSettingsProps) {
  const sectionPrefix = sectionName.toLowerCase().replace(' ', '');

  return (
    <div className="space-y-6">
      {/* General Widget Header - Redesigned */}
      <div className="space-y-2">
        
        {/* Info Banner */}
        <div className="p-3 bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20 border-l-4 border-amber-400 dark:border-amber-500 rounded-r-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                Global Configuration
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                Changes made to this widget will be applied across all pages in your site. This affects the global {sectionName.toLowerCase()} appearance and behavior.
              </p>
            </div>
          </div>
        </div>
              {/* Enterprise Upgrade Banner */}
          <div className="p-3 bg-gradient-to-r from-violet-50/80 to-violet-50/80 dark:from-violet-900/20 dark:to-violet-900/20 border-l-4 border-violet-400 dark:border-violet-500 rounded-r-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
            </div>
            <div className="flex-1">
              <p className="text-xs text-violet-700 dark:text-violet-300">
                Enterprise unlocks multiple {sectionName.toLowerCase()} per page and more.
              </p>
            </div>
            <button className="flex items-center gap-1 px-2 py-1.5 border border-violet-400 hover:bg-violet-100 text-violet-600 text-[0.7rem] font-medium rounded-md transition-colors mt-2">
                <span>Upgrade plan</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
          </div>
        </div>

      </div>


      {/* Settings Content */}
      <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
        <PropertyRow
          label="Visibility"
          value={true}
          fieldName={`${sectionPrefix}Visibility`}
          type="checkbox"
          onValueChange={() => {}}
          icon={Eye}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description={`Show or hide the ${sectionName.toLowerCase()}`}
        />

        <PropertyRow
          label="Custom Title"
          value=""
          fieldName={`${sectionPrefix}Title`}
          type="text"
          onValueChange={() => {}}
          placeholder={`Enter custom ${sectionName.toLowerCase()} title`}
          icon={Heading}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description={`Custom title for ${sectionName.toLowerCase()}`}
        />

        <PropertyRow
          label="Background Color"
          value="#ffffff"
          fieldName={`${sectionPrefix}BackgroundColor`}
          type="text"
          onValueChange={() => {}}
          placeholder="#ffffff or transparent"
          icon={Palette}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description={`Background color for ${sectionName.toLowerCase()}`}
        />

        <PropertyRow
          label="Text Color"
          value="#000000"
          fieldName={`${sectionPrefix}TextColor`}
          type="text"
          onValueChange={() => {}}
          placeholder="#000000 or inherit"
          icon={Type}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description={`Text color for ${sectionName.toLowerCase()}`}
        />

        <PropertyRow
          label="Text Alignment"
          value="left"
          fieldName={`${sectionPrefix}TextAlignment`}
          type="select"
          options={[
            { value: 'left', label: 'Left', description: 'Align content to the left' },
            { value: 'center', label: 'Center', description: 'Center align content' },
            { value: 'right', label: 'Right', description: 'Align content to the right' }
          ]}
          onValueChange={() => {}}
          icon={AlignLeft}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description={`Text alignment for ${sectionName.toLowerCase()}`}
        />

        <PropertyRow
          label="Show Border"
          value={sectionName === 'Site Header'}
          fieldName={`${sectionPrefix}ShowBorder`}
          type="checkbox"
          onValueChange={() => {}}
          icon={Layout}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description={`Display a border around ${sectionName.toLowerCase()}`}
        />

        {/* Section-specific settings */}
        {sectionName === 'Site Header' && (
          <>
            <PropertyRow
              label="Sticky Header"
              value={true}
              fieldName="headerSticky"
              type="checkbox"
              onValueChange={() => {}}
              icon={Layout}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Keep header visible when scrolling"
            />

            <PropertyRow
              label="Show Search"
              value={true}
              fieldName="headerShowSearch"
              type="checkbox"
              onValueChange={() => {}}
              icon={Settings}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Display search functionality in header"
            />
          </>
        )}

        {sectionName === 'Site Sidebar' && (
          <>
            <PropertyRow
              label="Sidebar Position"
              value="left"
              fieldName="sidebarPosition"
              type="select"
              options={[
                { value: 'left', label: 'Left', description: 'Position sidebar on the left' },
                { value: 'right', label: 'Right', description: 'Position sidebar on the right' }
              ]}
              onValueChange={() => {}}
              icon={Layout}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Position of the sidebar"
            />

            <PropertyRow
              label="Collapsible"
              value={true}
              fieldName="sidebarCollapsible"
              type="checkbox"
              onValueChange={() => {}}
              icon={Settings}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Allow sidebar to be collapsed/expanded"
            />
          </>
        )}

        {sectionName === 'Site Footer' && (
          <>
            <PropertyRow
              label="Show Copyright"
              value={true}
              fieldName="footerShowCopyright"
              type="checkbox"
              onValueChange={() => {}}
              icon={Settings}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Display copyright information in footer"
            />

            <PropertyRow
              label="Copyright Text"
              value="© 2024 Your Site. All rights reserved."
              fieldName="footerCopyrightText"
              type="text"
              onValueChange={() => {}}
              placeholder="Enter copyright text"
              icon={Type}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Custom copyright text"
            />
          </>
        )}
      </div>
    </div>
  );
} 