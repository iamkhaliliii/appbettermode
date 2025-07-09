"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import { Dialog, DialogTrigger } from "@/components/ui/primitives/dialog";
import { SocialCardProps } from "./types";
import { PollCard } from "./poll-card";
import { VideoCard } from "./video-card";
import { FormCard } from "./form-card";
import { EventCard } from "./event-card";
import { LinkPreviewCard } from "./link-preview-card";
import { ImagesGrid } from "./images-grid";
import { EngagementSection } from "./engagement-section";
import { SocialCardModal } from "./social-card-modal";

export function SocialCard({
  author,
  content,
  engagement,
  engagementStyle = "default",
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
  className
}: SocialCardProps) {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  return (
    <Dialog open={isPostModalOpen} onOpenChange={setIsPostModalOpen}>
      <DialogTrigger asChild>
        <div
          className={cn(
            "w-full max-w-2xl mx-auto cursor-pointer",
            "bg-white dark:bg-zinc-900",
            "border border-zinc-200 dark:border-zinc-800",
            "rounded-xl shadow-sm hover:shadow-md transition-shadow",
            className
          )}
        >
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            <div className="p-6">
              {/* Author section */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <img
                    src={author?.avatar}
                    alt={author?.name}
                    className="w-12 h-12 rounded-full ring-2 ring-white dark:ring-zinc-800"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        {author?.name}
                      </h3>
                      {author?.badge && (
                        <Badge 
                          variant="secondary" 
                          className="text-xs px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-normal"
                        >
                          {author.badge.emoji && <span className="mr-0.5">{author.badge.emoji}</span>}
                          {author.badge.text}
                        </Badge>
                      )}
                      {author?.emoji && (
                        <span className="text-base">{author.emoji}</span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {author?.timeAgo}
                      {author?.postCategory && (
                        <span> • posted on {author.postCategory}</span>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMore?.();
                  }}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              {/* Content section */}
              {content?.text && (
                <p className="text-zinc-600 dark:text-zinc-300 mb-4">
                  {content.text}
                </p>
              )}

              {/* Content preview - show abbreviated version */}
              <div className="space-y-4">
                {/* Poll Card */}
                {content?.poll && (
                  <PollCard poll={content.poll} onPollVote={onPollVote} isPreview />
                )}

                {/* Video Card */}
                {content?.video && (
                  <VideoCard video={content.video} isPreview />
                )}

                {/* Form Card */}
                {content?.form && (
                  <FormCard form={content.form} isPreview />
                )}

                {/* Event Card */}
                {content?.event && (
                  <EventCard event={content.event} isPreview />
                )}

                {/* Link Preview Card */}
                {content?.link && (
                  <LinkPreviewCard link={content.link} isPreview />
                )}

                {/* Images - Part of Post Content */}
                {content?.images && content.images.length > 0 && (
                  <ImagesGrid images={content.images} isPreview />
                )}
              </div>

              {/* Engagement section */}
              <div className="mt-4">
                <div onClick={(e) => e.stopPropagation()}>
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
            </div>
          </div>
        </div>
      </DialogTrigger>
      
      <SocialCardModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        author={author}
        content={content}
        engagement={engagement}
        engagementStyle={engagementStyle}
        onLike={onLike}
        onComment={onComment}
        onShare={onShare}
        onBookmark={onBookmark}
        onMore={onMore}
        onUpvote={onUpvote}
        onDownvote={onDownvote}
        onReaction={onReaction}
        onRSVP={onRSVP}
        onPollVote={onPollVote}
      />
    </Dialog>
  );
} 