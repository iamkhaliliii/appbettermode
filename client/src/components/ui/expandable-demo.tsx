"use client"

import React from "react"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
} from "lucide-react"
import { motion as framerMotion } from "framer-motion"

import { Expandable, ExpandableContent, ExpandableTrigger } from "@/components/ui/expandable"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/primitives/avatar"
import { Badge } from "@/components/ui/primitives/badge"
import { Button } from "@/components/ui/primitives/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/primitives/tooltip"

function ExpandableEventCardDemo() {
  const eventData = {
    title: "Monthly Music Meetup - March 2024",
    date: "Saturday, March 23rd",
    time: "7:00 PM",
    location: "Community Center",
    attendees: 67,
    category: "Networking",
    status: "upcoming" as "upcoming" | "ongoing" | "completed",
    host: {
      name: "Jordan Kim",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Expandable
        expandDirection="vertical"
        expandBehavior="replace"
        transitionDuration={0.4}
        initialDelay={0.1}
      >
        {({ isExpanded }) => (
          <ExpandableTrigger>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-300 cursor-pointer group">
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    {/* Category, Time and Status */}
                    <div className="flex items-center gap-3 mb-2">
                      {/* Category Badge */}
                      <Badge className="bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-100 text-[0.75rem] px-1.5 py-0.5 font-medium border-0 rounded-md">
                        {eventData.status === 'ongoing' ? 'Live Event' : 'Upcoming Event'}
                      </Badge>
                      
                      {/* Time */}
                      <span className="text-[0.7rem] font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {eventData.date} • {eventData.time}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h4 className="font-semibold text-[1rem] mb-3 mt-2 text-zinc-900 dark:text-zinc-100">
                      {eventData.title}
                    </h4>
                    
                    {/* Basic Info - Always Visible */}
                    <div className="flex items-center gap-4 text-[0.8rem] text-zinc-600 dark:text-zinc-400">
                      {/* Attendees */}
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          {eventData.attendees} attendees
                        </span>
                      </div>
                      
                      {/* Location */}
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="text-xs truncate max-w-[120px]">{eventData.location}</span>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <ExpandableContent preset="slide-up" stagger staggerChildren={0.1}>
                      <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                        {/* Event Description */}
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4">
                          Join us for our monthly music meetup where we'll explore the intersection of analog and digital music production. Perfect for producers, musicians, and music enthusiasts of all levels.
                        </p>
                        
                        {/* Host Info */}
                        <div className="mb-4">
                          <h5 className="font-medium text-sm text-zinc-800 dark:text-zinc-200 mb-2 flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Host:
                          </h5>
                          <div className="flex items-center gap-3">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Avatar className="border-2 border-white dark:border-gray-800">
                                    <AvatarImage
                                      src={eventData.host.avatar}
                                      alt={eventData.host.name}
                                    />
                                    <AvatarFallback>{eventData.host.name[0]}</AvatarFallback>
                                  </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{eventData.host.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                              {eventData.host.name}
                            </span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                            <Video className="h-4 w-4 mr-2" />
                            Join Meeting
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Calendar className="h-4 w-4 mr-2" />
                            Add to Calendar
                          </Button>
                        </div>

                        {/* Additional Event Info */}
                        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                          <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-300">
                            <span>Category: {eventData.category}</span>
                            <span>Status: {eventData.status}</span>
                          </div>
                        </div>
                      </div>
                    </ExpandableContent>
                  </div>
                  
                  {/* Calendar Icon */}
                  <div className="flex-shrink-0 relative">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors duration-300">
                            <Calendar className="w-5 h-5 text-red-600 dark:text-red-400" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isExpanded ? 'Collapse' : 'Expand'} Event Details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </div>
          </ExpandableTrigger>
        )}
      </Expandable>
    </div>
  )
}

function ExpandableCardDemo() {
  return (
    <div className="p-8 w-full max-w-2xl mx-auto space-y-12 bg-zinc-50 dark:bg-zinc-900 min-h-screen">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Expandable Event Calendar Card
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Click on the card below to see the expandable animation in action!
        </p>
      </div>
      
      <div className="flex flex-col items-center space-y-8">
        <ExpandableEventCardDemo />
        
        <div className="text-center text-sm text-zinc-500 dark:text-zinc-400 max-w-md">
          <p>
            The card shows basic event information when collapsed and reveals additional details, 
            host information, and action buttons when expanded. The smooth animations are powered 
            by Framer Motion with custom spring configurations.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ExpandableCardDemo 