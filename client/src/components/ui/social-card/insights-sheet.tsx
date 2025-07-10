"use client";

import React from "react";
import { Badge } from "@/components/ui/primitives";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X,
  Shield,
  TrendingUp,
  Users,
  MessageCircle,
  Target,
  ArrowRightFromLine,
} from "lucide-react";

interface InsightsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  content?: {
    event?: any;
    poll?: any;
    form?: any;
    video?: any;
    link?: any;
    images?: any[];
    text?: string;
  };
  engagement?: {
    reactions?: {
      smile?: number;
      heart?: number;
      thumbsUp?: number;
      thumbsDown?: number;
    };
    upvotes?: number;
    downvotes?: number;
    comments?: number;
    shares?: number;
    rsvp?: {
      yes?: number;
      no?: number;
      maybe?: number;
    };
  };
  engagementStyle?: 'reactions' | 'upvote' | 'event' | 'default';
  author?: {
    name?: string;
    timeAgo?: string;
  };
}

export function InsightsSheet({
  isOpen,
  onClose,
  content,
  engagement,
  engagementStyle,
  author,
}: InsightsSheetProps) {
  const [activeTab, setActiveTab] = React.useState('overview');

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'reactions', label: 'Reactions', icon: <Users className="w-4 h-4" /> },
    { id: 'comments', label: 'Comments', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'conversion', label: 'Conversion', icon: <Target className="w-4 h-4" /> },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
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
        className="absolute inset-y-0 right-0 w-[80%] bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-xl z-20"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Insights</h3>
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-0 flex items-center gap-1"
              >
                <Shield className="w-3 h-3" />
                Admin
              </Badge>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
            >
              <ArrowRightFromLine className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar Navigation */}
            <div className="w-40 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <div className="p-2 space-y-1">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-2 p-3 rounded-lg text-xs transition-colors ${
                      activeTab === item.id
                        ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                        <div className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                          {engagementStyle === 'reactions' 
                            ? `${Math.round(((engagement?.reactions?.smile || 0) + (engagement?.reactions?.heart || 0) + (engagement?.reactions?.thumbsUp || 0) + (engagement?.reactions?.thumbsDown || 0)) * 15 / 10) / 10}K`
                            : `${Math.round(((engagement?.upvotes || 0) + (engagement?.downvotes || 0)) * 12 / 10) / 10}K`
                          }
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">Total Views</div>
                      </div>
                      <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                        <div className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                          {engagementStyle === 'reactions' 
                            ? ((engagement?.reactions?.smile || 0) + (engagement?.reactions?.heart || 0) + (engagement?.reactions?.thumbsUp || 0) + (engagement?.reactions?.thumbsDown || 0) + (engagement?.comments || 0) + (engagement?.shares || 0))
                            : ((engagement?.upvotes || 0) + (engagement?.downvotes || 0) + (engagement?.comments || 0) + (engagement?.shares || 0))
                          }
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">Interactions</div>
                      </div>
                    </div>

                    {/* Content Info */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">Post Type</span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {content?.event ? 'Event' : content?.poll ? 'Poll' : content?.form ? 'Form' : content?.video ? 'Video' : 'Discussion'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">Published</span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{author?.timeAgo}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">Engagement Rate</span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">12.4%</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reactions' && (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {engagementStyle === 'reactions' ? (
                        <>
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">😊</span>
                              <span className="text-sm text-zinc-600 dark:text-zinc-400">Smile</span>
                            </div>
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{engagement?.reactions?.smile || 0}</span>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">❤️</span>
                              <span className="text-sm text-zinc-600 dark:text-zinc-400">Heart</span>
                            </div>
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{engagement?.reactions?.heart || 0}</span>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">👍</span>
                              <span className="text-sm text-zinc-600 dark:text-zinc-400">Like</span>
                            </div>
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{engagement?.reactions?.thumbsUp || 0}</span>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">👎</span>
                              <span className="text-sm text-zinc-600 dark:text-zinc-400">Dislike</span>
                            </div>
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{engagement?.reactions?.thumbsDown || 0}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">Upvotes</span>
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{engagement?.upvotes || 0}</span>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">Downvotes</span>
                            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{engagement?.downvotes || 0}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Top Reactors */}
                    <div className="mt-6">
                      <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">Top Reactors</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2">
                            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=20&h=20&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full" />
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">Sarah Johnson</span>
                          </div>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">❤️ 3x</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=20&h=20&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full" />
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">Mike Chen</span>
                          </div>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">😊 2x</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                      <div className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                        {engagement?.comments || 0}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">Total Comments</div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Recent Comments</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2">
                            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=20&h=20&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full" />
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">Emma Wilson</span>
                          </div>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">2h ago</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-2">
                            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=20&h=20&fit=crop&crop=face" alt="User" className="w-5 h-5 rounded-full" />
                            <span className="text-sm text-zinc-600 dark:text-zinc-400">David Kim</span>
                          </div>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">5h ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'conversion' && (
                  <div className="space-y-4">
                    {content?.event && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">Event RSVP</h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded text-center">
                            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              {engagement?.rsvp?.yes || 0}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">Going</div>
                          </div>
                          <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded text-center">
                            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              {engagement?.rsvp?.no || 0}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">Not Going</div>
                          </div>
                          <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded text-center">
                            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                              {engagement?.rsvp?.maybe || 0}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">Maybe</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {content?.poll && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">Poll Votes</h4>
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                          <div className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                            {content.poll?.totalVotes || 0}
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">Total Votes</div>
                        </div>
                      </div>
                    )}

                    {content?.form && (
                      <div>
                        <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">Form Submissions</h4>
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                          <div className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                            {content.form?.responses || 0}
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">Submissions</div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">Click-through Rate</span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">8.2%</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">Conversion Rate</span>
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">3.4%</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 