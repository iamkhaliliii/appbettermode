import React from 'react';
import { Calendar, MapPin, Mail, Phone, Globe, ExternalLink } from 'lucide-react';

interface Host {
  id: string;
  name: string;
  avatar: string;
  role?: string;
}

interface EventSidebarProps {
  eventDate?: string;
  eventLocation?: string;
  attendeesCount?: number;
  maxAttendees?: number;
  isRSVPed: boolean;
  onRSVP: () => void;
  eventType?: 'online' | 'in-person' | 'hybrid';
  price?: {
    type: 'free' | 'paid';
    amount?: number;
    currency?: string;
  };
  contactInfo?: {
    email: string;
    phone?: string;
    website?: string;
  };
  locationDetails?: {
    address: string;
    map_url?: string;
    parking_info?: string;
    accessibility?: string;
  };
  hosts?: Host[];
}

export const EventSidebar: React.FC<EventSidebarProps> = ({
  eventDate,
  eventLocation,
  attendeesCount = 0,
  maxAttendees = 0,
  isRSVPed,
  onRSVP,
  eventType,
  price,
  contactInfo,
  locationDetails,
  hosts = []
}) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return { date: 'TBA', time: '' };
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const { date, time } = formatDate(eventDate);

  return (
    <div className="space-y-4">
      {/* RSVP Button */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
        <button
          onClick={onRSVP}
          className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            isRSVPed
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
          }`}
        >
          {isRSVPed ? 'You\'re attending' : 'RSVP'}
        </button>
        
        {price && (
          <div className="mt-2 text-center text-xs text-gray-600 dark:text-gray-400">
            {price.type === 'free' ? 'Free admission' : `${price.currency || '$'}${price.amount} per person`}
          </div>
        )}
      </div>

      {/* Hosts Section */}
      {hosts.length > 0 && (
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            Hosts
          </div>
          <div className="space-y-2">
            {hosts.map((host) => (
              <div key={host.id} className="flex items-center gap-3">
                <img
                  src={host.avatar}
                  alt={host.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {host.name}
                  </div>
                  {host.role && (
                    <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {host.role}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Details */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
        <div className="space-y-3 text-sm">
          {/* Date & Time */}
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">{date}</div>
              {time && <div className="text-gray-600 dark:text-gray-400 text-xs">{time}</div>}
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <div className="font-medium text-gray-900 dark:text-gray-100 break-words">
                {eventLocation || 'Location TBA'}
              </div>
              {eventType && (
                <div className="text-gray-600 dark:text-gray-400 text-xs capitalize">
                  {eventType.replace('-', ' ')}
                </div>
              )}
            </div>
          </div>

          {/* Capacity */}
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {attendeesCount} of {maxAttendees} attending
          </div>
        </div>
      </div>

      {/* Location Details */}
      {locationDetails && (
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Location
          </div>
          <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <div>{locationDetails.address}</div>
            
            {locationDetails.map_url && (
              <a
                href={locationDetails.map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                <ExternalLink className="w-3 h-3" />
                View map
              </a>
            )}

            {locationDetails.parking_info && (
              <div>
                <span className="font-medium">Parking:</span> {locationDetails.parking_info}
              </div>
            )}

            {locationDetails.accessibility && (
              <div>
                <span className="font-medium">Accessibility:</span> {locationDetails.accessibility}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact */}
      {contactInfo && (
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Contact
          </div>
          <div className="space-y-1.5">
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <Mail className="w-3 h-3" />
              <span className="truncate">{contactInfo.email}</span>
            </a>

            {contactInfo.phone && (
              <a
                href={`tel:${contactInfo.phone}`}
                className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <Phone className="w-3 h-3" />
                {contactInfo.phone}
              </a>
            )}

            {contactInfo.website && (
              <a
                href={contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              >
                <Globe className="w-3 h-3" />
                Website
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 