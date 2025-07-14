import React from 'react';
import { 
  Video, 
  Upload, 
  Play, 
  VolumeX,
  Maximize,
  Link,
  Settings,
  Eye,
  Type,
  Monitor,
  Youtube,
  Globe,
  Square
} from 'lucide-react';
import { PropertyRow } from '../PropertyRow';

interface VideoWidgetSettingsProps {
  editingField: string | null;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
}

export function VideoWidgetSettings({
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown
}: VideoWidgetSettingsProps) {
  return (
    <div className="space-y-2">
      <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
        <PropertyRow
          label="Video Source"
          value="upload"
          fieldName="videoSource"
          type="select"
          options={[
            { value: 'upload', label: 'Upload Video', icon: Upload },
            { value: 'url', label: 'Video URL', icon: Link },
            { value: 'youtube', label: 'YouTube', icon: Youtube },
            { value: 'vimeo', label: 'Vimeo', icon: Globe },
            { value: 'embed', label: 'Embed Code', icon: Monitor }
          ]}
          onValueChange={() => {}}
          icon={Video}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="How to add the video content"
        />

        <PropertyRow
          label="Video File/URL"
          value=""
          fieldName="videoUrl"
          type="text"
          onValueChange={() => {}}
          placeholder="Upload file or enter video URL"
          icon={Video}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Video file or URL to display"
        />

        <PropertyRow
          label="Poster Image"
          value=""
          fieldName="videoPoster"
          type="text"
          onValueChange={() => {}}
          placeholder="Thumbnail image URL"
          icon={Eye}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Preview image shown before video plays"
          isIconUpload={true}
        />

        <PropertyRow
          label="Width"
          value="full"
          fieldName="videoWidth"
          type="select"
          options={[
            { value: 'full', label: 'Full Width', icon: Maximize },
            { value: 'custom', label: 'Custom', icon: Maximize }
          ]}
          onValueChange={() => {}}
          icon={Maximize}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Video player width"
        />

        <PropertyRow
          label="Custom Width"
          value="640"
          fieldName="videoCustomWidth"
          type="number"
          onValueChange={() => {}}
          placeholder="640"
          icon={Maximize}
          min={300}
          max={1200}
          isChild={true}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Custom width in pixels"
        />

        <PropertyRow
          label="Aspect Ratio"
          value="16:9"
          fieldName="videoAspectRatio"
          type="select"
          options={[
            { value: '16:9', label: '16:9 (Widescreen)', icon: Monitor },
            { value: '4:3', label: '4:3 (Standard)', icon: Monitor },
            { value: '1:1', label: '1:1 (Square)', icon: Square },
            { value: 'auto', label: 'Auto (Original)', icon: Video }
          ]}
          onValueChange={() => {}}
          icon={Monitor}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Video player aspect ratio"
        />

        <PropertyRow
          label="Autoplay"
          value={false}
          fieldName="videoAutoplay"
          type="checkbox"
          onValueChange={() => {}}
          icon={Play}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Start playing video automatically (may not work on mobile)"
        />

        <PropertyRow
          label="Muted"
          value={true}
          fieldName="videoMuted"
          type="checkbox"
          onValueChange={() => {}}
          icon={VolumeX}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Start video with audio muted"
        />

        <PropertyRow
          label="Loop"
          value={false}
          fieldName="videoLoop"
          type="checkbox"
          onValueChange={() => {}}
          icon={Play}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Replay video when it ends"
        />

        <PropertyRow
          label="Show Controls"
          value={true}
          fieldName="videoControls"
          type="checkbox"
          onValueChange={() => {}}
          icon={Settings}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Show video player controls (play, pause, volume, etc.)"
        />

        <PropertyRow
          label="Caption"
          value=""
          fieldName="videoCaption"
          type="text"
          onValueChange={() => {}}
          placeholder="Optional video caption"
          icon={Type}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
          description="Caption text displayed below the video"
        />


      </div>
    </div>
  );
} 