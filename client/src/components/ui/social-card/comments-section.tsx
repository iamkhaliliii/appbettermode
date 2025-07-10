"use client";

import React, { useState } from "react";
import { CommentsSectionProps, Comment } from "./types";
import { Pin, Heart, Eye, EyeOff, ArrowLeftFromLine, SmilePlus, Smile, ThumbsUp, ThumbsDown, HeartCrack } from "lucide-react";

export function CommentsSection({ 
  postId, 
  comments = [], 
  onAddComment,
  onToggle,
  isCollapsed = false,
  onReaction
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [showReactionPopover, setShowReactionPopover] = useState<string | null>(null);
  const [commentsState, setCommentsState] = useState<Comment[]>([]);

  // Close popover when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showReactionPopover) {
        setShowReactionPopover(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReactionPopover]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment?.(newComment.trim());
      setNewComment("");
    }
  };

  const reactionTypes = ['smile', 'heart', 'thumbsUp', 'thumbsDown', 'heartCrack'];

  const handleReaction = (commentId: string, reactionType: string) => {
    console.log(`Reaction ${reactionType} for comment ${commentId}`);
    setShowReactionPopover(null);
    
    setCommentsState(prevComments => 
      prevComments.map(comment => {
        if (comment.id === commentId) {
          const updatedReactions = { ...comment.reactions };
          
          if (updatedReactions[reactionType]) {
            // Reaction exists - toggle it
            if (updatedReactions[reactionType].hasUserReacted) {
              // Remove user reaction
              updatedReactions[reactionType] = {
                count: Math.max(0, updatedReactions[reactionType].count - 1),
                hasUserReacted: false
              };
              // Remove reaction if count is 0
              if (updatedReactions[reactionType].count === 0) {
                delete updatedReactions[reactionType];
              }
            } else {
              // Add user reaction
              updatedReactions[reactionType] = {
                count: updatedReactions[reactionType].count + 1,
                hasUserReacted: true
              };
            }
          } else {
            // New reaction
            updatedReactions[reactionType] = {
              count: 1,
              hasUserReacted: true
            };
          }
          
          return { ...comment, reactions: updatedReactions };
        }
        
        // Handle replies recursively
        if (comment.replies) {
          const updatedReplies = comment.replies.map(reply => {
            if (reply.id === commentId) {
              const updatedReactions = { ...reply.reactions };
              
              if (updatedReactions[reactionType]) {
                if (updatedReactions[reactionType].hasUserReacted) {
                  updatedReactions[reactionType] = {
                    count: Math.max(0, updatedReactions[reactionType].count - 1),
                    hasUserReacted: false
                  };
                  if (updatedReactions[reactionType].count === 0) {
                    delete updatedReactions[reactionType];
                  }
                } else {
                  updatedReactions[reactionType] = {
                    count: updatedReactions[reactionType].count + 1,
                    hasUserReacted: true
                  };
                }
              } else {
                updatedReactions[reactionType] = {
                  count: 1,
                  hasUserReacted: true
                };
              }
              
              return { ...reply, reactions: updatedReactions };
            }
            return reply;
          });
          
          return { ...comment, replies: updatedReplies };
        }
        
        return comment;
      })
    );
    
    onReaction?.(commentId, reactionType);
  };

  const getReactionIcon = (reactionType: string, size: 'small' | 'large' = 'small') => {
    const iconSize = size === 'small' ? 'w-3 h-3' : 'w-4 h-4';
    
    switch (reactionType) {
      case 'smile':
        return <Smile className={iconSize} />;
      case 'heart':
        return <Heart className={iconSize} />;
      case 'thumbsUp':
        return <ThumbsUp className={iconSize} />;
      case 'thumbsDown':
        return <ThumbsDown className={iconSize} />;
      case 'heartCrack':
        return <HeartCrack className={iconSize} />;
      default:
        return null;
    }
  };

  // Sample comments data if none provided
  const sampleComments: Comment[] = [
    {
      id: "pinned-1",
      author: {
        name: "Community Team",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face"
      },
      content: "Welcome to the discussion! Please keep conversations respectful and on-topic. Feel free to ask questions or share your own experiences. For urgent issues, please contact our support team directly.",
      timeAgo: "Pinned",
      likes: 24,
      isLiked: false,
      reactions: {
        thumbsUp: { count: 12, hasUserReacted: false },
        heart: { count: 8, hasUserReacted: false },
        smile: { count: 4, hasUserReacted: false }
      },
      isPinned: true
    },
    {
      id: "1",
      author: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b7cf?w=24&h=24&fit=crop&crop=face"
      },
      content: "This is absolutely brilliant! I've been struggling with this exact problem for weeks, and your approach is so elegant and practical. The way you broke down the complex concepts into digestible pieces really helped me understand the underlying principles. Thank you for taking the time to share this with the community! 🙌",
      timeAgo: "2h",
      likes: 12,
      isLiked: false,
      reactions: {
        heart: { count: 5, hasUserReacted: true },
        thumbsUp: { count: 4, hasUserReacted: false },
        smile: { count: 3, hasUserReacted: false }
      },
      replies: [
        {
          id: "1-1",
          author: {
            name: "Alex Rodriguez",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face"
          },
          content: "Completely agree! This saved me hours of research. Really appreciate the detailed examples.",
          timeAgo: "1h",
          likes: 4,
          isLiked: false,
          reactions: {
            thumbsUp: { count: 4, hasUserReacted: false }
          }
        }
      ]
    },
    {
      id: "2",
      author: {
        name: "Mike Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face"
      },
      content: "Thanks for sharing this comprehensive guide! I particularly loved the section about optimization techniques. Do you have any recommendations for handling edge cases when scaling this solution?",
      timeAgo: "4h",
      likes: 8,
      isLiked: true,
      reactions: {
        thumbsUp: { count: 6, hasUserReacted: true },
        heart: { count: 2, hasUserReacted: false }
      },
      replies: [
        {
          id: "2-1",
          author: {
            name: "Emma Wilson",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop&crop=face"
          },
          content: "Great question! I'd also love to know more about performance considerations.",
          timeAgo: "3h",
          likes: 2,
          isLiked: false,
          reactions: {
            smile: { count: 2, hasUserReacted: false }
          }
        },
        {
          id: "2-2",
          author: {
            name: "Community Team",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face"
          },
          content: "We're planning a follow-up post on scaling patterns! Stay tuned 📚",
          timeAgo: "2h",
          likes: 6,
          isLiked: false,
          reactions: {
            heart: { count: 4, hasUserReacted: false },
            thumbsUp: { count: 2, hasUserReacted: false }
          }
        }
      ]
    },
    {
      id: "3",
      author: {
        name: "Emma Wilson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop&crop=face"
      },
      content: "This is exactly what I needed! I've been working on a similar project and was stuck on the implementation details. Your explanation of the core concepts and the step-by-step breakdown made everything click for me. 👍",
      timeAgo: "6h",
      likes: 5,
      isLiked: false,
      reactions: {
        smile: { count: 3, hasUserReacted: true },
        thumbsUp: { count: 2, hasUserReacted: false }
      }
    },
    {
      id: "4",
      author: {
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=24&h=24&fit=crop&crop=face"
      },
      content: "Awesome work! Can't wait to try this out in my next project. The code examples are really clean and well-documented.",
      timeAgo: "8h",
      likes: 3,
      isLiked: false,
      reactions: {
        heart: { count: 3, hasUserReacted: false }
      }
    },
    {
      id: "5",
      author: {
        name: "Lisa Rodriguez",
        avatar: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=24&h=24&fit=crop&crop=face"
      },
      content: "I've been following your content for a while now, and this is definitely one of your best posts! The practical examples and real-world applications make it so much easier to understand and implement. Keep up the fantastic work! 🔥",
      timeAgo: "10h",
      likes: 9,
      isLiked: false,
      reactions: {
        biceps: { count: 6, hasUserReacted: true },
        heart: { count: 3, hasUserReacted: false }
      }
    },
    {
      id: "6",
      author: {
        name: "James Park",
        avatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=24&h=24&fit=crop&crop=face"
      },
      content: "Quick question - have you tested this approach with larger datasets? I'm curious about performance implications.",
      timeAgo: "12h",
      likes: 2,
      isLiked: false,
      reactions: {
        thumbsUp: { count: 2, hasUserReacted: false }
      },
      replies: [
        {
          id: "6-1",
          author: {
            name: "Community Team",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face"
          },
          content: "Good point! We tested with datasets up to 10M records and saw great performance. Will share benchmarks soon!",
          timeAgo: "11h",
          likes: 5,
          isLiked: false,
          reactions: {
            heart: { count: 3, hasUserReacted: false },
            thumbsUp: { count: 2, hasUserReacted: false }
          }
        }
      ]
    },
    {
      id: "7",
      author: {
        name: "Maria Garcia",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=24&h=24&fit=crop&crop=face"
      },
      content: "This tutorial came at the perfect time! I was just starting to research this topic for my thesis, and your explanations have given me a solid foundation to build upon. The resources you linked are also incredibly valuable. Thank you! 📖",
      timeAgo: "14h",
      likes: 7,
      isLiked: false
          }
    ];

  // Initialize commentsState with sample data or provided comments
  React.useEffect(() => {
    const initialComments = comments.length > 0 ? comments : sampleComments;
    setCommentsState(initialComments);
  }, [comments]);

  const displayComments = commentsState;
  
  // Sort comments to show pinned first
  const sortedComments = [...displayComments].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });
  
  // Count total comments including replies
  const totalComments = sortedComments.reduce((count, comment) => {
    return count + 1 + (comment.replies?.length || 0);
  }, 0);

  // Render individual comment (recursive for replies)
  const renderComment = (comment: Comment, isReply = false): React.ReactElement => (
    <div key={comment.id} className={`${isReply ? 'ml-5 mt-3' : ''} ${comment.isPinned ? 'bg-blue-50/70 dark:bg-blue-900/10 p-4 -mx-3' : ''}`}>
      <div className="flex gap-3">
        <img
          src={comment.author.avatar}
          alt={comment.author.name}
          className={`${isReply ? 'w-5 h-5' : 'w-6 h-6'} rounded-full flex-shrink-0`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1.5">
            <span className={`${isReply ? 'text-xs' : 'text-xs'} font-medium text-zinc-700 dark:text-zinc-300 truncate`}>
              {comment.author.name}
            </span>
            {comment.isPinned && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs text-blue-600 dark:text-blue-400">
                <Pin className="w-2.5 h-2.5" />
                Pinned
              </span>
            )}
            {!comment.isPinned && (
              <span className="text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0">
                {comment.timeAgo}
              </span>
            )}
            {comment.isLiked && (
              <Heart className="w-3 h-3 text-red-500 fill-current" />
            )}
          </div>
          <p className={`${isReply ? 'text-xs' : 'text-xs'} text-zinc-600 dark:text-zinc-400 leading-relaxed mb-2`}>
            {comment.content}
          </p>
                      <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 relative">
                {/* Show all reactions with counts */}
                {comment.reactions && Object.entries(comment.reactions).map(([reactionType, reactionData]) => (
                  <button 
                    key={reactionType}
                    onClick={() => handleReaction(comment.id, reactionType)}
                    className={`flex items-center gap-0.5 px-1.5 py-0.5 text-xs border rounded-full transition-colors ${
                      reactionData.hasUserReacted 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30' 
                        : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {getReactionIcon(reactionType)}
                    {reactionData.count}
                  </button>
                ))}
                
                {/* Add reaction button (always last, no count) */}
                <button 
                  onClick={() => {
                    setShowReactionPopover(showReactionPopover === comment.id ? null : comment.id);
                  }}
                  className="flex items-center p-1 text-xs border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <SmilePlus className="w-3 h-3" />
                </button>
                
                {/* Reaction Popover */}
                {showReactionPopover === comment.id && (
                  <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-0 shadow-lg z-50">
                    <div className="flex items-center p-1 gap-0.5">
                      {reactionTypes.map((reactionType) => (
                        <button
                          key={reactionType}
                          onClick={() => handleReaction(comment.id, reactionType)}
                          className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                        >
                          {getReactionIcon(reactionType, 'large')}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            {!isReply && !comment.isPinned && (
              <button className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                Reply
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header - Minimal */}
      <div className="px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            title={isCollapsed ? "Show comments" : "Hide comments"}
          >
            {isCollapsed ? (
              <ArrowLeftFromLine className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
            ) : (
              <ArrowLeftFromLine className="w-3 h-3 text-zinc-500 dark:text-zinc-400" />
            )}
          </button>
            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Comments
            </h3>
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              {totalComments}
            </span>
          </div>

        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Comments list - Scrollable */}
          <div className="flex-1 overflow-y-auto scrollbar-light">
            <div className="px-3 py-2 space-y-4">
              {sortedComments.map((comment) => renderComment(comment))}
            </div>
          </div>
          
          {/* Comment input - Minimal */}
          <div className="px-3 py-3 border-t border-zinc-100 dark:border-zinc-800 flex-shrink-0">
            <div className="flex gap-3">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face"
                alt="You"
                className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5"
              />
              <div className="flex-1">
                <textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-700 rounded-md bg-zinc-50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 text-xs placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 focus:bg-white dark:focus:bg-zinc-800 resize-none transition-colors"
                  rows={2}
                />
                {newComment.trim() && (
                  <div className="flex justify-end mt-2.5">
                    <button
                      onClick={handleAddComment}
                      className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      Post
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 