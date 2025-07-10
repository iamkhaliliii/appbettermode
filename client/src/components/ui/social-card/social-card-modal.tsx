"use client";

import React from "react";
import { Badge } from "@/components/ui/primitives";
import { Button } from "@/components/ui/primitives/button";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
  Users,
  Vote,
  FileText,
  Clock,
  User,
  TrendingUp,
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
  const [isAnalyticsOpen, setIsAnalyticsOpen] = React.useState(false);
  const [activeAnalyticsTab, setActiveAnalyticsTab] = React.useState('general');
  
  // Get available analytics tabs based on content type
  const getAnalyticsTabs = () => {
    const tabs = [
      { id: 'general', label: 'General', icon: <TrendingUp className="w-4 h-4" /> }
    ];

    if (content?.event) {
      tabs.push({ id: 'rsvp', label: 'RSVP', icon: <Users className="w-4 h-4" /> });
    }
    if (content?.poll) {
      tabs.push({ id: 'votes', label: 'Votes', icon: <Vote className="w-4 h-4" /> });
    }
    if (content?.form) {
      tabs.push({ id: 'submissions', label: 'Submissions', icon: <FileText className="w-4 h-4" /> });
    }

    return tabs;
  };

  const analyticsTabs = getAnalyticsTabs();
  
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
          <button 
            onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
            className="gap-1 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            title="Analytics"
          >
            <FileChartColumn className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          </button>
                    {/* Comments Toggle - Only show when comments are closed */}
                    {!isCommentsOpen && (
            <button 
              onClick={() => setIsCommentsOpen(true)}
              className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
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

        {/* Analytics Sheet - Overlay from right */}
        <AnimatePresence>
          {isAnalyticsOpen && (
            <motion.div 
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.3
              }}
              className="absolute inset-y-0 right-0 w-96 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-xl z-20"
            >
              <div className="flex flex-col h-full">
                {/* Analytics Header */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Analytics</h3>
                    <Badge 
                      variant="secondary" 
                      className="text-xs px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-normal border-0 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1"
                    >
                      <Shield className="w-3 h-3" />
                      Admin Only
                    </Badge>
                  </div>
                  <button 
                    onClick={() => setIsAnalyticsOpen(false)}
                    className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  </button>
                </div>

              {/* Analytics Tabs */}
              <div className="flex border-b border-zinc-100 dark:border-zinc-800">
                {analyticsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveAnalyticsTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-normal transition-colors ${
                      activeAnalyticsTab === tab.id
                        ? 'border-b border-zinc-400 dark:border-zinc-500 text-zinc-700 dark:text-zinc-200 bg-zinc-50 dark:bg-zinc-800/50'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/30'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Analytics Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {activeAnalyticsTab === 'general' && (
                  <div className="space-y-6">
                    {/* Overview Stats */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Overview</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="group">
                          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                            {engagementStyle === 'reactions' 
                              ? `${Math.round(((engagement?.reactions?.smile || 0) + (engagement?.reactions?.heart || 0) + (engagement?.reactions?.thumbsUp || 0) + (engagement?.reactions?.thumbsDown || 0)) * 15 / 10) / 10}K`
                              : `${Math.round(((engagement?.upvotes || 0) + (engagement?.downvotes || 0)) * 12 / 10) / 10}K`
                            }
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">Total Views</div>
                        </div>
                        <div className="group">
                          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                            {engagementStyle === 'reactions' 
                              ? ((engagement?.reactions?.smile || 0) + (engagement?.reactions?.heart || 0) + (engagement?.reactions?.thumbsUp || 0) + (engagement?.reactions?.thumbsDown || 0) + (engagement?.comments || 0) + (engagement?.shares || 0))
                              : ((engagement?.upvotes || 0) + (engagement?.downvotes || 0) + (engagement?.comments || 0) + (engagement?.shares || 0))
                            }
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">Interactions</div>
                        </div>
                      </div>
                    </div>

                    {/* Engagement Breakdown */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Engagement</h4>
                      </div>
                      <div className="space-y-2">
                        {engagementStyle === 'reactions' ? (
                          <>
                            <div className="flex items-center justify-between py-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">😊</span>
                                <span className="text-sm text-zinc-700 dark:text-zinc-300">Smile</span>
                              </div>
                              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{engagement?.reactions?.smile || 0}</span>
                            </div>
                            <div className="flex items-center justify-between py-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">❤️</span>
                                <span className="text-sm text-zinc-700 dark:text-zinc-300">Heart</span>
                              </div>
                              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{engagement?.reactions?.heart || 0}</span>
                            </div>
                            <div className="flex items-center justify-between py-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">👍</span>
                                <span className="text-sm text-zinc-700 dark:text-zinc-300">Like</span>
                              </div>
                              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{engagement?.reactions?.thumbsUp || 0}</span>
                            </div>
                            <div className="flex items-center justify-between py-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">👎</span>
                                <span className="text-sm text-zinc-700 dark:text-zinc-300">Dislike</span>
                              </div>
                              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{engagement?.reactions?.thumbsDown || 0}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-between py-1">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-zinc-700 dark:text-zinc-300">Upvotes</span>
                              </div>
                              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{engagement?.upvotes || 0}</span>
                            </div>
                            <div className="flex items-center justify-between py-1">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-sm text-zinc-700 dark:text-zinc-300">Downvotes</span>
                              </div>
                              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{engagement?.downvotes || 0}</span>
                            </div>
                          </>
                        )}
                        <div className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">Comments</span>
                          </div>
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{engagement?.comments || 0}</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">Shares</span>
                          </div>
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{engagement?.shares || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* View Sources */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 bg-orange-500 rounded-full"></div>
                        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">View Sources</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-1">
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">Main Feed</span>
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {engagementStyle === 'reactions' 
                              ? `${Math.round(((engagement?.reactions?.smile || 0) + (engagement?.reactions?.heart || 0) + (engagement?.reactions?.thumbsUp || 0)) * 8.5 / 10) / 10}K`
                              : `${Math.round((engagement?.upvotes || 0) * 7.2 / 10) / 10}K`
                            }
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">Safe Feed</span>
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {engagementStyle === 'reactions' 
                              ? `${Math.round(((engagement?.reactions?.smile || 0) + (engagement?.reactions?.heart || 0)) * 6.3 / 10) / 10}K`
                              : `${Math.round((engagement?.upvotes || 0) * 5.8 / 10) / 10}K`
                            }
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">Modal Opens</span>
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {Math.round((engagement?.comments || 0) * 10.2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">Direct Link</span>
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {Math.round((engagement?.shares || 0) * 2.6)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Top Engagers */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 bg-pink-500 rounded-full"></div>
                        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Top Engagers</h4>
                      </div>
                      <div className="space-y-3">
                        {engagementStyle === 'reactions' ? (
                          <>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-1">
                                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=20&h=20&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full border-2 border-white" />
                                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=20&h=20&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full border-2 border-white" />
                                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=20&h=20&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full border-2 border-white" />
                                </div>
                                <span className="text-sm text-zinc-700 dark:text-zinc-300">❤️ Loved</span>
                              </div>
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">+{Math.max(0, (engagement?.reactions?.heart || 0) - 3)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-1">
                                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=20&h=20&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full border-2 border-white" />
                                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=20&h=20&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full border-2 border-white" />
                                </div>
                                <span className="text-sm text-zinc-700 dark:text-zinc-300">😊 Smiled</span>
                              </div>
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">+{Math.max(0, (engagement?.reactions?.smile || 0) - 2)}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-1">
                                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=20&h=20&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full border-2 border-white" />
                                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=20&h=20&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full border-2 border-white" />
                                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=20&h=20&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full border-2 border-white" />
                                </div>
                                <span className="text-sm text-zinc-700 dark:text-zinc-300">Upvoted</span>
                              </div>
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">+{Math.max(0, (engagement?.upvotes || 0) - 3)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-1">
                                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=20&h=20&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full border-2 border-white" />
                                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=20&h=20&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full border-2 border-white" />
                                </div>
                                <span className="text-sm text-zinc-700 dark:text-zinc-300">Downvoted</span>
                              </div>
                              <span className="text-xs text-zinc-500 dark:text-zinc-400">+{Math.max(0, (engagement?.downvotes || 0) - 2)}</span>
                            </div>
                          </>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-1">
                              <img src="https://images.unsplash.com/photo-1494790108755-2616b612b550?w=20&h=20&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full border-2 border-white" />
                              <img src="https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?w=20&h=20&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full border-2 border-white" />
                            </div>
                            <span className="text-sm text-zinc-700 dark:text-zinc-300">Commented</span>
                          </div>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">+{Math.max(0, (engagement?.comments || 0) - 2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Insights */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 bg-cyan-500 rounded-full"></div>
                        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Content Insights</h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center py-1">
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">Post Type</span>
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            {content?.event ? 'Event' : content?.poll ? 'Poll' : content?.form ? 'Form' : content?.video ? 'Video' : 'Discussion'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">Published</span>
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{author?.timeAgo}</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-sm text-zinc-700 dark:text-zinc-300">Reply Rate</span>
                          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">34%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeAnalyticsTab === 'rsvp' && content?.event && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                          {engagement?.rsvp?.yes || 0}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">Going</div>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                          {engagement?.rsvp?.no || 0}
                        </div>
                        <div className="text-xs text-red-600 dark:text-red-400">Not Going</div>
                      </div>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 text-center">
                        <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                          {engagement?.rsvp?.maybe || 0}
                        </div>
                        <div className="text-xs text-yellow-600 dark:text-yellow-400">Maybe</div>
                      </div>
                    </div>
                    
                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Recent RSVPs</div>
                      <div className="space-y-2">
                        {/* Sample RSVP users */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full" />
                            <span className="text-sm text-zinc-900 dark:text-zinc-100">Sarah Johnson</span>
                          </div>
                          <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">Going</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full" />
                            <span className="text-sm text-zinc-900 dark:text-zinc-100">Mike Chen</span>
                          </div>
                          <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">Maybe</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeAnalyticsTab === 'votes' && content?.poll && (
                  <div className="space-y-4">
                                         <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                       <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Total Votes</div>
                       <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                         {content.poll?.totalVotes || 0}
                       </div>
                     </div>

                                         <div className="space-y-3">
                       {content.poll?.options?.map((option) => (
                         <div key={option.id} className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                           <div className="flex justify-between items-center mb-2">
                             <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{option.text}</span>
                             <span className="text-sm text-zinc-500 dark:text-zinc-400">{option.votes} votes</span>
                           </div>
                           <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                             <div 
                               className="bg-blue-500 h-2 rounded-full" 
                               style={{ width: `${(option.votes / (content.poll?.totalVotes || 1)) * 100}%` }}
                             ></div>
                           </div>
                         </div>
                       ))}
                     </div>
                  </div>
                )}

                {activeAnalyticsTab === 'submissions' && content?.form && (
                  <div className="space-y-4">
                                         <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                       <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Total Submissions</div>
                       <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                         {content.form?.responses || 0}
                       </div>
                     </div>

                    <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Recent Submissions</div>
                      <div className="space-y-2">
                        {/* Sample submissions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full" />
                            <span className="text-sm text-zinc-900 dark:text-zinc-100">Emma Wilson</span>
                          </div>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">2h ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=24&h=24&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full" />
                            <span className="text-sm text-zinc-900 dark:text-zinc-100">David Kim</span>
                          </div>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">5h ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
} 