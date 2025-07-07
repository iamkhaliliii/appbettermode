"use client";

import { cn } from "@/lib/utils";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Link as LinkIcon,
  ChevronUp,
  ChevronDown,
  Plus,
  ArrowUp,
  ArrowDown,
  SmilePlus,
  Check,
  Circle,
  HelpCircle,
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Video,
} from "lucide-react";
import { Badge, Popover, PopoverContent, PopoverTrigger } from "@/components/ui/primitives";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/primitives/avatar";
import { Button } from "@/components/ui/primitives/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/primitives/tooltip";
import { AvatarGroup } from "@/components/ui/avatar";
import { Expandable, ExpandableContent, ExpandableTrigger } from "@/components/ui/expandable";
import { useState } from "react";

interface SocialCardProps {
  author?: {
    name?: string;
    username?: string;
    avatar?: string;
    timeAgo?: string;
    postCategory?: string;
    badge?: {
      text: string;
      emoji?: string;
    };
    emoji?: string;
  };
  content?: {
    text?: string;
    link?: {
      title?: string;
      description?: string;
      icon?: React.ReactNode;
    };
    images?: {
      src: string;
      alt: string;
      aspectRatio?: "square" | "landscape" | "portrait";
    }[];
    poll?: {
      question: string;
      options: Array<{
        id: string;
        text: string;
        votes: number;
      }>;
      totalVotes: number;
      hasVoted: boolean;
      userVote?: string;
      timeLeft?: string;
    };
    event?: {
      title: string;
      date: string;
      time: string;
      location: string;
      attendees: number;
      category: string;
      status: "upcoming" | "ongoing" | "completed";
      host?: {
        name: string;
        avatar: string;
      };
      image?: string;
    };
  };
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
    upvotes?: number;
    downvotes?: number;
    isUpvoted?: boolean;
    isDownvoted?: boolean;
    reactions?: {
      heart?: number;
      clap?: number;
      fire?: number;
      [key: string]: number | undefined;
    };
    userReaction?: string;
    rsvp?: {
      yes?: number;
      no?: number;
      maybe?: number;
    };
    userRSVP?: "yes" | "no" | "maybe" | null;
  };
  engagementStyle?: "default" | "reactions" | "upvote" | "event";
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
  onBookmark?: () => void;
  onMore?: () => void;
  onUpvote?: () => void;
  onDownvote?: () => void;
  onReaction?: (reaction: string) => void;
  onRSVP?: (response: "yes" | "no" | "maybe") => void;
  onPollVote?: (optionId: string) => void;
  className?: string;
}

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
  const [pollVotes, setPollVotes] = useState(content?.poll?.options || []);
  const [userPollVote, setUserPollVote] = useState(content?.poll?.userVote || "");
  const [hasVoted, setHasVoted] = useState(content?.poll?.hasVoted || false);

  // Available reaction emojis
  const availableReactions = [
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

  const handlePollVote = (optionId: string) => {
    if (hasVoted) return;
    
    setUserPollVote(optionId);
    setHasVoted(true);
    setPollVotes(prev => 
      prev.map(option => 
        option.id === optionId 
          ? { ...option, votes: option.votes + 1 }
          : option
      )
    );
    onPollVote?.(optionId);
  };

  const renderEngagementSection = () => {
    switch (engagementStyle) {
      case "upvote":
        return (
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
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
                className="flex items-center gap-1 px-2 py-1 text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-[0.7rem] font-medium text-zinc-500 dark:text-zinc-400">{engagement?.comments || 0}</span>
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
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
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
                className="flex items-center gap-1 px-2 py-1 text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-[0.7rem] font-medium text-zinc-600 dark:text-zinc-400">{engagement?.comments || 11}K</span>
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
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
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
                  <Check     className="w-4 h-4" />
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
                className="flex items-center gap-1 px-2 py-1 text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-[0.7rem] font-medium text-zinc-500 dark:text-zinc-400">{engagement?.comments || 0}</span>
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
          <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
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
                className="flex items-center gap-1 px-2 py-1 text-sm text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-[0.7rem] font-medium text-zinc-500 dark:text-zinc-400">{engagement?.comments || 11}K</span>
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
  };

  return (
    <div
      className={cn(
        "w-full max-w-2xl mx-auto",
        "bg-white dark:bg-zinc-900",
        "border border-zinc-200 dark:border-zinc-800",
        "rounded-xl shadow-sm",
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
              onClick={onMore}
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

          {/* Poll section */}
          {content?.poll && (
            <div className="mb-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden bg-zinc-50 dark:bg-zinc-800/30">
              <div className="p-4">
                <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                  {content.poll.question}
                </h4>
                <div className="space-y-2">
                  {pollVotes.map((option) => {
                    const totalVotes = pollVotes.reduce((sum, opt) => sum + opt.votes, 0);
                    const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                    const isUserVote = userPollVote === option.id;
                    
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handlePollVote(option.id)}
                        disabled={hasVoted}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border transition-all relative overflow-hidden",
                          hasVoted
                            ? isUserVote
                              ? "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-700"
                              : "border-zinc-200 bg-white dark:bg-zinc-800 dark:border-zinc-700"
                            : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                        )}
                      >
                        {hasVoted && (
                          <div 
                            className="absolute inset-y-0 left-0 bg-zinc-100 dark:bg-zinc-700/30 transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                          />
                        )}
                        <div className="relative flex items-center justify-between">
                          <span className={cn(
                            "text-sm font-medium",
                            isUserVote && hasVoted 
                              ? "text-blue-700 dark:text-blue-300" 
                              : "text-zinc-700 dark:text-zinc-300"
                          )}>
                            {option.text}
                          </span>
                          {hasVoted && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                {percentage}%
                              </span>
                              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                {option.votes} votes
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {hasVoted && (
                  <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {pollVotes.reduce((sum, opt) => sum + opt.votes, 0)} total votes
                      {content.poll.timeLeft && ` • ${content.poll.timeLeft} left`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Event section - Expandable */}
          {content?.event && (
            <div className="mb-4">
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
                                {content.event?.status === 'ongoing' ? 'Live Event' : 'Upcoming Event'}
                              </Badge>
                              
                              {/* Time */}
                              <span className="text-[0.7rem] font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {content.event?.date} • {content.event?.time}
                              </span>
                            </div>
                            
                            {/* Title */}
                            <h4 className="font-semibold text-[1rem] mb-3 mt-2 text-zinc-900 dark:text-zinc-100">
                              {content.event?.title}
                            </h4>
                            
                            {/* Basic Info - Always Visible */}
                            <div className="flex items-center gap-4 text-[0.8rem] text-zinc-600 dark:text-zinc-400">
                              {/* Attendees */}
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span className="text-xs font-medium">
                                  {content.event?.attendees} attendees
                                </span>
                              </div>
                              
                              {/* Location */}
                              {content.event?.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="text-xs truncate max-w-[120px]">{content.event?.location}</span>
                                </div>
                              )}
                            </div>

                            {/* Expanded Content */}
                            <ExpandableContent preset="slide-up" stagger staggerChildren={0.1}>
                              <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                                {/* Event Description */}
                                <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4">
                                  Join us for our monthly music meetup where we'll explore the intersection of analog and digital music production. Perfect for producers, musicians, and music enthusiasts of all levels.
                                </p>
                                
                                {/* Host Info */}
                                {content.event?.host && (
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
                                                src={content.event?.host?.avatar}
                                                alt={content.event?.host?.name}
                                              />
                                              <AvatarFallback>{content.event?.host?.name?.[0]}</AvatarFallback>
                                            </Avatar>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>{content.event?.host?.name}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                        {content.event?.host?.name}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                
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
                                    <span>Category: {content.event?.category}</span>
                                    <span>Status: {content.event?.status}</span>
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
          )}

          {/* Image Grid - Bento Layout */}
          {content?.images && content.images.length > 0 && (
            <div className="mb-4 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              {content.images.length === 1 && (
                <img 
                  src={content.images[0].src} 
                  alt={content.images[0].alt}
                  className="w-full h-80 object-cover"
                />
              )}
              
              {content.images.length === 2 && (
                <div className="grid grid-cols-2 h-64">
                  {content.images.map((img, index) => (
                    <img 
                      key={index}
                      src={img.src} 
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                  ))}
                </div>
              )}
              
              {content.images.length === 3 && (
                <div className="grid grid-cols-3 h-64 gap-px bg-zinc-200 dark:bg-zinc-700">
                  <img 
                    src={content.images[0].src} 
                    alt={content.images[0].alt}
                    className="w-full h-full object-cover col-span-2"
                  />
                  <div className="grid grid-rows-2 gap-px">
                    <img 
                      src={content.images[1].src} 
                      alt={content.images[1].alt}
                      className="w-full h-full object-cover"
                    />
                    <img 
                      src={content.images[2].src} 
                      alt={content.images[2].alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              {content.images.length === 4 && (
                <div className="grid grid-cols-2 grid-rows-2 h-80 gap-px bg-zinc-200 dark:bg-zinc-700">
                  {content.images.map((img, index) => (
                    <img 
                      key={index}
                      src={img.src} 
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                  ))}
                </div>
              )}
              
              {content.images.length >= 5 && (
                <div className="grid grid-cols-4 grid-rows-2 h-80 gap-px bg-zinc-200 dark:bg-zinc-700">
                  <img 
                    src={content.images[0].src} 
                    alt={content.images[0].alt}
                    className="w-full h-full object-cover col-span-2 row-span-2"
                  />
                  <img 
                    src={content.images[1].src} 
                    alt={content.images[1].alt}
                    className="w-full h-full object-cover"
                  />
                  <img 
                    src={content.images[2].src} 
                    alt={content.images[2].alt}
                    className="w-full h-full object-cover"
                  />
                  <img 
                    src={content.images[3].src} 
                    alt={content.images[3].alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="relative">
                    <img 
                      src={content.images[4].src} 
                      alt={content.images[4].alt}
                      className="w-full h-full object-cover"
                    />
                    {content.images.length > 5 && (
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">+{content.images.length - 5}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Link preview */}
          {content?.link && (
            <div className="mb-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white dark:bg-zinc-700 rounded-xl">
                    {content.link.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {content.link.title}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {content.link.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Engagement section */}
          {renderEngagementSection()}
        </div>
      </div>
    </div>
  );
} 