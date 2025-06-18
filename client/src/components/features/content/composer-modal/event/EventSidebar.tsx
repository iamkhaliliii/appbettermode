import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/primitives";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Globe,
  Building,
  Video,
  Hash,
  Search,
  Eye,
  Shield,
  Smartphone,
  Mail,
  Bell,
  Tag,
  UserCheck,
  Youtube,
  Repeat,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PropertyRow } from "@/components/dashboard/site-config";
import { EventSidebarProps } from "./types";

export function EventSidebar({
  formData,
  onUpdateField,
  editingField,
  onFieldClick,
  onFieldBlur,
  onKeyDown,
  className,
}: EventSidebarProps) {
  // Options for dropdowns
  const locationTypeOptions = [
    { 
      value: 'address', 
      label: 'Physical Address',
      description: 'Event will be held at a specific physical location',
      icon: Building
    },
    { 
      value: 'virtual', 
      label: 'Virtual Event',
      description: 'Online event accessible via internet link',
      icon: Video
    },
    { 
      value: 'tbd', 
      label: 'To Be Determined',
      description: 'Location will be announced later',
      icon: MapPin
    },
  ];

  const virtualProviderOptions = [
    { 
      value: 'url', 
      label: 'Custom URL',
      description: 'Any custom meeting or streaming link',
      icon: Globe
    },
    { 
      value: 'zoom', 
      label: 'Zoom',
      description: 'Zoom video conferencing platform',
      icon: Video
    },
    { 
      value: 'meet', 
      label: 'Google Meet',
      description: 'Google Meet video calls',
      icon: Video
    },
    { 
      value: 'youtube', 
      label: 'YouTube Live',
      description: 'YouTube live streaming platform',
      icon: Youtube
    },
    { 
      value: 'streamyard', 
      label: 'StreamYard',
      description: 'Professional live streaming studio',
      icon: Video
    },
  ];

  const registrationProviderOptions = [
    { 
      value: 'bettermode', 
      label: 'Bettermode',
      description: 'Built-in registration system',
      icon: Users
    },
    { 
      value: 'luma', 
      label: 'Luma',
      description: 'Event discovery and ticketing platform',
      icon: Calendar
    },
    { 
      value: 'eventbrite', 
      label: 'Eventbrite',
      description: 'Popular event ticketing service',
      icon: Calendar
    },
    { 
      value: 'bevy', 
      label: 'Bevy',
      description: 'Community event platform',
      icon: Users
    },
    { 
      value: 'other', 
      label: 'Other',
      description: 'External registration platform',
      icon: Globe
    },
  ];

  return (
    <div className={cn("flex flex-col h-full bg-gray-50/10 dark:bg-gray-900/50", className)}>
      {/* Sidebar Header */}
      <div className="flex-shrink-0 px-6 pt-6 pb-6 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 ">
          Event Details
        </h3>
      </div>

      {/* Sidebar Content - Match EventFormFields structure exactly */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent pt-4">
        <div className="space-y-1">
          <div>
            <PropertyRow
              label="Start Date & Time"
              value={formData.dateFrom}
              fieldName="dateFrom"
              type="datetime"
              onValueChange={(value) => onUpdateField('dateFrom', value)}
              icon={Clock}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="When the event starts"
            />

            <PropertyRow
              label="End Date & Time"
              value={formData.dateTo}
              fieldName="dateTo"
              type="datetime"
              onValueChange={(value) => onUpdateField('dateTo', value)}
              icon={Clock}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="When the event ends"
            />

            <PropertyRow
              label="Repeat"
              value={formData.repeat}
              fieldName="repeat"
              type="repeat"
              onValueChange={(value) => onUpdateField('repeat', value)}
              icon={Repeat}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="How often this event repeats"
              startDate={formData.dateFrom}
            />

            <PropertyRow
              label="Timezone"
              value={formData.timezone}
              fieldName="timezone"
              type="timezone"
              onValueChange={(value) => onUpdateField('timezone', value)}
              icon={Globe}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Event timezone"
            />

            <PropertyRow
              label="Hosts"
              value={formData.hosts}
              fieldName="hosts"
              type="users"
              onValueChange={(value) => onUpdateField('hosts', value)}
              icon={UserCheck}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Select event hosts"
            />

            <PropertyRow
              label="Location Type"
              value={formData.locationType}
              fieldName="locationType"
              type="select"
              options={locationTypeOptions}
              onValueChange={(value) => onUpdateField('locationType', value)}
              icon={MapPin}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Where the event takes place"
            />

            {formData.locationType === 'address' && (
              <PropertyRow
                label="Address"
                value={formData.address}
                fieldName="address"
                type="text"
                onValueChange={(value) => onUpdateField('address', value)}
                icon={Building}
                editingField={editingField}
                onFieldClick={onFieldClick}
                onFieldBlur={onFieldBlur}
                onKeyDown={onKeyDown}
                description="Physical address of the event"
                placeholder="Enter full address"
                isChild={true}
              />
            )}

            {formData.locationType === 'virtual' && (
              <>
                <PropertyRow
                  label="Virtual Provider"
                  value={formData.virtualProvider}
                  fieldName="virtualProvider"
                  type="select"
                  options={virtualProviderOptions}
                  onValueChange={(value) => onUpdateField('virtualProvider', value)}
                  icon={Video}
                  editingField={editingField}
                  onFieldClick={onFieldClick}
                  onFieldBlur={onFieldBlur}
                  onKeyDown={onKeyDown}
                  description="Virtual meeting platform"
                  isChild={true}
                />

                <PropertyRow
                  label="Meeting URL"
                  value={formData.virtualUrl}
                  fieldName="virtualUrl"
                  type="text"
                  onValueChange={(value) => onUpdateField('virtualUrl', value)}
                  icon={Globe}
                  editingField={editingField}
                  onFieldClick={onFieldClick}
                  onFieldBlur={onFieldBlur}
                  onKeyDown={onKeyDown}
                  description="Link to join the virtual event"
                  placeholder="https://..."
                  isChild={true}
                />
              </>
            )}

            <PropertyRow
              label="Registration Provider"
              value={formData.registrationProvider}
              fieldName="registrationProvider"
              type="select"
              options={registrationProviderOptions}
              onValueChange={(value) => onUpdateField('registrationProvider', value)}
              icon={Users}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="How people register for the event"
            />

            {formData.registrationProvider !== 'bettermode' && (
              <PropertyRow
                label="Registration URL"
                value={formData.registrationUrl}
                fieldName="registrationUrl"
                type="text"
                onValueChange={(value) => onUpdateField('registrationUrl', value)}
                icon={Globe}
                editingField={editingField}
                onFieldClick={onFieldClick}
                onFieldBlur={onFieldBlur}
                onKeyDown={onKeyDown}
                description="External registration page URL"
                placeholder="https://..."
                isChild={true}
              />
            )}

            <PropertyRow
              label="Capacity"
              value={formData.capacity}
              fieldName="capacity"
              type="number"
              onValueChange={(value) => onUpdateField('capacity', value)}
              icon={Users}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Maximum number of attendees (0 = unlimited)"
              placeholder="0"
              min={0}
              max={10000}
              step={1}
            />

            <PropertyRow
              label="Event Tags"
              value={formData.tags}
              fieldName="tags"
              type="tags"
              onValueChange={(value) => onUpdateField('tags', value)}
              icon={Tag}
              editingField={editingField}
              onFieldClick={onFieldClick}
              onFieldBlur={onFieldBlur}
              onKeyDown={onKeyDown}
              description="Tags for categorizing this event"
            />
          </div>
        </div>

        {/* Advanced Settings Accordion - Match EventFormFields structure exactly */}
        <div className="px-1 space-y-2 pt-0 ">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="advanced-settings" className="pb-2 border-gray-100 dark:border-gray-700">
              <AccordionTrigger className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 py-2 px-0">
                Advanced Settings
              </AccordionTrigger>
              <AccordionContent className="space-y-2 pt-2">
                {/* SEO Settings */}
                <div className="space-y-2">
                  <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    SEO & URL
                  </h4>
                  <div>
                    <PropertyRow
                      label="URL Slug"
                      value={formData.slug}
                      fieldName="slug"
                      type="text"
                      onValueChange={(value) => onUpdateField('slug', value)}
                      icon={Hash}
                      editingField={editingField}
                      onFieldClick={onFieldClick}
                      onFieldBlur={onFieldBlur}
                      onKeyDown={onKeyDown}
                      description="Custom URL for this event"
                      placeholder="my-awesome-event"
                    />

                    <PropertyRow
                      label="Meta Title"
                      value={formData.metaTitle}
                      fieldName="metaTitle"
                      type="text"
                      onValueChange={(value) => onUpdateField('metaTitle', value)}
                      icon={Search}
                      editingField={editingField}
                      onFieldClick={onFieldClick}
                      onFieldBlur={onFieldBlur}
                      onKeyDown={onKeyDown}
                      description="SEO title for search engines"
                      placeholder="SEO title"
                    />

                    <PropertyRow
                      label="Meta Description"
                      value={formData.metaDescription}
                      fieldName="metaDescription"
                      type="text"
                      onValueChange={(value) => onUpdateField('metaDescription', value)}
                      icon={Search}
                      editingField={editingField}
                      onFieldClick={onFieldClick}
                      onFieldBlur={onFieldBlur}
                      onKeyDown={onKeyDown}
                      description="SEO description for search engines"
                      placeholder="SEO description"
                    />

                    <PropertyRow
                      label="Hide from Search"
                      value={formData.hideFromSearch}
                      fieldName="hideFromSearch"
                      type="checkbox"
                      onValueChange={(value) => onUpdateField('hideFromSearch', value)}
                      icon={Eye}
                      editingField={editingField}
                      onFieldClick={onFieldClick}
                      onFieldBlur={onFieldBlur}
                      onKeyDown={onKeyDown}
                      description="Hide this event from search results"
                    />
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="space-y-3">
                  <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    Privacy Settings
                  </h4>
                  <div>
                    <PropertyRow
                      label="Hide Address"
                      value={formData.hideAddress}
                      fieldName="hideAddress"
                      type="checkbox"
                      onValueChange={(value) => onUpdateField('hideAddress', value)}
                      icon={Shield}
                      editingField={editingField}
                      onFieldClick={onFieldClick}
                      onFieldBlur={onFieldBlur}
                      onKeyDown={onKeyDown}
                      description="Hide address from non-attendees"
                    />

                    <PropertyRow
                      label="Hide Attendees"
                      value={formData.hideAttendees}
                      fieldName="hideAttendees"
                      type="checkbox"
                      onValueChange={(value) => onUpdateField('hideAttendees', value)}
                      icon={Eye}
                      editingField={editingField}
                      onFieldClick={onFieldClick}
                      onFieldBlur={onFieldBlur}
                      onKeyDown={onKeyDown}
                      description="Hide attendees list from other users"
                    />
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="space-y-3">
                  <h4 className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                    Notifications
                  </h4>
                  <div>
                    <PropertyRow
                      label="In-App Confirmation"
                      value={formData.sendInAppConfirmation}
                      fieldName="sendInAppConfirmation"
                      type="checkbox"
                      onValueChange={(value) => onUpdateField('sendInAppConfirmation', value)}
                      icon={Smartphone}
                      editingField={editingField}
                      onFieldClick={onFieldClick}
                      onFieldBlur={onFieldBlur}
                      onKeyDown={onKeyDown}
                      description="Send in-app notification upon registration"
                    />

                    <PropertyRow
                      label="Email Confirmation"
                      value={formData.sendEmailConfirmation}
                      fieldName="sendEmailConfirmation"
                      type="checkbox"
                      onValueChange={(value) => onUpdateField('sendEmailConfirmation', value)}
                      icon={Mail}
                      editingField={editingField}
                      onFieldClick={onFieldClick}
                      onFieldBlur={onFieldBlur}
                      onKeyDown={onKeyDown}
                      description="Send email confirmation upon registration"
                    />

                    <PropertyRow
                      label="In-App Reminder"
                      value={formData.sendInAppReminder}
                      fieldName="sendInAppReminder"
                      type="checkbox"
                      onValueChange={(value) => onUpdateField('sendInAppReminder', value)}
                      icon={Bell}
                      editingField={editingField}
                      onFieldClick={onFieldClick}
                      onFieldBlur={onFieldBlur}
                      onKeyDown={onKeyDown}
                      description="Send in-app reminder before event"
                    />

                    <PropertyRow
                      label="Email Reminder"
                      value={formData.sendEmailReminder}
                      fieldName="sendEmailReminder"
                      type="checkbox"
                      onValueChange={(value) => onUpdateField('sendEmailReminder', value)}
                      icon={Mail}
                      editingField={editingField}
                      onFieldClick={onFieldClick}
                      onFieldBlur={onFieldBlur}
                      onKeyDown={onKeyDown}
                      description="Send email reminder before event"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
} 