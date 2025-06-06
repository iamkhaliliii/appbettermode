import React, { useState, useMemo, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Upload, 
  Smile, 
  Box,
  Image,
  Star,
  Heart,
  Home,
  User,
  Settings,
  Bell,
  Mail,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Camera,
  Video,
  Music,
  FileText,
  Folder,
  Download,
  Share,
  Trash,
  Edit,
  Plus,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Menu,
  MoreHorizontal,
  MoreVertical,
  Grid,
  List,
  Filter,
  Search as SearchIcon,
  Zap,
  Shield,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ThumbsUp,
  MessageCircle,
  Send,
  Bookmark,
  Flag,
  AlertCircle,
  Info,
  HelpCircle,
  Globe,
  Volume2,
  VolumeX,
  PlayCircle,
  PauseCircle,
  SkipBack,
  SkipForward,
  Maximize,
  Minimize,
  RefreshCw,
  Copy,
  Save,
  ExternalLink,
  Layout,
  Sidebar,
  PanelLeft,
  PanelRight,
  Columns as ColumnsIcon,
  Rows,
  Grid3X3,
  Palette,
  Award,
  Trophy,
  Sparkles
} from 'lucide-react';

interface IconUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIconSelect: (icon: { 
    type: 'emoji' | 'lucide' | 'custom'; 
    value: string; 
    name?: string;
    color?: string;
  }) => void;
  currentValue?: string;
}

