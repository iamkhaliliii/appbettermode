"use client";

import React from "react";
import { Badge } from "@/components/ui/primitives";
import { 
  X,
  Shield,
  TrendingUp,
  Users,
  MessageCircle,
  Target,
  ArrowRightFromLine,
  FileText,
  Calendar,
  User,
  Globe,
  Sparkles,
  Pin,
  Eye,
  Trash2,
  MoreHorizontal,
  Download,
  Search,
  ChevronDown,
  Mail,
  Phone,
  MapPin,
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
  const [reactionFilter, setReactionFilter] = React.useState('all');
  const [commentFilter, setCommentFilter] = React.useState('all');
  const [actionSubTab, setActionSubTab] = React.useState('event');
  const [pollSubTab, setPollSubTab] = React.useState('all');
  const [expandedItems, setExpandedItems] = React.useState<{[key: string]: boolean}>({});

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Mock user reactions data
  const userReactions = [
    { id: 1, name: 'You', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face', reaction: '😂', canRemove: true },
    { id: 2, name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face', reaction: '❤️', emoji: '🐶' },
    { id: 3, name: 'Mike Chen', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face', reaction: '😂' },
    { id: 4, name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face', reaction: '👍' },
    { id: 5, name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face', reaction: '❤️' },
    { id: 6, name: 'Alex Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b550?w=32&h=32&fit=crop&crop=face', reaction: '👍' },
    { id: 7, name: 'Lisa Wang', avatar: 'https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?w=32&h=32&fit=crop&crop=face', reaction: '😢' },
  ];

  const filteredReactions = reactionFilter === 'all' 
    ? userReactions 
    : userReactions.filter(user => user.reaction === reactionFilter);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'reactions', label: 'Reactions', icon: <Users className="w-4 h-4" /> },
    { id: 'comments', label: 'Comments', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'actions', label: 'Actions', icon: <Target className="w-4 h-4" /> },
  ];

  if (!isOpen) return null;

  return (
    <div className="h-full w-full">
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
              <div className="p-3">
                {activeTab === 'overview' && (
                                      <div className="space-y-3">
                                        {/* tab title */}
                                        <div className="space-y-0.5">
                                            <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Post Details</h3>
                       <p className="text-[0.7rem] text-zinc-400 dark:text-zinc-600">Basic information about this post</p>
                      </div>
                      {/* Post Details Table */}
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <td className="py-1 pr-3 w-24">
                              <div className="flex items-center gap-1">
                                <FileText className="w-3 h-3 text-zinc-400" />
                                <span className="text-xs text-zinc-500 dark:text-zinc-500">Type</span>
                              </div>
                            </td>
                            <td className="py-1">
                              <span className="text-xs px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded font-medium">
                                {content?.event ? 'Event' : content?.poll ? 'Poll' : content?.form ? 'Form' : content?.video ? 'Video' : 'Discussion'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1 pr-3 w-24">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-zinc-400" />
                                <span className="text-xs text-zinc-500 dark:text-zinc-500">Published</span>
                              </div>
                            </td>
                            <td className="py-1">
                              <span className="text-xs text-zinc-700 dark:text-zinc-300">{author?.timeAgo || 'Just now'}</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1 pr-3 w-24">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3 text-zinc-400" />
                                <span className="text-xs text-zinc-500 dark:text-zinc-500">Author</span>
                              </div>
                            </td>
                            <td className="py-1">
                              <span className="text-xs px-1.5 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded font-medium">
                                {author?.name || 'Community Team'}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1 pr-3 w-24">
                              <div className="flex items-center gap-1">
                                <Globe className="w-3 h-3 text-zinc-400" />
                                <span className="text-xs text-zinc-500 dark:text-zinc-500">Visibility</span>
                              </div>
                            </td>
                            <td className="py-1">
                              <span className="text-xs text-zinc-700 dark:text-zinc-300">Public</span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1 pr-3 w-24">
                              <div className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-zinc-400" />
                                <span className="text-xs text-zinc-500 dark:text-zinc-500">Status</span>
                              </div>
                            </td>
                            <td className="py-1">
                              <span className="text-xs px-1.5 py-0.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded font-medium">
                                Published
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-1 pr-3 w-24">
                              <div className="flex items-center gap-1">
                                <Pin className="w-3 h-3 text-zinc-400" />
                                <span className="text-xs text-zinc-500 dark:text-zinc-500">Pinned</span>
                              </div>
                            </td>
                            <td className="py-1">
                              <span className="text-xs text-zinc-700 dark:text-zinc-300">
                                {Math.random() > 0.5 ? 'Yes' : 'No'}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                  </div>
                )}

                {activeTab === 'reactions' && (
                  <div className="space-y-6">
                    {/* tab title */}
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Reactions</h3>
                      <p className="text-[0.7rem] text-zinc-400 dark:text-zinc-600">User reactions and engagement</p>
                    </div>
                    
                    {/* Reactions Overview */}
                    <div className="space-y-2">
                      <h4 className="text-xs text-zinc-400 dark:text-zinc-600">Reactions Overview</h4>
                      <div className="grid grid-cols-3 gap-2">
                      <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded text-center">
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">1602</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-500">Total</div>
                      </div>
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-center">
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">1451</div>
                        <div className="text-xs text-green-600 dark:text-green-400">Positive</div>
                      </div>
                      <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-center">
                        <div className="text-sm font-medium text-red-600 dark:text-red-400">151</div>
                        <div className="text-xs text-red-600 dark:text-red-400">Negative</div>
                      </div>
                    </div>
                    </div>

                    <div className="space-y-2">
                      {/* Reaction Breakdown */}
                      <h4 className="text-xs text-zinc-400 dark:text-zinc-600">Reaction Breakdown</h4>
                      {/* Filter Pills */}
                      <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setReactionFilter('all')}
                        className={`px-2 py-1 rounded-full text-xs transition-colors ${
                          reactionFilter === 'all'
                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        All 1602
                      </button>
                      <button
                        onClick={() => setReactionFilter('😂')}
                        className={`px-2 py-1 rounded-full text-xs transition-colors ${
                          reactionFilter === '😂'
                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        😂 134
                      </button>
                      <button
                        onClick={() => setReactionFilter('❤️')}
                        className={`px-2 py-1 rounded-full text-xs transition-colors ${
                          reactionFilter === '❤️'
                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        ❤️ 22
                      </button>
                      <button
                        onClick={() => setReactionFilter('😢')}
                        className={`px-2 py-1 rounded-full text-xs transition-colors ${
                          reactionFilter === '😢'
                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        😢 5
                      </button>
                      <button
                        onClick={() => setReactionFilter('👍')}
                        className={`px-2 py-1 rounded-full text-xs transition-colors ${
                          reactionFilter === '👍'
                            ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        👍 1429
                      </button>
                    </div>

                    {/* User reactions list */}
                    <div className="space-y-1">
                      {filteredReactions.map((user) => (
                        <div key={user.id} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                          <div className="flex items-center gap-2">
                            <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                            <div>
                              <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                                {user.name} {user.emoji && <span className="text-xs">{user.emoji}</span>}
                              </div>
                              {user.canRemove && (
                                <div className="text-xs text-zinc-400 cursor-pointer hover:text-zinc-500">
                                  Click to remove
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="text-sm">{user.reaction}</span>
                        </div>
                      ))}
                      {filteredReactions.length === 0 && (
                        <div className="text-center py-3 text-xs text-zinc-400">
                          No reactions for this filter
                        </div>
                      )}
                    </div>
                    </div>
                  </div>
                )}

                {activeTab === 'comments' && (
                  <div className="space-y-6">
                    {/* tab title */}
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Comments</h3>
                      <p className="text-[0.7rem] text-zinc-400 dark:text-zinc-600">Comments and moderation status</p>
                    </div>
                    
                    {/* Comments Overview */}
                    <div className="space-y-2">
                      <h4 className="text-xs text-zinc-400 dark:text-zinc-600">Total Comments</h4>
                      <div className="grid grid-cols-4 gap-2">
                        <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded text-center">
                          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{engagement?.comments || 27}</div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-500">Total</div>
                        </div>
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-center">
                          <div className="text-sm font-medium text-blue-600 dark:text-blue-400">23</div>
                          <div className="text-xs text-blue-600 dark:text-blue-400">Published</div>
                        </div>
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-center">
                          <div className="text-sm font-medium text-yellow-600 dark:text-yellow-400">2</div>
                          <div className="text-xs text-yellow-600 dark:text-yellow-400">Pending</div>
                        </div>
                        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-center">
                          <div className="text-sm font-medium text-green-600 dark:text-green-400">2</div>
                          <div className="text-xs text-green-600 dark:text-green-400">Pinned</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {/* Comments Filter */}
                      <h4 className="text-xs text-zinc-400 dark:text-zinc-600">Comments Filter</h4>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => setCommentFilter('all')}
                          className={`px-2 py-1 rounded-full text-xs transition-colors ${
                            commentFilter === 'all'
                              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                          }`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setCommentFilter('top')}
                          className={`px-2 py-1 rounded-full text-xs transition-colors ${
                            commentFilter === 'top'
                              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                          }`}
                        >
                          Top Comments
                        </button>
                        <button
                          onClick={() => setCommentFilter('moderation')}
                          className={`px-2 py-1 rounded-full text-xs transition-colors ${
                            commentFilter === 'moderation'
                              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                          }`}
                        >
                          Moderation Needed
                        </button>
                        <button
                          onClick={() => setCommentFilter('pinned')}
                          className={`px-2 py-1 rounded-full text-xs transition-colors ${
                            commentFilter === 'pinned'
                              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                          }`}
                        >
                          Pinned
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">

                      {/* Comments List */}
                      <div className="space-y-3">
                        {commentFilter === 'all' && (
                          <>
                            {/* Pinned Comment */}
                            <div className="bg-blue-50/70 dark:bg-blue-900/10 p-2 rounded">
                              <div className="flex gap-2">
                                <img
                                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face"
                                  alt="Community Team"
                                  className="w-4 h-4 rounded-full flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                                      Community Team
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-1 py-0.5 text-xs text-blue-600 dark:text-blue-400">
                                      <Pin className="w-2 h-2" />
                                      Pinned
                                    </span>
                                  </div>
                                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-1">
                                    Welcome to the discussion! Please keep conversations respectful and on-topic.
                                  </p>
                                  <div className="flex items-center gap-1">
                                    <button className="flex items-center gap-0.5 px-1 py-0.5 text-xs bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 rounded-full">
                                      👍 12
                                    </button>
                                    <button className="flex items-center gap-0.5 px-1 py-0.5 text-xs bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 rounded-full">
                                      ❤️ 8
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Regular Comments */}
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <img
                                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop&crop=face"
                                  alt="Sarah Johnson"
                                  className="w-4 h-4 rounded-full flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                                      Sarah Johnson
                                    </span>
                                    <span className="text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0">
                                      2h
                                    </span>
                                  </div>
                                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-1">
                                    This is absolutely brilliant! I've been struggling with this exact problem for weeks.
                                  </p>
                                  <div className="flex items-center gap-1">
                                    <button className="flex items-center gap-0.5 px-1 py-0.5 text-xs bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-full">
                                      ❤️ 5
                                    </button>
                                    <button className="flex items-center gap-0.5 px-1 py-0.5 text-xs bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 rounded-full">
                                      👍 4
                                    </button>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <img
                                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face"
                                  alt="Mike Chen"
                                  className="w-4 h-4 rounded-full flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                                      Mike Chen
                                    </span>
                                    <span className="text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0">
                                      4h
                                    </span>
                                  </div>
                                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-1">
                                    Thanks for sharing this comprehensive guide! Do you have any recommendations for edge cases?
                                  </p>
                                  <div className="flex items-center gap-1">
                                    <button className="flex items-center gap-0.5 px-1 py-0.5 text-xs bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-full">
                                      👍 6
                                    </button>
                                    <button className="flex items-center gap-0.5 px-1 py-0.5 text-xs bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 rounded-full">
                                      ❤️ 2
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                        
                        {commentFilter === 'top' && (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <img
                                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop&crop=face"
                                alt="Sarah Johnson"
                                className="w-4 h-4 rounded-full flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 mb-1">
                                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                                    Sarah Johnson
                                  </span>
                                  <span className="text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0">
                                    2h
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-1">
                                  This is absolutely brilliant! I've been struggling with this exact problem for weeks.
                                </p>
                                <div className="flex items-center gap-1">
                                  <button className="flex items-center gap-0.5 px-1 py-0.5 text-xs bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 rounded-full">
                                    ❤️ 12
                                  </button>
                                  <button className="flex items-center gap-0.5 px-1 py-0.5 text-xs bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 rounded-full">
                                    👍 8
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {commentFilter === 'moderation' && (
                          <div className="space-y-2">
                            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                              <div className="flex gap-2">
                                <img
                                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=24&h=24&fit=crop&crop=face"
                                  alt="Pending User"
                                  className="w-4 h-4 rounded-full flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300 truncate">
                                      Anonymous User
                                    </span>
                                    <span className="text-xs px-1 py-0.5 bg-yellow-200 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300 rounded">
                                      Pending Review
                                    </span>
                                  </div>
                                  <p className="text-xs text-yellow-600 dark:text-yellow-400 leading-relaxed">
                                    This comment is awaiting moderation approval...
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {commentFilter === 'pinned' && (
                          <div className="bg-blue-50/70 dark:bg-blue-900/10 p-2 rounded">
                            <div className="flex gap-2">
                              <img
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face"
                                alt="Community Team"
                                className="w-4 h-4 rounded-full flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 mb-1">
                                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 truncate">
                                    Community Team
                                  </span>
                                  <span className="inline-flex items-center gap-1 px-1 py-0.5 text-xs text-blue-600 dark:text-blue-400">
                                    <Pin className="w-2 h-2" />
                                    Pinned
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-1">
                                  Welcome to the discussion! Please keep conversations respectful and on-topic.
                                </p>
                                <div className="flex items-center gap-1">
                                  <button className="flex items-center gap-0.5 px-1 py-0.5 text-xs bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 rounded-full">
                                    👍 12
                                  </button>
                                  <button className="flex items-center gap-0.5 px-1 py-0.5 text-xs bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 rounded-full">
                                    ❤️ 8
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'actions' && (
                  <div className="space-y-6">
                    {/* Content Type Tabs - Above Title */}
                    <div className="border-b border-zinc-200 dark:border-zinc-800">
                      <div className="flex space-x-1">
                        <button
                          onClick={() => {
                            setActionSubTab('event');
                            setPollSubTab('all');
                          }}
                          className={`px-3 py-2 text-xs font-medium transition-colors ${
                            actionSubTab === 'event'
                              ? 'border-b-2 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100'
                              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                          }`}
                        >
                          Event
                        </button>
                        <button
                          onClick={() => {
                            setActionSubTab('poll');
                            setPollSubTab('all');
                          }}
                          className={`px-3 py-2 text-xs font-medium transition-colors ${
                            actionSubTab === 'poll'
                              ? 'border-b-2 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100'
                              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                          }`}
                        >
                          Poll
                        </button>
                        <button
                          onClick={() => {
                            setActionSubTab('form');
                            setPollSubTab('all');
                          }}
                          className={`px-3 py-2 text-xs font-medium transition-colors ${
                            actionSubTab === 'form'
                              ? 'border-b-2 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100'
                              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                          }`}
                        >
                          Form
                        </button>
                        <button
                          onClick={() => {
                            setActionSubTab('job');
                            setPollSubTab('all');
                          }}
                          className={`px-3 py-2 text-xs font-medium transition-colors ${
                            actionSubTab === 'job'
                              ? 'border-b-2 border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100'
                              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                          }`}
                        >
                          Job
                        </button>
                      </div>
                    </div>
                    
                          

                    {/* Event Analytics */}
                    {actionSubTab === 'event' && (
                      <div className="space-y-4">
                        {/* Event Overview */}
                        <div className="space-y-2">
                          <h4 className="text-xs text-zinc-400 dark:text-zinc-600">Event Overview</h4>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded text-center">
                              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">35</div>
                              <div className="text-xs text-zinc-500 dark:text-zinc-500">Total RSVPs</div>
                            </div>
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-center">
                              <div className="text-sm font-medium text-green-600 dark:text-green-400">24</div>
                              <div className="text-xs text-green-600 dark:text-green-400">Going</div>
                            </div>
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-center">
                              <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Dec 15</div>
                              <div className="text-xs text-blue-600 dark:text-blue-400">Event Date</div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs text-zinc-400 dark:text-zinc-600">Attendee List</h4>
                            <div className="flex items-center gap-1">
                              <button className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                                <Search className="w-3 h-3" />
                              </button>
                              <button className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                                <Download className="w-3 h-3" />
                                Export
                              </button>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="border border-zinc-200 dark:border-zinc-700 rounded">
                              <div 
                                className="flex items-center justify-between py-1 px-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                onClick={() => toggleExpanded('attendee-sarah')}
                              >
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">Sarah Johnson</span>
                                  <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${expandedItems['attendee-sarah'] ? 'rotate-180' : ''}`} />
                                </div>
                                <div className="flex items-center gap-1">
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Eye className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                </div>
                              </div>
                              {expandedItems['attendee-sarah'] && (
                                <div className="px-3 pb-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-25 dark:bg-zinc-900/25">
                                  <div className="space-y-2 pt-2">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div className="flex items-center gap-1">
                                        <Mail className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">sarah.j@company.com</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Phone className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">+1 234 567 8900</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">San Francisco, CA</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">RSVP: Going</span>
                                      </div>
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                      <span className="font-medium">Note:</span> Product Manager at Tech Corp. Interested in AI/ML features.
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="border border-zinc-200 dark:border-zinc-700 rounded">
                              <div 
                                className="flex items-center justify-between py-1 px-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                onClick={() => toggleExpanded('attendee-mike')}
                              >
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">Mike Chen</span>
                                  <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${expandedItems['attendee-mike'] ? 'rotate-180' : ''}`} />
                                </div>
                                <div className="flex items-center gap-1">
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Eye className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                </div>
                              </div>
                              {expandedItems['attendee-mike'] && (
                                <div className="px-3 pb-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-25 dark:bg-zinc-900/25">
                                  <div className="space-y-2 pt-2">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div className="flex items-center gap-1">
                                        <Mail className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">mike.chen@startup.io</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Phone className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">+1 555 123 4567</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Austin, TX</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">RSVP: Maybe</span>
                                      </div>
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                      <span className="font-medium">Note:</span> Senior Developer. Bringing 2 team members.
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="border border-zinc-200 dark:border-zinc-700 rounded">
                              <div 
                                className="flex items-center justify-between py-1 px-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                onClick={() => toggleExpanded('attendee-emma')}
                              >
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">Emma Wilson</span>
                                  <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${expandedItems['attendee-emma'] ? 'rotate-180' : ''}`} />
                                </div>
                                <div className="flex items-center gap-1">
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Eye className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                </div>
                              </div>
                              {expandedItems['attendee-emma'] && (
                                <div className="px-3 pb-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-25 dark:bg-zinc-900/25">
                                  <div className="space-y-2 pt-2">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div className="flex items-center gap-1">
                                        <Mail className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">emma.wilson@design.co</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Phone className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">+1 678 901 2345</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Seattle, WA</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">RSVP: Going</span>
                                      </div>
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                      <span className="font-medium">Note:</span> UX Designer. Excited about design system updates.
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Poll Analytics */}
                    {actionSubTab === 'poll' && (
                      <div className="space-y-4">
                        {/* Poll Overview */}
                        <div className="space-y-2">
                          <h4 className="text-xs text-zinc-400 dark:text-zinc-600">Poll Overview</h4>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded text-center">
                              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">156</div>
                              <div className="text-xs text-zinc-500 dark:text-zinc-500">Total Votes</div>
                            </div>
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-center">
                              <div className="text-sm font-medium text-blue-600 dark:text-blue-400">89</div>
                              <div className="text-xs text-blue-600 dark:text-blue-400">Leading Option</div>
                            </div>
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-center">
                              <div className="text-sm font-medium text-green-600 dark:text-green-400">2h</div>
                              <div className="text-xs text-green-600 dark:text-green-400">Time Left</div>
                            </div>
                          </div>
                        </div>

                        {/* Poll Details */}
                        <div className="space-y-2">
                          <h4 className="text-xs text-zinc-400 dark:text-zinc-600">Poll Details</h4>
                          <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded border border-zinc-200 dark:border-zinc-700">
                            <div className="space-y-2">
                              <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium">What do you think about the new feature?</p>
                              
                              {/* Poll Options */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-700">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="text-xs text-zinc-700 dark:text-zinc-300">Yes, I agree</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">89 votes</span>
                                    <div className="w-12 bg-zinc-200 dark:bg-zinc-700 rounded-full h-1">
                                      <div className="bg-blue-500 h-1 rounded-full" style={{ width: '57%' }}></div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-2 bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-700">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    <span className="text-xs text-zinc-700 dark:text-zinc-300">No, I disagree</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">45 votes</span>
                                    <div className="w-12 bg-zinc-200 dark:bg-zinc-700 rounded-full h-1">
                                      <div className="bg-red-500 h-1 rounded-full" style={{ width: '29%' }}></div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-2 bg-white dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-700">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    <span className="text-xs text-zinc-700 dark:text-zinc-300">Maybe</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400">22 votes</span>
                                    <div className="w-12 bg-zinc-200 dark:bg-zinc-700 rounded-full h-1">
                                      <div className="bg-yellow-500 h-1 rounded-full" style={{ width: '14%' }}></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Poll Breakdown */}
                        <div className="space-y-2">
                          <h4 className="text-xs text-zinc-400 dark:text-zinc-600">Poll Breakdown</h4>
                          <div className="flex flex-wrap gap-1.5">
                            <button
                              onClick={() => setPollSubTab('all')}
                              className={`px-2 py-1 rounded-full text-xs transition-colors ${
                                pollSubTab === 'all'
                                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                              }`}
                            >
                              All 156
                            </button>
                            <button
                              onClick={() => setPollSubTab('optionA')}
                              className={`px-2 py-1 rounded-full text-xs transition-colors ${
                                pollSubTab === 'optionA'
                                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                              }`}
                            >
                              A (89)
                            </button>
                            <button
                              onClick={() => setPollSubTab('optionB')}
                              className={`px-2 py-1 rounded-full text-xs transition-colors ${
                                pollSubTab === 'optionB'
                                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                              }`}
                            >
                              B (45)
                            </button>
                            <button
                              onClick={() => setPollSubTab('optionC')}
                              className={`px-2 py-1 rounded-full text-xs transition-colors ${
                                pollSubTab === 'optionC'
                                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                              }`}
                            >
                              C (22)
                            </button>
                          </div>
                        </div>

                        {pollSubTab === 'all' && (
                                                  <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs text-zinc-400 dark:text-zinc-600">Recent Voters</h4>
                            <div className="flex items-center gap-1">
                              <button className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                                <Search className="w-3 h-3" />
                              </button>
                              <button className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                                <Download className="w-3 h-3" />
                                Export
                              </button>
                            </div>
                          </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">Sarah Johnson</span>
                                </div>
                                <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">Option A</span>
                              </div>
                              <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">Mike Chen</span>
                                </div>
                                <span className="text-xs px-1.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded">Option B</span>
                              </div>
                              <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">Emma Wilson</span>
                                </div>
                                <span className="text-xs px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">Option A</span>
                              </div>
                              <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">James Park</span>
                                </div>
                                <span className="text-xs px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded">Option C</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {pollSubTab === 'optionA' && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs text-zinc-400 dark:text-zinc-600">Option A: "Yes, I agree" - 89 voters</h4>
                              <div className="flex items-center gap-1">
                                <button className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                                  <Search className="w-3 h-3" />
                                </button>
                                <button className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                                  <Download className="w-3 h-3" />
                                  Export
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">Sarah Johnson</span>
                                </div>
                                <span className="text-xs text-zinc-400">2h ago</span>
                              </div>
                              <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">Emma Wilson</span>
                                </div>
                                <span className="text-xs text-zinc-400">4h ago</span>
                              </div>
                              <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">David Kim</span>
                                </div>
                                <span className="text-xs text-zinc-400">6h ago</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {pollSubTab === 'optionB' && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs text-zinc-400 dark:text-zinc-600">Option B: "No, I disagree" - 45 voters</h4>
                              <div className="flex items-center gap-1">
                                <button className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                                  <Search className="w-3 h-3" />
                                </button>
                                <button className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                                  <Download className="w-3 h-3" />
                                  Export
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">Mike Chen</span>
                                </div>
                                <span className="text-xs text-zinc-400">3h ago</span>
                              </div>
                              <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">Maria Garcia</span>
                                </div>
                                <span className="text-xs text-zinc-400">5h ago</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {pollSubTab === 'optionC' && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs text-zinc-400 dark:text-zinc-600">Option C: "Maybe" - 22 voters</h4>
                              <div className="flex items-center gap-1">
                                <button className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                                  <Search className="w-3 h-3" />
                                </button>
                                <button className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                                  <Download className="w-3 h-3" />
                                  Export
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">James Park</span>
                                </div>
                                <span className="text-xs text-zinc-400">1h ago</span>
                              </div>
                              <div className="flex items-center justify-between py-1 px-2 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">Lisa Rodriguez</span>
                                </div>
                                <span className="text-xs text-zinc-400">7h ago</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Form Analytics */}
                    {actionSubTab === 'form' && (
                      <div className="space-y-4">
                        {/* Form Overview */}
                        <div className="space-y-2">
                          <h4 className="text-xs text-zinc-400 dark:text-zinc-600">Form Overview</h4>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded text-center">
                              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">18</div>
                              <div className="text-xs text-zinc-500 dark:text-zinc-500">Total Views</div>
                            </div>
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-center">
                              <div className="text-sm font-medium text-green-600 dark:text-green-400">16</div>
                              <div className="text-xs text-green-600 dark:text-green-400">Submitted</div>
                            </div>
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-center">
                              <div className="text-sm font-medium text-blue-600 dark:text-blue-400">89%</div>
                              <div className="text-xs text-blue-600 dark:text-blue-400">Completion</div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs text-zinc-400 dark:text-zinc-600">Recent Submissions</h4>
                            <div className="flex items-center gap-1">
                              <button className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                                <Search className="w-3 h-3" />
                              </button>
                              <button className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                                <Download className="w-3 h-3" />
                                Export
                              </button>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="border border-zinc-200 dark:border-zinc-700 rounded">
                              <div 
                                className="flex items-center justify-between py-1 px-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                onClick={() => toggleExpanded('form-sarah')}
                              >
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">Sarah Johnson</span>
                                  <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${expandedItems['form-sarah'] ? 'rotate-180' : ''}`} />
                                </div>
                                <div className="flex items-center gap-1">
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Eye className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                </div>
                              </div>
                              {expandedItems['form-sarah'] && (
                                <div className="px-3 pb-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-25 dark:bg-zinc-900/25">
                                  <div className="space-y-2 pt-2">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div className="flex items-center gap-1">
                                        <Mail className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">sarah.j@company.com</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Submitted: 2h ago</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <FileText className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Form: Contact Form</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <User className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Status: Submitted</span>
                                      </div>
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                      <span className="font-medium">Message:</span> "I'm interested in learning more about your services and would like to schedule a demo."
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="border border-zinc-200 dark:border-zinc-700 rounded">
                              <div 
                                className="flex items-center justify-between py-1 px-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                onClick={() => toggleExpanded('form-mike')}
                              >
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">Mike Chen</span>
                                  <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${expandedItems['form-mike'] ? 'rotate-180' : ''}`} />
                                </div>
                                <div className="flex items-center gap-1">
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Eye className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                </div>
                              </div>
                              {expandedItems['form-mike'] && (
                                <div className="px-3 pb-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-25 dark:bg-zinc-900/25">
                                  <div className="space-y-2 pt-2">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div className="flex items-center gap-1">
                                        <Mail className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">mike.chen@startup.io</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Submitted: 4h ago</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <FileText className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Form: Feedback Form</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <User className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Status: Submitted</span>
                                      </div>
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                      <span className="font-medium">Message:</span> "Great product! Would love to see integration with third-party tools."
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="border border-zinc-200 dark:border-zinc-700 rounded">
                              <div 
                                className="flex items-center justify-between py-1 px-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                onClick={() => toggleExpanded('form-emma')}
                              >
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">Emma Wilson</span>
                                  <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${expandedItems['form-emma'] ? 'rotate-180' : ''}`} />
                                </div>
                                <div className="flex items-center gap-1">
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Eye className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                </div>
                              </div>
                              {expandedItems['form-emma'] && (
                                <div className="px-3 pb-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-25 dark:bg-zinc-900/25">
                                  <div className="space-y-2 pt-2">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div className="flex items-center gap-1">
                                        <Mail className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">emma.wilson@design.co</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Submitted: 6h ago</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <FileText className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Form: Newsletter Signup</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <User className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Status: Submitted</span>
                                      </div>
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                      <span className="font-medium">Interests:</span> Design Systems, UI/UX, Frontend Development
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Job Analytics */}
                    {actionSubTab === 'job' && (
                      <div className="space-y-4">
                        {/* Job Overview */}
                        <div className="space-y-2">
                          <h4 className="text-xs text-zinc-400 dark:text-zinc-600">Job Overview</h4>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded text-center">
                              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">42</div>
                              <div className="text-xs text-zinc-500 dark:text-zinc-500">Applications</div>
                            </div>
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded text-center">
                              <div className="text-sm font-medium text-green-600 dark:text-green-400">38</div>
                              <div className="text-xs text-green-600 dark:text-green-400">With Resume</div>
                            </div>
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-center">
                              <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Jan 15</div>
                              <div className="text-xs text-blue-600 dark:text-blue-400">Deadline</div>
                            </div>
                          </div>
                        </div>

                        {/* Job Breakdown */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs text-zinc-400 dark:text-zinc-600">Recent Applications</h4>
                            <div className="flex items-center gap-1">
                              <button className="p-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                                <Search className="w-3 h-3" />
                              </button>
                              <button className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded">
                                <Download className="w-3 h-3" />
                                Export
                              </button>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="border border-zinc-200 dark:border-zinc-700 rounded">
                              <div 
                                className="flex items-center justify-between py-1 px-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                onClick={() => toggleExpanded('job-sarah')}
                              >
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">Sarah Johnson</span>
                                  <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${expandedItems['job-sarah'] ? 'rotate-180' : ''}`} />
                                </div>
                                <div className="flex items-center gap-1">
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Eye className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                </div>
                              </div>
                              {expandedItems['job-sarah'] && (
                                <div className="px-3 pb-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-25 dark:bg-zinc-900/25">
                                  <div className="space-y-2 pt-2">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div className="flex items-center gap-1">
                                        <Mail className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">sarah.j@company.com</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Applied: 1d ago</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <FileText className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Resume: Attached</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <User className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Status: Under Review</span>
                                      </div>
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                      <span className="font-medium">Experience:</span> 5+ years in Product Management. Led teams of 10+ people. Expert in Agile methodologies.
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="border border-zinc-200 dark:border-zinc-700 rounded">
                              <div 
                                className="flex items-center justify-between py-1 px-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                onClick={() => toggleExpanded('job-mike')}
                              >
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">Mike Chen</span>
                                  <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${expandedItems['job-mike'] ? 'rotate-180' : ''}`} />
                                </div>
                                <div className="flex items-center gap-1">
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Eye className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                </div>
                              </div>
                              {expandedItems['job-mike'] && (
                                <div className="px-3 pb-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-25 dark:bg-zinc-900/25">
                                  <div className="space-y-2 pt-2">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div className="flex items-center gap-1">
                                        <Mail className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">mike.chen@startup.io</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Applied: 2d ago</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <FileText className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Resume: Attached</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <User className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Status: Interview Scheduled</span>
                                      </div>
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                      <span className="font-medium">Experience:</span> Senior Full-Stack Developer. React, Node.js, AWS. 7+ years experience.
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="border border-zinc-200 dark:border-zinc-700 rounded">
                              <div 
                                className="flex items-center justify-between py-1 px-2 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                onClick={() => toggleExpanded('job-emma')}
                              >
                                <div className="flex items-center gap-2">
                                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop&crop=face" alt="User" className="w-4 h-4 rounded-full" />
                                  <span className="text-xs text-zinc-700 dark:text-zinc-300">Emma Wilson</span>
                                  <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform ${expandedItems['job-emma'] ? 'rotate-180' : ''}`} />
                                </div>
                                <div className="flex items-center gap-1">
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Eye className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                  <button 
                                    className="p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <MoreHorizontal className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                                  </button>
                                </div>
                              </div>
                              {expandedItems['job-emma'] && (
                                <div className="px-3 pb-2 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-25 dark:bg-zinc-900/25">
                                  <div className="space-y-2 pt-2">
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div className="flex items-center gap-1">
                                        <Mail className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">emma.wilson@design.co</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Applied: 3d ago</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <FileText className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Portfolio: Attached</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <User className="w-3 h-3 text-zinc-400" />
                                        <span className="text-zinc-500">Status: Final Review</span>
                                      </div>
                                    </div>
                                    <div className="text-xs text-zinc-500">
                                      <span className="font-medium">Experience:</span> Senior UX Designer. Specialized in design systems and user research. 6+ years experience.
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }