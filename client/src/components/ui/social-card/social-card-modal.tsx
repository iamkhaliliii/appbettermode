"use client";

import React from "react";
import { Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/primitives/button";
import { 
  ExternalLink, 
  Calendar, 
  EllipsisVertical, 
  Maximize2, 
  FileChartColumn,
  Edit,
  CornerUpRight,
  BarChart3,
  Shield,
  EyeOff,
  Trash2,
  Flag,
  Pin,
  Ellipsis,
  MessageCircle,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/forms/dropdown-menu";
import { SocialCardModalProps } from "./types";
import { PollCard } from "./poll-card";
import { VideoCard } from "./video-card";
import { FormCard } from "./form-card";
import { EventCard } from "./event-card";
import { LinkPreviewCard } from "./link-preview-card";
import { ImagesGrid } from "./images-grid";
import { CommentsSection } from "./comments-section";
import { EngagementSection } from "./engagement-section";

export function SocialCardModal({
  isOpen,
  onClose,
  author,
  content,
  engagement,
  engagementStyle,
  onLike,
  onComment,
  onShare,
  onBookmark,
  onMore,
  onUpvote,
  onDownvote,
  onReaction,
  onRSVP,
  onAddToCalendar,
  onSubmitForm,
  onResetForm,
  onPollVote,
}: SocialCardModalProps) {
  const [isCommentsOpen, setIsCommentsOpen] = React.useState(true);
  const [isFormOpen, setIsFormOpen] = React.useState(!!content?.form);
  const [isEventOpen, setIsEventOpen] = React.useState(!!content?.event);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-h-[70vh] h-[70vh] overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-all duration-500 ease-in-out ${
        isCommentsOpen 
          ? 'max-w-[90vw] sm:max-w-[85vw] lg:max-w-[70vw]' 
          : 'max-w-[60vw] sm:max-w-[55vw] lg:max-w-[45vw]'
      }`}>
        {/* Header Actions */}
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-0.5">
          
          {/* Chart/Analytics Icon */}
          <button className="flex items-center gap-1 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
            <FileChartColumn className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />          </button>
                    {/* Comments Toggle - Only show when comments are closed */}
                    {!isCommentsOpen && (
            <button 
              onClick={() => setIsCommentsOpen(true)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
              title="Show comments"
            >
              <MessageCircle className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            </button>
          )}
          
          {/* Maximize Button */}
          <button className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          </button>
          

          
          {/* More Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                <Ellipsis className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                <span>Edit post</span>
                <span className="ml-auto text-xs text-zinc-400">E</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <CornerUpRight className="w-3 h-3" />
                <span>Move post</span>
                <span className="ml-auto text-xs text-zinc-400">M</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <BarChart3 className="w-3 h-3" />
                <span>Post analytics</span>
                <span className="ml-auto text-xs text-zinc-400">⌘ A</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Shield className="w-3 h-3" />
                <span>Audit logs</span>
                <span className="ml-auto text-xs text-zinc-400">⌘ L</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Pin className="w-3 h-3" />
                <span>Pin post</span>
                <span className="ml-auto text-xs text-zinc-400">P</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <EyeOff className="w-3 h-3" />
                <span>Hide post</span>
                <span className="ml-auto text-xs text-zinc-400">H</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <Trash2 className="w-3 h-3" />
                <span>Delete post</span>
                <span className="ml-auto text-xs text-zinc-400">⌘ ⌫</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Flag className="w-3 h-3" />
                <span>Report post</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex h-full">
          {/* Left Column - Content */}
          <div className="flex flex-col h-full flex-1 min-w-0">
            {/* Header - Fixed (Author info only) */}
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
              {/* Author section */}
              <div className="flex items-center gap-3">
                <img
                  src={author?.avatar}
                  alt={author?.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {author?.name}
                    </h3>
                    {author?.badge && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-normal"
                      >
                        {author.badge.emoji && <span className="mr-0.5">{author.badge.emoji}</span>}
                        {author.badge.text}
                      </Badge>
                    )}
                    {author?.emoji && (
                      <span className="text-sm">{author.emoji}</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {author?.timeAgo}
                    {author?.postCategory && (
                      <span> • {author.postCategory}</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Content - Scrollable (Post text + all attachments) */}
            <div className="flex-1 overflow-y-auto scrollbar-light">
              <div className="p-6">
                <div className="space-y-4">
                  {/* Post Text */}
                  {content?.text && (
                    <div>
                      <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed">
                        {content.text}
                      </p>
                    </div>
                  )}

                  {/* Full content attachments */}
                  <div className="space-y-3">
                    {/* Poll Card */}
                    {content?.poll && (
                      <PollCard poll={content.poll} onPollVote={onPollVote} />
                    )}

                    {/* Video Card */}
                    {content?.video && (
                      <VideoCard video={content.video} />
                    )}

                    {/* Form Card */}
                    {content?.form && (
                      <FormCard 
                        form={content.form} 
                        isFormOpen={isFormOpen}
                        isInModal={true}
                      />
                    )}

                    {/* Event Card */}
                    {content?.event && (
                      <EventCard 
                        event={content.event} 
                        isEventOpen={isEventOpen}
                        isInModal={true}
                      />
                    )}

                    {/* Link Preview Card */}
                    {content?.link && (
                      <LinkPreviewCard link={content.link} />
                    )}

                    {/* Images - Part of Post Content */}
                    {content?.images && content.images.length > 0 && (
                      <ImagesGrid images={content.images} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 px-6 py-4 flex-shrink-0">
              {/* Event Actions - Only show when content is Event type */}
              {content?.event && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      You can reserve this event
                    </p>
                    <div className="flex items-center gap-3">
                      <Button 
                        onClick={onRSVP ? () => onRSVP('yes') : undefined}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 text-xs px-3 py-1.5 h-auto"
                      >
                        <ExternalLink className="w-3 h-3" />
                        RSVP
                      </Button>
                      <button 
                        onClick={onAddToCalendar}
                        className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors flex items-center gap-1"
                      >
                        <Calendar className="w-3 h-3" />
                        Add to Calendar
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-zinc-100 dark:border-zinc-800 mb-3"></div>
                </>
              )}

              {/* Form Actions - Only show when content is Form type */}
              {content?.form && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Submit your response
                    </p>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={onResetForm}
                        className="text-xs text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 hover:underline transition-colors"
                      >
                        Reset Form
                      </button>
                      <Button 
                        onClick={onSubmitForm}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 text-xs px-3 py-1.5 h-auto"
                      >
                        {content.form.submitText}
                      </Button>
                    </div>
                  </div>
                  <div className="border-t border-zinc-100 dark:border-zinc-800 mb-3"></div>
                </>
              )}

              <EngagementSection
                engagement={engagement}
                engagementStyle={engagementStyle}
                onLike={onLike}
                onComment={() => setIsCommentsOpen(!isCommentsOpen)}
                onShare={onShare}
                onBookmark={onBookmark}
                onUpvote={onUpvote}
                onDownvote={onDownvote}
                onReaction={onReaction}
                onRSVP={onRSVP}
                isCommentsOpen={false}
              />
            </div>
          </div>

          {/* Right Column - Comments */}
          <div className={`border-l border-zinc-200 dark:border-zinc-800 h-full flex-shrink-0 transition-all duration-500 ease-in-out overflow-hidden ${
            isCommentsOpen 
              ? 'w-64 sm:w-72 lg:w-96 opacity-100' 
              : 'w-0 opacity-0'
          }`}>
            <div className="w-64 sm:w-72 lg:w-96 h-full">
              <CommentsSection 
                onToggle={() => setIsCommentsOpen(!isCommentsOpen)}
                isCollapsed={!isCommentsOpen}
                onReaction={(commentId, reactionType) => console.log('Reaction:', reactionType, 'for comment:', commentId)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 