"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ArrowUp,
  ArrowDown,
  SmilePlus,
  Check,
  X,
  HelpCircle,
} from "lucide-react";
import { Badge, Popover, PopoverContent, PopoverTrigger } from "@/components/ui/primitives";
import { Button } from "@/components/ui/primitives/button";
import { EngagementSectionProps, ReactionEmoji } from "./types";

export function EngagementSection({
  engagement,
  engagementStyle = "default",
  onLike,
  onComment,
  onShare,
  onBookmark,
  onUpvote,
  onDownvote,
  onReaction,
  onRSVP,
  isCommentsOpen = true,
}: EngagementSectionProps) {
  const [isLiked, setIsLiked] = useState(engagement?.isLiked ?? false);
  const [isBookmarked, setIsBookmarked] = useState(engagement?.isBookmarked ?? false);
  const [likes, setLikes] = useState(engagement?.likes ?? 0);
  const [isUpvoted, setIsUpvoted] = useState(engagement?.isUpvoted ?? false);
  const [isDownvoted, setIsDownvoted] = useState(engagement?.isDownvoted ?? false);
  const [upvotes, setUpvotes] = useState(engagement?.upvotes ?? 0);
  const [downvotes, setDownvotes] = useState(engagement?.downvotes ?? 0);
  const [userReaction, setUserReaction] = useState(engagement?.userReaction || "");
  const [isReactionPopoverOpen, setIsReactionPopoverOpen] = useState(false);
  const [userRSVP, setUserRSVP] = useState(engagement?.userRSVP || null);
  const [rsvpCounts, setRsvpCounts] = useState({
    yes: engagement?.rsvp?.yes ?? 0,
    no: engagement?.rsvp?.no ?? 0,
    maybe: engagement?.rsvp?.maybe ?? 0,
  });

  // Available reaction emojis
  const availableReactions: ReactionEmoji[] = [
    { emoji: "❤️", label: "Love" },
    { emoji: "👍", label: "Like" },
    { emoji: "👎", label: "Dislike" },
    { emoji: "🔥", label: "Fire" },
    { emoji: "😂", label: "Laugh" },
    { emoji: "😮", label: "Wow" },
    { emoji: "😢", label: "Sad" },
    { emoji: "😡", label: "Angry" },
    { emoji: "👏", label: "Clap" },
    { emoji: "🎉", label: "Celebrate" },
  ];

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.();
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.();
  };

  const handleUpvote = () => {
    if (isDownvoted) {
      setIsDownvoted(false);
      setDownvotes(prev => prev - 1);
    }
    setIsUpvoted(!isUpvoted);
    setUpvotes(prev => isUpvoted ? prev - 1 : prev + 1);
    onUpvote?.();
  };

  const handleDownvote = () => {
    if (isUpvoted) {
      setIsUpvoted(false);
      setUpvotes(prev => prev - 1);
    }
    setIsDownvoted(!isDownvoted);
    setDownvotes(prev => isDownvoted ? prev - 1 : prev + 1);
    onDownvote?.();
  };

  const handleReaction = (reaction: string) => {
    setUserReaction(userReaction === reaction ? "" : reaction);
    onReaction?.(reaction);
  };

  const handleRSVP = (response: "yes" | "no" | "maybe") => {
    // If user is changing their RSVP, update counts accordingly
    if (userRSVP) {
      setRsvpCounts(prev => ({
        ...prev,
        [userRSVP]: prev[userRSVP] - 1
      }));
    }
    
    // If selecting the same response, unselect it
    if (userRSVP === response) {
      setUserRSVP(null);
    } else {
      setUserRSVP(response);
      setRsvpCounts(prev => ({
        ...prev,
        [response]: prev[response] + 1
      }));
    }
    
    onRSVP?.(response);
  };

  switch (engagementStyle) {
    case "upvote":
      return (
        <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
          {/* Upvote/Downvote */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleUpvote}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-sm rounded-full transition-all border border-zinc-100 dark:border-zinc-700",
                isUpvoted
                  ? "bg-green-50 text-green-500 border border-green-100"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-100 dark:border-zinc-700"
              )}
            >
              <ArrowUp className="w-4 h-4" />
              {isUpvoted && (
                <span className="text-[0.7rem] font-medium text-green-500">{upvotes}</span>
              )}  
              {!isUpvoted && (
                <span className="text-[0.7rem] font-medium text-zinc-500 dark:text-zinc-400">{upvotes}</span>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownvote}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-sm rounded-full transition-all border border-zinc-100 dark:border-zinc-700",
                isDownvoted
                  ? "bg-red-50 text-red-500 border border-red-100"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-100 dark:border-zinc-700"
              )}
            >
              <ArrowDown className="w-4 h-4" />
              {isDownvoted && (
                <span className="text-[0.7rem] font-medium text-red-500">{downvotes}</span>
              )}  
              {!isDownvoted && (
                <span className="text-[0.7rem] font-medium text-zinc-500 dark:text-zinc-400">{downvotes}</span>
              )}
            </button>
          </div>
          
          {/* Comments */}
          <button
            type="button"
            onClick={onComment}
            className={cn(
              "flex items-center gap-1 px-2 py-1 text-sm rounded-full transition-colors",
              isCommentsOpen
                ? "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-[0.7rem] font-medium">{engagement?.comments || 0}</span>
          </button>
        </div>
          
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onShare}
              className="p-2 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleBookmark}
              className={cn(
                "p-2 rounded-full transition-colors",
                isBookmarked 
                  ? "text-blue-500 bg-blue-50 dark:bg-blue-500/10" 
                  : "text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
            </button>
          </div>
        </div>
      );

    case "reactions":
      return (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Reactions */}
            <div className="flex items-center gap-1">
              {["🙏", "👏", "🔥"].map((emoji, index) => {
                const counts = [engagement?.reactions?.heart || 119, engagement?.reactions?.clap || 87, engagement?.reactions?.fire || 87];
                const isSelected = userReaction === emoji;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleReaction(emoji)}
                    className={cn(
                      "flex items-center gap-1 px-2 py-0.5 border border-zinc-100 dark:border-zinc-700 text-sm rounded-full transition-colors",
                      isSelected
                        ? "bg-blue-50 border-blue-100 border dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                    )}
                  >
                    <span className="text-base">{emoji}</span>
                    {isSelected && (
                      <span className="text-[0.7rem] font-medium text-blue-500 dark:text-zinc-400">{counts[index]}K</span>
                    )}
                    {!isSelected && (
                      <span className="text-[0.7rem] font-medium text-zinc-500 dark:text-zinc-400">{counts[index]}K</span>
                    )}
                  </button>
                );
              })}
              
              {/* Add Reaction Button with Popover */}
              <Popover open={isReactionPopoverOpen} onOpenChange={setIsReactionPopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1 px-1.5 py-1.5 text-sm rounded-full transition-colors text-zinc-400 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-zinc-100 dark:border-zinc-700"
                  >
                    <SmilePlus className="w-3.5 h-3.5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto border-zinc-100 dark:border-zinc-700 rounded-full bg-white dark:bg-zinc-900 p-1.5 shadow-lg" align="start" sideOffset={6}>
                  <div className="flex items-center gap-0.5">
                    {availableReactions.slice(0, 8).map(({ emoji, label }) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          handleReaction(emoji);
                          setIsReactionPopoverOpen(false);
                        }}
                        className={cn(
                          "flex items-center justify-center w-7 h-7 text-lg rounded-full transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800",
                          userReaction === emoji && "border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-100"
                        )}
                        title={label}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Comments */}
            <button
              type="button"
              onClick={onComment}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-sm rounded-full transition-colors",
                isCommentsOpen
                  ? "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-[0.7rem] font-medium">{engagement?.comments || 11}K</span>
            </button>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onShare}
              className="p-2 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleBookmark}
              className={cn(
                "p-2 rounded-full transition-colors",
                isBookmarked 
                  ? "text-blue-500 bg-blue-50 dark:bg-blue-500/10" 
                  : "text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
            </button>
          </div>
        </div>
      );

    case "event":
      return (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* RSVP Options */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleRSVP("yes")}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 text-sm rounded-full transition-colors border",
                  userRSVP === "yes"
                    ? "bg-green-50 text-green-600 border-green-200"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                )}
              >
                <Check className="w-4 h-4" />
                <span className="text-[0.8rem] font-medium">Yes</span>
              </button>

              <button
                type="button"
                onClick={() => handleRSVP("no")}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 text-sm rounded-full transition-colors border",
                  userRSVP === "no"
                    ? "bg-red-50 text-red-600 border-red-200"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                )}
              >
                <X className="w-4 h-4" />
                <span className="text-[0.8rem] font-medium">No</span>
              </button>

              <button
                type="button"
                onClick={() => handleRSVP("maybe")}
                className={cn(
                  "flex items-center gap-1.5 px-2 py-1 text-sm rounded-full transition-colors border",
                  userRSVP === "maybe"
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                )}
              >
                <HelpCircle className="w-4 h-4" />  
                <span className="text-[0.8rem] font-medium">Maybe</span>
              </button>
            </div>
            
            {/* Comments */}
            <button
              type="button"
              onClick={onComment}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-sm rounded-full transition-colors",
                isCommentsOpen
                  ? "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-[0.7rem] font-medium">{engagement?.comments || 0}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onShare}
              className="p-2 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleBookmark}
              className={cn(
                "p-2 rounded-full transition-colors",
                isBookmarked 
                  ? "text-blue-500 bg-blue-50 dark:bg-blue-500/10" 
                  : "text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
            </button>
          </div>
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Like */}
            <button
              type="button"
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-sm rounded-full transition-all",
                isLiked
                  ? "bg-red-50 text-red-500 border border-red-100"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              {isLiked ? (
                <>
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                  <span className="text-[0.7rem] font-medium text-red-500">{likes}</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 text-zinc-500" />
                  <span className="text-[0.7rem] font-medium text-zinc-500">{likes}</span>
                </>
              )}
            </button>
            
            {/* Comments */}
            <button
              type="button"
              onClick={onComment}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-sm rounded-full transition-colors",
                isCommentsOpen
                  ? "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-[0.7rem] font-medium">{engagement?.comments || 11}K</span>
            </button>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onShare}
              className="p-2 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleBookmark}
              className={cn(
                "p-2 rounded-full transition-colors",
                isBookmarked 
                  ? "text-blue-500 bg-blue-50 dark:bg-blue-500/10" 
                  : "text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              )}
            >
              <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
            </button>
          </div>
        </div>
      );
  }
} 