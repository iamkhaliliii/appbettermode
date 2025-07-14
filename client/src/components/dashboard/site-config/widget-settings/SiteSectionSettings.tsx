import React, { useState } from 'react';
import { 
  Eye, 
  Layout, 
  AlignLeft, 
  AlignRight,
  Palette, 
  TypeIcon as Type,
  Heading,
  Settings,
  ArrowUpRight,
  Grid3x3,
  Megaphone,
  Link,
  Menu,
  Plus,
  Trash2,
  ChevronDown,
  Columns,
  AlignCenter,
  Search,
  Split,
  Smartphone,
  Monitor,
  Rss,
  FolderOpen,
  Tag,
  MessageSquare,
  Image as ImageIcon,
  Maximize,
  Minimize,
  Circle,
  Bell,
  Palette as ThemeIcon,
  Globe,
  Minus,
  Square
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

  // Site Header specific state
  const [headerLayout, setHeaderLayout] = useState('preset1');
  const [showAnnouncementBanner, setShowAnnouncementBanner] = useState(false);
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementUrl, setAnnouncementUrl] = useState('');
  const [menuItems, setMenuItems] = useState([
    { id: '1', label: 'Home', url: '/', type: 'custom' as const },
    { id: '2', label: 'About', url: '/about', type: 'custom' as const }
  ]);

  // Site Footer specific state
  const [footerLayout, setFooterLayout] = useState('preset1');
  const [showCopyright, setShowCopyright] = useState(true);
  const [copyrightText, setCopyrightText] = useState('© 2024 Your Company Name. All rights reserved.');
  const [showLogo, setShowLogo] = useState(true);
  const [footerMenuItems, setFooterMenuItems] = useState([
    { id: '1', label: 'Privacy Policy', url: '/privacy', type: 'custom' as const },
    { id: '2', label: 'Terms of Service', url: '/terms', type: 'custom' as const }
  ]);

  // Site Sidebar specific state
  const [showFeed, setShowFeed] = useState(true);
  const [showCollectionMenu, setShowCollectionMenu] = useState(true);
  const [showCollectionLabel, setShowCollectionLabel] = useState(true);
  const [collectionMenuItems, setCollectionMenuItems] = useState([
    { id: '1', label: 'All Posts', url: '/all', type: 'custom' as const },
    { id: '2', label: 'Categories', url: '/categories', type: 'custom' as const }
  ]);
  const [showCustomMenu, setShowCustomMenu] = useState(false);
  const [sidebarMenuItems, setSidebarMenuItems] = useState([
    { id: '1', label: 'Quick Links', url: '/links', type: 'custom' as const },
    { id: '2', label: 'Resources', url: '/resources', type: 'custom' as const }
  ]);

  // Site Header configuration state
  const [headerShowLogo, setHeaderShowLogo] = useState(true);
  const [headerLogoSize, setHeaderLogoSize] = useState('medium');
  const [headerShowSearchBox, setHeaderShowSearchBox] = useState(true);
  const [headerSearchBoxSize, setHeaderSearchBoxSize] = useState('medium');
  const [headerSearchBoxAlignment, setHeaderSearchBoxAlignment] = useState('left');
  const [headerShowActions, setHeaderShowActions] = useState(true);
  const [headerShowNotifications, setHeaderShowNotifications] = useState(true);
  const [headerShowMessages, setHeaderShowMessages] = useState(true);
  const [headerShowThemeSwitch, setHeaderShowThemeSwitch] = useState(true);
  const [headerShowLanguageSwitch, setHeaderShowLanguageSwitch] = useState(false);
  const [headerShowNavigationMenu, setHeaderShowNavigationMenu] = useState(true);
  const [headerEnableSubNavigation, setHeaderEnableSubNavigation] = useState(false);

  // Layout options for Site Footer with icons (3 presets)
  const footerLayoutOptions = [
    { 
      value: 'preset1', 
      label: 'Preset 1', 
      description: 'Minimal footer with links',
      icon: Layout
    },
    { 
      value: 'preset2', 
      label: 'Preset 2', 
      description: 'Multi-column layout',
      icon: Columns
    },
    { 
      value: 'preset3', 
      label: 'Preset 3', 
      description: 'Centered compact design',
      icon: AlignCenter
    }
  ];

  return (
    <div className="space-y-6">
      {/* Section-specific settings */}
      {sectionName === 'Site Header' && (
        <>
          {/* Info Banners */}
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

          {/* Header Configuration Options */}

          {/* Settings Content */}
          <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
            {/* Logo Settings */}
            <PropertyRow
              label="Logo"
              value={headerShowLogo}
              fieldName="headerShowLogo"
              type="checkbox"
              onValueChange={(value) => setHeaderShowLogo(value)}
              icon={ImageIcon}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Show logo in header"
            />

            {/* Logo Size - Conditional */}
            {headerShowLogo && (
              <PropertyRow
                label="Logo size"
                value={headerLogoSize}
                fieldName="headerLogoSize"
                type="select"
                onValueChange={(value) => setHeaderLogoSize(value)}
                options={[
                  { value: 'small', label: 'Small', icon: Minimize },
                  { value: 'medium', label: 'Medium', icon: Minus },
                  { value: 'large', label: 'Large', icon: Maximize }
                ]}
                icon={Maximize}
                editingField={editingField}
                onFieldClick={onFieldClick}
                onFieldBlur={onFieldBlur}
                onKeyDown={onKeyDown}
                description="Size of the logo"
                isChild={true}
              />
            )}

            {/* Search Box Settings */}
            <PropertyRow
              label="Search box"
              value={headerShowSearchBox}
              fieldName="headerShowSearchBox"
              type="checkbox"
              onValueChange={(value) => setHeaderShowSearchBox(value)}
              icon={Search}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Show search box in header"
            />

                         {/* Search Box Size - Conditional */}
             {headerShowSearchBox && (
               <>
                 <PropertyRow
                   label="Size"
                   value={headerSearchBoxSize}
                   fieldName="headerSearchBoxSize"
                   type="select"
                   onValueChange={(value) => setHeaderSearchBoxSize(value)}
                   options={[
                     { value: 'full', label: 'Full', icon: Maximize },
                     { value: 'medium', label: 'Medium', icon: Minus },
                     { value: 'icon', label: 'Icon', icon: Circle }
                   ]}
                   icon={Maximize}
                   editingField={editingField}
                   onFieldClick={onFieldClick}
                   onFieldBlur={onFieldBlur}
                   onKeyDown={onKeyDown}
                   description="Size of the search box"
                   isChild={true}
                 />

                {/* Search Box Alignment - Only when medium */}
                {headerSearchBoxSize === 'medium' && (
                  <PropertyRow
                    label="Alignment"
                    value={headerSearchBoxAlignment}
                    fieldName="headerSearchBoxAlignment"
                    type="select"
                    onValueChange={(value) => setHeaderSearchBoxAlignment(value)}
                                         options={[
                       { value: 'left', label: 'Left', icon: AlignLeft },
                       { value: 'center', label: 'Center', icon: AlignCenter },
                       { value: 'right', label: 'Right', icon: AlignRight }
                     ]}
                    icon={AlignCenter}
                    editingField={editingField}
                    onFieldClick={onFieldClick}
                    onFieldBlur={onFieldBlur}
                    onKeyDown={onKeyDown}
                    description="Alignment of the search box"
                    isChild={true}
                  />
                )}
              </>
            )}

            {/* Actions Settings */}
            <PropertyRow
              label="Actions"
              value={headerShowActions}
              fieldName="headerShowActions"
              type="checkbox"
              onValueChange={(value) => setHeaderShowActions(value)}
              icon={Settings}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Show action buttons in header"
            />

                         {/* Actions Sub-options - Conditional */}
             {headerShowActions && (
               <>
                 <PropertyRow
                   label="Notifications"
                   value={headerShowNotifications}
                   fieldName="headerShowNotifications"
                   type="checkbox"
                   onValueChange={(value) => setHeaderShowNotifications(value)}
                   icon={Bell}
                   editingField={editingField}
                   onFieldClick={onFieldClick}
                   onFieldBlur={onFieldBlur}
                   onKeyDown={onKeyDown}
                   description="Show notifications button"
                   isChild={true}
                 />

                 <PropertyRow
                   label="Messages"
                   value={headerShowMessages}
                   fieldName="headerShowMessages"
                   type="checkbox"
                   onValueChange={(value) => setHeaderShowMessages(value)}
                   icon={MessageSquare}
                   editingField={editingField}
                   onFieldClick={onFieldClick}
                   onFieldBlur={onFieldBlur}
                   onKeyDown={onKeyDown}
                   description="Show messages button"
                   isChild={true}
                 />

                 <PropertyRow
                   label="Theme switch"
                   value={headerShowThemeSwitch}
                   fieldName="headerShowThemeSwitch"
                   type="checkbox"
                   onValueChange={(value) => setHeaderShowThemeSwitch(value)}
                   icon={ThemeIcon}
                   editingField={editingField}
                   onFieldClick={onFieldClick}
                   onFieldBlur={onFieldBlur}
                   onKeyDown={onKeyDown}
                   description="Show theme switch button"
                   isChild={true}
                 />

                 <PropertyRow
                   label="Language switch"
                   value={headerShowLanguageSwitch}
                   fieldName="headerShowLanguageSwitch"
                   type="checkbox"
                   onValueChange={(value) => setHeaderShowLanguageSwitch(value)}
                   icon={Globe}
                   editingField={editingField}
                   onFieldClick={onFieldClick}
                   onFieldBlur={onFieldBlur}
                   onKeyDown={onKeyDown}
                   description="Show language switch button"
                   isChild={true}
                 />
               </>
             )}

            {/* Navigation Menu Settings */}
            <PropertyRow
              label="Navigation Menu"
              value={headerShowNavigationMenu}
              fieldName="headerShowNavigationMenu"
              type="checkbox"
              onValueChange={(value) => setHeaderShowNavigationMenu(value)}
              icon={Menu}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Show navigation menu in header"
            />

            {/* Enable Sub Navigation */}
            <PropertyRow
              label="Enable sub navigation"
              value={headerEnableSubNavigation}
              fieldName="headerEnableSubNavigation"
              type="checkbox"
              onValueChange={(value) => setHeaderEnableSubNavigation(value)}
              icon={Menu}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Enable sub-navigation dropdowns"
            />

            {/* Announcement Banner */}
            <PropertyRow
              label="Announcement Banner"
              value={showAnnouncementBanner}
              fieldName="showAnnouncementBanner"
              type="checkbox"
              onValueChange={(value) => setShowAnnouncementBanner(value)}
              icon={Megaphone}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Show announcement banner at top of header"
            />

            {/* Announcement Banner Settings - Conditional */}
            {showAnnouncementBanner && (
              <>
                <PropertyRow
                  label="Announcement Text"
                  value={announcementText}
                  fieldName="announcementText"
                  type="text"
                  onValueChange={(value) => setAnnouncementText(value)}
                  placeholder="Enter announcement message"
                  icon={Type}
                  editingField={editingField}
                  onFieldClick={onFieldClick}
                  onFieldBlur={onFieldBlur}
                  onKeyDown={onKeyDown}
                  description="Text content for the announcement banner"
                  isChild={true}
                />

                <PropertyRow
                  label="Announcement URL"
                  value={announcementUrl}
                  fieldName="announcementUrl"
                  type="text"
                  onValueChange={(value) => setAnnouncementUrl(value)}
                  placeholder="https://example.com"
                  icon={Link}
                  editingField={editingField}
                  onFieldClick={onFieldClick}
                  onFieldBlur={onFieldBlur}
                  onKeyDown={onKeyDown}
                  description="Link URL when announcement is clicked"
                  isChild={true}
                />
              </>
            )}
          </div>
        </>
      )}

      {/* Other sections remain unchanged */}
      {sectionName === 'Site Sidebar' && (
        <>
          {/* Info Banners */}
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
            {/* Feed Toggle */}
            <PropertyRow
              label="Feed"
              value={showFeed}
              fieldName="showFeed"
              type="checkbox"
              onValueChange={(value) => setShowFeed(value)}
              icon={Rss}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Show activity feed in sidebar"
            />

            {/* Collection Menu Toggle */}
            <PropertyRow
              label="Collection Menu"
              value={showCollectionMenu}
              fieldName="showCollectionMenu"
              type="checkbox"
              onValueChange={(value) => setShowCollectionMenu(value)}
              icon={FolderOpen}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Show collection navigation menu"
            />

            {/* Collection Menu Settings - Conditional */}
            {showCollectionMenu && (
              <>
                <PropertyRow
                  label="Label"
                  value={showCollectionLabel}
                  fieldName="showCollectionLabel"
                  type="checkbox"
                  onValueChange={(value) => setShowCollectionLabel(value)}
                  icon={Tag}
                  editingField={editingField}
                  onFieldClick={onFieldClick}
                  onFieldBlur={onFieldBlur}
                  onKeyDown={onKeyDown}
                  description="Show labels in collection menu"
                  isChild={true}
                />

                <PropertyRow
                  label="Menu Items"
                  value={collectionMenuItems}
                  fieldName="collectionMenuItems"
                  type="menu"
                  onValueChange={(value) => setCollectionMenuItems(value)}
                  icon={Menu}
                  editingField={editingField}
                  onFieldClick={onFieldClick}
                  onFieldBlur={onFieldBlur}
                  onKeyDown={onKeyDown}
                  description="Manage collection menu items"
                  isChild={true}
                />
              </>
            )}

            {/* Custom Menu Toggle */}
            <PropertyRow
              label="Custom Menu"
              value={showCustomMenu}
              fieldName="showCustomMenu"
              type="checkbox"
              onValueChange={(value) => setShowCustomMenu(value)}
              icon={Menu}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Enable custom menu items in sidebar"
            />

            {/* Custom Menu Management - Conditional */}
            {showCustomMenu && (
              <PropertyRow
                label="Menu Items"
                value={sidebarMenuItems}
                fieldName="sidebarMenuItems"
                type="menu"
                onValueChange={(value) => setSidebarMenuItems(value)}
                icon={Menu}
                editingField={editingField}
                onFieldClick={onFieldClick}
                onFieldBlur={onFieldBlur}
                onKeyDown={onKeyDown}
                description="Manage custom sidebar menu items"
                isChild={true}
              />
            )}
          </div>
        </>
      )}

      {sectionName === 'Site Footer' && (
        <>
          {/* Info Banners */}
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

          {/* Footer Layout Selection - Box Style (3 columns) */}
          <div>
            <div className="grid grid-cols-3 gap-2 px-2">
              {footerLayoutOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setFooterLayout(option.value)}
                    className={`flex flex-col items-center justify-center aspect-square p-2 rounded-lg border-2 transition-all ${
                      footerLayout === option.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 mb-1 ${
                      footerLayout === option.value 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                    <span className={`text-[0.6rem] leading-tight ${
                      footerLayout === option.value 
                        ? 'text-primary-600 dark:text-primary-400 font-medium' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Settings Content */}
          <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
            {/* Copyright Toggle */}
            <PropertyRow
              label="Copyright"
              value={showCopyright}
              fieldName="showCopyright"
              type="checkbox"
              onValueChange={(value) => setShowCopyright(value)}
              icon={Type}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Show copyright text in footer"
            />

            {/* Copyright Text - Conditional */}
            {showCopyright && (
              <PropertyRow
                label="Copyright Text"
                value={copyrightText}
                fieldName="copyrightText"
                type="text"
                onValueChange={(value) => setCopyrightText(value)}
                placeholder="© 2024 Your Company Name. All rights reserved."
                icon={Type}
                editingField={editingField}
                onFieldClick={onFieldClick}
                onFieldBlur={onFieldBlur}
                onKeyDown={onKeyDown}
                description="Text content for the copyright notice"
                isChild={true}
              />
            )}

            {/* Logo Toggle */}
            <PropertyRow
              label="Logo"
              value={showLogo}
              fieldName="showLogo"
              type="checkbox"
              onValueChange={(value) => setShowLogo(value)}
              icon={Layout}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Show logo in footer"
            />

            {/* Menu Management using new menu type */}
            <PropertyRow
              label="Menu Items"
              value={footerMenuItems}
              fieldName="footerMenuItems"
              type="menu"
              onValueChange={(value) => setFooterMenuItems(value)}
              icon={Menu}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Manage footer navigation menu items"
            />
          </div>
        </>
      )}
    </div>
  );
} 