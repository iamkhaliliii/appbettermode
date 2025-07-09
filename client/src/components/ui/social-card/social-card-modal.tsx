"use client";

import { Badge } from "@/components/ui/primitives";
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
  onPollVote,
}: SocialCardModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-[85vw] sm:max-w-[70vw] w-full max-h-[70vh] h-[70vh] overflow-hidden border border-zinc-200 dark:border-zinc-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex h-full">
          {/* Left Column - Content */}
          <div className="flex-1 flex flex-col h-full">
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
                      <FormCard form={content.form} />
                    )}

                    {/* Event Card */}
                    {content?.event && (
                      <EventCard event={content.event} />
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
              <EngagementSection
                engagement={engagement}
                engagementStyle={engagementStyle}
                onLike={onLike}
                onComment={onComment}
                onShare={onShare}
                onBookmark={onBookmark}
                onUpvote={onUpvote}
                onDownvote={onDownvote}
                onReaction={onReaction}
                onRSVP={onRSVP}
              />
            </div>
          </div>

          {/* Right Column - Comments */}
          <div className="w-72 sm:w-96 border-l border-zinc-200 dark:border-zinc-800 h-full">
            <CommentsSection />
          </div>
        </div>
      </div>
    </div>
  );
} 