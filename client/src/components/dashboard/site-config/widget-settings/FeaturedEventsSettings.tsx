import React from 'react';
import { 
  Heading, 
  Type, 
  AlignLeft, 
  Layout, 
  Calendar, 
  Zap, 
  Settings, 
  CheckCircle, 
  User, 
  Users,
  ChevronDown
} from 'lucide-react';
import { PropertyRow } from '../PropertyRow';

interface FeaturedEventsSettingsProps {
  editingField: string | null;
  featuredPropertiesExpanded: boolean;
  onFieldClick: (fieldName: string) => void;
  onFieldBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent, fieldName: string) => void;
  onToggleFeaturedPropertiesExpanded: () => void;
}

export function FeaturedEventsSettings({
  editingField,
  featuredPropertiesExpanded,
  onFieldClick,
  onFieldBlur,
  onKeyDown,
  onToggleFeaturedPropertiesExpanded
}: FeaturedEventsSettingsProps) {
  return (
    <div className="space-y-2">
      <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
        <PropertyRow
          label="Header"
          value={true}
          fieldName="featuredHeader"
          type="checkbox"
          onValueChange={() => {}}
          icon={Heading}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
        />

        <PropertyRow
          label="Title"
          value="Featured Events"
          fieldName="featuredTitle"
          type="text"
          onValueChange={() => {}}
          icon={Type}
          isChild={true}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
        />

        <PropertyRow
          label="Description"
          value="Discover our highlighted upcoming events"
          fieldName="featuredDescription"
          type="textarea"
          onValueChange={() => {}}
          placeholder="Enter description"
          icon={AlignLeft}
          isChild={true}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
        />

        <PropertyRow
          label="Events to show"
          value="all"
          fieldName="featuredEventsToShow"
          type="select"
          options={[
            { value: 'all', label: 'All Events', icon: Layout },
            { value: 'upcoming', label: 'Upcoming Events', icon: Calendar },
            { value: 'featured', label: 'Featured Events', icon: Zap },
            { value: 'custom', label: 'Custom', icon: Settings }
          ]}
          onValueChange={() => {}}
          icon={Layout}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
        />

        <PropertyRow
          label="RSVP"
          value={false}
          fieldName="featuredRsvp"
          type="checkbox"
          onValueChange={() => {}}
          icon={CheckCircle}
          editingField={editingField}
          onFieldClick={onFieldClick}
          onFieldBlur={onFieldBlur}
          onKeyDown={onKeyDown}
        />
      </div>

      {/* Property Visibility Accordion */}
      <div className="pt-1 border-t border-gray-50 dark:border-gray-800">
        <button
          onClick={onToggleFeaturedPropertiesExpanded}
          className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <span>Property Visibility</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${featuredPropertiesExpanded ? 'rotate-180' : ''}`} />
        </button>
        
        {featuredPropertiesExpanded && (
          <div className="space-y-0 [&>*:last-child>div:first-child]:border-b-0">
            <PropertyRow
              label="Host"
              value={true}
              fieldName="featuredShowHost"
              type="checkbox"
              onValueChange={() => {}}
              icon={User}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
            />

            <PropertyRow
              label="Attendees"
              value={true}
              fieldName="featuredShowAttendees"
              type="checkbox"
              onValueChange={() => {}}
              icon={Users}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
            />

            <PropertyRow
              label="Countdown"
              value={true}
              fieldName="featuredShowCountdown"
              type="checkbox"
              onValueChange={() => {}}
              icon={Calendar}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
            />
          </div>
        )}
      </div>
    </div>
  );
} 