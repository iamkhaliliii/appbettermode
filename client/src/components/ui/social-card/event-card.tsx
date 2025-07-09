"use client";

import { cn } from "@/lib/utils";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/primitives/avatar";
import { AvatarGroup } from "@/components/ui/avatar";
import { EventCardProps } from "./types";

export function EventCard({ event, isPreview = false }: EventCardProps) {
  if (!event) return null;

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-50/30 dark:bg-zinc-800/30">
      <div className="p-5">
        {/* Event Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Event
            </h4>
          </div>
          <Badge variant={event.status === 'ongoing' ? 'destructive' : 'secondary'} className="text-xs">
            {event.status === 'ongoing' ? 'Live' : 'Upcoming'}
          </Badge>
        </div>

        {/* Main Event Content */}
        <div className="flex gap-4 ">
          {/* Event Cover Image */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 rounded-lg overflow-hidden">
              <img 
                src={event.image || "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=200&h=200&fit=crop&crop=center"}
                alt={event.title || "Event cover"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Separator Line */}
          <div className="w-px bg-zinc-100 dark:bg-zinc-700 my-1"></div>

          {/* Event Details */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Date and Time - Side by Side */}
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span>Saturday, March 23rd</span>
              <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-600"></div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Starts from {event.time}</span>
              </div>
            </div>

            {/* Event Title */}
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
              {event.title}
            </h3>

            {/* Event Type and Location - Side by Side */}
            <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-1">
                <Video className="w-3 h-3" />
                <span>Online Event</span>
              </div>
              <div className="w-px h-3 bg-zinc-300 dark:bg-zinc-600"></div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{event.location || 'Community Center'}</span>
              </div>
            </div>

            {/* Event Attendees and Host */}
            <div className="flex items-center gap-4">
              <AvatarGroup 
                members={[
                  { src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face", username: "Jordan" },
                  { src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face", username: "Taylor" },
                  { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=32&h=32&fit=crop&crop=face", username: "Casey" },
                  { src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=32&h=32&fit=crop&crop=face", username: "Morgan" },
                  { src: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=32&h=32&fit=crop&crop=face", username: "Riley" },
                  { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=face", username: "Avery" }
                ]}
                size={24}
                limit={5}
              />

              {/* Host Info */}
              {event.host && (
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6 border-2 border-white dark:border-zinc-800">
                    <AvatarImage
                      src={event.host.avatar}
                      alt={event.host.name}
                    />
                    <AvatarFallback className="text-xs">{event.host.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    By Event Host
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Indicator - Only show when ongoing */}
        {event.status === 'ongoing' && (
          <div className="flex items-center justify-center pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                Live Now
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 