// Expanded color palette with more variety
const COLOR_PALETTE = [
  { name: 'Default', value: '#64748B' },
  { name: 'Black', value: '#1E293B' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Green', value: '#10B981' }
];

// Comprehensive emoji list with all popular categories
const POPULAR_EMOJIS = [
  // Smileys & People
  '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩',
  '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
  '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒',
  '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😈',
  '👿', '😤', '😠', '😡', '🤬', '😱', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓',
  
  // People & Body
  '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👩', '🧓', '👴', '👵', '🙍', '🙎', '🙅', '🙆',
  '💁', '🙋', '🧏', '🙇', '🤦', '🤷', '👮', '🕵️', '💂', '🥷', '👷', '🤴', '👸', '👳', '👲', '🧕',
  '🤵', '👰', '🤰', '🤱', '👼', '🎅', '🤶', '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟',
  
  // Animals & Nature
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵',
  '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗',
  '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎',
  '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅',
  '🐆', '🦓', '🦍', '🦧', '🦣', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄',
  
  // Food & Drink
  '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝',
  '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐',
  '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭',
  '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣',
  '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧',
  
  // Activities & Sports
  '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍',
  '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿',
  '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣',
  
  // Travel & Places
  '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵',
  '🚲', '🛴', '🛹', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝',
  '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩️', '💺', '🛰️', '🚀', '🛸',
  
  // Objects & Symbols
  '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹',
  '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰',
  
  // Hearts & Symbols
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💖', '💗', '💘', '💝',
  '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊',
  
  // Nature & Weather
  '⭐', '🌟', '💫', '⚡', '🔥', '💥', '💦', '💨', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️',
  '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '🌪️', '🌫️', '🌈', '🌙', '🌛', '🌜', '🌚', '🌕', '🌖'
];

// Expanded Lucide icons list with more variety
const ESSENTIAL_ICONS = [
  // General & UI
  { name: 'Star', icon: Star },
  { name: 'Heart', icon: Heart },
  { name: 'Home', icon: Home },
  { name: 'User', icon: User },
  { name: 'Settings', icon: Settings },
  { name: 'Bell', icon: Bell },
  { name: 'Mail', icon: Mail },
  { name: 'Phone', icon: Phone },
  { name: 'Calendar', icon: Calendar },
  { name: 'Clock', icon: Clock },
  { name: 'MapPin', icon: MapPin },
  { name: 'Search', icon: SearchIcon },
  { name: 'Plus', icon: Plus },
  { name: 'Check', icon: Check },
  { name: 'X', icon: X },
  { name: 'Info', icon: Info },
  { name: 'HelpCircle', icon: HelpCircle },
  { name: 'AlertCircle', icon: AlertCircle },
  { name: 'Zap', icon: Zap },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Award', icon: Award },
  { name: 'Trophy', icon: Trophy },
  
  // Media & Files
  { name: 'Camera', icon: Camera },
  { name: 'Video', icon: Video },
  { name: 'Music', icon: Music },
  { name: 'Image', icon: Image },
  { name: 'FileText', icon: FileText },
  { name: 'Folder', icon: Folder },
  { name: 'Download', icon: Download },
  { name: 'Upload', icon: Upload },
  { name: 'Share', icon: Share },
  { name: 'Save', icon: Save },
  { name: 'Copy', icon: Copy },
  { name: 'Trash', icon: Trash },
  { name: 'Edit', icon: Edit },
  { name: 'PlayCircle', icon: PlayCircle },
  { name: 'PauseCircle', icon: PauseCircle },
  { name: 'SkipBack', icon: SkipBack },
  { name: 'SkipForward', icon: SkipForward },
  { name: 'Volume2', icon: Volume2 },
  { name: 'VolumeX', icon: VolumeX },
  
  // Navigation & Actions
  { name: 'ArrowLeft', icon: ArrowLeft },
  { name: 'ArrowRight', icon: ArrowRight },
  { name: 'ArrowUp', icon: ArrowUp },
  { name: 'ArrowDown', icon: ArrowDown },
  { name: 'ChevronLeft', icon: ChevronLeft },
  { name: 'ChevronRight', icon: ChevronRight },
  { name: 'ChevronUp', icon: ChevronUp },
  { name: 'ChevronDown', icon: ChevronDown },
  { name: 'Menu', icon: Menu },
  { name: 'MoreHorizontal', icon: MoreHorizontal },
  { name: 'MoreVertical', icon: MoreVertical },
  { name: 'ExternalLink', icon: ExternalLink },
  { name: 'RefreshCw', icon: RefreshCw },
  { name: 'Filter', icon: Filter },
  
  // Layout & Design
  { name: 'Grid', icon: Grid },
  { name: 'List', icon: List },
  { name: 'Layout', icon: Layout },
  { name: 'Sidebar', icon: Sidebar },
  { name: 'PanelLeft', icon: PanelLeft },
  { name: 'PanelRight', icon: PanelRight },
  { name: 'Columns', icon: ColumnsIcon },
  { name: 'Rows', icon: Rows },
  { name: 'Grid3X3', icon: Grid3X3 },
  { name: 'Maximize', icon: Maximize },
  { name: 'Minimize', icon: Minimize },
  
  // Communication & Social
  { name: 'ThumbsUp', icon: ThumbsUp },
  { name: 'MessageCircle', icon: MessageCircle },
  { name: 'Send', icon: Send },
  { name: 'Bookmark', icon: Bookmark },
  { name: 'Flag', icon: Flag },
  
  // Security & System
  { name: 'Shield', icon: Shield },
  { name: 'Lock', icon: Lock },
  { name: 'Unlock', icon: Unlock },
  { name: 'Eye', icon: Eye },
  { name: 'EyeOff', icon: EyeOff },
  { name: 'Globe', icon: Globe }
];

interface LucideIconItem {
  name: string;
  icon: React.ComponentType<any>;
}

export function IconUploadDialog({ open, onOpenChange, onIconSelect, currentValue }: IconUploadDialogProps) {
  const [activeTab, setActiveTab] = useState<'emoji' | 'lucide' | 'custom'>('emoji');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0].value);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Filter emojis based on search
  const filteredEmojis = useMemo(() => {
    if (!searchQuery) return POPULAR_EMOJIS;
    return POPULAR_EMOJIS.filter(() => 
      searchQuery.toLowerCase().includes('emoji') || searchQuery.toLowerCase().includes('face')
    );
  }, [searchQuery]);

  // Filter Lucide icons based on search
  const filteredLucideIcons = useMemo(() => {
    if (!searchQuery) return ESSENTIAL_ICONS;
    return ESSENTIAL_ICONS.filter(icon => 
      icon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleCustomUpload = () => {
    if (selectedFile && previewUrl) {
      onIconSelect({ type: 'custom', value: previewUrl, name: selectedFile.name });
      onOpenChange(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    onIconSelect({ type: 'emoji', value: emoji });
    onOpenChange(false);
  };

  const handleLucideSelect = (iconName: string) => {
    onIconSelect({ 
      type: 'lucide', 
      value: iconName, 
      name: iconName, 
      color: selectedColor 
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[70vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 py-2.5 border-b bg-white dark:bg-gray-900">
          <DialogTitle className="text-base font-semibold">Choose Icon</DialogTitle>
        </DialogHeader>

        {/* Enhanced Tab Navigation */}
        <div className="flex border-b bg-gray-50 dark:bg-gray-900">
          {[
            { id: 'emoji', label: <Smile className="w-4 h-4" />, title: 'Emoji' },
            { id: 'lucide', label: <Zap className="w-4 h-4" />, title: 'Icons' },
            { id: 'custom', label: <Upload className="w-4 h-4" />, title: 'Upload' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 px-3 text-base font-medium transition-all duration-200 relative flex items-center justify-center ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title={tab.title}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
          ))}
        </div>

        {/* Minimal Compact Color Picker */}
        {activeTab === 'lucide' && (
          <div className="px-4 py-3 border-b">
            <div className="grid grid-cols-12 justify-items-center">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-5 h-5 rounded-full border transition-all duration-150 hover:scale-110 ${
                    selectedColor === color.value 
                      ? 'border-gray-800 dark:border-gray-200 ring-2 ring-gray-800/30 dark:ring-gray-200/30' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {selectedColor === color.value && (
                    <Check className="w-3 h-3 text-white mx-auto mt-0.5 drop-shadow-sm" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Search */}
        {(activeTab === 'emoji' || activeTab === 'lucide') && (
          <div className="px-4 py-2.5 border-b bg-gray-50 dark:bg-gray-900">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-sm border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
          </div>
        )}

        {/* Enhanced Content Area */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-gray-900">
          {/* Emoji Tab */}
          {activeTab === 'emoji' && (
            <ScrollArea className="h-[280px]">
              <div className="p-3">
                <div className="grid grid-cols-12 gap-1">
                  {filteredEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => handleEmojiSelect(emoji)}
                      className="w-10 h-10 flex items-center justify-center text-xl hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 hover:scale-110"
                      title={emoji}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </ScrollArea>
          )}

          {/* Lucide Icons Tab */}
          {activeTab === 'lucide' && (
            <ScrollArea className="h-[280px]">
              <div className="p-3">
                <div className="grid grid-cols-12 gap-1">
                  {filteredLucideIcons.map((iconItem, index) => {
                    const IconComponent = iconItem.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleLucideSelect(iconItem.name)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 hover:scale-110 group"
                        title={iconItem.name}
                      >
                        <IconComponent 
                          className="w-5 h-5 transition-all duration-200 group-hover:scale-110" 
                          style={{ color: selectedColor }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
          )}

          {/* Custom Upload Tab */}
          {activeTab === 'custom' && (
            <div className="h-[280px] p-6 flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  {previewUrl ? (
                    <div className="space-y-3">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-20 h-20 object-cover rounded-xl mx-auto border-2 border-gray-200 dark:border-gray-700 shadow-sm"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-40 font-medium">
                        {selectedFile?.name}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <Upload className="w-10 h-10 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-900 dark:text-gray-100">Upload Icon</p>
                        <p className="text-sm text-gray-500">PNG, JPG, SVG</p>
                      </div>
                    </div>
                  )}
                  
                  <label className="inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button variant="outline" size="sm" className="cursor-pointer px-6">
                      {previewUrl ? 'Change' : 'Choose File'}
                    </Button>
                  </label>
                </div>
              </div>

              {previewUrl && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={handleCustomUpload}
                  >
                    Use Icon
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 